// Le contrat de la session persistée. Ce qui est vérifié ici n'est pas le
// stockage — c'est la garde : une session écrite par une version antérieure ne
// doit pas se recharger en silence avec des réponses perdues et un profil visé
// plus haut qu'à l'enregistrement.
//
// `localStorage` n'existe pas sous Node : on lui substitue une table en mémoire.
// Le module lit `window` à chaque appel, jamais à l'import, si bien qu'il suffit
// de poser la doublure avant d'appeler.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { OUT_OF_SCOPE } from '../src/domain/scoring.js'
import { SCREENS } from '../src/domain/navigation.js'
import { loadSession } from '../src/composables/useSessionStorage.js'

const STORAGE_KEY = 'maia.session'

let store

function fakeStorage() {
  const data = new Map()
  return {
    data,
    getItem: key => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: key => data.delete(key)
  }
}

function write(payload) {
  store.setItem(STORAGE_KEY, JSON.stringify(payload))
}

beforeEach(() => {
  store = fakeStorage()
  vi.stubGlobal('window', { localStorage: store })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('contrat de schéma', () => {
  it('rejette et efface une session de schéma 1', () => {
    // Une v1 portait `checked` — des pratiques validées — et `indicators`. Un
    // état de cases cochées ne se convertit pas en niveau : il n'y a pas de
    // migration, la session est jetée.
    write({ v: 1, state: { screen: 'tool2', checked: { 'A1-0-0': true }, form: { size: 'm' } } })
    expect(loadSession(SCREENS)).toBeNull()
    expect(store.getItem(STORAGE_KEY)).toBeNull()
  })

  it('rejette une session sans version', () => {
    write({ state: { screen: 'tool2' } })
    expect(loadSession(SCREENS)).toBeNull()
  })

  it('accepte une session de schéma 2', () => {
    write({ v: 2, state: { screen: 'tool2', answers: { A1: 3 } } })
    expect(loadSession(SCREENS)).toMatchObject({ screen: 'tool2', answers: { A1: 3 } })
  })

  it('repart d’une session vierge sur un contenu illisible, sans planter', () => {
    store.setItem(STORAGE_KEY, '{ ceci n’est pas du JSON')
    expect(loadSession(SCREENS)).toBeNull()
    expect(store.getItem(STORAGE_KEY)).toBeNull()
  })
})

describe('validation des réponses', () => {
  function answersOf(answers) {
    write({ v: 2, state: { answers } })
    return loadSession(SCREENS).answers
  }

  it('garde un rang de l’échelle et la déclaration de hors périmètre', () => {
    expect(answersOf({ A1: 1, A2: 5, A3: OUT_OF_SCOPE })).toEqual({ A1: 1, A2: 5, A3: OUT_OF_SCOPE })
  })

  it('écarte silencieusement tout le reste', () => {
    expect(answersOf({
      A1: 0, A2: 6, A3: '3', A4: 2.5, A5: null, A6: true, A7: 'nan',
      ZZ9: 3
    })).toEqual({})
  })

  it('écarte un identifiant que le modèle ne connaît pas sans perdre les autres', () => {
    expect(answersOf({ A1: 2, PLUTON: 4 })).toEqual({ A1: 2 })
  })

  it('ne relit ni `checked` ni `indicators`, même dans un payload de schéma 2', () => {
    write({
      v: 2,
      state: { answers: { A1: 2 }, checked: { 'A1-0-0': true }, indicators: { A1: { accountability: 3 } } }
    })
    const restored = loadSession(SCREENS)
    expect(restored.answers).toEqual({ A1: 2 })
    expect(restored.checked).toBeUndefined()
    expect(restored.indicators).toBeUndefined()
  })

  it('écarte un écran inconnu de la machine à écrans', () => {
    write({ v: 2, state: { screen: 'palier', answers: {} } })
    expect(loadSession(SCREENS).screen).toBeUndefined()
  })

  it('écarte un degré de transformation hors échelle', () => {
    write({ v: 2, state: { transformation: 9, answers: {} } })
    expect(loadSession(SCREENS).transformation).toBeUndefined()
  })
})

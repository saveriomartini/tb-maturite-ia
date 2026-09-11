// Le contrat du fichier de session (item 3.11).
//
// Ce qui est vérifié ici n'est pas l'écriture d'un fichier — le navigateur s'en
// charge — mais les deux propriétés dont tout le reste dépend : ce que le
// fichier de partage emporte, et ce qu'un fichier relu a le droit de réinjecter.
//
// La première est une promesse faite à l'utilisateur sur l'écran d'ancrage, et
// le seul endroit où elle peut être tenue est ici : douze attributs de cadrage
// laissés dehors, aucune trace d'usage, aucune chaîne qui ne vienne d'un
// vocabulaire fermé. La seconde est la garde de la reprise : le fichier passe le
// validateur de la session persistée, pas un second qui divergerait.

import { describe, expect, it } from 'vitest'
import { ALL_FIELDS, DESCRIPTIVE_FIELDS } from '../src/data/context-attributes.js'
import { EVALUABLE_AREAS } from '../src/domain/model.js'
import { SCREENS } from '../src/domain/navigation.js'
import { OUT_OF_SCOPE } from '../src/domain/scoring.js'
import { SCHEMA_VERSION } from '../src/domain/session-state.js'
import {
  FORMAT, RESUME, SHARE, buildFile, fileName, measure, parseFile, serialize
} from '../src/domain/session-file.js'

const DAY = new Date(2026, 8, 11)
const AREA_IDS = EVALUABLE_AREAS.map(area => area.id)
const DESCRIPTIVE_IDS = DESCRIPTIVE_FIELDS.map(field => field.id)
const SCORING_IDS = ALL_FIELDS.map(field => field.id)

// Une session plausible : les vingt-huit domaines situés sauf deux — l'un laissé
// sans réponse, l'autre déclaré hors périmètre —, le cadrage rempli avec la
// première option de chaque attribut, et une portée déclarée.
function session(overrides = {}) {
  const answers = {}
  AREA_IDS.forEach((id, index) => {
    if (index === 0) return
    answers[id] = index === 1 ? OUT_OF_SCOPE : ((index % 4) + 2)
  })
  const form = {}
  ALL_FIELDS.concat(DESCRIPTIVE_FIELDS).forEach(field => { form[field.id] = field.opts[1][0] })
  return {
    screen: 'tool4',
    transformation: 4,
    contextWarned: true,
    outOfScopeWarned: true,
    session: 'ab12cd3',
    demo: null,
    answers,
    openLevels: { 3: true },
    form,
    ...overrides
  }
}

function read(kind, state = session(), day = DAY) {
  return JSON.parse(serialize(kind, state, day))
}

describe('l’enveloppe du fichier', () => {
  it('se donne pour ce qu’elle est, et dit sa version de schéma', () => {
    const file = read(RESUME)
    expect(file.format).toBe(FORMAT)
    expect(file.kind).toBe(RESUME)
    expect(file.v).toBe(SCHEMA_VERSION)
    expect(file.tool).toBe('M.A.IA')
    expect(file.date).toBe('2026-09-11')
    expect(file.session).toBe('ab12cd3')
  })

  it('s’ouvre lisible : indentée, et terminée par un retour à la ligne', () => {
    const text = serialize(RESUME, session(), DAY)
    expect(text.endsWith('}\n')).toBe(true)
    expect(text).toContain('\n  "format"')
  })

  it('dit en tête ce qu’elle contient, et ce qu’elle ne peut pas contenir', () => {
    expect(read(RESUME)._lisezmoi).toContain('ni nom, ni adresse, ni aucun texte saisi')
    expect(read(SHARE)._lisezmoi).toContain('ni nom, ni adresse, ni aucun texte saisi')
    expect(read(SHARE)._lisezmoi).toContain('n’envoie')
  })

  it('nomme le fichier par son genre, sa session et son jour', () => {
    expect(fileName(RESUME, 'ab12cd3', DAY)).toBe('maia-reprise-ab12cd3-2026-09-11.json')
    expect(fileName(SHARE, 'ab12cd3', DAY)).toBe('maia-partage-ab12cd3-2026-09-11.json')
    expect(fileName(SHARE, null, DAY)).toBe('maia-partage-session-2026-09-11.json')
  })
})

describe('le fichier de reprise', () => {
  it('porte l’état complet, traces d’usage comprises', () => {
    const { state } = read(RESUME)
    expect(state.screen).toBe('tool4')
    expect(state.openLevels).toEqual({ 3: true })
    expect(state.contextWarned).toBe(true)
    expect(Object.keys(state.form).sort()).toEqual(SCORING_IDS.concat(DESCRIPTIVE_IDS).sort())
  })

  it('ne porte pas de résultat recopié à côté des réponses', () => {
    expect(read(RESUME).measure).toBeUndefined()
  })
})

describe('le fichier de partage', () => {
  it('ne porte que les trois attributs descriptifs', () => {
    const { state } = read(SHARE)
    expect(Object.keys(state.form).sort()).toEqual([...DESCRIPTIVE_IDS].sort())
    expect(state.form.horizon).toBeUndefined()
    expect(state.form.governance).toBeUndefined()
  })

  it('ne porte aucune trace de ce qui a été fait dans l’outil', () => {
    const { state } = read(SHARE)
    expect(state.screen).toBeUndefined()
    expect(state.openLevels).toBeUndefined()
    expect(state.contextWarned).toBeUndefined()
    expect(state.outOfScopeWarned).toBeUndefined()
    expect(state.demo).toBeUndefined()
  })

  it('porte les deux profils et le compte des domaines', () => {
    const state = session()
    const file = read(SHARE, state)
    expect(file.measure).toEqual(measure(state))
    expect(file.measure.reach).toBe(4)
    expect(file.measure.areas).toBe(EVALUABLE_AREAS.length)
    expect(file.measure.pending).toBe(1)
    expect(file.measure.outOfScope).toBe(1)
    expect(file.measure.answered).toBe(EVALUABLE_AREAS.length - 2)
  })

  it('garde le hors périmètre, qui est une réponse et non une absence', () => {
    const { state } = read(SHARE)
    expect(Object.values(state.answers)).toContain(OUT_OF_SCOPE)
  })

  // La propriété que l'écran annonce, vérifiée sur le fichier lui-même : toute
  // chaîne qui s'y trouve vient d'un vocabulaire fermé du modèle. Aucun champ
  // libre n'existe dans le questionnaire, et ce test tombe le jour où l'un
  // d'eux apparaîtrait.
  it('ne peut porter aucune chaîne qui ne vienne d’un vocabulaire fermé', () => {
    const { state } = read(SHARE)
    Object.entries(state.answers).forEach(([areaId, value]) => {
      expect(AREA_IDS).toContain(areaId)
      if (typeof value === 'string') expect(value).toBe(OUT_OF_SCOPE)
      else expect(Number.isInteger(value)).toBe(true)
    })
    Object.entries(state.form).forEach(([fieldId, value]) => {
      const field = DESCRIPTIVE_FIELDS.find(f => f.id === fieldId)
      expect(field).toBeTruthy()
      expect(field.opts.some(opt => opt[0] === value)).toBe(true)
    })
  })
})

describe('ce qui est écarté à l’écriture', () => {
  it('laisse tomber les domaines inconnus et les rangs hors échelle', () => {
    const state = session({ answers: { [AREA_IDS[0]]: 3, inconnu: 4, [AREA_IDS[1]]: 9 } })
    const { state: written } = read(SHARE, state)
    expect(written.answers).toEqual({ [AREA_IDS[0]]: 3 })
  })

  it('laisse tomber une portée hors échelle et un identifiant douteux', () => {
    const file = buildFile(RESUME, session({ transformation: 12, session: 'PAS UN ID' }), DAY)
    expect(file.state.transformation).toBe(12)
    expect(file.session).toBe(null)
    expect(parseFile(JSON.stringify(file), SCREENS).state.transformation).toBeUndefined()
  })
})

describe('la relecture', () => {
  it('rend une session de reprise identique à celle qui l’a écrite', () => {
    const state = session()
    const back = parseFile(serialize(RESUME, state, DAY), SCREENS)
    expect(back.ok).toBe(true)
    expect(back.kind).toBe(RESUME)
    expect(back.state.answers).toEqual(state.answers)
    expect(back.state.form).toEqual(state.form)
    expect(back.state.screen).toBe('tool4')
    expect(back.state.transformation).toBe(4)
  })

  it('rend un fichier de partage sans position de lecture', () => {
    const back = parseFile(serialize(SHARE, session(), DAY), SCREENS)
    expect(back.ok).toBe(true)
    expect(back.kind).toBe(SHARE)
    expect(back.state.screen).toBeUndefined()
    expect(Object.keys(back.state.form).sort()).toEqual([...DESCRIPTIVE_IDS].sort())
  })

  it('refuse ce qui n’est pas du JSON', () => {
    const back = parseFile('{ceci n’est pas du json', SCREENS)
    expect(back.ok).toBe(false)
    expect(back.reason).toBe('unreadable')
    expect(back.message).toBeTruthy()
  })

  it('refuse un fichier qui ne vient pas de l’outil', () => {
    expect(parseFile('{"v":2,"state":{}}', SCREENS).reason).toBe('foreign')
    expect(parseFile('[]', SCREENS).reason).toBe('foreign')
    const file = buildFile(RESUME, session(), DAY)
    expect(parseFile(JSON.stringify({ ...file, kind: 'autre' }), SCREENS).reason).toBe('foreign')
  })

  // Même règle que pour la session persistée : on refuse, on ne convertit pas.
  // Une réponse relue doit valoir ce qu'elle valait à l'enregistrement.
  it('refuse un fichier d’une version antérieure du schéma, sans le convertir', () => {
    const file = buildFile(RESUME, session(), DAY)
    const back = parseFile(JSON.stringify({ ...file, v: SCHEMA_VERSION - 1 }), SCREENS)
    expect(back.ok).toBe(false)
    expect(back.reason).toBe('version')
  })

  it('refuse un fichier qui ne restaurerait rien', () => {
    const empty = buildFile(SHARE, session({ answers: {}, form: {}, transformation: null }), DAY)
    const back = parseFile(JSON.stringify(empty), SCREENS)
    expect(back.ok).toBe(false)
    expect(back.reason).toBe('empty')
  })
})

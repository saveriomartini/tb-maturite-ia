// Un rendu de chaque écran, de bout en bout.
//
// Les autres tests portent sur les règles et sur les view-models ; aucun ne
// touche aux templates. Or c'est là que se logent les régressions les moins
// visibles de ce dépôt : une propriété renommée dans le composable et lue à
// l'ancien nom dans une vue ne casse rien au calcul — elle affiche « undefined »
// dans un coin, ou ne lève qu'à l'exécution, sur l'écran où personne ne passe.
//
// Le rendu se fait côté serveur, avec `vue/server-renderer` que Vue livre déjà :
// pas de navigateur, pas de DOM, aucune dépendance de plus. On ne vérifie pas ce
// qui s'affiche — c'est l'affaire de l'œil — mais que chaque écran se rend, sans
// erreur et sans le moindre avertissement de Vue.
//
// L'état de chaque écran est posé par le stockage local, comme le ferait un
// rechargement : c'est le seul moyen d'entrer dans l'application par un autre
// écran que l'accueil, et cela vérifie au passage que le contrat de session
// relit bien ce que l'outil écrit.

import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App.vue'
import { EVALUABLE_AREAS } from '../src/domain/model.js'
import { SCREENS } from '../src/domain/navigation.js'
import { buildDemoSession } from '../src/domain/demo-session.js'

const STORAGE_KEY = 'maia.session'
let store

function fakeStorage() {
  const data = new Map()
  return {
    getItem: key => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: key => data.delete(key)
  }
}

beforeEach(() => {
  store = fakeStorage()
  vi.stubGlobal('window', { localStorage: store, scrollTo: () => {} })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

async function render(screen, extra) {
  const state = { ...buildDemoSession('rochat'), ...extra, screen }
  store.setItem(STORAGE_KEY, JSON.stringify({ v: 2, state }))

  const warnings = []
  const app = createSSRApp(App)
  app.config.warnHandler = message => warnings.push(message)
  const html = await renderToString(app)
  return { html, warnings }
}

describe('rendu des écrans', () => {
  // Une session remplie : celle d'une démonstration, qui porte des réponses, des
  // domaines hors périmètre et des domaines restés à évaluer — les trois états
  // que les vues doivent savoir afficher.
  it.each(SCREENS)('rend « %s » sur une session remplie', async screen => {
    const { html, warnings } = await render(screen)
    expect(warnings).toEqual([])
    expect(html.length).toBeGreaterThan(0)
  })

  // Une session vierge : aucun domaine renseigné, aucune portée déclarée. C'est
  // le cas où les moyennes n'existent pas et où l'écart n'a rien à nommer — le
  // plus susceptible de faire lire un `null` comme un nombre.
  it.each(['tool', 'tool4', 'export'])('rend « %s » sur une session vierge', async screen => {
    const { html, warnings } = await render(screen, { answers: {}, transformation: null, form: {} })
    expect(warnings).toEqual([])
    expect(html.length).toBeGreaterThan(0)
  })

  // Une session trouée : une dimension entière hors périmètre, une autre entière
  // restée sans réponse. C'est le cas limite du radar — le tracé doit s'y
  // interrompre plutôt que de passer par le centre —, et il ne se produit sur
  // aucune démonstration, dont les neuf dimensions ont toutes au moins un
  // domaine renseigné.
  it('rend les résultats sur une session dont deux dimensions n’ont pas de valeur', async () => {
    const answers = {}
    EVALUABLE_AREAS.forEach(area => { answers[area.id] = 3 })
    // MLOPS entièrement hors périmètre ; Éthique et Gestion du Risque muette.
    ;['A23', 'A24', 'A25'].forEach(id => { answers[id] = 'na' })
    ;['A10', 'A11', 'A12'].forEach(id => { delete answers[id] })

    const { html, warnings } = await render('tool', { answers })
    expect(warnings).toEqual([])
    // Deux axes sans valeur, et chacun dit laquelle des deux absences c'est.
    expect(html).toContain('tous hors périmètre')
    expect(html).toContain('aucun domaine renseigné')
    // Aucune coordonnée n'a été calculée sur une valeur absente.
    expect(html).not.toContain('NaN')
  })
})

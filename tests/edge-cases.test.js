// Cas limites construits — évaluation analytique de la règle d'agrégation.
//
// Ces cas éprouvent la règle sur le modèle livré (28 domaines), et non sur des
// domaines fabriqués comme dans scoring.test.js : la question n'est pas de savoir
// si la fonction calcule juste, mais ce que la règle rend sur des organisations
// typées. Chaque cas fige le profil attendu et, quand il y en a, la limite qu'il
// révèle. Ils servent de démonstration au sens de Peffers et al. (2007) et sont
// repris dans l'article (section Evaluation). Un remaniement du référentiel qui
// changerait un rang déclencheur doit faire échouer ce fichier : c'est voulu.

import { describe, expect, it } from 'vitest'
import { EVALUABLE_AREAS as AREAS } from '../src/domain/model.js'
import {
  OUT_OF_SCOPE as NA, acquiredLevel, blockers, dimAverage, dimFloor, firstGateMeasured,
  inScopeAreas, toAssess
} from '../src/domain/scoring.js'

const everywhere = rank => Object.fromEntries(AREAS.map(area => [area.id, rank]))
const ids = list => list.map(entry => entry.id)
// Domaines attendus au premier palier, et dimension « gestion des modèles » (MLOps).
const FIRST_GATE = AREAS.filter(area => area.level === 1).map(area => area.id)
const MLOPS = ['A23', 'A24', 'A25']

describe('Cas 1 — organisation non adoptante', () => {
  it('le rang 1 partout ne crédite aucun profil, et le premier palier est mesuré', () => {
    const answers = everywhere(1)
    expect(acquiredLevel(AREAS, answers)).toBe(0)
    expect(firstGateMeasured(AREAS, answers)).toBe(true) // « Encore en préparation »
  })

  it('limite : tenir le rang 2 sur les trois domaines du premier palier suffit au profil 1, sans preuve d’usage', () => {
    const answers = { ...everywhere(1), ...Object.fromEntries(FIRST_GATE.map(id => [id, 2])) }
    expect(FIRST_GATE).toEqual(['A6', 'A8', 'A13'])
    expect(acquiredLevel(AREAS, answers)).toBe(1)
  })
})

describe('Cas 2 — organisation consommatrice de services d’IA', () => {
  it('déclarer la gestion des modèles hors périmètre laisse le profil se lire sur 25 domaines', () => {
    const answers = { ...everywhere(3), ...Object.fromEntries(MLOPS.map(id => [id, NA])) }
    expect(inScopeAreas(AREAS, answers)).toHaveLength(25)
    expect(acquiredLevel(AREAS, answers)).toBe(3)
  })

  it('limite : les mêmes pratiques, répondues au rang 1 au lieu d’être exclues, rendent deux profils de moins', () => {
    const answers = { ...everywhere(3), ...Object.fromEntries(MLOPS.map(id => [id, 1])) }
    expect(acquiredLevel(AREAS, answers)).toBe(1)
    expect(ids(blockers(AREAS, answers, 2))).toEqual(['A23', 'A24'])
  })
})

describe('Cas 3 — forte partout sauf un domaine', () => {
  it('un seul domaine du premier palier au rang 1 retient tout, quel que soit le reste', () => {
    const answers = { ...everywhere(5), A6: 1 }
    expect(acquiredLevel(AREAS, answers)).toBe(0)
    expect(ids(blockers(AREAS, answers, 1))).toEqual(['A6'])
    // La lecture par dimension montre ce que le profil tait : plancher 1, moyenne haute.
    expect(dimFloor(AREAS, answers, 'D12')).toBe(1)
    expect(dimAverage(AREAS, answers, 'D12')).toBeGreaterThan(3.5)
  })

  it('le même écart sur le seul domaine du cinquième palier ne coûte qu’un profil', () => {
    const answers = { ...everywhere(5), A4: 4 }
    expect(acquiredLevel(AREAS, answers)).toBe(4)
    expect(ids(blockers(AREAS, answers, 5))).toEqual(['A4'])
  })
})

describe('Cas 4 — périmètre réduit par la déclaration hors périmètre', () => {
  it('un premier palier entièrement exclu n’est pas crédité, mais n’empêche pas la montée', () => {
    const answers = { ...everywhere(2), ...Object.fromEntries(FIRST_GATE.map(id => [id, NA])) }
    expect(acquiredLevel(AREAS, answers)).toBe(2)
  })

  it('tout déclarer hors périmètre ne rend aucun profil', () => {
    expect(acquiredLevel(AREAS, everywhere(NA))).toBe(0)
  })
})

describe('Cas 5 — domaine laissé sans réponse', () => {
  it('retient le palier, et figure parmi les domaines à évaluer', () => {
    const answers = everywhere(3)
    delete answers.A21
    expect(acquiredLevel(AREAS, answers)).toBe(2)
    expect(ids(toAssess(AREAS, answers))).toEqual(['A21'])
  })
})

// Tableau 5 de l'article (section Evaluation) : les six cas construits, figés tels
// qu'ils sont publiés. Toute divergence entre ce bloc et le tableau doit être
// corrigée des deux côtés.
describe('Article, tableau 5 — cas construits', () => {
  it('trois domaines exactement sont requis au premier profil', () => {
    expect(FIRST_GATE).toHaveLength(3)
  })

  it('cas 1 : rang 1 dans les 28 domaines, aucun profil', () => {
    expect(acquiredLevel(AREAS, everywhere(1))).toBe(0)
  })

  it('cas 2 : rang 2 dans A6, A8, A13, rang 1 ailleurs, profil 1', () => {
    const answers = { ...everywhere(1), A6: 2, A8: 2, A13: 2 }
    expect(acquiredLevel(AREAS, answers)).toBe(1)
  })

  it('cas 3 : rang 5 partout, A6 au rang 1, aucun profil ; D12 plancher 1, moyenne 3,67', () => {
    const answers = { ...everywhere(5), A6: 1 }
    expect(acquiredLevel(AREAS, answers)).toBe(0)
    expect(dimFloor(AREAS, answers, 'D12')).toBe(1)
    expect(dimAverage(AREAS, answers, 'D12')).toBeCloseTo(3.67, 2)
  })

  it('cas 4 : rang 3 sur 25 domaines, gestion des modèles hors périmètre, profil 3', () => {
    const answers = { ...everywhere(3), ...Object.fromEntries(MLOPS.map(id => [id, NA])) }
    expect(inScopeAreas(AREAS, answers)).toHaveLength(25)
    expect(acquiredLevel(AREAS, answers)).toBe(3)
  })

  it('cas 4b : les mêmes domaines répondus au rang 1, profil 1', () => {
    const answers = { ...everywhere(3), ...Object.fromEntries(MLOPS.map(id => [id, 1])) }
    expect(acquiredLevel(AREAS, answers)).toBe(1)
  })

  it('cas 5 : rang 3 partout, A2 sans réponse, profil 2', () => {
    const answers = everywhere(3)
    delete answers.A2
    expect(acquiredLevel(AREAS, answers)).toBe(2)
    expect(ids(toAssess(AREAS, answers))).toEqual(['A2'])
  })
})

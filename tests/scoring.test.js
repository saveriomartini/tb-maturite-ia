// Le calcul est le cœur défendable du travail : c'est lui que la soutenance
// interrogera en premier, et il n'avait jusqu'ici aucun filet. Ces tests portent
// sur les règles, pas sur l'affichage — ils n'ont besoin ni de navigateur ni de
// Vue.
//
// Les domaines sont fabriqués à la main plutôt que tirés du modèle : un test qui
// lit `model-data.json` mesure le modèle autant que la règle, et changerait de
// verdict au premier remaniement du référentiel. Deux exceptions à la fin du
// fichier, explicitement adossées au modèle réel — elles vérifient que la règle
// tient sur les 28 domaines livrés.

import { describe, expect, it } from 'vitest'
import {
  CREDITED_FLOOR, OUT_OF_SCOPE, acquiredLevel, areaLevel, blockers, blockersByGate, dimAverage,
  dimFloor, firstGateMeasured, gateFloor, gateProgress, inScopeAreas, isOutOfScope, toAssess
} from '../src/domain/scoring.js'
import { EVALUABLE_AREAS } from '../src/domain/model.js'

// Un domaine minimal : ce que le calcul lit d'un domaine, et rien d'autre.
function area(id, level, dimId = 'D1') {
  return { id, level, dimId, name: `Domaine ${id}`, dim: 'Dimension', dimColor: '#fff' }
}

// Trois domaines au premier rang, trois au deuxième, deux au troisième : assez
// pour faire jouer le maillon faible sans que le jeu devienne illisible.
const AREAS = [
  area('A1', 1), area('A2', 1), area('A3', 1),
  area('A4', 2), area('A5', 2), area('A6', 2),
  area('A7', 3), area('A8', 3)
]

describe('areaLevel et isOutOfScope', () => {
  it('rend 0 pour un domaine non renseigné, le rang sinon', () => {
    expect(areaLevel('A1', {})).toBe(0)
    expect(areaLevel('A1', { A1: 3 })).toBe(3)
  })

  it('ne rend pas de niveau pour un domaine hors périmètre : c’est isOutOfScope qui le dit', () => {
    const answers = { A1: OUT_OF_SCOPE }
    expect(areaLevel('A1', answers)).toBe(0)
    expect(isOutOfScope('A1', answers)).toBe(true)
    expect(isOutOfScope('A2', answers)).toBe(false)
  })

  it('écarte une valeur hors échelle plutôt que de la comparer à un rang', () => {
    expect(areaLevel('A1', { A1: 0 })).toBe(0)
    expect(areaLevel('A1', { A1: 6 })).toBe(0)
    expect(areaLevel('A1', { A1: 2.5 })).toBe(0)
    expect(areaLevel('A1', { A1: '3' })).toBe(0)
  })
})

describe('acquiredLevel — le maillon faible fixe le palier', () => {
  it('un seul domaine sous le rang retient tout le palier', () => {
    const answers = { A1: 3, A2: 3, A3: 3, A4: 3, A5: 3, A6: 3, A7: 2, A8: 3 }
    // A7 est attendu au troisième palier et n'est qu'au niveau 2 : le palier 3
    // tombe, et le palier 2 est le dernier tenu.
    expect(acquiredLevel(AREAS, answers)).toBe(2)
  })

  it('aucune compensation : un domaine au-dessus n’en rachète pas un en dessous', () => {
    const haut = { A1: 5, A2: 5, A3: 2, A4: 5, A5: 5, A6: 5, A7: 5, A8: 5 }
    const plat = { A1: 2, A2: 2, A3: 2, A4: 2, A5: 2, A6: 2, A7: 2, A8: 2 }
    expect(acquiredLevel(AREAS, haut)).toBe(acquiredLevel(AREAS, plat))
    expect(acquiredLevel(AREAS, haut)).toBe(2)
  })

  it('monte jusqu’au dernier palier dont tous les domaines attendus sont au rang', () => {
    const answers = { A1: 3, A2: 3, A3: 3, A4: 3, A5: 3, A6: 3, A7: 3, A8: 3 }
    expect(acquiredLevel(AREAS, answers)).toBe(3)
  })

  it('un domaine non renseigné retient le palier comme un domaine sous le rang', () => {
    const answers = { A1: 2, A2: 2, A4: 2, A5: 2, A6: 2 }
    expect(acquiredLevel(AREAS, answers)).toBe(0)
  })

  it('`target` borne la montée sans la fausser', () => {
    const answers = { A1: 3, A2: 3, A3: 3, A4: 3, A5: 3, A6: 3, A7: 3, A8: 3 }
    expect(acquiredLevel(AREAS, answers, 2)).toBe(2)
    expect(acquiredLevel(AREAS, answers)).toBe(3)
  })
})

describe('le plancher du premier palier', () => {
  // Décision du 08.09.2026 (docs/logs/DECISIONS.md). L'énoncé de rang 1 décrit
  // l'absence : le créditer ferait du premier palier la contrepartie d'un
  // questionnaire rempli. Le palier 1 exige donc le niveau 2, l'existence
  // désignée, sur les domaines qu'il attend. Ces tests fixent la règle : qui les
  // renversera renversera la décision, pas un bogue.
  it('gateFloor vaut 2 au premier palier et le numéro du palier au-dessus', () => {
    expect(gateFloor(1)).toBe(CREDITED_FLOOR)
    expect(gateFloor(1)).toBe(2)
    for (let level = 2; level <= 5; level++) expect(gateFloor(level)).toBe(level)
  })

  it('une session entièrement au niveau 1 n’acquiert aucun palier', () => {
    const answers = Object.fromEntries(AREAS.map(entry => [entry.id, 1]))
    expect(acquiredLevel(AREAS, answers)).toBe(0)
  })

  it('le premier palier est acquis dès que ses domaines atteignent le niveau 2', () => {
    const answers = { A1: 2, A2: 2, A3: 2, A4: 1, A5: 1, A6: 1, A7: 1, A8: 1 }
    // Les trois domaines du premier rang y sont ; ceux du deuxième rang, restés
    // au niveau 1, retiennent le palier 2.
    expect(acquiredLevel(AREAS, answers)).toBe(1)
  })

  it('nomme les domaines restés au niveau 1 et l’énoncé de rang 2 qu’il faudrait tenir', () => {
    // Sur le modèle livré : l'énoncé rapporté au premier palier est celui du
    // rang 2, et non celui du rang 1 auquel le domaine se trouve.
    const reel = EVALUABLE_AREAS.filter(entry => entry.level === 1)
    const answers = Object.fromEntries(reel.map(entry => [entry.id, 1]))
    const [entry] = blockers(reel, answers, 1)
    expect(blockers(reel, answers, 1)).toHaveLength(reel.length)
    expect(entry.level).toBe(1)
    expect(entry.statement).toBe(blockers(reel, answers, 2)[0].statement)
  })

  it('le niveau 1 ne compte pas dans l’avancement du premier palier', () => {
    const answers = Object.fromEntries(AREAS.map(entry => [entry.id, 1]))
    const { done, expected } = gateProgress(AREAS, answers, 1)
    expect(done).toBe(0)
    expect(expected).toBe(3)
  })
})

describe('hors périmètre', () => {
  it('sort du calcul : un domaine hors périmètre ne retient aucun palier', () => {
    const answers = { A1: 2, A2: 2, A3: OUT_OF_SCOPE, A4: 2, A5: 2, A6: 2 }
    // A3 aurait retenu le palier 1 s'il avait compté ; A7 et A8 restent muets,
    // ce qui borne le résultat au palier 2.
    expect(acquiredLevel(AREAS, answers)).toBe(2)
  })

  it('ne fait baisser aucun palier : le déclarer ne peut que laisser le palier ou le monter', () => {
    // Cas construit : un domaine du deuxième rang reste au niveau 1 et retient
    // le palier 2. Le déclarer hors périmètre le retire du calcul — le palier
    // monte, il ne descend pas.
    const avant = { A1: 2, A2: 2, A3: 2, A4: 2, A5: 2, A6: 1, A7: 2, A8: 2 }
    const apres = { ...avant, A6: OUT_OF_SCOPE }
    expect(acquiredLevel(AREAS, avant)).toBe(1)
    expect(acquiredLevel(AREAS, apres)).toBe(2)
    expect(acquiredLevel(AREAS, apres)).toBeGreaterThanOrEqual(acquiredLevel(AREAS, avant))
  })

  it('n’est jamais compté comme manquant', () => {
    const answers = { A1: 1, A2: 1, A3: OUT_OF_SCOPE, A4: 1, A5: 1, A6: 1, A7: 1, A8: 1 }
    expect(blockers(AREAS, answers, 2).map(entry => entry.id)).not.toContain('A3')
    expect(toAssess(AREAS, answers).map(entry => entry.id)).not.toContain('A3')
    expect(inScopeAreas(AREAS, answers)).toHaveLength(AREAS.length - 1)
  })

  it('tous les domaines hors périmètre : le palier vaut 0 et non un acquis gratuit', () => {
    // Sans la garde sur le périmètre vide, `[].every()` vaut true et la boucle
    // créditerait les cinq paliers sans qu'une seule réponse ait été donnée.
    const answers = Object.fromEntries(AREAS.map(entry => [entry.id, OUT_OF_SCOPE]))
    expect(inScopeAreas(AREAS, answers)).toHaveLength(0)
    expect(acquiredLevel(AREAS, answers)).toBe(0)
    expect(blockers(AREAS, answers, 3)).toHaveLength(0)
    expect(blockersByGate(AREAS, answers, 3)).toHaveLength(0)
  })

  it('un palier sans domaine attendu n’interrompt pas la montée', () => {
    // Périmètre dont les domaines commencent au deuxième rang : le premier
    // palier n'attend personne, et le second doit rester atteignable.
    const hauts = [area('B1', 2), area('B2', 2)]
    expect(acquiredLevel(hauts, { B1: 2, B2: 2 })).toBe(2)
  })
})

describe('blockers — tri et contenu', () => {
  it('trie par rang déclencheur croissant, puis par l’ordre du questionnaire', () => {
    const answers = { A1: 1, A2: 1, A3: 1, A4: 1, A5: 1, A6: 1, A7: 1, A8: 1 }
    expect(blockers(AREAS, answers, 3).map(entry => entry.id))
      .toEqual(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'])
  })

  it('ne trie jamais par le retard constaté', () => {
    // A1 est au niveau 1 (trois rangs de retard), A3 au niveau 3 (un seul). Un
    // tri au retard mettrait A3 en tête ; l'ordre attendu reste celui du modèle.
    const answers = { A1: 1, A2: 2, A3: 3, A4: 1, A5: 1, A6: 1, A7: 1, A8: 1 }
    expect(blockers(AREAS, answers, 4).map(entry => entry.id))
      .toEqual(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'])
  })

  it('ne retient que les domaines du rang concerné ou d’en dessous', () => {
    // Les trois domaines du premier rang retiennent le premier palier : A1 sans
    // réponse, A2 et A3 au niveau 1, sous le plancher que ce palier exige. Les
    // domaines des rangs 2 et 3 n'y sont pas attendus et n'y figurent donc pas,
    // bien qu'ils soient eux aussi au niveau 1.
    const answers = { A2: 1, A3: 1, A4: 1, A5: 1, A6: 1, A7: 1, A8: 1 }
    expect(blockers(AREAS, answers, 1).map(entry => entry.id)).toEqual(['A1', 'A2', 'A3'])
    expect(blockers(AREAS, answers, 2).map(entry => entry.id))
      .toEqual(['A1', 'A2', 'A3', 'A4', 'A5', 'A6'])
  })

  it('porte de quoi afficher l’écart, énoncé du rang visé compris', () => {
    // A1 existe dans le modèle réel : on vérifie sur lui que l'énoncé rapporté
    // est bien celui du rang visé, et non celui du rang du domaine.
    const reel = EVALUABLE_AREAS.filter(entry => entry.id === 'A1')
    const [entry] = blockers(reel, { A1: 1 }, 2)
    expect(entry).toMatchObject({ id: 'A1', required: 2, level: 1 })
    expect(entry.name).toBeTruthy()
    expect(entry.statement).toBeTruthy()
    expect(entry.statement).not.toBe(blockers(reel, { A1: 1 }, 3)[0].statement)
  })
})

describe('blockersByGate — groupement par palier intermédiaire', () => {
  it('groupe du palier suivant à la cible incluse', () => {
    const answers = { A1: 1, A2: 1, A3: 1, A4: 1, A5: 1, A6: 1, A7: 1, A8: 1 }
    const groups = blockersByGate(AREAS, answers, 3)
    // Le premier palier forme un groupe : au niveau 1, les domaines du premier
    // rang n'atteignent pas le plancher qu'il exige.
    expect(groups.map(group => group.level)).toEqual([1, 2, 3])
  })

  it('ne nomme un domaine que dans le premier groupe qui le réclame', () => {
    const answers = { A1: 1, A2: 1, A3: 1, A4: 1, A5: 1, A6: 1, A7: 1, A8: 1 }
    const groups = blockersByGate(AREAS, answers, 3)
    expect(groups[0].areas.map(entry => entry.id)).toEqual(['A1', 'A2', 'A3'])
    expect(groups[1].areas.map(entry => entry.id)).toEqual(['A4', 'A5', 'A6'])
    expect(groups[2].areas.map(entry => entry.id)).toEqual(['A7', 'A8'])
    const cited = groups.flatMap(group => group.areas.map(entry => entry.id))
    expect(new Set(cited).size).toBe(cited.length)
  })

  it('ne rend aucun groupe quand la cible est tenue ou dépassée', () => {
    const answers = { A1: 3, A2: 3, A3: 3, A4: 3, A5: 3, A6: 3, A7: 3, A8: 3 }
    expect(blockersByGate(AREAS, answers, 3)).toHaveLength(0)
    expect(blockersByGate(AREAS, answers, 2)).toHaveLength(0)
  })
})

describe('toAssess — l’incomplétude n’est pas un manque', () => {
  it('sépare les domaines à évaluer des domaines qui retiennent un palier', () => {
    // A1 est renseigné trop bas : il retient le palier. A2 n'a pas de réponse :
    // il ne dit rien, et ne doit pas être compté comme un écart.
    const answers = { A1: 1, A3: 2, A4: 2, A5: 2, A6: 2 }
    const bloquants = blockers(AREAS, answers, 2).map(entry => entry.id)
    const aEvaluer = toAssess(AREAS, answers).map(entry => entry.id)

    expect(bloquants).toContain('A1')
    expect(aEvaluer).toContain('A2')
    expect(aEvaluer).not.toContain('A1')
    // Un domaine non renseigné retient bien le palier au sens du calcul — il
    // n'est simplement pas *présenté* comme un écart : les deux listes ne se
    // recouvrent pas.
    expect(aEvaluer.filter(id => bloquants.includes(id) && id !== 'A2')).not.toContain('A1')
  })

  it('ne compte ni les domaines hors périmètre ni les domaines renseignés', () => {
    const answers = { A1: 3, A2: OUT_OF_SCOPE }
    const ids = toAssess(AREAS, answers).map(entry => entry.id)
    expect(ids).not.toContain('A1')
    expect(ids).not.toContain('A2')
    expect(ids).toContain('A3')
  })
})

describe('gateProgress et lectures par dimension', () => {
  it('ne rend jamais un avancement supérieur à son total', () => {
    const answers = { A1: 5, A2: 5, A3: 5, A4: 5, A5: 5, A6: 5, A7: 5, A8: 5 }
    for (let level = 1; level <= 5; level++) {
      const { done, expected } = gateProgress(AREAS, answers, level)
      expect(done).toBeLessThanOrEqual(expected)
    }
  })

  it('compte les domaines attendus au palier, hors périmètre exclus', () => {
    // A3 est hors périmètre : le premier palier n'attend plus que A1 et A2. A2
    // est au niveau 1, sous le plancher du palier, et ne compte pas comme fait.
    const answers = { A1: 2, A2: 1, A3: OUT_OF_SCOPE }
    expect(gateProgress(AREAS, answers, 1)).toEqual({ done: 1, expected: 2 })
    expect(gateProgress(AREAS, { ...answers, A2: 2 }, 1)).toEqual({ done: 2, expected: 2 })
  })

  it('moyenne et plancher ignorent les domaines non renseignés et hors périmètre', () => {
    const dim = [area('C1', 1), area('C2', 1), area('C3', 1), area('C4', 1)]
    const answers = { C1: 2, C2: 4, C3: OUT_OF_SCOPE }
    expect(dimAverage(dim, answers, 'D1')).toBe(3)
    expect(dimFloor(dim, answers, 'D1')).toBe(2)
  })

  it('rendent null plutôt que 0 quand rien n’a été mesuré', () => {
    expect(dimAverage(AREAS, {}, 'D1')).toBeNull()
    expect(dimFloor(AREAS, {}, 'D1')).toBeNull()
  })

  it('la moyenne ne dépasse jamais le haut de l’échelle', () => {
    const answers = Object.fromEntries(AREAS.map(entry => [entry.id, 5]))
    expect(dimAverage(AREAS, answers, 'D1')).toBeLessThanOrEqual(5)
  })
})

describe('sur le modèle livré', () => {
  it('un jeu complet de réponses au rang attendu acquiert le palier correspondant', () => {
    const answers = Object.fromEntries(EVALUABLE_AREAS.map(entry => [entry.id, 3]))
    expect(acquiredLevel(EVALUABLE_AREAS, answers)).toBe(3)
  })

  it('un seul domaine du premier rang laissé sans réponse retient tout', () => {
    const answers = Object.fromEntries(EVALUABLE_AREAS.map(entry => [entry.id, 5]))
    const premier = EVALUABLE_AREAS.find(entry => entry.level === 1)
    delete answers[premier.id]
    expect(acquiredLevel(EVALUABLE_AREAS, answers)).toBe(0)
  })
})

// Le palier 0 a deux causes que rien ne distingue dans `acquiredLevel` : le
// premier rang laissé au niveau 1, et le premier rang pas encore ouvert. La
// restitution, elle, doit les séparer — d'où cette lecture, qui ne dit pas si le
// palier est acquis mais s'il a été mesuré.
describe('firstGateMeasured', () => {
  it('est faux tant qu’un domaine du premier rang n’a pas de réponse', () => {
    expect(firstGateMeasured(AREAS, {})).toBe(false)
    expect(firstGateMeasured(AREAS, { A1: 4, A2: 4 })).toBe(false)
  })

  it('est vrai dès que tous les domaines du premier rang sont situés, fût-ce au plus bas', () => {
    expect(firstGateMeasured(AREAS, { A1: 1, A2: 1, A3: 1 })).toBe(true)
    expect(acquiredLevel(AREAS, { A1: 1, A2: 1, A3: 1 })).toBe(0)
  })

  it('compte un domaine hors périmètre comme réglé, et non comme manquant', () => {
    expect(firstGateMeasured(AREAS, { A1: 1, A2: 1, A3: OUT_OF_SCOPE })).toBe(true)
  })

  it('est faux quand le premier rang est entièrement hors périmètre : rien n’a été mesuré', () => {
    const answers = { A1: OUT_OF_SCOPE, A2: OUT_OF_SCOPE, A3: OUT_OF_SCOPE }
    expect(firstGateMeasured(AREAS, answers)).toBe(false)
  })

  it('ne regarde pas les rangs supérieurs', () => {
    expect(firstGateMeasured(AREAS, { A1: 1, A2: 1, A3: 1, A4: 5 })).toBe(true)
  })
})

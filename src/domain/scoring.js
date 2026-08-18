// Règles de calcul de la maturité. Fonctions pures : elles reçoivent l'état de
// saisie — les pratiques validées (`checked`), les rangs d'indicateurs
// (`indicators`) — et rendent un résultat, sans rien lire ni écrire de l'état
// applicatif. C'est ici que vit la règle d'agrégation défendue dans le
// rapport — un niveau est acquis lorsque *toutes* les areas attendues jusqu'à
// ce niveau le sont. Le bloc n'intervient pas dans la mesure : ce n'est qu'un
// regroupement de restitution, emprunté au vocabulaire d'Elia.

import { DEFAULT_INDICATOR_RANK, MATURITY_INDICATORS } from '../data/maturity-indicators.js'

// Identifiant d'un objectif, préfixe de celui de ses pratiques.
export function goalKey(areaId, goalIndex) {
  return `${areaId}-${goalIndex}`
}

// Identifiant d'une pratique dans la table des cases cochées.
// Une seule définition : la clé est écrite à la validation et relue au calcul.
// La saisie porte désormais sur l'objectif entier — valider un objectif écrit
// toutes ses clés de pratiques d'un coup — mais la mesure continue de compter
// des pratiques : c'est l'unité du gap, donc du plan d'action.
export function practiceKey(areaId, goalIndex, practiceIndex) {
  return `${goalKey(areaId, goalIndex)}-${practiceIndex}`
}

// Une area est acquise lorsque tous ses objectifs le sont, et un objectif
// lorsque toutes ses pratiques sont validées.
export function areaStats(area, checked) {
  let goalsDone = 0
  let practicesDone = 0
  let practicesTotal = 0

  area.goals.forEach((goal, goalIndex) => {
    const done = goal.practices.filter(
      (practice, practiceIndex) => checked[practiceKey(area.id, goalIndex, practiceIndex)]
    ).length
    practicesDone += done
    practicesTotal += goal.practices.length
    if (done === goal.practices.length) goalsDone++
  })

  return {
    goalsDone,
    goalsTotal: area.goals.length,
    practicesDone,
    practicesTotal,
    acquired: area.goals.length > 0 && goalsDone === area.goals.length
  }
}

// Niveau acquis : on monte palier par palier sur les areas en périmètre et on
// s'arrête au premier niveau dont une area attendue n'est pas acquise — pas de
// compensation entre niveaux, un seul objectif inachevé retient l'ensemble.
// Un palier sans aucune area attendue n'est pas créditable : sans cette garde,
// `[].every()` vaut true et le niveau serait acquis sans qu'une seule pratique
// soit validée. Il n'interrompt pas la montée pour autant, faute de quoi un
// périmètre dont les areas commencent plus haut resterait bloqué à 0.
export function acquiredLevel(scoped, checked, target) {
  let reached = 0
  for (let level = 1; level <= target; level++) {
    const areas = scoped.filter(area => area.level <= level)
    if (!areas.length) continue
    if (!areas.every(area => areaStats(area, checked).acquired)) break
    reached = level
  }
  return reached
}

// — profil « Préparation » —
// Seuil délibérément bas et indépendant du périmètre : il ne mesure pas une
// capacité, il accuse réception d'un premier effort. Toute pratique validée
// compte, y compris hors des areas attendues au niveau cible.
export const PREPARATION_THRESHOLD = 10

export function checkedPracticeCount(checked) {
  return Object.keys(checked).filter(key => checked[key]).length
}

export function preparationReached(checked) {
  return checkedPracticeCount(checked) >= PREPARATION_THRESHOLD
}

// Totaux d'un bloc, sur ses seules areas en périmètre, des trois échelles de
// lecture de la synthèse : les areas acquises — l'unité sur laquelle se joue le
// profil —, puis les objectifs et les pratiques qui les composent.
export function blockTotals(scoped, checked, blockId) {
  return scoped
    .filter(area => area.blockId === blockId)
    .reduce((totals, area) => {
      const stats = areaStats(area, checked)
      return {
        areasDone: totals.areasDone + (stats.acquired ? 1 : 0),
        areasTotal: totals.areasTotal + 1,
        goalsDone: totals.goalsDone + stats.goalsDone,
        goalsTotal: totals.goalsTotal + stats.goalsTotal,
        practicesDone: totals.practicesDone + stats.practicesDone,
        practicesTotal: totals.practicesTotal + stats.practicesTotal
      }
    }, {
      areasDone: 0, areasTotal: 0,
      goalsDone: 0, goalsTotal: 0,
      practicesDone: 0, practicesTotal: 0
    })
}

// Le gap : par area en périmètre, les objectifs non atteints et, pour chacun,
// les pratiques qui restent à mettre en place.
export function gapGroups(scoped, checked) {
  return scoped.reduce((groups, area) => {
    const objectives = area.goals
      .map((goal, goalIndex) => ({
        label: `Crit. ${goalIndex + 1}`,
        goal: goal.goal,
        practices: goal.practices.filter(
          (practice, practiceIndex) => !checked[practiceKey(area.id, goalIndex, practiceIndex)]
        )
      }))
      .filter(objective => objective.practices.length > 0)

    if (objectives.length) {
      groups.push({
        id: area.id,
        block: area.block,
        blockId: area.blockId,
        dim: area.dim,
        dimColor: area.dimColor,
        area: area.name,
        objectives
      })
    }
    return groups
  }, [])
}

export function missingPracticeCount(groups) {
  return groups.reduce(
    (total, group) => total + group.objectives.reduce((n, objective) => n + objective.practices.length, 0),
    0
  )
}

// — indicateurs de maturité —
// Les trois indicateurs transversaux sont posés sur chaque area évaluable et
// répondus par un rang de 1 à 5. Contrairement aux pratiques, ils ne se
// comptent pas : ils se moyennent. La restitution les lit à deux échelles — la
// moyenne du bloc, et les trois rangs de l'area en détail.
//
// Ces rangs n'entrent pas dans le calcul du profil acquis : `acquiredLevel`
// continue de ne connaître que les pratiques validées. Ils sont affichés, pas
// décisifs.

// Les trois rangs d'une area, dans l'ordre du modèle. Sans réponse explicite —
// area jamais ouverte, ou rang décoché — c'est le rang par défaut qui vaut : la
// situation d'absence, retenue tant qu'on ne l'a pas contredite. Il y a donc
// toujours trois rangs, jamais un de moins.
export function areaIndicatorRanks(areaId, indicators) {
  const answers = indicators[areaId] || {}
  return MATURITY_INDICATORS.map(indicator => answers[indicator.id] ?? DEFAULT_INDICATOR_RANK)
}

// Moyenne des trois rangs. Le diviseur est le nombre d'indicateurs, jamais le
// nombre de réponses données — voir ci-dessus, les trois sont toujours là.
export function areaIndicatorAverage(areaId, indicators) {
  const ranks = areaIndicatorRanks(areaId, indicators)
  return ranks.reduce((sum, rank) => sum + rank, 0) / ranks.length
}

// Moyenne du bloc : celle des areas en périmètre qu'il regroupe. Chaque area
// pesant le même nombre d'indicateurs, moyenner les moyennes revient à moyenner
// les réponses — l'une comme l'autre donnent le rang moyen du bloc. Un bloc
// sans area évaluée ne rend pas 0 mais `null` : ne pas avoir été interrogé
// n'est pas un rang.
export function blockIndicatorAverage(scoped, indicators, blockId) {
  const areas = scoped.filter(area => area.blockId === blockId)
  if (!areas.length) return null
  const total = areas.reduce((sum, area) => sum + areaIndicatorAverage(area.id, indicators), 0)
  return total / areas.length
}

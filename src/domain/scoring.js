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
// La saisie porte sur l'objectif entier — valider un objectif écrit toutes ses
// clés de pratiques d'un coup — et la mesure compte des objectifs. La pratique
// n'est plus qu'une granularité de stockage : elle survit dans la clé parce que
// les sessions déjà enregistrées la portent, et parce qu'elle reste la matière
// que le gap donne à lire sous chaque objectif.
export function practiceKey(areaId, goalIndex, practiceIndex) {
  return `${goalKey(areaId, goalIndex)}-${practiceIndex}`
}

// Une area est acquise lorsque tous ses objectifs le sont, et un objectif
// lorsque toutes ses pratiques sont validées.
//
// La pratique reste la condition d'un objectif et la clé du stockage ; elle
// n'est plus une unité de compte. Le référentiel n'attend pas d'une
// organisation qu'elle mette en œuvre toutes les pratiques d'un objectif, mais
// « tous les objectifs et pratiques *applicables* » — l'applicabilité varie
// d'une organisation à l'autre, si bien que le dénominateur d'un compte de
// pratiques n'est pas le même d'un cas au suivant, quand celui des objectifs
// l'est. `areaStats` ne rend donc plus que des objectifs.
export function areaStats(area, checked) {
  let goalsDone = 0

  area.goals.forEach((goal, goalIndex) => {
    const done = goal.practices.every(
      (practice, practiceIndex) => checked[practiceKey(area.id, goalIndex, practiceIndex)]
    )
    if (done) goalsDone++
  })

  return {
    goalsDone,
    goalsTotal: area.goals.length,
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
// capacité, il accuse réception d'un premier effort. Tout objectif validé
// compte, y compris hors des areas attendues au niveau cible — d'où les areas
// passées en argument, qui sont toutes les areas évaluables et non le périmètre
// du profil visé.
//
// Le seuil s'énonce en objectifs depuis que ceux-ci sont l'unité de la mesure.
// Il n'a pas été converti mais reposé : le premier profil du modèle demande les
// six objectifs de son rang, et la Préparation doit rester un pas *avant* lui,
// non son synonyme à un objectif près. Trois est la moitié de six, et le premier
// nombre qu'un clic isolé n'atteint pas. Qu'il représente à peu près la même
// matière que les dix pratiques qu'il remplace — un objectif en porte 3,8 en
// moyenne — est une coïncidence heureuse, pas la raison du choix.
export const PREPARATION_THRESHOLD = 3

export function checkedGoalCount(areas, checked) {
  return areas.reduce((total, area) => total + areaStats(area, checked).goalsDone, 0)
}

export function preparationReached(areas, checked) {
  return checkedGoalCount(areas, checked) >= PREPARATION_THRESHOLD
}

// Totaux d'un bloc, sur ses seules areas en périmètre, des deux échelles de
// lecture de la synthèse : les areas acquises — l'unité sur laquelle se joue le
// profil — et les objectifs qui les composent.
export function blockTotals(scoped, checked, blockId) {
  return scoped
    .filter(area => area.blockId === blockId)
    .reduce((totals, area) => {
      const stats = areaStats(area, checked)
      return {
        areasDone: totals.areasDone + (stats.acquired ? 1 : 0),
        areasTotal: totals.areasTotal + 1,
        goalsDone: totals.goalsDone + stats.goalsDone,
        goalsTotal: totals.goalsTotal + stats.goalsTotal
      }
    }, {
      areasDone: 0, areasTotal: 0,
      goalsDone: 0, goalsTotal: 0
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

// Le gap se compte en objectifs, comme le reste de la mesure. Les pratiques
// qu'ils recouvrent restent listées sous chacun — c'est la matière du plan
// d'action — mais elles ne sont plus totalisées : voir `areaStats`.
export function missingGoalCount(groups) {
  return groups.reduce((total, group) => total + group.objectives.length, 0)
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

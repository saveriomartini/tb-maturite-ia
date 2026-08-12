// Règles de calcul de la maturité. Fonctions pures : elles reçoivent les
// pratiques validées (`checked`) et rendent un résultat, sans lire ni écrire
// d'état applicatif. C'est ici que vit la règle d'agrégation défendue dans le
// rapport — le niveau d'un bloc est le plus haut niveau dont *toutes* les areas
// sont acquises, et le niveau global est le minimum des blocs.

import { BLOCKS } from './model.js'

// Identifiant d'une pratique dans la table des cases cochées.
// Une seule définition : la clé est écrite à la validation et relue au calcul.
export function practiceKey(areaId, goalIndex, practiceIndex) {
  return `${areaId}-${goalIndex}-${practiceIndex}`
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

// Niveau atteint par un bloc : on monte niveau par niveau et on s'arrête au
// premier palier incomplet — pas de compensation entre niveaux.
export function blockLevel(scoped, checked, blockId, target) {
  let reached = 0
  for (let level = 1; level <= target; level++) {
    const areas = scoped.filter(area => area.blockId === blockId && area.level <= level)
    if (!areas.every(area => areaStats(area, checked).acquired)) break
    reached = level
  }
  return reached
}

// Niveau acquis par l'organisation : le minimum des blocs qui ont au moins une
// area en périmètre.
export function acquiredLevel(scoped, checked, target) {
  const levels = BLOCKS
    .filter(block => scoped.some(area => area.blockId === block.id))
    .map(block => blockLevel(scoped, checked, block.id, target))
  return levels.length ? Math.min(...levels) : 0
}

export function blockTotals(scoped, checked, blockId) {
  return scoped
    .filter(area => area.blockId === blockId)
    .reduce((totals, area) => {
      const stats = areaStats(area, checked)
      return {
        goalsDone: totals.goalsDone + stats.goalsDone,
        goalsTotal: totals.goalsTotal + stats.goalsTotal,
        practicesDone: totals.practicesDone + stats.practicesDone,
        practicesTotal: totals.practicesTotal + stats.practicesTotal
      }
    }, { goalsDone: 0, goalsTotal: 0, practicesDone: 0, practicesTotal: 0 })
}

// Le gap : par area en périmètre, les objectifs non atteints et, pour chacun,
// les pratiques qui restent à mettre en place.
export function gapGroups(scoped, checked) {
  return scoped.reduce((groups, area) => {
    const objectives = area.goals
      .map((goal, goalIndex) => ({
        label: `Obj. ${goalIndex + 1}`,
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

// Règles de calcul de la maturité. Fonctions pures : elles reçoivent la table
// des réponses (`answers`) et rendent un résultat, sans rien lire ni écrire de
// l'état applicatif. C'est ici que vit la règle d'agrégation défendue dans le
// rapport — un palier est acquis lorsque *tous* les domaines attendus jusqu'à ce
// palier l'atteignent. Le bloc n'intervient pas dans la mesure : ce n'est qu'un
// regroupement de restitution, emprunté au vocabulaire d'Elia.
//
// — l'unité de réponse —
// Le questionnaire ne fait plus cocher des pratiques ni des critères : il
// présente les cinq énoncés d'un domaine et en fait retenir un, ou le déclare
// hors périmètre. `answers` est donc une table `{ areaId: 1..5 | 'na' }`, une
// entrée par domaine répondu, et rien d'autre. Un domaine absent de la table n'a
// pas été renseigné : ce n'est ni un niveau bas ni une exclusion, c'est une
// mesure qui n'a pas eu lieu, et la restitution le dit à part (`toAssess`).
//
// Les critères d'adoption et les pratiques n'ont pas disparu du modèle — ils
// restent dans model-data.json, qui demeure le report littéral de la source, et
// le modèle continue de les porter. Ils ne sont plus une mesure : plus rien ici
// ne les compte, et le questionnaire ne les affiche plus non plus, faute de
// quoi la lecture en liste de conditions se rouvrait à côté des énoncés.
//
// Les trois indicateurs transversaux du § 5 de la source ont quitté le calcul
// avec la saisie : ils ont été absorbés dans la rédaction des énoncés, dont ils
// sont la grille de dérivation (docs/logs/ENONCES.md). Ils restent une référence
// de rédaction et une page d'information, plus une mesure.

import { STATEMENTS } from '../data/statements.js'

// Valeur qui déclare un domaine hors périmètre. Une chaîne, et non un nombre
// hors échelle ni un drapeau à part : elle occupe la même case que le niveau, si
// bien qu'un domaine ne peut pas être à la fois hors périmètre et répondu.
export const OUT_OF_SCOPE = 'na'

// Bornes de l'échelle des énoncés. Elles valent aussi bornes de paliers : un
// énoncé de rang n dit que le domaine tient le palier n.
export const MIN_RANK = 1
export const MAX_RANK = 5

// Niveau d'un domaine : 0 s'il n'est pas renseigné, son rang sinon. Un domaine
// hors périmètre ne rend pas de niveau — il rend 0, comme un domaine muet, et
// c'est `isOutOfScope` qui dit la différence entre les deux. Aucun appelant ne
// doit lire un 0 comme un « niveau bas » : les deux cas sortent du calcul par
// `inScopeAreas` ou par `toAssess`, jamais par leur niveau.
export function areaLevel(areaId, answers) {
  const answer = answers[areaId]
  return Number.isInteger(answer) && answer >= MIN_RANK && answer <= MAX_RANK ? answer : 0
}

// Hors périmètre : l'organisation déclare que le domaine ne la concerne pas. Il
// sort du calcul — jamais compté comme acquis, jamais compté comme manquant — et
// n'est nommé qu'en restitution, à part.
export function isOutOfScope(areaId, answers) {
  return answers[areaId] === OUT_OF_SCOPE
}

// Les domaines qui comptent. Tout le calcul part de là : ne pas filtrer ici
// reviendrait à faire retenir un palier par un domaine dont l'organisation a dit
// qu'il ne s'applique pas.
export function inScopeAreas(areas, answers) {
  return areas.filter(area => !isOutOfScope(area.id, answers))
}

// L'énoncé qu'un domaine doit tenir à un rang donné. C'est ce texte, et non le
// nom du palier, que la restitution montre pour dire ce qui sépare de la cible :
// le dirigeant a répondu sur des énoncés, il doit retrouver des énoncés.
export function statementText(areaId, rank) {
  const set = STATEMENTS[areaId]
  if (!Array.isArray(set)) return ''
  const statement = set.find(candidate => candidate.n === rank)
  return statement ? statement.text : ''
}

// Palier acquis : on monte palier par palier sur les domaines en périmètre et on
// s'arrête au premier palier dont un domaine attendu n'y est pas. Aucune
// compensation — le maillon faible fixe le palier.
//
// Un palier sans aucun domaine attendu n'est pas créditable : sans cette garde,
// `[].every()` vaut true et le palier serait acquis sans qu'une seule réponse
// soit donnée — c'est exactement le cas d'un périmètre entièrement déclaré hors
// périmètre. Elle n'interrompt pas la montée pour autant, faute de quoi un
// périmètre dont les domaines commencent plus haut resterait bloqué à 0.
//
// `target` borne la montée. Il vaut le haut de l'échelle par défaut, et c'est
// ainsi que la restitution l'appelle : le palier atteint est un fait sur
// l'organisation, pas sur son intention. Le borner à la cible rendrait invisible
// le cas où l'organisation a construit plus haut que ce qu'elle déclare viser —
// précisément l'un des deux états que la restitution doit nommer.
export function acquiredLevel(areas, answers, target = MAX_RANK) {
  const scoped = inScopeAreas(areas, answers)
  let reached = 0
  for (let level = MIN_RANK; level <= target; level++) {
    const expected = scoped.filter(area => area.level <= level)
    if (!expected.length) continue
    if (!expected.every(area => areaLevel(area.id, answers) >= level)) break
    reached = level
  }
  return reached
}

// Les domaines qui retiennent un palier : ceux dont le rang déclencheur est
// inférieur ou égal à ce palier et qui n'y sont pas encore. Chaque entrée porte
// de quoi afficher l'écart sans rien aller rechercher — l'énoncé visé compris.
//
// Le tri est par rang déclencheur croissant, puis par l'ordre du questionnaire.
// Jamais par le retard constaté : trier au reste à parcourir serait une
// priorisation — dire par quoi commencer parce que cela coûte moins — et la
// priorisation est hors périmètre de ce travail. Le rang déclencheur, lui, est
// une propriété du modèle : il dit dans quel ordre les paliers se franchissent,
// pas lequel est le plus rentable.
export function blockers(areas, answers, level) {
  return inScopeAreas(areas, answers)
    .filter(area => area.level <= level && areaLevel(area.id, answers) < level)
    .map((area, order) => ({ area, order }))
    .sort((a, b) => (a.area.level - b.area.level) || (a.order - b.order))
    .map(({ area }) => ({
      id: area.id,
      name: area.name,
      dim: area.dim,
      dimColor: area.dimColor,
      // Le rang auquel le modèle attend ce domaine, et le niveau où il en est.
      required: area.level,
      level: areaLevel(area.id, answers),
      // L'énoncé du palier visé, et non celui du rang du domaine : c'est ce
      // qu'il faudrait pouvoir dire pour que le palier soit franchi.
      statement: statementText(area.id, level)
    }))
}

// L'écart avec la cible, groupé par palier intermédiaire : du palier suivant
// jusqu'à la cible incluse. Un domaine n'apparaît que dans le premier groupe qui
// le réclame — il retient d'abord le palier le plus bas, et le nommer trois fois
// ferait lire trois manques là où il n'y en a qu'un.
//
// Un palier qui ne réclame aucun domaine de plus ne forme pas de groupe : il
// n'aurait rien à montrer, et l'afficher vide donnerait à croire à une étape que
// personne ne retient.
export function blockersByGate(areas, answers, target) {
  const from = acquiredLevel(areas, answers, target) + 1
  const claimed = new Set()
  const groups = []
  for (let level = from; level <= target; level++) {
    const atGate = blockers(areas, answers, level).filter(entry => !claimed.has(entry.id))
    atGate.forEach(entry => claimed.add(entry.id))
    if (atGate.length) groups.push({ level, areas: atGate })
  }
  return groups
}

// Les domaines en périmètre restés sans réponse. Ce ne sont *pas* des blocages :
// un domaine non renseigné ne dit rien de l'organisation, il dit que la mesure
// est incomplète. Les mêler aux domaines qui retiennent un palier reprocherait à
// l'utilisateur des questions auxquelles il n'a pas répondu et gonflerait
// l'écart d'autant. Ils se présentent donc à part.
export function toAssess(areas, answers) {
  return inScopeAreas(areas, answers).filter(area => areaLevel(area.id, answers) === 0)
}

// Avancement d'un palier : combien des domaines qu'il attend l'atteignent. Sert
// à remplir l'échelle des paliers, où l'on veut voir de combien il s'en est
// fallu — sans que ce chiffre entre nulle part dans l'acquisition, qui reste un
// seuil et non un ratio.
export function gateProgress(areas, answers, level) {
  const expected = inScopeAreas(areas, answers).filter(area => area.level <= level)
  return {
    done: expected.filter(area => areaLevel(area.id, answers) >= level).length,
    expected: expected.length
  }
}

// — lecture par dimension —
// Deux façons de résumer une dimension, qui ne disent pas la même chose : la
// moyenne situe l'ensemble, le plancher dit ce qui la retiendrait si elle était
// un palier. Les deux sont affichées, jamais agrégées en un score global — le
// modèle n'en restitue aucun.
//
// Un domaine à 0 ne compte dans ni l'une ni l'autre : ne pas avoir répondu n'est
// pas un niveau, et le compter tirerait la moyenne vers le bas au prorata des
// questions non posées. Une dimension sans aucun domaine renseigné en périmètre
// ne rend pas 0 mais `null` : ne pas avoir été mesuré n'est pas un rang.
function ratedAreas(areas, answers, dimId) {
  return inScopeAreas(areas, answers)
    .filter(area => area.dimId === dimId && areaLevel(area.id, answers) > 0)
}

export function dimAverage(areas, answers, dimId) {
  const rated = ratedAreas(areas, answers, dimId)
  if (!rated.length) return null
  const total = rated.reduce((sum, area) => sum + areaLevel(area.id, answers), 0)
  return total / rated.length
}

export function dimFloor(areas, answers, dimId) {
  const rated = ratedAreas(areas, answers, dimId)
  if (!rated.length) return null
  return rated.reduce((min, area) => Math.min(min, areaLevel(area.id, answers)), MAX_RANK)
}

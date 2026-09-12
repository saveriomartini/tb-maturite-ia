// — suggestion du niveau cible —
// Deux axes : l'ambition affichée par l'organisation et la capacité qu'elle peut
// soutenir. On ne suggère jamais plus d'un cran au-dessus de la capacité, puis
// on applique les plafonds durs (facteurs bloquants qui ne se compensent pas).
// Le raisonnement complet est documenté dans docs/logs/NIVEAU-CIBLE.md.
//
// Ce que ce fichier produit est une *suggestion*, et rien d'autre : depuis
// l'entrée DECISIONS du 28.08.2026, elle ne borne plus la cible que
// l'organisation déclare — elle s'affiche à côté d'elle, avec les motifs qui
// l'ont fait descendre. Le calcul lui-même n'a pas changé ; seul son statut.

import {
  ALL_FIELDS, LEVEL_CAPS, LEVEL5_REQUIREMENTS
} from '../data/context-attributes.js'

// Valeur prise par un attribut non renseigné. Le score maximal, et non une
// valeur médiane : ne rien décrire ne restreint rien, donc un formulaire vide
// place les deux axes au Level 5 et le diagnostic porte sur toutes les areas du
// modèle. Chaque réponse ne peut alors que réduire le périmètre — « on vous
// propose tout, vos réponses retirent ce qui ne vous concerne pas ».
const UNANSWERED_SCORE = 1

const MIN_LEVEL = 1
const MAX_LEVEL = 5

function fieldScore(field, form) {
  const value = form[field.id]
  if (value == null) return null
  const option = field.opts.find(opt => opt[0] === value)
  if (!option) return null
  // L'appétit au risque se prend tel qu'il est déclaré. Il était naguère borné
  // quand la posture réglementaire valait « fortement régulé » ; cet attribut a
  // été retiré (voir context-attributes.js), et avec lui la correction qu'il
  // portait — la contrainte légale vaut pour toutes les organisations visées et
  // ne distingue donc plus personne.
  return option[2]
}

function fieldsOfAxis(axis) {
  return ALL_FIELDS.filter(field => field.axis === axis)
}

function axisLevel(axis, form) {
  const fields = fieldsOfAxis(axis)
  if (!fields.length) return null
  const sum = fields.reduce((total, field) => {
    const score = fieldScore(field, form)
    return total + (score == null ? UNANSWERED_SCORE : score)
  }, 0)
  return levelFromScore(sum / fields.length)
}

function levelFromScore(score) {
  return MIN_LEVEL + score * (MAX_LEVEL - MIN_LEVEL)
}

function clampLevel(level) {
  return Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.round(level)))
}

export function buildRecommendation(form) {
  const answered = ALL_FIELDS.filter(field => form[field.id] != null).length
  const ambitionLevel = axisLevel('ambition', form)
  const capacityLevel = axisLevel('capacity', form)

  let level = clampLevel(Math.min(ambitionLevel, capacityLevel + 1))
  const cappedByCapacity = capacityLevel + 1 < ambitionLevel

  // Plafonds durs : le plus bas l'emporte, et on retient les facteurs qui
  // l'expliquent pour pouvoir les afficher.
  const matchedCaps = LEVEL_CAPS.filter(cap => cap.values.includes(form[cap.field]))
  let capNotes = []
  if (matchedCaps.length) {
    const capMax = matchedCaps.reduce((min, cap) => Math.min(min, cap.max), MAX_LEVEL)
    if (capMax < level) {
      level = capMax
      capNotes = matchedCaps.filter(cap => cap.max === capMax)
    }
  }

  // Une condition n'est « manquante » que si elle est contredite : un attribut
  // laissé vide ne bloque pas le profil le plus haut, il ne le prouve pas non
  // plus — même règle permissive que UNANSWERED_SCORE.
  const level5Missing = LEVEL5_REQUIREMENTS.filter(
    req => form[req.field] != null && !req.values.includes(form[req.field])
  )
  const blockedFrom5 = level === MAX_LEVEL && level5Missing.length > 0
  if (blockedFrom5) level = MAX_LEVEL - 1

  // Les deux axes ne sortent pas d'ici : ils portent le calcul, pas la
  // restitution. Seul `cappedByCapacity` en subsiste, parce qu'il explique
  // pourquoi la suggestion est descendue sous ce que l'ambition appelait.
  //
  // `capNotes` et `level5Missing` sortent avec leur `why` : ce sont eux que
  // l'ancrage affiche sous la suggestion, dans les termes du modèle.
  return {
    level,
    answered,
    total: ALL_FIELDS.length,
    complete: answered === ALL_FIELDS.length,
    empty: answered === 0,
    cappedByCapacity,
    capNotes,
    level5Missing: blockedFrom5 ? level5Missing : []
  }
}

// — ce que la cible déclarée suppose du contexte —
//
// Quand la portée déclarée passe au-dessus de la suggestion, l'ancrage ne se
// contente pas de le dire : il montre, attribut par attribut, les conditions que
// cette cible suppose et que le cadrage ne décrit pas. Ce n'est pas une liste de
// réponses à corriger — l'outil ne corrige pas une réponse qu'il a sollicitée
// (DECISIONS du 28.08.2026) —, c'est la lecture en regard de ce que
// l'organisation a déclaré et de ce que la cible demande.
//
// Le bloc ne couvre que les deux mécanismes exactement inversibles : les
// plafonds durs (`LEVEL_CAPS`) et les conditions du profil le plus haut
// (`LEVEL5_REQUIREMENTS`). Chacun porte, par construction, une valeur attendue
// par attribut, donc une ligne se lit sans rien inventer.
//
// Les deux axes ambition et capacité en sont exclus, et c'est la décision qu'il
// faut pouvoir défendre : leur rang sort d'une *moyenne* de scores. Aucun
// attribut n'y a de valeur attendue — plusieurs combinaisons donnent le même
// rang —, et la seule chose qu'on pourrait afficher serait la moyenne
// elle-même : le nombre agrégé que l'outil refuse de montrer partout ailleurs.
//
// Elle ne réutilise pas `capNotes` : celui-ci ne retient que les plafonds les
// plus bas, parce qu'eux seuls décident de la suggestion. Ici, chaque plafond
// dont le `max` est sous la cible déclarée sépare pour son propre compte, et
// tous se disent.
export function targetConditions(form, target) {
  const caps = LEVEL_CAPS
    .filter(cap => cap.values.includes(form[cap.field]) && cap.max < target)
    .map(cap => condition(cap.field, form[cap.field], lowestOutside(cap.field, cap.values)))

  // Un champ vide ne contredit rien : même règle permissive que
  // `UNANSWERED_SCORE`, il part dans `unanswered` et non dans les lignes.
  const level5 = target !== MAX_LEVEL ? [] : LEVEL5_REQUIREMENTS
    .filter(req => form[req.field] != null && !req.values.includes(form[req.field]))
    .map(req => condition(req.field, form[req.field], req.values[0]))

  // Seuls les attributs qui portent un plafond ou une condition sont cités : les
  // quatre autres ne pouvaient rien séparer, et les nommer ferait croire qu'ils
  // manquent à la démonstration.
  const conditioned = new Set([
    ...LEVEL_CAPS.map(cap => cap.field),
    ...LEVEL5_REQUIREMENTS.map(req => req.field)
  ])
  const unanswered = ALL_FIELDS
    .filter(field => conditioned.has(field.id) && form[field.id] == null)
    .map(field => field.id)

  return { caps: inFieldOrder(caps), level5: inFieldOrder(level5), unanswered }
}

function condition(field, declared, supposed) {
  const option = optionOf(field, supposed)
  return { field, declared, supposed, criterion: (option && option[3]) || '' }
}

// La valeur supposée se dérive des `opts` du champ et ne s'écrit jamais en dur :
// l'option de plus bas score hors de celles qui déclenchent le plafond est le
// minimum que la cible demande, et elle suit le champ s'il change d'options.
function lowestOutside(field, values) {
  const option = optionsOf(field)
    .filter(opt => !values.includes(opt[0]))
    .reduce((lowest, opt) => (lowest == null || opt[2] < lowest[2] ? opt : lowest), null)
  return option ? option[0] : null
}

function optionsOf(field) {
  const found = ALL_FIELDS.find(entry => entry.id === field)
  return found ? found.opts : []
}

function optionOf(field, value) {
  return optionsOf(field).find(opt => opt[0] === value) || null
}

// L'ordre des lignes est celui du questionnaire, et rien d'autre. Trier au
// manque serait une priorisation — ce que la section voisine se refuse déjà pour
// les domaines.
function inFieldOrder(rows) {
  const order = ALL_FIELDS.map(field => field.id)
  return [...rows].sort((a, b) => order.indexOf(a.field) - order.indexOf(b.field))
}

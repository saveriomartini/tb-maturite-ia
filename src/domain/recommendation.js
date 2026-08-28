// — recommandation du niveau cible —
// Deux axes : l'ambition affichée par l'organisation et la capacité qu'elle peut
// soutenir. On ne recommande jamais plus d'un cran au-dessus de la capacité, puis
// on applique les plafonds durs (facteurs bloquants qui ne se compensent pas).
// Le raisonnement complet est documenté dans docs/NIVEAU-CIBLE.md.

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
  // restitution. Seul `cappedByCapacity` en subsiste, parce qu'il explique un
  // écart entre le profil visé et celui qu'appelaient les réponses.
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

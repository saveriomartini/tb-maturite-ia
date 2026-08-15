// — recommandation du niveau cible —
// Deux axes : l'ambition affichée par l'organisation et la capacité qu'elle peut
// soutenir. On ne recommande jamais plus d'un cran au-dessus de la capacité, puis
// on applique les plafonds durs (facteurs bloquants qui ne se compensent pas).
// Le raisonnement complet est documenté dans docs/NIVEAU-CIBLE.md.

import {
  ALL_FIELDS, LEVEL_CAPS, LEVEL5_REQUIREMENTS, REGULATED_RISK_CEILING
} from '../data/context-attributes.js'

// Valeur prise par un attribut non renseigné. 0.25 place le formulaire vide
// exactement au Level 2 sur les deux axes — le niveau d'entrée du modèle — et
// rend la recommandation progressive : chaque réponse déplace la moyenne au lieu
// de la faire basculer.
const NEUTRAL_SCORE = 0.25

const MIN_LEVEL = 1
const MAX_LEVEL = 5

function fieldScore(field, form) {
  const value = form[field.id]
  if (value == null) return null
  const option = field.opts.find(opt => opt[0] === value)
  if (!option) return null
  // Un cadre réglementaire fort borne l'appétit au risque effectivement retenu.
  if (field.id === 'risk' && form.regulatory === 'regulated') {
    return Math.min(option[2], REGULATED_RISK_CEILING)
  }
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
    return total + (score == null ? NEUTRAL_SCORE : score)
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

  const level5Missing = LEVEL5_REQUIREMENTS.filter(req => !req.values.includes(form[req.field]))
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

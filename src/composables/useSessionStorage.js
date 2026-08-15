// Persistance locale de la session d'évaluation.
//
// L'état complet (écran courant, attributs de contexte, profil visé retenu,
// série ouverte, areas présentées, pratiques validées) est écrit dans
// localStorage sous une clé versionnée. Toute donnée
// relue est validée avant d'être réinjectée : un payload écrit par une version
// antérieure du modèle ne doit jamais pouvoir corrompre l'état applicatif —
// les valeurs inconnues sont écartées silencieusement, pas l'ensemble.

import { watch } from 'vue'
import { ALL_FIELDS, DESCRIPTIVE_FIELDS } from '../data/context-attributes.js'

const STORAGE_KEY = 'maia.session'
const SCHEMA_VERSION = 1
const WRITE_DELAY = 200

const FORM_FIELDS = ALL_FIELDS.concat(DESCRIPTIVE_FIELDS)

export function newSessionId() {
  return Math.random().toString(16).slice(2, 9)
}

function storage() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    return window.localStorage
  } catch {
    // Accès refusé (navigation privée, cookies bloqués) : on tourne sans persistance.
    return null
  }
}

function isPlainObject(v) {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

function boolMap(v) {
  if (!isPlainObject(v)) return {}
  const out = {}
  Object.keys(v).forEach(k => { if (v[k] === true) out[k] = true })
  return out
}

function validForm(v) {
  if (!isPlainObject(v)) return {}
  const out = {}
  FORM_FIELDS.forEach(f => {
    const value = v[f.id]
    if (value != null && f.opts.some(o => o[0] === value)) out[f.id] = value
  })
  return out
}

function sanitize(raw, screens) {
  if (!isPlainObject(raw)) return null
  const out = {}
  if (screens.indexOf(raw.screen) >= 0) out.screen = raw.screen
  if (Number.isInteger(raw.diagIdx) && raw.diagIdx >= 0) out.diagIdx = raw.diagIdx
  // Un `target` absent ou invalide retombe sur la valeur par défaut (null),
  // c'est-à-dire sur la recommandation : le choix manuel seul est mémorisé.
  if (Number.isInteger(raw.target) && raw.target >= 1 && raw.target <= 5) out.target = raw.target
  if (raw.wave === 1 || raw.wave === 2) out.wave = raw.wave
  if (typeof raw.showContext === 'boolean') out.showContext = raw.showContext
  // Degré de transformation souhaité : un profil du modèle, ou rien.
  if (Number.isInteger(raw.transformation) && raw.transformation >= 1 && raw.transformation <= 5) {
    out.transformation = raw.transformation
  }
  if (typeof raw.showTransformation === 'boolean') out.showTransformation = raw.showTransformation
  if (typeof raw.session === 'string' && /^[a-z0-9]{4,16}$/.test(raw.session)) out.session = raw.session
  out.checked = boolMap(raw.checked)
  out.openLevels = boolMap(raw.openLevels)
  out.seen = boolMap(raw.seen)
  out.form = validForm(raw.form)
  return out
}

function snapshot(state) {
  return {
    screen: state.screen,
    diagIdx: state.diagIdx,
    target: state.target,
    wave: state.wave,
    showContext: state.showContext,
    transformation: state.transformation,
    showTransformation: state.showTransformation,
    session: state.session,
    checked: boolMap(state.checked),
    openLevels: boolMap(state.openLevels),
    seen: boolMap(state.seen),
    form: validForm(state.form)
  }
}

export function loadSession(screens) {
  const store = storage()
  if (!store) return null
  let raw
  try {
    raw = store.getItem(STORAGE_KEY)
  } catch {
    return null
  }
  if (!raw) return null
  let payload
  try {
    payload = JSON.parse(raw)
  } catch {
    // Contenu illisible : on repart d'une session vierge plutôt que de planter.
    clearSession()
    return null
  }
  if (!isPlainObject(payload) || payload.v !== SCHEMA_VERSION) {
    clearSession()
    return null
  }
  return sanitize(payload.state, screens)
}

export function clearSession() {
  const store = storage()
  if (!store) return
  try {
    store.removeItem(STORAGE_KEY)
  } catch {
    /* rien à faire : la session restera en mémoire uniquement */
  }
}

// Écrit l'état à chaque mutation, avec un léger regroupement pour ne pas
// solliciter le stockage à chaque clic du questionnaire.
export function persistSession(state) {
  const store = storage()
  if (!store) return
  let timer = null
  let disabled = false

  function write() {
    timer = null
    if (disabled) return
    try {
      store.setItem(STORAGE_KEY, JSON.stringify({ v: SCHEMA_VERSION, state: snapshot(state) }))
    } catch {
      // Quota atteint ou stockage indisponible : on cesse d'essayer.
      disabled = true
    }
  }

  watch(state, function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(write, WRITE_DELAY)
  }, { deep: true })
}

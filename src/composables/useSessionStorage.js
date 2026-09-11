// Persistance locale de la session d'évaluation.
//
// L'état complet (écran courant, attributs de contexte, portée déclarée, niveau
// retenu par domaine) est écrit dans localStorage sous une clé versionnée. Toute
// donnée relue est validée avant d'être réinjectée : un payload écrit par une
// version antérieure du modèle ne doit jamais pouvoir corrompre l'état
// applicatif — les valeurs inconnues sont écartées silencieusement, pas
// l'ensemble.
//
// Ce module ne porte plus que le stockage : ce qu'est une session valide, le
// numéro de schéma et le motif pour lequel une v1 est jetée sans conversion
// vivent dans `domain/session-state.js` depuis le 11.09.2026, où le fichier
// exporté les lit aussi. Il n'y a qu'une définition d'un état valide, et les
// deux portes la traversent.
//
// Il n'y a donc aucune migration depuis la v1. Une v1 relue est effacée, comme
// le fait le contrôle de version ci-dessous — aucune session n'est en
// production, et le coût d'une conversion inventée dépasse de loin celui d'un
// parcours refait.

import { watch } from 'vue'
import { SCHEMA_VERSION, isPlainObject, sanitize, snapshot } from '../domain/session-state.js'

const STORAGE_KEY = 'maia.session'
const WRITE_DELAY = 200

export { newSessionId } from '../domain/session-state.js'

function storage() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    return window.localStorage
  } catch {
    // Accès refusé (navigation privée, cookies bloqués) : on tourne sans persistance.
    return null
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
  // Toute version autre que la courante est effacée, sans tentative de
  // conversion : c'est ici que la v1 est jetée.
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

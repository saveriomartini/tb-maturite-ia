// Persistance locale de la session d'évaluation.
//
// L'état complet (écran courant, position dans le questionnaire, attributs de
// contexte, portée déclarée, niveau retenu par domaine) est écrit dans
// localStorage sous une clé versionnée. Toute donnée relue est validée avant
// d'être réinjectée : un payload écrit par une version antérieure du modèle ne
// doit jamais pouvoir corrompre l'état applicatif — les valeurs inconnues sont
// écartées silencieusement, pas l'ensemble.
//
// — pourquoi le schéma passe à 2, et pourquoi une v1 est jetée —
//
// Le changement d'unité de réponse suffirait : `checked` portait des pratiques
// validées, `answers` porte un niveau par domaine, et un état de cases cochées
// ne se convertit pas en niveau. Rien ne dit à quel rang d'énoncé correspond un
// jeu de critères validés — c'est justement ce qui a changé de nature. Une
// migration devrait inventer la réponse ; elle serait fausse et muette.
//
// Mais la version aurait dû monter même sans `answers`. Le lot précédent a
// retiré l'option `program` de `scope`, remplacé les cinq identifiants de
// `ambition` et supprimé l'attribut `regulatory`. Or `validForm` écarte
// silencieusement toute valeur devenue inconnue, et `recommendation.js` fait
// valoir `UNANSWERED_SCORE` — le score **maximal** — à tout attribut absent. Une
// session enregistrée avant ce lot se rechargeait donc avec deux ou trois
// réponses perdues *et* une recommandation plus haute qu'à l'enregistrement,
// sans le moindre message. C'est ce motif, et non le seul confort, qui justifie
// de jeter plutôt que de réinterpréter : une session relue doit valoir ce
// qu'elle valait, ou ne pas être relue du tout.
//
// Il n'y a donc aucune migration depuis la v1. Une v1 relue est effacée, comme
// le fait déjà le contrôle de version ci-dessous — aucune session n'est en
// production, et le coût d'une conversion inventée dépasse de loin celui d'un
// parcours refait.

import { watch } from 'vue'
import { ALL_FIELDS, DESCRIPTIVE_FIELDS } from '../data/context-attributes.js'
import { DEMO_SESSIONS } from '../data/demo-sessions.js'
import { EVALUABLE_AREAS } from '../domain/model.js'
import { MAX_RANK, MIN_RANK, OUT_OF_SCOPE } from '../domain/scoring.js'

const STORAGE_KEY = 'maia.session'
const SCHEMA_VERSION = 2
const WRITE_DELAY = 200

const FORM_FIELDS = ALL_FIELDS.concat(DESCRIPTIVE_FIELDS)
const AREA_IDS = new Set(EVALUABLE_AREAS.map(area => area.id))
const DEMO_IDS = new Set(DEMO_SESSIONS.map(scenario => scenario.id))

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

// Réponses du questionnaire : une clé de domaine connue du modèle, et une valeur
// qui est soit un entier de l'échelle des énoncés, soit la déclaration de hors
// périmètre. Tout le reste tombe silencieusement, comme partout ici — un domaine
// retiré du modèle ne doit pas empêcher de relire les 27 autres, et une valeur
// abîmée ne doit pas se retrouver comparée à un rang.
function validAnswers(v) {
  if (!isPlainObject(v)) return {}
  const out = {}
  Object.keys(v).forEach(areaId => {
    if (!AREA_IDS.has(areaId)) return
    const value = v[areaId]
    if (value === OUT_OF_SCOPE) {
      out[areaId] = OUT_OF_SCOPE
      return
    }
    if (Number.isInteger(value) && value >= MIN_RANK && value <= MAX_RANK) out[areaId] = value
  })
  return out
}

function sanitize(raw, screens) {
  if (!isPlainObject(raw)) return null
  const out = {}
  if (screens.indexOf(raw.screen) >= 0) out.screen = raw.screen
  if (Number.isInteger(raw.diagIdx) && raw.diagIdx >= 0) out.diagIdx = raw.diagIdx
  // Avertissement de saut déjà lu : il ne se repose pas après un rechargement.
  if (typeof raw.contextWarned === 'boolean') out.contextWarned = raw.contextWarned
  // Degré de transformation visé : il se déduit de la portée déclarée en phase
  // d'ancrage, et vaut un rang du modèle ou rien. Absent ou invalide, il retombe
  // sur la valeur par défaut (null), c'est-à-dire sur la seule recommandation.
  // Les clés d'un payload plus ancien — `target`, `wave`, `checked`,
  // `indicators` — ne sont pas lues : elles n'existent plus, et un état de v1
  // n'arrive de toute façon jamais jusqu'ici (voir l'en-tête).
  if (Number.isInteger(raw.transformation) && raw.transformation >= 1 && raw.transformation <= 5) {
    out.transformation = raw.transformation
  }
  if (typeof raw.session === 'string' && /^[a-z0-9]{4,16}$/.test(raw.session)) out.session = raw.session
  // Provenance de la session : le scénario de démonstration qui l'a écrite, ou
  // rien. Un scénario retiré du fichier laisse la session intacte et lui rend
  // seulement son anonymat — l'en-tête cesse d'annoncer une démonstration dont
  // plus rien ne dit ce qu'elle était.
  if (typeof raw.demo === 'string' && DEMO_IDS.has(raw.demo)) out.demo = raw.demo
  out.answers = validAnswers(raw.answers)
  out.openLevels = boolMap(raw.openLevels)
  out.form = validForm(raw.form)
  return out
}

function snapshot(state) {
  return {
    screen: state.screen,
    diagIdx: state.diagIdx,
    transformation: state.transformation,
    contextWarned: state.contextWarned,
    session: state.session,
    demo: state.demo,
    answers: validAnswers(state.answers),
    openLevels: boolMap(state.openLevels),
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

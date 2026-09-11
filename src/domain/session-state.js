// Ce qu'est une session valide, et ce qui en est écarté.
//
// Ce module ne sait ni où la session est écrite ni d'où elle revient : il dit
// seulement ce qu'un état a le droit de contenir. Il vivait dans
// `useSessionStorage.js` tant que le stockage du navigateur était la seule porte
// d'entrée ; il en est sorti le 11.09.2026, quand le fichier exporté en a ouvert
// une seconde (voir `session-file.js`).
//
// Le déplacement n'est pas un rangement. Deux portes qui relisent une session
// avec deux validateurs, ce sont deux définitions de ce qui est valide, et celle
// qui s'oublie est toujours la seconde. Le backlog l'écrivait déjà comme une
// clause de l'item 3.11 — « validé par le même validateur que localStorage » ;
// elle est désormais tenue par la structure du code et non par la vigilance.
//
// — pourquoi le schéma est à 2, et pourquoi une v1 est jetée —
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
// La règle vaut maintenant pour les deux portes. Un fichier produit par une
// version antérieure du questionnaire est refusé avec son motif, exactement
// comme une session de v1 est effacée : le format est commun, le numéro de
// schéma aussi.

import { ALL_FIELDS, DESCRIPTIVE_FIELDS } from '../data/context-attributes.js'
import { DEMO_SESSIONS } from '../data/demo-sessions.js'
import { EVALUABLE_AREAS } from './model.js'
import { RETIRED_SCREENS } from './navigation.js'
import { MAX_RANK, MIN_RANK, OUT_OF_SCOPE } from './scoring.js'

export const SCHEMA_VERSION = 2

const FORM_FIELDS = ALL_FIELDS.concat(DESCRIPTIVE_FIELDS)
const AREA_IDS = new Set(EVALUABLE_AREAS.map(area => area.id))
const DEMO_IDS = new Set(DEMO_SESSIONS.map(scenario => scenario.id))

// Sept caractères hexadécimaux tirés au hasard par le navigateur. Ils ne
// désignent personne et ne se dérivent de rien : ils servent à reconnaître une
// même évaluation d'une feuille imprimée à un fichier, et rien d'autre.
export function newSessionId() {
  return Math.random().toString(16).slice(2, 9)
}

export function isPlainObject(v) {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

export function isSessionId(v) {
  return typeof v === 'string' && /^[a-z0-9]{4,16}$/.test(v)
}

export function boolMap(v) {
  if (!isPlainObject(v)) return {}
  const out = {}
  Object.keys(v).forEach(k => { if (v[k] === true) out[k] = true })
  return out
}

export function validForm(v) {
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
export function validAnswers(v) {
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

export function validTransformation(v) {
  return Number.isInteger(v) && v >= MIN_RANK && v <= MAX_RANK ? v : null
}

export function sanitize(raw, screens) {
  if (!isPlainObject(raw)) return null
  const out = {}
  // L'écran courant, avec le rattrapage des trois noms retirés par la fusion des
  // phases : une session enregistrée avant elle porte `tool1`, `tool2` ou
  // `tool3`, et les trois désignent la page qui les a remplacés. Sans ce
  // rattrapage, l'écran tomberait comme inconnu et la session rouvrirait à
  // l'accueil — la seule perte qu'une relecture aurait infligée.
  //
  // Un fichier de partage ne porte aucun écran : la clé manque, elle ne tombe
  // pas, et c'est l'appelant qui décide où atterrir. Voir `session-file.js`.
  const screen = RETIRED_SCREENS[raw.screen] || raw.screen
  if (screens.indexOf(screen) >= 0) out.screen = screen
  // `diagIdx` — la position dans le questionnaire — n'est plus ni écrit ni relu.
  // Les 28 domaines sont sur la même page : il n'y a plus d'index à tenir. La
  // clé tombe silencieusement comme toutes les inconnues, ce qui est exactement
  // ce qu'il faut : une session venue d'avant la fusion la porte encore, et elle
  // ne doit pas la faire rejeter.
  // Avertissement de saut déjà lu : il ne se repose pas après un rechargement.
  if (typeof raw.contextWarned === 'boolean') out.contextWarned = raw.contextWarned
  // Même chose pour l'avertissement de hors périmètre. Une session écrite avant
  // qu'il existe ne porte pas la clé : elle retombe sur `false`, et la boîte
  // paraît une fois de plus — le sens sûr, l'autre taisant une règle qui n'a
  // jamais été lue.
  if (typeof raw.outOfScopeWarned === 'boolean') out.outOfScopeWarned = raw.outOfScopeWarned
  // Degré de transformation visé : il se déduit de la portée déclarée en phase
  // d'ancrage, et vaut un rang du modèle ou rien. Absent ou invalide, il retombe
  // sur la valeur par défaut (null), c'est-à-dire sur la seule recommandation.
  // Les clés d'un payload plus ancien — `target`, `wave`, `checked`,
  // `indicators` — ne sont pas lues : elles n'existent plus, et un état de v1
  // n'arrive de toute façon jamais jusqu'ici (voir l'en-tête).
  const transformation = validTransformation(raw.transformation)
  if (transformation != null) out.transformation = transformation
  if (isSessionId(raw.session)) out.session = raw.session
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

export function snapshot(state) {
  return {
    screen: state.screen,
    transformation: state.transformation,
    contextWarned: state.contextWarned,
    outOfScopeWarned: state.outOfScopeWarned,
    session: state.session,
    demo: state.demo,
    answers: validAnswers(state.answers),
    openLevels: boolMap(state.openLevels),
    form: validForm(state.form)
  }
}

// Le fichier de session : ce qui sort de l'outil, et ce qui peut y rentrer.
//
// Item 3.11 du backlog, longtemps premier de l'ordre de coupe du 26.08.2026 et
// livré le 11.09. Deux fichiers en sortent, produits ensemble et distincts par
// ce qu'ils portent :
//
//   — `reprise`, l'instantané complet de la session, celui-là même qui est
//     écrit dans le navigateur. Il sert à rouvrir l'évaluation ailleurs, ou plus
//     tard, ou sur un autre poste. Il est pour son auteur.
//   — `partage`, le même état réduit à ce qui a un sens pour un tiers : les
//     énoncés retenus, trois des quinze attributs de cadrage — secteur, taille,
//     territoire —, la portée visée et le profil diagnostiqué qui s'en déduit.
//
// — ce que le fichier de partage n'emporte pas, et pourquoi —
//
// Les douze autres attributs de cadrage décrivent le fonctionnement interne de
// l'organisation : horizon de planification, gouvernance de l'adoption, état des
// données, ressources affectées, appétit au risque. Croisés avec un secteur et
// une taille, dans un tissu économique de la dimension de l'arc jurassien, ils
// rapprochent un fichier anonyme du seuil où l'entreprise se reconnaît. C'est le
// reproche même que le chapitre 3 adresse au corpus d'outils examiné ; il ne
// serait pas tenable de le lui faire et de produire ensuite ce fichier-là.
//
// Ne sortent pas non plus les traces d'usage — écran courant, niveaux dépliés,
// avertissements déjà lus, appartenance à une démonstration. Elles disent ce que
// la personne a fait dans l'outil, jamais où en est son organisation : elles
// n'ont rien à faire dans un fichier transmis, et leur absence ne retire rien à
// qui le recevrait.
//
// Restent les deux profils. Ils sont dérivés et n'ajoutent aucune déclaration :
// le profil diagnostiqué se recalcule des réponses par la règle du maillon
// faible, la portée visée est la réponse à la question d'ancrage. Ils sont
// portés explicitement parce qu'une comparaison qui les ignorerait mettrait en
// regard des organisations qui ne visent pas la même chose — exactement ce que
// le chapitre 3 reproche aux comparatifs dont on ne sait pas qui ils agrègent.
//
// — ce que le fichier ne peut pas contenir —
//
// Ni nom, ni adresse, ni aucun texte saisi : l'outil n'a aucun champ libre. Les
// vingt-huit réponses sont des entiers ou la déclaration de hors périmètre, les
// quinze attributs sont des vocabulaires fermés. La propriété ne tient pas à une
// précaution d'écriture, elle tient à la forme du questionnaire, et elle se
// vérifie en lisant `context-attributes.js`.
//
// L'identifiant de session reste dans les deux fichiers : sept caractères tirés
// au hasard par le navigateur, qui ne désignent personne, et qui permettent de
// rattacher un fichier à la feuille A4 sortie de la même session — et, pour qui
// en recevrait plusieurs, de reconnaître deux envois d'une même évaluation.
//
// — la relecture —
//
// Un fichier relu passe `sanitize`, c'est-à-dire le validateur de
// `session-state.js`, celui-là même qui garde localStorage. Un fichier d'une
// autre version du schéma est refusé avec son motif au lieu d'être converti,
// pour la raison écrite dans ce module : une session relue doit valoir ce
// qu'elle valait, ou ne pas être relue du tout. Le refus est toujours motivé et
// jamais silencieux : c'est un acte de l'utilisateur, il a droit à sa réponse.

import { DESCRIPTIVE_FIELDS } from '../data/context-attributes.js'
import { EVALUABLE_AREAS } from './model.js'
import { acquiredLevel, isOutOfScope, toAssess } from './scoring.js'
import {
  SCHEMA_VERSION, isPlainObject, isSessionId, sanitize, snapshot, validAnswers, validForm,
  validTransformation
} from './session-state.js'

export const FORMAT = 'maia.session'
export const TOOL = 'M.A.IA'
export const RESUME = 'reprise'
export const SHARE = 'partage'

const SHARE_FIELDS = DESCRIPTIVE_FIELDS.map(field => field.id)

const NO_FREE_TEXT =
  'Il ne contient ni nom, ni adresse, ni aucun texte saisi : l’outil n’en demande aucun.'

const NOTICE = {
  [RESUME]:
    'Fichier produit par M.A.IA. Il porte votre session d’auto-évaluation : les énoncés ' +
    'retenus pour chacun des 28 domaines de capacité, les 15 attributs de cadrage et la portée ' +
    'visée. Rouvrez-le depuis le bloc « Emporter » de la phase d’ancrage pour reprendre où vous ' +
    'en étiez. ' + NO_FREE_TEXT,
  [SHARE]:
    'Fichier produit par M.A.IA, destiné à être transmis si vous le décidez. Il porte les ' +
    'énoncés retenus pour chacun des 28 domaines de capacité, trois des 15 attributs de cadrage ' +
    '— secteur, taille, territoire —, la portée visée et le profil diagnostiqué qui s’en déduit. ' +
    'Il ne porte pas les douze autres attributs, qui décrivent le fonctionnement de votre ' +
    'organisation, ni ce que vous avez fait dans l’outil. ' + NO_FREE_TEXT + ' L’outil n’envoie ' +
    'rien et ne connaît aucun destinataire : le fichier reste sur votre poste jusqu’à ce que ' +
    'vous en disposiez.'
}

// La date du jour, sans heure. Une session ne se date pas à la seconde : cela ne
// sert aucune lecture et cela rend deux fichiers rapprochables par leur instant
// d'écriture.
export function fileDate(now = new Date()) {
  const pad = n => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export function fileName(kind, session, now = new Date()) {
  const id = isSessionId(session) ? session : 'session'
  return `maia-${kind === SHARE ? SHARE : RESUME}-${id}-${fileDate(now)}.json`
}

// L'état réduit du fichier de partage. Il passe les mêmes validateurs que le
// reste : un fichier produit à partir d'un état abîmé ne doit pas l'être moins
// qu'une session relue.
export function shareState(state) {
  const form = validForm(state.form)
  const kept = {}
  SHARE_FIELDS.forEach(id => { if (form[id] != null) kept[id] = form[id] })
  const out = { answers: validAnswers(state.answers), form: kept }
  const transformation = validTransformation(state.transformation)
  if (transformation != null) out.transformation = transformation
  return out
}

// Ce que les réponses donnent une fois la règle appliquée. Le bloc n'existe que
// dans le fichier de partage : dans le fichier de reprise, l'état porte tout et
// un résultat recopié à côté de lui serait une seconde vérité, qui se
// démentirait le jour où la règle changerait.
export function measure(state) {
  const answers = validAnswers(state.answers)
  const outOfScope = EVALUABLE_AREAS.filter(area => isOutOfScope(area.id, answers)).length
  const pending = toAssess(EVALUABLE_AREAS, answers).length
  return {
    profile: acquiredLevel(EVALUABLE_AREAS, answers),
    reach: validTransformation(state.transformation),
    areas: EVALUABLE_AREAS.length,
    answered: EVALUABLE_AREAS.length - outOfScope - pending,
    outOfScope,
    pending
  }
}

export function buildFile(kind, state, now = new Date()) {
  const k = kind === SHARE ? SHARE : RESUME
  const file = {
    _lisezmoi: NOTICE[k],
    format: FORMAT,
    kind: k,
    v: SCHEMA_VERSION,
    tool: TOOL,
    date: fileDate(now),
    session: isSessionId(state.session) ? state.session : null
  }
  if (k === SHARE) file.measure = measure(state)
  file.state = k === SHARE ? shareState(state) : snapshot(state)
  return file
}

// Indenté, et terminé par un retour à la ligne. Un fichier qu'on est invité à
// lire avant de l'envoyer doit s'ouvrir lisible dans n'importe quel éditeur :
// c'est la condition pratique du consentement, pas une coquetterie de format.
export function serialize(kind, state, now = new Date()) {
  return `${JSON.stringify(buildFile(kind, state, now), null, 2)}\n`
}

export const REFUSALS = {
  unreadable: 'Ce fichier n’est pas lisible : son contenu n’est pas du JSON.',
  foreign: 'Ce fichier n’a pas été produit par M.A.IA.',
  version: 'Ce fichier vient d’une version antérieure du questionnaire. Il n’est pas relu : les ' +
    'réponses n’y auraient plus le même sens.',
  empty: 'Ce fichier ne porte aucune réponse exploitable.'
}

function refuse(reason) {
  return { ok: false, reason, message: REFUSALS[reason] }
}

export function parseFile(text, screens) {
  let payload
  try {
    payload = JSON.parse(text)
  } catch {
    return refuse('unreadable')
  }
  if (!isPlainObject(payload) || payload.format !== FORMAT) return refuse('foreign')
  if (payload.kind !== RESUME && payload.kind !== SHARE) return refuse('foreign')
  if (payload.v !== SCHEMA_VERSION) return refuse('version')
  const state = sanitize(payload.state, screens)
  // Un fichier sans aucune réponse, sans cadrage et sans portée ne restaure
  // rien : le relire effacerait la session en cours au profit du vide, ce qui
  // est la seule façon dont une reprise peut faire perdre quelque chose.
  if (!state || (
    !Object.keys(state.answers).length &&
    !Object.keys(state.form).length &&
    state.transformation == null
  )) {
    return refuse('empty')
  }
  return { ok: true, kind: payload.kind, state }
}

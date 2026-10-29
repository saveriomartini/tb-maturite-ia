// Analyse de sensibilité de la règle du maillon faible (BACKLOG 2.11).
//
// La règle d'agrégation ne compense rien : un palier est acquis lorsque tous les
// domaines qu'il attend l'atteignent. Sa faiblesse admise est connue — une
// statistique d'ordre discrimine peu, et un progrès sur un domaine qui ne
// retient rien ne se voit pas dans le verdict. Ce script la chiffre au lieu de
// l'affirmer : pour chaque session, il fait varier chaque réponse d'un niveau,
// vers le bas puis vers le haut, et compte celles qui déplacent le palier.
//
// Il rend aussi les deux conditions de révision posées pour la décision 0.10
// (BACKLOG 2.12), parce qu'elles sont vérifiables et qu'un script est le seul
// endroit où elles le sont vraiment :
//   1. toutes les sessions rendent le même palier → la règle ne discrimine pas
//      entre organisations, et le profil par dimension devrait passer devant ;
//   2. plus d'un tiers des réponses d'une session déplacent son palier → le
//      verdict est instable, et la progression devrait passer devant lui.
//
// Les sessions analysées : les démonstrations, toujours, et tout fichier de
// session passé en argument — fichier de reprise ou de partage, tel que le bloc
// « Emporter » le produit. C'est par là que les données du pilote entreront :
//
//   npm run sensitivity
//   npm run sensitivity -- pilote/*.json
//   npm run sensitivity -- --json pilote/*.json   (sortie brute, pour le rapport)
//
// Ce qui ne varie pas, et pourquoi. Un domaine hors périmètre n'a pas de niveau
// à décaler : le faire entrer dans la mesure serait une autre question, celle du
// périmètre, que ce script ne pose pas. Un domaine non renseigné non plus : lui
// prêter un niveau, ce serait inventer une réponse. Le rang ne sort jamais de
// l'échelle : le rang 1 ne descend pas, le rang 5 ne monte pas.
//
// Le script n'échoue jamais sur un résultat : une condition de révision
// déclenchée est un constat à lire, pas une erreur de build. Il n'est donc
// branché ni sur `lint` ni sur la CI.

import { register } from 'node:module'
import { readFileSync } from 'node:fs'

// Le modèle est un fichier JSON que `src/data/model-data.js` importe sans
// attribut d'import : Vite l'accepte, Node le refuse. check-model.js contourne
// la difficulté en relisant le JSON lui-même ; ici, ce serait recopier la règle
// de validation des fichiers de session et la liste des domaines évaluables, et
// une analyse qui ne calcule pas avec le code de l'outil ne prouverait rien sur
// lui. Ce crochet ajoute donc l'attribut au chargement des seuls fichiers
// .json, et les modules du domaine s'importent tels quels.
const JSON_HOOK = `
export async function load(url, context, nextLoad) {
  if (!url.endsWith('.json')) return nextLoad(url, context)
  return nextLoad(url, { ...context, importAttributes: { ...context.importAttributes, type: 'json' } })
}`
register(`data:text/javascript,${encodeURIComponent(JSON_HOOK)}`)

const { EVALUABLE_AREAS, profileName } = await import('../src/domain/model.js')
const { MAX_RANK, MIN_RANK, acquiredLevel, areaLevel, gateProgress } =
  await import('../src/domain/scoring.js')
const { buildDemoSession, demoScenarios } = await import('../src/domain/demo-session.js')
const { parseFile } = await import('../src/domain/session-file.js')
const { SCREENS } = await import('../src/domain/navigation.js')

// Seuil de la condition 2, tel que la décision 0.10 le pose.
const INSTABILITY_SHARE = 1 / 3

const args = process.argv.slice(2)
const asJson = args.includes('--json')
const files = args.filter(arg => arg !== '--json')

function loadSessions() {
  const sessions = demoScenarios().map(scenario => ({
    label: `démo · ${scenario.name}`,
    answers: buildDemoSession(scenario.id).answers
  }))
  const refused = []
  for (const path of files) {
    let text
    try {
      text = readFileSync(path, 'utf8')
    } catch (error) {
      refused.push({ path, reason: error.message })
      continue
    }
    // Le même filtre que la relecture dans l'outil : un fichier qu'il refuserait
    // ne doit pas compter dans une analyse qui prétend porter sur lui.
    const read = parseFile(text, SCREENS)
    if (!read.ok) refused.push({ path, reason: read.message })
    else sessions.push({ label: path, answers: read.state.answers })
  }
  return { sessions, refused }
}

// Une réponse décalée d'un cran, si l'échelle le permet. `null` sinon.
function shifted(answers, areaId, delta) {
  const level = areaLevel(areaId, answers)
  if (!level) return null
  const next = level + delta
  if (next < MIN_RANK || next > MAX_RANK) return null
  return { ...answers, [areaId]: next }
}

function analyse(session) {
  const base = acquiredLevel(EVALUABLE_AREAS, session.answers)
  const rated = EVALUABLE_AREAS.filter(area => areaLevel(area.id, session.answers) > 0)
  const pivots = []
  for (const area of rated) {
    const moves = []
    for (const delta of [-1, 1]) {
      const variant = shifted(session.answers, area.id, delta)
      if (!variant) continue
      const level = acquiredLevel(EVALUABLE_AREAS, variant)
      if (level !== base) moves.push({ delta, level })
    }
    if (moves.length) {
      pivots.push({ id: area.id, rank: areaLevel(area.id, session.answers), moves })
    }
  }
  // Ce qui sépare du palier suivant : le « progrès invisible » se lit ici. Un
  // palier qui attend douze domaines et en a dix ne bouge pas plus que s'il en
  // avait deux.
  const next = base < MAX_RANK ? gateProgress(EVALUABLE_AREAS, session.answers, base + 1) : null
  return {
    label: session.label,
    level: base,
    rated: rated.length,
    pivots,
    share: rated.length ? pivots.length / rated.length : 0,
    next: next && { level: base + 1, done: next.done, expected: next.expected }
  }
}

const { sessions, refused } = loadSessions()
const results = sessions.map(analyse)

const distinct = new Set(results.map(result => result.level))
const report = {
  sessions: results,
  refused,
  conditions: {
    sameVerdict: results.length > 1 && distinct.size === 1,
    unstable: results.filter(result => result.share > INSTABILITY_SHARE).map(result => result.label)
  }
}

function levelLabel(level) {
  return level ? `palier ${level} — ${profileName(level)}` : 'aucun palier'
}

function percent(share) {
  return `${Math.round(share * 100)} %`
}

function printText() {
  const out = []
  out.push(`Sensibilité de la règle du maillon faible — ${results.length} session(s), ` +
    `chaque réponse décalée d'un niveau vers le bas puis vers le haut.`)
  for (const result of results) {
    out.push('')
    out.push(`${result.label}`)
    out.push(`  ${levelLabel(result.level)}`)
    out.push(`  réponses qui déplacent le palier : ${result.pivots.length} sur ${result.rated} ` +
      `(${percent(result.share)})`)
    for (const pivot of result.pivots) {
      const moves = pivot.moves
        .map(move => `${move.delta < 0 ? '−1' : '+1'} → ${move.level ? `palier ${move.level}` : 'aucun'}`)
        .join(', ')
      out.push(`    ${pivot.id} (niveau ${pivot.rank}) : ${moves}`)
    }
    if (result.next) {
      out.push(`  palier ${result.next.level} : ${result.next.done} domaine(s) sur ` +
        `${result.next.expected} au niveau exigé`)
    }
  }
  for (const entry of refused) {
    out.push('')
    out.push(`écarté · ${entry.path} : ${entry.reason}`)
  }
  out.push('')
  out.push('Conditions de révision (décision 0.10)')
  out.push(`  1. même palier pour toutes les sessions : ` +
    `${report.conditions.sameVerdict ? 'DÉCLENCHÉE' : 'non'} ` +
    `(${distinct.size} palier(s) distinct(s) sur ${results.length} session(s))`)
  out.push(`  2. plus d'un tiers des réponses déplacent le palier : ` +
    (report.conditions.unstable.length
      ? `DÉCLENCHÉE pour ${report.conditions.unstable.join(', ')}`
      : 'non'))
  if (results.length < 2) {
    out.push('     (la condition 1 demande au moins deux sessions)')
  }
  console.log(out.join('\n'))
}

if (asJson) console.log(JSON.stringify(report, null, 2))
else printText()

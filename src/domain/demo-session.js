// Fabrication d'une session de démonstration.
//
// Le scénario dit ce qu'une PME fictive a validé ; ce module le traduit en état
// de session — les clés de pratiques cochées, les rangs d'indicateurs, les
// domaines effectivement présentés — et laisse le reste de l'outil calculer
// comme si la saisie venait de l'utilisateur. Aucun résultat n'est écrit ici :
// le profil atteint, l'écart et la synthèse restent dérivés par
// domain/scoring.js des mêmes entrées que d'habitude, faute de quoi la
// démonstration montrerait autre chose que l'outil.
//
// Fonction pure, sans dépendance à Vue : elle rend un objet à fusionner dans
// l'état, pas un état qu'elle muterait.

import { DEMO_SESSIONS } from '../data/demo-sessions.js'
import { DEFAULT_INDICATOR_RANK, MATURITY_INDICATORS } from '../data/maturity-indicators.js'
import { orderedAreas } from './model.js'
import { buildRecommendation } from './recommendation.js'
import { practiceKey } from './scoring.js'

const MIN_RANK = 1
const MAX_RANK = 5

export function demoScenarios() {
  return DEMO_SESSIONS.map(scenario => ({
    id: scenario.id,
    name: scenario.name,
    profile: scenario.profile,
    story: scenario.story,
    shows: scenario.shows
  }))
}

// Ce qu'un domaine a reçu dans le scénario. Trois états, et pas davantage : le
// questionnaire valide des critères entiers, donc un domaine est maîtrisé,
// entamé, ou intact.
function areaState(scenario, area) {
  if (scenario.mastered.includes(area.id)) return 'mastered'
  return scenario.partial[area.id] ? 'partial' : 'untouched'
}

function clampRank(n) {
  return Math.max(MIN_RANK, Math.min(MAX_RANK, n))
}

export function buildDemoSession(id) {
  const scenario = DEMO_SESSIONS.find(item => item.id === id)
  if (!scenario) return null

  // Le profil visé se dérive comme partout ailleurs : l'intention déclarée,
  // bornée par ce que le contexte porte. Le scénario ne l'écrit donc pas — il
  // écrit un formulaire et une intention, et hérite du calcul de l'outil.
  const target = Math.min(scenario.transformation, buildRecommendation(scenario.form).level)
  const presented = orderedAreas(target).filter(area => area.wave <= scenario.wave)

  const checked = {}
  const indicators = {}
  const seen = {}

  // Seuls les domaines réellement présentés reçoivent quoi que ce soit : une
  // session où un domaine jamais montré porterait des réponses n'aurait pas pu
  // être produite par le questionnaire. Un identifiant du scénario tombé hors
  // de la série présentée est donc ignoré, sans bruit.
  presented.forEach(area => {
    seen[area.id] = true

    const state = areaState(scenario, area)
    const goalsDone = state === 'mastered' ? area.goals.length : (scenario.partial[area.id] || 0)
    area.goals.slice(0, goalsDone).forEach((goal, goalIndex) => {
      goal.practices.forEach((practice, practiceIndex) => {
        checked[practiceKey(area.id, goalIndex, practiceIndex)] = true
      })
    })

    // Le rang par défaut n'est jamais écrit : l'absence de réponse le vaut
    // déjà, et la session de démonstration se relit comme les autres.
    const answers = {}
    MATURITY_INDICATORS.forEach(indicator => {
      const rank = clampRank(scenario.ranks[state] + (scenario.bias[indicator.id] || 0))
      if (rank !== DEFAULT_INDICATOR_RANK) answers[indicator.id] = rank
    })
    if (Object.keys(answers).length) indicators[area.id] = answers
  })

  return {
    // On atterrit sur la restitution : c'est ce qu'on est venu voir. Le
    // questionnaire reste derrière, à sa dernière position, pour que « précédent »
    // ouvre sur des écrans remplis plutôt qu'au début du parcours.
    screen: 'tool3',
    diagIdx: Math.max(0, presented.length - 1),
    wave: scenario.wave,
    form: { ...scenario.form },
    transformation: scenario.transformation,
    checked,
    indicators,
    seen,
    // Le cadrage est rempli : l'avertissement qui reproche de l'avoir sauté n'a
    // plus lieu de se poser si l'on revient en arrière.
    contextWarned: true,
    demo: scenario.id
  }
}

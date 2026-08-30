// Fabrication d'une session de démonstration.
//
// Le scénario dit ce qu'une PME fictive a répondu ; ce module le traduit en état
// de session et laisse le reste de l'outil calculer comme si la saisie venait de
// l'utilisateur. Aucun résultat n'est écrit ici : le profil atteint, l'écart et
// la synthèse restent dérivés par domain/scoring.js des mêmes entrées que
// d'habitude, faute de quoi la démonstration montrerait autre chose que l'outil.
//
// La traduction s'est beaucoup simplifiée : du temps des pratiques validées, il
// fallait dériver 271 clés et 84 rangs d'indicateurs d'une description globale.
// Le scénario porte désormais directement la table des réponses — c'est le même
// format que celui de la session, et il n'y a plus rien à fabriquer que le
// contexte autour.
//
// Fonction pure, sans dépendance à Vue : elle rend un objet à fusionner dans
// l'état, pas un état qu'elle muterait.

import { DEMO_SESSIONS } from '../data/demo-sessions.js'
import { EVALUABLE_AREAS } from './model.js'
import { MAX_RANK, MIN_RANK, OUT_OF_SCOPE } from './scoring.js'

const AREA_IDS = new Set(EVALUABLE_AREAS.map(area => area.id))

export function demoScenarios() {
  return DEMO_SESSIONS.map(scenario => ({
    id: scenario.id,
    name: scenario.name,
    profile: scenario.profile,
    story: scenario.story,
    shows: scenario.shows
  }))
}

// Une réponse de scénario n'entre dans la session que si elle est valide : un
// domaine que le modèle connaît, et un rang de l'échelle ou la déclaration de
// hors périmètre. Le contrôle vaut pour un identifiant devenu obsolète après un
// remaniement du modèle — il tomberait sans bruit plutôt que de faire calculer
// l'outil sur un domaine qui n'existe plus.
function validAnswer(areaId, value) {
  if (!AREA_IDS.has(areaId)) return false
  if (value === OUT_OF_SCOPE) return true
  return Number.isInteger(value) && value >= MIN_RANK && value <= MAX_RANK
}

export function buildDemoSession(id) {
  const scenario = DEMO_SESSIONS.find(item => item.id === id)
  if (!scenario) return null

  const answers = {}
  Object.keys(scenario.answers).forEach(areaId => {
    const value = scenario.answers[areaId]
    if (validAnswer(areaId, value)) answers[areaId] = value
  })

  return {
    // On atterrit sur la page de l'outil, où le cadrage, l'évaluation et les
    // résultats se suivent. C'est la restitution qu'on vient voir, et c'est bien
    // là que la démonstration s'ouvre — mais la section se rejoint par le
    // défilement, qui est une position de lecture et non un état de session : le
    // composable la pose au chargement, le scénario n'écrit que des entrées.
    screen: 'tool',
    form: { ...scenario.form },
    // La portée déclarée à l'ancrage fixe l'intention ; le profil visé s'en
    // déduit, borné par la recommandation issue du contexte. Le scénario
    // n'écrit donc pas le profil visé, il écrit la réponse dont il découle.
    transformation: scenario.reach,
    answers,
    // Le cadrage est rempli : l'avertissement qui reproche de l'avoir sauté n'a
    // plus lieu de se poser si l'on revient en arrière.
    contextWarned: true,
    demo: scenario.id
  }
}

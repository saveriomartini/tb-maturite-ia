// Machine à écrans : ordre du parcours, phase d'appartenance, enchaînement.
// Aucune dépendance à Vue — testable isolément.
//
// L'accueil n'ouvre plus un parcours linéaire unique : il propose trois entrées
// de même rang — information, outil, démonstration. Seule la branche « outil »
// est phasée, et c'est la seule dont l'en-tête montre la progression :
// `tool1` cadre, `tool2` évalue, `tool3` et `tool3b` restituent.

export const SCREENS = [
  'home', 'info', 'demo',
  'tool1', 'tool2', 'palier',
  'tool3', 'tool3b', 'export'
]

// Phase (1-3) à laquelle appartient chaque écran ; 0 = hors branche outil.
// Le palier ferme la première série du questionnaire : il appartient encore à
// l'Évaluation, même s'il ouvre sur les Résultats.
export const PHASE_OF = {
  home: 0, info: 0, demo: 0,
  tool1: 1,
  tool2: 2, palier: 2,
  tool3: 3, tool3b: 3, export: 3
}

// Écran suivant par défaut. Les écrans absents ont un enchaînement conditionnel
// (tool2 parcourt les areas, le palier repart au questionnaire ou aux résultats,
// tool3b propose l'export ou la fin).
export const NEXT_OF = {
  tool1: 'tool2',
  tool3: 'tool3b'
}

// Écran d'entrée de chaque phase, dans l'ordre des onglets de l'en-tête.
export const PHASE_ENTRY = ['tool1', 'tool2', 'tool3']

// Retour explicite plutôt que déduit de la position dans `SCREENS` : l'accueil a
// désormais trois successeurs possibles, et un simple décalage d'index ferait
// remonter le cadrage vers la démonstration.
const PREVIOUS_OF = {
  info: 'home',
  demo: 'home',
  tool1: 'home',
  tool2: 'tool1',
  palier: 'tool2',
  tool3: 'palier',
  tool3b: 'tool3',
  export: 'tool3b'
}

export function previousScreen(screen) {
  return PREVIOUS_OF[screen] || 'home'
}

// Hors de la branche outil, l'en-tête se réduit au titre : afficher trois phases
// inertes sur l'accueil ou la page d'information ne renseigne sur rien.
export function isToolScreen(screen) {
  return PHASE_OF[screen] > 0
}

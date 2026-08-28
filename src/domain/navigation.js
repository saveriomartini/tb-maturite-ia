// Machine à écrans : ordre du parcours, phase d'appartenance, enchaînement.
// Aucune dépendance à Vue — testable isolément.
//
// L'accueil n'ouvre plus un parcours linéaire unique : il propose trois entrées
// de même rang — information, outil, démonstration. Seule la branche « outil »
// est phasée, et c'est la seule dont l'en-tête montre la progression :
// `tool1` cadre, `tool2` évalue, `tool3` restitue, `tool4` ancre.
//
// Le palier a disparu avec les séries. Il fermait la première série du
// questionnaire et proposait d'ouvrir la seconde : avec 28 énoncés au lieu de
// 271 pratiques, une passe complète tient dans une séance et il n'y a plus de
// seconde série à proposer. Les 28 domaines sont présentés d'affilée, dans
// l'ordre du modèle.
//
// La quatrième phase est rétablie. Elle était affichée grisée puis retirée
// faute de contenu ; elle en a un désormais — la portée visée, le niveau cible
// qui en découle, l'écart, et l'export. Elle s'arrête au seuil de la mise en
// œuvre : on prépare l'ancrage, on ne le conduit pas.

export const SCREENS = [
  'home', 'info', 'demo',
  'tool1', 'tool2', 'tool3', 'tool4', 'export'
]

// Phase (1-4) à laquelle appartient chaque écran ; 0 = hors branche outil.
// L'aperçu d'export appartient à l'ancrage : c'est la pièce que la phase
// produit, pas une sortie de l'outil.
export const PHASE_OF = {
  home: 0, info: 0, demo: 0,
  tool1: 1,
  tool2: 2,
  tool3: 3,
  tool4: 4, export: 4
}

// Écran suivant par défaut. `tool2` est absent : il parcourt les domaines et ne
// quitte l'écran qu'au dernier.
export const NEXT_OF = {
  tool1: 'tool2',
  tool3: 'tool4'
}

// Écran d'entrée de chaque phase, dans l'ordre des onglets de l'en-tête.
export const PHASE_ENTRY = ['tool1', 'tool2', 'tool3', 'tool4']

// Retour explicite plutôt que déduit de la position dans `SCREENS` : l'accueil a
// trois successeurs possibles, et un simple décalage d'index ferait remonter le
// cadrage vers la démonstration.
const PREVIOUS_OF = {
  info: 'home',
  demo: 'home',
  tool1: 'home',
  tool2: 'tool1',
  tool3: 'tool2',
  tool4: 'tool3',
  export: 'tool4'
}

export function previousScreen(screen) {
  return PREVIOUS_OF[screen] || 'home'
}

// Hors de la branche outil, l'en-tête se réduit au titre : afficher quatre
// phases inertes sur l'accueil ou la page d'information ne renseigne sur rien.
export function isToolScreen(screen) {
  return PHASE_OF[screen] > 0
}

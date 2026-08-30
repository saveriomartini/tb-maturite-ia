// Machine à écrans : ordre du parcours, phase d'appartenance, enchaînement.
// Aucune dépendance à Vue — testable isolément.
//
// L'accueil n'ouvre plus un parcours linéaire unique : il propose trois entrées
// de même rang — information, outil, démonstration. Seule la branche « outil »
// est phasée, et c'est la seule dont l'en-tête montre la progression.
//
// — la fusion des trois premières phases —
// Le cadrage, l'évaluation et les résultats ne sont plus trois écrans : ce sont
// trois sections d'une même page qui défile, `tool`. Les 28 domaines de capacité
// s'y empilent tous, l'un sous l'autre, dans l'ordre du modèle ; il n'y a plus
// un domaine par écran, donc plus d'index à déplacer ni de « suivant » à
// proposer. On passe d'une phase à l'autre en défilant, pas en changeant
// d'écran.
//
// L'ancrage, lui, garde son écran, et ce n'est pas un oubli : il s'ouvre sur la
// question de portée, dont la réponse change tout ce qui la suit. Amené par le
// défilement, on y répondrait en passant, sans avoir vu qu'on décidait. Il garde
// donc sa page et son entrée dans la barre — et l'aperçu d'export reste
// également à part. `tool4` conserve son nom parce qu'il conserve son rang : il
// est la quatrième phase, et la seule des quatre qui reste un écran.

export const SCREENS = ['home', 'info', 'demo', 'tool', 'tool4', 'export']

// Identifiants d'ancre des trois sections de `tool`. Stables et lisibles : ils
// servent d'`id` dans le gabarit et de cible à `scrollIntoView`. Aucune URL,
// aucun fragment, aucun historique — l'outil tient en une session sans partage
// de lien profond, et la dépendance à un routeur ne se justifierait pas pour
// autant.
export const PHASE_ANCHORS = ['phase-cadrage', 'phase-evaluation', 'phase-resultats']

// L'ancre d'un domaine de capacité dans l'empilement, dérivée de l'identifiant
// du modèle : elle est donc stable tant que le modèle l'est. La barre des 28
// domaines vise ces ancres et fait défiler jusqu'à elles ; elle ne déplace plus
// aucun index, puisqu'il n'y a plus de position à tenir.
export function areaAnchor(areaId) {
  return `domaine-${areaId}`
}

// Phase (1-4) à laquelle appartient chaque écran ; 0 = hors branche outil.
// `tool` porte les trois premières à la fois : la valeur inscrite ici n'est que
// celle de son entrée, et la phase réellement courante s'y lit à la position du
// défilement (voir `activePhase` dans le composable).
//
// L'aperçu d'export appartient à l'ancrage : c'est la pièce que la phase
// produit, pas une sortie de l'outil.
export const PHASE_OF = {
  home: 0, info: 0, demo: 0,
  tool: 1,
  tool4: 4, export: 4
}

// Point d'arrivée de chaque phase, dans l'ordre des onglets de l'en-tête. Les
// trois premières sont des sections de `tool` : on y arrive en faisant défiler
// la page jusqu'à leur ancre. La quatrième est un écran : on y arrive en
// changeant d'écran, et elle n'a donc pas d'ancre.
export const PHASE_TARGETS = [
  { n: 1, screen: 'tool', anchor: PHASE_ANCHORS[0] },
  { n: 2, screen: 'tool', anchor: PHASE_ANCHORS[1] },
  { n: 3, screen: 'tool', anchor: PHASE_ANCHORS[2] },
  { n: 4, screen: 'tool4', anchor: null }
]

// Écran suivant par défaut. La page de l'outil ne mène qu'à l'ancrage : tout ce
// qui la précédait s'y est replié.
export const NEXT_OF = {
  tool: 'tool4'
}

// Écrans retirés par la fusion, et où ils retombent. Une session enregistrée
// avant celle-ci porte `tool1`, `tool2` ou `tool3` ; les trois désignent
// désormais la même page. Sans cette table, la relecture écarterait un écran
// devenu inconnu et rouvrirait la session à l'accueil — une position perdue
// pour un parcours qui n'a rien perdu d'autre. Ces noms ne sont plus jamais
// écrits.
export const RETIRED_SCREENS = {
  tool1: 'tool',
  tool2: 'tool',
  tool3: 'tool'
}

// Retour explicite plutôt que déduit de la position dans `SCREENS` : l'accueil a
// trois successeurs possibles, et un simple décalage d'index ferait remonter le
// cadrage vers la démonstration.
const PREVIOUS_OF = {
  info: 'home',
  demo: 'home',
  tool: 'home',
  tool4: 'tool',
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

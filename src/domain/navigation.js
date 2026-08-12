// Machine à écrans : ordre du parcours, phase d'appartenance, enchaînement.
// Aucune dépendance à Vue — testable isolément.

export const SCREENS = [
  'home', 'cadrage1', 'cadrage2', 'cadrage3',
  'diagStart', 'diag',
  'resti1', 'resti2', 'resti3', 'export'
]

// Phase (1-4) à laquelle appartient chaque écran ; 0 = accueil, hors phase.
export const PHASE_OF = {
  home: 0,
  cadrage1: 1, cadrage2: 1, cadrage3: 1,
  diagStart: 2, diag: 2,
  resti1: 3, resti2: 3, resti3: 3, export: 3
}

// Écran suivant par défaut. Les écrans absents ont un enchaînement conditionnel
// (diag parcourt les areas, resti3 propose l'export ou la fin).
export const NEXT_OF = {
  home: 'cadrage1',
  cadrage1: 'cadrage2',
  cadrage2: 'cadrage3',
  cadrage3: 'diagStart',
  diagStart: 'diag',
  resti1: 'resti2',
  resti2: 'resti3'
}

// Écran d'entrée de chaque phase, dans l'ordre des onglets de l'en-tête.
// null = phase hors périmètre du travail de Bachelor (Ancrage).
export const PHASE_ENTRY = ['cadrage1', 'diagStart', 'resti1', null]

export function previousScreen(screen) {
  const index = SCREENS.indexOf(screen)
  return SCREENS[Math.max(0, index - 1)]
}

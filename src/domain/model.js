// Lecture du modèle AIMM : listes dérivées et libellés partagés.
// model-data.json reste la source de vérité ; ce module n'en expose que des
// vues pratiques, sans jamais réécrire son contenu.

import { AIMM } from '../data/model-data.js'

export const BLOCKS = AIMM.blocks
export const LEVELS = AIMM.levels

// Les areas à plat, chacune enrichie de son bloc et de sa dimension : la
// plupart des calculs raisonnent sur les areas, pas sur l'arborescence.
export const AREAS = BLOCKS.flatMap(block =>
  block.dimensions.flatMap(dimension =>
    dimension.areas.map(area => ({
      ...area,
      block: block.name,
      blockId: block.id,
      dim: dimension.name,
      dimId: dimension.id,
      dimColor: dimension.color
    }))
  )
)

export const DIMENSION_COUNT = BLOCKS.reduce((n, block) => n + block.dimensions.length, 0)

// Les niveaux gardent leur numéro dans les données — il ordonne les areas et
// porte le calcul — mais l'interface ne les nomme que par leur profil : un
// dirigeant retient « Intégration opérationnelle », pas « Level 2 ».
export function profileName(n) {
  const level = LEVELS.find(l => l.n === n)
  return level ? level.name : '—'
}

// L'export est la seule sortie numérotée : c'est une pièce de dossier, relue
// hors contexte, où le rang doit rester explicite.
export function profileExportLabel(n) {
  const level = LEVELS.find(l => l.n === n)
  return level ? `Niveau ${n} — ${level.name}` : '—'
}

export function levelDescription(n) {
  const level = LEVELS.find(l => l.n === n)
  return level ? level.desc : ''
}

// Areas effectivement évaluables, dans l'ordre du modèle. C'est cet ordre — et
// non celui du parcours — qui porte la numérotation de la barre de navigation :
// une area garde le même numéro d'un bout à l'autre de la session, quel que soit
// le profil visé.
export const EVALUABLE_AREAS = AREAS.filter(area => !area.pending)

// Areas ordonnées pour le questionnaire. Le profil visé n'exclut plus personne :
// il ordonne. Les areas qu'il met en jeu forment la première série (`wave` 1),
// les autres suivent (`wave` 2) et ne sont proposées que si l'utilisateur
// choisit de poursuivre. Seules les areas encore à définir (Matrice N2) restent
// hors du modèle évaluable.
export function orderedAreas(target) {
  const first = EVALUABLE_AREAS.filter(area => area.level <= target)
  const rest = EVALUABLE_AREAS.filter(area => area.level > target)
  return [
    ...first.map(area => ({ ...area, wave: 1 })),
    ...rest.map(area => ({ ...area, wave: 2 }))
  ]
}

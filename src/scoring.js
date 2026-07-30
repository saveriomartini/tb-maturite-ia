// Regles de calcul. Elles ne sont PAS inventees ici : elles lisent le bloc
// "agregation" du modele. Modifier la regle = modifier modele.json, pas ce fichier.

export function niveauDimension(dimension, reponses, regle = 'min') {
  const mesurables = dimension.capability_areas.filter((ca) => ca.regime !== 'placeholder')
  const valeurs = mesurables.map((ca) => reponses[ca.id])
  if (valeurs.some((v) => v === undefined)) return null // incomplet : pas de niveau
  if (!valeurs.length) return null
  if (regle === 'min') return Math.min(...valeurs)
  if (regle === 'mediane') {
    const t = [...valeurs].sort((a, b) => a - b)
    const m = Math.floor(t.length / 2)
    return t.length % 2 ? t[m] : Math.floor((t[m - 1] + t[m]) / 2)
  }
  throw new Error(`Regle d'agregation inconnue : ${regle}`)
}

export function avancementDimension(dimension, reponses) {
  const mesurables = dimension.capability_areas.filter((ca) => ca.regime !== 'placeholder')
  const faits = mesurables.filter((ca) => reponses[ca.id] !== undefined).length
  return { faits, total: mesurables.length, complet: mesurables.length > 0 && faits === mesurables.length }
}

// Le niveau cible est une extrapolation de l'auteur (statut X) : le referentiel
// prescrit de le definir mais ne fournit aucun instrument d'elicitation.
export function niveauCible(contexte) {
  const { objectif, risque, horizon } = contexte
  if (!objectif) return null
  let cible = 2
  if (objectif === 'productivite_interne') cible = 3
  if (objectif === 'offre_produit') cible = 4
  if (objectif === 'exploration') cible = 1
  if (risque === 'faible' && cible > 2) cible -= 1
  if (horizon === 'long' && cible < 5) cible += 1
  return Math.max(1, Math.min(5, cible))
}

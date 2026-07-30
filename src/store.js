import { reactive, watch } from 'vue'
import modele from './data/modele.json'

const CLE = 'tb-maturite-ia/session'
const vierge = () => ({
  contexte: { secteur: '', effectif: '', fonction: '', objectif: '', risque: '', horizon: '' },
  reponses: {},
  demo: false
})

function charger() {
  try {
    const brut = localStorage.getItem(CLE)
    return brut ? { ...vierge(), ...JSON.parse(brut) } : vierge()
  } catch {
    return vierge()
  }
}

// Persistance locale uniquement : aucune donnee ne quitte le navigateur.
// Choix d'architecture (privacy by design), a documenter dans le rapport.
export const store = reactive(charger())
watch(store, (v) => localStorage.setItem(CLE, JSON.stringify(v)), { deep: true })

export { modele }
export const dimensionsParSocle = (socleId) => modele.dimensions.filter((d) => d.socle === socleId)
export const dimensionParId = (id) => modele.dimensions.find((d) => d.id === id)
export const caParId = (id) =>
  modele.dimensions.flatMap((d) => d.capability_areas).find((ca) => ca.id === id)
export const dimensionDeLaCa = (id) =>
  modele.dimensions.find((d) => d.capability_areas.some((ca) => ca.id === id))
export const enoncesDeLaCa = (id) =>
  modele.enonces.filter((e) => e.capability_area === id).sort((a, b) => a.niveau - b.niveau)
export const libelleNiveau = (rang) => modele.echelle.niveaux.find((n) => n.rang === rang)

export function reinitialiser() {
  Object.assign(store, vierge())
}

// Jeu FICTIF, destine a montrer la restitution sans parcourir tout l'instrument.
export function chargerDemo() {
  const r = {}
  modele.dimensions.forEach((d, i) =>
    d.capability_areas.forEach((ca, j) => {
      if (ca.regime !== 'placeholder') r[ca.id] = ((i + j) % 4) + 1
    })
  )
  Object.assign(store, {
    contexte: { secteur: 'Horlogerie', effectif: '10-49', fonction: 'Direction',
                objectif: 'productivite_interne', risque: 'moyen', horizon: 'court' },
    reponses: r,
    demo: true
  })
}

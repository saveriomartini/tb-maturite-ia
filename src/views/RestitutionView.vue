<script setup>
import { computed } from 'vue'
import { store, modele } from '../store.js'
import { niveauDimension, avancementDimension, niveauCible } from '../scoring.js'
import FigureRadiale from '../components/FigureRadiale.vue'

const regle = modele.agregation.intra_dimension
const cible = computed(() => niveauCible(store.contexte))
const lignes = computed(() =>
  modele.dimensions.map((d) => {
    const av = avancementDimension(d, store.reponses)
    const n = niveauDimension(d, store.reponses, regle)
    return { d, av, n, ecart: n && cible.value ? n - cible.value : null }
  })
)
const completes = computed(() => lignes.value.filter((l) => l.n !== null))

function exporter() {
  const charge = {
    version_modele: modele._meta.version,
    horodatage: new Date().toISOString(),
    contexte: store.contexte,
    niveau_cible: cible.value,
    reponses: store.reponses,
    regle_agregation: regle
  }
  const url = URL.createObjectURL(new Blob([JSON.stringify(charge, null, 2)], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `diagnostic-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <nav class="fil">
    <router-link to="/">Profil</router-link> /
    <router-link to="/parcours">Parcours</router-link> / Restitution
  </nav>
  <span class="eyebrow">Ecran Project — convergence</span>
  <h1>Restitution</h1>
  <p class="chapeau">
    {{ store.contexte.secteur || 'secteur non renseigne' }} ·
    {{ store.contexte.effectif || '?' }} employes ·
    niveau vise {{ cible ?? 'non defini' }}
    <span v-if="store.demo" class="fictif"> · JEU DE DONNEES FICTIF</span>
  </p>

  <p v-if="completes.length < modele.dimensions.length" class="note">
    {{ completes.length }} axe(s) sur {{ modele.dimensions.length }} sont complets. Un axe incomplet
    n'affiche aucun niveau : l'absence de reponse n'est pas un niveau zero.
  </p>

  <h2>Niveaux par axe</h2>
  <table>
    <thead>
      <tr><th>Axe</th><th>DP</th><th>Avancement</th><th>Niveau</th><th>Ecart au vise</th></tr>
    </thead>
    <tbody>
      <tr v-for="l in lignes" :key="l.d.id">
        <td>
          {{ l.d.nom_fr }}
          <em v-if="l.d.origine === 'ajoutee'" class="ajout">ajoutee</em>
        </td>
        <td class="mono">{{ l.d.nb_ca }}</td>
        <td class="mono">{{ l.av.faits }}/{{ l.av.total }}</td>
        <td class="mono">{{ l.n ?? '—' }}</td>
        <td class="mono">{{ l.ecart === null ? '—' : (l.ecart > 0 ? '+' + l.ecart : l.ecart) }}</td>
      </tr>
    </tbody>
  </table>

  <h2>Profil detaille</h2>
  <div class="figures">
    <FigureRadiale v-for="l in lignes" :key="l.d.id" :dimension="l.d" :regle="regle" />
  </div>

  <p class="note">
    Aucun score global n'est produit. Le referentiel ne restitue jamais un nombre unique, et un
    minimum entre axes transformerait un choix strategique assume en verdict d'echec.
  </p>

  <p style="margin-top: 1.5rem">
    <button @click="exporter">Exporter mes reponses</button>
    <router-link class="bouton bouton-plat" style="margin-left: 0.6rem" to="/parcours">
      Retour au parcours
    </router-link>
  </p>

  <p class="note">
    La comparaison avec d'autres PME suppose une base de reponses accumulees, donc une API et un
    hebergement. Hors perimetre de cette maquette : l'export ci-dessus est le contrat de donnees
    qu'une telle API recevrait.
  </p>
</template>

<style scoped>
.figures { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem; }
.fictif { color: var(--laiton); font-family: var(--mono); font-size: 0.78rem; }
.ajout { font-size: 0.68rem; font-style: normal; color: var(--laiton); font-family: var(--mono); }
</style>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { store, modele, dimensionParId } from '../store.js'
import { niveauDimension, avancementDimension } from '../scoring.js'
import FigureRadiale from '../components/FigureRadiale.vue'

const route = useRoute()
const dim = computed(() => dimensionParId(route.params.id))
const socle = computed(() => modele.socles.find((s) => s.id === dim.value.socle))
const av = computed(() => avancementDimension(dim.value, store.reponses))
const niveau = computed(() => niveauDimension(dim.value, store.reponses, modele.agregation.intra_dimension))
</script>

<template>
  <nav class="fil">
    <router-link to="/">Profil</router-link> /
    <router-link to="/parcours">Parcours</router-link> / {{ dim.nom_fr }}
  </nav>
  <span class="eyebrow">{{ socle.nom }} — {{ socle.etiquette_elia }}</span>
  <h1>{{ dim.nom_fr }}</h1>
  <p class="chapeau">
    <template v-if="dim.origine === 'heritee'">
      {{ dim.nom_en }} — Ozkaya et al. (2026), section {{ dim.ref_ozkaya }}
    </template>
    <template v-else>
      Dimension ajoutee par l'auteur, absente du referentiel de base
    </template>
  </p>

  <p class="mono etat">
    {{ av.faits }} / {{ av.total }} domaines renseignes ·
    niveau de l'axe : {{ niveau ?? 'non calculable avant completion' }}
  </p>

  <h2>Domaines de pratique</h2>
  <table>
    <thead><tr><th>Ref</th><th>Domaine</th><th>Regime</th><th>Reponse</th></tr></thead>
    <tbody>
      <tr v-for="ca in dim.capability_areas" :key="ca.id">
        <td class="mono">{{ ca.id }}</td>
        <td>
          <router-link v-if="ca.regime !== 'placeholder'" :to="'/ca/' + ca.id">{{ ca.nom_fr }}</router-link>
          <span v-else>{{ ca.nom_fr }}</span>
          <br /><span class="en">{{ ca.nom_en }}</span>
        </td>
        <td class="mono petite">{{ ca.regime === 'placeholder' ? 'hors perimetre TB' : 'mesure' }}</td>
        <td class="mono">{{ store.reponses[ca.id] ?? '—' }}</td>
      </tr>
    </tbody>
  </table>

  <h2>Restitution de l'axe</h2>
  <FigureRadiale :dimension="dim" :regle="modele.agregation.intra_dimension" />
</template>

<style scoped>
.etat { color: var(--gris); font-size: 0.8rem; }
.en { color: var(--gris); font-style: italic; font-size: 0.82rem; }
.petite { font-size: 0.72rem; color: var(--gris); }
</style>

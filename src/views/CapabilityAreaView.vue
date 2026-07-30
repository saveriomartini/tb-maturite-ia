<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { caParId, dimensionDeLaCa, modele } from '../store.js'
import EchelleEnonces from '../components/EchelleEnonces.vue'

const route = useRoute()
const router = useRouter()
const ca = computed(() => caParId(route.params.id))
const dim = computed(() => dimensionDeLaCa(route.params.id))
const rubrique = computed(() => modele.rubrique_niveau)
</script>

<template>
  <nav class="fil">
    <router-link to="/parcours">Parcours</router-link> /
    <router-link :to="'/dimension/' + dim.id">{{ dim.nom_fr }}</router-link> / {{ ca.id }}
  </nav>
  <span class="eyebrow">{{ ca.id }} · {{ ca.ref_source }}</span>
  <h1>{{ ca.nom_fr }}</h1>
  <p class="chapeau">{{ ca.nom_en }}</p>

  <h2>Objectifs poursuivis</h2>
  <ul class="goals">
    <li v-for="g in ca.goals" :key="g.id">
      {{ g.intitule }} <span class="src mono">{{ g.source }}</span>
    </li>
  </ul>

  <h2>Ou se situe votre entreprise ?</h2>
  <EchelleEnonces :ca-id="ca.id" />

  <h2>Couverture inter-modeles</h2>
  <table>
    <thead><tr><th>Critere</th><th>Role</th><th>Modeles attestant</th></tr></thead>
    <tbody>
      <tr v-for="r in ca.rattachements" :key="r.critere">
        <td class="mono">{{ r.critere }}</td>
        <td class="mono">{{ r.role }}</td>
        <td class="petite">
          <span v-for="(deg, m) in r.degres_par_modele" :key="m">{{ m }} ({{ deg }}) · </span>
        </td>
      </tr>
    </tbody>
  </table>

  <p style="margin-top: 1.5rem">
    <button class="bouton-plat" @click="router.push('/dimension/' + dim.id)">Retour a l'axe</button>
  </p>
</template>

<style scoped>
.goals { padding-left: 1.1rem; font-size: 0.92rem; }
.src { color: var(--laiton); font-size: 0.72rem; }
.petite { font-size: 0.75rem; color: var(--gris); }
</style>

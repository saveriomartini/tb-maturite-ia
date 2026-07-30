<script setup>
import { computed } from 'vue'
import { store, dimensionsParSocle } from '../store.js'
import { avancementDimension } from '../scoring.js'

const props = defineProps({ socle: Object })
const dims = computed(() => dimensionsParSocle(props.socle.id))
const avancement = computed(() => {
  const t = dims.value.map((d) => avancementDimension(d, store.reponses))
  return { faits: t.reduce((s, x) => s + x.faits, 0), total: t.reduce((s, x) => s + x.total, 0) }
})
</script>

<template>
  <section class="socle">
    <span class="eyebrow">{{ socle.etiquette_elia }}</span>
    <h3>{{ socle.nom }}</h3>
    <p class="avancement mono">
      {{ avancement.faits }} / {{ avancement.total }} domaines renseignes
    </p>
    <ul>
      <li v-for="d in dims" :key="d.id">
        <router-link :to="'/dimension/' + d.id">{{ d.nom_fr }}</router-link>
        <span class="compte" :title="d.nb_ca + ' domaines de pratique composent cet axe'">
          {{ d.nb_ca }} DP
        </span>
        <em v-if="d.origine === 'ajoutee'" class="ajout">dimension ajoutee</em>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.socle { border: 1px solid var(--trait); border-radius: 4px; padding: 0.9rem 1rem; background: #fff; }
h3 { margin: 0 0 0.15rem; }
.avancement { color: var(--gris); font-size: 0.75rem; margin: 0 0 0.6rem; }
ul { list-style: none; margin: 0; padding: 0; }
li { display: flex; align-items: center; gap: 0.5rem; padding: 0.3rem 0; border-top: 1px solid var(--trait); font-size: 0.9rem; }
li:first-child { border-top: none; }
a { color: var(--encre); text-decoration: none; flex: 1; }
a:hover { color: var(--ardoise); text-decoration: underline; }
.ajout { font-size: 0.68rem; font-style: normal; color: var(--laiton); font-family: var(--mono); }
</style>

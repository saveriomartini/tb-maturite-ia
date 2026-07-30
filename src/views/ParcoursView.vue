<script setup>
import { computed } from 'vue'
import { modele, store } from '../store.js'
import TuileSocle from '../components/TuileSocle.vue'

const socles = computed(() => modele.socles.filter((s) => s.navigable))
const total = computed(() =>
  modele.dimensions.flatMap((d) => d.capability_areas).filter((c) => c.regime !== 'placeholder').length
)
const faits = computed(() => Object.keys(store.reponses).length)
</script>

<template>
  <nav class="fil"><router-link to="/">Profil</router-link> / Parcours</nav>
  <span class="eyebrow">Carte du parcours</span>
  <h1>Six socles, ordre libre</h1>
  <p class="chapeau mono">{{ faits }} / {{ total }} domaines de pratique renseignes</p>

  <div class="grille">
    <TuileSocle v-for="s in socles" :key="s.id" :socle="s" />
  </div>

  <p style="margin-top: 2rem">
    <router-link class="bouton" to="/restitution">Voir la restitution</router-link>
  </p>

  <p class="note">
    Le nombre de domaines de pratique (DP) est indique en face de chaque axe. Il n'est pas
    decoratif : le niveau d'un axe etant celui de son domaine le plus bas, un axe compose de
    quatre domaines est mecaniquement plus difficile a faire monter qu'un axe compose d'un seul.
  </p>
</template>

<template>
  <div class="scope-section">
    <p class="intro">{{ vm.intro }}</p>

    <div class="profiles">
      <div
        class="profiles__options"
        role="radiogroup"
        aria-label="Profil d’adoption consulté"
        :style="{ '--profile-count': vm.profiles.length }"
      >
        <button
          v-for="option in vm.profiles"
          :key="option.n"
          type="button"
          role="radio"
          class="chip profiles__option"
          :class="{ 'is-active': option.n === profile }"
          :aria-checked="option.n === profile"
          :title="option.tag"
          @click="select(option.n)"
        >
          {{ option.label }}
        </button>
      </div>
      <p class="profiles__hint">{{ hint }}</p>
    </div>

    <ScopeMap class="scope" :blocks="blocks" />
  </div>
</template>

<script setup>
// Carte des areas du modèle. Ce n'est pas le questionnaire — c'est l'explication
// de ce sur quoi il porte, d'où son passage dans la page d'information : on la
// consulte quand on veut comprendre la sélection, pas au moment de répondre.
//
// Elle ne suit plus le cadrage de la session : la barre de profils ci-dessous
// est sa seule commande. On peut donc venir y lire ce que chaque profil met en
// jeu avant d'avoir décrit quoi que ce soit, et rien de ce qu'on y clique
// n'atteint le diagnostic.
import { computed, ref } from 'vue'
import ScopeMap from '../ScopeMap.vue'

const props = defineProps({
  vm: { type: Object, required: true }
})

// `null` : aucun profil consulté, la carte est entière. L'état vit ici et nulle
// part ailleurs — il n'est ni persisté ni partagé, et repart à zéro à chaque
// visite, ce qui est la garantie que la lecture reste indépendante de la session.
const profile = ref(null)

// Même convention qu'ailleurs dans l'outil : recliquer l'option retenue l'annule.
function select(n) {
  profile.value = profile.value === n ? null : n
}

const selected = computed(() => props.vm.profiles.find(option => option.n === profile.value) || null)

const hint = computed(() => (selected.value
  ? `« ${selected.value.label} » met en jeu ${selected.value.count} domaines de capacité sur ` +
    `${props.vm.total}. Les autres restent affichés, éteints. Recliquez le profil pour revenir ` +
    'à la carte entière.'
  : `Aucun profil retenu : les ${props.vm.total} domaines de capacité évaluables du modèle. ` +
    'Choisissez un profil pour voir ceux qu’il met en jeu.'))

// Le partage entre allumé et éteint se décide ici, faute d'être connu du
// view-model : une dimension s'éteint quand aucune de ses areas n'est en jeu.
const blocks = computed(() => props.vm.blocks.map(block => ({
  ...block,
  dimensions: block.dimensions.map(dimension => {
    const areas = dimension.areas.map(area => ({
      ...area,
      inScope: profile.value == null || area.level <= profile.value
    }))
    return { ...dimension, areas, inScope: areas.some(area => area.inScope) }
  })
})))
</script>

<style scoped>
/* Chapô et glose tiennent la largeur de la carte des domaines qu'ils
   commentent, comme les autres textes de la page d'information. */
.intro {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
}

.profiles {
  margin-top: 18px;
}

/* Une colonne par profil, sur toute la largeur. Les cinq étaient posés en
   `flex-wrap` : ils se serraient à gauche, chacun à la largeur de son libellé,
   si bien que « Exploration localisée » et « Redéfinition stratégique du
   périmètre » n'avaient ni la même taille ni le même poids à l'œil — alors que
   ce sont cinq rangs d'une même échelle, et qu'aucun ne prime sur les autres.
   À colonnes égales, l'échelle se lit comme une échelle, et la barre tient la
   largeur de la carte qu'elle commande.

   Le nombre vient des données, comme pour les phases du parcours : ce sont les
   profils du modèle, et rien ici ne doit rester à corriger si le modèle en
   gagne ou en perd un. */
.profiles__options {
  display: grid;
  grid-template-columns: repeat(var(--profile-count, 5), 1fr);
  gap: 6px;
}

/* Le libellé se replie dans sa colonne — `chip--nowrap` a été retiré du gabarit
   avec le passage en grille : à largeur imposée, les libellés longs
   déborderaient au lieu de tenir. Le texte se cale en haut pour que cinq
   pastilles d'une et deux lignes commencent toutes à la même hauteur. */
.profiles__option {
  --chip-padding: 8px 12px;
  --chip-font-size: 11px;
  align-items: flex-start;
}

.profiles__hint {
  margin: 10px 0 0;
  font-size: 10.5px;
  line-height: 1.45;
  color: var(--color-neutral-700);
}

.scope {
  margin-top: 22px;
}

/* Cinq colonnes de libellés longs ne tiennent plus sous 900px : la barre passe
   à deux colonnes plutôt qu'à cinq colonnes illisibles. Elle reste une grille,
   donc les pastilles gardent des largeurs égales. */
@media (max-width: 900px) {
  .profiles__options {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

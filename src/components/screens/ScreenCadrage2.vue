<template>
  <AppScreen spacing="loose">
    <aside class="callout">
      <p class="callout__title heading">NB</p>
      <p class="callout__text">
        Il est très important de bien définir (avec ou sans l'assistance offerte par l'outil) son
        niveau cible AVANT l'évaluation. Cela permet de sélectionner les areas de compétence
        intéressantes pour l'organisation et d'établir ainsi les priorités d'action.
      </p>
    </aside>

    <div class="callout-nav">
      <AppScreenNav align="end" @back="emit('back')" @next="emit('next')" />
    </div>
  </AppScreen>
</template>

<script setup>
import AppScreen from '../AppScreen.vue'
import AppScreenNav from '../AppScreenNav.vue'

const emit = defineEmits(['back', 'next'])
</script>

<style scoped>
.callout {
  max-width: 900px;
  padding: 24px 28px;
  border-left: 6px solid var(--color-text);
  background: var(--color-neutral-100);
}

.callout__title {
  margin: 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.callout__text {
  margin: 10px 0 0;
  font-size: 19px;
  line-height: 1.45;
  text-wrap: pretty;
}

.callout-nav {
  max-width: 900px;
  --nav-margin-top: 32px;
}
</style>

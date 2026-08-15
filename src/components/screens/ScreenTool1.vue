<template>
  <AppScreen class="tool1">
    <ScreenCadrage3
      :vm="cadrage3"
      @select-option="(fieldId, value) => emit('select-option', fieldId, value)"
      @toggle-context="emit('toggle-context')"
      @select-transformation="emit('select-transformation', $event)"
      @toggle-transformation="emit('toggle-transformation')"
    />

    <AppScreenNav next-label="Passer à l'évaluation" @back="emit('back')" @next="emit('next')" />
  </AppScreen>
</template>

<script setup>
// Page de cadrage. Elle ne porte plus que le gabarit et la navigation : son
// contenu tient entier dans ScreenCadrage3, NB compris.
//
// Elle a d'abord été trois écrans, puis une page en deux sections qu'un bouton
// faisait défiler. Le NB une fois collé au formulaire, il n'y avait plus de
// distance à franchir : bouton, titres et séparateur ont suivi.
import AppScreen from '../AppScreen.vue'
import AppScreenNav from '../AppScreenNav.vue'
import ScreenCadrage3 from './ScreenCadrage3.vue'

defineProps({
  cadrage3: { type: Object, required: true }
})

const emit = defineEmits([
  'select-option', 'toggle-context', 'select-transformation', 'toggle-transformation', 'back', 'next'
])
</script>

<style scoped>
.tool1 {
  max-width: 1180px;
}
</style>

<template>
  <AppScreen class="tool1">
    <ScreenCadrage3
      ref="cadrage"
      :vm="cadrage3"
      @select-option="(fieldId, value) => emit('select-option', fieldId, value)"
      @dismiss-warning="emit('dismiss-warning')"
      @next="emit('next')"
    />

    <AppScreenNav
      next-label="Passer à l'évaluation"
      @back="emit('back')"
      @next="requestNext"
    />
  </AppScreen>
</template>

<script setup>
// Page de cadrage. Elle ne porte que le gabarit et la navigation : son contenu
// tient entier dans ScreenCadrage3.
//
// Elle a d'abord été trois écrans, puis une page en deux sections qu'un bouton
// faisait défiler. Le NB une fois collé au formulaire, il n'y avait plus de
// distance à franchir : bouton, titres et séparateur ont suivi, puis le NB
// lui-même, passé dans la modale du saut.
//
// Le départ vers l'évaluation ne s'émet pas d'ici : il passe par ScreenCadrage3,
// qui décide s'il faut d'abord avertir d'un formulaire laissé vide. Il n'est
// plus fermé pour autant — le degré de transformation, seule réponse qui
// l'exigeait, se demande désormais à l'ancrage, et plus rien du cadrage n'est
// nécessaire au questionnaire. Reste le garde-fou qui se discute, et lui seul.
import { useTemplateRef } from 'vue'
import AppScreen from '../AppScreen.vue'
import AppScreenNav from '../AppScreenNav.vue'
import ScreenCadrage3 from './ScreenCadrage3.vue'

defineProps({
  cadrage3: { type: Object, required: true }
})

const emit = defineEmits(['select-option', 'dismiss-warning', 'back', 'next'])

const cadrage = useTemplateRef('cadrage')

function requestNext() {
  cadrage.value?.requestNext()
}
</script>

<style scoped>
/* Le cadrage ne s'étale pas sur toute la largeur : ses champs restent sur deux
   colonnes lisibles. La largeur est posée sur l'écran, pas sur le seul contenu,
   pour que le pied de page finisse où finissent les blocs qu'il conclut — le
   départ vers l'évaluation s'aligne sur le bord droit du contexte descriptif. */
.tool1 {
  max-width: 1040px;
}
</style>

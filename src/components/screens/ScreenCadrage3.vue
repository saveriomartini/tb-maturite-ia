<template>
  <div class="cadrage3">
    <TransformationQuestion
      :field="vm.transformation.field"
      :open="vm.transformation.open"
      :toggle-label="vm.transformation.toggleLabel"
      @select="emit('select-transformation', $event)"
      @toggle="emit('toggle-transformation')"
    />

    <ContextAttributeForm
      :groups="vm.groups"
      :descriptive-fields="vm.descriptiveFields"
      :show-context="vm.showContext"
      :toggle-label="vm.contextToggleLabel"
      @select-option="(fieldId, value) => emit('select-option', fieldId, value)"
      @toggle-context="emit('toggle-context')"
    />
  </div>
</template>

<script setup>
// Cadrage du contexte. L'écran ne montre plus ce que le formulaire produit :
// la recommandation se calcule en arrière-plan et n'est expliquée qu'au palier,
// une fois la première série d'areas parcourue. Section basse de la page de
// cadrage, on y arrive en défilant depuis le NB qui la justifie.
//
// La question du degré de transformation coiffe le formulaire : ce qu'on veut
// devenir se demande avant ce qu'on est.
import ContextAttributeForm from '../ContextAttributeForm.vue'
import TransformationQuestion from '../TransformationQuestion.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['select-option', 'toggle-context', 'select-transformation', 'toggle-transformation'])
</script>

<style scoped>
/* Le formulaire ne s'étale pas sur toute la largeur : ses champs restent sur
   deux colonnes lisibles, comme lorsqu'il partageait l'écran avec le panneau
   de recommandation. */
.cadrage3 {
  max-width: 1040px;
}
</style>

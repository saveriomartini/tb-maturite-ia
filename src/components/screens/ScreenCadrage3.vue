<template>
  <div class="cadrage3">
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
import ContextAttributeForm from '../ContextAttributeForm.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['select-option', 'toggle-context'])
</script>

<style scoped>
/* Le formulaire ne s'étale pas sur toute la largeur : ses champs restent sur
   deux colonnes lisibles, comme lorsqu'il partageait l'écran avec le panneau
   de recommandation. */
.cadrage3 {
  max-width: 1040px;
}
</style>

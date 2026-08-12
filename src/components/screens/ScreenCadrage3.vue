<template>
  <AppScreen class="cadrage3">
    <ContextAttributeForm
      :groups="vm.groups"
      :descriptive-fields="vm.descriptiveFields"
      :show-context="vm.showContext"
      :toggle-label="vm.contextToggleLabel"
      @select-option="(fieldId, value) => emit('select-option', fieldId, value)"
      @toggle-context="emit('toggle-context')"
    />

    <div>
      <TargetRecommendationPanel
        :recommendation="vm.recommendation"
        :target-options="vm.targetOptions"
        :mismatch-label="vm.mismatchLabel"
        :scope-summary="vm.scopeSummary"
        @select="emit('select-target', $event)"
        @apply="emit('apply-recommendation')"
      />
      <div class="cadrage3__nav">
        <AppScreenNav next-label="Suivant" @back="emit('back')" @next="emit('next')" />
      </div>
    </div>
  </AppScreen>
</template>

<script setup>
import AppScreen from '../AppScreen.vue'
import AppScreenNav from '../AppScreenNav.vue'
import ContextAttributeForm from '../ContextAttributeForm.vue'
import TargetRecommendationPanel from '../TargetRecommendationPanel.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['select-option', 'select-target', 'apply-recommendation', 'toggle-context', 'back', 'next'])
</script>

<style scoped>
.cadrage3 {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  align-items: start;
}

.cadrage3__nav {
  --nav-margin-top: 20px;
}
</style>

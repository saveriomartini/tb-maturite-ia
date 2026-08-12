<template>
  <AppScreen>
    <div class="intro">
      <p class="level-badge">{{ vm.targetLabel }}</p>
      <p class="intro__text">
        selon le niveau cible vous êtes soumis seulement aux pratiques et objectifs qui vous
        concernent : {{ vm.scopeSummary }}
      </p>
    </div>

    <ScopeMap class="scope" :blocks="vm.blocks" />

    <AppScreenNav next-label="Commencer" @back="emit('back')" @next="emit('next')" />
  </AppScreen>
</template>

<script setup>
import AppScreen from '../AppScreen.vue'
import AppScreenNav from '../AppScreenNav.vue'
import ScopeMap from '../ScopeMap.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['back', 'next'])
</script>

<style scoped>
.intro {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 16px;
}

.intro__text {
  max-width: 620px;
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
}

.level-badge {
  margin: 0;
}

.scope {
  margin-top: 22px;
}
</style>

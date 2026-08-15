<template>
  <AppScreen class="tool3">
    <ScreenResti1 :vm="resti1" />

    <section class="zone">
      <ScreenResti2 :vm="resti2" />
    </section>

    <AppScreenNav next-label="Voir les écarts" @back="emit('back')" @next="emit('next')" />
  </AppScreen>
</template>

<script setup>
// Page de résultats : la synthèse en haut, le détail par area en dessous. Les
// deux se lisaient auparavant sur deux écrans séparés, ce qui obligeait à
// naviguer pour rapprocher un chiffre global de sa décomposition.
import AppScreen from '../AppScreen.vue'
import AppScreenNav from '../AppScreenNav.vue'
import ScreenResti1 from './ScreenResti1.vue'
import ScreenResti2 from './ScreenResti2.vue'

defineProps({
  resti1: { type: Object, required: true },
  resti2: { type: Object, required: true }
})

const emit = defineEmits(['back', 'next'])
</script>

<style scoped>
.zone {
  margin-top: 34px;
  padding-top: 22px;
  border-top: 2px solid var(--color-text);
}
</style>

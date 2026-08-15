<template>
  <div class="scope-section">
    <p class="intro">{{ vm.intro }}</p>

    <ScopeMap class="scope" :blocks="vm.blocks" />
  </div>
</template>

<script setup>
// Carte des areas retenues. Ce n'est pas le questionnaire — c'est l'explication
// de ce sur quoi il porte, d'où son passage dans la page d'information : on la
// consulte quand on veut comprendre la sélection, pas au moment de répondre.
import ScopeMap from '../ScopeMap.vue'

defineProps({
  vm: { type: Object, required: true }
})
</script>

<style scoped>
.intro {
  max-width: 720px;
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
}

.scope {
  margin-top: 22px;
}
</style>

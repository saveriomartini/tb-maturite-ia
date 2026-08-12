<template>
  <div class="summary">
    <p class="summary__item"><span class="summary__key">Niveau Cible (Recommandé) : </span>{{ targetLabel }}</p>
    <p class="summary__item"><span class="summary__key">Niveau Acquis : </span>{{ acquiredLabel }}</p>
  </div>
</template>

<script setup>
// Rappel cible / acquis, en tête des écrans de restitution.
defineProps({
  targetLabel: { type: String, required: true },
  acquiredLabel: { type: String, required: true }
})
</script>

<style scoped>
.summary {
  display: flex;
  gap: 36px;
  flex-wrap: wrap;
  font-size: 12px;
}

.summary__item {
  margin: 0;
}

.summary__key {
  font-weight: 700;
}
</style>

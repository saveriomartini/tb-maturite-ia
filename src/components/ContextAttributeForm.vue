<template>
  <section class="panel">
    <h2 class="panel-head form__title">Attributs de contexte — votre organisation</h2>

    <div v-for="group in groups" :key="group.id" class="group">
      <h3 class="group__title heading">{{ group.label }}</h3>
      <div class="group__fields">
        <ContextField
          v-for="field in group.fields"
          :key="field.id"
          :field="field"
          @select="emit('select-option', field.id, $event)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
// Le formulaire ne porte plus que les attributs qui pèsent sur le diagnostic.
// Les attributs documentaires, qui n'y entrent pas, ont leur propre panneau
// (DescriptiveContext) : les tenir sous un repli au bas de celui-ci les faisait
// passer pour une suite facultative du même formulaire.
import ContextField from './ContextField.vue'

defineProps({
  groups: { type: Array, required: true }
})

const emit = defineEmits(['select-option'])
</script>

<style scoped>
.form__title {
  margin: 0;
  padding: 10px 18px;
  font-family: var(--font-body);
  line-height: inherit;
  letter-spacing: 0.1em;
}

.group {
  border-bottom: 1px solid var(--color-divider);
}

.group__title {
  margin: 0;
  padding: 10px 20px 0;
  font-size: 12px;
  letter-spacing: 0.02em;
}

.group__fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 28px;
  padding: 12px 20px 20px;
}

/* Le dernier groupe ferme le panneau : son filet doublerait la bordure. */
.group:last-child {
  border-bottom: 0;
}

@media (max-width: 900px) {
  .group__fields {
    grid-template-columns: 1fr;
    padding: 12px 16px 18px;
  }

  .group__title {
    padding-inline: 16px;
  }
}
</style>

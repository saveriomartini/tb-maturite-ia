<template>
  <section class="panel">
    <h2 class="panel-head form__title">Attributs de contexte — périmètre et niveau cible</h2>

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

    <div class="descriptive">
      <button
        type="button"
        class="btn btn-ghost descriptive__toggle"
        :aria-expanded="showContext"
        aria-controls="descriptive-fields"
        @click="emit('toggle-context')"
      >
        {{ toggleLabel }}
      </button>
      <div v-show="showContext" id="descriptive-fields">
        <p class="descriptive__intro">
          Attributs documentaires issus de la Table 1 du modèle. Ils décrivent l’unité évaluée et
          n’interviennent pas dans le calcul du niveau cible.
        </p>
        <div class="descriptive__fields">
          <ContextField
            v-for="field in descriptiveFields"
            :key="field.id"
            :field="field"
            @select="emit('select-option', field.id, $event)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import ContextField from './ContextField.vue'

defineProps({
  groups: { type: Array, required: true },
  descriptiveFields: { type: Array, required: true },
  showContext: { type: Boolean, required: true },
  toggleLabel: { type: String, required: true }
})

const emit = defineEmits(['select-option', 'toggle-context'])
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

.descriptive {
  padding: 12px 20px 18px;
}

.descriptive__toggle {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-inline: 0;
}

.descriptive__intro {
  max-width: 640px;
  margin: 4px 0 14px;
  font-size: 10.5px;
  color: var(--color-neutral-700);
}

.descriptive__fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 28px;
}
</style>

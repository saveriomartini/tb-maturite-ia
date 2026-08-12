<template>
  <fieldset class="field">
    <legend class="field__label">{{ field.label }}</legend>
    <div class="field__options" role="radiogroup" :aria-label="field.label">
      <button
        v-for="option in field.options"
        :key="option.value"
        type="button"
        role="radio"
        class="chip chip--nowrap field__option"
        :class="{ 'is-active': option.active }"
        :aria-checked="option.active"
        @click="emit('select', option.value)"
      >
        {{ option.label }}
      </button>
    </div>
    <p v-if="field.hint" class="field__hint">{{ field.hint }}</p>
  </fieldset>
</template>

<script setup>
// Un attribut de contexte : son libellé, ses options exclusives, son aide.
// Recliquer sur l'option retenue l'annule — c'est le parent qui en décide.
defineProps({
  field: { type: Object, required: true }
})

const emit = defineEmits(['select'])
</script>

<style scoped>
.field {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.field__label {
  padding: 0;
  margin-bottom: 7px;
  font-size: 11px;
  font-weight: 700;
}

.field__options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.field__option {
  --chip-padding: 7px 11px;
  --chip-font-size: 11px;
}

.field__hint {
  margin: 6px 0 0;
  font-size: 10.5px;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}
</style>

<template>
  <fieldset class="field">
    <legend class="field__label">
      {{ field.label }}
      <button
        v-if="hasDetail"
        type="button"
        class="button-reset field__toggle"
        :aria-expanded="open"
        :aria-controls="detailId"
        :aria-label="toggleLabel"
        @click="open = !open"
      >
        {{ open ? '−' : '+' }}
      </button>
    </legend>
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

    <div v-show="open" :id="detailId" class="field__detail">
      <p v-if="field.hint" class="field__hint">{{ field.hint }}</p>
      <dl v-if="field.criteria.length" class="criteria">
        <div
          v-for="criterion in field.criteria"
          :key="criterion.value"
          class="criteria__row"
          :class="{ 'is-active': criterion.active }"
        >
          <dt class="criteria__term">{{ criterion.label }}</dt>
          <dd class="criteria__def">{{ criterion.text }}</dd>
        </div>
      </dl>
    </div>
  </fieldset>
</template>

<script setup>
// Un attribut de contexte : son libellé, ses options exclusives, son aide.
// Recliquer sur l'option retenue l'annule — c'est le parent qui en décide.
//
// Au repos, un attribut ne montre que son libellé et ses options : c'est ce dont
// on a besoin pour répondre. Tout le texte explicatif — l'aide, et les critères
// d'acceptation des attributs qui plafonnent le niveau cible — vit derrière le
// « + » du libellé, pour n'être déplié que sur l'attribut en discussion.
// L'état ouvert/fermé est purement local : il ne décrit pas l'évaluation et n'a
// pas à survivre à la session.
import { computed, ref, useId } from 'vue'

const props = defineProps({
  field: { type: Object, required: true }
})

const emit = defineEmits(['select'])

const open = ref(false)
const uid = useId()
const detailId = computed(() => `detail-${props.field.id}-${uid}`)
const hasDetail = computed(() => Boolean(props.field.hint) || props.field.criteria.length > 0)
const toggleLabel = computed(() =>
  `${open.value ? 'Masquer' : 'Afficher'} l’aide et les critères — ${props.field.label}`
)
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

/* Affordance discrète : présente sur chaque attribut, elle ne doit pas
   concurrencer le libellé qu'elle suit. */
.field__toggle {
  margin-left: 5px;
  font-size: 13px;
  line-height: 1;
  font-weight: 400;
  color: var(--color-neutral-600);
}

.field__toggle:hover {
  color: var(--color-text);
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

.field__detail {
  margin-top: 8px;
  padding-left: 10px;
  border-left: 2px solid var(--color-divider);
}

.field__hint {
  margin: 0;
  font-size: 10.5px;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

.criteria {
  display: grid;
  gap: 7px;
  margin: 7px 0 0;
}

.criteria__row {
  font-size: 10.5px;
  line-height: 1.45;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

/* L'option retenue est rappelée en pleine teinte : après le choix, la liste
   sert de justification du niveau plafonné. */
.criteria__row.is-active {
  color: var(--color-text);
}

.criteria__term {
  display: inline;
  font-weight: 700;
  color: var(--color-text);
}

.criteria__def {
  display: inline;
  margin: 0;
}

.criteria__def::before {
  content: ' — ';
}
</style>

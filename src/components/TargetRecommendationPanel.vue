<template>
  <div>
    <section class="card">
      <header class="card__head">
        <h2 class="eyebrow card__title">Profil visé recommandé</h2>
        <span v-if="recommendation.provisional" class="tag card__provisional">recommandation indicative</span>
      </header>

      <p class="card__level heading">{{ recommendation.label }}</p>

      <dl class="factors">
        <div v-for="factor in recommendation.factors" :key="factor.key" class="factor">
          <dt class="factor__key">{{ factor.key }}</dt>
          <dd class="factor__value">{{ factor.value }}</dd>
        </div>
      </dl>

      <p v-if="recommendation.why" class="card__why">{{ recommendation.why }}</p>

      <div class="completeness">
        <p class="completeness__label">{{ recommendation.completenessLabel }}</p>
        <div
          class="completeness__track"
          role="progressbar"
          :aria-valuenow="recommendation.completenessPercent"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="recommendation.completenessLabel"
        >
          <div class="completeness__bar" :style="{ width: `${recommendation.completenessPercent}%` }" />
        </div>
      </div>

      <button
        v-if="recommendation.canApply"
        type="button"
        class="card__apply"
        @click="emit('apply')"
      >
        {{ recommendation.applyLabel }}
      </button>
    </section>

    <section class="target panel">
      <h2 class="target__title">Profil visé retenu :</h2>
      <div class="target__options" role="radiogroup" aria-label="Profil visé retenu">
        <button
          v-for="option in targetOptions"
          :key="option.n"
          type="button"
          role="radio"
          class="chip chip--nowrap target__option"
          :class="{ 'is-active': option.active }"
          :aria-checked="option.active"
          @click="emit('select', option.n)"
        >
          <span>{{ option.label }}</span>
          <span v-if="option.recommended" class="tag target__badge">recommandé</span>
        </button>
      </div>
      <p v-if="mismatchLabel" class="target__mismatch">{{ mismatchLabel }}</p>
      <p class="target__scope">{{ scopeSummary }}</p>
    </section>
  </div>
</template>

<script setup>
// Colonne de droite du cadrage : ce que le modèle recommande, et ce que
// l'organisation retient — les deux peuvent diverger, c'est assumé et affiché.
defineProps({
  recommendation: { type: Object, required: true },
  targetOptions: { type: Array, required: true },
  mismatchLabel: { type: String, default: '' },
  scopeSummary: { type: String, required: true }
})

const emit = defineEmits(['select', 'apply'])
</script>

<style scoped>
.card {
  padding: 20px;
  border: 2px solid var(--color-text);
  background: var(--color-text);
  color: #fff;
}

.card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.card__title {
  margin: 0;
  font-family: var(--font-body);
  line-height: inherit;
}

.card__provisional {
  border-color: #fff;
  padding: 2px 6px;
}

.card__level {
  margin: 12px 0 0;
  font-size: 26px;
  line-height: 1.1;
  letter-spacing: normal;
}

.factors {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 14px 0 0;
}

.factor {
  font-size: 11.5px;
  line-height: 1.4;
}

.factor__key {
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-size: 9px;
  font-weight: 800;
  opacity: 0.7;
}

.factor__value {
  margin: 0;
}

.card__why {
  margin: 14px 0 0;
  font-size: 11.5px;
  line-height: 1.45;
  opacity: 0.85;
}

.completeness {
  margin-top: 16px;
}

.completeness__label {
  margin: 0;
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 800;
  opacity: 0.75;
}

.completeness__track {
  height: 4px;
  margin-top: 6px;
  background: rgba(255, 255, 255, 0.25);
}

.completeness__bar {
  height: 100%;
  background: #fff;
}

.card__apply {
  width: 100%;
  margin-top: 16px;
  padding: 9px 10px;
  border: 1px solid #fff;
  background: transparent;
  color: #fff;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 11px;
  cursor: pointer;
}

.card__apply:hover {
  background: rgba(255, 255, 255, 0.12);
}

.target {
  padding: 18px;
  border-top: 0;
}

.target__title {
  margin: 0 0 8px;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  line-height: inherit;
}

.target__options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.target__option {
  --chip-padding: 8px 10px;
  --chip-font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
}

.target__badge {
  font-size: 8.5px;
  letter-spacing: 0.07em;
  padding: 1px 4px;
  margin-left: 6px;
}

.target__mismatch {
  margin: 12px 0 0;
  padding: 6px 0 6px 9px;
  border-left: 3px solid var(--color-text);
  font-size: 10.5px;
  line-height: 1.4;
  color: var(--color-neutral-800);
}

.target__scope {
  margin: 12px 0 0;
  font-size: 11px;
  color: var(--color-neutral-700);
}
</style>

<template>
  <div class="goals">
    <section v-for="(goal, goalIndex) in goals" :key="goalIndex" class="goal" :class="{ 'is-done': goal.done }">
      <header class="goal__head">
        <h3 class="goal__label">{{ goal.label }}</h3>
        <p class="goal__text">{{ goal.text }}</p>
        <span class="goal__state">{{ goal.done ? 'atteint' : 'non atteint' }}</span>
      </header>

      <div class="practices">
        <button
          v-for="practice in goal.practices"
          :key="practice.key"
          type="button"
          class="practice"
          :class="{ 'is-checked': practice.checked }"
          :aria-pressed="practice.checked"
          @click="emit('toggle', practice.key)"
        >
          <span class="practice__mark">{{ practice.checked ? 'oui' : 'non' }}</span>
          <span class="practice__text">{{ practice.text }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
// Objectifs de l'area courante et pratiques à valider. Chaque pratique est un
// interrupteur oui/non : un objectif n'est atteint que si toutes le sont.
defineProps({
  goals: { type: Array, required: true }
})

const emit = defineEmits(['toggle'])
</script>

<style scoped>
.goals {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.goal {
  padding: 2px 0 14px 14px;
  border-left: 3px solid var(--color-neutral-300);
  border-bottom: 1px solid var(--color-divider);
}

.goal.is-done {
  border-left-color: var(--color-text);
}

.goal__head {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.goal__label {
  width: 74px;
  flex: none;
  margin: 0;
  padding-top: 1px;
  font-family: var(--font-body);
  font-size: 11.5px;
  font-weight: 800;
  line-height: inherit;
  letter-spacing: normal;
}

.goal__text {
  max-width: 760px;
  margin: 0;
  font-size: 12.5px;
  line-height: 1.45;
}

.goal__state {
  margin-left: auto;
  flex: none;
  padding: 3px 7px;
  border: 1px solid var(--color-neutral-400);
  color: var(--color-neutral-600);
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 800;
}

.is-done .goal__state {
  border-color: var(--color-text);
  color: var(--color-text);
  background: var(--color-neutral-200);
}

.practices {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(215px, 1fr));
  align-items: stretch;
  gap: 8px;
  margin-top: 12px;
  padding-left: 86px;
}

/* validée : la bordure épaissit et le rembourrage compense, la carte ne bouge pas */
.practice {
  display: block;
  padding: 12px 13px;
  border: 1px solid var(--color-neutral-400);
  background: #fff;
  color: var(--color-text);
  font: inherit;
  font-weight: 400;
  text-align: left;
  text-wrap: pretty;
  cursor: pointer;
}

.practice:hover {
  border-color: var(--color-text);
}

.practice.is-checked {
  padding: 10px 11px;
  border-width: 3px;
  border-color: var(--color-text);
  font-weight: 600;
}

.practice__mark {
  display: block;
  margin-bottom: 6px;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 800;
  color: var(--color-neutral-600);
}

.is-checked .practice__mark {
  color: var(--color-text);
}

.practice__text {
  display: block;
  font-size: 11.5px;
  line-height: 1.5;
}
</style>

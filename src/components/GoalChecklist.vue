<template>
  <div class="goals">
    <section
      v-for="(goal, goalIndex) in goals"
      :key="goalIndex"
      class="goal"
      :class="{ 'is-started': goal.started, 'is-done': goal.done }"
    >
      <header class="goal__head">
        <p class="goal__text">{{ goal.text }}</p>
        <span class="goal__mark" role="img" :aria-label="goal.stateLabel" :title="goal.stateLabel" />
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
          <span class="practice__mark" aria-hidden="true" />
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

/* la marge s'engage à la première coche : elle dit que l'objectif est entamé,
   pas qu'il est atteint — ça, c'est l'affaire du signe */
.goal {
  padding: 2px 0 14px 14px;
  border-left: 3px solid var(--color-neutral-300);
  border-bottom: 1px solid var(--color-divider);
}

.goal.is-started {
  border-left-color: var(--color-text);
}

.goal__head {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.goal__text {
  max-width: 760px;
  margin: 0;
  font-size: 12.5px;
  line-height: 1.45;
}

/* même carré que les cartes de pratiques, en plus grand : vide = objectif
   non atteint, plein = atteint. Il remplace le badge en toutes lettres. */
.goal__mark {
  margin-left: auto;
  flex: none;
  width: 11px;
  height: 11px;
  margin-top: 3px;
  border: 1px solid var(--color-neutral-600);
}

.is-done .goal__mark {
  border-color: var(--color-text);
  background: var(--color-text);
}

.practices {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(215px, 1fr));
  align-items: stretch;
  gap: 8px;
  margin-top: 12px;
}

/* validée : la bordure épaissit et le rembourrage compense, la carte ne bouge pas */
.practice {
  position: relative;
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

/* même carré que la colonne de marquage de la restitution 2 :
   vide = pratique à valider, plein = pratique validée.
   Ancré dans le coin haut-droit de la carte : les décalages compensent l'épaisseur de
   bordure pour qu'il reste à 6px du bord extérieur dans les deux états. */
.practice__mark {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  border: 1px solid var(--color-neutral-600);
}

.is-checked .practice__mark {
  top: 3px;
  right: 3px;
  border-color: var(--color-text);
  background: var(--color-text);
}

.practice__text {
  display: block;
  padding-top: 10px;
  font-size: 11.5px;
  line-height: 1.5;
}

@media (max-width: 1200px) {
  .practices {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}
</style>

<template>
  <AppScreen>
    <div class="headline">
      <div>
        <p class="headline__label">Niveau Cible :</p>
        <p class="headline__value heading">{{ vm.targetLabel }}</p>
      </div>
      <div class="headline__acquired">
        <p class="headline__label headline__label--strong">Niveau Acquis :</p>
        <p class="headline__value heading">{{ vm.acquiredLabel }}</p>
      </div>
    </div>

    <div class="ladder">
      <ol class="ladder__levels">
        <li
          v-for="level in vm.ladder"
          :key="level.n"
          class="ladder__level"
          :class="{ 'is-reached': level.reached, 'is-beyond': level.beyondTarget }"
        >
          <span class="ladder__label heading">{{ level.label }}</span>
          <span v-if="level.acquired" class="tag tag--solid ladder__tag">acquis</span>
          <span v-else-if="level.isTarget" class="tag ladder__tag">cible</span>
        </li>
      </ol>
      <p class="ladder__desc">{{ vm.acquiredDesc }}</p>
    </div>

    <p class="section-title">Détails :</p>

    <div class="blocks">
      <section
        v-for="block in vm.blocks"
        :key="block.id"
        class="block"
        :style="stripe(block.dimensionColors)"
      >
        <h2 class="block__name heading">{{ block.name }}</h2>
        <div class="block__stats">
          <div>
            <p class="stat__label">Objectifs :</p>
            <p class="stat__value heading">{{ block.goals }}</p>
          </div>
          <div>
            <p class="stat__label">Pratiques :</p>
            <p class="stat__value heading">{{ block.practices }}</p>
          </div>
        </div>
        <div
          class="block__track"
          role="progressbar"
          :aria-valuenow="block.percent"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`Pratiques validées — ${block.name}`"
        >
          <div class="block__bar" :style="{ width: `${block.percent}%` }" />
        </div>
      </section>
    </div>

    <AppScreenNav @back="emit('back')" @next="emit('next')" />
  </AppScreen>
</template>

<script setup>
import AppScreen from '../AppScreen.vue'
import AppScreenNav from '../AppScreenNav.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['back', 'next'])

// Bande supérieure du bloc : un segment par dimension, à parts égales sur la
// largeur — même principe que le liseré de gauche du tableau de cadrage.
function stripe(colors) {
  const stops = colors
    .map((color, index) => `${color} ${index / colors.length * 100}% ${(index + 1) / colors.length * 100}%`)
    .join(',')
  return { backgroundImage: `linear-gradient(to right, ${stops})` }
}
</script>

<style scoped>
.headline {
  display: flex;
  gap: 44px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.headline__acquired {
  padding-left: 28px;
  border-left: 2px solid var(--color-text);
}

.headline__label {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-neutral-700);
}

.headline__label--strong {
  color: var(--color-text);
}

.headline__value {
  margin: 4px 0 0;
  font-size: 22px;
  letter-spacing: normal;
}

.ladder {
  display: grid;
  grid-template-columns: 340px 1fr;
  margin-top: 26px;
  border: 2px solid var(--color-text);
}

.ladder__levels {
  margin: 0;
  padding: 0;
  list-style: none;
  border-right: 2px solid var(--color-text);
}

.ladder__level {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
}

.ladder__level:not(:last-child) {
  border-bottom: 1px solid var(--color-divider);
}

.ladder__level.is-reached {
  background: var(--color-neutral-200);
}

.ladder__level.is-beyond {
  opacity: 0.45;
}

.ladder__label {
  font-size: 13px;
}

.ladder__tag {
  margin-left: auto;
  padding: 2px 6px;
  border-color: var(--color-text);
}

.ladder__desc {
  max-width: 760px;
  margin: 0;
  padding: 20px 24px;
  background: var(--color-neutral-100);
  font-size: 14px;
  line-height: 1.5;
  text-wrap: pretty;
}

.section-title {
  margin: 26px 0 10px;
  font-size: 11px;
  font-weight: 700;
}

.blocks {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 2px solid var(--color-text);
}

/* la bande de dimensions est peinte dans le bord supérieur transparent :
   background-origin la fait déborder sous la bordure, background-size lui
   donne exactement son épaisseur */
.block {
  padding: 16px 18px 18px;
  border-top: 5px solid transparent;
  border-right: 2px solid var(--color-text);
  background-color: var(--color-neutral-100);
  background-origin: border-box;
  background-repeat: no-repeat;
  background-size: 100% 5px;
  background-position: left top;
}

.block:last-child {
  border-right: 0;
}

.block__name {
  margin: 0;
  font-size: 15px;
  letter-spacing: normal;
}

.block__stats {
  display: flex;
  gap: 24px;
  margin-top: 16px;
}

.stat__label {
  margin: 0;
  font-size: 10.5px;
  color: var(--color-neutral-700);
}

.stat__value {
  margin: 0;
  font-size: 24px;
  letter-spacing: normal;
}

.block__track {
  height: 6px;
  margin-top: 14px;
  background: var(--color-neutral-300);
}

.block__bar {
  height: 100%;
  background: var(--color-text);
}

@media (max-width: 1200px) {
  .blocks {
    grid-template-columns: 1fr 1fr;
  }

  .block:nth-child(2n) {
    border-right: 0;
  }

  .block:nth-child(-n + 2) {
    border-bottom: 2px solid var(--color-text);
  }
}

@media (max-width: 900px) {
  .headline {
    gap: 20px;
  }

  .headline__acquired {
    padding-left: 0;
    border-left: 0;
  }

  .ladder,
  .blocks {
    grid-template-columns: 1fr;
  }

  .ladder__levels {
    border-right: 0;
    border-bottom: 2px solid var(--color-text);
  }

  .block {
    border-right: 0;
  }

  .block:not(:last-child) {
    border-bottom: 2px solid var(--color-text);
  }
}
</style>

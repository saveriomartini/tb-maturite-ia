<template>
  <AppScreen spacing="tight">
    <div class="toolbar">
      <p class="level-badge">{{ vm.levelLabel }}</p>
      <nav class="strip" aria-label="Dimensions du modèle">
        <button
          v-for="dimension in vm.dimensions"
          :key="dimension.id"
          type="button"
          class="button-reset strip__item"
          :class="{ 'is-active': dimension.active, 'is-unavailable': !dimension.available }"
          :style="{ background: dimension.color }"
          :disabled="!dimension.available"
          @click="emit('go-to-area', dimension.index)"
        >
          {{ dimension.name }}
        </button>
      </nav>
      <p class="toolbar__progress">{{ vm.progress }}</p>
    </div>

    <div class="workspace panel">
      <aside class="context">
        <div class="context__band" :style="{ background: vm.area.color }" />
        <h2 class="context__block heading">{{ vm.blockName }}</h2>
        <nav class="context__dimensions" aria-label="Dimensions du bloc">
          <button
            v-for="dimension in vm.blockDimensions"
            :key="dimension.id"
            type="button"
            class="chip chip--tinted"
            :class="{ 'is-active': dimension.active, 'is-muted': !dimension.available }"
            :style="{ '--chip-color': dimension.color }"
            :disabled="!dimension.available"
            @click="emit('go-to-area', dimension.index)"
          >
            {{ dimension.name }}
          </button>
        </nav>

        <p class="context__label">Area :</p>
        <h3 class="context__area heading">{{ vm.area.name }}</h3>
        <p class="context__desc">{{ vm.area.desc }}</p>
        <p class="context__score">{{ vm.area.scoreLabel }}</p>

        <div v-if="vm.area.exampleArtifacts.length" class="context__artifacts">
          <p class="context__label">Exemples d'artefacts</p>
          <ul class="context__artifacts-list">
            <li v-for="artifact in vm.area.exampleArtifacts" :key="artifact">{{ artifact }}</li>
          </ul>
        </div>
      </aside>

      <div class="work">
        <GoalChecklist :goals="vm.goals" @toggle="emit('toggle-practice', $event)" />

        <div class="work__nav">
          <button type="button" class="btn btn-ghost" @click="emit('back')">Précédent</button>
          <div class="work__next">
            <p class="work__hint">{{ vm.area.hint }}</p>
            <button type="button" class="btn btn-primary work__button" @click="emit('next')">
              {{ vm.nextLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppScreen>
</template>

<script setup>
import AppScreen from '../AppScreen.vue'
import GoalChecklist from '../GoalChecklist.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['toggle-practice', 'go-to-area', 'back', 'next'])
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.level-badge {
  margin: 0;
}

.toolbar__progress {
  margin: 0 0 0 auto;
  font-size: 11px;
  color: var(--color-neutral-700);
}

.strip {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.strip__item {
  max-width: 112px;
  padding: 5px 6px;
  border: 1px solid var(--color-divider);
  color: var(--color-text);
  font-size: 9px;
  font-weight: 500;
  line-height: 1.25;
  opacity: 0.78;
}

.strip__item.is-active {
  border: 2px solid var(--color-text);
  font-weight: 800;
  opacity: 1;
}

.strip__item.is-unavailable {
  opacity: 0.35;
}

.workspace {
  display: grid;
  grid-template-columns: 250px 1fr;
  margin-top: 18px;
}

.context {
  padding: 16px;
  border-right: 2px solid var(--color-text);
}

.context__band {
  height: 8px;
  margin: -16px -16px 14px;
}

.context__block {
  margin: 0;
  font-size: 17px;
  letter-spacing: normal;
}

.context__dimensions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
}

.context__label {
  margin: 22px 0 0;
  font-size: 11px;
  font-weight: 700;
}

.context__area {
  margin: 6px 0 0;
  font-size: 19px;
  line-height: 1.2;
  letter-spacing: normal;
}

.context__desc {
  margin: 10px 0 0;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--color-neutral-800);
}

.context__score {
  margin: 18px 0 0;
  padding-top: 12px;
  border-top: 1px solid var(--color-divider);
  font-size: 11px;
  color: var(--color-neutral-700);
}

.context__artifacts {
  margin-top: 18px;
}

.context__artifacts .context__label {
  margin-top: 0;
}

.context__artifacts-list {
  max-height: 220px;
  margin: 8px 0 0;
  padding: 0 0 0 16px;
  overflow-y: auto;
  font-size: 11px;
  line-height: 1.5;
  color: var(--color-neutral-800);
}

.context__artifacts-list li + li {
  margin-top: 4px;
}

.work {
  padding: 18px 20px;
}

.work__nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 26px;
  padding-top: 16px;
  border-top: 2px solid var(--color-text);
}

.work__next {
  display: flex;
  align-items: center;
  gap: 10px;
}

.work__hint {
  margin: 0;
  font-size: 11px;
  color: var(--color-neutral-700);
}

.work__button {
  min-width: 150px;
}

@media (max-width: 1200px) {
  .workspace {
    grid-template-columns: 210px 1fr;
  }

  .work {
    padding: 16px;
  }
}

/* Empilé, le rappel de contexte (bloc, dimension, area, score) coiffe le
   questionnaire au lieu de le border. */
@media (max-width: 900px) {
  .workspace {
    grid-template-columns: 1fr;
  }

  .context {
    border-right: 0;
    border-bottom: 2px solid var(--color-text);
  }

  .context__dimensions {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .work__nav {
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>

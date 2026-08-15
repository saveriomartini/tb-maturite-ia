<template>
  <AppScreen>
    <LevelSummary :target-label="vm.targetLabel" :acquired-label="vm.acquiredLabel" />

    <h1 class="title">Liste des Pratiques manquantes (Gap)</h1>
    <p class="summary">{{ vm.gapSummary }}</p>

    <div class="blocks">
      <section v-for="block in vm.blocks" :key="block.id" class="block">
        <h2 class="block__name heading">{{ block.name }}</h2>

        <article
          v-for="group in block.groups"
          :key="group.id"
          class="group"
          :style="{ '--dimension-color': group.dimColor }"
        >
          <p class="group__dimension">{{ group.dim }}</p>
          <h3 class="group__area heading">{{ group.area }}</h3>
          <div class="objectives">
            <div v-for="objective in group.objectives" :key="objective.label">
              <p class="objective__label">{{ objective.label }}</p>
              <div class="practices">
                <p v-for="practice in objective.practices" :key="practice" class="practice">{{ practice }}</p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>

    <section v-if="vm.deferred" class="deferred panel">
      <h2 class="panel-head">{{ vm.deferred.summary }}</h2>
      <div class="deferred__body">
        <p class="deferred__note">{{ vm.deferred.note }}</p>
        <button type="button" class="btn btn-secondary deferred__resume" @click="emit('resume')">
          {{ vm.deferred.resumeLabel }}
        </button>
      </div>
    </section>

    <AppScreenNav @back="emit('back')">
      <template #actions>
        <div class="actions">
          <button type="button" class="btn btn-secondary actions__export" @click="emit('export')">Export</button>
          <button type="button" class="btn btn-primary actions__finish" @click="emit('finish')">Fin</button>
        </div>
      </template>
    </AppScreenNav>
  </AppScreen>
</template>

<script setup>
import AppScreen from '../AppScreen.vue'
import AppScreenNav from '../AppScreenNav.vue'
import LevelSummary from '../LevelSummary.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['export', 'finish', 'resume', 'back'])
</script>

<style scoped>
.title {
  margin: 20px 0 0;
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: normal;
}

.summary {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--color-neutral-700);
}

.blocks {
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin-top: 18px;
}

.block {
  border: 2px solid var(--color-text);
}

.block__name {
  margin: 0;
  padding: 9px 14px;
  background: var(--color-text);
  color: #fff;
  font-size: 13px;
  letter-spacing: normal;
}

.group {
  display: grid;
  grid-template-columns: 220px 220px 1fr;
  gap: 16px;
  align-items: start;
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-divider);
  border-left: 6px solid var(--dimension-color);
}

.group__dimension {
  margin: 0;
  padding: 6px 8px;
  background: var(--dimension-color);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.35;
}

.group__area {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.25;
  letter-spacing: normal;
}

.objectives {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.objective__label {
  margin: 0;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.practices {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 8px;
  margin-top: 6px;
}

.practice {
  margin: 0;
  padding: 8px 10px;
  border: 1px solid var(--color-text);
  background: var(--color-neutral-200);
  font-size: 11px;
  line-height: 1.35;
}

/* Les areas jamais présentées ne sont pas un manque : elles sortent de la liste
   du gap et sont annoncées ici, à part, avec le moyen d'y revenir. */
.deferred {
  margin-top: 22px;
  background: var(--color-bg);
  border-style: dashed;
}

.deferred__body {
  padding: 14px 16px;
}

.deferred__note {
  max-width: 640px;
  margin: 0;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--color-neutral-800);
}

.deferred__resume {
  margin-top: 14px;
}

.actions {
  display: flex;
  gap: 12px;
}

.actions__export {
  min-width: 140px;
}

.actions__finish {
  min-width: 120px;
}

@media (max-width: 1200px) {
  .group {
    grid-template-columns: 170px 180px 1fr;
    gap: 12px;
  }
}

/* Empilé : dimension, puis area, puis les pratiques manquantes en dessous. */
@media (max-width: 900px) {
  .group {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .group__dimension {
    justify-self: start;
  }

  .practices {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}
</style>

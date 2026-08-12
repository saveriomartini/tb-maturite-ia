<template>
  <AppScreen>
    <div class="toolbar">
      <p class="toolbar__meta">Aperçu de l'export PDF — {{ vm.meta }}</p>
      <button type="button" class="btn btn-ghost" @click="emit('back')">Retour</button>
    </div>

    <div class="pages">
      <article v-for="page in vm.pages" :key="page.label" class="page">
        <header class="page__head">
          <div>
            <h1 class="page__title heading">Liste des Pratiques manquantes (Gap)</h1>
            <p class="page__meta">{{ vm.meta }}</p>
          </div>
          <div class="page__levels">
            <p class="page__level">Niveau Cible : <span class="page__level-value">{{ vm.targetLabel }}</span></p>
            <p class="page__level">Niveau Acquis : <span class="page__level-value">{{ vm.acquiredLabel }}</span></p>
          </div>
        </header>

        <div class="page__body">
          <p v-if="page.empty" class="page__empty">
            Aucune pratique manquante — toutes les areas du niveau cible sont acquises.
          </p>

          <section v-for="group in page.groups" :key="group.id" class="group">
            <header class="group__head">
              <span class="group__block">{{ group.block }}</span>
              <span class="group__swatch" :style="{ background: group.dimColor }" />
              <span class="group__dimension">{{ group.dim }}</span>
              <span class="group__area heading">{{ group.area }}</span>
            </header>
            <div class="objectives">
              <div v-for="objective in group.objectives" :key="objective.label">
                <p class="objective">
                  <span class="objective__label">{{ objective.label }} </span>{{ objective.goal }}
                </p>
                <div class="practices">
                  <p v-for="practice in objective.practices" :key="practice" class="practice">— {{ practice }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer class="page__foot">
          <span>{{ vm.meta }}</span>
          <span>{{ page.label }}</span>
        </footer>
      </article>
    </div>
  </AppScreen>
</template>

<script setup>
import AppScreen from '../AppScreen.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['back'])
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.toolbar__meta {
  margin: 0;
  font-size: 12px;
  color: var(--color-neutral-700);
}

.pages {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  margin-top: 18px;
}

/* format A4 à l'échelle 1 : ce que produira l'impression */
.page {
  display: flex;
  flex-direction: column;
  width: 794px;
  min-height: 1123px;
  padding: 44px 48px;
  border: 1px solid var(--color-neutral-400);
  background: #fff;
  box-shadow: var(--shadow-md);
}

.page__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--color-text);
}

.page__title {
  margin: 0;
  font-size: 15px;
  line-height: 1.2;
  letter-spacing: normal;
}

.page__meta {
  margin: 3px 0 0;
  font-size: 10px;
  color: var(--color-neutral-700);
}

.page__levels {
  text-align: right;
}

.page__level {
  margin: 0;
  font-size: 10px;
  line-height: 1.5;
}

.page__level-value {
  font-weight: 700;
}

.page__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  margin-top: 16px;
}

.page__empty {
  margin: 0;
  padding: 16px;
  border: 1px solid var(--color-text);
  background: var(--color-neutral-200);
  font-size: 11px;
  line-height: 1.45;
}

.group__head {
  display: flex;
  gap: 8px;
  align-items: baseline;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--color-divider);
}

.group__block {
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 800;
}

.group__swatch {
  width: 9px;
  height: 9px;
  flex: none;
  border: 1px solid var(--color-text);
}

.group__dimension {
  font-size: 9.5px;
  color: var(--color-neutral-700);
}

.group__area {
  margin-left: auto;
  font-size: 11.5px;
  letter-spacing: normal;
}

.objectives {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.objective {
  margin: 0;
  font-size: 9.5px;
  line-height: 1.4;
  color: var(--color-neutral-800);
}

.objective__label {
  font-weight: 800;
  color: var(--color-text);
}

.practices {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 4px;
  padding-left: 12px;
}

.practice {
  margin: 0;
  font-size: 9.5px;
  line-height: 1.4;
}

.page__foot {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid var(--color-divider);
  font-size: 9.5px;
  color: var(--color-neutral-700);
}

/* La page ne se réagence pas : c'est un aperçu d'impression, sa largeur EST le
   A4. Quand l'écran est plus étroit, on la fait défiler latéralement plutôt que
   de mentir sur ce qui sortira de l'imprimante. */
@media (max-width: 900px) {
  .pages {
    align-items: flex-start;
    overflow-x: auto;
    padding-bottom: 12px;
  }

  .page {
    flex: none;
  }

  .toolbar {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>

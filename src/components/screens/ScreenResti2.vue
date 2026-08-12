<template>
  <AppScreen>
    <LevelSummary :target-label="vm.targetLabel" :acquired-label="vm.acquiredLabel" />

    <p class="section-title">Détails :</p>

    <div class="blocks">
      <section v-for="block in vm.blocks" :key="block.id" class="block">
        <h2 class="block__name heading">{{ block.name }}</h2>
        <table class="table">
          <thead>
            <tr>
              <th class="col-dimension">Dimension</th>
              <th>Area</th>
              <th class="col-score">Objectifs</th>
              <th class="col-score">Pratiques</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in block.rows" :key="row.id">
              <td
                class="cell-dimension"
                :class="{ 'is-first': row.firstOfDimension }"
                :style="{ '--dimension-color': row.color }"
              >
                {{ row.dim }}
              </td>
              <td class="cell-area">{{ row.area }}</td>
              <td class="cell-goals">{{ row.goals }}</td>
              <td class="cell-practices">{{ row.practices }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <AppScreenNav @back="emit('back')" @next="emit('next')" />
  </AppScreen>
</template>

<script setup>
import AppScreen from '../AppScreen.vue'
import AppScreenNav from '../AppScreenNav.vue'
import LevelSummary from '../LevelSummary.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['back', 'next'])
</script>

<style scoped>
.section-title {
  margin: 18px 0 10px;
  font-size: 11px;
  font-weight: 700;
}

.blocks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

.block {
  border: 2px solid var(--color-text);
}

.block__name {
  margin: 0;
  padding: 10px 14px;
  border-bottom: 2px solid var(--color-text);
  font-size: 14px;
  letter-spacing: normal;
}

.col-dimension {
  width: 33%;
}

.col-score {
  width: 78px;
}

/* la première ligne d'une dimension porte son nom et sa couleur pleine ;
   les suivantes n'en gardent que le liseré */
.cell-dimension {
  border-left: 5px solid var(--dimension-color);
  font-size: 10.5px;
  font-weight: 700;
  line-height: 1.3;
  vertical-align: top;
}

.cell-dimension.is-first {
  background: var(--dimension-color);
}

.cell-area {
  font-size: 11px;
  vertical-align: top;
}

.cell-goals {
  font-size: 11px;
  font-weight: 700;
}

.cell-practices {
  font-size: 11px;
}
</style>

<template>
  <AppScreen>
    <LevelSummary :target-label="vm.targetLabel" :acquired-label="vm.acquiredLabel" />

    <div class="details-head">
      <p class="section-title">Détails :</p>
      <p class="legend"><span class="mark" aria-hidden="true" /> area acquise</p>
    </div>

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
              <th class="col-mark" />
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
              <td class="cell-mark">
                <span v-if="row.acquired" class="mark" role="img" aria-label="Area acquise" />
              </td>
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
.details-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}

.section-title {
  margin: 18px 0 10px;
  font-size: 11px;
  font-weight: 700;
}

.legend {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 10.5px;
  color: var(--color-neutral-700);
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

/* colonne de marquage : le carré plein reprend le noir de .tag--solid, qui dit
   déjà « acquis » dans l'escalier de la restitution 1 */
.col-mark {
  width: 22px;
}

.cell-mark {
  padding-left: 0;
  padding-right: 10px;
  text-align: right;
}

.mark {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: var(--color-text);
}

@media (max-width: 1200px) {
  .blocks {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .details-head {
    flex-wrap: wrap;
    gap: 0 16px;
  }

  /* la colonne Dimension cesse d'occuper un tiers de la largeur : les intitulés
     d'area, plus longs, en ont davantage besoin */
  .col-dimension {
    width: 26%;
  }
}
</style>

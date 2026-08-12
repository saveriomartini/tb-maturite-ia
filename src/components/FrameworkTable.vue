<template>
  <div class="framework">
    <div class="framework__head eyebrow">blocs</div>
    <div class="framework__head eyebrow">dimensions</div>
    <div class="framework__head framework__head--last eyebrow">areas</div>

    <template v-for="(block, blockIndex) in blocks" :key="block.id">
      <div
        class="cell cell--block"
        :class="blockCellClasses(blockIndex)"
        :style="{ gridRow: `span ${block.dimensions.length}` }"
      >
        <div class="block-chip heading" :style="stripe(block.dimensionColors)">{{ block.name }}</div>
      </div>

      <template v-for="(dimension, dimensionIndex) in block.dimensions" :key="dimension.id">
        <div class="cell cell--dimension" :class="edgeClasses(blockIndex, dimensionIndex, block)">
          <div class="chip chip--tinted dimension-chip" :style="{ '--chip-color': dimension.color }">
            {{ dimension.name }}
          </div>
        </div>
        <div class="cell cell--areas" :class="edgeClasses(blockIndex, dimensionIndex, block)">
          <div
            v-for="area in dimension.areas"
            :key="area.id"
            class="chip area-chip"
            :class="{ 'is-muted': area.pending, 'area-chip--pending': area.pending }"
            :style="{ '--chip-color': dimension.color }"
          >
            {{ area.name }}
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
// Tableau blocs / dimensions / areas de l'écran Cadrage 1.
// Le composable fournit la structure ; la géométrie (fusion de lignes, bande de
// couleur, respiration des bords) est décidée ici.
const props = defineProps({
  blocks: { type: Array, required: true }
})

// Les cellules du haut et du bas du tableau respirent davantage que celles de
// l'intérieur ; les classes disent laquelle est laquelle.
function blockCellClasses(blockIndex) {
  return {
    'is-block-start': true,
    'is-block-end': true,
    'is-table-start': blockIndex === 0,
    'is-table-end': blockIndex === props.blocks.length - 1
  }
}

function edgeClasses(blockIndex, dimensionIndex, block) {
  return {
    'is-block-start': dimensionIndex === 0,
    'is-block-end': dimensionIndex === block.dimensions.length - 1,
    'is-table-start': blockIndex === 0 && dimensionIndex === 0,
    'is-table-end': blockIndex === props.blocks.length - 1 && dimensionIndex === block.dimensions.length - 1
  }
}

// Bande de gauche du bloc : un segment par dimension, de même hauteur que la
// ligne correspondante.
function stripe(colors) {
  const stops = colors
    .map((color, index) => `${color} ${index / colors.length * 100}% ${(index + 1) / colors.length * 100}%`)
    .join(',')
  return { backgroundImage: `linear-gradient(to bottom, ${stops})` }
}
</script>

<style scoped>
.framework {
  display: grid;
  grid-template-columns: 200px 260px 1fr;
  border: 2px solid var(--color-text);
  background: var(--color-neutral-100);
}

.framework__head {
  padding: 8px 14px;
  border-right: 2px solid var(--color-text);
  border-bottom: 2px solid var(--color-text);
}

.framework__head--last {
  border-right: 0;
}

.cell {
  padding: 3px 14px;
}

.cell--block,
.cell--dimension {
  display: flex;
  border-right: 2px solid var(--color-text);
}

.cell--block {
  grid-column: 1;
  padding-top: 5px;
  padding-bottom: 5px;
}

.cell--dimension {
  grid-column: 2;
}

.cell--areas {
  grid-column: 3;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.cell.is-block-start {
  padding-top: 5px;
}

.cell.is-block-end {
  padding-bottom: 5px;
}

.cell.is-table-start {
  padding-top: 14px;
}

.cell.is-table-end {
  padding-bottom: 14px;
}

.block-chip {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid var(--color-text);
  border-left: 4px solid transparent;
  background-origin: border-box;
  background-repeat: no-repeat;
  background-size: 4px 100%;
  background-position: left top;
  font-size: 13px;
  letter-spacing: normal;
}

.dimension-chip {
  flex: 1;
}

.area-chip {
  --chip-font-size: 9.5px;
  --chip-padding: 6px 7px;
  border-left: 4px solid var(--chip-color);
}

.area-chip--pending {
  border-style: dashed;
  border-left-style: solid;
}
</style>

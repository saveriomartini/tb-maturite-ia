<template>
  <div class="scope-map">
    <section v-for="block in blocks" :key="block.id" class="block">
      <h2 class="block__name heading">{{ block.name }}</h2>
      <div class="block__dimensions">
        <div v-for="dimension in block.dimensions" :key="dimension.id" class="dimension">
          <h3 class="dimension__name" :style="{ background: dimension.color }">{{ dimension.name }}</h3>
          <div class="dimension__areas">
            <p
              v-for="area in dimension.areas"
              :key="area.id"
              class="area"
              :class="{ 'area--in-scope': area.inScope, 'area--pending': area.pending }"
            >
              {{ area.label }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Carte du périmètre : les 28 areas, celles retenues par le niveau cible en
// évidence, les autres en retrait.
defineProps({
  blocks: { type: Array, required: true }
})
</script>

<style scoped>
.scope-map {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 2px solid var(--color-text);
}

.block {
  border-right: 2px solid var(--color-text);
  background: var(--color-bg);
}

.block:last-child {
  border-right: 0;
}

.block__name {
  margin: 0;
  padding: 10px 14px;
  border-bottom: 2px solid var(--color-text);
  font-size: 14px;
  letter-spacing: normal;
}

.block__dimensions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
}

.dimension {
  border: 1px solid var(--color-divider);
  background: var(--color-neutral-100);
}

.dimension__name {
  margin: 0;
  padding: 8px 10px;
  border-bottom: 1px solid var(--color-divider);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: normal;
}

.dimension__areas {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 10px;
}

.area {
  margin: 0;
  padding: 5px 7px;
  border: 1px solid var(--color-neutral-300);
  color: var(--color-neutral-500);
  font-size: 9.5px;
  line-height: 1.3;
}

.area--in-scope {
  border-color: var(--color-text);
  background: var(--color-neutral-200);
  color: var(--color-text);
}

.area--pending {
  border-style: dashed;
}
</style>

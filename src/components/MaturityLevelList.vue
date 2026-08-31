<template>
  <div class="levels">
    <div v-for="level in levels" :key="level.n" class="level">
      <button
        type="button"
        class="button-reset level__row"
        :aria-expanded="level.open"
        :aria-controls="`level-detail-${level.n}`"
        @click="emit('toggle', level.n)"
      >
        <span class="level__label heading">{{ level.label }}</span>
        <span class="level__tag">{{ level.tag }}</span>
        <span class="level__toggle" :class="{ 'is-open': level.open }">
          {{ level.open ? '− replier' : '+ détail' }}
        </span>
      </button>
      <div v-show="level.open" :id="`level-detail-${level.n}`" class="level__detail">
        <p v-for="(paragraph, index) in level.detail" :key="index" class="level__paragraph">{{ paragraph }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Les cinq profils du modèle, chacun dépliable sur son exposé long.
defineProps({
  levels: { type: Array, required: true }
})

const emit = defineEmits(['toggle'])
</script>

<style scoped>
.levels {
  border: 2px solid var(--color-text);
}

.level:not(:last-child) {
  border-bottom: 1px solid var(--color-divider);
}

.level:nth-child(even) {
  background: var(--color-neutral-100);
}

.level__row {
  display: flex;
  gap: 20px;
  align-items: baseline;
  width: 100%;
  padding: 11px 16px;
}

.level__label {
  width: 210px;
  flex: none;
  font-size: 13px;
}

.level__tag {
  flex: 1;
  font-size: 12px;
  line-height: 1.4;
  color: var(--color-neutral-800);
}

.level__toggle {
  flex: none;
  padding: 4px 8px;
  border: 1px solid var(--color-text);
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 800;
  white-space: nowrap;
}

.level__toggle.is-open {
  background: var(--color-text);
  color: #fff;
}

.level__detail {
  padding: 0 16px 14px 246px;
}

/* Le texte déplié tient la largeur de la ligne qui le porte, comme les autres
   textes de la page d'information. Il reste en retrait à gauche : c'est le
   décalage sous le nom du profil qui le rattache à lui, pas sa longueur. */
.level__paragraph {
  margin: 0 0 10px;
  font-size: 12px;
  line-height: 1.55;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

@media (max-width: 1200px) {
  .level__label {
    width: 170px;
  }

  .level__detail {
    /* le retrait du détail suit la largeur du libellé */
    padding-left: 206px;
  }
}

@media (max-width: 900px) {
  .level__row {
    flex-wrap: wrap;
    gap: 8px 12px;
  }

  .level__label {
    width: 100%;
  }

  .level__detail {
    padding-left: 16px;
  }
}
</style>

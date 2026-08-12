<template>
  <div class="nav" :class="`nav--${align}`">
    <button type="button" class="btn btn-ghost" @click="emit('back')">{{ backLabel }}</button>
    <slot name="actions">
      <button type="button" class="btn btn-primary nav__next" @click="emit('next')">{{ nextLabel }}</button>
    </slot>
  </div>
</template>

<script setup>
// Pied de page de navigation, identique d'un écran à l'autre. Les écrans qui
// proposent autre chose que « Suivant » remplissent le slot `actions`.
defineProps({
  backLabel: { type: String, default: 'Retour' },
  nextLabel: { type: String, default: 'Suivant' },
  align: {
    type: String,
    default: 'between',
    validator: value => ['between', 'end'].includes(value)
  }
})

const emit = defineEmits(['back', 'next'])
</script>

<style scoped>
.nav {
  display: flex;
  gap: 12px;
  /* le parent peut resserrer ou aérer le pied de page */
  margin-top: var(--nav-margin-top, 24px);
}

.nav--between {
  justify-content: space-between;
}

.nav--end {
  justify-content: flex-end;
}

.nav__next {
  min-width: 160px;
}
</style>

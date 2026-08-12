<template>
  <div class="screen" :class="`screen--${spacing}`">
    <slot />
  </div>
</template>

<script setup>
// Gabarit commun à tous les écrans : largeur de lecture et gouttières.
// `spacing` règle le seul écart réel entre eux, la respiration au-dessus du
// premier bloc de contenu.
defineProps({
  spacing: {
    type: String,
    default: 'normal',
    validator: value => ['tight', 'normal', 'loose'].includes(value)
  }
})
</script>

<style scoped>
.screen {
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px var(--gutter) 0;
}

.screen--tight {
  padding-top: 24px;
}

.screen--loose {
  padding-top: 56px;
}
</style>

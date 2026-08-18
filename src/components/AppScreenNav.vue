<template>
  <div class="nav" :class="`nav--${align}`">
    <button type="button" class="btn btn-ghost" @click="emit('back')">{{ backLabel }}</button>
    <slot name="actions">
      <span class="nav__next-wrap" :title="nextDisabled && nextTitle ? nextTitle : undefined">
        <button
          type="button"
          class="btn btn-primary nav__next"
          :disabled="nextDisabled"
          @click="emit('next')"
        >
          {{ nextLabel }}
        </button>
      </span>
    </slot>
  </div>
</template>

<script setup>
// Pied de page de navigation, identique d'un écran à l'autre. Les écrans qui
// proposent autre chose que « Suivant » remplissent le slot `actions`.
//
// Un écran peut fermer sa sortie tant qu'il lui manque une réponse. La raison
// se lit au survol, portée par l'enveloppe du bouton et non par le bouton
// lui-même : désactivé, il ne reçoit plus d'événement de souris, et son
// infobulle ne s'afficherait pas partout.
defineProps({
  backLabel: { type: String, default: 'Retour' },
  nextLabel: { type: String, default: 'Suivant' },
  nextDisabled: { type: Boolean, default: false },
  nextTitle: { type: String, default: '' },
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
  flex-wrap: wrap;
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

/* L'enveloppe ne se voit pas : elle ne sert qu'à porter l'infobulle du bouton
   fermé, et se comporte comme lui dans la ligne. */
.nav__next-wrap {
  display: inline-flex;
}

.nav__next {
  min-width: 160px;
}
</style>

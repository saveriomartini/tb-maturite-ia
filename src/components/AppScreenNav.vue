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
// Pied de page de navigation, identique d'un écran à l'autre. Un écran qui a
// plusieurs sorties, ou qui nomme la sienne autrement, remplit le slot
// `actions` ; les trois qui le font aujourd'hui — information, démonstration,
// ancrage — s'en servent pour proposer autre chose qu'une sortie unique.
//
// Le libellé par défaut « Suivant » ne s'affiche nulle part : le seul écran qui
// se contente du bouton par défaut est la page de l'outil, et elle passe son
// propre libellé. Il reste comme repli d'un écran à venir, pas comme un texte
// de l'interface.
//
// — la sortie qu'un écran peut fermer, et qui ne l'est nulle part —
// `nextDisabled` et `nextTitle` permettent à un écran de fermer sa sortie tant
// qu'il lui manque une réponse, en disant au survol pourquoi. Le mécanisme est
// entier et ne sert plus : aucun attribut de cadrage n'est exigé, et le
// garde-fou qui remplaçait cette exigence est passé en modale. Il est conservé
// plutôt que retiré parce que c'est une intention de conception et non un
// oubli — mais rien, aujourd'hui, ne le déclenche.
//
// L'infobulle est portée par l'enveloppe du bouton et non par le bouton
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
  /* un parent peut resserrer ou aérer le pied de page en posant la variable ;
     aucun ne le fait aujourd'hui, et 24px est donc la seule valeur en service */
  margin-top: var(--nav-margin-top, 24px);
}

.nav--between {
  justify-content: space-between;
}

/* Aucun écran ne passe `align` aujourd'hui : cette variante attend un pied de
   page sans retour, que le parcours n'a pas encore. */
.nav--end {
  justify-content: flex-end;
}

/* L'enveloppe ne se voit pas : elle est là pour porter l'infobulle du bouton
   fermé — cas qu'aucun écran ne produit aujourd'hui — et se comporte comme lui
   dans la ligne. */
.nav__next-wrap {
  display: inline-flex;
}

.nav__next {
  min-width: 160px;
}
</style>

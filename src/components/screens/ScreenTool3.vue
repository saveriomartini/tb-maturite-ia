<template>
  <div class="results">
    <ScreenResti1 :vm="resti1" :focused-gate="focusedGate" @focus-gate="focusedGate = $event" />

    <section class="zone">
      <ScreenResti2 :vm="resti2" :focus="focus" />
    </section>
  </div>
</template>

<script setup>
// Les résultats : la synthèse en haut, le détail par domaine en dessous. Les
// deux se lisaient auparavant sur deux écrans séparés, ce qui obligeait à
// naviguer pour rapprocher un chiffre global de sa décomposition.
//
// Ce n'est plus un écran mais la troisième section de la page de l'outil : elle
// n'a donc plus ni gabarit ni pied de page — ScreenTool1 porte les deux, et la
// seule sortie de la page est l'ancrage, en bas.
//
// La section dit ce que le diagnostic constate, et rien de ce qu'on vise :
// l'écart appartient à la phase suivante, où la portée visée se déclare enfin.
//
// — la focalisation —
// Cliquer un palier dans l'échelle allume, dans le détail par domaine, ce qui
// retient ce palier. C'est la seule chose que les deux vues ont à se dire, et
// c'est cette section qui la tient : elle seule les voit toutes les deux. L'état
// est local et ne suit pas la session — il ne décrit pas l'évaluation, il décrit
// ce qu'on est en train de regarder.
import { computed, ref } from 'vue'
import ScreenResti1 from './ScreenResti1.vue'
import ScreenResti2 from './ScreenResti2.vue'

const props = defineProps({
  resti1: { type: Object, required: true },
  resti2: { type: Object, required: true }
})

const focusedGate = ref(null)

// Le palier focalisé, tel que le tableau en a besoin : son libellé et les
// domaines qu'il retient. Les deux viennent du view-model, qui les a déjà
// calculés pour l'échelle — rien n'est dérivé ici que la jointure.
const focus = computed(() => {
  const step = props.resti1.ladder.find(candidate => candidate.n === focusedGate.value)
  if (!step || !step.focusLabel) return null
  return { label: step.focusLabel, areas: step.blocking }
})
</script>

<style scoped>
/* Le détail par domaine est une section de la page comme les autres : il porte
   son propre titre coiffé (.section-head), et n'a donc pas besoin du filet fort
   qui l'annonçait — deux traits pleins à 22px l'un de l'autre se lisaient comme
   une rupture de page. Reste l'écart vertical, celui de toutes les sections de
   la synthèse. */
.zone {
  margin-top: 34px;
}
</style>

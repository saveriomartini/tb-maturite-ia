<template>
  <div class="results">
    <ScreenResti1 :vm="resti1" />

    <section class="zone">
      <ScreenResti2 :vm="resti2" />
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
// La focalisation d'un palier sur le détail par domaine — cliquer un palier
// dans l'échelle pour allumer ce qu'il retient — a disparu le 31.08.2026 avec
// le clic lui-même (voir MaturityLadder.vue) : le diagramme à deux dimensions
// qui a remplacé la liste seule ne s'y prêtait plus. Cette section ne tient
// donc plus d'état partagé entre les deux vues qu'elle compose ; chacune se lit
// pour elle-même.
import ScreenResti1 from './ScreenResti1.vue'
import ScreenResti2 from './ScreenResti2.vue'

defineProps({
  resti1: { type: Object, required: true },
  resti2: { type: Object, required: true }
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

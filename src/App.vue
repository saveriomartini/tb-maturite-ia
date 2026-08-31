<template>
  <div class="app">
    <AppHeader
      :vm="tool.header"
      @home="tool.nav.home"
      @phase="tool.nav.phase"
      @reset="resetting = true"
    />
    <div class="app__main">
      <MaturityTool :tool="tool" />
    </div>
    <AppFooter :attribution="ATTRIBUTION" />

    <AppDialog
      :open="resetting"
      :eyebrow="tool.header.resetDialog.eyebrow"
      :text="tool.header.resetDialog.text"
      :actions="tool.header.resetDialog.actions"
      @action="answerReset"
      @close="resetting = false"
    />
  </div>
</template>

<script setup>
// La remise à zéro se demande depuis l'en-tête, présent sur tous les écrans : sa
// confirmation vit donc ici, au-dessus d'eux, et non dans l'un d'eux. Elle passe
// par la même modale que l'avertissement du cadrage — l'outil n'a qu'une façon
// de poser une question dont la réponse engage.
//
// Tant qu'on n'a pas répondu, rien n'est effacé : `resetSession` n'est appelé
// que sur la sortie qui le demande, et toutes les autres — annulation, Échap —
// referment la boîte sans rien toucher.
//
// L'attribution est posée ici, sous le routeur d'écrans, pour la même raison :
// elle vaut pour tous les écrans, et un pied de page recopié dans chacun d'eux
// finirait par manquer au prochain.
import { ref } from 'vue'
import AppDialog from './components/AppDialog.vue'
import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'
import MaturityTool from './components/MaturityTool.vue'
import { ATTRIBUTION } from './data/attribution.js'
import { useMaturityTool } from './composables/useMaturityTool.js'

const tool = useMaturityTool()

const resetting = ref(false)

function answerReset(action) {
  resetting.value = false
  if (action === 'reset') tool.actions.resetSession()
}
</script>

<style scoped>
/* La respiration de fin de page appartient désormais au pied de page
   d'attribution, qui ferme tous les écrans.

   La colonne flexible tient le pied de page en bas de fenêtre sur les écrans
   courts — l'accueil, qui tient en trois portes. Elle ne servait à rien tant
   que la page était grise : le pied de page l'est aussi, à peine plus soutenu,
   et la couture entre les deux ne se voyait pas. Sur fond blanc elle se voit,
   et une bande grise qui s'arrête au milieu de la fenêtre se lit comme un
   défaut d'affichage. */
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg);
}

/* L'enveloppe absorbe la hauteur restante, ce qui revient à poser le pied de
   page en bas de fenêtre. Elle porte la croissance plutôt que le pied de page
   lui-même : celui-ci garde ainsi sa marge haute de 56px, qui est ce qui le
   détache du contenu quand la page est longue. */
.app__main {
  flex: 1 0 auto;
  min-width: 0;
}
</style>

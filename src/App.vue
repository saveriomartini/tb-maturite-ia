<template>
  <div class="app">
    <AppHeader
      :vm="tool.header"
      @home="tool.nav.home"
      @phase="tool.nav.phase"
      @reset="resetting = true"
    />
    <MaturityTool :tool="tool" />

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
import { ref } from 'vue'
import AppDialog from './components/AppDialog.vue'
import AppHeader from './components/AppHeader.vue'
import MaturityTool from './components/MaturityTool.vue'
import { useMaturityTool } from './composables/useMaturityTool.js'

const tool = useMaturityTool()

const resetting = ref(false)

function answerReset(action) {
  resetting.value = false
  if (action === 'reset') tool.actions.resetSession()
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  padding-bottom: 64px;
  background: var(--color-bg);
}
</style>

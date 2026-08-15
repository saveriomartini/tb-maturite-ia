<template>
  <ScreenHome
    v-if="screen === 'home'"
    :vm="tool.home"
    @open="open"
  />
  <ScreenInfo
    v-else-if="screen === 'info'"
    :cadrage1="tool.cadrage1"
    :scope="tool.diagStart"
    @toggle-level="tool.actions.toggleLevelDetail"
    @start="tool.nav.start"
    @back="tool.nav.home"
  />
  <ScreenDemo
    v-else-if="screen === 'demo'"
    @start="tool.nav.start"
    @back="tool.nav.home"
  />
  <ScreenTool1
    v-else-if="screen === 'tool1'"
    :journey="tool.journey"
    :cadrage3="tool.cadrage3"
    @select-option="tool.actions.selectOption"
    @toggle-context="tool.actions.toggleDescriptiveContext"
    @select-transformation="tool.actions.selectTransformation"
    @toggle-transformation="tool.actions.toggleTransformation"
    @back="tool.nav.back"
    @next="tool.nav.next"
  />
  <ScreenDiag
    v-else-if="screen === 'tool2'"
    :vm="tool.diag"
    @toggle-practice="tool.actions.togglePractice"
    @open-area="tool.actions.openArea"
    @close-off-scope="tool.actions.closeOffScope"
    @back="tool.nav.back"
    @next="tool.nav.next"
  />
  <ScreenPalier
    v-else-if="screen === 'palier'"
    :vm="tool.palier"
    @select-profile="tool.actions.selectTarget"
    @continue="tool.actions.continueDiagnostic"
    @skip="tool.nav.skipToRestitution"
    @back="tool.nav.back"
  />
  <ScreenTool3
    v-else-if="screen === 'tool3'"
    :resti1="tool.resti1"
    :resti2="tool.resti2"
    @back="tool.nav.back"
    @next="tool.nav.next"
  />
  <ScreenResti3
    v-else-if="screen === 'tool3b'"
    :vm="tool.resti3"
    @export="tool.nav.exportPreview"
    @finish="tool.nav.finish"
    @resume="tool.actions.continueDiagnostic"
    @back="tool.nav.back"
  />
  <ScreenExport
    v-else-if="screen === 'export'"
    :vm="tool.exportPreview"
    @back="tool.nav.back"
  />
</template>

<script setup>
// Aiguillage vers l'écran courant. Seul composant à connaître l'outil complet :
// chaque écran ne reçoit que son propre view-model et remonte ses intentions
// sous forme d'évènements.
//
// Les écrans de cadrage et de restitution ne sont plus routés individuellement :
// ils sont devenus des sections empilées dans `info`, `tool1` et `tool3`, qui
// portent désormais le gabarit et la navigation. Leurs fichiers gardent leurs
// noms, le temps qu'un renommage se justifie.
import { computed } from 'vue'
import ScreenHome from './screens/ScreenHome.vue'
import ScreenInfo from './screens/ScreenInfo.vue'
import ScreenDemo from './screens/ScreenDemo.vue'
import ScreenTool1 from './screens/ScreenTool1.vue'
import ScreenDiag from './screens/ScreenDiag.vue'
import ScreenPalier from './screens/ScreenPalier.vue'
import ScreenTool3 from './screens/ScreenTool3.vue'
import ScreenResti3 from './screens/ScreenResti3.vue'
import ScreenExport from './screens/ScreenExport.vue'

const props = defineProps({
  tool: { type: Object, required: true }
})

const screen = computed(() => props.tool.state.screen)

// L'accueil nomme la porte qu'il ouvre ; sa traduction en écran reste ici, pour
// que le composant d'accueil ignore les noms de la machine à écrans.
function open(target) {
  if (target === 'info') props.tool.nav.info()
  else if (target === 'demo') props.tool.nav.demo()
  else props.tool.nav.start()
}
</script>

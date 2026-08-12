<template>
  <ScreenHome
    v-if="screen === 'home'"
    :vm="tool.home"
    @start="tool.nav.start"
  />
  <ScreenCadrage1
    v-else-if="screen === 'cadrage1'"
    :vm="tool.cadrage1"
    @toggle-level="tool.actions.toggleLevelDetail"
    @back="tool.nav.back"
    @next="tool.nav.next"
  />
  <ScreenCadrage2
    v-else-if="screen === 'cadrage2'"
    @back="tool.nav.back"
    @next="tool.nav.next"
  />
  <ScreenCadrage3
    v-else-if="screen === 'cadrage3'"
    :vm="tool.cadrage3"
    @select-option="tool.actions.selectOption"
    @select-target="tool.actions.selectTarget"
    @apply-recommendation="tool.actions.applyRecommendation"
    @toggle-context="tool.actions.toggleDescriptiveContext"
    @back="tool.nav.back"
    @next="tool.nav.next"
  />
  <ScreenDiagStart
    v-else-if="screen === 'diagStart'"
    :vm="tool.diagStart"
    @back="tool.nav.back"
    @next="tool.nav.next"
  />
  <ScreenDiag
    v-else-if="screen === 'diag'"
    :vm="tool.diag"
    @toggle-practice="tool.actions.togglePractice"
    @go-to-area="tool.actions.goToArea"
    @back="tool.nav.back"
    @next="tool.nav.next"
  />
  <ScreenResti1
    v-else-if="screen === 'resti1'"
    :vm="tool.resti1"
    @back="tool.nav.back"
    @next="tool.nav.next"
  />
  <ScreenResti2
    v-else-if="screen === 'resti2'"
    :vm="tool.resti2"
    @back="tool.nav.back"
    @next="tool.nav.next"
  />
  <ScreenResti3
    v-else-if="screen === 'resti3'"
    :vm="tool.resti3"
    @export="tool.nav.exportPreview"
    @finish="tool.nav.finish"
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
import { computed } from 'vue'
import ScreenHome from './screens/ScreenHome.vue'
import ScreenCadrage1 from './screens/ScreenCadrage1.vue'
import ScreenCadrage2 from './screens/ScreenCadrage2.vue'
import ScreenCadrage3 from './screens/ScreenCadrage3.vue'
import ScreenDiagStart from './screens/ScreenDiagStart.vue'
import ScreenDiag from './screens/ScreenDiag.vue'
import ScreenResti1 from './screens/ScreenResti1.vue'
import ScreenResti2 from './screens/ScreenResti2.vue'
import ScreenResti3 from './screens/ScreenResti3.vue'
import ScreenExport from './screens/ScreenExport.vue'

const props = defineProps({
  tool: { type: Object, required: true }
})

const screen = computed(() => props.tool.state.screen)
</script>

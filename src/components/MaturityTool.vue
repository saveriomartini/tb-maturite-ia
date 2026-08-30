<template>
  <ScreenHome
    v-if="screen === 'home'"
    :vm="tool.home"
    @open="open"
  />
  <ScreenInfo
    v-else-if="screen === 'info'"
    :journey="tool.journey"
    :info="tool.info"
    :cadrage1="tool.cadrage1"
    :scope="tool.diagStart"
    @toggle-level="tool.actions.toggleLevelDetail"
    @start="tool.nav.start"
    @back="tool.nav.home"
  />
  <ScreenDemo
    v-else-if="screen === 'demo'"
    :vm="tool.demo"
    @load="tool.actions.loadDemo"
    @start="tool.nav.start"
    @back="tool.nav.home"
  />
  <ScreenTool1
    v-else-if="screen === 'tool'"
    :vm="tool.toolPage"
    :cadrage3="tool.cadrage3"
    :diag="tool.diag"
    :resti1="tool.resti1"
    :resti2="tool.resti2"
    @select-option="tool.actions.selectOption"
    @dismiss-warning="tool.actions.dismissContextWarning"
    @answer="tool.actions.answerArea"
    @phase="tool.actions.setPhase"
    @anchor-reached="tool.actions.clearAnchor"
    @back="tool.nav.back"
    @next="tool.nav.next"
  />
  <ScreenAncrage
    v-else-if="screen === 'tool4'"
    :vm="tool.ancrage"
    @select-reach="tool.actions.selectReach"
    @export="tool.nav.exportPreview"
    @finish="tool.nav.finish"
    @resume="tool.nav.resumeQuestionnaire"
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
// Les trois premières phases n'ont plus d'écran à elles : le cadrage,
// l'évaluation et les résultats sont trois sections empilées de `tool`, que
// ScreenTool1 compose et fait défiler. Les fichiers gardent leurs noms — le
// découpage se juge à l'usage avant d'être figé par un renommage — mais
// ScreenDiag et ScreenTool3 ne sont plus routés : c'est ScreenTool1 qui les
// monte, et lui seul.
//
// `tool4` est la phase d'ancrage. Elle reste un écran à part, et ce n'est pas un
// oubli : elle s'ouvre sur la question de portée, dont la réponse change tout ce
// qui la suit. Amenée par le défilement, on y répondrait en passant, sans avoir
// vu qu'on décidait.
import { computed } from 'vue'
import ScreenHome from './screens/ScreenHome.vue'
import ScreenInfo from './screens/ScreenInfo.vue'
import ScreenDemo from './screens/ScreenDemo.vue'
import ScreenTool1 from './screens/ScreenTool1.vue'
import ScreenAncrage from './screens/ScreenAncrage.vue'
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

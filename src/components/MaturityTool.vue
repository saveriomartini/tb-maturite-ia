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
    v-else-if="screen === 'tool1'"
    :cadrage3="tool.cadrage3"
    @select-option="tool.actions.selectOption"
    @dismiss-warning="tool.actions.dismissContextWarning"
    @back="tool.nav.back"
    @next="tool.nav.next"
  />
  <ScreenDiag
    v-else-if="screen === 'tool2'"
    :vm="tool.diag"
    @answer="tool.actions.answerArea"
    @open-area="tool.actions.openArea"
    @back="tool.nav.back"
    @next="tool.nav.next"
  />
  <ScreenTool3
    v-else-if="screen === 'tool3'"
    :resti1="tool.resti1"
    :resti2="tool.resti2"
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
// Les écrans de cadrage et de restitution ne sont plus routés individuellement :
// ils sont devenus des sections empilées dans `info`, `tool1` et `tool3`, qui
// portent le gabarit et la navigation. Leurs fichiers gardent leurs noms, le
// temps qu'un renommage se justifie.
//
// `tool4` est la phase d'ancrage, rétablie : la portée visée s'y déclare, le
// profil visé s'en déduit, et l'écart s'y lit. Le palier — qui fermait la
// première série du questionnaire — a disparu avec les séries.
import { computed } from 'vue'
import ScreenHome from './screens/ScreenHome.vue'
import ScreenInfo from './screens/ScreenInfo.vue'
import ScreenDemo from './screens/ScreenDemo.vue'
import ScreenTool1 from './screens/ScreenTool1.vue'
import ScreenDiag from './screens/ScreenDiag.vue'
import ScreenTool3 from './screens/ScreenTool3.vue'
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

<template>
  <ScreenHome v-if="vm.isHome" :vm="vm" />
  <ScreenCadrage1 v-else-if="vm.isCadrage1" :vm="vm" />
  <ScreenCadrage2 v-else-if="vm.isCadrage2" :vm="vm" />
  <ScreenCadrage3 v-else-if="vm.isCadrage3" :vm="vm" :state="state" />
  <ScreenDiagStart v-else-if="vm.isDiagStart" :vm="vm" />
  <ScreenDiag v-else-if="vm.isDiag" :vm="vm" />
  <ScreenResti1 v-else-if="vm.isResti1" :vm="vm" />
  <ScreenResti2 v-else-if="vm.isResti2" :vm="vm" />
  <ScreenResti3 v-else-if="vm.isResti3" :vm="vm" />
  <ScreenExport v-else-if="vm.isExport" :vm="vm" />
</template>

<script setup>
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

defineProps(['state', 'vm'])
</script>

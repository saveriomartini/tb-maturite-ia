<template>
  <div class="app">
    <AppHeader
      :vm="tool.header"
      @home="tool.nav.home"
      @phase="tool.nav.phase"
      @reset="tool.actions.resetSession"
    />
    <MaturityTool :tool="tool" />
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import MaturityTool from './components/MaturityTool.vue'
import { useMaturityTool } from './composables/useMaturityTool.js'

const tool = useMaturityTool()
</script>

<style scoped>
.app {
  min-height: 100vh;
  padding-bottom: 64px;
  background: var(--color-bg);
}
</style>

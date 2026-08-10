<template>
  <div style="max-width:1440px;margin:0 auto;padding:32px 40px 0">
    <div style="display:flex;align-items:baseline;gap:16px">
      <div :style="vm.levelBadgeStyle">{{ vm.targetLabel }}</div>
      <div style="font-size:13px;line-height:1.4;max-width:620px">selon le niveau cible vous êtes soumis seulement aux pratiques et objectifs qui vous concernent : {{ vm.scopeSummary }}</div>
    </div>
    <div style="margin-top:22px;display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:2px solid var(--color-text)">
      <div v-for="b in vm.scopeMap" :key="b.name" :style="b.colStyle">
        <div style="font-family:var(--font-heading);font-weight:800;font-size:14px;padding:10px 14px;border-bottom:2px solid var(--color-text)">{{ b.name }}</div>
        <div style="padding:12px;display:flex;flex-direction:column;gap:10px">
          <div v-for="d in b.dims" :key="d.name" style="border:1px solid var(--color-divider);background:var(--color-neutral-100)">
            <div :style="d.headStyle">{{ d.name }}</div>
            <div style="padding:8px 10px;display:flex;flex-direction:column;gap:4px">
              <div v-for="(a, ai) in d.areas" :key="ai" :style="a.style">{{ a.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:24px">
      <button class="btn btn-ghost" @click="vm.onBack">Retour</button>
      <button class="btn btn-primary" style="min-width:180px" @click="vm.onNextScreen">Commencer</button>
    </div>
  </div>
</template>

<script setup>
defineProps(['vm'])
</script>

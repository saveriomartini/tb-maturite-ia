<template>
  <div style="max-width:1440px;margin:0 auto;padding:32px 40px 0">
    <div style="display:flex;gap:36px;font-size:12px;flex-wrap:wrap">
      <div><span style="font-weight:700">Niveau Cible (Recommandé) : </span>{{ vm.targetLabel }}</div>
      <div style="color:var(--color-text)"><span style="font-weight:700">Niveau Acquis : </span>{{ vm.acquiredLabel }}</div>
    </div>
    <div style="margin-top:20px;font-family:var(--font-heading);font-weight:800;font-size:22px">Liste des Pratiques manquantes (Gap)</div>
    <div style="margin-top:6px;font-size:12px;color:var(--color-neutral-700)">{{ vm.gapSummary }}</div>
    <div style="margin-top:18px;display:flex;flex-direction:column;gap:22px">
      <div v-for="(b, bi) in vm.gapBlocks" :key="bi" style="border:2px solid var(--color-text)">
        <div style="padding:9px 14px;background:var(--color-text);color:#fff;font-family:var(--font-heading);font-weight:800;font-size:13px">{{ b.name }}</div>
        <div v-for="(g, gi) in b.groups" :key="gi" :style="g.wrapStyle">
          <div style="display:grid;grid-template-columns:220px 220px 1fr;gap:16px;align-items:start">
            <div :style="g.dimStyle">{{ g.dim }}</div>
            <div style="font-size:12.5px;font-family:var(--font-heading);font-weight:800;line-height:1.25">{{ g.area }}</div>
            <div style="display:flex;flex-direction:column;gap:10px">
              <div v-for="(o, oi) in g.objs" :key="oi">
                <div style="font-size:10.5px;font-weight:800;color:var(--color-text);letter-spacing:0.04em">{{ o.label }}</div>
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px;margin-top:6px">
                  <div v-for="(p, pi) in o.practices" :key="pi" style="border:1px solid var(--color-text);background:var(--color-neutral-200);padding:8px 10px;font-size:11px;line-height:1.35">{{ p.t }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:24px">
      <button class="btn btn-ghost" @click="vm.onBack">Retour</button>
      <div style="display:flex;gap:12px">
        <button class="btn btn-secondary" style="min-width:140px" @click="vm.onExport">Export</button>
        <button class="btn btn-primary" style="min-width:120px" @click="vm.onFinish">Fin</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['vm'])
</script>

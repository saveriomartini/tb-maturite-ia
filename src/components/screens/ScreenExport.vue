<template>
  <div style="max-width:1440px;margin:0 auto;padding:32px 40px 0">
    <div style="display:flex;justify-content:space-between;align-items:baseline">
      <div style="font-size:12px;color:var(--color-neutral-700)">Aperçu de l'export PDF — {{ vm.exportMeta }}</div>
      <button class="btn btn-ghost" @click="vm.onBack">Retour</button>
    </div>
    <div style="margin-top:18px;display:flex;flex-direction:column;gap:28px;align-items:center">
      <div v-for="(pg, pgi) in vm.exportPages" :key="pgi" style="width:794px;min-height:1123px;background:#fff;border:1px solid var(--color-neutral-400);box-shadow:var(--shadow-md);padding:44px 48px;display:flex;flex-direction:column">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid var(--color-text);padding-bottom:10px">
          <div>
            <div style="font-family:var(--font-heading);font-weight:800;font-size:15px">Liste des Pratiques manquantes (Gap)</div>
            <div style="font-size:10px;color:var(--color-neutral-700);margin-top:3px">{{ vm.exportMeta }}</div>
          </div>
          <div style="text-align:right;font-size:10px;line-height:1.5">
            <div>Niveau Cible : <span style="font-weight:700">{{ vm.targetLabel }}</span></div>
            <div>Niveau Acquis : <span style="font-weight:700;color:var(--color-text)">{{ vm.acquiredLabel }}</span></div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px;margin-top:16px;flex:1">
          <div :style="pg.emptyStyle">Aucune pratique manquante — toutes les areas du niveau cible sont acquises.</div>
          <div v-for="(g, gi) in pg.groups" :key="gi">
            <div style="display:flex;gap:8px;align-items:baseline;border-bottom:1px solid var(--color-divider);padding-bottom:4px">
              <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-text);font-weight:800">{{ g.block }}</div>
              <div :style="g.swatchStyle"></div>
              <div style="font-size:9.5px;color:var(--color-neutral-700)">{{ g.dim }}</div>
              <div style="margin-left:auto;font-family:var(--font-heading);font-weight:800;font-size:11.5px">{{ g.area }}</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">
              <div v-for="(o, oi) in g.objs" :key="oi">
                <div style="font-size:9.5px;line-height:1.4;color:var(--color-neutral-800)"><span style="font-weight:800;color:var(--color-text)">{{ o.label }} </span>{{ o.goal }}</div>
                <div style="display:flex;flex-direction:column;gap:3px;margin-top:4px;padding-left:12px">
                  <div v-for="(p, pi) in o.practices" :key="pi" style="font-size:9.5px;line-height:1.4">— {{ p.t }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="border-top:1px solid var(--color-divider);padding-top:8px;font-size:9.5px;color:var(--color-neutral-700);display:flex;justify-content:space-between">
          <div>{{ vm.exportMeta }}</div>
          <div>{{ pg.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['vm'])
</script>

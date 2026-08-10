<template>
  <div style="max-width:1440px;margin:0 auto;padding:32px 40px 0">
    <div style="display:flex;gap:44px;align-items:flex-start;flex-wrap:wrap">
      <div>
        <div style="font-size:11px;font-weight:700;color:var(--color-neutral-700)">Niveau Cible (Recommandé) :</div>
        <div style="font-family:var(--font-heading);font-weight:800;font-size:22px;margin-top:4px">{{ vm.targetLabel }}</div>
      </div>
      <div style="border-left:2px solid var(--color-text);padding-left:28px">
        <div style="font-size:11px;font-weight:700;color:var(--color-text)">Niveau Acquis :</div>
        <div style="font-family:var(--font-heading);font-weight:800;font-size:22px;margin-top:4px;color:var(--color-text)">{{ vm.acquiredLabel }}</div>
      </div>
    </div>
    <div style="margin-top:26px;display:grid;grid-template-columns:340px 1fr;gap:0;border:2px solid var(--color-text)">
      <div style="border-right:2px solid var(--color-text)">
        <div v-for="(l, li) in vm.levelLadder" :key="li" :style="l.rowStyle">
          <div style="font-family:var(--font-heading);font-weight:800;font-size:13px">{{ l.label }}</div>
          <div :style="l.tagStyle">{{ l.badge }}</div>
        </div>
      </div>
      <div style="padding:20px 24px;background:var(--color-neutral-100)">
        <div style="font-size:14px;line-height:1.5;max-width:760px;text-wrap:pretty">{{ vm.acquiredDesc }}</div>
      </div>
    </div>
    <div style="margin-top:26px;font-size:11px;font-weight:700">Détails :</div>
    <div style="margin-top:10px;display:grid;grid-template-columns:repeat(4,1fr);border:2px solid var(--color-text)">
      <div v-for="(b, bi) in vm.blockScores" :key="bi" :style="b.colStyle">
        <div style="font-family:var(--font-heading);font-weight:800;font-size:15px">{{ b.name }}</div>
        <div style="font-size:11px;color:var(--color-neutral-700);margin-top:4px">{{ b.levelLabel }}</div>
        <div style="display:flex;gap:24px;margin-top:16px">
          <div>
            <div style="font-size:10.5px;color:var(--color-neutral-700)">Objectifs :</div>
            <div style="font-family:var(--font-heading);font-weight:800;font-size:24px">{{ b.obj }}</div>
          </div>
          <div>
            <div style="font-size:10.5px;color:var(--color-neutral-700)">Pratiques :</div>
            <div style="font-family:var(--font-heading);font-weight:800;font-size:24px">{{ b.prat }}</div>
          </div>
        </div>
        <div style="height:6px;background:var(--color-neutral-300);margin-top:14px">
          <div :style="b.barStyle"></div>
        </div>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:24px">
      <button class="btn btn-ghost" @click="vm.onBack">Retour</button>
      <button class="btn btn-primary" style="min-width:160px" @click="vm.onNextScreen">Suivant</button>
    </div>
  </div>
</template>

<script setup>
defineProps(['vm'])
</script>

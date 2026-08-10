<template>
  <div style="max-width:1440px;margin:0 auto;padding:24px 40px 0">
    <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
      <div :style="vm.levelBadgeStyle">{{ vm.curAreaLevelLabel }}</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">
        <div v-for="(d, di) in vm.dimStrip" :key="di" :style="d.style" @click="d.onClick">{{ d.name }}</div>
      </div>
      <div style="margin-left:auto;font-size:11px;color:var(--color-neutral-700)">{{ vm.diagProgress }}</div>
    </div>
    <div style="margin-top:18px;display:grid;grid-template-columns:250px 1fr;gap:0;border:2px solid var(--color-text);background:var(--color-neutral-100)">
      <div style="border-right:2px solid var(--color-text);padding:16px">
        <div :style="vm.curDimBandStyle"></div>
        <div style="font-family:var(--font-heading);font-weight:800;font-size:17px">{{ vm.curBlockName }}</div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-top:12px">
          <div v-for="(d, di) in vm.curBlockDims" :key="di" :style="d.style" @click="d.onClick">{{ d.name }}</div>
        </div>
        <div style="margin-top:22px;font-size:11px;font-weight:700">Area :</div>
        <div style="font-family:var(--font-heading);font-weight:800;font-size:19px;line-height:1.2;margin-top:6px">{{ vm.curAreaName }}</div>
        <div style="font-size:11.5px;line-height:1.45;color:var(--color-neutral-800);margin-top:10px">{{ vm.curAreaDesc }}</div>
        <div style="margin-top:18px;border-top:1px solid var(--color-divider);padding-top:12px;font-size:11px;color:var(--color-neutral-700)">{{ vm.curAreaScore }}</div>
      </div>
      <div style="padding:18px 20px">
        <div style="display:flex;flex-direction:column;gap:18px">
          <div v-for="(g, gi) in vm.curGoals" :key="gi" :style="g.wrapStyle">
            <div style="display:flex;gap:12px;align-items:flex-start">
              <div style="font-size:11.5px;font-weight:800;width:74px;flex:none;padding-top:1px">{{ g.label }}</div>
              <div style="font-size:12.5px;line-height:1.45;max-width:760px">{{ g.text }}</div>
              <div :style="g.stateStyle">{{ g.state }}</div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:8px;margin-top:12px;padding-left:86px;align-items:stretch">
              <div v-for="(c, ci) in g.cards" :key="ci" :style="c.style" @click="c.onClick">
                <div :style="c.markStyle">{{ c.mark }}</div>
                <div style="font-size:11.5px;line-height:1.5">{{ c.text }}</div>
              </div>
            </div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:26px;border-top:2px solid var(--color-text);padding-top:16px">
          <button class="btn btn-ghost" @click="vm.onBack">Précédent</button>
          <div style="display:flex;gap:10px;align-items:center">
            <div style="font-size:11px;color:var(--color-neutral-700)">{{ vm.curAreaHint }}</div>
            <button class="btn btn-primary" style="min-width:150px" @click="vm.onNextScreen">{{ vm.diagNextLabel }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['vm'])
</script>

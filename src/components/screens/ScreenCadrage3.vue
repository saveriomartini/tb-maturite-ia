<template>
  <div style="max-width:1440px;margin:0 auto;padding:32px 40px 0;display:grid;grid-template-columns:1fr 340px;gap:32px;align-items:start">
    <div style="border:2px solid var(--color-text);background:var(--color-neutral-100)">
      <div style="padding:10px 18px;border-bottom:2px solid var(--color-text);font-size:10px;text-transform:uppercase;letter-spacing:0.1em;font-weight:800">Périmètre et niveau cible</div>
      <div style="padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:22px 28px">
        <div v-for="f in vm.formFields" :key="f.id">
          <div style="font-size:11px;font-weight:700;margin-bottom:7px">{{ f.label }} :</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            <div v-for="o in f.options" :key="o.value" :style="o.style" @click="o.onClick">{{ o.label }}</div>
          </div>
          <div style="font-size:10.5px;color:var(--color-neutral-700);margin-top:6px">{{ f.hint }}</div>
        </div>
      </div>
    </div>
    <div>
      <div style="border:2px solid var(--color-text);background:var(--color-text);color:#fff;padding:20px">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;font-weight:800">Niveau cible recommandé</div>
        <div style="font-family:var(--font-heading);font-weight:800;font-size:26px;line-height:1.1;margin-top:12px">{{ vm.recommendedLabel }}</div>
        <div style="font-size:12px;line-height:1.45;margin-top:12px">{{ vm.recommendedWhy }}</div>
      </div>
      <div style="border:2px solid var(--color-text);border-top:0;padding:18px;background:var(--color-neutral-100)">
        <div style="font-size:11px;font-weight:700;margin-bottom:8px">Niveau cible retenu :</div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <div v-for="(t, ti) in vm.targetOptions" :key="ti" :style="t.style" @click="t.onClick">{{ t.label }}</div>
        </div>
        <div style="font-size:11px;color:var(--color-neutral-700);margin-top:12px">{{ vm.scopeSummary }}</div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:20px;gap:12px">
        <button class="btn btn-ghost" @click="vm.onBack">Retour</button>
        <button class="btn btn-primary" style="min-width:150px" @click="vm.onNextScreen">Suivant</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['vm', 'state'])
</script>

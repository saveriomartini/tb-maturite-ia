<template>
  <div style="max-width:1440px;margin:0 auto;padding:56px 40px 0">
    <div style="max-width:900px;border-left:6px solid var(--color-text);padding:24px 28px;background:var(--color-neutral-100)">
      <div style="font-family:var(--font-heading);font-weight:800;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--color-text)">NB</div>
      <div style="margin-top:10px;font-size:19px;line-height:1.45;text-wrap:pretty">Il est très important de bien définir (avec ou sans l'assistance offerte par l'outil) son niveau cible AVANT l'évaluation. Cela permet de sélectionner les areas de compétence intéressantes pour l'organisation et d'établir ainsi les priorités d'action.</div>
    </div>
    <div style="display:flex;justify-content:flex-end;margin-top:32px;gap:12px;max-width:900px">
      <button class="btn btn-ghost" @click="vm.onBack">Retour</button>
      <button class="btn btn-primary" style="min-width:160px" @click="vm.onNextScreen">Suivant</button>
    </div>
  </div>
</template>

<script setup>
defineProps(['vm'])
</script>

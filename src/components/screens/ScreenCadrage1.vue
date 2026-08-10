<template>
  <div style="max-width:1440px;margin:0 auto;padding:32px 40px 0">
    <div style="max-width:860px;font-size:14px;line-height:1.5;text-wrap:pretty">Le modèle est proposé en 4 blocs-thématiques où ses 9 dimensions sont organisées ; à l'intérieur de chaque dimension on retrouve des areas de compétence, pour un total de 28 areas. Pour considérer une area de compétence acquise, il faut avoir accompli tous les objectifs correspondants. Le parcours d'évaluation est guidé par des pratiques à valider si mises en place par l'organisation.</div>
    <div class="hr" style="margin:24px 0"></div>
    <div style="display:grid;grid-template-columns:200px 260px 1fr;gap:0;border:2px solid var(--color-text);background:var(--color-neutral-100)">
      <div style="border-right:2px solid var(--color-text)">
        <div style="padding:8px 14px;border-bottom:2px solid var(--color-text);font-size:10px;text-transform:uppercase;letter-spacing:0.1em;font-weight:800">blocs</div>
        <div style="padding:14px;display:flex;flex-direction:column;gap:10px">
          <div v-for="(b, bi) in vm.blockChips" :key="bi" :style="b.style">{{ b.name }}</div>
        </div>
      </div>
      <div style="border-right:2px solid var(--color-text)">
        <div style="padding:8px 14px;border-bottom:2px solid var(--color-text);font-size:10px;text-transform:uppercase;letter-spacing:0.1em;font-weight:800">dimensions</div>
        <div style="padding:14px;display:flex;flex-direction:column;gap:6px">
          <div v-for="(d, di) in vm.dimChips" :key="di" :style="d.style">{{ d.name }}</div>
        </div>
      </div>
      <div>
        <div style="padding:8px 14px;border-bottom:2px solid var(--color-text);font-size:10px;text-transform:uppercase;letter-spacing:0.1em;font-weight:800">areas</div>
        <div style="padding:14px;display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
          <div v-for="(a, ai) in vm.areaChips" :key="ai" :style="a.style">{{ a.name }}</div>
        </div>
      </div>
    </div>
    <div style="margin-top:28px;font-size:14px;line-height:1.5">Ainsi que 5 niveaux de maturité qui seront attribués à l'organisation :</div>
    <div style="margin-top:14px;border:2px solid var(--color-text)">
      <div v-for="(l, li) in vm.levelRows" :key="li" :style="l.rowStyle">
        <div style="font-family:var(--font-heading);font-weight:800;font-size:13px;width:210px;flex:none">{{ l.label }}</div>
        <div style="font-size:12px;color:var(--color-neutral-800);line-height:1.4">{{ l.tag }}</div>
      </div>
    </div>
    <div style="margin-top:12px;font-size:12px;color:var(--color-neutral-700)">Le niveau de maturité par bloc peut être calculé séparément dans cet outil.</div>
    <div style="display:flex;justify-content:flex-end;margin-top:24px;gap:12px">
      <button class="btn btn-ghost" @click="vm.onBack">Retour</button>
      <button class="btn btn-primary" style="min-width:160px" @click="vm.onNextScreen">Suivant</button>
    </div>
  </div>
</template>

<script setup>
defineProps(['vm'])
</script>

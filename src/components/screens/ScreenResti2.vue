<template>
  <div style="max-width:1440px;margin:0 auto;padding:32px 40px 0">
    <div style="display:flex;gap:36px;font-size:12px;flex-wrap:wrap">
      <div><span style="font-weight:700">Niveau Cible (Recommandé) : </span>{{ vm.targetLabel }}</div>
      <div style="color:var(--color-text)"><span style="font-weight:700">Niveau Acquis : </span>{{ vm.acquiredLabel }}</div>
    </div>
    <div style="margin-top:18px;font-size:11px;font-weight:700">Détails :</div>
    <div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start">
      <div v-for="(b, bi) in vm.detailBlocks" :key="bi" style="border:2px solid var(--color-text)">
        <div style="padding:10px 14px;border-bottom:2px solid var(--color-text);font-family:var(--font-heading);font-weight:800;font-size:14px">{{ b.name }}</div>
        <table class="table" style="width:100%">
          <thead>
            <tr>
              <th style="width:33%">Dimension</th>
              <th>Area</th>
              <th style="width:78px">Objectifs</th>
              <th style="width:78px">Pratiques</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, ri) in b.rows" :key="ri">
              <td :style="r.dimStyle">{{ r.dim }}</td>
              <td :style="r.areaStyle">{{ r.area }}</td>
              <td :style="r.objStyle">{{ r.obj }}</td>
              <td :style="r.pratStyle">{{ r.prat }}</td>
            </tr>
          </tbody>
        </table>
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

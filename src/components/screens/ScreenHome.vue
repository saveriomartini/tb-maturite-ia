<template>
  <div style="max-width:1440px;margin:0 auto;padding:32px 40px 0">
    <div style="display:grid;grid-template-columns:200px 1fr;gap:0;border:2px solid var(--color-text);background:var(--color-neutral-100)">
      <div style="padding:18px 20px;border-right:2px solid var(--color-text)">
        <div style="font-family:var(--font-heading);font-weight:800;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-text)">User</div>
        <div style="margin-top:10px;font-size:11px;font-weight:700">Persona :</div>
        <div style="font-size:13px;line-height:1.35;margin-top:4px">CoDir d'une PME de l'Arc Jurassien</div>
        <div style="margin-top:16px;font-size:11px;font-weight:700">Attentes :</div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-top:6px">
          <div style="font-size:12px;line-height:1.35">— comprendre comment évaluer l'adoption de l'IA en entreprise</div>
          <div style="font-size:12px;line-height:1.35">— définir son niveau de maturité selon le modèle proposé</div>
          <div style="font-size:12px;line-height:1.35">— générer des projets basés sur des leviers d'action selon priorité</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr)">
        <div v-for="c in vm.journey" :key="c.n" :style="c.colStyle">
          <div style="display:flex;align-items:baseline;gap:8px">
            <div style="font-family:var(--font-heading);font-weight:800;font-size:26px;line-height:1" :style="{ color: c.num }">{{ c.n }}</div>
            <div style="font-family:var(--font-heading);font-weight:800;font-size:17px;letter-spacing:-0.01em">{{ c.name }}</div>
            <div :style="c.flagStyle">{{ c.flag }}</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;margin-top:14px">
            <div v-for="(s, si) in c.steps" :key="si" :style="s.style">{{ s.t }}</div>
          </div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:200px 1fr;border:2px solid var(--color-text);border-top:0">
      <div style="padding:14px 20px;border-right:2px solid var(--color-text)">
        <div style="font-size:11px;font-weight:700;line-height:1.3">Points de friction et opportunités :</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr)">
        <div v-for="c in vm.journey" :key="c.n" :style="c.frictionColStyle">
          <div style="display:flex;flex-direction:column;gap:5px">
            <div v-for="(f, fi) in c.frictions" :key="fi" style="font-size:11px;line-height:1.35;color:var(--color-neutral-800)">— {{ f.t }}</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:5px;margin-top:10px;border-top:1px solid var(--color-divider);padding-top:10px">
            <div v-for="(o, oi) in c.opps" :key="oi" style="font-size:11px;line-height:1.35;color:var(--color-text)">+ {{ o.t }}</div>
          </div>
        </div>
      </div>
    </div>

    <div style="display:flex;justify-content:flex-end;margin-top:24px">
      <button class="btn btn-primary" style="min-width:180px" @click="vm.onStart">Start</button>
    </div>
  </div>
</template>

<script setup>
defineProps(['vm'])
</script>

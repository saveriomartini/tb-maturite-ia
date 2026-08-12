<template>
  <div style="max-width:1440px;margin:0 auto;padding:32px 40px 0;display:grid;grid-template-columns:1fr 360px;gap:32px;align-items:start">
    <div style="border:2px solid var(--color-text);background:var(--color-neutral-100)">
      <div style="padding:10px 18px;border-bottom:2px solid var(--color-text);font-size:10px;text-transform:uppercase;letter-spacing:0.1em;font-weight:800">Attributs de contexte — périmètre et niveau cible</div>

      <div v-for="(g, gi) in vm.formGroups" :key="g.id" style="border-bottom:1px solid var(--color-divider)">
        <div style="padding:10px 20px 0;font-family:var(--font-heading);font-weight:800;font-size:12px;letter-spacing:0.02em">{{ g.label }}</div>
        <div style="padding:12px 20px 20px;display:grid;grid-template-columns:1fr 1fr;gap:20px 28px">
          <fieldset v-for="f in g.fields" :key="f.id" style="border:0;margin:0;padding:0;min-width:0">
            <legend style="padding:0;display:flex;align-items:center;gap:7px;margin-bottom:7px;flex-wrap:wrap">
              <span :style="f.dotStyle"></span>
              <span style="font-size:11px;font-weight:700">{{ f.label }}</span>
              <span :style="f.aimmStyle">{{ f.aimm }}</span>
            </legend>
            <div role="radiogroup" :aria-label="f.label" style="display:flex;flex-wrap:wrap;gap:6px">
              <button
                v-for="o in f.options" :key="o.value"
                type="button" role="radio" :aria-checked="o.active"
                :style="o.style" @click="o.onClick">{{ o.label }}</button>
            </div>
            <div :style="f.hintStyle">{{ f.hint }}</div>
          </fieldset>
        </div>
      </div>

      <div style="padding:12px 20px 18px">
        <button type="button" class="btn btn-ghost" style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;padding-inline:0" :aria-expanded="vm.showContext" @click="vm.onToggleContext">{{ vm.contextToggleLabel }}</button>
        <div :style="vm.contextPanelStyle">
          <div style="font-size:10.5px;color:var(--color-neutral-700);margin:4px 0 14px;max-width:640px">Attributs documentaires issus de la Table 1 du modèle. Ils décrivent l’unité évaluée et n’interviennent pas dans le calcul du niveau cible.</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px 28px">
            <fieldset v-for="f in vm.descriptiveFields" :key="f.id" style="border:0;margin:0;padding:0;min-width:0">
              <legend style="padding:0;display:flex;align-items:center;gap:7px;margin-bottom:7px;flex-wrap:wrap">
                <span :style="f.dotStyle"></span>
                <span style="font-size:11px;font-weight:700">{{ f.label }}</span>
                <span :style="f.aimmStyle">{{ f.aimm }}</span>
              </legend>
              <div role="radiogroup" :aria-label="f.label" style="display:flex;flex-wrap:wrap;gap:6px">
                <button
                  v-for="o in f.options" :key="o.value"
                  type="button" role="radio" :aria-checked="o.active"
                  :style="o.style" @click="o.onClick">{{ o.label }}</button>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div style="border:2px solid var(--color-text);background:var(--color-text);color:#fff;padding:20px">
        <div style="display:flex;align-items:center;gap:10px;justify-content:space-between">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;font-weight:800">Niveau cible recommandé</div>
          <div :style="vm.provisionalStyle">{{ vm.provisionalLabel }}</div>
        </div>
        <div style="font-family:var(--font-heading);font-weight:800;font-size:26px;line-height:1.1;margin-top:12px">{{ vm.recommendedLabel }}</div>

        <div style="margin-top:14px;display:flex;flex-direction:column;gap:8px">
          <div v-for="(fa, i) in vm.recommendedFactors" :key="i" style="font-size:11.5px;line-height:1.4">
            <span style="text-transform:uppercase;letter-spacing:0.07em;font-size:9px;font-weight:800;opacity:0.7">{{ fa.k }}</span>
            <span style="display:block">{{ fa.v }}</span>
          </div>
        </div>

        <div style="font-size:11.5px;line-height:1.45;margin-top:14px;opacity:0.85">{{ vm.recommendedWhy }}</div>

        <div style="margin-top:16px">
          <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.08em;font-weight:800;opacity:0.75">{{ vm.completenessLabel }}</div>
          <div style="height:4px;background:rgba(255,255,255,0.25);margin-top:6px">
            <div :style="vm.completenessBarStyle"></div>
          </div>
        </div>

        <button
          v-if="vm.canApplyRecommendation"
          type="button"
          style="margin-top:16px;width:100%;border:1px solid #fff;background:transparent;color:#fff;font-family:var(--font-heading);font-weight:800;font-size:11px;padding:9px 10px;cursor:pointer"
          @click="vm.onApplyRecommendation">{{ vm.applyLabel }}</button>
      </div>

      <div style="border:2px solid var(--color-text);border-top:0;padding:18px;background:var(--color-neutral-100)">
        <div style="font-size:11px;font-weight:700;margin-bottom:8px">Niveau cible retenu :</div>
        <div role="radiogroup" aria-label="Niveau cible retenu" style="display:flex;flex-direction:column;gap:6px">
          <button
            v-for="(t, ti) in vm.targetOptions" :key="ti"
            type="button" role="radio" :aria-checked="t.active"
            :style="t.style" @click="t.onClick">
            <span>{{ t.label }}</span>
            <span :style="t.badgeStyle">{{ t.badge }}</span>
          </button>
        </div>
        <div :style="vm.targetMismatchStyle">{{ vm.targetMismatchLabel }}</div>
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

<template>
  <div
    style="min-height: 100vh; background: var(--color-bg); padding: 0 0 64px"
  >
    <div
      style="
        border-bottom: 2px solid var(--color-text);
        background: var(--color-bg);
        position: sticky;
        top: 0;
        z-index: 5;
      "
    >
      <div
        style="
          max-width: 1440px;
          margin: 0 auto;
          padding: 14px 40px 0;
          display: flex;
          align-items: baseline;
          gap: 16px;
        "
      >
        <div style="display: flex; align-items: baseline; gap: 10px">
          <button
            type="button"
            class="brand-home"
            title="Retour à l'accueil"
            aria-label="MAIA - Maturité IA — retour à l'accueil"
            @click="vm.onHome"
          >
            MAIA - Maturité IA
          </button>
          <div
            style="
              font-family: var(--font-heading);
              font-weight: 800;
              font-size: 15px;
              letter-spacing: -0.01em;
            "
          >
            — Outil d'évaluation
          </div>
        </div>
        <div style="font-size: 11px; color: var(--color-neutral-700)">
          modèle v1.0 · CMU SEI / Accenture · consolidation Matrice N2
        </div>
        <div
          style="
            margin-left: auto;
            display: flex;
            align-items: baseline;
            gap: 12px;
            font-size: 11px;
            color: var(--color-neutral-700);
          "
        >
          <span>{{ vm.sessionLabel }}</span>
          <button
            v-if="vm.hasProgress"
            type="button"
            style="
              font-family: inherit;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 0.07em;
              font-weight: 700;
              color: var(--color-neutral-700);
              background: transparent;
              border: 1px solid var(--color-neutral-400);
              padding: 2px 7px;
              cursor: pointer;
            "
            @click="vm.onResetSession"
          >
            réinitialiser
          </button>
        </div>
      </div>
      <div
        style="
          max-width: 1440px;
          margin: 0 auto;
          padding: 10px 40px 0;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        "
      >
        <div v-for="p in vm.phases" :key="p.n" :style="p.tabStyle">
          <div
            style="display: flex; align-items: baseline; gap: 10px"
            :style="{ cursor: p.cursor }"
            @click="p.onClick"
          >
            <div :style="p.numStyle">{{ p.n }}</div>
            <div :style="p.nameStyle">{{ p.name }}</div>
            <div :style="p.flagStyle">{{ p.flag }}</div>
          </div>
          <div :style="p.descStyle">{{ p.l1 }}</div>
        </div>
      </div>
    </div>

    <MaturityTool :state="state" :vm="vm" />
  </div>
</template>

<script setup>
import { useMaturityTool } from "./composables/useMaturityTool.js";
import MaturityTool from "./components/MaturityTool.vue";

const { state, vm } = useMaturityTool();
</script>

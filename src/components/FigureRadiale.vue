<script setup>
/* Restitution d'une dimension a la maniere de la figure 5 d'Ozkaya et al. (2026) :
   un secteur par capability area, cinq anneaux concentriques pour les niveaux.
   Le trait epais marque le niveau de la dimension (regle du minimum). */
import { computed } from 'vue'
import { store } from '../store.js'
import { niveauDimension } from '../scoring.js'

const props = defineProps({ dimension: Object, regle: { type: String, default: 'min' } })

const CX = 150, CY = 150, R0 = 42, R1 = 132
const cas = computed(() => props.dimension.capability_areas)
const niveau = computed(() => niveauDimension(props.dimension, store.reponses, props.regle))

const rayon = (n) => R0 + ((R1 - R0) * n) / 5
const pt = (r, a) => [CX + r * Math.cos(a - Math.PI / 2), CY + r * Math.sin(a - Math.PI / 2)]

function secteur(i, n) {
  const pas = (Math.PI * 2) / cas.value.length
  const a0 = i * pas + 0.012, a1 = (i + 1) * pas - 0.012
  const ri = rayon(n - 1), ro = rayon(n)
  const [x1, y1] = pt(ri, a0), [x2, y2] = pt(ro, a0)
  const [x3, y3] = pt(ro, a1), [x4, y4] = pt(ri, a1)
  return `M${x1} ${y1}L${x2} ${y2}A${ro} ${ro} 0 0 1 ${x3} ${y3}L${x4} ${y4}A${ri} ${ri} 0 0 0 ${x1} ${y1}Z`
}

const teinte = (n) => `var(--n${n})`
function etat(ca, n) {
  if (ca.regime === 'placeholder') return 'hors'
  const rep = store.reponses[ca.id]
  if (rep === undefined) return 'vide'
  return n <= rep ? 'atteint' : 'vide'
}
function etiquette(i) {
  const pas = (Math.PI * 2) / cas.value.length
  const a = i * pas + pas / 2
  const [x, y] = pt(R1 + 12, a)
  return { x, y, anchor: x > CX + 4 ? 'start' : x < CX - 4 ? 'end' : 'middle' }
}
</script>

<template>
  <figure class="fig">
    <svg viewBox="0 0 300 300" role="img" :aria-label="'Restitution de la dimension ' + dimension.nom_fr">
      <g v-for="(ca, i) in cas" :key="ca.id">
        <path v-for="n in 5" :key="n" :d="secteur(i, n)"
          :fill="etat(ca, n) === 'atteint' ? teinte(n) : 'transparent'"
          :class="etat(ca, n)" />
      </g>
      <circle v-if="niveau" :r="rayon(niveau)" :cx="CX" :cy="CY" class="seuil" />
      <text v-for="(ca, i) in cas" :key="'t' + ca.id" class="lab"
        :x="etiquette(i).x" :y="etiquette(i).y" :text-anchor="etiquette(i).anchor">
        {{ ca.id }}
      </text>
      <text :x="CX" :y="CY - 4" text-anchor="middle" class="val">{{ niveau ?? '—' }}</text>
      <text :x="CX" :y="CY + 12" text-anchor="middle" class="unite">niveau</text>
    </svg>
    <figcaption>
      {{ dimension.nom_fr }}
      <span class="compte">{{ dimension.nb_ca }} DP</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.fig { margin: 0; }
svg { width: 100%; max-width: 300px; display: block; }
path { stroke: var(--trait); stroke-width: 0.6; }
path.hors { fill: transparent; stroke-dasharray: 2 2; }
.seuil { fill: none; stroke: var(--laiton); stroke-width: 2; }
.lab { font: 8px var(--mono); fill: var(--gris); }
.val { font: 700 20px var(--mono); fill: var(--encre); }
.unite { font: 7px var(--mono); fill: var(--gris); letter-spacing: 0.08em; }
figcaption { font-size: 0.85rem; margin-top: 0.3rem; display: flex; gap: 0.4rem; align-items: center; }
</style>

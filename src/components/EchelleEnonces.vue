<script setup>
import { enoncesDeLaCa, libelleNiveau, store } from '../store.js'
const props = defineProps({ caId: String })
const enonces = enoncesDeLaCa(props.caId)

function choisir(rang) { store.reponses[props.caId] = rang }
</script>

<template>
  <ol class="echelle">
    <li v-for="e in enonces" :key="e.id" :class="{ retenu: store.reponses[caId] === e.niveau }">
      <button class="palier" @click="choisir(e.niveau)"
        :aria-pressed="store.reponses[caId] === e.niveau">
        <span class="rang mono">{{ e.niveau }}</span>
        <span class="corps">
          <strong>{{ libelleNiveau(e.niveau).libelle_fr }}</strong>
          <span v-if="e.texte_fr">{{ e.texte_fr }}</span>
          <span v-else class="manquant">
            Enonce descriptif non redige.
            A deriver des goals de ce domaine croises avec la grille de niveau {{ e.niveau }}
            (Accountability, Planning, Resourcing).
          </span>
        </span>
      </button>
    </li>
  </ol>
</template>

<style scoped>
.echelle { list-style: none; margin: 0.5rem 0 0; padding: 0; }
.palier {
  display: flex; gap: 0.75rem; width: 100%; text-align: left;
  background: #fff; color: var(--encre); border: 1px solid var(--trait);
  border-radius: 3px; padding: 0.7rem 0.8rem; margin-bottom: 0.4rem; cursor: pointer;
}
.palier:hover { border-color: var(--ardoise); }
.retenu .palier { border-color: var(--ardoise); border-width: 2px; background: #f4f6f8; }
.rang { flex: 0 0 1.4rem; color: var(--laiton); font-weight: 700; }
.corps { display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.9rem; }
.manquant { color: var(--gris); font-style: italic; font-size: 0.82rem; }
</style>

<template>
  <div class="bandeau">
    MAQUETTE BASSE FIDELITE — Travail de Bachelor, HEG-Arc. Aucune donnee ne quitte ce navigateur.
    Les enonces descriptifs ne sont pas encore rediges : le parcours est navigable, l'instrument ne mesure rien.
  </div>
  <div class="enveloppe">
    <router-view />
    <p class="pied">
      Modele v{{ modele._meta.version }} — 9 dimensions, 26 capability areas.
      Referentiel de base : Ozkaya et al. (2026), AI Adoption Maturity Model v1.0, CMU-SEI.
      Vocabulaire du parcours : Elia et al. (2024).
    </p>
  </div>
</template>

<script setup>
import { modele } from './store.js'
</script>

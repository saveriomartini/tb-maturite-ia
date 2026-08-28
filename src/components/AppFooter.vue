<template>
  <footer class="footer">
    <div class="footer__inner">
      <p class="footer__sources">{{ attribution.short }}</p>
      <p class="footer__disclaimer">{{ attribution.disclaimer }}</p>
    </div>
  </footer>
</template>

<script setup>
// Pied de page d'attribution, commun à tous les écrans : il vit sous le
// routeur d'écrans plutôt que dans chacun d'eux, pour qu'aucun écran ajouté
// plus tard ne puisse l'oublier.
//
// Il porte la forme courte — les quatre sources en une ligne, puis le démenti.
// La liste détaillée, avec le rôle de chaque source, appartient à l'export et à
// l'écran d'information, où la place existe ; ce câblage-là relève d'une tâche
// ultérieure et la donnée l'attend déjà (`SOURCES` dans data/attribution.js).
//
// Le pied de page ne s'imprime pas : l'export compose ses propres pages, et une
// ligne surnuméraire en fin de document y viendrait après le dernier cadre, hors
// de toute page. Son attribution à lui sera posée dans l'en-tête ou le pied de
// chacune de ses pages.
defineProps({
  attribution: { type: Object, required: true }
})
</script>

<style scoped>
.footer {
  margin-top: 56px;
  padding-bottom: 8px;
  border-top: 2px solid var(--color-text);
  background: var(--color-surface);
}

.footer__inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 16px var(--gutter) 20px;
}

.footer__sources {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.5;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

.footer__disclaimer {
  max-width: 780px;
  margin: 6px 0 0;
  font-size: 11.5px;
  line-height: 1.5;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

@media print {
  .footer {
    display: none;
  }
}
</style>

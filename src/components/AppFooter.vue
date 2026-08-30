<template>
  <footer class="footer">
    <div class="footer__inner">
      <p class="footer__line">
        {{ attribution.short }}<br>
        <span class="footer__disclaimer">{{ attribution.disclaimer }}</span>
      </p>
    </div>
  </footer>
</template>

<script setup>
// Pied de page d'attribution, commun à tous les écrans : il vit sous le
// routeur d'écrans plutôt que dans chacun d'eux, pour qu'aucun écran ajouté
// plus tard ne puisse l'oublier.
//
// Il porte la forme courte — l'identité du travail, le référentiel de base et sa
// licence — puis le démenti, à la ligne. Un seul paragraphe, coupé par un saut
// de ligne et non par un blanc entre blocs : les deux phrases se lisent d'une
// traite, mais le démenti commence au bord gauche, là où l'œil le retrouve.
// C'est aussi ce qui le sépare, avec la teinte, plus sombre des deux.
//
// Les trois autres sources et le rôle de chacune appartiennent à l'export et à
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

.footer__line {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.5;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

/* Le démenti court dans la même phrase que l'attribution ; il ne s'en détache
   que par la teinte, assez pour qu'on le retrouve, pas assez pour qu'il devienne
   une ligne à part. */
.footer__disclaimer {
  color: var(--color-neutral-800);
}

@media print {
  .footer {
    display: none;
  }
}
</style>

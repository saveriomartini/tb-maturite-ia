<template>
  <section class="panel transformation">
    <h2 class="panel-head transformation__title">
      <span>{{ title }}</span>
      <span class="transformation__note">une seule réponse, révisable</span>
    </h2>

    <div class="transformation__body">
      <ContextField :field="field" pin-active @select="emit('select', $event)" />
    </div>
  </section>
</template>

<script setup>
// La question qui fixe le degré de transformation visé. Elle a changé deux fois
// de place et une fois de formulation, et les deux tiennent au même motif.
//
// Elle se posait au cadrage, avant qu'on ait lu un seul énoncé : on demandait au
// dirigeant de trancher sur un vocabulaire qu'il découvrait. Elle est désormais
// posée en phase d'ancrage, après l'évaluation, quand les mots du modèle ont un
// sens — et quand il sait où il en est.
//
// Elle portait surtout sur le palier lui-même : celui qui désignait « Alignement
// des processus » s'entendait répondre qu'il visait l'alignement des processus.
// Elle porte donc sur la **portée** — ce que l'adoption doit avoir touché si elle
// réussit —, jamais sur le degré ni sur le rang. Le degré s'en déduit ; il ne se
// choisit pas.
//
// Elle n'est plus obligatoire, et l'astérisque a disparu avec l'exigence : sans
// réponse, le profil visé retombe sur ce que les attributs de contexte portent,
// et l'écran le dit. Le panneau ne se replie pas : ce qui décide de tout ce qui
// suit reste sous les yeux pendant qu'on le lit.
//
// Au repos, la question se réduit à ses options : c'est le choix, et rien
// d'autre. Le détail de la situation retenue s'affiche dès qu'elle est cliquée,
// et le « + » du libellé donne les cinq d'un coup — deux portées voisines ne se
// départagent pas sur leur seul intitulé.
import ContextField from './ContextField.vue'

defineProps({
  field: { type: Object, required: true },
  title: { type: String, required: true }
})

const emit = defineEmits(['select'])
</script>

<style scoped>
.transformation {
  margin-bottom: 22px;
}

/* Le titre du panneau et sa glose au bout de la même barre : ce qu'on demande et
   ce que l'on risque en répondant se lisent d'un même coup d'œil, sans renvoi à
   une note de bas de page. */
.transformation__title {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 6px 14px;
  margin: 0;
  font-family: var(--font-body);
  line-height: inherit;
}

/* La glose n'est pas un second titre : elle abandonne les capitales et la
   graisse de la barre pour rester une glose. */
.transformation__note {
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: none;
  color: var(--color-neutral-700);
}

.transformation__body {
  padding: 14px 20px 18px;
}
</style>

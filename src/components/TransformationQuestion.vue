<template>
  <section class="panel transformation">
    <h2 class="panel-head transformation__title">
      <span>Degré de transformation visé <span aria-hidden="true">*</span></span>
      <span class="transformation__required"><span aria-hidden="true">*</span> champ obligatoire</span>
    </h2>

    <div class="transformation__body">
      <ContextField :field="field" pin-active required @select="emit('select', $event)" />
    </div>
  </section>
</template>

<script setup>
// Question d'intention, posée avant la description factuelle de l'organisation :
// jusqu'où l'adoption de l'IA doit-elle transformer la maison ? Les réponses
// sont les cinq profils du modèle, présentés comme les options d'un attribut de
// contexte pour ne pas introduire une seconde façon de répondre dans la même
// page.
//
// Le panneau ne se replie plus : la réponse fixe le profil visé, donc les areas
// qui seront parcourues. Ce qui décide du diagnostic reste sous les yeux
// pendant qu'on remplit le formulaire qui, lui, ne fait que le restreindre.
//
// C'est aussi la seule réponse exigée de l'écran — le reste du cadrage ne fait
// qu'affiner —, d'où l'astérisque de l'en-tête et l'`aria-required` du groupe
// d'options : le départ vers l'évaluation reste fermé tant qu'elle manque.
//
// Au repos, la question se réduit à ses cinq options : c'est le choix, et rien
// d'autre. La définition du profil retenu s'affiche dès qu'il est cliqué, et le
// « + » du libellé donne les cinq d'un coup — « Alignement des processus » ou
// « Mise à l'échelle en réseau » ne se départagent pas sur leur nom seul.
import ContextField from './ContextField.vue'

defineProps({
  field: { type: Object, required: true }
})

const emit = defineEmits(['select'])
</script>

<style scoped>
.transformation {
  margin-bottom: 22px;
}

/* La seule réponse exigée du cadrage porte sa marque dans son en-tête, et sa
   légende au bout de la même barre : le signe et ce qu'il veut dire se lisent
   d'un même coup d'œil, sans renvoi à une note de bas de page. */
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

/* La légende n'est pas un second titre : elle abandonne les capitales et la
   graisse de la barre pour rester une glose. */
.transformation__required {
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: none;
  color: var(--color-neutral-700);
}

.transformation__body {
  padding: 14px 20px 18px;
}
</style>

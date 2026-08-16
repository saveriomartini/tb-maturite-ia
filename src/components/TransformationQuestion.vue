<template>
  <section class="panel transformation">
    <h2 class="panel-head transformation__title">Degré de transformation visé</h2>

    <div class="transformation__body">
      <ContextField :field="field" default-open @select="emit('select', $event)" />
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
// Les définitions des cinq profils sont dépliées d'emblée, à l'inverse des
// attributs de contexte : « Alignement des processus » ou « Mise à l'échelle en
// réseau » ne se choisissent pas sur leur nom seul, et c'est la seule réponse
// du cadrage qui décide du périmètre.
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

.transformation__title {
  margin: 0;
  font-family: var(--font-body);
  line-height: inherit;
}

.transformation__body {
  padding: 14px 20px 18px;
}
</style>

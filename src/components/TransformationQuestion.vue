<template>
  <section class="panel transformation">
    <button
      type="button"
      class="button-reset transformation__head"
      :aria-expanded="open"
      :aria-controls="bodyId"
      @click="emit('toggle')"
    >
      <span>Degré de transformation visé</span>
      <span class="transformation__toggle">{{ toggleLabel }}</span>
    </button>

    <div v-show="open" :id="bodyId" class="transformation__body">
      <ContextField :field="field" @select="emit('select', $event)" />
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
// Le box se replie : la réponse n'entre encore dans aucun calcul, et rien
// n'oblige à la garder sous les yeux pendant qu'on remplit le formulaire.
import { useId } from 'vue'
import ContextField from './ContextField.vue'

defineProps({
  field: { type: Object, required: true },
  open: { type: Boolean, required: true },
  toggleLabel: { type: String, required: true }
})

const emit = defineEmits(['select', 'toggle'])

const bodyId = `transformation-body-${useId()}`
</script>

<style scoped>
.transformation {
  margin-bottom: 22px;
}

/* L'en-tête est la commande de repli : elle tient toute la largeur du panneau
   plutôt que d'exposer un bouton séparé à côté du titre. Les traits de
   `.panel-head` sont repris ici plutôt que par la classe utilitaire, que
   `.button-reset` écraserait — il la suit dans la feuille de tokens. */
.transformation__head {
  display: flex;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 14px;
  border-bottom: 2px solid var(--color-text);
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Replié, le panneau se réduit à son en-tête : le filet ne sépare plus rien. */
.transformation__head[aria-expanded='false'] {
  border-bottom: 0;
}

.transformation__head:hover {
  background: var(--color-neutral-200);
}

.transformation__toggle {
  flex: none;
  font-size: 9.5px;
  font-weight: 800;
  color: var(--color-neutral-700);
}

.transformation__body {
  padding: 14px 20px 18px;
}
</style>

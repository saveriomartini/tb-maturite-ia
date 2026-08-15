<template>
  <section class="panel descriptive">
    <button
      type="button"
      class="button-reset descriptive__head"
      :aria-expanded="open"
      :aria-controls="bodyId"
      @click="emit('toggle')"
    >
      <span>Contexte descriptif — facultatif</span>
      <span class="descriptive__toggle">{{ toggleLabel }}</span>
    </button>

    <div v-show="open" :id="bodyId" class="descriptive__body">
      <p class="descriptive__intro">
        Attributs documentaires issus de la Table 1 du modèle. Ils décrivent l’unité évaluée,
        n’entrent pas dans l’ordre du diagnostic et ne servent qu’aux statistiques comparatives.
      </p>
      <div class="descriptive__fields">
        <ContextField
          v-for="field in fields"
          :key="field.id"
          :field="field"
          @select="emit('select-option', field.id, $event)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
// Attributs documentaires. Ils vivaient au bas du formulaire de contexte, sous
// un bouton fantôme qui les faisait passer pour un repli de ce formulaire ; ils
// n'en sont pourtant pas : rien de ce qu'on répond ici ne touche au diagnostic.
// Le panneau autonome le dit par sa forme, et l'en-tête le dit par ses mots.
//
// Même gabarit pliable que TransformationQuestion : la page de cadrage n'a que
// deux façons de se replier, pas trois.
import { useId } from 'vue'
import ContextField from './ContextField.vue'

defineProps({
  fields: { type: Array, required: true },
  open: { type: Boolean, required: true },
  toggleLabel: { type: String, required: true }
})

const emit = defineEmits(['select-option', 'toggle'])

const bodyId = `descriptive-body-${useId()}`
</script>

<style scoped>
.descriptive {
  margin-top: 22px;
}

/* L'en-tête est la commande de repli : elle tient toute la largeur du panneau
   plutôt que d'exposer un bouton séparé à côté du titre. Les traits de
   `.panel-head` sont repris ici plutôt que par la classe utilitaire, que
   `.button-reset` écraserait — il la suit dans la feuille de tokens. */
.descriptive__head {
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
.descriptive__head[aria-expanded='false'] {
  border-bottom: 0;
}

.descriptive__head:hover {
  background: var(--color-neutral-200);
}

.descriptive__toggle {
  flex: none;
  font-size: 9.5px;
  font-weight: 800;
  color: var(--color-neutral-700);
}

.descriptive__body {
  padding: 14px 20px 18px;
}

.descriptive__intro {
  max-width: 640px;
  margin: 0 0 14px;
  font-size: 10.5px;
  color: var(--color-neutral-700);
}

.descriptive__fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 28px;
}

@media (max-width: 900px) {
  .descriptive__fields {
    grid-template-columns: 1fr;
  }

  .descriptive__body {
    padding-inline: 16px;
  }
}
</style>

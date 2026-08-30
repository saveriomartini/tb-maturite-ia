<template>
  <section class="panel descriptive">
    <h2 class="panel-head descriptive__head">
      <span>Organisation</span>
      <span class="descriptive__hint">purement statistique</span>
    </h2>

    <div class="descriptive__body">
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
// Le panneau autonome le dit par sa forme, son en-tête par ses mots — « purement
// statistique » tient en trois mots ce qu'un paragraphe d'introduction disait en
// trois lignes, et le dit avant qu'on lise les champs plutôt qu'après.
//
// Le panneau ne se replie plus. Trois champs sous un en-tête ne valent pas le
// pli, et le repli faisait de ces attributs une annexe qu'on n'ouvre pas : ils
// ne pèsent sur rien, mais ils se remplissent.
import ContextField from './ContextField.vue'

defineProps({
  fields: { type: Array, required: true }
})

const emit = defineEmits(['select-option'])
</script>

<style scoped>
.descriptive {
  margin-top: 22px;
}

/* Même partage que les deux autres en-têtes du cadrage : le titre à gauche, ce
   qu'il en est de ces réponses au bout de la même barre. */
.descriptive__head {
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
   graisse de la barre. */
.descriptive__hint {
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: none;
  color: var(--color-neutral-700);
}

.descriptive__body {
  padding: 14px 20px 18px;
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

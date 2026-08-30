<template>
  <section class="panel transformation">
    <h2 class="panel-head transformation__title">
      <span>{{ title }}</span>
      <span class="transformation__note">révisable à tout moment</span>
    </h2>

    <div class="transformation__body">
      <fieldset class="field">
        <legend class="field__label">
          {{ field.label }}
          <button
            type="button"
            class="button-reset field__toggle"
            :aria-expanded="open"
            :aria-controls="detailId"
            :aria-label="toggleLabel"
            @click="open = !open"
          >
            {{ open ? '−' : '+' }}
          </button>
        </legend>

        <div class="field__options" role="radiogroup" :aria-label="field.label">
          <button
            v-for="option in field.options"
            :key="option.value"
            type="button"
            role="radio"
            class="chip chip--nowrap field__option"
            :class="{ 'is-active': option.active }"
            :aria-checked="option.active"
            @click="emit('select', option.value)"
          >
            {{ option.label }}
          </button>
        </div>

        <ContextCriteria
          :id="detailId"
          :criteria="field.criteria"
          :hint="field.hint"
          :open="open"
        />
      </fieldset>
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
// et l'écran le dit. La glose de l'en-tête ne dit plus « une seule réponse » —
// un groupe de boutons radio ne dit rien d'autre par sa forme — mais garde ce
// qu'aucune forme ne montre : qu'on peut revenir dessus. Le panneau ne se replie pas : ce qui décide de tout ce qui
// suit reste sous les yeux pendant qu'on le lit.
//
// — pourquoi elle garde ses pastilles —
// Les attributs de contexte sont passés à la liste déroulante ; elle non, et ce
// n'est pas un oubli. Une liste déroulante fait choisir avant de montrer : elle
// masque ses options jusqu'à l'ouverture et n'en laisse qu'une une fois
// refermée. Or les cinq portées se **comparent** avant d'être choisies — deux
// voisines ne se départagent pas sur leur seul intitulé, et cette réponse-là
// décide du profil visé, donc de tout l'écart. Les cinq restent donc à plat, et
// le détail de celle qui est retenue s'affiche dessous, le « + » donnant les
// cinq d'un coup.
//
// C'est aussi pourquoi la question n'emprunte plus le champ des attributs de
// contexte : elle en partageait le composant avec un drapeau `pinActive` pour
// une seule chose, ce rappel du détail retenu — devenu la règle commune, et
// passé dans ContextCriteria. Le contrôle, lui, n'a jamais été le même.
import { computed, ref, useId } from 'vue'
import ContextCriteria from './ContextCriteria.vue'

const props = defineProps({
  field: { type: Object, required: true },
  title: { type: String, required: true }
})

const emit = defineEmits(['select'])

const open = ref(false)
const detailId = `detail-${useId()}`

const toggleLabel = computed(() =>
  `${open.value ? 'Masquer' : 'Afficher'} les cinq portées — ${props.field.label}`
)
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

.field {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.field__label {
  padding: 0;
  margin-bottom: 7px;
  font-size: 11px;
  font-weight: 700;
}

.field__toggle {
  margin-left: 5px;
  font-size: 13px;
  line-height: 1;
  font-weight: 400;
  color: var(--color-neutral-600);
}

.field__toggle:hover {
  color: var(--color-text);
}

.field__options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.field__option {
  --chip-padding: 7px 11px;
  --chip-font-size: 11px;
}

/* La portée retenue s'allume comme un rang d'indicateur — bord doublé, fond à
   peine teinté, libellé gras — plutôt que par l'aplat noir de la pastille
   ordinaire : c'est une réponse qu'on relit et qu'on corrige, pas un jalon
   franchi. Le retrait rendu au bord garde la pastille à sa taille : sans lui,
   chaque clic décalerait les options suivantes de deux pixels. */
.field__option.is-active {
  --chip-padding: 6px 10px;
  border: 2px solid var(--color-text);
  background: color-mix(in srgb, var(--color-text) 8%, transparent);
  font-weight: 800;
  color: var(--color-text);
}
</style>

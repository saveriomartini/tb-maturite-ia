<template>
  <div class="field">
    <div class="field__head">
      <label class="field__label" :for="selectId">{{ field.label }}</label>
      <button
        v-if="hasDetail"
        type="button"
        class="button-reset field__toggle"
        :aria-expanded="open"
        :aria-controls="detailId"
        :aria-label="toggleLabel"
        @click="open = !open"
      >
        {{ open ? '−' : '+' }}
      </button>
    </div>

    <div class="field__control">
      <select
        :id="selectId"
        class="field__select"
        :class="{ 'is-set': selected !== UNSET }"
        @change="select"
      >
        <option :value="UNSET" :selected="selected === UNSET">{{ UNSET_LABEL }}</option>
        <option
          v-for="option in field.options"
          :key="option.value"
          :value="option.value"
          :selected="option.active"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <ContextCriteria
      :id="detailId"
      :criteria="field.criteria"
      :hint="field.hint"
      :open="open"
    />
  </div>
</template>

<script setup>
// Un attribut de contexte : son libellé, ses options, son aide.
//
// La pastille cliquable a cédé la place à la liste déroulante. Treize attributs
// à quatre ou cinq options chacun faisaient une nappe de pastilles où le
// libellé de l'attribut se perdait ; la liste rend au formulaire la forme d'un
// formulaire, et le champ retenu se relit d'un coup d'œil au lieu de se
// chercher parmi ses voisins.
//
// — l'option « non renseigné », et pourquoi elle n'est pas facultative —
// Toute l'interface tient la même convention : recliquer la réponse retenue
// l'annule. Une liste déroulante ne l'a pas — on ne « reclique » pas une option,
// on en choisit une autre —, si bien qu'un attribut répondu par erreur ne se
// dérépondrait plus jamais. C'est la seule chose que cette forme retire, et
// l'option explicite est ce qui la rend. Elle vaut `null` en remontant, comme
// une pastille annulée : `answers` et `form` ne portent que des réponses.
//
// — ce que la liste masque, et qu'il faut rendre autrement —
// Une liste refermée ne montre qu'un libellé. Les critères d'acceptation, eux,
// doivent rester lisibles en séance projetée (décision du 14.08.2026) : celui de
// l'option retenue s'affiche donc sous le champ, et le « + » donne les cinq d'un
// coup. C'est ContextCriteria qui le tient, avec le pourquoi.
//
// La question de portée de l'ancrage ne passe pas par ici : elle garde ses
// pastilles, parce que ses cinq situations se comparent avant d'être choisies.
// Elle vit tout entière dans TransformationQuestion.
import { computed, ref, useId } from 'vue'
import ContextCriteria from './ContextCriteria.vue'

// Valeur de l'option « non renseigné ». Une chaîne vide, parce qu'un `<option>`
// ne porte que des chaînes ; elle est retraduite en `null` avant de remonter,
// puisque c'est ainsi que le formulaire dit qu'un attribut n'a pas de réponse.
//
// Son libellé est un tiret et non les mots « non renseigné » : c'est l'état de
// départ des treize champs, et treize fois la même phrase au-dessus d'un
// formulaire vierge le faisait lire comme une liste de manques. Le tiret est le
// signe employé partout ailleurs dans l'outil pour une valeur absente.
const UNSET = ''
const UNSET_LABEL = '—'

const props = defineProps({
  field: { type: Object, required: true }
})

const emit = defineEmits(['select'])

const open = ref(false)
const uid = useId()
const selectId = computed(() => `field-${props.field.id}-${uid}`)
const detailId = computed(() => `detail-${props.field.id}-${uid}`)
const hasDetail = computed(() => Boolean(props.field.hint) || props.field.criteria.length > 0)

const selected = computed(() => {
  const chosen = props.field.options.find(option => option.active)
  return chosen ? chosen.value : UNSET
})

const toggleLabel = computed(() =>
  `${open.value ? 'Masquer' : 'Afficher'} l’aide et les critères — ${props.field.label}`
)

// L'option retenue est marquée sur les `<option>` et non par une valeur posée
// sur le `<select>` : c'est la seule des deux écritures qui rende un document
// juste hors du navigateur — un `value` sur un `<select>` n'est pas du HTML, et
// le rendu côté serveur des tests ne saurait pas quelle option est choisie.
function select(event) {
  emit('select', event.target.value === UNSET ? null : event.target.value)
}
</script>

<style scoped>
.field {
  min-width: 0;
}

/* Le libellé à gauche, l'affordance d'aide au bout de la même ligne : le « + »
   ne suit plus le texte du libellé, où un libellé long le repoussait hors de
   vue. Il est aussi sorti du `<label>` — l'y laisser aurait fait ouvrir la
   liste à chaque clic sur l'aide. */
.field__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 5px;
}

.field__label {
  font-size: 11px;
  font-weight: 700;
  text-wrap: pretty;
}

/* Affordance discrète : présente sur chaque attribut qui porte une aide, elle
   ne doit pas concurrencer le libellé qu'elle suit. */
.field__toggle {
  flex: none;
  font-size: 13px;
  line-height: 1;
  font-weight: 400;
  color: var(--color-neutral-600);
}

.field__toggle:hover {
  color: var(--color-text);
}

/* Le chevron est dessiné au bord de l'enveloppe et non posé en image : un
   `<select>` est un élément remplacé et ne porte pas de pseudo-élément, mais
   surtout deux bords suffisent, et ils prennent la couleur du jeton — une image
   aurait figé la teinte dans son propre codage. */
.field__control {
  position: relative;
}

.field__control::after {
  content: '';
  position: absolute;
  right: 11px;
  top: 50%;
  width: 6px;
  height: 6px;
  margin-top: -5px;
  border-right: 1.5px solid var(--color-neutral-700);
  border-bottom: 1.5px solid var(--color-neutral-700);
  transform: rotate(45deg);
  pointer-events: none;
}

/* `appearance: none` parce que le système impose sinon ses coins arrondis et
   son dégradé, contre lesquels le reste de l'outil est carré et plat. */
.field__select {
  appearance: none;
  width: 100%;
  padding: 7px 26px 7px 9px;
  font-family: inherit;
  font-size: 12px;
  line-height: 1.35;
  color: var(--color-text);
  background: var(--color-neutral-100);
  border: 1px solid var(--color-divider);
  border-radius: 0;
  cursor: pointer;
}

.field__select:hover {
  border-color: var(--color-text);
}

/* L'attribut répondu se distingue de celui resté vide par son trait et sa
   graisse, jamais par une bordure doublée : sur une grille de quinze champs,
   un pixel de plus à chaque réponse ferait danser la colonne voisine. */
.field__select.is-set {
  border-color: var(--color-text);
  font-weight: 700;
}
</style>

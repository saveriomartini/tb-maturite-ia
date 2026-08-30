<template>
  <div v-show="open || visible.length" class="detail">
    <p v-if="hint && open" class="detail__hint">{{ hint }}</p>
    <dl v-if="visible.length" class="criteria">
      <div
        v-for="criterion in visible"
        :key="criterion.value"
        class="criteria__row"
        :class="{ 'is-active': criterion.active }"
      >
        <dt class="criteria__term">{{ criterion.label }}</dt>
        <dd class="criteria__def">{{ criterion.text }}</dd>
      </div>
    </dl>
  </div>
</template>

<script setup>
// L'aide et les critères d'acceptation d'un champ, sous le champ.
//
// Deux formes de champ les affichent — la liste déroulante des attributs de
// contexte et la question de portée, qui garde ses pastilles — et elles les
// affichent de la même façon. Le bloc vit donc ici plutôt qu'en double : le
// texte est le même, sa règle d'apparition aussi, et c'est cette règle qui porte
// la décision, pas le contrôle au-dessus.
//
// — la règle, et pourquoi elle est celle-là —
// Au repos, le critère de la seule option retenue. Déplié, les cinq d'un coup.
//
// La décision du 14.08.2026 a sorti ces critères de l'infobulle pour qu'ils
// restent lisibles en séance projetée : un plafond dur décide seul du niveau
// cible, et la réponse ne peut pas reposer sur une appréciation. Une liste
// déroulante rouvre exactement ce problème d'une autre manière — elle masque ses
// options jusqu'à l'ouverture, et une fois refermée elle ne montre plus qu'un
// libellé, sans le fait vérifiable qui le définit. D'où le critère retenu sous
// le champ : c'est ce que la forme retire, et il faut le rendre autrement.
//
// Le « + » garde son rôle : deux options voisines ne se départagent pas sur leur
// seul intitulé, et il faut pouvoir les comparer avant de choisir.
//
// L'état ouvert/fermé appartient au champ qui porte le bouton, pas à ce bloc :
// il ne décrit pas l'évaluation et ne survit pas à la session.
import { computed } from 'vue'

const props = defineProps({
  criteria: { type: Array, required: true },
  hint: { type: String, default: '' },
  open: { type: Boolean, default: false }
})

const visible = computed(() =>
  props.open ? props.criteria : props.criteria.filter(criterion => criterion.active)
)
</script>

<style scoped>
.detail {
  margin-top: 8px;
  padding-left: 10px;
  border-left: 2px solid var(--color-divider);
}

.detail__hint {
  margin: 0;
  font-size: 10.5px;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

.criteria {
  display: grid;
  gap: 7px;
  margin: 7px 0 0;
}

.criteria__row {
  font-size: 10.5px;
  line-height: 1.45;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

/* L'option retenue est rappelée en pleine teinte : après le choix, la liste
   sert de justification du niveau plafonné. Au repos elle est seule, et c'est
   alors la seule chose que le champ dit du fait qu'il vérifie. */
.criteria__row.is-active {
  color: var(--color-text);
}

.criteria__term {
  display: inline;
  font-weight: 700;
  color: var(--color-text);
}

.criteria__def {
  display: inline;
  margin: 0;
}

.criteria__def::before {
  content: ' — ';
}
</style>

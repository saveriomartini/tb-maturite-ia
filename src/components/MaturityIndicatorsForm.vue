<template>
  <section class="panel indicators">
    <h3 class="panel-head indicators__title">Indicateurs de maturité</h3>

    <div class="indicators__body">
      <div class="groups">
        <div v-for="indicator in indicators" :key="indicator.id" class="group">
          <p
            class="group__name"
            @mouseenter="show(indicator.id, indicator.desc)"
            @mouseleave="clear"
          >
            {{ indicator.name }}
          </p>

          <div class="scale" role="radiogroup" :aria-label="`${indicator.name} — ${indicator.desc}`">
            <button
              v-for="statement in indicator.statements"
              :key="statement.value"
              type="button"
              role="radio"
              class="button-reset step"
              :class="{ 'is-active': statement.active }"
              :aria-checked="statement.active"
              :aria-label="`${indicator.name} — ${statement.text}`"
              @click="emit('select', indicator.id, statement.value)"
              @mouseenter="show(indicator.id, statement.text)"
              @mouseleave="clear"
              @focus="show(indicator.id, statement.text)"
              @blur="clear"
            >
              {{ statement.value }}
            </button>
          </div>

          <p class="hint">{{ hint(indicator) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Les trois indicateurs de maturité de l'area affichée. Là où les objectifs
// disent *ce qui* est en place, l'indicateur dit *comment* l'area est tenue :
// qui en répond, comment elle est planifiée, avec quels moyens.
//
// Deux lignes de boutons et une ligne de texte. La première porte les trois
// libellés, la seconde les trois séries de cinq rangs — rien ne se déplie, rien
// ne se cache : les trois questions et les trois réponses tiennent sous les
// yeux. Aucune n'est jamais vide : à défaut de clic, c'est le rang par défaut
// qui vaut réponse, si bien qu'il n'y a pas d'état « pas encore répondu » à
// signaler.
//
// Les énoncés ne disparaissent pas pour autant : chaque série porte sa propre
// ligne d'aide, sous ses cinq cases. Au survol d'un rang, elle donne l'énoncé
// pointé ; au survol du libellé, la définition de l'indicateur ; au repos,
// l'énoncé retenu par cet indicateur-là. Les trois réponses se lisent donc en
// toutes lettres côte à côte, et parcourir une série n'efface pas ce que les
// deux autres disent.
//
// À l'arrivée sur l'area, la ligne affiche donc l'énoncé du rang par défaut,
// coché d'avance : la première chose lisible sous les cases est la situation
// que l'outil suppose tant qu'on ne l'a pas contredit — c'est elle qu'il faut
// lire pour savoir s'il y a lieu de la corriger. La définition de l'indicateur
// reste à un survol de son libellé. La ligne garde sa hauteur quoi qu'elle
// affiche, faute de quoi le bloc sauterait à chaque passage de souris.
//
// `focus` double `mouseenter` : au clavier, la même aide doit suivre le
// parcours des boutons. Le libellé, lui, n'est pas un bouton — il ne commande
// plus rien depuis que les trois séries sont affichées ensemble ; sa définition
// est portée par le `aria-label` du groupe, qui l'annonce à l'entrée.
import { ref } from 'vue'

defineProps({
  indicators: { type: Array, required: true }
})

const emit = defineEmits(['select'])

// Un seul texte survolé à la fois, rattaché à sa série : les deux autres
// continuent d'afficher leur propre réponse.
const hoveredId = ref(null)
const hoveredText = ref('')

function show(id, text) {
  hoveredId.value = id
  hoveredText.value = text
}

function clear() {
  hoveredId.value = null
  hoveredText.value = ''
}

function hint(indicator) {
  if (hoveredId.value === indicator.id) return hoveredText.value
  const statement = indicator.statements.find(candidate => candidate.active)
  return statement ? statement.text : indicator.desc
}
</script>

<style scoped>
/* Le bloc suit les objectifs sans se confondre avec eux : même largeur, mais
   encadré, parce qu'il change de question. */
.indicators {
  margin-top: 22px;
}

.indicators__title {
  margin: 0;
}

.indicators__body {
  padding: 12px 14px 14px;
}

/* Trois colonnes de même largeur, tirées d'un bord à l'autre du panneau : les
   deux lignes occupent toute la largeur du bloc, comme les objectifs au-dessus
   et la ligne d'aide en dessous. Les rangs de même valeur tombent alors les uns
   sous les autres d'une série à l'autre. */
.groups {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px 18px;
}

.group {
  min-width: 0;
}

/* En pleine teinte d'emblée : les trois indicateurs portent tous une réponse
   dès l'arrivée, celle du rang par défaut, et il n'y a donc pas d'avancement à
   distinguer sur la ligne des noms. */
.group__name {
  margin: 0 0 6px;
  font-size: 11px;
  font-weight: 700;
  cursor: default;
}

.scale {
  display: flex;
  gap: 5px;
}

/* Le rang, et rien d'autre : cases de même taille, creuses au repos, pleines
   sur la réponse — les cinq se comparent d'un coup d'œil, l'énoncé s'obtient en
   pointant. Elles se partagent la largeur de leur colonne à parts égales
   plutôt que de garder une largeur fixe : la série tient toute la colonne, et
   la cible du clic grandit avec la fenêtre. */
.step {
  flex: 1 1 0;
  min-width: 0;
  height: 26px;
  border: 1px solid var(--color-neutral-600);
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  color: var(--color-neutral-700);
}

.step:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}

.step.is-active {
  border-color: var(--color-text);
  background: var(--color-text);
  color: #fff;
}

/* Quatre lignes réservées : sur un tiers de la largeur du panneau, c'est ce
   que prennent les énoncés les plus longs de la grille. La hauteur ne bouge
   donc pas selon ce qui est affiché, et les trois colonnes restent d'aplomb. */
.hint {
  min-height: 62px;
  margin: 9px 0 0;
  padding-top: 8px;
  border-top: 1px solid var(--color-divider);
  font-size: 11px;
  line-height: 1.4;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

/* Empilées, les trois séries gardent des cases cliquables : à trois colonnes,
   quinze cases sur la largeur d'un téléphone ne se visent plus. */
@media (max-width: 900px) {
  .groups {
    grid-template-columns: 1fr;
  }

  /* Sur toute la largeur, l'énoncé le plus long tient en deux lignes : la
     réserve de quatre laisserait un trou entre les séries empilées. */
  .hint {
    min-height: 32px;
  }
}
</style>

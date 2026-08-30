<template>
  <section class="panel picker" role="radiogroup" :aria-label="vm.question">
    <div class="panel-head picker__head">
      <h3 class="picker__title">{{ vm.question }}</h3>
      <button
        type="button"
        role="radio"
        class="button-reset out"
        :class="{ 'is-active': vm.outOfScope.active }"
        :aria-checked="vm.outOfScope.active"
        :aria-label="vm.outOfScope.label"
        @click="emit('select', vm.outOfScope.value)"
      >
        <span class="out__text">{{ vm.outOfScope.short }}</span>
        <span class="out__mark" aria-hidden="true" />
      </button>
    </div>

    <div class="picker__body">
      <button
        v-for="statement in vm.statements"
        :key="statement.value"
        type="button"
        role="radio"
        class="button-reset statement"
        :class="{ 'is-active': statement.active, 'is-reached': statement.reached }"
        :aria-checked="statement.active"
        @click="emit('select', statement.value)"
      >
        <span class="statement__text">{{ statement.text }}</span>
      </button>
    </div>
  </section>
</template>

<script setup>
// L'unité de réponse du questionnaire : cinq énoncés pour un domaine de
// capacité, un seul retenu — ou le domaine déclaré hors périmètre.
//
// Les cinq restent affichés en entier, les uns sous les autres, et rien ne se
// déplie : on demande laquelle des cinq situations décrit l'organisation, ce qui
// suppose de pouvoir les comparer. Une jauge à cliquer, ou des énoncés révélés
// un à un, feraient répondre « à quel niveau suis-je ? » — la question que le
// modèle refuse de poser, parce que le rang se déduit et ne se choisit pas.
//
// Les situations sont cumulatives : se reconnaître dans la troisième, c'est
// avoir passé les deux premières. La réponse retenue marque donc aussi celles
// qu'elle suppose dépassées, d'un liseré à gauche — ce qui n'en fait pas des
// réponses : une seule est cochée, une seule est calculée. Sans cette marque,
// les quatre énoncés non retenus se présentaient tous pareil, et retenir le
// troisième laissait croire que les deux premiers restaient en suspens.
//
// Aucun numéro n'est affiché. Le rang existe — il porte tout le calcul — mais
// l'écrire à côté de l'énoncé rouvre la lecture en échelle de conformité que la
// restitution s'efforce de fermer. L'ordre de la liste suffit à dire qu'il y a
// progression.
//
// Le hors périmètre est une réponse et non une abstention : il est donc dans le
// même groupe de boutons radio que les cinq énoncés — ce n'est pas un sixième
// niveau. Il a quitté la colonne de droite pour l'en-tête de l'encadré, où il
// répond à la question posée juste à côté de lui : la question demande laquelle
// des situations décrit l'organisation, et « aucune » est une des réponses
// possibles à cette question-là. La colonne qu'il occupait valait un tiers de la
// largeur pour un bouton de deux lignes, et rétrécissait d'autant les cinq
// énoncés, qui sont ce qu'on est venu lire. Ils tiennent désormais toute la
// largeur, l'un sous l'autre.
//
// Son carré est à droite de son libellé, à l'inverse des énoncés : dans
// l'en-tête, il ferme la ligne au lieu de couper entre le titre et lui.
//
// Un clic vaut une réponse : le composant n'a pas d'état, il émet la valeur et
// reçoit en retour le view-model qui dit laquelle est retenue. Recliquer la
// réponse retenue l'annule, mais c'est le parent qui en décide.
//
// Les deux notes de la colonne de droite ont disparu avec elle. Elles
// paraissaient une fois par domaine, soit vingt-huit fois sur la page : l'une
// disait qu'une réponse se reprend, l'autre ce que le hors périmètre fait au
// calcul — qui se dit à l'endroit où il décide, c'est-à-dire en restitution,
// sous « Ce que la mesure laisse de côté ».
defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['select'])
</script>

<style scoped>
/* La question et la sortie « aucune » partagent la barre de titre : elles sont
   la même question et sa réponse limite. */
.picker__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.picker__title {
  margin: 0;
  min-width: 0;
  font: inherit;
  letter-spacing: inherit;
}

/* Les cinq énoncés sur toute la largeur, l'un sous l'autre : c'est ce qu'on est
   venu lire, et ils se comparent d'autant mieux qu'ils ne sont pas repliés sur
   deux tiers de la page. */
.picker__body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px 16px;
}

/* Toute la ligne est la cible du clic. Le carré qui ouvrait chaque énoncé a été
   retiré : il avait la forme d'une case à cocher, c'est-à-dire d'un choix
   multiple, alors qu'on retient une situation et une seule. */
.statement {
  display: block;
  padding: 9px 11px;
  border: 1px solid var(--color-divider);
  background: var(--color-neutral-100);
  text-align: left;
}

.statement:hover {
  border-color: var(--color-text);
}

/* Les situations que la réponse suppose dépassées. Le liseré est posé en ombre
   intérieure et non en bordure : une bordure de trois pixels décalerait le texte
   de ces seules lignes, et les cinq énoncés ne s'aligneraient plus. */
.statement.is-reached {
  box-shadow: inset 3px 0 0 var(--color-neutral-500);
}

.statement.is-reached .statement__text {
  color: var(--color-neutral-800);
}

/* L'énoncé retenu se marque par son trait et sa graisse plutôt que par un aplat
   noir : les quatre autres doivent rester lisibles — c'est en les relisant qu'on
   vérifie qu'on a bien répondu. */
.statement.is-active {
  border: 2px solid var(--color-text);
  background: color-mix(in srgb, var(--color-text) 6%, transparent);
  padding: 8px 10px;
}

.statement__text {
  font-size: 12.5px;
  line-height: 1.45;
  text-wrap: pretty;
}

.statement.is-active .statement__text {
  font-weight: 700;
}

/* Trait discontinu, comme avant : la réponse est de même rang que les cinq
   énoncés, mais elle sort le domaine de la mesure au lieu d'y répondre. Le carré
   ferme la ligne, à droite du libellé — dans l'en-tête, à gauche il se serait
   glissé entre la question et sa réponse. */
.out {
  flex: none;
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 3px 7px;
  border: 1px dashed var(--color-neutral-500);
  text-align: left;
}

.out:hover {
  border-color: var(--color-text);
}

.out__mark {
  flex: none;
  width: 11px;
  height: 11px;
  border: 1px dashed var(--color-neutral-600);
}

.out.is-active {
  border: 2px dashed var(--color-text);
  padding: 2px 6px;
  background: var(--color-neutral-200);
}

.out.is-active .out__mark {
  border-style: solid;
  border-color: var(--color-text);
  background: var(--color-text);
}

/* Le libellé prend la casse et la graisse de la barre de titre : il y répond, il
   ne s'y ajoute pas. */
.out__text {
  font: inherit;
  letter-spacing: inherit;
  white-space: nowrap;
}
</style>

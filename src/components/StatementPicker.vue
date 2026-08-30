<template>
  <section class="panel picker">
    <h3 class="panel-head picker__title">{{ vm.question }}</h3>

    <div class="picker__body">
      <div class="scale" role="radiogroup" :aria-label="vm.question">
        <button
          v-for="statement in vm.statements"
          :key="statement.value"
          type="button"
          role="radio"
          class="button-reset statement"
          :class="{ 'is-active': statement.active }"
          :aria-checked="statement.active"
          @click="emit('select', statement.value)"
        >
          <span class="statement__mark" aria-hidden="true" />
          <span class="statement__text">{{ statement.text }}</span>
        </button>
      </div>

      <div class="aside">
        <button
          type="button"
          role="radio"
          class="button-reset out"
          :class="{ 'is-active': vm.outOfScope.active }"
          :aria-checked="vm.outOfScope.active"
          @click="emit('select', vm.outOfScope.value)"
        >
          <span class="out__mark" aria-hidden="true" />
          <span class="out__text">{{ vm.outOfScope.label }}</span>
        </button>
        <p class="aside__note">{{ vm.outOfScope.note }}</p>
        <p class="aside__hint">{{ vm.hint }}</p>
      </div>
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
// Aucun numéro n'est affiché. Le rang existe — il porte tout le calcul — mais
// l'écrire à côté de l'énoncé rouvre la lecture en échelle de conformité que la
// restitution s'efforce de fermer. L'ordre de la liste suffit à dire qu'il y a
// progression.
//
// Le hors périmètre est une réponse et non une abstention : il est donc dans le
// même groupe de boutons radio que les cinq énoncés, à côté et non en dessous
// d'eux — ce n'est pas un sixième niveau.
//
// Un clic vaut une réponse : le composant n'a pas d'état, il émet la valeur et
// reçoit en retour le view-model qui dit laquelle est retenue. Recliquer la
// réponse retenue l'annule, mais c'est le parent qui en décide.
//
// Les deux notes de la colonne de droite paraissent une fois par domaine, soit
// vingt-huit fois sur la page : tout ce qu'elles portent de superflu se paie
// d'autant. Elles ont été ramenées à ce qu'aucune forme ne montre — qu'une
// réponse se reprend, et ce que le hors périmètre fait au calcul.
defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['select'])
</script>

<style scoped>
.picker__title {
  margin: 0;
}

/* Les énoncés d'abord, la sortie hors périmètre à côté : la colonne de droite
   est deux fois plus étroite, pour qu'on voie du premier coup d'œil que la
   réponse ordinaire est à gauche. */
.picker__body {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 18px;
  padding: 14px 16px 16px;
}

.scale {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

/* Toute la ligne est la cible du clic : l'énoncé et son carré ne se cliquent
   pas séparément. Le carré reprend celui des critères d'adoption d'avant —
   vide, il attend ; plein, il répond. */
.statement {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 9px 11px;
  border: 1px solid var(--color-divider);
  background: var(--color-neutral-100);
  text-align: left;
}

.statement:hover {
  border-color: var(--color-text);
}

.statement__mark {
  flex: none;
  width: 11px;
  height: 11px;
  margin-top: 3px;
  border: 1px solid var(--color-neutral-600);
}

.statement:hover .statement__mark {
  border-color: var(--color-text);
}

/* L'énoncé retenu se marque par son trait et sa graisse plutôt que par un aplat
   noir : les quatre autres doivent rester lisibles — c'est en les relisant qu'on
   vérifie qu'on a bien répondu. */
.statement.is-active {
  border: 2px solid var(--color-text);
  background: color-mix(in srgb, var(--color-text) 6%, transparent);
  padding: 8px 10px;
}

.statement.is-active .statement__mark {
  border-color: var(--color-text);
  background: var(--color-text);
}

.statement__text {
  font-size: 12.5px;
  line-height: 1.45;
  text-wrap: pretty;
}

.statement.is-active .statement__text {
  font-weight: 700;
}

.aside {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding-left: 18px;
  border-left: 1px solid var(--color-divider);
}

/* Même facture que les énoncés, trait discontinu : la réponse est de même rang
   qu'eux, mais elle sort le domaine de la mesure au lieu d'y répondre. */
.out {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 9px 11px;
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
  margin-top: 3px;
  border: 1px dashed var(--color-neutral-600);
}

.out.is-active {
  border: 2px dashed var(--color-text);
  padding: 8px 10px;
  background: var(--color-neutral-200);
}

.out.is-active .out__mark {
  border-style: solid;
  border-color: var(--color-text);
  background: var(--color-text);
}

.out__text {
  font-size: 12px;
  line-height: 1.4;
}

.out.is-active .out__text {
  font-weight: 700;
}

.aside__note,
.aside__hint {
  margin: 10px 0 0;
  font-size: 11px;
  line-height: 1.45;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

.aside__hint {
  margin-top: auto;
  padding-top: 12px;
}

/* Empilé, le hors périmètre passe sous les énoncés : la colonne étroite ne tient
   plus, et la sortie garde son trait discontinu pour se distinguer d'un sixième
   énoncé. */
@media (max-width: 900px) {
  .picker__body {
    grid-template-columns: 1fr;
  }

  .aside {
    padding-left: 0;
    padding-top: 14px;
    border-left: 0;
    border-top: 1px solid var(--color-divider);
  }

  .aside__hint {
    margin-top: 10px;
    padding-top: 0;
  }
}
</style>

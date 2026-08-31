<template>
  <section class="panel picker" :style="vm.color ? { '--picker-color': vm.color } : null">
    <div class="panel-head picker__head">
      <h3 class="picker__title">{{ vm.question }}</h3>
      <button
        type="button"
        role="switch"
        class="button-reset out"
        :class="{ 'is-active': vm.outOfScope.active }"
        :aria-checked="vm.outOfScope.active"
        :aria-label="vm.outOfScope.label"
        @click="emit('select', vm.outOfScope.value)"
      >
        <span class="out__text">{{ vm.outOfScope.short }}</span>
        <span class="out__track" aria-hidden="true"><span class="out__knob" /></span>
      </button>
    </div>

    <div class="picker__body" role="radiogroup" :aria-label="vm.question">
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
// Le hors périmètre est un interrupteur, et non plus un sixième bouton radio du
// même groupe que les cinq énoncés. Le changement est de nature et pas
// seulement de forme : sous le libellé « aucune », il répondait à la question
// posée à côté de lui — laquelle des situations décrit l'organisation — et se
// tenait donc dans son groupe. Il ne répond plus, il retire le domaine de la
// mesure, ce qui est un état du domaine et non une réponse parmi six. Un
// interrupteur dit exactement cela : une chose qu'on met en marche ou qu'on
// laisse éteinte, indépendamment de ce qu'on répond en dessous.
//
// D'où le déplacement de `role="radiogroup"` : il coiffait tout l'encadré, ce
// qui plaçait l'interrupteur dans un groupe de boutons radio — un assemblage
// qu'aucune technologie d'assistance ne sait lire. Il coiffe désormais le seul
// corps de l'encadré, où ne vivent que les cinq énoncés.
//
// L'interrupteur ferme la ligne d'en-tête, à droite de son libellé : à gauche,
// il se serait glissé entre la question et sa réponse.
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

/* Les situations que la réponse suppose dépassées, et la réponse elle-même,
   portent le liseré de la dimension — la même couleur que le bandeau de la
   carte, la barre des domaines et les pastilles du cadre de référence, où elle
   ouvre déjà chaque domaine par la gauche. Le liseré était gris : il disait
   qu'un palier était franchi sans dire de quoi, et la seule couleur de la carte
   vivait dans un bandeau de trois pixels tout en haut. Ce que l'on colore ici,
   c'est la colonne des rangs atteints, qui monte du premier énoncé jusqu'à la
   réponse retenue.

   Le liseré est posé en ombre intérieure et non en bordure : une bordure de
   quatre pixels décalerait le texte de ces seules lignes, et les cinq énoncés
   ne s'aligneraient plus. Le gris reste en repli, pour un domaine dont la
   dimension n'aurait pas de couleur. */
.statement.is-reached {
  box-shadow: inset 4px 0 0 var(--picker-color, var(--color-neutral-500));
}

.statement.is-reached .statement__text {
  color: var(--color-neutral-800);
}

/* L'énoncé retenu se marque par son trait et sa graisse plutôt que par un aplat
   noir : les quatre autres doivent rester lisibles — c'est en les relisant qu'on
   vérifie qu'on a bien répondu. Son bord gauche reprend la couleur de la
   dimension, comme les rangs qu'il suppose franchis : la colonne colorée
   s'arrête sur lui, ce qui en fait le haut de la pile plutôt qu'une ligne à
   part. */
.statement.is-active {
  border: 2px solid var(--color-text);
  background: color-mix(in srgb, var(--color-text) 6%, transparent);
  padding: 8px 10px;
  box-shadow: inset 4px 0 0 var(--picker-color, var(--color-text));
}

.statement__text {
  font-size: 12.5px;
  line-height: 1.45;
  text-wrap: pretty;
}

.statement.is-active .statement__text {
  font-weight: 700;
}

/* L'interrupteur n'a plus de cadre : un contrôle encadré dans une barre de
   titre elle-même encadrée faisait deux traits pour une seule chose, et le
   trait discontinu qu'il portait servait à le distinguer des cinq énoncés — ce
   dont sa forme se charge désormais. Restent le libellé et la bascule. */
.out {
  flex: none;
  display: flex;
  gap: 8px;
  align-items: center;
  text-align: left;
}

/* La glissière et son bouton. Deux pixels de bord, comme le reste du dépôt, et
   des angles vifs : une bascule arrondie serait le seul rayon de toute
   l'interface. */
.out__track {
  flex: none;
  position: relative;
  width: 30px;
  height: 16px;
  border: 2px solid var(--color-neutral-600);
  background: var(--color-neutral-100);
  transition: background 0.12s linear, border-color 0.12s linear;
}

.out__knob {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 10px;
  height: 10px;
  background: var(--color-neutral-600);
  transition: transform 0.12s ease-out, background 0.12s linear;
}

.out:hover .out__track {
  border-color: var(--color-text);
}

.out:hover .out__knob {
  background: var(--color-text);
}

/* En marche : le bouton passe à droite et la glissière se remplit. Le domaine
   est alors hors mesure, et c'est le seul état de la carte qui se lit sans
   avoir à comparer cinq énoncés. */
.out.is-active .out__track {
  border-color: var(--color-text);
  background: var(--color-text);
}

.out.is-active .out__knob {
  transform: translateX(14px);
  background: var(--color-neutral-100);
}

/* Le libellé garde la casse et l'interlettrage de la barre de titre — il
   appartient à cette ligne — mais en abandonne la graisse : la barre annonce la
   question, l'interrupteur n'est qu'une sortie offerte à côté d'elle, et deux
   gras dans la même ligne les mettaient sur le même plan. */
.out__text {
  font: inherit;
  font-weight: 500;
  letter-spacing: inherit;
  white-space: nowrap;
}

/* Rien ne bouge pour qui refuse les animations : l'état reste lisible à la
   position du bouton et au remplissage de la glissière. */
@media (prefers-reduced-motion: reduce) {
  .out__track,
  .out__knob {
    transition: none;
  }
}
</style>

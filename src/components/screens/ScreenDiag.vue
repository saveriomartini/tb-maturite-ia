<template>
  <AppScreen spacing="tight">
    <div class="toolbar">
      <nav class="strip" aria-label="Domaines de capacité du diagnostic">
        <div
          v-for="group in vm.blockGroups"
          :key="group.key"
          class="strip__group"
          :style="{ flexGrow: group.areas.length }"
        >
          <p class="strip__block" :title="group.name">{{ group.name }}</p>
          <div class="strip__areas">
            <button
              v-for="area in group.areas"
              :key="area.id"
              type="button"
              class="button-reset strip__area"
              :class="{
                'is-active': area.active,
                'is-answered': area.answered,
                'is-out-of-scope': area.outOfScope
              }"
              :style="area.color && area.answered ? { background: area.color } : null"
              :title="`${area.name} — ${area.state}`"
              :aria-label="`Domaine ${area.number} — ${area.name}, ${area.state}`"
              @click="emit('open-area', area.id)"
            >
              <span class="strip__number">{{ area.number }}</span>
              <span class="strip__mark" aria-hidden="true">{{ area.mark }}</span>
            </button>
          </div>
        </div>
      </nav>
      <p class="toolbar__progress">{{ vm.progress }}</p>
    </div>

    <header class="head">
      <div class="head__band" :style="vm.area.color ? { background: vm.area.color } : null" />
      <p class="head__path">
        <span>{{ vm.area.block }} · {{ vm.area.dim }}</span>
        <span class="head__rank">attendu au rang {{ vm.area.required }}</span>
      </p>
      <h1 class="head__area heading">{{ vm.area.name }}</h1>
      <p class="head__desc">{{ vm.area.desc }}</p>
    </header>

    <StatementPicker :vm="vm.picker" @select="emit('answer', vm.area.id, $event)" />

    <aside v-if="vm.area.exampleArtifacts.length" class="artifacts">
      <p class="artifacts__label">
        Exemples d'artefacts
        <button
          type="button"
          class="button-reset artifacts__toggle"
          :aria-expanded="artifactsOpen"
          :aria-controls="artifactsId"
          :aria-label="`${artifactsOpen ? 'Masquer' : 'Afficher'} les exemples d'artefacts`"
          @click="artifactsOpen = !artifactsOpen"
        >
          {{ artifactsOpen ? '−' : '+' }}
        </button>
      </p>
      <ul v-show="artifactsOpen" :id="artifactsId" class="artifacts__list">
        <li v-for="artifact in vm.area.exampleArtifacts" :key="artifact">{{ artifact }}</li>
      </ul>
    </aside>

    <div class="work__nav">
      <button type="button" class="btn btn-ghost" @click="emit('back')">Précédent</button>
      <button type="button" class="btn btn-primary work__button" @click="emit('next')">
        {{ vm.nextLabel }}
      </button>
    </div>
  </AppScreen>
</template>

<script setup>
// Le questionnaire, un domaine de capacité par écran.
//
// L'ordre de lecture suit l'ordre de la décision : où l'on en est (la barre), de
// quel domaine il s'agit (l'en-tête), la réponse (le sélecteur), et seulement
// ensuite le rappel. Celui-ci est passé *sous* la réponse : tant qu'il était en
// colonne à gauche, il se lisait comme la question, alors qu'il n'est qu'un
// appui.
//
// Ce que le rappel dit, et il n'y a plus rien d'autre : le bloc, la dimension,
// le nom, la description, le rang auquel le modèle attend le domaine, et des
// exemples d'artefacts. Les critères d'adoption et les pratiques en sont sortis.
// Ils restent dans le modèle, qui reste le report littéral de la source, mais
// affichés à côté des énoncés ils rouvraient la lecture en liste de conditions
// et donnaient à croire qu'on répondait sur eux. L'unité de réponse est
// l'énoncé, et lui seul.
//
// L'écran n'a donc plus qu'une colonne de contenu sous le sélecteur : la grille
// à deux colonnes du rappel n'avait plus de second occupant.
//
// Il n'y a plus de domaine hors cadrage à consulter : les 28 sont dans le
// parcours, et ce qu'une organisation retire de la mesure, c'est elle qui le
// déclare — par la réponse « hors périmètre », qui vit dans le sélecteur.
//
// Les exemples d'artefacts se déplient : au repos, le rappel ne dit que ce
// qu'est le domaine. L'état est local et suit d'un domaine à l'autre — qui a
// demandé les artefacts une fois les veut en général partout.
import { ref, useId } from 'vue'
import AppScreen from '../AppScreen.vue'
import StatementPicker from '../StatementPicker.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['answer', 'open-area', 'back', 'next'])

const artifactsOpen = ref(false)
const artifactsId = `artifacts-${useId()}`
</script>

<style scoped>
/* La barre tient toute la largeur du plan de travail qu'elle coiffe : le
   repère de parcours se lit en regard du panneau, pas en médaillon. */
.toolbar {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.toolbar__progress {
  margin: 0 0 0 auto;
  font-size: 11px;
  color: var(--color-neutral-700);
}

/* Deux niveaux : le bloc coiffe, sans être cliquable ; seuls les domaines
   numérotés en dessous portent la navigation. Chaque bloc pèse le nombre de
   domaines qu'il présente, si bien que toutes les cases gardent la même largeur
   d'un bout à l'autre de la barre. */
.strip {
  display: flex;
  gap: 6px;
  align-items: stretch;
}

.strip__group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-basis: 0;
  min-width: 0;
}

.strip__block {
  margin: 0;
  padding: 0 1px 3px;
  border-bottom: 1px solid var(--color-divider);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-neutral-700);
}

.strip__areas {
  display: flex;
  gap: 3px;
}

/* Chaque case dit deux choses : quel domaine — le numéro, qui ne bouge jamais —
   et où il en est — la marque, sur une seconde ligne. Le rang retenu s'y écrit
   en clair, l'absence de réponse par un point, le hors périmètre par une croix.
   La couleur de dimension ne s'allume qu'une fois répondu : de loin, la barre
   dit l'avancement avant de dire le contenu. */
.strip__area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  flex: 1 1 0;
  min-width: 0;
  padding: 3px 2px;
  border: 1px solid var(--color-divider);
  color: var(--color-text);
  line-height: 1;
  text-align: center;
  opacity: 0.78;
}

.strip__number {
  font-size: 10px;
  font-weight: 600;
}

.strip__mark {
  font-size: 8px;
  font-weight: 700;
  color: var(--color-neutral-700);
}

.strip__area.is-answered {
  opacity: 1;
}

.strip__area.is-answered .strip__mark {
  color: var(--color-text);
}

.strip__area.is-active {
  border: 2px solid var(--color-text);
  font-weight: 800;
  opacity: 1;
}

/* Hors périmètre : la case garde sa place et son numéro — le modèle ne rétrécit
   pas — mais perd sa couleur de dimension. C'est une réponse, pas un manque :
   elle reste pleinement lisible. */
.strip__area.is-out-of-scope {
  background: var(--color-neutral-200);
  border-color: var(--color-neutral-400);
  color: var(--color-neutral-700);
  opacity: 1;
}

.strip__area.is-out-of-scope:hover {
  background: var(--color-neutral-300);
}

/* L'en-tête du domaine : la bande de dimension, le chemin, le rang attendu, le
   nom, la description. C'est tout ce qu'il faut avoir lu avant de choisir un
   énoncé. */
.head {
  margin-top: 20px;
}

.head__band {
  height: 8px;
  margin-bottom: 12px;
}

.head__path {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  justify-content: space-between;
  margin: 0;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-neutral-700);
}

/* Le rang attendu tient le bout de la ligne de chemin : il appartient au même
   registre — ce que le modèle dit du domaine avant qu'on réponde — et explique
   pourquoi ce domaine pèse sur tel palier et pas sur tel autre. En bas de casse,
   parce que ce n'est pas un intitulé mais une précision. */
.head__rank {
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: none;
}

.head__area {
  margin: 5px 0 0;
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: normal;
}

.head__desc {
  max-width: 90ch;
  margin: 8px 0 18px;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

/* Le rappel vient après la réponse, sur toute la largeur : il n'a plus de
   voisin à qui disputer la colonne. Un filet le sépare du sélecteur — c'est un
   appui, pas une suite de la question. */
.artifacts {
  min-width: 0;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--color-divider);
}

.artifacts__label {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
}

.artifacts__toggle {
  margin-left: 5px;
  font-size: 13px;
  line-height: 1;
  font-weight: 400;
  color: var(--color-neutral-600);
}

.artifacts__toggle:hover {
  color: var(--color-text);
}

/* Plus d'ascenseur : la liste ne s'affiche que sur demande, elle se donne alors
   en entier (14 artefacts au plus dans le modèle) plutôt que par la fenêtre.
   Sur toute la largeur, elle se met en colonnes plutôt que de tirer une ligne de
   dix mots sur quatre-vingts caractères de vide. */
.artifacts__list {
  margin: 8px 0 0;
  padding: 0 0 0 16px;
  columns: 3;
  column-gap: 32px;
  font-size: 11px;
  line-height: 1.5;
  color: var(--color-neutral-800);
}

.artifacts__list li {
  break-inside: avoid;
}

.artifacts__list li + li {
  margin-top: 4px;
}

.work__nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 2px solid var(--color-text);
}

.work__button {
  min-width: 150px;
}

@media (max-width: 1200px) {
  .artifacts__list {
    columns: 2;
  }
}

@media (max-width: 900px) {
  /* la barre reste d'un seul tenant : on resserre les gouttières plutôt que
     de la laisser passer à la ligne, ce qui casserait la numérotation */
  .strip {
    gap: 4px;
  }

  .strip__areas {
    gap: 2px;
  }

  .strip__area {
    padding: 3px 1px;
  }

  .strip__number {
    font-size: 9px;
  }

  .artifacts__list {
    columns: 1;
  }

  .work__nav {
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>

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
              :class="{ 'is-active': area.active, 'is-off-scope': !area.inScope }"
              :style="area.color ? { background: area.color } : null"
              :title="area.inScope ? area.name : `${area.name} — hors cadrage`"
              :aria-label="`Domaine ${area.number} — ${area.name}${area.inScope ? '' : ', hors cadrage'}`"
              @click="emit('open-area', area.id)"
            >
              {{ area.number }}
            </button>
          </div>
        </div>
      </nav>
      <p class="toolbar__progress">{{ vm.progress }}</p>
    </div>

    <div class="workspace">
      <!-- Hors cadrage, la colonne de rappel garde tout son contenu — l'area
           existe, elle se lit — mais s'éteint pour dire qu'elle ne se remplit pas. -->
      <aside class="context" :class="{ 'context--off-scope': vm.area.offScope }">
        <div class="context__band" :style="vm.area.color ? { background: vm.area.color } : null" />
        <h2 class="context__area heading">{{ vm.area.name }}</h2>
        <p class="context__desc">{{ vm.area.desc }}</p>

        <div v-if="vm.area.exampleArtifacts.length" class="context__artifacts">
          <p class="context__label">
            Exemples d'artefacts
            <button
              type="button"
              class="button-reset context__toggle"
              :aria-expanded="artifactsOpen"
              :aria-controls="artifactsId"
              :aria-label="`${artifactsOpen ? 'Masquer' : 'Afficher'} les exemples d'artefacts`"
              @click="artifactsOpen = !artifactsOpen"
            >
              {{ artifactsOpen ? '−' : '+' }}
            </button>
          </p>
          <ul v-show="artifactsOpen" :id="artifactsId" class="context__artifacts-list">
            <li v-for="artifact in vm.area.exampleArtifacts" :key="artifact">{{ artifact }}</li>
          </ul>
        </div>
      </aside>

      <div v-if="vm.offScope" class="work">
        <div class="empty">
          <p class="empty__message">{{ vm.offScope.message }}</p>
          <p class="empty__note">{{ vm.offScope.note }}</p>
        </div>

        <div class="work__nav work__nav--single">
          <button type="button" class="btn btn-secondary" @click="emit('close-off-scope')">
            {{ vm.offScope.backLabel }}
          </button>
        </div>
      </div>

      <div v-else class="work">
        <GoalChecklist :goals="vm.goals" @toggle="emit('toggle-goal', $event)" />

        <MaturityIndicatorsForm
          v-if="vm.indicators"
          :indicators="vm.indicators"
          @select="(indicatorId, value) => emit('select-indicator', vm.indicatorAreaId, indicatorId, value)"
        />

        <div class="work__nav">
          <button type="button" class="btn btn-ghost" @click="emit('back')">Précédent</button>
          <div class="work__next">
            <p v-if="vm.area.hint" class="work__hint">{{ vm.area.hint }}</p>
            <button type="button" class="btn btn-primary work__button" @click="emit('next')">
              {{ vm.nextLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppScreen>
</template>

<script setup>
// Les exemples d'artefacts se déplient comme les pratiques d'un objectif ou
// l'aide d'un attribut de contexte : au repos, la colonne ne dit que ce qu'est
// l'area. L'état est local et suit d'une area à l'autre — qui a demandé les
// artefacts une fois les veut en général partout.
//
// Les indicateurs de maturité suivent les objectifs de chaque area : on valide
// d'abord ce qui est en place, on qualifie ensuite la façon dont l'area est
// tenue. Le bloc s'absente hors cadrage, où il n'y a rien à remplir — c'est le
// view-model qui le dit, l'écran ne fait que suivre.
import { ref, useId } from 'vue'
import AppScreen from '../AppScreen.vue'
import GoalChecklist from '../GoalChecklist.vue'
import MaturityIndicatorsForm from '../MaturityIndicatorsForm.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits([
  'toggle-goal', 'select-indicator', 'open-area', 'close-off-scope', 'back', 'next'
])

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

/* Deux niveaux : le bloc coiffe, sans être cliquable ; seules les areas
   numérotées en dessous portent la navigation. Chaque bloc pèse le nombre
   d'areas qu'il présente, si bien que toutes les cases gardent la même
   largeur d'un bout à l'autre de la barre. */
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

.strip__area {
  flex: 1 1 0;
  min-width: 0;
  padding: 4px 2px;
  border: 1px solid var(--color-divider);
  color: var(--color-text);
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  opacity: 0.78;
}

.strip__area.is-active {
  border: 2px solid var(--color-text);
  font-weight: 800;
  opacity: 1;
}

/* Hors cadrage : la case reste à sa place et garde son numéro — le modèle ne
   rétrécit pas — mais perd sa couleur de dimension. Elle reste cliquable, pour
   qu'on puisse aller voir ce qui a été écarté ; c'est l'écran qui l'explique,
   pas un curseur barré. */
.strip__area.is-off-scope {
  background: var(--color-neutral-200);
  border-color: var(--color-neutral-400);
  color: var(--color-neutral-600);
  opacity: 1;
}

.strip__area.is-off-scope:hover {
  background: var(--color-neutral-300);
}

.strip__area.is-off-scope.is-active {
  border: 2px solid var(--color-neutral-600);
  color: var(--color-neutral-800);
}

/* Le plan de travail n'est plus une boîte : la colonne de rappel se lit à nu à
   gauche, et les blocs de saisie s'encadrent eux-mêmes à droite. Un cadre de
   plus autour d'eux ne délimiterait rien qu'ils ne délimitent déjà. */
.workspace {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 22px;
  margin-top: 18px;
}

.context {
  min-width: 0;
}

.context__band {
  height: 8px;
  margin: 0 0 14px;
}

/* La bande éteinte : même géométrie, couleur neutre. La colonne pâlit d'un cran
   sans devenir illisible — on doit pouvoir lire l'area qu'on est venu voir.
   Elle reprend alors un fond, donc une gouttière : hors cadrage, la colonne
   redevient un bloc, ce qui est précisément ce qu'on veut dire. */
.context--off-scope {
  padding: 14px;
  background: var(--color-neutral-200);
  color: var(--color-neutral-700);
}

.context--off-scope .context__band {
  margin: -14px -14px 14px;
}

.context--off-scope .context__band {
  background: var(--color-neutral-400);
}

.context--off-scope .context__area,
.context--off-scope .context__desc,
.context--off-scope .context__label,
.context--off-scope .context__artifacts-list {
  color: var(--color-neutral-700);
}

.context__label {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
}

/* Même affordance que les attributs de contexte et les objectifs : discrète,
   elle suit le libellé sans lui disputer la place. */
.context__toggle {
  margin-left: 5px;
  font-size: 13px;
  line-height: 1;
  font-weight: 400;
  color: var(--color-neutral-600);
}

.context__toggle:hover {
  color: var(--color-text);
}

.context__area {
  margin: 0;
  font-size: 19px;
  line-height: 1.2;
  letter-spacing: normal;
}

.context__desc {
  margin: 10px 0 0;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--color-neutral-800);
}

/* le filet sépare ce que l'area *est* de ce qu'elle donne à voir */
.context__artifacts {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--color-divider);
}

/* Plus d'ascenseur : la liste ne s'affiche que sur demande, elle se donne alors
   en entier (14 artefacts au plus dans le modèle) plutôt que par la fenêtre. */
.context__artifacts-list {
  margin: 8px 0 0;
  padding: 0 0 0 16px;
  font-size: 11px;
  line-height: 1.5;
  color: var(--color-neutral-800);
}

.context__artifacts-list li + li {
  margin-top: 4px;
}

/* Les deux panneaux de saisie et le pied de navigation, empilés à intervalle
   constant : c'est la gouttière qui les sépare, plus un trait. */
.work {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

/* Le cadre du questionnaire, vide : le trait discontinu dit qu'il n'y a rien à
   remplir ici, là où le trait plein du reste de l'outil annonce une saisie. La
   hauteur minimale évite que le panneau se rétracte au clic sur une case grise. */
.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 260px;
  padding: 24px;
  border: 2px dashed var(--color-neutral-400);
  background: var(--color-neutral-200);
  text-align: center;
}

.empty__message {
  max-width: 46ch;
  margin: 0 auto;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--color-neutral-800);
}

.empty__note {
  max-width: 52ch;
  margin: 12px auto 0;
  font-size: 11.5px;
  line-height: 1.5;
  color: var(--color-neutral-700);
}

.work__nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 2px solid var(--color-text);
}

/* Une seule issue depuis l'area hors cadrage : revenir. Pas de « précédent » ni
   de « suivant » — cette area n'a pas de voisine, elle n'est pas dans le fil. */
.work__nav--single {
  justify-content: flex-end;
}

.work__next {
  display: flex;
  align-items: center;
  gap: 10px;
}

.work__hint {
  margin: 0;
  font-size: 11px;
  color: var(--color-neutral-700);
}

.work__button {
  min-width: 150px;
}

@media (max-width: 1200px) {
  .workspace {
    grid-template-columns: 210px 1fr;
    gap: 16px;
  }
}

/* Empilé, le rappel de contexte (bloc, dimension, area, score) coiffe le
   questionnaire au lieu de le border. */
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
    padding: 4px 1px;
    font-size: 9px;
  }

  .workspace {
    grid-template-columns: 1fr;
  }

  /* Empilé, le rappel n'a plus de voisin à sa droite pour marquer la limite :
     un filet la reprend sous lui, avant le premier panneau de saisie. */
  .context {
    padding-bottom: 14px;
    border-bottom: 1px solid var(--color-divider);
  }

  .work__nav {
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>

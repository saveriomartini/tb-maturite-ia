<template>
  <div class="goals">
    <section
      v-for="goal in goals"
      :key="goal.key"
      class="goal"
      :class="{ 'is-done': goal.done }"
    >
      <div class="goal__head">
        <button
          type="button"
          class="button-reset goal__check"
          :aria-pressed="goal.done"
          @click="emit('toggle', goal.keys)"
        >
          <span class="goal__mark" aria-hidden="true" />
          <span class="goal__text">{{ goal.text }}</span>
        </button>
        <button
          type="button"
          class="button-reset goal__toggle"
          :aria-expanded="isOpen(goal)"
          :aria-controls="detailId(goal)"
          :aria-label="toggleLabel(goal)"
          @click="fold(goal)"
        >
          {{ isOpen(goal) ? '−' : '+' }}
        </button>
      </div>

      <ul v-show="isOpen(goal)" :id="detailId(goal)" class="practices">
        <li v-for="practice in goal.practices" :key="practice" class="practice">
          <span class="practice__mark" aria-hidden="true" />
          <span>{{ practice }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
// Objectifs de l'area courante. L'objectif est l'unité de réponse : un
// interrupteur oui/non qui vaut pour toutes ses pratiques à la fois. Celles-ci
// ne se cochent plus — elles disent ce que l'objectif recouvre, et se replient
// comme l'aide d'un attribut de contexte pour que l'écran ne se lise pas comme
// un mur de texte.
//
// Le dépliage est un état local : il ne décrit pas l'évaluation et n'a pas à
// survivre à la session. Il n'appartient qu'à l'utilisateur — cocher un
// objectif n'ouvre ni ne referme son détail, et le pli tient d'une area à
// l'autre tant que l'écran reste monté.
import { ref, useId } from 'vue'

defineProps({
  goals: { type: Array, required: true }
})

const emit = defineEmits(['toggle'])

const open = ref({})
const uid = useId()

function isOpen(goal) {
  return Boolean(open.value[goal.key])
}

function fold(goal) {
  open.value[goal.key] = !isOpen(goal)
}

function detailId(goal) {
  return `practices-${goal.key}-${uid}`
}

function toggleLabel(goal) {
  return `${isOpen(goal) ? 'Masquer' : 'Afficher'} les pratiques — ${goal.text}`
}
</script>

<style scoped>
.goals {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* la marge s'allume à la validation : de loin, la colonne des traits dit
   combien d'objectifs sont acquis, sans qu'on ait à lire une ligne */
.goal {
  padding: 2px 0 14px 14px;
  border-left: 3px solid var(--color-neutral-300);
  border-bottom: 1px solid var(--color-divider);
}

.goal.is-done {
  border-left-color: var(--color-text);
}

.goal__head {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

/* toute la ligne de l'objectif est la case à cocher : la cible est large,
   l'énoncé et son carré ne se cliquent pas séparément */
.goal__check {
  display: flex;
  flex: 1;
  gap: 10px;
  align-items: flex-start;
  min-width: 0;
  padding: 4px 0;
  text-align: left;
}

/* même carré que la colonne de marquage de la restitution 2 :
   vide = objectif à valider, plein = objectif validé */
.goal__mark {
  flex: none;
  width: 11px;
  height: 11px;
  margin-top: 3px;
  border: 1px solid var(--color-neutral-600);
}

.goal__check:hover .goal__mark {
  border-color: var(--color-text);
}

.is-done .goal__mark {
  border-color: var(--color-text);
  background: var(--color-text);
}

/* Pas de mesure de confort ici : l'énoncé prend toute la largeur du panneau.
   Débarrassé de sa formule d'introduction, il tient en deux lignes plutôt
   qu'en quatre — c'est la hauteur, pas la longueur de ligne, qui pesait. */
.goal__text {
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.45;
  text-wrap: pretty;
}

.is-done .goal__text {
  font-weight: 700;
}

/* Affordance discrète, empruntée aux attributs de contexte : le pli ne doit pas
   concurrencer l'énoncé qu'il suit. */
.goal__toggle {
  flex: none;
  margin-top: 2px;
  font-size: 13px;
  line-height: 1;
  color: var(--color-neutral-600);
}

.goal__toggle:hover {
  color: var(--color-text);
}

/* Le détail de l'objectif : ce qu'il demande, en texte secondaire. Rien n'y est
   cliquable — la réponse s'est déjà donnée une ligne plus haut. */
.practices {
  margin: 8px 0 0 21px;
  padding: 0 0 0 10px;
  list-style: none;
  border-left: 2px solid var(--color-divider);
}

.practice {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  font-size: 11px;
  line-height: 1.5;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

.practice + .practice {
  margin-top: 5px;
}

/* Le même carré que l'objectif, en plus petit : il ne se clique pas, il
   constate. Cocher l'objectif remplit les siens d'un coup — c'est là que se
   voit ce que la validation en bloc recouvre. */
.practice__mark {
  flex: none;
  width: 8px;
  height: 8px;
  margin-top: 4px;
  border: 1px solid var(--color-neutral-600);
}

.is-done .practice {
  color: var(--color-neutral-800);
}

.is-done .practice__mark {
  border-color: var(--color-text);
  background: var(--color-text);
}
</style>

<template>
  <AppScreen class="demo">
    <header class="page-head">
      <p class="eyebrow">Démonstration</p>
      <h1 class="page-head__title heading">Trois organisations, trois résultats</h1>
      <p class="page-head__lead">
        Chaque exemple écrit une session complète — attributs de contexte, portée visée,
        énoncés retenus — et ouvre directement la restitution. Le parcours reste entier
        derrière : la page de l’outil se relit et se modifie, et l’en-tête réinitialise
        à tout moment.
      </p>
    </header>

    <div class="cases">
      <section v-for="scenario in vm.scenarios" :key="scenario.id" class="case panel">
        <h2 class="case__name heading">{{ scenario.name }}</h2>
        <p class="case__profile">{{ scenario.profile }}</p>
        <p class="case__story">{{ scenario.story }}</p>

        <p class="case__label eyebrow">Ce que l’exemple montre</p>
        <p class="case__shows">{{ scenario.shows }}</p>

        <button
          type="button"
          class="btn btn-primary btn-arrow case__button"
          @click="request(scenario.id)"
        >
          {{ vm.action }}
        </button>
      </section>
    </div>

    <AppScreenNav back-label="Retour à l'accueil" @back="emit('back')">
      <template #actions>
        <button type="button" class="btn btn-secondary demo__start" @click="emit('start')">
          Démarrer mon diagnostic
        </button>
      </template>
    </AppScreenNav>

    <AppDialog
      :open="pending !== null"
      :eyebrow="vm.dialog.eyebrow"
      :text="vm.dialog.text"
      :actions="vm.dialog.actions"
      @action="answer"
      @close="pending = null"
    />
  </AppScreen>
</template>

<script setup>
// Démonstration : des PME fictives dont on charge la session pour voir ce que
// l'outil restitue, sans rien saisir.
//
// Il y en a trois et non une : ce que la restitution dit de l'écart au profil
// visé change de nature selon l'endroit où cet écart tombe sur l'échelle de
// transformation — sous la ligne évolutif / révolutionnaire, la franchissant, ou
// déjà refermé. Un seul exemple n'en montrerait qu'un tiers, et laisserait
// croire que la page tient toujours le même discours.
//
// Ce qu'un exemple produit n'est pas écrit ici : la carte annonce ce que le cas
// donne à voir, jamais son résultat. Le profil atteint est calculé comme celui
// d'une vraie session, et l'annoncer d'avance obligerait à le maintenir à la
// main le jour où le modèle bouge.
//
// La confirmation suit la convention de l'outil : elle est demandée par l'écran
// qui l'exige, dans la modale commune, et seulement s'il y a quelque chose à
// écraser — `vm.confirm` le dit. Sur une session vierge, le clic charge
// directement.
import { ref } from 'vue'
import AppDialog from '../AppDialog.vue'
import AppScreen from '../AppScreen.vue'
import AppScreenNav from '../AppScreenNav.vue'

const props = defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['load', 'start', 'back'])

// Le scénario cliqué, retenu le temps de la question : la modale ne le
// transporte pas, elle ne rend qu'une sortie.
const pending = ref(null)

function request(id) {
  if (!props.vm.confirm) {
    emit('load', id)
    return
  }
  pending.value = id
}

function answer(action) {
  const id = pending.value
  pending.value = null
  if (action === 'load' && id) emit('load', id)
}
</script>

<style scoped>
/* La page tient la largeur de l'outil et s'aligne donc sur le bloc « M.A.IA »
   de l'en-tête : elle était bornée à 1180px quand `AppScreen` en donne 1440,
   et rentrait de 130px de chaque côté. Même motif que sur la page
   d'information. */
.page-head__title {
  margin: 6px 0 0;
  font-size: 30px;
  line-height: 1.15;
}

.page-head__lead {
  max-width: 680px;
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

.cases {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 32px;
}

/* Même gabarit que les portes de l'accueil : une colonne complète dont le
   bouton est poussé en pied, pour que les trois s'alignent quelle que soit la
   longueur des textes. */
.case {
  display: flex;
  flex-direction: column;
  padding: 22px 22px 24px;
}

.case__name {
  margin: 0;
  font-size: 20px;
  letter-spacing: normal;
}

.case__profile {
  margin: 6px 0 0;
  font-size: 11.5px;
  color: var(--color-neutral-700);
}

.case__story {
  margin: 14px 0 0;
  font-size: 13px;
  line-height: 1.45;
  text-wrap: pretty;
}

/* Le filet sépare ce que l'organisation est de ce que l'exemple démontre : la
   première moitié décrit une PME, la seconde parle de l'outil. */
.case__label {
  margin: 18px 0 0;
  padding-top: 14px;
  border-top: 1px solid var(--color-neutral-400);
  color: var(--color-neutral-700);
}

.case__shows {
  margin: 8px 0 22px;
  font-size: 12.5px;
  line-height: 1.45;
  text-wrap: pretty;
}

.case__button {
  margin-top: auto;
  padding-top: 12px;
  padding-bottom: 12px;
}

.demo__start {
  min-width: 220px;
}

@media (max-width: 900px) {
  .cases {
    grid-template-columns: 1fr;
    margin-top: 24px;
  }
}
</style>

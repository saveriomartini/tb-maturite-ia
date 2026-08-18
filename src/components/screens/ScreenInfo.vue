<template>
  <AppScreen class="info">
    <header class="page-head">
      <p class="eyebrow">Information</p>
      <h1 class="page-head__title heading">Le modèle et ce qu'il évalue</h1>
      <p class="page-head__lead">
        Cette page est là pour qui veut comprendre l'approche utilisée.
      </p>
    </header>

    <section class="zone">
      <h2 class="zone__title heading">Les trois phases du diagnostic</h2>
      <JourneyMap :phases="journey.phases" />
    </section>

    <section class="zone">
      <h2 class="zone__title heading">Le cadre de référence</h2>
      <ScreenCadrage1
        :vm="cadrage1"
        @toggle-level="emit('toggle-level', $event)"
      />
    </section>

    <section class="zone">
      <h2 class="zone__title heading">Les domaines de capacité du diagnostic</h2>
      <ScreenDiagStart :vm="scope" />
    </section>

    <AppScreenNav back-label="Retour à l'accueil" @back="emit('back')">
      <template #actions>
        <button
          type="button"
          class="btn btn-primary info__start"
          @click="emit('start')"
        >
          Démarrer le diagnostic
        </button>
      </template>
    </AppScreenNav>
  </AppScreen>
</template>

<script setup>
// Page d'information : le parcours en haut, puis le modèle, puis la carte des
// areas. Trois sections empilées d'un même défilement, hors du parcours
// d'évaluation — elles le précédaient et le retardaient. Le bouton de pied de
// page permet d'attaquer le diagnostic sans repasser par l'accueil.
import AppScreen from "../AppScreen.vue";
import AppScreenNav from "../AppScreenNav.vue";
import JourneyMap from "../JourneyMap.vue";
import ScreenCadrage1 from "./ScreenCadrage1.vue";
import ScreenDiagStart from "./ScreenDiagStart.vue";

defineProps({
  journey: { type: Object, required: true },
  cadrage1: { type: Object, required: true },
  scope: { type: Object, required: true },
});

const emit = defineEmits(["toggle-level", "start", "back"]);
</script>

<style scoped>
.info {
  max-width: 1180px;
}

.page-head {
  max-width: 780px;
}

.page-head__title {
  margin: 6px 0 0;
  font-size: 30px;
  line-height: 1.15;
}

.page-head__lead {
  margin: 12px 0 0;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

.zone {
  margin-top: 40px;
  padding-top: 22px;
  border-top: 2px solid var(--color-text);
}

.zone__title {
  margin: 0 0 18px;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.info__start {
  min-width: 220px;
}
</style>

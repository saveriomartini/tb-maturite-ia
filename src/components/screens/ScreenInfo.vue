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
      <h2 class="zone__title heading">{{ info.concepts.title }}</h2>
      <p class="zone__lead">{{ info.concepts.lead }}</p>
      <div class="terms">
        <article v-for="term in info.concepts.terms" :key="term.term" class="panel term">
          <h3 class="panel-head term__name">{{ term.term }}</h3>
          <div class="term__body">
            <p class="term__question">{{ term.question }}</p>
            <p class="term__definition">{{ term.definition }}</p>
          </div>
        </article>
      </div>
      <p class="zone__note">{{ info.concepts.measured }}</p>
    </section>

    <section class="zone">
      <h2 class="zone__title heading">{{ info.levelBuild.title }}</h2>
      <p class="zone__lead">{{ info.levelBuild.lead }}</p>
      <div class="grid-wrap">
        <table class="table grid">
          <thead>
            <tr>
              <th class="head grid__rank">Niveau</th>
              <th v-for="indicator in info.levelBuild.indicators" :key="indicator.id" class="head">
                {{ indicator.name }}
              </th>
              <th class="head">En un mot</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in info.levelBuild.rows" :key="row.n">
              <td class="cell grid__rank heading">{{ row.n }}</td>
              <td v-for="cell in row.cells" :key="cell.id" class="cell">{{ cell.text }}</td>
              <td class="cell grid__synthesis">{{ row.synthesis }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-for="note in info.levelBuild.notes" :key="note" class="zone__note">{{ note }}</p>
    </section>

    <section class="zone">
      <h2 class="zone__title heading">{{ info.scaleMap.title }}</h2>
      <p class="zone__lead">{{ info.scaleMap.lead }}</p>
      <div class="grid-wrap">
        <table class="table scales">
          <thead>
            <tr>
              <th v-for="column in info.scaleMap.columns" :key="column.id" class="head">
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in info.scaleMap.rows" :key="row.n">
              <td class="cell scales__rank heading">{{ row.n }}</td>
              <td class="cell scales__retained">{{ row.retained }}</td>
              <td class="cell">{{ row.ozkaya }}</td>
              <td class="cell">{{ row.venkatraman }}</td>
              <td class="cell scales__pending">{{ row.gartner }}</td>
              <td class="cell scales__pending">{{ row.altimeter }}</td>
              <td class="cell scales__pending">{{ row.elementAI }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="zone__note">{{ info.scaleMap.pending }}</p>
      <p v-for="note in info.scaleMap.notes" :key="note" class="zone__note">{{ note }}</p>
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
// Page d'information : le parcours en haut, puis les trois mots qu'on confond,
// puis la construction des niveaux, puis les équivalences d'échelles, puis le
// modèle et la carte des areas. Sections empilées d'un même défilement, hors du
// parcours d'évaluation — elles le précédaient et le retardaient. Le bouton de
// pied de page permet d'attaquer le diagnostic sans repasser par l'accueil.
//
// Les trois sections ajoutées viennent en tête du modèle plutôt qu'après lui :
// elles disent ce qu'on mesure et comment un rang se lit, ce qui est la
// condition pour que le tableau des blocs et la carte des domaines veuillent
// dire quelque chose.
//
// C'est le seul écran, avec l'attribution, où Venkatraman est nommé : le tableau
// d'équivalences n'a pas d'autre objet que de dire d'où viennent les noms des
// paliers, et il ne peut pas le faire sans citer ses sources.
import AppScreen from "../AppScreen.vue";
import AppScreenNav from "../AppScreenNav.vue";
import JourneyMap from "../JourneyMap.vue";
import ScreenCadrage1 from "./ScreenCadrage1.vue";
import ScreenDiagStart from "./ScreenDiagStart.vue";

defineProps({
  journey: { type: Object, required: true },
  info: { type: Object, required: true },
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

/* Le chapô d'une section et les notes qui la ferment gardent la largeur de
   lecture de la page ; les tableaux, eux, prennent toute la largeur. */
.zone__lead {
  max-width: 780px;
  margin: -6px 0 18px;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

.zone__note {
  max-width: 780px;
  margin: 14px 0 0;
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

/* Les trois définitions se lisent côte à côte : ce qui les distingue est la
   question de chacune, et une colonne par mot met les trois questions sur la
   même ligne d'œil. */
.terms {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.term__name {
  margin: 0;
  font-family: var(--font-body);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 800;
}

.term__body {
  padding: 12px 14px 14px;
}

.term__question {
  margin: 0;
  font-size: 13.5px;
  font-weight: 700;
  line-height: 1.35;
  text-wrap: pretty;
}

.term__definition {
  margin: 8px 0 0;
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

/* Les deux tableaux sont larges : ils défilent horizontalement dans leur propre
   cadre plutôt que d'étirer la page. */
.grid-wrap {
  overflow-x: auto;
  border: 2px solid var(--color-text);
  background: var(--color-neutral-100);
}

.grid,
.scales {
  font-size: 12.5px;
}

.head {
  padding: 10px 12px;
}

.cell {
  padding: 10px 12px;
  vertical-align: top;
  line-height: 1.45;
}

.grid__rank,
.scales__rank {
  width: 62px;
  text-align: center;
}

.grid__synthesis {
  min-width: 230px;
  font-weight: 700;
}

.scales {
  min-width: 900px;
}

.scales__retained {
  font-weight: 700;
}

/* Une cellule en attente de vérification se signale sans se cacher : elle est
   la seule information de sa colonne, et la lire comme une valeur serait le
   contresens que le marqueur existe pour empêcher. */
.scales__pending {
  color: var(--color-neutral-600);
  font-size: 11px;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.info__start {
  min-width: 220px;
}

@media (max-width: 900px) {
  .terms {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <AppScreen class="info">
    <header class="page-head">
      <p class="eyebrow">Information</p>
      <h1 class="page-head__title heading">Le modèle et ce qu'il évalue</h1>
      <p class="page-head__lead">
        Cette page se lit en trois parties. La première suffit pour répondre au questionnaire ; les
        deux autres s'ouvrent quand vous voudrez savoir ce que vaut le résultat et d'où vient le
        modèle.
      </p>

      <ol class="map">
        <li v-for="part in info.parts" :key="part.id">
          <button
            type="button"
            class="button-reset map__link"
            @click="goTo(part)"
          >
            <span class="map__n heading">{{ part.n }}</span>
            <span class="map__title">{{ part.title }}</span>
            <span class="tag map__tag" :class="{ 'tag--muted': part.optional }">{{ part.tag }}</span>
          </button>
        </li>
      </ol>
    </header>

    <section
      v-for="part in info.parts"
      :id="anchorOf(part)"
      :key="part.id"
      class="part"
    >
      <header class="part__head">
        <div class="part__title-row">
          <p class="part__n heading">{{ part.n }}</p>
          <h2 class="part__title heading">{{ part.title }}</h2>
          <span class="tag part__tag" :class="{ 'tag--muted': part.optional }">{{ part.tag }}</span>
          <button
            v-if="part.optional"
            type="button"
            class="btn btn-secondary part__toggle"
            :aria-expanded="Boolean(open[part.id])"
            :aria-controls="`part-${part.id}`"
            @click="open[part.id] = !open[part.id]"
          >
            {{ open[part.id] ? 'Masquer' : 'Afficher' }}
          </button>
        </div>
        <p class="part__lead">{{ part.lead }}</p>
      </header>

      <div v-show="isOpen(part)" :id="`part-${part.id}`" class="part__body">
        <template v-if="part.id === 'answer'">
          <section class="zone">
            <h3 class="zone__title heading">Les quatre phases du parcours</h3>
            <JourneyMap :phases="journey.phases" />
          </section>

          <section class="zone">
            <h3 class="zone__title heading">{{ info.concepts.title }}</h3>
            <p class="zone__lead">{{ info.concepts.lead }}</p>
            <div class="terms">
              <article v-for="term in info.concepts.terms" :key="term.term" class="panel term">
                <h4 class="panel-head term__name">{{ term.term }}</h4>
                <div class="term__body">
                  <p class="term__question">{{ term.question }}</p>
                  <p class="term__definition">{{ term.definition }}</p>
                </div>
              </article>
            </div>
            <p class="zone__note">{{ info.concepts.measured }}</p>
          </section>

          <section class="zone">
            <h3 class="zone__title heading">Les domaines de capacité du diagnostic</h3>
            <ScreenDiagStart :vm="scope" />
          </section>
        </template>

        <template v-else-if="part.id === 'result'">
          <section class="zone">
            <h3 class="zone__title heading">{{ info.levelBuild.title }}</h3>
            <p class="zone__lead">{{ info.levelBuild.lead }}</p>
            <div class="grid-wrap">
              <table class="table grid">
                <thead>
                  <tr>
                    <th class="head grid__rank">Niveau</th>
                    <th v-for="indicator in info.levelBuild.indicators" :key="indicator.id" class="head">
                      {{ indicator.name }}
                    </th>
                    <th class="head">Niveau énoncé</th>
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
            <h3 class="zone__title heading">Le cadre de référence</h3>
            <ScreenCadrage1
              :vm="cadrage1"
              @toggle-level="emit('toggle-level', $event)"
            />
          </section>
        </template>

        <template v-else>
          <section class="zone">
            <h3 class="zone__title heading">{{ info.scaleMap.title }}</h3>
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
                    <td
                      v-for="column in info.scaleMap.columns"
                      :key="column.id"
                      class="cell"
                      :class="[
                        `scales__${column.id}`,
                        {
                          heading: column.id === 'n',
                          'scales__none': isNoEquivalent(row[column.id])
                        }
                      ]"
                    >
                      {{ row[column.id] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="zone__note">{{ info.scaleMap.pending }}</p>
            <p v-for="note in info.scaleMap.notes" :key="note" class="zone__note">{{ note }}</p>
          </section>

          <section class="zone">
            <h3 class="zone__title heading">{{ info.provenance.title }}</h3>
            <p class="zone__lead">{{ info.provenance.lead }}</p>
            <ol class="sources">
              <li v-for="source in info.provenance.sources" :key="source.ref" class="source">
                <p class="source__ref">{{ source.ref }}</p>
                <p class="source__role">{{ source.role }}</p>
              </li>
            </ol>
            <h4 class="zone__subtitle heading">{{ info.provenance.comparedTitle }}</h4>
            <p class="zone__lead">{{ info.provenance.comparedLead }}</p>
            <ol class="sources">
              <li v-for="source in info.provenance.compared" :key="source.ref" class="source">
                <p class="source__ref">{{ source.ref }}</p>
                <p class="source__role">{{ source.role }}</p>
              </li>
            </ol>
          </section>
        </template>
      </div>
    </section>

    <AppScreenNav back-label="Retour à l'accueil" @back="emit('back')">
      <template #actions>
        <button
          type="button"
          class="btn btn-primary btn-arrow info__start"
          @click="emit('start')"
        >
          Démarrer le diagnostic
        </button>
      </template>
    </AppScreenNav>
  </AppScreen>
</template>

<script setup>
// Page d'information, en trois parties de lecture.
//
// — pourquoi trois parties —
// Les six sections vivaient empilées à plat, d'un même défilement, sans que rien
// ne dise laquelle il fallait avoir lue avant de commencer. La seconde série
// d'évaluations terrain a jugé la page « très complète » — ce qui, d'une page
// d'introduction, est le reproche : tout y pèse le même poids, donc rien n'y est
// prioritaire, et la seule chose qu'un dirigeant pressé en retire est qu'il n'a
// pas le temps de la lire.
//
// Le découpage est celui que l'évaluation a demandé, et il tient à trois
// questions distinctes : que vais-je devoir répondre (partie 1), que vaut ce
// qu'on me rend (partie 2), d'où vient tout ceci (partie 3). Seule la première
// se pose avant le questionnaire ; c'est la seule qui reste ouverte.
//
// — le repli fait le facultatif —
// Les parties 2 et 3 se replient, et c'est ce repli qui dit « facultatif ». Un
// intertitre qui l'annonce sans rien fermer laisse la page aussi longue, et
// c'est la longueur, non l'intitulé, qui décourage d'entrer. Replier, en
// revanche, ne cache rien : les trois en-têtes restent lus d'un coup d'œil, avec
// leur chapô, et l'ouverture est à un clic.
//
// Le contenu est replié en `v-show` et non retiré du document : l'en-tête d'une
// partie fermée reste une ancre atteignable, et le sommaire peut donc y déposer
// le lecteur avant même que la partie s'ouvre.
//
// — l'état est local et ne se souvient de rien —
// Ce qui est ouvert n'appartient pas à la session : ce n'est pas une réponse,
// cela ne se calcule pas, cela ne s'exporte pas. Une page rouverte se présente
// donc comme la première fois, ce qui est ce qu'on veut d'une page qui apprend à
// répondre — le lecteur qui revient n'a pas besoin de retrouver son repli, il a
// besoin de retrouver la partie 1.
//
// — le sommaire —
// Trois lignes sous le titre, qui nomment les parties et disent laquelle est à
// lire. Elles ne sont pas décoratives : elles ouvrent la partie visée avant d'y
// défiler, faute de quoi un lecteur venu par le sommaire tomberait sur un
// en-tête fermé et devrait cliquer une seconde fois pour le même geste.
//
// Le contenu de chaque partie reste écrit en clair dans le gabarit, branche par
// branche : ce sont trois assemblages différents, et les rendre par une boucle
// unique demanderait de décrire en donnée quel composant va où — une indirection
// qui rendrait la page illisible pour épargner quinze lignes.
//
// C'est le seul écran, avec l'attribution, où Venkatraman est nommé : le tableau
// d'équivalences n'a pas d'autre objet que de dire d'où viennent les noms des
// paliers, et il ne peut pas le faire sans citer ses sources. La liste des
// sources qui ferme la partie 3 vient du même endroit que le pied de page
// (`data/attribution.js`) : celui-ci ne porte que le référentiel de base et sa
// licence, faute de place, et les trois emprunts n'étaient jusqu'ici lisibles
// nulle part à l'écran.
import { reactive } from "vue";
import AppScreen from "../AppScreen.vue";
import AppScreenNav from "../AppScreenNav.vue";
import JourneyMap from "../JourneyMap.vue";
import ScreenCadrage1 from "./ScreenCadrage1.vue";
import ScreenDiagStart from "./ScreenDiagStart.vue";
import { scrollToAnchor } from "../../composables/useAnchorScroll.js";
import { NO_EQUIVALENT } from "../../data/info.js";

defineProps({
  journey: { type: Object, required: true },
  info: { type: Object, required: true },
  cadrage1: { type: Object, required: true },
  scope: { type: Object, required: true },
});

const emit = defineEmits(["toggle-level", "start", "back"]);

// Une entrée par partie repliable, créée au premier clic. Les parties non
// repliables n'y entrent jamais : `isOpen` les tient ouvertes par leur donnée et
// non par cet état, ce qui rend impossible de fermer par mégarde la seule partie
// que tout le monde doit lire.
const open = reactive({});

// Le corps du tableau d'équivalences se rend par une boucle sur `columns`, si
// bien qu'aucune cellule ne sait plus d'avance ce qu'elle porte : c'est son
// contenu qui le dit. Le tiret d'une échelle qui n'a pas cinq étages se lit en
// gris — non pour l'effacer, mais pour qu'il ne se lise pas comme un nom.
function isNoEquivalent(value) {
  return value === NO_EQUIVALENT;
}

function anchorOf(part) {
  return `partie-${part.n}`;
}

function isOpen(part) {
  return !part.optional || Boolean(open[part.id]);
}

// Ouvrir puis défiler, dans cet ordre : l'ancre est portée par l'en-tête de la
// partie, qui reste affiché même repliée, si bien que le défilement atteint sa
// cible que l'ouverture ait eu lieu ou non.
function goTo(part) {
  if (part.optional) open[part.id] = true;
  scrollToAnchor(anchorOf(part));
}
</script>

<style scoped>
/* La dernière partie peut être repliée : son contenu ne prend alors aucune
   hauteur, et le pied de page viendrait se coller au chapô de la partie 3. On
   pose donc la variable que `AppScreenNav` expose pour ce cas exactement,
   plutôt que d'ajouter une marge sous une section qui, elle, est bien espacée
   de la suivante. */
.info {
  --nav-margin-top: 44px;
}

/* — la page tient la largeur de l'outil —
   Elle était bornée à 1180px là où `AppScreen` en donne 1440. Centrée, elle
   rentrait donc de 130px de chaque côté par rapport à la barre d'en-tête, qui
   est au gabarit plein : le bloc « M.A.IA » et le premier mot de la page ne
   tombaient pas sur la même verticale, et passer de l'information à l'outil
   décalait tout le contenu. Sans borne propre, la page hérite du gabarit commun
   et s'aligne sur l'en-tête comme le font les pages de l'outil. Le chapô et les
   chapôs de partie ne gardent plus de largeur de lecture propre : bornés plus
   court que la page, ils cassaient leurs lignes bien avant la marge et
   laissaient à leur droite un vide que rien ne venait occuper. */
.page-head__title {
  margin: 6px 0 0;
  font-size: 30px;
  line-height: 1.15;
}

.page-head__lead {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.55;
  text-wrap: pretty;
}

/* Le sommaire : trois lignes cliquables, chacune numérotée comme la partie
   qu'elle ouvre. Il tient la largeur du chapô — c'est un texte, pas un bandeau —
   et ne porte ni cadre ni fond : les trois en-têtes de partie, plus bas, sont
   la structure ; ceci n'en est que le raccourci. */
.map {
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--color-divider);
}

.map__link {
  display: flex;
  align-items: baseline;
  gap: 10px;
  width: 100%;
  padding: 8px 2px;
  border-bottom: 1px solid var(--color-divider);
  text-align: left;
}

.map__link:hover .map__title {
  text-decoration: underline;
}

.map__n {
  flex: none;
  width: 14px;
  font-size: 13px;
  color: var(--color-neutral-600);
}

.map__title {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 13px;
  font-weight: 700;
}

.map__tag {
  flex: none;
}

/* Une partie. Le filet fort la sépare de la précédente — c'est le même trait
   qui séparait les sections, mais il ne coiffe plus que trois blocs au lieu de
   six, ce qui est exactement ce qu'on cherche : trois entrées, pas six.

   `scroll-margin-top` retient l'en-tête sous la barre collée quand le sommaire
   y dépose le lecteur ; il est déclaré ici et non calculé, comme partout
   ailleurs dans le dépôt. */
.part {
  margin-top: 44px;
  padding-top: 22px;
  border-top: 2px solid var(--color-text);
  scroll-margin-top: calc(var(--header-height) + 12px);
}

.part__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px 12px;
}

/* Le numéro de partie, en gros et en tête de ligne : c'est lui qui donne à voir
   qu'il y a trois entrées et une seule première. Le mot « partie » ne s'écrit
   pas — le chiffre à cette taille, devant un titre, ne se lit pas autrement. */
.part__n {
  flex: none;
  font-size: 26px;
  line-height: 1;
  color: var(--color-neutral-500);
}

/* Le titre partage la ligne du numéro et se resserre plutôt que de passer
   dessous : sans base de rétrécissement, une fenêtre étroite renvoyait le titre
   à la ligne et laissait le chiffre seul sur la sienne, ce qui en faisait un
   ornement au lieu d'un rang. */
.part__title {
  flex: 1 1 220px;
  min-width: 0;
  margin: 0;
  font-size: 20px;
  line-height: 1.15;
  letter-spacing: normal;
}

/* L'étiquette dit le moment, pas l'importance : « à lire avant de commencer »
   pleine, « facultatif » en sourdine. Elle se pose au bout du titre, où elle se
   lit avec lui. */
.part__tag {
  flex: none;
}

/* La commande d'ouverture ferme la ligne, à droite : elle appartient à
   l'en-tête de la partie et non à son contenu, qu'elle ferait sinon commencer
   par un bouton. */
.part__toggle {
  --btn-padding-y: 5px;
  --btn-padding-x: 14px;
  --btn-font-size: 11px;
  flex: none;
  margin-left: auto;
}

.part__lead {
  margin: 10px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

/* La première zone d'une partie ouverte n'a pas besoin du filet fin qui sépare
   les zones entre elles : l'en-tête de partie l'a déjà annoncée. */
.part__body > .zone:first-child {
  margin-top: 26px;
  padding-top: 0;
  border-top: 0;
}

.zone {
  margin-top: 34px;
  padding-top: 20px;
  border-top: 1px solid var(--color-divider);
}

.zone__title {
  margin: 0 0 18px;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* — les textes tiennent la largeur de ce qu'ils commentent —
   Le chapô d'une section et les notes qui la ferment étaient bornés à 780px sur
   une page qui en fait 1180 : ils s'arrêtaient à deux tiers de la largeur des
   tableaux et des panneaux qu'ils annoncent, ce qui ouvrait à droite une bande
   vide sur toute la hauteur de la page et faisait flotter chaque texte à côté
   de son objet au lieu de le coiffer. Ils prennent désormais la largeur de leur
   section, comme tout le reste. */
.zone__lead {
  margin: -6px 0 18px;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

/* Un cran sous le titre de section : les échelles comparées sont une seconde
   liste dans la même section, et non une section de plus — les hisser au même
   niveau que « D'où vient le modèle » leur prêterait le poids qu'on vient
   précisément de leur retirer. */
.zone__subtitle {
  margin: 26px 0 12px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.zone__note {
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

/* La classe suit l'`id` de la colonne, parce que le corps du tableau la dérive
   de `columns` : `scales__n` et non `scales__rank`, faute de quoi la règle ne
   s'appliquerait plus à rien. */
.grid__rank,
.scales__n {
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

/* Le tiret d'une case sans équivalent, en gris : toutes les colonnes portent
   désormais de vrais noms d'étages, et la nuance est ce qui empêche de lire ce
   tiret comme une valeur. Le style va à la cellule et non à la colonne — une
   seule case d'Altimeter est concernée. */
.scales__none {
  color: var(--color-neutral-600);
  font-size: 11px;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

/* Les sources : la référence, puis ce qu'elle fonde ici. Le rôle compte autant
   que la référence — une liste de titres dirait de quoi l'auteur s'est inspiré,
   elle ne dirait pas ce que le lecteur tient entre les mains. */
.sources {
  margin: 0;
  padding: 0;
  list-style: none;
  max-width: 90ch;
}

.source + .source {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--color-divider);
}

.source__ref {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.45;
  font-weight: 700;
  text-wrap: pretty;
}

.source__role {
  margin: 4px 0 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

.info__start {
  min-width: 220px;
}

@media (max-width: 900px) {
  .terms {
    grid-template-columns: 1fr;
  }

  /* Le bouton passe à la ligne sous le titre plutôt que de serrer l'étiquette
     contre lui : `margin-left: auto` le collerait au bord droit d'une ligne
     qu'il ne partage plus avec personne. */
  .part__toggle {
    margin-left: 0;
  }
}
</style>

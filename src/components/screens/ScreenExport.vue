<template>
  <AppScreen>
    <div class="toolbar">
      <p class="toolbar__meta">Aperçu de l'export PDF</p>
      <button type="button" class="btn btn-ghost" @click="emit('back')">Retour</button>
    </div>

    <div class="pages">
      <article v-for="page in vm.pages" :key="page.label" class="page">
        <header class="page__head">
          <div>
            <h1 class="page__title heading">Domaines de capacité qui séparent du profil visé</h1>
          </div>
          <div class="page__levels">
            <!-- Sur une ligne : entre deux éléments, le compilateur condense en rien
                 un blanc qui contient un retour, et le périmètre se collerait à sa
                 couverture. -->
            <p class="page__level">{{ vm.scope.label }} : <span class="page__level-value">{{ vm.scope.unit }}</span> <span class="page__level-coverage">· {{ vm.scope.coverage }}</span></p>
            <p class="page__level">Profil visé : <span class="page__level-value">{{ vm.targetLabel }}</span></p>
            <p class="page__level">Profil diagnostiqué : <span class="page__level-value">{{ vm.acquiredLabel }}</span></p>
            <p v-if="vm.scope.note" class="page__coverage">{{ vm.scope.note }}</p>
          </div>
        </header>

        <div class="page__body">
          <p v-if="page.empty" class="page__empty">{{ vm.emptyLabel }}</p>

          <section v-for="row in page.rows" :key="row.id" class="domain">
            <p v-if="row.showGate" class="domain__gate">Pour atteindre « {{ row.gateLabel }} »</p>
            <header class="domain__head">
              <span class="domain__swatch" :style="{ background: row.dimColor }" />
              <span class="domain__dimension">{{ row.dim }}</span>
              <span class="domain__area heading">{{ row.name }}</span>
            </header>
            <p class="domain__ranks">
              Attendu au rang {{ row.required }} · situé au {{ row.level || '—' }}
            </p>
            <p class="domain__statement">{{ row.statement }}</p>
          </section>
        </div>

        <footer class="page__foot">
          <span>{{ vm.meta }}</span>
          <span>{{ page.label }}</span>
        </footer>
      </article>
    </div>
  </AppScreen>
</template>

<script setup>
// L'aperçu de la pièce à emporter. Elle ne liste plus des critères manquants et
// des pratiques à mettre en place : elle nomme les domaines de capacité qui
// séparent du profil visé et, pour chacun, l'énoncé à atteindre. C'est la même
// matière que l'écran d'ancrage, mise à plat pour être relue hors de l'outil.
//
// — où vit l'identité du document, et où elle ne vit plus —
// La ligne « Export <date> · model · session » paraissait trois fois sur une
// même page visible : dans la barre d'outils, dans l'en-tête de page et dans son
// pied. Elle ne vit plus qu'au pied, à côté du numéro de page, qui est l'endroit
// où l'on cherche l'identité d'une feuille détachée d'un dossier. La barre
// d'outils dit ce qu'on regarde — un aperçu — et non ce que le document est.
//
// L'en-tête de page nomme d'abord le périmètre de l'évaluation, puis les deux
// profils — visé et diagnostiqué, sous les mêmes noms qu'à l'écran : du plus
// englobant au plus fin, chaque ligne bornant celles qui la suivent. Le
// périmètre vient en premier parce que c'est la seule ligne qui puisse invalider
// la lecture des autres — un document relu sans personne pour préciser le
// périmètre se prend sinon pour un bilan de l'entreprise entière. Il est répété
// sur chaque page : une page détachée du dossier reste rattachée à son
// périmètre.
//
// La couverture est appendue à cette ligne plutôt que posée sous elle, comme à
// l'écran des résultats : les deux répondent à la même question — ce qu'on a
// prétendu couvrir, ce qu'on a couvert — et le mot « Couverture », qui les
// séparait, ne nomme rien ailleurs dans le parcours. Elle dit aussi ce que la
// liste ne contient pas : les domaines restés à évaluer et ceux déclarés hors
// périmètre. Sans ces nombres, l'absence d'un domaine se lirait comme un
// acquis.
import AppScreen from '../AppScreen.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['back'])
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.toolbar__meta {
  margin: 0;
  font-size: 12px;
  color: var(--color-neutral-700);
}

.pages {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  margin-top: 18px;
}

/* format A4 à l'échelle 1 : ce que produira l'impression */
.page {
  display: flex;
  flex-direction: column;
  width: 794px;
  min-height: 1123px;
  padding: 44px 48px;
  border: 1px solid var(--color-neutral-400);
  background: #fff;
  box-shadow: var(--shadow-md);
}

.page__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--color-text);
}

.page__title {
  margin: 0;
  font-size: 15px;
  line-height: 1.2;
  letter-spacing: normal;
}

/* La page A4 a une largeur fixe : la colonne de droite est bornée en dur pour
   que la note du périmètre non déclaré revienne à la ligne au lieu de repousser
   le titre. */
.page__levels {
  max-width: 300px;
  text-align: right;
}

.page__level {
  margin: 0;
  font-size: 10px;
  line-height: 1.5;
}

.page__level-value {
  font-weight: 700;
}

/* La couverture est appendue à la ligne du périmètre, mais elle ne s'y met pas
   au même poids : ce qui est en gras sur les trois lignes de l'en-tête, c'est la
   valeur déclarée — un périmètre, deux profils. Les nombres de couverture la
   précisent, et trois lignes de gras à côté d'un titre en feraient le sujet de
   la page. */
.page__level-coverage {
  color: var(--color-neutral-700);
}

/* Le seul commentaire de l'en-tête : la lecture par défaut quand aucun périmètre
   n'a été déclaré. En retrait de corps sous les lignes qu'il commente. */
.page__coverage {
  margin: 3px 0 0;
  font-size: 9px;
  line-height: 1.4;
  color: var(--color-neutral-700);
}

.page__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  margin-top: 16px;
}

.page__empty {
  margin: 0;
  padding: 16px;
  border: 1px solid var(--color-text);
  background: var(--color-neutral-200);
  font-size: 11px;
  line-height: 1.45;
}

/* Le palier annonce les domaines qui suivent sur sa propre ligne : les
   dimensions restent alignées à gauche d'un domaine à l'autre. */
.domain__gate {
  margin: 0 0 6px;
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 800;
}

.domain__head {
  display: flex;
  gap: 8px;
  align-items: baseline;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--color-divider);
}

.domain__swatch {
  width: 9px;
  height: 9px;
  flex: none;
  border: 1px solid var(--color-text);
}

.domain__dimension {
  font-size: 9.5px;
  color: var(--color-neutral-700);
}

.domain__area {
  margin-left: auto;
  font-size: 11.5px;
  letter-spacing: normal;
}

.domain__ranks {
  margin: 6px 0 0;
  font-size: 9px;
  color: var(--color-neutral-700);
}

.domain__statement {
  margin: 4px 0 0;
  font-size: 10px;
  line-height: 1.45;
}

.page__foot {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid var(--color-divider);
  font-size: 9.5px;
  color: var(--color-neutral-700);
}

/* La page ne se réagence pas : c'est un aperçu d'impression, sa largeur EST le
   A4. Quand l'écran est plus étroit, on la fait défiler latéralement plutôt que
   de mentir sur ce qui sortira de l'imprimante. */
@media (max-width: 900px) {
  .pages {
    align-items: flex-start;
    overflow-x: auto;
    padding-bottom: 12px;
  }

  .page {
    flex: none;
  }

  .toolbar {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>

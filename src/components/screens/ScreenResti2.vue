<template>
  <div class="detail">
    <p class="section-title">Par domaine de capacité :</p>

    <div class="list">
      <table class="table">
        <thead>
          <tr>
            <th class="col-dimension">Dimension</th>
            <th>Domaine</th>
            <th class="col-score">Critères</th>
            <th class="col-group" :colspan="vm.indicatorCount">Indicateurs</th>
            <th class="col-mark" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in vm.rows" :key="row.id">
            <td
              class="cell-dimension"
              :class="{ 'is-first': row.firstOfDimension }"
              :style="{ '--dimension-color': row.color }"
            >
              {{ row.dim }}
            </td>
            <td class="cell-area">{{ row.area }}</td>
            <td class="cell-goals">{{ row.goals }}</td>
            <td v-for="(rank, index) in row.ranks" :key="index" class="cell-rank">{{ rank }}</td>
            <td class="cell-mark">
              <span
                class="mark"
                :class="{ 'mark--acquired': row.acquired }"
                role="img"
                :aria-label="row.acquired ? 'Domaine acquis' : 'Domaine non acquis'"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
// Détail par area de compétence. Le rappel « profil visé / profil actuel » a été
// retiré : cette section suit immédiatement la synthèse qui l'affiche déjà en
// tête de page, il n'y répétait qu'une information à l'écran.
//
// Les colonnes chiffrées vont du plus agrégé au plus fin : objectifs validés,
// puis les trois rangs d'indicateurs de maturité. La synthèse par bloc en donne
// la moyenne ; ici ils restent séparés, c'est le seul endroit où l'on voit
// lequel des trois retient une area.
//
// La colonne des pratiques validées est tombée avec l'unité : l'objectif est
// désormais ce qui se compte, et la ligne annonçait deux fois le même état à
// deux échelles — la seconde ne pouvant que suivre la première, puisqu'une
// pratique ne se valide plus seule.
//
// Ces trois colonnes sont nues. Les coiffer chacune d'une abréviation de deux
// lettres obligeait à une légende sous le titre de section pour la décoder :
// deux lignes d'appareillage pour trois chiffres, quand le questionnaire vient
// de nommer chaque indicateur en toutes lettres au moment d'y répondre. Seul
// « Indicateurs » subsiste, qui dit ce que le groupe mesure ; leur ordre est
// celui du modèle, le même que celui des rangs de chaque ligne, puisque les
// deux viennent du view-model.
//
// Un seul tableau, et non plus un par bloc : sur quatre tableaux côte à côte,
// les colonnes ne s'alignaient pas d'un bloc à l'autre et deux areas ne se
// comparaient qu'en changeant de regard. À plat, l'œil descend une colonne. Le
// bloc n'est pas perdu pour autant — il ordonne les lignes, et la couleur de
// dimension le redit sur le bord gauche.
defineProps({
  vm: { type: Object, required: true }
})
</script>

<style scoped>
.section-title {
  margin: 18px 0 10px;
  font-size: 11px;
  font-weight: 700;
}

/* le cadre appartenait au bloc ; il passe à la liste, qui est désormais le seul
   objet de la section. Le défilement horizontal est une sécurité : sur un
   écran étroit, les colonnes chiffrées ne se compriment pas jusqu'à
   l'illisible, elles glissent. */
.list {
  border: 2px solid var(--color-text);
  overflow-x: auto;
}

/* pleine largeur, la Dimension peut reprendre de la place sans que l'intitulé
   de domaine — le plus long de la ligne — en manque */
.col-dimension {
  width: 22%;
}

.col-score {
  width: 78px;
}

/* l'en-tête qui coiffe les trois rangs : centré sur eux, et non sur la première
   des trois colonnes qu'il occupe */
.col-group {
  text-align: center;
}

/* un rang tient en un caractère : la colonne n'a pas à être plus large, et rien
   ne l'élargit plus depuis que son intitulé a disparu */
.cell-rank {
  width: 34px;
  font-size: 11px;
  text-align: center;
}

/* la première ligne d'une dimension porte son nom et sa couleur pleine ;
   les suivantes n'en gardent que le liseré */
.cell-dimension {
  border-left: 5px solid var(--dimension-color);
  font-size: 10.5px;
  font-weight: 700;
  line-height: 1.3;
  vertical-align: top;
}

.cell-dimension.is-first {
  background: var(--dimension-color);
}

.cell-area {
  font-size: 11px;
  vertical-align: top;
}

.cell-goals {
  font-size: 11px;
  font-weight: 700;
}

/* colonne de marquage : le carré plein reprend le noir de .tag--solid, qui dit
   déjà « diagnostic » dans l'escalier de la restitution 1 */
.col-mark {
  width: 22px;
}

.cell-mark {
  padding-left: 0;
  padding-right: 10px;
  text-align: right;
}

.mark {
  display: inline-block;
  box-sizing: border-box;
  width: 8px;
  height: 8px;
  border: 1px solid var(--color-text);
  background: transparent;
}

.mark--acquired {
  background: var(--color-text);
}
</style>

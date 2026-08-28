<template>
  <div class="detail">
    <h2 class="section-head">Par domaine de capacité</h2>

    <p v-if="focus" class="focus">
      <span class="focus__label eyebrow">Focalisation</span>
      <span class="focus__text">{{ focus.label }}. Recliquer le palier dans l’échelle l’annule.</span>
    </p>

    <div class="list" :class="{ 'is-focused': Boolean(focus) }">
      <table class="table">
        <thead>
          <tr>
            <th class="col-dimension">Dimension</th>
            <th>Domaine</th>
            <th class="col-score">Attendu au rang</th>
            <th class="col-score">Situé au</th>
            <th class="col-mark" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in vm.rows"
            :key="row.id"
            :class="{ 'is-out-of-scope': row.outOfScope, 'is-lit': isLit(row) }"
          >
            <td
              class="cell-dimension"
              :class="{ 'is-first': row.firstOfDimension }"
              :style="{ '--dimension-color': row.color }"
            >
              {{ row.dim }}
            </td>
            <td class="cell-area">{{ row.area }}</td>
            <td class="cell-required">{{ row.required }}</td>
            <td class="cell-level">{{ row.levelLabel }}</td>
            <td class="cell-mark">
              <span
                class="mark"
                :class="{ 'mark--at-rank': row.atRequired }"
                role="img"
                :aria-label="row.atRequired ? 'Domaine au rang attendu' : 'Domaine sous le rang attendu'"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
// Détail par domaine de capacité, dans l'ordre du modèle. Le rappel « profil
// visé / profil actuel » n'y figure pas : la synthèse l'affiche déjà en tête de
// page, et le profil visé ne se déclare qu'à la phase suivante.
//
// C'est la dernière section de la page de résultats, et elle est coiffée comme
// les autres (.section-head) : le tableau est un niveau de détail, pas une
// seconde page. Son intitulé portait 11px en gras, indistinguable des étiquettes
// de colonne qu'il surplombait.
//
// Deux colonnes chiffrées, et elles ne se lisent qu'ensemble : le rang auquel le
// modèle attend le domaine, et celui où il se situe. Un niveau 2 n'est ni bon ni
// mauvais dans l'absolu — il tient un domaine attendu au rang 2 et retient un
// domaine attendu au rang 3.
//
// Les colonnes de critères validés et de rangs d'indicateurs sont tombées avec
// ce qu'elles comptaient. À leur place, une seule valeur par domaine : l'énoncé
// retenu. Deux états ne sont pas des chiffres et se disent en toutes lettres —
// « non renseigné » et « hors périmètre » : les afficher comme des zéros les
// ferait lire comme des mesures, alors que l'un est une absence de mesure et
// l'autre une sortie du calcul.
//
// Un seul tableau, et non plus un par bloc : sur quatre tableaux côte à côte,
// les colonnes ne s'alignaient pas et deux domaines ne se comparaient qu'en
// changeant de regard. À plat, l'œil descend une colonne. Le bloc n'est pas
// perdu pour autant — il ordonne les lignes, et la couleur de dimension le redit
// sur le bord gauche.
//
// — la focalisation —
// Cliquer un palier dans l'échelle allume ici les domaines qui le retiennent.
// Aucune ligne n'est retirée : le tableau reste le relevé complet des 28
// domaines, et une liste qui rétrécirait sous le clic ferait perdre ce qu'elle
// est. Les lignes non concernées reculent, elles ne disparaissent pas.
const props = defineProps({
  vm: { type: Object, required: true },
  // Le palier focalisé et les domaines qu'il retient, ou null. La page qui
  // compose l'échelle et le tableau le tient : ce composant n'en décide pas.
  focus: { type: Object, default: null }
})

function isLit(row) {
  return Boolean(props.focus) && props.focus.areas.includes(row.id)
}
</script>

<style scoped>
/* Ce que la focalisation montre, en toutes lettres, et comment en sortir : sans
   cette ligne, un tableau à demi éteint se lit comme un défaut d'affichage. */
.focus {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  align-items: baseline;
  margin: 0 0 10px;
  padding-left: 12px;
  border-left: 3px solid var(--color-text);
}

.focus__label {
  color: var(--color-neutral-700);
}

.focus__text {
  font-size: 12px;
  color: var(--color-neutral-800);
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
  width: 110px;
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

.cell-required {
  font-size: 11px;
  color: var(--color-neutral-700);
}

.cell-level {
  font-size: 11px;
  font-weight: 700;
}

/* Un domaine hors périmètre reste dans la liste — le retirer ferait lire un
   modèle plus court qu'il n'est — mais en retrait : il ne participe à aucun
   calcul de la page. */
.is-out-of-scope .cell-area,
.is-out-of-scope .cell-required,
.is-out-of-scope .cell-level {
  color: var(--color-neutral-600);
  font-weight: 500;
}

/* colonne de marquage : le carré plein reprend le noir de .tag--solid, qui dit
   déjà « diagnostic » dans l'échelle de la restitution 1 */
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

.mark--at-rank {
  background: var(--color-text);
}

/* — focalisation —
   Les lignes que le palier retient gardent leur pleine lisibilité et prennent un
   liseré ; les autres reculent sans sortir du tableau. On éteint le voisinage
   plutôt que de le retirer : le relevé reste complet, et l'on continue de voir
   sur quoi la focalisation se détache. */
.list.is-focused .cell-area,
.list.is-focused .cell-required,
.list.is-focused .cell-level,
.list.is-focused .cell-dimension {
  opacity: 0.4;
}

.list.is-focused .is-lit .cell-area,
.list.is-focused .is-lit .cell-required,
.list.is-focused .is-lit .cell-level,
.list.is-focused .is-lit .cell-dimension {
  opacity: 1;
}

.list.is-focused .is-lit .cell-area {
  font-weight: 700;
  box-shadow: inset 3px 0 0 var(--color-text);
}
</style>

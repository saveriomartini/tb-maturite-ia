<template>
  <div class="ladder">
    <div class="chart" role="group" aria-label="Échelle de transformation, du degré d’exploitation localisée à la redéfinition du périmètre">
      <div class="chart__yaxis" aria-hidden="true">
        <span class="chart__mark">Élevé</span>
        <span class="chart__title chart__title--y">Degré de transformation</span>
        <span class="chart__mark">Faible</span>
      </div>

      <div class="chart__plot">
        <p class="chart__rule" :style="{ bottom: `${RULE_BOTTOM}%` }" aria-hidden="true" />
        <p class="chart__zone chart__zone--evo" :style="{ bottom: `${RULE_BOTTOM - 6}%` }">Évolutif</p>
        <p class="chart__zone chart__zone--revo" :style="{ bottom: `${RULE_BOTTOM + 3}%` }">Révolutionnaire</p>

        <div
          v-for="step in steps"
          :key="step.n"
          class="box"
          :class="{
            'is-reached': step.reached,
            'is-acquired': step.acquired,
            'is-upcoming': step.upcoming,
            'is-beyond': step.beyondTarget
          }"
          :style="boxStyle(step)"
        >
          <span class="box__fill" :style="fill(step)" aria-hidden="true" />

          <span class="box__body">
            <span class="box__mark" aria-hidden="true">{{ step.n }}</span>
            <span class="box__head">
              <span class="box__label heading">{{ step.label }}</span>
              <span class="box__tags">
                <span v-if="step.acquired" class="tag tag--solid">diagnostic</span>
                <span v-if="step.isTarget" class="tag">cible</span>
              </span>
            </span>
          </span>
        </div>
      </div>

      <div class="chart__xaxis" aria-hidden="true">
        <span class="chart__mark">Faible</span>
        <span class="chart__title">Éventail des bénéfices potentiels</span>
        <span class="chart__mark">Élevé</span>
      </div>
    </div>

    <p class="chart__source">
      Adapté de Venkatraman, N. (1994). IT-enabled business transformation: From automation to
      business scope redefinition. <em>Sloan Management Review, 35</em>(2), 73–87 ; et de
      Ozkaya, I., Carleton, A., Echeverría, S., Edman, R., Haller, J., Harper, E., Konrad, M. D.,
      Smith, C. J., &amp; Wray, S. (2026). <em>The AI adoption maturity model v1.0.</em> Software
      Engineering Institute, Carnegie Mellon University.
    </p>

    <ol class="ladder__steps">
      <li
        v-for="step in steps"
        :key="step.n"
        class="step"
        :class="{
          'is-reached': step.reached,
          'is-acquired': step.acquired,
          'is-upcoming': step.upcoming,
          'is-beyond': step.beyondTarget
        }"
      >
        <p v-if="step.opensLine" class="rule">
          <span class="rule__label">{{ lineLabel }}</span>
        </p>

        <div class="step__row">
          <span class="step__fill" :style="fill(step)" aria-hidden="true" />

          <span class="step__body">
            <span class="step__mark" aria-hidden="true">{{ step.n }}</span>
            <span class="step__head">
              <span class="step__label heading">{{ step.label }}</span>
              <span class="step__tags">
                <span v-if="step.acquired" class="tag tag--solid">diagnostic</span>
                <span v-if="step.isTarget" class="tag">cible</span>
              </span>
            </span>
          </span>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup>
// L'échelle des cinq paliers du modèle.
//
// Elle vivait dans le gabarit de la synthèse ; elle en sort parce qu'elle a
// longtemps porté un comportement — la focalisation du détail par domaine — et
// non plus seulement une mise en forme. La refonte du 31.08.2026 a retiré ce
// comportement (voir plus bas), mais le composant reste distinct : c'est lui
// qui sait dessiner l'échelle, la page compose seulement ce qui l'entoure.
//
// — deux échelles, un seul modèle —
// Le corps du composant est un diagramme à deux dimensions, sur le patron de la
// figure de Venkatraman (1994) que la fusion du 15.08.2026 a mariée aux cinq
// niveaux d'Ozkaya : les paliers montent de gauche à droite et de bas en haut.
// La légende sous le diagramme nomme la source — voir transformation.js pour la
// nuance avec la règle qui garde Venkatraman hors du reste du parcours.
//
// Les cinq rectangles sont de même taille : la figure source fait grandir ses
// boîtes avec l'éventail des bénéfices, mais rien dans le modèle ne chiffre cet
// éventail pour cet outil-ci, et des tailles inégales sans mesure derrière
// elles ne feraient que suggérer une précision qu'on n'a pas. Seules la
// position — en escalier — et la couleur portent l'information.
//
// Une liste verticale ne peut pas montrer une progression sur deux axes à la
// fois ; le diagramme le peut, au prix de la largeur qu'une colonne étroite ne
// donne pas. En dessous de 900px, cette largeur n'existe plus, et la liste
// reprend la main — c'est la même donnée, seule la forme change avec le point
// de rupture (voir tokens.css, la table des points de rupture).
//
// — ce que chaque palier montre, sous les deux formes —
// Le rang, le nom du palier, et son état. Le nom du palier et son état
// (diagnostic / cible) tiennent la même ligne, l'état à droite : la lecture va
// du plus général — quel palier — au plus spécifique — ce qu'il est pour cette
// session.
//
// La liste ne retient plus que deux états, depuis le 31.08.2026 : « diagnostic »
// marque le palier atteint, « cible » le palier visé. « Suivant » — le premier
// palier non tenu — s'est retiré du texte affiché : il redisait le contraste de
// couleur que porte déjà `.is-upcoming`, un rectangle en retrait sans join
// avoir besoin d'un mot pour le dire.
//
// — le remplissage —
// Chaque cran se remplit à la proportion de `gateProgress` : combien des
// domaines que le palier attend l'atteignent. Le remplissage ne dit pas une
// acquisition partielle et il ne peut pas en dire une — l'acquisition est un
// seuil, un palier dont tous les domaines sauf un sont au rang n'est pas
// acquis. La couleur porte ce seuil, pas la longueur — deux trames plutôt
// qu'un dégradé, pour qu'un rectangle aux quatre cinquièmes ne se lise pas
// comme « presque acquis ». Le commentaire qui le disait en toutes lettres
// sous le diagramme est parti le 31.08.2026 : voir useMaturityTool.js, à
// l'endroit qui portait `LADDER_NOTE`, pour ce qui a motivé son retrait.
//
// — la ligne évolutif / révolutionnaire —
// Continue d'un bord à l'autre du diagramme : elle ne porte plus d'étiquette en
// son milieu, qui la coupait visuellement pour se découper sur la trame d'un
// rectangle. Les deux mots qu'elle sépare vivent maintenant chacun dans la zone
// qu'il nomme — « Évolutif » sous la ligne, « Révolutionnaire » au-dessus —,
// casés dans l'espace que les rectangles laissent libre plutôt que sur la ligne
// elle-même.
//
// — ce qui a disparu le 31.08.2026 —
// Le clic qui focalisait le détail par domaine sur ce que retient un palier.
// Il ne survivait plus qu'à une des deux formes une fois le diagramme en place
// — un diagramme à deux dimensions ne s'y prêtait pas —, et le garder sur l'une
// sans l'autre aurait donné deux comportements à la même donnée. La fonction
// disparaît des deux ; le tableau plus bas reste consultable normalement, sans
// filtre déclenché depuis ici.
defineProps({
  steps: { type: Array, required: true },
  lineLabel: { type: String, required: true }
})

// La largeur du remplissage. Elle ne peut pas dépasser 100 % : `gateProgress`
// compte les domaines atteints parmi les domaines attendus, et le premier
// ensemble est inclus dans le second. Un palier sans domaine attendu en
// périmètre ne se remplit pas — il n'y a pas de rapport à former, et 0/0 se
// serait affiché comme un palier vide plutôt que comme un palier sans objet.
function fill(step) {
  const { done, expected } = step.progress
  if (!expected) return { width: '0%' }
  return { width: `${Math.min(100, (done / expected) * 100)}%` }
}

// Position de chaque rectangle, en pourcentage du cadre : même taille pour les
// cinq, décalée en diagonale — plus haut et plus à droite à chaque palier.
// Câblée en dur : ce n'est pas une mise à l'échelle générique, c'est la lecture
// d'une figure à cinq points fixes.
const CHART_LAYOUT = {
  1: { left: 2, bottom: 2 },
  2: { left: 17, bottom: 21 },
  3: { left: 32, bottom: 40 },
  4: { left: 47, bottom: 59 },
  5: { left: 62, bottom: 78 }
}
const BOX_WIDTH = 33
const BOX_HEIGHT = 15

// Entre le haut du rectangle du palier 2 (21 + 15) et le bas de celui du
// palier 3 (40) : la ligne passe dans l'espace qui les sépare, comme dans la
// figure source.
const RULE_BOTTOM = 38

function boxStyle(step) {
  const box = CHART_LAYOUT[step.n]
  return {
    left: `${box.left}%`,
    width: `${BOX_WIDTH}%`,
    bottom: `${box.bottom}%`,
    height: `${BOX_HEIGHT}%`
  }
}
</script>

<style scoped>
/* — le diagramme — */
.chart {
  display: grid;
  grid-template-columns: 30px 1fr;
  grid-template-areas: 'yaxis plot' '. xaxis';
  gap: 8px 10px;
}

.chart__yaxis,
.chart__xaxis {
  display: flex;
  align-items: center;
  color: var(--color-neutral-700);
}

.chart__yaxis {
  grid-area: yaxis;
  flex-direction: column;
  justify-content: space-between;
}

.chart__xaxis {
  grid-area: xaxis;
  justify-content: space-between;
  padding: 0 4px;
}

.chart__mark {
  font-size: 9.5px;
  letter-spacing: 0.02em;
}

.chart__title {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--color-neutral-800);
}

/* Le tour de passe-passe habituel pour un intitulé d'axe vertical : le mode
   d'écriture met les lettres sur le côté, la rotation les remet dans le sens
   de lecture, de bas en haut. */
.chart__title--y {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  white-space: nowrap;
}

.chart__plot {
  grid-area: plot;
  position: relative;
  aspect-ratio: 2.15;
  border: 2px solid var(--color-text);
  background: var(--color-neutral-100);
}

/* La ligne évolutif / révolutionnaire : continue d'un bord à l'autre, sans
   étiquette qui viendrait la couper. Ce qu'elle sépare se lit dans les deux
   zones qu'elle borne, pas sur elle. */
.chart__rule {
  position: absolute;
  right: 0;
  left: 0;
  margin: 0;
  border-top: 2px dashed var(--color-text);
}

/* Les deux mots que la ligne sépare, casés dans l'espace que les rectangles
   laissent libre, au plus près de la ligne : « Évolutif » juste en dessous, à
   gauche, où le rectangle du palier 2 (il commence à 17 %) laisse le bord
   libre ; « Révolutionnaire » juste au-dessus, à droite, où celui du palier 3
   (il s'arrête à 65 %) laisse l'autre bord libre. Le sens de lecture va ainsi
   du degré le plus proche de la ligne vers le bord qu'il touche le moins. */
.chart__zone {
  position: absolute;
  z-index: 1;
  margin: 0;
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-neutral-700);
  white-space: nowrap;
}

.chart__zone--evo {
  left: 10px;
}

.chart__zone--revo {
  right: 10px;
}

/* Le rectangle d'un palier : sa position vient de `CHART_LAYOUT`, en style
   inline — c'est une lecture de figure, pas une propriété qu'une classe CSS
   pourrait porter. Statique : il n'est plus la cible d'un clic depuis le
   31.08.2026. */
.box {
  position: absolute;
  padding: 10px 14px;
  border: 2px solid var(--color-text);
  background: var(--color-neutral-100);
  overflow: hidden;
}

/* Même logique de remplissage que la liste : deux trames, pas une jauge
   continue, pour qu'un palier presque tenu ne se lise pas comme acquis. */
.box__fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background: var(--color-neutral-200);
}

.box.is-reached .box__fill {
  background: var(--color-neutral-300);
}

.box__body {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
}

.box__mark {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 27px;
  height: 27px;
  border: 2px solid var(--color-text);
  background: var(--color-neutral-100);
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
}

.box.is-reached .box__mark {
  background: var(--color-text);
  color: #fff;
}

/* Le nom du palier et son état tiennent la même ligne, l'état à droite : la
   lecture va du plus général — quel palier — au plus spécifique — ce qu'il est
   pour cette session.
   Le nom et l'état tiennent la même ligne sans jamais se replier l'un sous
   l'autre : `nowrap` plutôt que `wrap`, faute de quoi un nom un peu long
   repoussait l'étiquette à la ligne suivante, sous le titre au lieu d'à sa
   droite — exactement ce que cette disposition doit éviter. C'est le nom qui
   cède la place, par une troncature, jamais l'étiquette d'état. */
.box__head {
  display: flex;
  flex-wrap: nowrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
}

.box__label {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14.5px;
  line-height: 1.25;
}

.box__tags {
  flex: none;
  display: flex;
  gap: 4px;
}

.box__tags .tag {
  padding: 2px 5px;
  font-size: 9px;
  border-color: var(--color-text);
}

.box.is-upcoming .box__label {
  color: var(--color-neutral-700);
}

.box.is-beyond {
  opacity: 0.5;
}

/* — la liste, en dessous de 900px — */
.ladder__steps {
  margin: 0;
  padding: 0;
  list-style: none;
}

.step {
  position: relative;
}

.step:not(:last-child) {
  border-bottom: 1px solid var(--color-divider);
}

.step__row {
  position: relative;
  padding: 12px 16px;
}

/* — le remplissage —
   Peint sous le contenu, du bord gauche, à la proportion de gateProgress. Deux
   trames et non une : un palier tenu est plus soutenu qu'un palier en cours, si
   bien que le seuil — qui est ce que l'échelle mesure vraiment — se lit à la
   couleur, là où la longueur ne dirait que la distance parcourue. */
.step__fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background: var(--color-neutral-200);
}

.step.is-reached .step__fill {
  background: var(--color-neutral-300);
}

.step__body {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Le repère de rang : un carré plein sur les paliers tenus, vide sinon. Il donne
   à l'échelle son fil vertical et rend le seuil lisible d'un coup d'œil. */
.step__mark {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 2px solid var(--color-text);
  background: var(--color-neutral-100);
  font-family: var(--font-heading);
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
}

.step.is-reached .step__mark {
  background: var(--color-text);
  color: #fff;
}

/* Le nom du palier et son état sur une même ligne, l'état à droite — même
   principe que dans le diagramme. */
.step__head {
  flex: 1 1 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 6px 10px;
  min-width: 0;
}

.step__label {
  font-size: 15px;
}

.step__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.step__tags .tag {
  padding: 2px 6px;
  border-color: var(--color-text);
}

/* Les paliers encore lointains reculent d'un cran : ils supposent tous que le
   suivant soit franchi, et rien ne s'y décide aujourd'hui. */
.step.is-upcoming .step__label {
  color: var(--color-neutral-700);
}

/* Au-dessus de la cible *et* du palier atteint : hors sujet pour cette session,
   sans disparaître. */
.step.is-beyond {
  opacity: 0.45;
}

/* — la ligne évolutif / révolutionnaire, dans la liste —
   Elle sépare deux crans plutôt que d'en marquer un : elle se pose donc sur le
   bord supérieur du premier palier révolutionnaire, en débordant de la
   gouttière du cran. Tiretée et plus forte que les filets de séparation
   ordinaires : c'est la seule information de l'échelle qui dise que tous les
   crans ne se valent pas. */
.rule {
  position: absolute;
  z-index: 1;
  top: -1px;
  right: 0;
  left: 0;
  margin: 0;
  border-top: 2px dashed var(--color-text);
}

.rule__label {
  position: absolute;
  top: -7px;
  right: 12px;
  padding: 0 6px;
  background: var(--color-neutral-100);
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text);
  white-space: nowrap;
}

/* L'étiquette se découpe sur la trame du cran qu'elle coiffe, faute de quoi le
   trait passerait au travers de ses lettres. */
.step.is-reached .rule__label {
  background: var(--color-neutral-300);
}

/* La source de la figure, sous le diagramme seulement : c'est une reproduction
   directe de Venkatraman (1994), et une figure reprise porte sa source en
   légende, en forme de référence complète (APA 7) et non d'un simple rappel
   d'auteur et d'année — voir transformation.js pour la nuance avec la règle
   qui garde ce nom hors du reste du parcours.

   Les deux références, vérifiées le 31.08.2026 auprès des éditeurs (le
   Venkatraman ne change pas ; le Ozkaya, daté de 2026, n'était pas dans les
   données d'entraînement et a été confirmé sur sei.cmu.edu) :
   — Venkatraman, N. (1994). IT-enabled business transformation: From
     automation to business scope redefinition. Sloan Management Review,
     35(2), 73–87.
   — Ozkaya, I., Carleton, A., Echeverría, S., Edman, R., Haller, J.,
     Harper, E., Konrad, M. D., Smith, C. J., & Wray, S. (2026). The AI
     adoption maturity model v1.0. Software Engineering Institute, Carnegie
     Mellon University. https://www.sei.cmu.edu/library/ai-adoption-maturity-model/

   Le second corrige au passage la liste des auteurs : la source ne porte
   qu'un seul auteur nommé ici jusqu'ici (« Ozkaya, I. et al. »), forme correcte
   en citation dans le texte mais pas en entrée de bibliographie — le rapport
   n'a que neuf auteurs, sous le seuil des vingt à partir duquel l'APA 7
   autorise l'abréviation même en bibliographie. attribution.js garde
   volontairement la forme courte, faite pour un pied de page plutôt que pour
   une légende de figure. */
.chart__source {
  margin: 8px 0 0;
  font-size: 9.5px;
  line-height: 1.5;
  font-style: italic;
  color: var(--color-neutral-600);
}

/* — le point de rupture —
   Le diagramme a besoin de largeur pour que ses cinq rectangles restent
   lisibles ; la liste n'en a pas besoin, elle est faite pour l'étroit. Les deux
   marquages existent dans le DOM en permanence, mais un seul est affiché à la
   fois — `display: none` retire l'autre de l'arbre d'accessibilité, si bien
   qu'aucune information n'est jamais annoncée deux fois. Le seuil est celui de
   la table des points de rupture (tokens.css) : 900px partout ailleurs dans le
   parcours signifie « tout ce qui est côte à côte s'empile », et c'est
   exactement ce que la liste fait déjà. La légende de source suit le
   diagramme : elle se cache et reparaît avec lui. */
.ladder__steps {
  display: block;
}

.chart,
.chart__source {
  display: none;
}

@media (min-width: 900px) {
  .ladder__steps {
    display: none;
  }

  .chart {
    display: grid;
  }

  .chart__source {
    display: block;
  }
}
</style>

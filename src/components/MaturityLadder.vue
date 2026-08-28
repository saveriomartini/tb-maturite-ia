<template>
  <div class="ladder">
    <ol class="ladder__steps">
      <li
        v-for="step in steps"
        :key="step.n"
        class="step"
        :class="{
          'is-reached': step.reached,
          'is-acquired': step.acquired,
          'is-next': step.next,
          'is-upcoming': step.upcoming,
          'is-beyond': step.beyondTarget,
          'is-focused': step.n === focused
        }"
      >
        <p v-if="step.opensLine" class="rule">
          <span class="rule__label">{{ lineLabel }}</span>
        </p>

        <button
          type="button"
          class="button-reset step__button"
          :disabled="!step.focusLabel"
          :aria-pressed="step.n === focused"
          :title="step.focusLabel || 'Aucun domaine renseigné ne retient ce palier'"
          @click="emit('focus', step.n === focused ? null : step.n)"
        >
          <span class="step__fill" :style="fill(step)" aria-hidden="true" />

          <span class="step__body">
            <span class="step__mark" aria-hidden="true">{{ step.n }}</span>
            <span class="step__label heading">{{ step.label }}</span>
            <span class="step__tags">
              <span v-if="step.acquired" class="tag tag--solid">diagnostic</span>
              <span v-if="step.next" class="tag step__tag">suivant</span>
              <span v-if="step.isTarget" class="tag">cible</span>
            </span>
            <span class="step__progress">
              {{ step.progressLabel }}<template v-if="step.shortfall"> · {{ step.shortfall }}</template>
            </span>
          </span>
        </button>
      </li>
    </ol>

    <p class="ladder__note">{{ note }}</p>
  </div>
</template>

<script setup>
// L'échelle des cinq paliers du modèle.
//
// Elle vivait dans le gabarit de la synthèse ; elle en sort parce qu'elle porte
// désormais un comportement — la focalisation — et non plus seulement une mise
// en forme. Un écran qui compose deux vues n'a pas à connaître le détail de
// l'une d'elles.
//
// — ce que chaque cran montre —
// Le rang, le nom du palier, son état, et son avancement. Quatre états, et ils
// ne se recouvrent pas : « diagnostic » marque le palier atteint, « suivant » le
// premier qui ne l'est pas — le seul dont il y ait quelque chose à dire tout de
// suite —, « cible » le palier visé quand la portée a été déclarée, et les
// derniers crans restent à venir. Un palier au-dessus de la cible *et* du palier
// atteint est mis en retrait, jamais retiré : l'échelle garde ses cinq crans, le
// modèle ne rétrécit pas.
//
// — le remplissage —
// Chaque cran se remplit à la proportion de `gateProgress` : combien des
// domaines que le palier attend l'atteignent. Le remplissage ne dit pas une
// acquisition partielle et il ne peut pas en dire une — l'acquisition est un
// seuil, un palier dont tous les domaines sauf un sont au rang n'est pas acquis.
// Deux choses le rappellent à l'écran, parce qu'une barre aux quatre cinquièmes
// se lit spontanément comme « presque acquis » : la trame d'un palier tenu est
// plus soutenue que celle d'un palier en cours, si bien que le seuil se voit à
// la couleur et non à la longueur ; et la note sous la colonne le dit en toutes
// lettres. Voir docs/logs/BACKLOG.md, ligne 3.5.
//
// — la focalisation —
// Cliquer un palier focalise le détail par domaine sur ce qui le retient. Seuls
// les domaines *renseignés* y entrent : un domaine sans réponse retient bel et
// bien le palier, mais le focaliser le ferait lire comme un manque constaté
// alors qu'il est une mesure qui n'a pas eu lieu. Un palier que rien ne retient
// n'est donc pas cliquable, et son infobulle le dit plutôt que de laisser le
// clic sans effet.
//
// Le composant ne retient pas la focalisation : il la remonte et reçoit celle
// qui a été retenue. C'est la page qui compose l'échelle et le détail qui la
// tient — elle seule voit les deux.
defineProps({
  steps: { type: Array, required: true },
  lineLabel: { type: String, required: true },
  note: { type: String, required: true },
  focused: { type: Number, default: null }
})

const emit = defineEmits(['focus'])

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
</script>

<style scoped>
.ladder__steps {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Le cran entier est la cible du clic : viser un nom de palier de treize pixels
   serait une affordance de bureau, et la page se lit aussi sur un portable. */
.step {
  position: relative;
}

.step:not(:last-child) {
  border-bottom: 1px solid var(--color-divider);
}

.step__button {
  display: block;
  position: relative;
  width: 100%;
  padding: 12px 16px;
}

.step__button:disabled {
  cursor: default;
}

.step__button:not(:disabled):hover .step__label {
  text-decoration: underline;
  text-underline-offset: 3px;
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

/* Le contenu passe au-dessus du remplissage. Même grille qu'auparavant : le
   repère de rang tient la première colonne sur les deux lignes, le nom et
   l'avancement se rangent dans la seconde. */
.step__body {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2px 11px;
  align-items: baseline;
}

/* Le repère de rang : un carré plein sur les paliers tenus, vide sinon. Il donne
   à l'échelle son fil vertical et rend le seuil lisible d'un coup d'œil. */
.step__mark {
  grid-row: span 2;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 2px solid var(--color-text);
  background: var(--color-neutral-100);
  font-family: var(--font-heading);
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
}

.step.is-reached .step__mark {
  background: var(--color-text);
  color: #fff;
}

.step__label {
  font-size: 13px;
}

.step__tags {
  display: flex;
  gap: 5px;
  grid-column: 2;
  grid-row: 1;
  justify-self: end;
}

.step__tags .tag {
  padding: 2px 6px;
  border-color: var(--color-text);
}

/* « suivant » est une indication de position, pas un résultat : il se tient un
   cran de gris en dessous de « diagnostic » et de « cible ». */
.step__tag {
  color: var(--color-neutral-700);
  border-color: var(--color-neutral-500);
}

/* L'avancement du palier : en petit, en gris, sur sa propre ligne. Il dit de
   combien il s'en est fallu — jamais où l'on en serait « sur » ce palier, qui
   ne se franchit pas par degrés. */
.step__progress {
  grid-column: 2;
  font-size: 10.5px;
  line-height: 1.4;
  color: var(--color-neutral-700);
}

/* Les paliers encore lointains reculent d'un cran : ils supposent tous que le
   suivant soit franchi, et rien ne s'y décide aujourd'hui. */
.step.is-upcoming .step__label,
.step.is-upcoming .step__progress {
  color: var(--color-neutral-700);
}

/* Au-dessus de la cible *et* du palier atteint : hors sujet pour cette session,
   sans disparaître. */
.step.is-beyond {
  opacity: 0.45;
}

/* Le palier dont on regarde le détail plus bas. Le liseré est du même noir que
   les cadres : c'est une sélection, pas un état de la mesure. */
.step.is-focused {
  box-shadow: inset 4px 0 0 var(--color-text);
}

/* — la ligne évolutif / révolutionnaire —
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

/* Ce que les nombres de l'échelle ne veulent pas dire. La note ferme la
   colonne : sans elle, un cran rempli aux quatre cinquièmes se lit « presque
   acquis ». */
.ladder__note {
  margin: 0;
  padding: 12px 16px 14px;
  border-top: 2px solid var(--color-text);
  font-size: 11px;
  line-height: 1.45;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}
</style>

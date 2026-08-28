<template>
  <div class="summary">
    <header class="verdict">
      <p class="verdict__eyebrow eyebrow">Profil diagnostiqué</p>
      <h1 class="verdict__name heading">{{ vm.acquiredLabel }}</h1>
      <p class="verdict__desc">{{ vm.acquiredDesc }}</p>
      <p v-if="vm.acquiredPosition" class="verdict__position">{{ vm.acquiredPosition }}</p>
    </header>

    <div class="frame">
      <p class="frame__row">
        <span class="frame__label eyebrow">{{ vm.unit.label }}</span>
        <span class="frame__value">{{ vm.unit.value }}</span>
      </p>
      <p v-if="vm.unit.note" class="frame__note">{{ vm.unit.note }}</p>
      <p class="frame__row">
        <span class="frame__label eyebrow">Couverture</span>
        <span class="frame__value">{{ vm.coverage }}</span>
      </p>
    </div>

    <section class="section">
      <h2 class="section-head">L’échelle des paliers</h2>
      <div class="ladder">
        <div class="scale">
          <MaturityLadder
            :steps="vm.ladder"
            :line-label="vm.line.label"
            :note="vm.ladderNote"
            :focused="focusedGate"
            @focus="emit('focus-gate', $event)"
          />
        </div>

        <div class="ladder__body">
          <div class="line">
            <p class="line__eyebrow eyebrow">{{ vm.line.label }}</p>
            <p class="line__text">{{ vm.line.text }}</p>
          </div>

          <div class="target">
            <p class="target__eyebrow eyebrow">
              Profil visé<template v-if="vm.targetState.label"> : {{ vm.targetState.label }}</template>
            </p>
            <p class="target__text">{{ vm.targetState.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="vm.outOfScopeLabel || vm.pendingLabel" class="section">
      <h2 class="section-head">Ce que la mesure laisse de côté</h2>
      <div class="asides">
        <div v-if="vm.outOfScopeLabel" class="aside">
          <p class="aside__eyebrow eyebrow">Domaines déclarés hors périmètre</p>
          <p class="aside__list">{{ vm.outOfScopeLabel }}</p>
        </div>

        <div v-if="vm.pendingLabel" class="aside">
          <p class="aside__eyebrow eyebrow">Domaines restant à évaluer</p>
          <p class="aside__list">{{ vm.pendingLabel }}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-head">Par dimension</h2>
      <div class="panel">
        <DimensionRadar :dimensions="vm.radar.dimensions" :scale="vm.radar.scale" />
      </div>
    </section>

    <section class="section">
      <h2 class="section-head">Par bloc et dimension</h2>
      <div class="blocks">
        <section
          v-for="block in vm.blocks"
          :key="block.id"
          class="block"
          :style="stripe(block.dimensionColors)"
        >
          <h3 class="block__name heading">{{ block.name }}</h3>
          <div class="block__dims">
            <div v-for="dimension in block.dimensions" :key="dimension.id" class="dim">
              <p class="dim__name">{{ dimension.name }}</p>
              <div class="dim__stats">
                <p class="stat">
                  <span class="stat__label">moyenne</span>
                  <span class="stat__figure heading">
                    <span class="stat__done">{{ dimension.average }}</span><span class="stat__total">/{{ dimension.scale }}</span>
                  </span>
                </p>
                <p class="stat">
                  <span class="stat__label">plancher</span>
                  <span class="stat__figure heading">
                    <span class="stat__done">{{ dimension.floor }}</span><span class="stat__total">/{{ dimension.scale }}</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup>
// Synthèse des résultats : le profil atteint, ce sur quoi il porte, l'échelle
// des paliers, ce que la mesure laisse de côté, la lecture par dimension.
// Section haute de la page de résultats — le détail par domaine la suit sans
// changer d'écran, et la navigation appartient à la page.
//
// — la hiérarchie de la page —
// Le verdict d'abord, seul, au plus gros corps du parcours : c'est ce que
// quarante énoncés ont produit, et il ouvrait la page en 22px derrière un
// intitulé « Votre profil : ». Sa description et sa position sur l'échelle de
// transformation le suivent : elles disent ce qu'il veut dire, et vivaient
// jusqu'ici dans la colonne de droite de l'échelle, où elles se lisaient comme
// un commentaire de l'échelle.
//
// Vient ensuite ce qui borne la lecture — l'organisation évaluée, la couverture
// —, en bande serrée et au corps du hors-texte. Ni l'une ni l'autre ne peut
// disparaître : sans elles le verdict se lit comme portant sur l'entreprise
// entière et sur le modèle entier. Mais elles ne sont pas un résultat, et rien
// dans leur traitement ne doit le laisser croire.
//
// Le reste se range en sections coiffées à l'identique. Les domaines hors
// périmètre et ceux restant à évaluer en forment une : ils bornaient la lecture
// de toute la page depuis le bas d'un panneau qui parlait d'autre chose.
//
// Ce que cette page ne décide pas : le profil visé. Il se déclare en phase
// d'ancrage, après cet écran, parce qu'on ne peut pas demander à une
// organisation jusqu'où elle veut aller avant de lui avoir montré où elle est.
// L'échelle ne porte donc la marque « cible » que si la question a déjà été
// répondue — au retour, par exemple. Elle le *dit* alors, plutôt que de laisser
// l'absence de marque parler : une échelle muette sur sa cible se lit comme une
// cible à zéro. Les quatre cas — non déclarée, plus haut, atteinte, sous le
// palier atteint — ont chacun leur phrase, aucun n'est un défaut silencieux.
//
// L'organisation évaluée ouvre la page, avant le profil. Le modèle source évalue
// une organizational unit et non forcément l'entreprise entière : une restitution
// qui ne nomme pas son périmètre se lit comme un verdict sur tout.
//
// La couverture suit immédiatement : combien de domaines ont été situés, combien
// restent à évaluer, combien ont été déclarés hors périmètre. Sans ces trois
// nombres, le profil se lirait comme portant sur le modèle entier.
//
// Chaque palier porte son avancement — combien des domaines qu'il attend
// l'atteignent. Le ratio ne mesure pas une acquisition : celle-ci est un seuil,
// et un palier dont tous les domaines sauf un sont au rang n'est pas « presque
// acquis », il n'est pas acquis. Il dit de combien il s'en est fallu, ce qui est
// une autre information — et il ne peut pas dépasser son total. D'où l'absence
// de jauge : rien sur cette échelle ne se remplit par degrés, le repère de rang
// est plein ou vide, et une note sous la colonne dit ce que les nombres ne
// veulent pas dire.
//
// La ligne évolutif / révolutionnaire se trace entre le deuxième et le troisième
// palier. C'est la seule information de l'échelle qui dise que tous les crans ne
// se valent pas : les deux premiers posent l'IA sur des routines inchangées, les
// trois suivants supposent de refaire les routines. Elle ne dépend d'aucune
// réponse et se trace donc aussi sur une session vierge — c'est une propriété du
// modèle, pas un résultat.
//
// La dimension se lit sur deux nombres qui ne disent pas la même chose : la
// moyenne situe l'ensemble, le plancher dit ce qui la retiendrait si elle était
// un palier. Les deux sont rapportés au haut de l'échelle et jamais au rang
// visé : c'est de là que venait le « 3,1 / 3 » relevé en test.
//
// La lecture par dimension se donne deux fois, et ce n'est pas une redite : le
// radar et ses barres comparent les neuf dimensions entre elles — ce que la
// grille par bloc ne permet pas, ses dimensions étant réparties dans quatre
// encadrés —, et la grille par bloc garde le regroupement de restitution et les
// chiffres exacts. La figure situe, le tableau chiffre.
import DimensionRadar from '../DimensionRadar.vue'
import MaturityLadder from '../MaturityLadder.vue'

defineProps({
  vm: { type: Object, required: true },
  // Le palier dont le détail par domaine est focalisé plus bas. La synthèse ne
  // le retient pas : c'est la page qui compose l'échelle et le détail qui le
  // tient, elle seule voyant les deux.
  focusedGate: { type: Number, default: null }
})

const emit = defineEmits(['focus-gate'])

// Bande supérieure du bloc : un segment par dimension, à parts égales sur la
// largeur — même principe que le liseré de gauche du tableau de cadrage.
function stripe(colors) {
  const stops = colors
    .map((color, index) => `${color} ${index / colors.length * 100}% ${(index + 1) / colors.length * 100}%`)
    .join(',')
  return { backgroundImage: `linear-gradient(to right, ${stops})` }
}
</script>

<style scoped>
/* — le verdict —
   Ce qu'on lit en premier, et de loin : le nom du profil, en tête de page et au
   corps le plus fort de tout le parcours. Il portait 22px et l'intitulé
   « Votre profil : » à côté de lui, si bien qu'il pesait exactement autant
   qu'un nom de domaine dans le questionnaire. C'est la conclusion de tout le
   parcours de saisie : elle a droit à la première ligne et à la plus grande
   taille.

   La description du profil et sa position sur l'échelle de transformation le
   suivent immédiatement. Elles étaient dans la colonne de droite de l'échelle
   des paliers, où elles se lisaient comme un commentaire de l'échelle ; elles
   disent en réalité ce que le verdict veut dire, et c'est ici qu'elles le
   disent. */
.verdict {
  max-width: 80ch;
}

.verdict__eyebrow {
  margin: 0;
  color: var(--color-neutral-700);
}

.verdict__name {
  margin: 6px 0 0;
  font-size: 38px;
  line-height: 1.08;
}

.verdict__desc {
  margin: 14px 0 0;
  font-size: 14.5px;
  line-height: 1.5;
  text-wrap: pretty;
}

/* la position suit la description comme une seconde voix : même corps, couleur
   légèrement retirée, pour qu'on voie qu'elle ne vient pas de la même source
   sans avoir à le dire */
.verdict__position {
  margin: 12px 0 0;
  font-size: 14.5px;
  line-height: 1.5;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

/* — le cadrage de la lecture —
   L'organisation évaluée et la couverture. Ce n'est pas un résultat : c'est ce
   sur quoi le résultat porte, et ce que la mesure a effectivement couvert. Ce
   sont les deux bornes sans lesquelles le verdict se lirait comme portant sur
   l'entreprise entière et sur le modèle entier — elles ne peuvent donc pas
   disparaître. Elles passent sous le verdict, en bande serrée entre deux
   filets, au corps du hors-texte : présentes, jamais concurrentes. */
.frame {
  margin: 22px 0 0;
  padding: 10px 0;
  border-top: 1px solid var(--color-divider);
  border-bottom: 1px solid var(--color-divider);
}

.frame__row {
  display: flex;
  gap: 6px 14px;
  align-items: baseline;
  flex-wrap: wrap;
  margin: 0;
}

.frame__row + .frame__row {
  margin-top: 5px;
}

/* les deux intitulés tiennent la même colonne : de l'un à l'autre, l'œil ne
   revient pas chercher où commence la valeur */
.frame__label {
  flex: none;
  min-width: 190px;
  color: var(--color-neutral-700);
}

.frame__value {
  font-size: 12px;
  color: var(--color-neutral-800);
}

/* Le périmètre non déclaré est le seul cas commenté : la note dit la lecture
   par défaut, et reste dans le registre du hors-texte — corps réduit, gris. */
.frame__note {
  margin: 5px 0 0;
  padding-left: 190px;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

/* Les sections de la page, toutes coiffées par .section-head : l'échelle des
   paliers, ce que la mesure laisse de côté, la lecture par dimension — puis le
   détail par domaine, sur la page qui compose celle-ci. */
.section {
  margin-top: 34px;
}

.ladder {
  display: grid;
  grid-template-columns: 380px 1fr;
  border: 2px solid var(--color-text);
}

/* Le fond de la colonne est explicite : l'étiquette de la ligne évolutif /
   révolutionnaire s'y découpe en masquant le trait derrière elle, et un fond
   hérité ne lui donnerait rien à masquer. Tout ce qui se passe à l'intérieur
   appartient à MaturityLadder. */
.scale {
  background: var(--color-neutral-100);
  border-right: 2px solid var(--color-text);
}

.ladder__body {
  max-width: 760px;
  padding: 20px 24px;
  background: var(--color-neutral-100);
}

.ladder__desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  text-wrap: pretty;
}

/* le positionnement suit la description AIMM comme une seconde voix : même
   corps, couleur légèrement retirée, pour qu'on voie qu'il ne vient pas de la
   même source sans avoir à le dire */
.ladder__position {
  margin-top: 12px;
  color: var(--color-neutral-700);
}

/* La ligne, en toutes lettres. Elle se lit à côté de l'échelle qui la trace :
   le trait dit où elle passe, ce bloc dit pourquoi elle y passe. Encadrée à
   gauche comme la nature du passage à l'ancrage — même registre, celui d'un
   texte qui peut modifier une décision d'investissement. */
.line {
  padding-left: 12px;
  border-left: 2px solid var(--color-text);
}

.line__eyebrow {
  margin: 0 0 5px;
  color: var(--color-neutral-700);
}

.line__text {
  max-width: 80ch;
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  text-wrap: pretty;
}

/* Où en est la cible sur cette échelle — y compris quand il n'y en a pas
   encore. Le cas se dit toujours : une échelle sans marque de cible et sans
   phrase se lirait comme une cible à zéro. */
.target {
  margin-top: 16px;
}

.target__eyebrow {
  margin: 0 0 5px;
  color: var(--color-neutral-700);
}

.target__text {
  max-width: 80ch;
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

/* Ce que la mesure laisse de côté. Ces deux listes finissaient la colonne de
   droite de l'échelle, où elles closaient un panneau qui parlait d'autre chose.
   Elles ont leur propre section : elles bornent la lecture de toute la page, pas
   de l'échelle seule. En retrait de corps et sans cadre plein — c'est la limite
   d'un résultat, ce n'en est pas un. */
.asides {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}

.aside {
  min-width: 0;
  padding-left: 12px;
  border-left: 3px solid var(--color-neutral-300);
}

.aside__eyebrow {
  margin: 0 0 5px;
  color: var(--color-neutral-700);
}

.aside__list {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

.blocks {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 2px solid var(--color-text);
}

/* la bande de dimensions est peinte dans le bord supérieur transparent :
   background-origin la fait déborder sous la bordure, background-size lui
   donne exactement son épaisseur */
.block {
  padding: 16px 18px 18px;
  border-top: 5px solid transparent;
  border-right: 2px solid var(--color-text);
  background-color: var(--color-neutral-100);
  background-origin: border-box;
  background-repeat: no-repeat;
  background-size: 100% 5px;
  background-position: left top;
}

.block:last-child {
  border-right: 0;
}

.block__name {
  margin: 0;
  font-size: 15px;
  letter-spacing: normal;
}

.block__dims {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 14px;
}

.dim__name {
  margin: 0;
  font-size: 10.5px;
  font-weight: 700;
  line-height: 1.3;
  text-wrap: pretty;
}

.dim__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  margin-top: 4px;
}

.stat {
  display: flex;
  gap: 6px;
  align-items: baseline;
  margin: 0;
}

.stat__label {
  font-size: 10px;
  color: var(--color-neutral-700);
}

/* le rapport se lit en deux temps : le nombre atteint est le résultat et porte
   la lecture, le total ne fait que lui donner son échelle. Moitié moins haut et
   en gris, il dit « sur combien » sans disputer la place au chiffre qui compte.
   Insécable : « 3 » et « /5 » ne se séparent jamais en fin de ligne. */
.stat__figure {
  margin: 0;
  letter-spacing: normal;
  white-space: nowrap;
}

.stat__done {
  font-size: 18px;
}

.stat__total {
  font-size: 11px;
  color: var(--color-neutral-700);
}

@media (max-width: 1200px) {
  .blocks {
    grid-template-columns: 1fr 1fr;
  }

  .block:nth-child(2n) {
    border-right: 0;
  }

  .block:nth-child(-n + 2) {
    border-bottom: 2px solid var(--color-text);
  }
}

@media (max-width: 900px) {
  .verdict__name {
    font-size: 30px;
  }

  /* Empilés, les intitulés du cadrage n'ont plus de colonne commune à tenir :
     la valeur passe sous son intitulé, et la note reprend le bord de la page. */
  .frame__label {
    min-width: 0;
  }

  .frame__note {
    padding-left: 0;
  }

  .ladder,
  .asides,
  .blocks {
    grid-template-columns: 1fr;
  }

  .scale {
    border-right: 0;
    border-bottom: 2px solid var(--color-text);
  }

  .block {
    border-right: 0;
  }

  .block:not(:last-child) {
    border-bottom: 2px solid var(--color-text);
  }
}
</style>

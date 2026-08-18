<template>
  <div class="summary">
    <div class="unit">
      <p class="unit__line">
        <span class="unit__label eyebrow">{{ vm.unit.label }}</span>
        <span class="unit__value">{{ vm.unit.value }}</span>
      </p>
      <p v-if="vm.unit.note" class="unit__note">{{ vm.unit.note }}</p>
    </div>

    <div class="headline">
      <p class="headline__label">Votre profil :</p>
      <p class="headline__value heading">{{ vm.acquiredLabel }}</p>
    </div>

    <div class="ladder">
      <ol class="ladder__levels">
        <li
          v-for="level in vm.ladder"
          :key="level.n"
          class="ladder__level"
          :class="{ 'is-reached': level.reached, 'is-beyond': level.beyondTarget }"
        >
          <span class="ladder__label heading">{{ level.label }}</span>
          <span v-if="level.acquired" class="tag tag--solid ladder__tag">diagnostic</span>
          <span v-else-if="level.isTarget" class="tag ladder__tag">cible</span>
        </li>
      </ol>
      <div class="ladder__body">
        <p class="ladder__desc">{{ vm.acquiredDesc }}</p>
        <p v-if="vm.acquiredPosition" class="ladder__desc ladder__position">
          {{ vm.acquiredPosition }}
        </p>

        <div class="gap">
          <p class="gap__eyebrow eyebrow">{{ vm.gap.eyebrow }}</p>
          <p class="gap__text">{{ vm.gap.passage }}</p>
          <p class="gap__text gap__domains">{{ vm.gap.domains }}</p>
        </div>
      </div>
    </div>

    <p class="section-title">Par bloc :</p>

    <div class="blocks">
      <section
        v-for="block in vm.blocks"
        :key="block.id"
        class="block"
        :style="stripe(block.dimensionColors)"
      >
        <h2 class="block__name heading">{{ block.name }}</h2>
        <div class="block__stats">
          <div class="stat">
            <p class="stat__label">Domaines :</p>
            <p class="stat__figure heading"><span class="stat__done">{{ block.areas.done }}</span><span class="stat__total">/{{ block.areas.total }}</span></p>
          </div>
          <div class="stat">
            <p class="stat__label">Critères :</p>
            <p class="stat__figure heading"><span class="stat__done">{{ block.goals.done }}</span><span class="stat__total">/{{ block.goals.total }}</span></p>
          </div>
          <div class="stat">
            <p class="stat__label">Indicateurs :</p>
            <p class="stat__figure heading"><span class="stat__done">{{ block.indicators.done }}</span><span v-if="block.indicators.total" class="stat__total">/{{ block.indicators.total }}</span></p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// Synthèse des résultats : profil atteint, escalier des profils, écart avec le
// profil visé, avancement par bloc. Section haute de la page de résultats — le
// détail par area la suit sans changer d'écran, et la navigation appartient à
// la page.
//
// L'unité évaluée ouvre la page, avant le profil. Le modèle source évalue une
// organizational unit et non forcément l'entreprise entière : une restitution
// qui ne nomme pas son périmètre se lit comme un verdict sur tout. Déclarée,
// elle se nomme sans commentaire — la conséquence de lecture se tire d'elle-
// même ; non déclarée, elle dit la lecture par défaut, seul cas où le silence
// tromperait.
//
// L'escalier situe, il n'explique pas : il montre deux étiquettes sur une
// échelle sans dire ce qui les sépare. Le texte d'écart le dit et nomme les
// areas qui retiennent le rang suivant — c'est la seule chose de cette page sur
// laquelle on puisse agir dès demain.
//
// Le bloc se lit sur trois chiffres, du plus haut au plus fin : les areas
// acquises — c'est sur cette unité, et elle seule, que se joue le profil —, les
// objectifs validés qui les composent, et le rang moyen des indicateurs de
// maturité rapporté au rang du profil visé, qui dit comment c'est tenu.
//
// Trois chiffres et rien d'autre : la barre de progression a été retirée avec
// l'unité qui la portait. Elle mesurait des pratiques validées sur pratiques
// attendues, c'est-à-dire un ratio agrégé — la seule chose de cette page qui
// laissait croire à une progression continue, quand l'acquisition d'un domaine
// est un seuil qu'on franchit ou non. La convertir en objectifs n'aurait
// changé que son unité.
//
// Les trois se lisent « atteint sur total ». Le total n'est pas un résultat :
// il donne son échelle au nombre qui en est un, et l'affichage le dit — le
// chiffre atteint porte la taille, le total suit en petit.
defineProps({
  vm: { type: Object, required: true }
})

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
/* L'unité évaluée précède le profil et se tient au-dessus de lui : même
   alignement à gauche, un cran de gris en dessous. Elle cadre la page sans lui
   disputer la première lecture — ce n'est pas un résultat, c'est ce sur quoi
   les résultats portent. */
.unit {
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-divider);
}

.unit__line {
  display: flex;
  gap: 10px;
  align-items: baseline;
  flex-wrap: wrap;
  margin: 0;
}

.unit__label {
  color: var(--color-neutral-700);
}

.unit__value {
  font-size: 13px;
  font-weight: 700;
}

/* Le périmètre non déclaré est le seul cas commenté : la note dit la lecture
   par défaut, et reste dans le registre du hors-texte — corps réduit, gris. */
.unit__note {
  margin: 5px 0 0;
  font-size: 12px;
  line-height: 1.45;
  color: var(--color-neutral-700);
}

/* une seule ligne : l'intitulé cale à gauche, le profil diagnostiqué à droite,
   sur la même ligne de base */
.headline {
  display: flex;
  gap: 20px;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
}

.headline__label {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text);
}

.headline__value {
  margin: 0;
  font-size: 22px;
  letter-spacing: normal;
}

.ladder {
  display: grid;
  grid-template-columns: 340px 1fr;
  margin-top: 26px;
  border: 2px solid var(--color-text);
}

.ladder__levels {
  margin: 0;
  padding: 0;
  list-style: none;
  border-right: 2px solid var(--color-text);
}

.ladder__level {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
}

.ladder__level:not(:last-child) {
  border-bottom: 1px solid var(--color-divider);
}

.ladder__level.is-reached {
  background: var(--color-neutral-200);
}

.ladder__level.is-beyond {
  opacity: 0.45;
}

.ladder__label {
  font-size: 13px;
}

.ladder__tag {
  margin-left: auto;
  padding: 2px 6px;
  border-color: var(--color-text);
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

/* L'écart suit la description du profil atteint, séparé par un filet et non par
   un second panneau : les deux textes sont du même registre et se lisent à la
   suite — l'un décrit la situation, l'autre le chemin qui reste. Les encadrer
   séparément en ferait deux informations concurrentes. */
.gap {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid var(--color-divider);
}

.gap__eyebrow {
  margin: 0 0 6px;
}

.gap__text {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  text-wrap: pretty;
}

/* Deux paragraphes de registres différents : le premier dit la nature du
   passage, le second ce par quoi le commencer. Le second est le seul de la page
   sur lequel on puisse agir dès demain — il se détache donc, sans changer de
   corps ni de couleur, par le seul filet vertical qui le tient. */
.gap__domains {
  margin-top: 12px;
  padding-left: 12px;
  border-left: 2px solid var(--color-text);
}

/* le positionnement suit la description AIMM comme une seconde voix : même
   corps, couleur légèrement retirée, pour qu'on voie qu'il ne vient pas de la
   même source sans avoir à le dire */
.ladder__position {
  margin-top: 12px;
  color: var(--color-neutral-700);
}

.section-title {
  margin: 26px 0 10px;
  font-size: 11px;
  font-weight: 700;
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

/* trois compteurs sur une ligne, qui passent à la ligne plutôt que de se
   comprimer quand le bloc se rétrécit */
.block__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 20px;
  margin-top: 16px;
}

.stat__label {
  margin: 0;
  font-size: 10.5px;
  color: var(--color-neutral-700);
}

/* le rapport se lit en deux temps : le nombre atteint est le résultat et porte
   la lecture, le total ne fait que lui donner son échelle. Moitié moins haut et
   en gris, il dit « sur combien » sans disputer la place au chiffre qui compte.
   Insécable : « 3 » et « /7 » ne se séparent jamais en fin de ligne. */
.stat__figure {
  margin: 0;
  letter-spacing: normal;
  white-space: nowrap;
}

.stat__done {
  font-size: 24px;
}

.stat__total {
  font-size: 13px;
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
  .ladder,
  .blocks {
    grid-template-columns: 1fr;
  }

  .ladder__levels {
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

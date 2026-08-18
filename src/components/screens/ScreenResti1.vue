<template>
  <div class="summary">
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
      <p class="ladder__desc">{{ vm.acquiredDesc }}</p>
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
        <div
          class="block__track"
          role="progressbar"
          :aria-valuenow="block.percent"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`Avancement — ${block.name}`"
        >
          <div class="block__bar" :style="{ width: `${block.percent}%` }" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// Synthèse des résultats : profil atteint, escalier des profils, avancement par
// bloc. Section haute de la page de résultats — le détail par area la suit sans
// changer d'écran, et la navigation appartient à la page.
//
// Le bloc se lit sur trois chiffres, du plus haut au plus fin : les areas
// acquises — c'est sur cette unité, et elle seule, que se joue le profil —, les
// objectifs validés qui les composent, et le rang moyen des indicateurs de
// maturité rapporté au rang du profil visé, qui dit comment c'est tenu. Le
// compteur de pratiques a quitté cette synthèse — l'objectif valide toutes ses
// pratiques d'un coup, le chiffre ne faisait plus que répéter celui des
// objectifs à une échelle près. La barre, elle, les suit toujours : c'est la
// mesure la plus fine du bloc, mais elle en donne la longueur sans la nommer.
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

.ladder__desc {
  max-width: 760px;
  margin: 0;
  padding: 20px 24px;
  background: var(--color-neutral-100);
  font-size: 14px;
  line-height: 1.5;
  text-wrap: pretty;
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

.block__track {
  height: 6px;
  margin-top: 14px;
  background: var(--color-neutral-300);
}

.block__bar {
  height: 100%;
  background: var(--color-text);
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

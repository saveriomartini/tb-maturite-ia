<template>
  <aside class="band" aria-label="Remplissage des cinq profils d’adoption">
    <h2 class="band__title">{{ vm.title }}</h2>

    <ol class="band__list">
      <li
        v-for="bar in vm.bars"
        :key="bar.n"
        class="bar"
        :class="{ 'is-acquired': bar.acquired }"
      >
        <p class="bar__head">
          <span class="bar__label heading">{{ bar.label }}</span>
          <span v-if="bar.acquired" class="tag tag--solid bar__tag">acquis</span>
        </p>
        <span class="bar__track" aria-hidden="true">
          <span class="bar__fill" :style="{ width: fillWidth(bar) }" />
        </span>
        <p class="bar__count">{{ bar.count }}</p>
      </li>
    </ol>

    <p v-if="vm.scopeNote" class="band__scope">{{ vm.scopeNote }}</p>
    <p class="band__note">{{ vm.note }}</p>
  </aside>
</template>

<script setup>
// La bande des cinq profils, collée à droite pendant tout le défilement : une
// barre par profil du modèle, qui se remplit au fil des réponses.
//
// — ce que la barre mesure, et ce qu'elle ne mesure pas —
// Elle mesure combien des domaines qu'un palier attend l'atteignent. Elle ne
// mesure pas « où l'on en est » de ce palier : un palier s'acquiert d'un seul
// coup, quand tous ses domaines attendus y sont, et la décision du 18.08.2026 a
// retiré les jauges de l'échelle des paliers pour ce motif exact — un domaine
// manquant sur neuf n'est pas « presque acquis », il n'est pas acquis.
//
// La bande réintroduit donc une forme que le lot 3 avait écartée, et elle ne
// tient que si elle porte le seuil. Trois choses s'en chargent, et aucune n'est
// décorative :
//
//   — le bord droit du rail est un trait fort, celui du texte ; le remplissage
//     l'atteint ou ne l'atteint pas. Ce n'est pas une jauge qui monte vers un
//     maximum, c'est un seuil qu'on franchit ou non ;
//   — le remplissage est gris tant qu'il n'y touche pas, et passe au noir plein
//     quand il y touche. La différence entre 95 % et 100 % est un changement de
//     nature, pas d'intensité ;
//   — le compte en clair double chaque barre : « 8 sur 9 domaines attendus »,
//     jamais « 89 % ». Un pourcentage dit une progression continue, un compte
//     dit ce qui manque.
//
// Et la phrase du bas dit ce que les barres ne veulent pas dire.
//
// Aucune bibliothèque de graphiques : deux éléments, une largeur en pourcentage,
// et les jetons de assets/tokens.css. La largeur est la seule chose que le
// composant calcule — le view-model livre les nombres et les libellés, comme
// pour le radar.
//
// Le rail est `aria-hidden` : il ne dit rien qu'une capacité d'assistance
// puisse lire, et tout ce qu'il montre est écrit juste dessous.
defineProps({
  vm: { type: Object, required: true }
})

// Le plein est traité pour lui-même et non atteint par le calcul : c'est ce qui
// garantit qu'un rail ne touche son seuil que lorsque le palier y est vraiment,
// sans dépendre d'un arrondi. Ailleurs, une décimale suffit à une barre de dix
// pixels de haut, et évite d'écrire seize chiffres dans le document.
//
// Un palier dont aucun domaine attendu n'est en périmètre rend 0 sur 0 : la
// barre reste vide plutôt que de valoir une division impossible — et le compte,
// juste dessous, dit pourquoi.
function fillWidth(bar) {
  if (bar.full) return '100%'
  if (!bar.expected) return '0%'
  return `${((bar.done / bar.expected) * 100).toFixed(1)}%`
}
</script>

<style scoped>
.band {
  position: sticky;
  top: var(--header-height);
  min-width: 0;
  /* Sur une fenêtre courte, la bande passerait sous le pli et sa phrase — qui
     est ce qui l'empêche d'être mal lue — deviendrait inatteignable. */
  max-height: calc(100vh - var(--header-height) - 24px);
  overflow-y: auto;
  padding-left: 18px;
  border-left: 2px solid var(--color-text);
}

.band__title {
  margin: 0 0 12px;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 800;
}

.band__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.bar + .bar {
  margin-top: 14px;
}

.bar__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin: 0 0 4px;
}

.bar__label {
  font-size: 12px;
  line-height: 1.25;
  letter-spacing: normal;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

/* Le profil acquis se nomme en pleine teinte : c'est un fait, les autres sont
   des directions. */
.bar.is-acquired .bar__label {
  color: var(--color-text);
}

.bar__tag {
  flex: none;
}

/* Le rail, et son seuil. Le bord droit est le trait fort du texte : c'est lui
   que le remplissage doit atteindre, et c'est ce qui distingue un seuil d'un
   maximum. Les trois autres bords restent au filet ordinaire — ils bornent la
   figure, ils ne signifient rien. */
.bar__track {
  display: block;
  height: 10px;
  background: var(--color-neutral-200);
  border: 1px solid var(--color-divider);
  border-right: 2px solid var(--color-text);
}

/* Gris tant que le seuil n'est pas atteint, noir plein quand il l'est : le
   passage se voit comme un changement de nature, pas comme un cran de plus. */
.bar__fill {
  display: block;
  height: 100%;
  background: var(--color-neutral-500);
}

.bar.is-acquired .bar__fill {
  background: var(--color-text);
}

/* Le compte en clair, qui double la barre. Il nomme son dénominateur : c'est
   lui qui bouge quand un domaine sort du périmètre. */
.bar__count {
  margin: 4px 0 0;
  font-size: 10.5px;
  line-height: 1.4;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

.band__scope,
.band__note {
  margin: 16px 0 0;
  font-size: 10.5px;
  line-height: 1.5;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

/* La phrase qui dit ce que les barres ne veulent pas dire ferme la bande, et
   son filet la détache du dernier compte : sans lui elle se lirait comme la
   note du cinquième profil. */
.band__note {
  padding-top: 12px;
  border-top: 1px solid var(--color-divider);
}

/* Sous 900px, la bande n'a plus la place d'être collée : l'en-tête y prend déjà
   le tiers de la hauteur utile, et une colonne de 280px ne tient pas à côté du
   contenu. Elle repasse donc en tête de page, à plat, ses cinq barres sur une
   grille qui se replie — c'est le geste du fichier de référence, dont la bande
   latérale devient `position: static` sous son point de rupture.

   En tête et non en pied : la bande est un témoin de remplissage, et un témoin
   qu'on ne voit qu'une fois tout répondu ne sert à rien. Le seuil, le compte en
   clair et la phrase la suivent tels quels — ce sont eux qui font la lecture,
   pas la position. */
@media (max-width: 900px) {
  .band {
    position: static;
    max-height: none;
    overflow-y: visible;
    padding-left: 0;
    padding-bottom: 16px;
    border-left: 0;
    border-bottom: 2px solid var(--color-text);
  }

  .band__list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 14px 20px;
  }

  .bar + .bar {
    margin-top: 0;
  }
}
</style>

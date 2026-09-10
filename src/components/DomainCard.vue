<template>
  <article class="card">
    <header class="head">
      <div class="head__band" :style="color ? { background: color } : null" />
      <p class="head__path">
        <span>{{ path }}</span>
        <span class="head__rank">{{ rank }}</span>
      </p>
      <div v-if="title" class="head__title">
        <h3 class="head__area heading">{{ title }}</h3>
        <button
          v-if="desc"
          type="button"
          class="button-reset head__toggle"
          :aria-expanded="described"
          :aria-controls="descId"
          :aria-label="`${described ? 'Masquer' : 'Afficher'} la définition — ${title}`"
          @click="described = !described"
        >
          {{ described ? '−' : '+' }}
        </button>
      </div>
      <p v-if="desc" v-show="described" :id="descId" class="head__desc">{{ desc }}</p>
    </header>

    <StatementPicker :vm="vm" @select="(value, event) => emit('select', value, event)" />

    <p v-if="hint" class="hint">{{ hint }}</p>

    <aside v-if="artifacts.length" class="artifacts">
      <p class="artifacts__label">
        Exemples d'artefacts
        <button
          type="button"
          class="button-reset artifacts__toggle"
          :aria-expanded="open"
          :aria-controls="artifactsId"
          :aria-label="`${open ? 'Masquer' : 'Afficher'} les exemples d'artefacts — ${title}`"
          @click="open = !open"
        >
          {{ open ? '−' : '+' }}
        </button>
      </p>
      <ul v-show="open" :id="artifactsId" class="artifacts__list">
        <li v-for="artifact in artifacts" :key="artifact">{{ artifact }}</li>
      </ul>
    </aside>
  </article>
</template>

<script setup>
// La carte d'un domaine de capacité : le bandeau de couleur, le chemin, le nom,
// les cinq énoncés, et le rappel replié dessous.
//
// Elle était écrite en ligne dans ScreenDiag, et elle en sort pour une seule
// raison : la portée visée de l'ancrage se pose désormais de la même façon —
// cinq énoncés, un seul retenu — et devait le faire avec le composant des
// domaines, non avec une copie qui s'en écarterait au premier réglage. Deux
// cartes d'apparence voisine mais de code distinct auraient divergé dès la
// première correction de gabarit.
//
// Ce que la carte ne sait pas, et ne doit pas savoir : ce qu'un clic entraîne.
// Elle émet la valeur et le geste ; la confirmation d'exclusion, le défilement
// vers le domaine vide suivant et l'écriture dans la session restent à l'écran
// qui l'emploie. La portée n'a rien de tout cela — elle est une réponse et rien
// d'autre —, et c'est précisément pourquoi ce partage-là tient.
//
// — ce qui est facultatif, et pour qui —
// Quatre parties ne valent que pour un domaine, et la carte de portée les laisse
// vides : le rang attendu (`rank`), la définition (`desc`), les exemples
// d'artefacts (`artifacts`), et le nom (`title`) — la portée n'a pas de nom
// distinct de son chemin, et l'écrire deux fois de suite ferait un bégaiement.
// À l'inverse, `hint` ne sert qu'à la portée : les domaines n'en portent aucun,
// et c'est aussi le signe visible qu'on n'est pas devant un vingt-neuvième
// domaine.
//
// Les deux replis sont locaux à la carte. Ils l'étaient déjà par domaine dans
// ScreenDiag — deux tables indexées par identifiant — et ne décrivent pas
// l'évaluation : ni persistés, ni exportés, ni lus du calcul. Les cartes sont
// montées une fois pour toutes, `key` par domaine, si bien qu'un état porté ici
// vit exactement aussi longtemps que la table qu'il remplace.
import { ref, useId } from 'vue'
import StatementPicker from './StatementPicker.vue'

defineProps({
  // Le view-model du sélecteur, tel que StatementPicker l'attend.
  vm: { type: Object, required: true },
  // La couleur de la dimension : le bandeau de la carte, et le liseré des rangs
  // atteints que le sélecteur en tire.
  color: { type: String, default: '' },
  path: { type: String, required: true },
  rank: { type: String, default: '' },
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
  hint: { type: String, default: '' },
  artifacts: { type: Array, default: () => [] }
})

const emit = defineEmits(['select'])

const open = ref(false)
const described = ref(false)
const uid = useId()
const descId = `desc-${uid}`
const artifactsId = `artifacts-${uid}`
</script>

<style scoped>
/* L'espace avant le sélecteur appartient à l'en-tête et non à la définition :
   celle-ci se replie, et sans cela la question viendrait toucher le titre. */
.head {
  margin-bottom: 18px;
}

.head__band {
  height: 8px;
  margin-bottom: 12px;
}

.head__path {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  justify-content: space-between;
  margin: 0;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-neutral-700);
}

/* Le rang attendu tient le bout de la ligne de chemin : il appartient au même
   registre — ce que le modèle dit du domaine avant qu'on réponde — et explique
   pourquoi ce domaine pèse sur tel palier et pas sur tel autre. En bas de casse,
   parce que ce n'est pas un intitulé mais une précision.

   La carte de portée le laisse vide, et c'est une décision : aucun profil
   n'exige une portée, et y écrire quoi que ce soit ferait dire à l'outil ce que
   l'utilisateur devrait viser. */
.head__rank {
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: none;
}

/* Le « + » se pose au bout du titre, sur la même ligne de base : c'est la
   définition du domaine qu'il ouvre, pas un bloc de la carte. */
.head__title {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.head__area {
  margin: 5px 0 0;
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: normal;
}

.head__toggle {
  font-size: 15px;
  line-height: 1;
  font-weight: 400;
  color: var(--color-neutral-600);
}

.head__toggle:hover {
  color: var(--color-text);
}

.head__desc {
  max-width: 90ch;
  margin: 8px 0 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

/* La règle de lecture de la carte, sous le sélecteur : c'est là qu'elle décide,
   une fois les cinq situations lues. Elle prend le registre du rappel — petit,
   gris, hors de l'encadré — parce qu'elle n'est pas une sixième chose à
   répondre. */
.hint {
  max-width: 90ch;
  margin: 10px 0 0;
  font-size: 10.5px;
  line-height: 1.5;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

/* Le rappel vient après la réponse, sur toute la largeur : il n'a plus de
   voisin à qui disputer la colonne. Un filet le sépare du sélecteur — c'est un
   appui, pas une suite de la question. */
.artifacts {
  min-width: 0;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--color-divider);
}

.artifacts__label {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
}

.artifacts__toggle {
  margin-left: 5px;
  font-size: 13px;
  line-height: 1;
  font-weight: 400;
  color: var(--color-neutral-600);
}

.artifacts__toggle:hover {
  color: var(--color-text);
}

/* Plus d'ascenseur : la liste ne s'affiche que sur demande, elle se donne alors
   en entier (14 artefacts au plus dans le modèle) plutôt que par la fenêtre.
   Sur toute la largeur, elle se met en colonnes plutôt que de tirer une ligne de
   dix mots sur quatre-vingts caractères de vide. */
.artifacts__list {
  margin: 8px 0 0;
  padding: 0 0 0 16px;
  columns: 3;
  column-gap: 32px;
  font-size: 11px;
  line-height: 1.5;
  color: var(--color-neutral-800);
}

.artifacts__list li {
  break-inside: avoid;
}

.artifacts__list li + li {
  margin-top: 4px;
}

@media (max-width: 1200px) {
  .artifacts__list {
    columns: 2;
  }
}

@media (max-width: 900px) {
  .artifacts__list {
    columns: 1;
  }
}
</style>

<template>
  <div class="evaluation">
    <nav class="strip" aria-label="Domaines de capacité du diagnostic">
      <div
        v-for="group in vm.blockGroups"
        :key="group.key"
        class="strip__group"
        :style="{ flexGrow: group.areas.length }"
      >
        <p class="strip__block" :title="group.name">{{ group.name }}</p>
        <div class="strip__areas">
          <button
            v-for="area in group.areas"
            :key="area.id"
            type="button"
            class="button-reset strip__area"
            :class="{
              'is-answered': area.answered,
              'is-out-of-scope': area.outOfScope,
              'is-current': area.anchor === current
            }"
            :style="area.color && area.answered ? { background: area.color } : null"
            :title="`${area.name} — ${area.state}`"
            :aria-label="`Domaine ${area.number} — ${area.name}, ${area.state}`"
            :aria-current="area.anchor === current ? 'location' : undefined"
            @click="scrollToAnchor(area.anchor)"
          >
            <span class="strip__number">{{ area.number }}</span>
            <span class="strip__mark" aria-hidden="true">{{ area.mark }}</span>
          </button>
        </div>
      </div>
    </nav>

    <article
      v-for="area in vm.areas"
      :id="area.anchor"
      :key="area.id"
      ref="domainRefs"
      class="domain"
    >
      <header class="head">
        <div class="head__band" :style="area.color ? { background: area.color } : null" />
        <p class="head__path">
          <span>{{ area.block }} · {{ area.dim }}</span>
          <span class="head__rank">attendu au rang {{ area.required }}</span>
        </p>
        <h3 class="head__area heading">{{ area.name }}</h3>
        <p class="head__desc">{{ area.desc }}</p>
      </header>

      <StatementPicker :vm="area.picker" @select="emit('answer', area.id, $event)" />

      <aside v-if="area.exampleArtifacts.length" class="artifacts">
        <p class="artifacts__label">
          Exemples d'artefacts
          <button
            type="button"
            class="button-reset artifacts__toggle"
            :aria-expanded="Boolean(open[area.id])"
            :aria-controls="`artifacts-${area.id}`"
            :aria-label="`${open[area.id] ? 'Masquer' : 'Afficher'} les exemples d'artefacts — ${area.name}`"
            @click="open[area.id] = !open[area.id]"
          >
            {{ open[area.id] ? '−' : '+' }}
          </button>
        </p>
        <ul v-show="open[area.id]" :id="`artifacts-${area.id}`" class="artifacts__list">
          <li v-for="artifact in area.exampleArtifacts" :key="artifact">{{ artifact }}</li>
        </ul>
      </aside>
    </article>
  </div>
</template>

<script setup>
// Le questionnaire : les 28 domaines de capacité empilés, dans l'ordre du
// modèle, sur la page qui défile.
//
// Il n'y a plus un domaine par écran. La barre ne déplace donc plus d'index :
// elle fait défiler jusqu'à l'ancre du domaine. Elle dit de chacun le rang
// retenu, le point du non-renseigné, la croix du hors périmètre, et la couleur
// de dimension qui ne s'allume qu'une fois répondu.
//
// — le domaine qu'on est en train de lire —
// La barre a longtemps été muette sur ce point, au motif que sur une page qui
// porte les vingt-huit domaines il n'y en a pas un qui soit « actif ». C'est
// vrai d'un index, et faux d'une position de lecture : il y a bien, à chaque
// instant, un domaine qu'on regarde. La bande de verdict de l'en-tête tenait
// cette question — où en suis-je — au prix d'un compteur qui redisait mal ce que
// la restitution dit bien ; en la retirant, on rend la question à l'endroit où
// on va naturellement la poser, c'est-à-dire à la barre des domaines.
//
// Le repère est un encadré fort, sans changement de gabarit : le cadre est posé
// en ombre intérieure et non en bordure épaissie, faute de quoi la case
// grandirait de deux pixels et toute la ligne se décalerait au défilement.
//
// C'est le second registre de navigation de la page — les phases sont le
// premier —, et elle ne le serait pas si elle défilait hors de vue au premier
// domaine. Elle se colle donc sous l'en-tête, et seulement le temps de sa
// section : au-dessus et en dessous, elle ne désigne rien.
//
// La ligne de progression a suivi. Elle disait deux choses, une position — qui
// n'existe plus — et un nombre de domaines renseignés, qui a vécu un temps dans
// la bande de verdict de l'en-tête avant d'en être retiré : son dénominateur
// n'était pas celui de la couverture affichée en restitution, et deux comptes
// pour une même chose valent moins qu'un seul. La couverture le porte
// désormais, à l'endroit où elle borne la lecture des résultats.
//
// L'ordre de lecture d'un domaine suit l'ordre de la décision : de quoi il
// s'agit (l'en-tête), la réponse (le sélecteur), et seulement ensuite le rappel.
// Celui-ci est sous la réponse : tant qu'il était en colonne à gauche, il se
// lisait comme la question, alors qu'il n'est qu'un appui.
//
// Ce que le rappel dit, et il n'y a plus rien d'autre : le bloc, la dimension,
// le nom, la description, le rang auquel le modèle attend le domaine, et des
// exemples d'artefacts. Les critères d'adoption et les pratiques en sont sortis.
// Ils restent dans le modèle, qui reste le report littéral de la source, mais
// affichés à côté des énoncés ils rouvraient la lecture en liste de conditions
// et donnaient à croire qu'on répondait sur eux. L'unité de réponse est
// l'énoncé, et lui seul.
//
// Rien de ce qui se répond n'est replié : vingt-huit domaines font une page très
// longue, et c'est le prix assumé de la forme. Seuls les exemples d'artefacts se
// déplient — ils ne se répondent pas, ils appuient —, et l'état est désormais
// tenu par domaine : il suivait d'un domaine à l'autre quand un seul était à
// l'écran, ce qui n'a plus de sens quand les vingt-huit y sont ensemble.
import { onBeforeUnmount, onMounted, reactive, ref, useTemplateRef } from 'vue'
import StatementPicker from '../StatementPicker.vue'
import { scrollToAnchor } from '../../composables/useAnchorScroll.js'

const props = defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['answer'])

const open = reactive({})

// — le domaine courant suit le défilement —
//
// Même dispositif que les phases dans ScreenTool1, et pour le même motif : ce
// qu'on observe n'est pas un gabarit — ce que la décision du 12.08.2026 écarte —
// mais une position de lecture, dont aucune règle de mise en page ne dépend et
// qu'aucun sélecteur CSS ne sait exprimer. Un observateur plutôt qu'un écouteur
// de `scroll` : il ne réveille le JavaScript qu'au franchissement d'un seuil.
//
// L'état est local et ne remonte nulle part. Il ne décrit pas l'évaluation, il
// décrit ce qu'on est en train de regarder : ni persisté, ni exporté, ni visible
// du calcul.
//
// La bande est en pourcentages de la fenêtre : elle n'a ainsi rien à savoir ni
// de la hauteur de l'en-tête ni de celle de la barre, qu'il faudrait sinon
// mesurer. Elle s'ouvre sous les deux — un cinquième de la fenêtre les couvre à
// toutes les largeurs — et le domaine qui la croise est celui qu'on lit.
const DOMAIN_BAND = { rootMargin: '-20% 0px -75% 0px', threshold: 0 }

const domainRefs = useTemplateRef('domainRefs')
const current = ref(null)
let observer = null

onMounted(() => {
  const domains = domainRefs.value || []
  if (!domains.length || typeof IntersectionObserver === 'undefined') return

  // L'ordre du document, que le tableau de refs ne garantit pas : c'est lui qui
  // départage quand deux domaines croisent la bande à la fois.
  const order = props.vm.areas.map(area => area.anchor)
  const crossing = new Set()

  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) crossing.add(entry.target.id)
      else crossing.delete(entry.target.id)
    })
    // Le *dernier* qui croise, et non le premier : au moment où deux se
    // touchent, c'est celui vers lequel on descend qui compte. Si aucun ne
    // croise — entre deux domaines, ou en haut de la page —, on garde le
    // précédent plutôt que d'éteindre le repère à chaque intervalle.
    const lit = order.filter(anchor => crossing.has(anchor))
    if (lit.length) current.value = lit[lit.length - 1]
  }, DOMAIN_BAND)

  domains.forEach(domain => observer.observe(domain))
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<style scoped>
/* Hauteur de la barre une fois collée, déclarée une fois pour les deux endroits
   qui en dépendent : la barre s'en sert pour se poser sous l'en-tête, chaque
   domaine pour s'arrêter sous les deux. Comme la hauteur de l'en-tête
   (assets/tokens.css), elle est déclarée et non mesurée — la décision du
   12.08.2026 écarte l'observation d'un gabarit en JavaScript. */
.evaluation {
  --strip-height: 66px;
}

/* La barre tient toute la largeur du plan de travail qu'elle coiffe : le
   repère de parcours se lit en regard des domaines, pas en médaillon.

   Collée sous l'en-tête, elle reste atteignable pendant les vingt-huit
   domaines. Elle est opaque et fermée d'un filet : sans quoi les énoncés
   passeraient dessous en transparence. Son rang la place sous l'en-tête, qui
   tient le sien à 5 : deux barres collantes ne doivent pas se disputer le
   dessus. */
.strip {
  position: sticky;
  top: var(--header-height);
  z-index: 4;
  display: flex;
  gap: 6px;
  align-items: stretch;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-divider);
  background: var(--color-bg);
}

/* Deux niveaux : le bloc coiffe, sans être cliquable ; seuls les domaines
   numérotés en dessous portent la navigation. Chaque bloc pèse le nombre de
   domaines qu'il présente, si bien que toutes les cases gardent la même largeur
   d'un bout à l'autre de la barre. */
.strip__group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-basis: 0;
  min-width: 0;
}

.strip__block {
  margin: 0;
  padding: 0 1px 3px;
  border-bottom: 1px solid var(--color-divider);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-neutral-700);
}

.strip__areas {
  display: flex;
  gap: 3px;
}

/* Chaque case dit deux choses : quel domaine — le numéro, qui ne bouge jamais —
   et où il en est — la marque, sur une seconde ligne. Le rang retenu s'y écrit
   en clair, l'absence de réponse par un point, le hors périmètre par une croix.
   La couleur de dimension ne s'allume qu'une fois répondu : de loin, la barre
   dit l'avancement avant de dire le contenu. */
.strip__area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  flex: 1 1 0;
  min-width: 0;
  padding: 3px 2px;
  border: 1px solid var(--color-divider);
  color: var(--color-text);
  line-height: 1;
  text-align: center;
  opacity: 0.78;
}

.strip__area:hover {
  border-color: var(--color-text);
  opacity: 1;
}

/* Le domaine qu'on est en train de lire. Le cadre est posé en ombre intérieure
   plutôt qu'en bordure épaissie : une bordure de 2px ferait grandir la case et
   décalerait toute la ligne au fil du défilement, ce qui est exactement ce qu'un
   repère ne doit pas faire. Le numéro passe en gras avec lui — la case reste
   lisible même là où l'aplat de dimension mange le contraste du cadre. */
.strip__area.is-current {
  border-color: var(--color-text);
  box-shadow: inset 0 0 0 1px var(--color-text);
  opacity: 1;
}

.strip__area.is-current .strip__number {
  font-weight: 800;
}

.strip__number {
  font-size: 10px;
  font-weight: 600;
}

.strip__mark {
  font-size: 8px;
  font-weight: 700;
  color: var(--color-neutral-700);
}

.strip__area.is-answered {
  opacity: 1;
}

.strip__area.is-answered .strip__mark {
  color: var(--color-text);
}

/* Hors périmètre : la case garde sa place et son numéro — le modèle ne rétrécit
   pas — mais perd sa couleur de dimension. C'est une réponse, pas un manque :
   elle reste pleinement lisible. */
.strip__area.is-out-of-scope {
  background: var(--color-neutral-200);
  border-color: var(--color-neutral-400);
  color: var(--color-neutral-700);
  opacity: 1;
}

.strip__area.is-out-of-scope:hover {
  background: var(--color-neutral-300);
}

/* Un domaine dans l'empilement. Le filet fort le sépare du précédent : c'est la
   seule chose qui dise, sur une page très longue, qu'on a changé de question. Il
   s'arrête sous les deux barres collées — celle de l'en-tête et celle des
   domaines —, faute de quoi le défilement déposerait son titre dessous. */
.domain {
  margin-top: 30px;
  padding-top: 22px;
  border-top: 2px solid var(--color-text);
  scroll-margin-top: calc(var(--header-height) + var(--strip-height));
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
   parce que ce n'est pas un intitulé mais une précision. */
.head__rank {
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: none;
}

.head__area {
  margin: 5px 0 0;
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: normal;
}

.head__desc {
  max-width: 90ch;
  margin: 8px 0 18px;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--color-neutral-800);
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
  /* la barre reste d'un seul tenant : on resserre les gouttières plutôt que
     de la laisser passer à la ligne, ce qui casserait la numérotation */
  .strip {
    gap: 4px;
  }

  .strip__areas {
    gap: 2px;
  }

  .strip__area {
    padding: 3px 1px;
  }

  .strip__number {
    font-size: 9px;
  }

  /* Sous 900px, la barre cesse d'être collée : l'en-tête y prend déjà le tiers
     de la hauteur utile, et deux barres collantes ne laisseraient pas de quoi
     lire un énoncé. Elle reste en tête de section, atteignable par l'onglet
     « Évaluation ». Les domaines n'ont alors plus qu'une barre sous laquelle
     s'arrêter, d'où la hauteur nulle. */
  .strip {
    position: static;
  }

  .evaluation {
    --strip-height: 0px;
  }

  .artifacts__list {
    columns: 1;
  }
}
</style>

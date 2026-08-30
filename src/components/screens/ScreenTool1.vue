<template>
  <AppScreen class="page">
    <div class="page__main">
      <section :id="vm.sections[0].anchor" ref="cadrageSection" class="section section--cadrage">
        <h2 class="section-head">{{ vm.sections[0].name }}</h2>
        <ScreenCadrage3
          ref="cadrage"
          :vm="cadrage3"
          @select-option="(fieldId, value) => emit('select-option', fieldId, value)"
          @dismiss-warning="emit('dismiss-warning')"
          @next="emit('next')"
        />
      </section>

      <section :id="vm.sections[1].anchor" ref="evaluationSection" class="section">
        <h2 class="section-head">{{ vm.sections[1].name }}</h2>
        <ScreenDiag :vm="diag" @answer="(areaId, value) => emit('answer', areaId, value)" />
      </section>

      <section :id="vm.sections[2].anchor" ref="resultsSection" class="section">
        <h2 class="section-head">{{ vm.sections[2].name }}</h2>
        <ScreenTool3 :resti1="resti1" :resti2="resti2" />
      </section>

      <AppScreenNav
        :next-label="vm.nextLabel"
        @back="emit('back')"
        @next="requestNext"
      />
    </div>

    <ProfileBand :vm="vm.band" class="page__band" />
  </AppScreen>
</template>

<script setup>
// La page de l'outil : le cadrage, l'évaluation et les résultats empilés, dans
// cet ordre, sur une seule page qui défile.
//
// Elle a d'abord été dix écrans, puis cinq pages, puis trois : elle est
// désormais une. Ce qui reste dehors le reste pour une raison, et une seule —
// l'ancrage s'ouvre sur la question de portée, dont la réponse change tout ce
// qui la suit, et amenée par le défilement on y répondrait en passant.
//
// La page ne calcule rien : elle compose trois sections qui portent chacune leur
// contenu, leur donne l'ancre que les deux barres de navigation visent, et
// conclut par la seule sortie qu'elle propose.
//
// — la bande des profils —
// Elle borde la page à droite et reste collée pendant tout le défilement : ce
// qu'elle montre — le remplissage des cinq profils — n'a d'intérêt que pendant
// qu'on répond. Elle est hors du flux des sections, donc hors de ce que
// l'observateur de défilement regarde : elle n'est aucune des trois phases.
//
// — l'arrivée par une ancre —
// On entre parfois sur cette page ailleurs qu'en haut : par un onglet de phase,
// par le retour au questionnaire depuis l'ancrage, par une démonstration qui
// s'ouvre sur la restitution. Le composable pose l'intention, la page la suit —
// faire défiler est une affaire de DOM, donc de composant — puis la rend, sans
// quoi redemander la même ancre ne changerait rien.
//
// — la sortie, et son garde-fou —
// Le départ ne s'émet pas d'ici : il passe par ScreenCadrage3, qui décide s'il
// faut d'abord avertir d'un formulaire laissé vide. Le garde-fou change de
// place avec la fusion — il gardait le passage du cadrage à l'évaluation, il n'y
// a plus de passage — et vient garder celui de la page à l'ancrage, qui est
// l'endroit où le profil visé se nomme et où ce que les attributs de contexte
// bornent devient enfin visible.
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
import AppScreen from '../AppScreen.vue'
import AppScreenNav from '../AppScreenNav.vue'
import ScreenCadrage3 from './ScreenCadrage3.vue'
import ScreenDiag from './ScreenDiag.vue'
import ScreenTool3 from './ScreenTool3.vue'
import ProfileBand from '../ProfileBand.vue'
import { scrollToAnchor } from '../../composables/useAnchorScroll.js'

const props = defineProps({
  vm: { type: Object, required: true },
  cadrage3: { type: Object, required: true },
  diag: { type: Object, required: true },
  resti1: { type: Object, required: true },
  resti2: { type: Object, required: true }
})

const emit = defineEmits([
  'select-option', 'dismiss-warning', 'answer', 'phase', 'anchor-reached', 'back', 'next'
])

const cadrage = useTemplateRef('cadrage')

function requestNext() {
  cadrage.value?.requestNext()
}

// — l'arrivée par une ancre —
// Deux entrées pour la même chose : le montage — on arrive d'un autre écran —
// et le changement d'ancre — on y était déjà. `flush: 'post'` pour que la
// section visée existe dans le document avant qu'on cherche à l'atteindre.
function consumeAnchor(anchor) {
  if (!anchor) return
  scrollToAnchor(anchor)
  emit('anchor-reached')
}

watch(() => props.vm.anchor, consumeAnchor, { flush: 'post' })

// — la phase courante suit le défilement —
//
// Un IntersectionObserver sur les trois sections, et rien d'autre. La frontière
// avec la décision du 12.08.2026 est fine, et il faut donc la nommer.
//
// Cette décision écarte l'observation de la *mise en page* en JavaScript : un
// composable qui lirait la largeur de la fenêtre pour choisir un gabarit, là où
// une media query le dit sans réveiller le JavaScript ni re-rendre quoi que ce
// soit. Ce qu'on observe ici n'est pas un gabarit mais une position de lecture —
// où en est le lecteur dans une page qu'il fait défiler. Aucune règle de mise en
// page n'en dépend, aucun composant n'est re-rendu pour une question de largeur,
// et rien de ce qui est observé ne pourrait être dit en CSS : il n'existe pas de
// sélecteur pour « la section qu'on est en train de lire ».
//
// Ce que la frontière interdit en revanche, et c'est le point : pas d'écouteur
// de `scroll`. Un écouteur rappellerait un calcul de position à chaque image, y
// compris quand rien de significatif n'a changé. L'observateur, lui, ne réveille
// le JavaScript qu'au franchissement d'un seuil.
//
// La bande d'observation est en pourcentages de la fenêtre et non en pixels :
// elle n'a ainsi rien à savoir de la hauteur de l'en-tête, qu'il faudrait sinon
// mesurer. La bande tient entre le cinquième et le quart du haut de la fenêtre :
// la section qui la croise est celle qu'on est en train de lire.
const SECTION_BAND = { rootMargin: '-20% 0px -75% 0px', threshold: 0 }

const sectionRefs = [
  useTemplateRef('cadrageSection'),
  useTemplateRef('evaluationSection'),
  useTemplateRef('resultsSection')
]

let observer = null

onMounted(() => {
  consumeAnchor(props.vm.anchor)

  const sections = sectionRefs.map(entry => entry.value)
  if (sections.some(section => !section) || typeof IntersectionObserver === 'undefined') return

  const crossing = sections.map(() => false)
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      crossing[sections.indexOf(entry.target)] = entry.isIntersecting
    })
    // La *dernière* section qui croise la bande, et non la première : au moment
    // où deux se touchent, c'est celle vers laquelle on descend qui compte. Si
    // aucune ne la croise — une section plus courte que la bande —, on garde la
    // phase précédente plutôt que d'en inventer une.
    const index = crossing.lastIndexOf(true)
    if (index >= 0) emit('phase', props.vm.sections[index].n)
  }, SECTION_BAND)

  sections.forEach(section => observer.observe(section))
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<style scoped>
/* Le contenu à gauche, la bande des profils à droite, et `align-items: start`
   pour que la bande puisse coller : une cellule de grille étirée par défaut
   prendrait toute la hauteur de la ligne, et un élément collant qui occupe déjà
   toute sa piste ne colle à rien. */
.page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 0 36px;
  align-items: start;
}

.page__main {
  min-width: 0;
}

/* Les trois sections de la page, séparées par la seule respiration : le titre
   coiffé suffit à dire qu'on change de phase, et un filet de plus ferait lire
   une rupture de page là où il n'y a qu'un défilement. */
.section + .section {
  margin-top: 44px;
}

/* Chaque section s'arrête sous la barre collée en haut de page, qui sinon
   recouvrirait son titre à l'arrivée du défilement. La hauteur est le jeton
   partagé — voir assets/tokens.css, qui dit pourquoi elle est déclarée et non
   mesurée. */
.section {
  scroll-margin-top: var(--header-height);
}

/* Le cadrage ne s'étale pas sur toute la largeur : ses champs restent sur deux
   colonnes lisibles. Les deux autres sections, elles, prennent la page entière
   — la barre des 28 domaines et le détail par domaine en ont besoin. */
.section--cadrage {
  max-width: 1040px;
}

/* La bande se resserre avant de partir : à cette largeur, 280px pris au contenu
   coûtent plus à la barre des 28 domaines qu'ils ne rapportent à la bande. */
@media (max-width: 1200px) {
  .page {
    grid-template-columns: minmax(0, 1fr) 230px;
    gap: 0 24px;
  }
}

/* Sous 900px la grille se replie sur une colonne, et la bande passe en tête —
   voir ProfileBand, qui porte la décision et son motif. L'ordre de source la
   place après le contenu, ce qui est le bon ordre pour un lecteur d'écran : la
   bande commente ce qu'on répond, elle ne l'annonce pas. */
@media (max-width: 900px) {
  .page {
    grid-template-columns: minmax(0, 1fr);
  }

  .page__band {
    order: -1;
    margin-bottom: 28px;
  }

  .section + .section {
    margin-top: 32px;
  }
}
</style>

<template>
  <AppScreen class="tool1">
    <header class="page-head">
      <p class="eyebrow">Phase 1 — Cadrage</p>
      <h1 class="page-head__title heading">Trois phases, une seule à remplir maintenant</h1>
    </header>

    <JourneyMap class="zone" :phases="journey.phases" />

    <section class="zone">
      <ScreenCadrage2 />
      <button type="button" class="scroll-cue" @click="scrollToForm">
        <span class="scroll-cue__label">Décrire mon organisation</span>
        <span class="scroll-cue__arrow" aria-hidden="true">↓</span>
      </button>
    </section>

    <section ref="formSection" class="zone zone--form">
      <h2 class="zone__title heading">Votre organisation</h2>
      <ScreenCadrage3
        :vm="cadrage3"
        @select-option="(fieldId, value) => emit('select-option', fieldId, value)"
        @toggle-context="emit('toggle-context')"
        @select-transformation="emit('select-transformation', $event)"
        @toggle-transformation="emit('toggle-transformation')"
      />
    </section>

    <AppScreenNav next-label="Commencer l'évaluation" @back="emit('back')" @next="emit('next')" />
  </AppScreen>
</template>

<script setup>
// Page de cadrage : la carte du parcours en haut, la raison d'être du
// formulaire au centre, le formulaire en bas. Un seul défilement plutôt que
// trois écrans successifs — l'utilisateur voit d'emblée que le cadrage tient en
// une page, et le repère de descente lui évite de la chercher.
import { ref } from 'vue'
import AppScreen from '../AppScreen.vue'
import AppScreenNav from '../AppScreenNav.vue'
import JourneyMap from '../JourneyMap.vue'
import ScreenCadrage2 from './ScreenCadrage2.vue'
import ScreenCadrage3 from './ScreenCadrage3.vue'

defineProps({
  journey: { type: Object, required: true },
  cadrage3: { type: Object, required: true }
})

const emit = defineEmits([
  'select-option', 'toggle-context', 'select-transformation', 'toggle-transformation', 'back', 'next'
])

const formSection = ref(null)

// `scroll-margin-top` sur la cible dégage l'en-tête collant ; le défilement doux
// est abandonné si le système déclare préférer les animations réduites.
function scrollToForm() {
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  formSection.value?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
}
</script>

<style scoped>
.tool1 {
  max-width: 1180px;
}

.page-head__title {
  margin: 6px 0 0;
  font-size: 26px;
  line-height: 1.15;
}

.zone {
  margin-top: 34px;
}

.zone--form {
  padding-top: 24px;
  border-top: 2px solid var(--color-text);
  /* la cible du défilement se pose sous l'en-tête collant, pas dessous */
  scroll-margin-top: 120px;
}

.zone__title {
  margin: 0 0 18px;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.scroll-cue {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
  padding: 10px 16px;
  border: 2px solid var(--color-text);
  background: transparent;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text);
  cursor: pointer;
}

.scroll-cue:hover {
  background: var(--color-neutral-200);
}

.scroll-cue__arrow {
  font-size: 15px;
  line-height: 1;
}

@media (max-width: 900px) {
  .page-head__title {
    font-size: 21px;
  }

  .zone--form {
    scroll-margin-top: 90px;
  }
}
</style>

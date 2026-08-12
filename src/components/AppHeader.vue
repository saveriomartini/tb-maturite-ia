<template>
  <header class="header">
    <div class="header__bar">
      <div class="header__brand">
        <button
          type="button"
          class="brand-home"
          title="Retour à l'accueil"
          aria-label="MAIA - Maturité IA — retour à l'accueil"
          @click="emit('home')"
        >
          MAIA - Maturité IA
        </button>
        <div class="header__subtitle heading">— Outil d'évaluation</div>
      </div>

      <p class="meta header__model">modèle v1.0 · CMU SEI / Accenture · consolidation Matrice N2</p>

      <div class="header__session meta">
        <span>{{ vm.sessionLabel }}</span>
        <button v-if="vm.hasProgress" type="button" class="header__reset" @click="emit('reset')">
          réinitialiser
        </button>
      </div>
    </div>

    <nav class="header__phases" aria-label="Phases du parcours">
      <button
        v-for="phase in vm.phases"
        :key="phase.n"
        type="button"
        class="button-reset phase"
        :class="{ 'phase--active': phase.active }"
        :disabled="!phase.screen"
        :aria-current="phase.active ? 'step' : undefined"
        @click="emit('phase', phase.screen)"
      >
        <span class="phase__head">
          <span class="phase__number">{{ phase.n }}</span>
          <span class="phase__name heading">{{ phase.name }}</span>
        </span>
        <span class="phase__desc">{{ phase.desc }}</span>
      </button>
    </nav>
  </header>
</template>

<script setup>
defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['home', 'phase', 'reset'])
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 5;
  border-bottom: 2px solid var(--color-text);
  background: var(--color-bg);
}

.header__bar,
.header__phases {
  max-width: 1440px;
  margin: 0 auto;
}

.header__bar {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 16px;
  padding: 14px var(--gutter) 0;
}

.header__brand {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.header__subtitle {
  font-size: 15px;
}

.header__model {
  margin: 0;
}

.header__session {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-left: auto;
}

.header__reset {
  font-family: inherit;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 700;
  color: var(--color-neutral-700);
  background: transparent;
  border: 1px solid var(--color-neutral-400);
  padding: 2px 7px;
  cursor: pointer;
}

.header__reset:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}

.header__phases {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 10px var(--gutter) 0;
}

.phase {
  margin-bottom: -2px;
  padding: 12px 18px 14px;
  border-right: 1px solid var(--color-divider);
  border-bottom: 4px solid transparent;
}

.phase:disabled {
  opacity: 0.45;
}

.phase--active {
  border-bottom-color: var(--color-text);
}

.phase__head {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.phase__number {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 20px;
  line-height: 1;
  color: var(--color-neutral-500);
}

.phase--active .phase__number {
  color: var(--color-text);
}

.phase__name {
  font-size: 14px;
}

.phase__desc {
  display: block;
  max-width: 290px;
  margin-top: 5px;
  font-size: 10.5px;
  line-height: 1.35;
  color: var(--color-neutral-700);
}

@media (max-width: 1200px) {
  .header__model {
    /* la ligne de provenance du modèle passe sous le titre plutôt que de
       comprimer le libellé de session */
    order: 3;
    width: 100%;
  }

  .phase {
    padding: 10px 12px 12px;
  }
}

/* Sur tablette l'en-tête est collant : il doit rester court. Le numéro et le
   nom de la phase suffisent à se repérer, la phrase d'explication a déjà été
   lue à l'accueil. */
@media (max-width: 900px) {
  .phase__desc {
    display: none;
  }

  .phase {
    padding: 9px 10px 10px;
  }

  .phase__number {
    font-size: 16px;
  }

  .phase__name {
    font-size: 12px;
  }
}
</style>

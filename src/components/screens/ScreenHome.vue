<template>
  <AppScreen>
    <div class="journey panel">
      <div class="persona">
        <p class="persona__title heading">User</p>
        <p class="persona__label">Persona :</p>
        <p class="persona__value">CoDir d'une PME de l'Arc Jurassien</p>
        <p class="persona__label persona__label--spaced">Attentes :</p>
        <ul class="persona__list">
          <li>— comprendre comment évaluer l'adoption de l'IA en entreprise</li>
          <li>— définir son niveau de maturité selon le modèle proposé</li>
          <li>— générer des projets basés sur des leviers d'action selon priorité</li>
        </ul>
      </div>

      <div class="phases">
        <section
          v-for="phase in vm.journey"
          :key="phase.n"
          class="phase"
          :class="{ 'is-out-of-scope': phase.outOfScope }"
        >
          <header class="phase__head">
            <span class="phase__number heading">{{ phase.n }}</span>
            <h2 class="phase__name heading">{{ phase.name }}</h2>
            <span v-if="phase.outOfScope" class="tag tag--muted">hors périmètre</span>
          </header>
          <div class="phase__steps">
            <p v-for="step in phase.steps" :key="step" class="step">{{ step }}</p>
          </div>
        </section>
      </div>
    </div>

    <div class="journey journey--attached panel">
      <div class="persona persona--compact">
        <p class="persona__label">Points de friction et opportunités :</p>
      </div>

      <div class="phases">
        <section
          v-for="phase in vm.journey"
          :key="phase.n"
          class="phase phase--notes"
          :class="{ 'is-out-of-scope': phase.outOfScope }"
        >
          <ul class="notes">
            <li v-for="friction in phase.frictions" :key="friction" class="notes__item notes__item--friction">
              — {{ friction }}
            </li>
          </ul>
          <ul class="notes notes--opportunities">
            <li v-for="opportunity in phase.opps" :key="opportunity" class="notes__item">
              + {{ opportunity }}
            </li>
          </ul>
        </section>
      </div>
    </div>

    <div class="start">
      <button type="button" class="btn btn-primary start__button" @click="emit('start')">Start</button>
    </div>
  </AppScreen>
</template>

<script setup>
import AppScreen from '../AppScreen.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['start'])
</script>

<style scoped>
.journey {
  display: grid;
  grid-template-columns: 200px 1fr;
}

.journey--attached {
  border-top: 0;
  background: transparent;
}

.persona {
  padding: 18px 20px;
  border-right: 2px solid var(--color-text);
}

.persona--compact {
  padding: 14px 20px;
}

.persona__title {
  margin: 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.persona__label {
  margin: 10px 0 0;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.3;
}

.persona__label--spaced {
  margin-top: 16px;
}

.persona__value {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.35;
}

.persona__list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
  font-size: 12px;
  line-height: 1.35;
}

.phases {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.phase {
  padding: 16px 16px 20px;
  border-right: 1px solid var(--color-divider);
}

.phase--notes {
  padding: 12px 16px 16px;
}

.phase:last-child {
  border-right: 0;
}

.phase.is-out-of-scope {
  opacity: 0.5;
}

.phase__head {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.phase__number {
  font-size: 26px;
  line-height: 1;
}

.is-out-of-scope .phase__number {
  color: var(--color-neutral-500);
}

.phase__name {
  margin: 0;
  font-size: 17px;
}

.phase__steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
}

.step {
  margin: 0;
  padding: 10px 12px;
  border: 1px solid var(--color-divider);
  background: #fff;
  font-size: 11.5px;
  line-height: 1.4;
}

.notes {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.notes--opportunities {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--color-divider);
}

.notes__item {
  font-size: 11px;
  line-height: 1.35;
}

.notes__item--friction {
  color: var(--color-neutral-800);
}

.start {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.start__button {
  min-width: 180px;
}

@media (max-width: 1200px) {
  .phases {
    grid-template-columns: 1fr 1fr;
  }

  /* en deux colonnes, ce sont les phases paires qui ferment la ligne */
  .phase:nth-child(2n) {
    border-right: 0;
  }

  .phase:nth-child(-n + 2) {
    border-bottom: 1px solid var(--color-divider);
  }
}

@media (max-width: 900px) {
  .journey,
  .phases {
    grid-template-columns: 1fr;
  }

  .persona {
    border-right: 0;
    border-bottom: 2px solid var(--color-text);
  }

  .phase {
    border-right: 0;
  }

  .phase:not(:last-child) {
    border-bottom: 1px solid var(--color-divider);
  }
}
</style>

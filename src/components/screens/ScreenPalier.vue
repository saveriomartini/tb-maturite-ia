<template>
  <AppScreen class="palier">
    <div class="lead">
      <p class="eyebrow lead__eyebrow">Diagnostic terminé</p>
      <h1 class="lead__title heading">{{ vm.evaluatedCount }} areas de compétence évaluées</h1>
      <p class="lead__why">{{ vm.why }}</p>

      <dl v-if="vm.factors.length" class="factors">
        <div v-for="factor in vm.factors" :key="factor.key" class="factor">
          <dt class="factor__key">{{ factor.key }}</dt>
          <dd class="factor__value">{{ factor.value }}</dd>
        </div>
      </dl>

      <p class="lead__question">{{ vm.question }}</p>
    </div>

    <section class="panel choice">
      <h2 class="panel-head">Profil visé retenu</h2>
      <div class="choice__body">
        <div class="choice__options" role="radiogroup" aria-label="Profil visé retenu">
          <button
            v-for="option in vm.profileOptions"
            :key="option.n"
            type="button"
            role="radio"
            class="chip chip--nowrap choice__option"
            :class="{ 'is-active': option.active }"
            :aria-checked="option.active"
            @click="emit('select-profile', option.n)"
          >
            <span>{{ option.label }}</span>
            <span v-if="option.recommended" class="tag choice__badge">proposé</span>
          </button>
        </div>
        <p class="choice__hint">
          {{ vm.manual ? vm.manualLabel : 'Ce profil découle de vos attributs de contexte. Changez-le si la description ne correspond pas à votre situation : la sélection des areas suit.' }}
        </p>
      </div>
    </section>

    <AppScreenNav @back="emit('back')">
      <template #actions>
        <div class="actions">
          <button type="button" class="btn btn-secondary actions__skip" @click="emit('skip')">
            {{ vm.skipLabel }}
          </button>
          <button type="button" class="btn btn-primary actions__continue" @click="emit('continue')">
            {{ vm.continueLabel }}
          </button>
        </div>
      </template>
    </AppScreenNav>
  </AppScreen>
</template>

<script setup>
// Palier de fin de diagnostic. C'est le premier — et le seul — endroit où le
// profil visé se montre : jusqu'ici il a désigné les areas en silence, et rien
// n'a laissé entendre qu'il en existait d'autres. On explique ce qui a été
// retenu, on laisse corriger si l'explication ne colle pas, puis on demande
// s'il faut monter aux profils suivants ou lire les résultats.
import AppScreen from '../AppScreen.vue'
import AppScreenNav from '../AppScreenNav.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['select-profile', 'continue', 'skip', 'back'])
</script>

<style scoped>
.palier {
  max-width: 1100px;
}

.lead__eyebrow {
  margin: 0;
  color: var(--color-neutral-700);
}

.lead__title {
  margin: 6px 0 0;
  font-size: 26px;
  line-height: 1.15;
}

.lead__why {
  max-width: 680px;
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.5;
}

.factors {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 680px;
  margin: 16px 0 0;
  padding: 12px 0 12px 12px;
  border-left: 3px solid var(--color-text);
}

.factor {
  font-size: 11.5px;
  line-height: 1.4;
}

.factor__key {
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-size: 9px;
  font-weight: 800;
  color: var(--color-neutral-700);
}

.factor__value {
  margin: 0;
}

.lead__question {
  max-width: 680px;
  margin: 18px 0 0;
  font-size: 13px;
  line-height: 1.5;
  font-weight: 700;
}

.choice {
  max-width: 420px;
  margin-top: 24px;
}

.choice__body {
  padding: 14px;
}

.choice__options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.choice__option {
  --chip-padding: 8px 10px;
  --chip-font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
}

.choice__badge {
  font-size: 8.5px;
  letter-spacing: 0.07em;
  padding: 1px 4px;
}

.choice__hint {
  margin: 12px 0 0;
  font-size: 10.5px;
  line-height: 1.45;
  color: var(--color-neutral-700);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.actions__skip {
  min-width: 160px;
}

.actions__continue {
  min-width: 260px;
}
</style>

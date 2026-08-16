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
// Palier de fin de diagnostic. Il nomme le profil qui a désigné les areas
// parcourues — jusqu'ici il travaillait en silence — et pose la seule question
// qui reste ouverte : monter aux profils suivants, ou lire les résultats.
//
// Le profil ne se corrige plus ici : il se déclare une fois pour toutes au
// cadrage, avec le degré de transformation visé. Un second endroit où le
// changer rouvrait la décision au moment où l'on ne demande plus qu'à
// poursuivre ou s'arrêter.
import AppScreen from '../AppScreen.vue'
import AppScreenNav from '../AppScreenNav.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['continue', 'skip', 'back'])
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

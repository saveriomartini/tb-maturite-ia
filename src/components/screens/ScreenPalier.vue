<template>
  <AppScreen class="palier">
    <div class="lead">
      <p class="eyebrow lead__eyebrow">Diagnostic terminé</p>
      <h1 class="lead__title heading">{{ vm.scopeCount }} domaines de capacité couverts</h1>
      <p class="lead__why">{{ vm.why }}</p>
    </div>

    <AppScreenNav @back="emit('back')">
      <template #actions>
        <div class="actions">
          <button type="button" class="btn btn-secondary actions__continue" @click="emit('continue')">
            {{ vm.continueLabel }}
          </button>
          <button type="button" class="btn btn-primary actions__skip" @click="emit('skip')">
            {{ vm.skipLabel }}
          </button>
        </div>
      </template>
    </AppScreenNav>
  </AppScreen>
</template>

<script setup>
// Palier de fin de diagnostic. Il nomme le profil qui a désigné les areas
// parcourues — jusqu'ici il travaillait en silence — et laisse la sortie
// ouverte : lire les résultats, ou monter aux profils suivants.
//
// Les deux sorties restent offertes, mais elles ne pèsent pas pareil : le plein
// noir va aux résultats, qui closent le parcours demandé au cadrage ; poursuivre
// reste possible en second plan, sans être ce qu'on suggère.
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

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.actions__skip {
  min-width: 220px;
}

.actions__continue {
  min-width: 260px;
}
</style>

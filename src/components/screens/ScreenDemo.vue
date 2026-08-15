<template>
  <AppScreen class="demo">
    <header class="page-head">
      <p class="eyebrow">Démonstration</p>
      <h1 class="page-head__title heading">Bientôt disponible</h1>
    </header>

    <section class="todo panel">
      <h2 class="panel-head">À faire</h2>
      <div class="todo__body">
        <p class="todo__text">
          Cette entrée présentera un parcours pré-rempli — une PME fictive, ses attributs de
          contexte, ses pratiques validées — pour montrer les résultats sans rien avoir à saisir.
        </p>
        <p class="todo__text todo__text--muted">
          En attendant, le diagnostic réel se lance depuis l'accueil et se réinitialise à tout
          moment depuis l'en-tête.
        </p>
      </div>
    </section>

    <AppScreenNav back-label="Retour à l'accueil" @back="emit('back')">
      <template #actions>
        <button type="button" class="btn btn-primary demo__start" @click="emit('start')">
          Démarrer le diagnostic
        </button>
      </template>
    </AppScreenNav>
  </AppScreen>
</template>

<script setup>
// Réservation d'écran pour la démonstration : l'accueil annonce trois portes, et
// une porte qui ne s'ouvre sur rien se lit comme un défaut. Elle dit donc ce
// qu'elle contiendra, et redonne la main sur le diagnostic réel.
import AppScreen from '../AppScreen.vue'
import AppScreenNav from '../AppScreenNav.vue'

const emit = defineEmits(['start', 'back'])
</script>

<style scoped>
.demo {
  max-width: 900px;
}

.page-head__title {
  margin: 6px 0 0;
  font-size: 30px;
  line-height: 1.15;
}

.todo {
  margin-top: 28px;
  border-style: dashed;
}

.todo__body {
  padding: 16px 18px;
}

.todo__text {
  max-width: 640px;
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  text-wrap: pretty;
}

.todo__text--muted {
  margin-top: 12px;
  font-size: 11.5px;
  color: var(--color-neutral-700);
}

.demo__start {
  min-width: 220px;
}
</style>

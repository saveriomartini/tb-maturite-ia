<template>
  <AppScreen class="home">
    <div class="hero">
      <h1 class="hero__title heading">M.A.IA</h1>
      <p class="hero__tagline">
        Outil d'auto-évaluation de la maturité d'adoption de l'IA pour PME
      </p>
    </div>

    <div class="doors">
      <section
        v-for="block in vm.blocks"
        :key="block.id"
        class="door panel"
        :class="{ 'door--primary': block.primary, 'is-pending': !block.ready }"
      >
        <h2 class="door__name heading">{{ block.name }}</h2>
        <p class="door__desc">{{ block.desc }}</p>
        <span v-if="!block.ready" class="tag tag--muted door__tag">à venir</span>
        <button
          type="button"
          class="btn door__button"
          :class="block.primary ? 'btn-primary btn-arrow' : 'btn-secondary'"
          @click="emit('open', block.target)"
        >
          {{ block.action }}
        </button>
      </section>
    </div>
  </AppScreen>
</template>

<script setup>
// Accueil : trois portes de même rang, et rien d'autre. Le parcours en phases,
// la description du modèle et la carte des areas ont quitté cet écran — ils
// retenaient l'utilisateur avant qu'il ait pu commencer. Ce qui reste tient en
// un coup d'œil : s'informer, évaluer, ou regarder une démonstration.
import AppScreen from '../AppScreen.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['open'])
</script>

<style scoped>
.home {
  max-width: 1180px;
}

.hero {
  max-width: 760px;
}

.hero__title {
  margin: 0;
  font-size: 56px;
  line-height: 1;
}

.hero__tagline {
  margin: 12px 0 0;
  font-size: 17px;
  line-height: 1.4;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

.doors {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 40px;
}

/* chaque porte est une colonne complète : le bouton est poussé en bas pour que
   les trois s'alignent quelle que soit la longueur du texte */
.door {
  display: flex;
  flex-direction: column;
  padding: 22px 22px 24px;
}

.door--primary {
  border-width: 3px;
}

.door.is-pending {
  opacity: 0.62;
}

.door__name {
  margin: 0;
  font-size: 20px;
  letter-spacing: normal;
}

/* la marge basse de la description tient l'écart minimal avec le bouton : les
   marges ne fusionnent pas en flex, elle s'ajoute au `margin-top: auto` qui
   pousse le bouton en pied de carte */
.door__desc {
  margin: 10px 0 22px;
  font-size: 13px;
  line-height: 1.45;
  text-wrap: pretty;
}

.door__tag {
  align-self: flex-start;
  margin-bottom: 22px;
}

.door__button {
  margin-top: auto;
  padding-top: 12px;
  padding-bottom: 12px;
}

@media (max-width: 900px) {
  .hero__title {
    font-size: 40px;
  }

  .hero__tagline {
    font-size: 15px;
  }

  .doors {
    grid-template-columns: 1fr;
    margin-top: 28px;
  }
}
</style>

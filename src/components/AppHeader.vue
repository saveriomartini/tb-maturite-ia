<template>
  <header class="header">
    <div class="header__bar">
      <div class="header__brand">
        <button
          type="button"
          class="brand-home"
          title="Retour à l'accueil"
          aria-label="M.A.IA — retour à l'accueil"
          @click="emit('home')"
        >
          M.A.IA
        </button>
        <div class="header__subtitle heading">
          Maturité de l'adoption des technologies IA
        </div>
      </div>

      <div class="header__session meta">
        <span>{{ vm.sessionLabel }}</span>
        <button
          v-if="vm.hasProgress"
          type="button"
          class="header__reset"
          @click="emit('reset')"
        >
          réinitialiser
        </button>
      </div>
    </div>

    <nav
      v-if="vm.showPhases"
      class="header__phases"
      aria-label="Phases du parcours"
    >
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

    <div v-if="vm.verdict" class="verdict">
      <p class="verdict__cell">
        <span class="verdict__label">Profil atteint</span>
        <span class="verdict__value heading">{{ vm.verdict.acquiredLabel }}</span>
      </p>
      <p v-if="vm.verdict.nextLabel" class="verdict__cell verdict__cell--next">
        <span class="verdict__label">Profil suivant</span>
        <span class="verdict__value">{{ vm.verdict.nextLabel }}</span>
      </p>
      <p class="verdict__cell verdict__cell--progress">
        <span class="verdict__value verdict__value--meta">{{ vm.verdict.progress }}</span>
      </p>
    </div>
  </header>
</template>

<script setup>
// L'en-tête colle en haut de la fenêtre : marque, session, phases — et, pendant
// l'évaluation et les résultats, le verdict en cours.
//
// Le verdict collant répond à une question qu'on se pose en descendant : où en
// suis-je, et qu'est-ce qui vient après. Il ne remplace pas la restitution — il
// n'en porte ni la description, ni l'échelle, ni ce qui sépare du palier suivant
// — et il ne s'affiche pas dans les phases où il n'aurait rien à dire. Voir
// docs/logs/BACKLOG.md, ligne 3.4.
defineProps({
  vm: { type: Object, required: true },
});

const emit = defineEmits(["home", "phase", "reset"]);
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
.header__phases,
.verdict {
  max-width: 1440px;
  margin: 0 auto;
}

/* — le verdict en cours —
   Une bande basse, sous les phases, qui ne dispute rien à la page : corps
   réduit, filet de séparation, et le seul mot en gras est le nom du palier
   tenu. Elle se lit d'un coup d'œil sans arrêter ce qu'on est en train de
   faire — c'est tout ce qu'on demande à un en-tête collant. */
.verdict {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 28px;
  align-items: baseline;
  padding: 7px var(--gutter) 8px;
  border-top: 1px solid var(--color-divider);
}

.verdict__cell {
  display: flex;
  gap: 8px;
  align-items: baseline;
  margin: 0;
  min-width: 0;
}

.verdict__label {
  flex: none;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-neutral-700);
}

.verdict__value {
  font-size: 12.5px;
  letter-spacing: normal;
}

/* Le profil suivant est une indication de direction, pas un résultat : il se
   tient un cran de gris sous le palier tenu, sans la graisse de titrage. */
.verdict__cell--next .verdict__value {
  color: var(--color-neutral-700);
}

.verdict__cell--progress {
  margin-left: auto;
}

.verdict__value--meta {
  font-size: 11px;
  color: var(--color-neutral-700);
}

.header__bar {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 16px;
  /* sans la barre de phases, l'en-tête garde sa respiration en bas */
  padding: 14px var(--gutter) 12px;
}

.header:has(.header__phases) .header__bar {
  padding-bottom: 0;
}

.header__brand {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.header__subtitle {
  font-size: 12.5px;
  line-height: 1.3;
  color: var(--color-neutral-800);
}

/* L'en-tête ne porte plus que l'identifiant de session et sa remise à zéro. La
   version du modèle et sa provenance — v1.0, CMU SEI / Accenture, consolidation
   Matrice N2 — relèvent du rapport et de l'export, pas d'un rappel à chaque
   écran. L'export continue de les dater et de les versionner. */
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
  grid-template-columns: repeat(3, 1fr);
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
  .phase {
    padding: 10px 12px 12px;
  }
}

/* Sur tablette l'en-tête est collant : il doit rester court. Le numéro et le
   nom de la phase suffisent à se repérer, la phrase d'explication a déjà été
   lue à l'accueil. */
@media (max-width: 900px) {
  /* Empilée, la progression n'a plus de bord droit à tenir : elle reprend le
     rang des deux autres cellules plutôt que de flotter seule. */
  .verdict__cell--progress {
    margin-left: 0;
  }

  /* le titre suffit à identifier l'outil : la ligne de description passe à la
     trappe avant que l'en-tête collant ne mange l'écran */
  .header__subtitle {
    display: none;
  }

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

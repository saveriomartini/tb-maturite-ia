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
        <div v-if="vm.showSubtitle" class="header__subtitle heading">
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
        :disabled="!phase.target"
        :aria-current="phase.active ? 'step' : undefined"
        @click="emit('phase', phase.target)"
      >
        <span class="phase__head">
          <span class="phase__number">{{ phase.n }}</span>
          <span class="phase__name heading">{{ phase.name }}</span>
        </span>
      </button>
    </nav>
  </header>
</template>

<script setup>
// L'en-tête colle en haut de la fenêtre : marque, session, phases. Rien d'autre.
//
// — les quatre phases sur une ligne —
// Elles sont des points d'arrivée et non plus des écrans à ouvrir : les trois
// premières font défiler la page jusqu'à leur section, la quatrième change
// d'écran. La barre ne sait pas laquelle fait quoi — chaque phase porte sa
// cible, et c'est le composable qui la lit.
//
// La phase active n'est plus déduite de l'écran courant : sur la page qui empile
// les trois premières, elle suit la position du défilement.
//
// — ce que l'en-tête ne porte plus, et où c'est passé —
// La bande de verdict (« Profil atteint », « Profil suivant », le compte de
// domaines renseignés) a été retirée. Elle redisait, en haut de page et sous un
// troisième nom, ce que la restitution nomme « Profil diagnostiqué » à quelques
// centimètres en dessous ; et son compte de domaines n'avait pas le même
// dénominateur que la couverture affichée juste après, ce qui donnait deux
// nombres contradictoires dans un même champ de vision.
//
// Ce qu'elle rendait vraiment — où en suis-je dans les vingt-huit domaines — est
// désormais porté là où on le cherche : la barre des domaines de ScreenDiag
// entoure celui qu'on est en train de lire, et la bande des profils tient le
// remplissage de chaque palier pendant tout le défilement.
//
// Chaque onglet portait aussi la première étape de sa phase, reprise de JOURNEY.
// Elle est tombée avec la bande : sur l'onglet « Évaluation », elle répétait la
// consigne que StatementPicker pose déjà sur chacun des vingt-huit domaines, et
// le même texte se lit en entier dans la carte du parcours, sur la page
// d'information. Ces deux retraits rendent une trentaine de pixels à
// `--header-height`, donc à tout ce qui se rejoint par le défilement.
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
.header__phases {
  max-width: 1440px;
  margin: 0 auto;
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

/* Les quatre phases sur une seule ligne, de Cadrage à Ancrage. La barre était
   à trois colonnes pour quatre phases depuis le rétablissement de l'Ancrage, et
   la quatrième passait à la ligne. */
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

/* Le dernier onglet ferme la barre : son filet doublerait le bord de la page. */
.phase:last-child {
  border-right: 0;
}

.phase:hover:not(:disabled) {
  background: color-mix(in srgb, var(--color-text) 5%, transparent);
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

@media (max-width: 1200px) {
  .phase {
    padding: 10px 12px 12px;
  }
}

/* Sur tablette l'en-tête est collant : il doit rester court. Le numéro et le
   nom de la phase suffisent à se repérer. */
@media (max-width: 900px) {
  /* le titre suffit à identifier l'outil : le développement de l'acronyme passe
     à la trappe avant que l'en-tête collant ne mange l'écran */
  .header__subtitle {
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

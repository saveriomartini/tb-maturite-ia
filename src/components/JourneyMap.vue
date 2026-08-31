<template>
  <div class="map" :style="{ '--phase-count': phases.length }">
    <div class="panel">
      <div class="phases">
        <section v-for="phase in phases" :key="phase.n" class="phase">
          <header class="phase__head">
            <span class="phase__number heading">{{ phase.n }}</span>
            <h3 class="phase__name heading">{{ phase.name }}</h3>
          </header>
          <div class="phase__steps">
            <p v-for="step in phase.steps" :key="step" class="step">{{ step }}</p>
          </div>
        </section>
      </div>
    </div>

    <div class="panel panel--attached">
      <p class="notes__legend">Points de friction et opportunités</p>
      <div class="phases">
        <section v-for="phase in phases" :key="phase.n" class="phase phase--notes">
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
  </div>
</template>

<script setup>
// Carte du parcours utilisateur : les quatre phases — cadrage, évaluation,
// résultats, ancrage — et sous chacune ce qui la rend pénible ou utile. Elle ouvre la page d'information, où
// elle sert de sommaire à qui veut comprendre où il met les pieds ; elle a quitté
// le cadrage, qu'elle retardait d'une page de lecture.
//
// La colonne persona (user, attentes) a été retirée : elle documentait la
// conception de l'outil, pas son usage, et n'avait rien à dire au lecteur.
defineProps({
  phases: { type: Array, required: true }
})
</script>

<style scoped>
.panel--attached {
  border-top: 0;
  background: transparent;
}

.notes__legend {
  margin: 0;
  padding: 10px 16px;
  border-bottom: 1px solid var(--color-divider);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.3;
}

/* Une colonne par phase, sur une seule ligne. Le nombre vient des données et
   non d'une constante : la grille était figée à trois colonnes depuis le
   rétablissement de l'Ancrage, si bien que la quatrième phase passait à la
   ligne — et, les notes étant sur la même grille, celles de l'Ancrage se
   rangeaient sous le Cadrage. Une carte du parcours qui attribue ses frictions
   à la mauvaise phase vaut moins que pas de carte du tout. La même constante
   avait déjà lâché dans la barre de l'en-tête, pour la même raison ; ici elle
   suit le tableau des phases. */
.phases {
  display: grid;
  grid-template-columns: repeat(var(--phase-count, 4), 1fr);
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

.phase__head {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.phase__number {
  font-size: 26px;
  line-height: 1;
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
  /* la carte se lève sur le fond du panneau, qui est légèrement teinté ; c'est
     le blanc de la page qu'elle emprunte, d'où le jeton plutôt qu'un #fff en
     dur */
  background: var(--color-bg);
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

@media (max-width: 900px) {
  .phases {
    grid-template-columns: 1fr;
  }

  .phase {
    border-right: 0;
  }

  .phase:not(:last-child) {
    border-bottom: 1px solid var(--color-divider);
  }
}
</style>

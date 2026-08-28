<template>
  <AppScreen>
    <div class="lead">
      <p class="eyebrow lead__eyebrow">Ancrage</p>
      <h1 class="lead__title heading">Préparer l’ancrage</h1>
      <p class="lead__text">
        Vous avez situé vos domaines de capacité ; reste à dire jusqu’où l’adoption de l’IA doit
        avoir porté. C’est de cette réponse que se déduit le profil visé, et donc l’écart. La phase
        s’arrête là : elle prépare la mise en œuvre, elle ne la conduit pas.
      </p>
    </div>

    <section class="section">
      <TransformationQuestion
        :field="vm.reachField"
        title="Portée visée"
        @select="emit('select-reach', $event)"
      />
    </section>

    <section class="section">
      <h2 class="section-head">Le profil visé, et ce qu’il engage</h2>

      <div class="verdict">
        <p class="verdict__eyebrow eyebrow">Profil visé</p>
        <p class="verdict__name heading">{{ vm.targetLabel }}</p>
        <p class="verdict__from">Profil diagnostiqué : {{ vm.acquiredLabel }}</p>
      </div>

      <p class="intention">{{ vm.intentionGap }}</p>
      <p class="passage">{{ vm.passage }}</p>
    </section>

    <section class="section">
      <h2 class="section-head">Ce qui vous en sépare</h2>

      <p v-if="vm.empty" class="closed">{{ vm.emptyLabel }}</p>
      <p v-if="vm.unmeasured" class="unmeasured">{{ vm.unmeasured }}</p>

      <div v-if="vm.gates.length" class="panel">
        <article v-for="group in vm.gates" :key="group.level" class="gate">
          <h3 class="panel-head gate__label">Pour atteindre « {{ group.label }} »</h3>
          <div
            v-for="area in group.areas"
            :key="area.id"
            class="domain"
            :style="{ '--dimension-color': area.dimColor }"
          >
            <div class="domain__head">
              <span class="domain__dimension">{{ area.dim }}</span>
              <span class="domain__area heading">{{ area.name }}</span>
              <span class="domain__ranks">attendu au rang {{ area.required }} · situé au {{ area.level || '—' }}</span>
            </div>
            <p class="domain__statement">{{ area.statement }}</p>
          </div>
        </article>
      </div>
    </section>

    <section v-if="vm.outOfScope || vm.pending" class="section">
      <h2 class="section-head">Ce que la mesure laisse de côté</h2>
      <div class="asides">
        <div v-if="vm.outOfScope" class="aside">
          <p class="aside__eyebrow eyebrow">{{ vm.outOfScope.summary }}</p>
          <p class="aside__note">{{ vm.outOfScope.note }}</p>
          <p class="aside__list">{{ vm.outOfScope.areasLabel }}</p>
        </div>

        <div v-if="vm.pending" class="aside">
          <p class="aside__eyebrow eyebrow">{{ vm.pending.summary }}</p>
          <p class="aside__note">{{ vm.pending.note }}</p>
          <p class="aside__list">{{ vm.pending.areasLabel }}</p>
          <button type="button" class="btn btn-secondary aside__resume" @click="emit('resume')">
            {{ vm.pending.resumeLabel }}
          </button>
        </div>
      </div>
    </section>

    <AppScreenNav @back="emit('back')">
      <template #actions>
        <div class="actions">
          <button type="button" class="btn btn-secondary actions__export" @click="emit('export')">Export</button>
          <button type="button" class="btn btn-primary actions__finish" @click="emit('finish')">Fin</button>
        </div>
      </template>
    </AppScreenNav>
  </AppScreen>
</template>

<script setup>
// Phase d'ancrage. Elle pose la question de portée, en déduit le profil visé,
// dit l'écart entre l'intention et ce que le contexte porte, nomme les domaines
// qui séparent de la cible — avec l'énoncé à atteindre pour chacun —, et produit
// la pièce à emporter.
//
// La question vient en premier et non en dernier : tout ce qui suit en dépend,
// et l'écran serait illisible dans l'autre sens. Elle n'est pas exigée pour
// autant — sans réponse, le profil visé retombe sur ce que le contexte porte, et
// le texte le dit.
//
// L'écart se lit en deux temps, et l'ordre compte : la nature du passage
// d'abord — ce qu'on s'apprête à entreprendre —, les domaines ensuite. L'ordre
// inverse ferait lire une liste de tâches là où il y a parfois un changement de
// nature, celui que Venkatraman situe entre le deuxième et le troisième degré.
//
// — la hiérarchie de la page —
// Ce que la phase produit, c'est un profil visé et la nature de ce qu'il
// engage. L'un tenait dans le coin droit d'une barre de panneau en 10px, et
// l'autre — le seul texte de la page qui puisse modifier une décision
// d'investissement — se lisait au corps courant, en troisième paragraphe. Le
// profil visé ouvre donc sa propre section, nommé et détaché, avec le profil
// diagnostiqué en regard : c'est de la distance entre les deux que tout le
// reste dépend.
//
// La barre du panneau portait aussi le verdict quand il n'y avait aucun écart
// (« Profil visé atteint ») : la conclusion la plus forte de la page était sa
// plus petite ligne. Elle est passée au corps de la section, où elle se lit.
//
// Les deux blocs de hors-texte étaient deux panneaux pleins, du même poids
// visuel que l'écart lui-même. Ils sont réunis dans une section coiffée comme
// les autres, en retrait de corps et sans cadre plein — même traitement que sur
// la page de résultats, dont ils reprennent d'ailleurs les deux mêmes listes.
//
// Chaque domaine porte l'énoncé du palier visé, et non le nom du palier : c'est
// sur des énoncés qu'on a répondu, c'est en énoncés qu'on doit lire ce qui
// manque. Un intitulé de profil ne dit pas quoi faire ; « nous rendons compte de
// l'avancement devant la direction » le dit.
//
// Les deux listes du hors-texte ne disent pas la même chose : les domaines
// déclarés hors périmètre sont sortis du calcul par décision de l'organisation,
// ceux qui restent à évaluer n'ont pas de réponse et ne sont un manque pour
// personne. Aucun des deux n'entre dans l'écart, et chacun garde donc sa note :
// sans elles, la liste des domaines qui séparent se lirait comme un bilan
// complet du modèle.
import AppScreen from '../AppScreen.vue'
import AppScreenNav from '../AppScreenNav.vue'
import TransformationQuestion from '../TransformationQuestion.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['select-reach', 'export', 'finish', 'resume', 'back'])
</script>

<style scoped>
.lead__eyebrow {
  margin: 0;
  color: var(--color-neutral-700);
}

.lead__title {
  margin: 6px 0 0;
  font-size: 26px;
  line-height: 1.15;
}

.lead__text {
  max-width: 720px;
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.5;
  text-wrap: pretty;
}

/* Les sections de la page, toutes coiffées à l'identique : la question de
   portée, le profil visé et ce qu'il engage, ce qui en sépare, ce que la mesure
   laisse de côté. La question n'en porte pas le titre — elle a le sien, dans le
   composant qui la pose. */
.section {
  margin-top: 30px;
}

/* — ce que la phase produit —
   Le profil visé, nommé et détaché. Il tenait dans le coin droit d'une barre de
   panneau, en capitales de 10px, alors que c'est la réponse que l'écran vient de
   déduire. Le profil diagnostiqué est rappelé sous lui, au corps du hors-texte :
   c'est de la distance entre les deux que dépend tout ce qui suit. */
.verdict {
  max-width: 80ch;
}

.verdict__eyebrow {
  margin: 0;
  color: var(--color-neutral-700);
}

.verdict__name {
  margin: 5px 0 0;
  font-size: 28px;
  line-height: 1.12;
  letter-spacing: -0.01em;
}

.verdict__from {
  margin: 7px 0 0;
  font-size: 12px;
  color: var(--color-neutral-700);
}

.intention {
  max-width: 80ch;
  margin: 16px 0 0;
  font-size: 13px;
  line-height: 1.5;
  text-wrap: pretty;
}

/* La nature du passage se détache du reste par le seul filet vertical qui la
   tient : même corps, même couleur — c'est le texte de la page qui peut modifier
   une décision d'investissement. */
.passage {
  max-width: 80ch;
  margin: 14px 0 0;
  padding-left: 12px;
  border-left: 2px solid var(--color-text);
  font-size: 13px;
  line-height: 1.5;
  text-wrap: pretty;
}

/* Aucun écart : la cible est tenue, ou dépassée. C'est une conclusion, et elle
   se lit comme telle — elle occupait la barre du panneau, en 10px. */
.closed {
  max-width: 80ch;
  margin: 0;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 18px;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

/* La liste est vide alors que la cible n'est pas tenue : c'est le seul cas où
   l'absence d'écart affiché ne veut pas dire absence d'écart. */
.unmeasured {
  max-width: 80ch;
  margin: 12px 0 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

.gate:not(:first-child) {
  border-top: 2px solid var(--color-text);
}

/* Le palier coiffe ses domaines à l'intérieur du panneau : la barre dit ce
   qu'on cherche à atteindre, les lignes en dessous ce qui l'en empêche. */
.gate__label {
  margin: 0;
}

.domain {
  padding: 10px 12px;
  border-left: 6px solid var(--dimension-color);
  border-bottom: 1px solid var(--color-divider);
}

.gate:last-child .domain:last-child {
  border-bottom: 0;
}

.domain__head {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  align-items: baseline;
}

.domain__dimension {
  font-size: 10px;
  color: var(--color-neutral-700);
}

.domain__area {
  font-size: 13px;
  letter-spacing: normal;
}

.domain__ranks {
  margin-left: auto;
  font-size: 10.5px;
  color: var(--color-neutral-700);
  white-space: nowrap;
}

/* L'énoncé à atteindre est la seule chose de ce bloc sur laquelle on puisse
   agir : il porte le corps de lecture, le reste l'annonce. */
.domain__statement {
  max-width: 90ch;
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.5;
  text-wrap: pretty;
}

/* Ce que la mesure laisse de côté, dans le même traitement que sur la page de
   résultats — ce sont les deux mêmes listes. Elles étaient deux panneaux pleins,
   du même poids visuel que l'écart : en retrait de corps et sans cadre, elles
   bornent la lecture sans la disputer. */
.asides {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  align-items: start;
}

.aside {
  min-width: 0;
  padding-left: 12px;
  border-left: 3px solid var(--color-neutral-300);
}

.aside__eyebrow {
  margin: 0 0 6px;
  color: var(--color-neutral-700);
}

.aside__note {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

.aside__list {
  margin: 10px 0 0;
  font-size: 11.5px;
  line-height: 1.5;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

.aside__resume {
  margin-top: 14px;
}

.actions {
  display: flex;
  gap: 12px;
}

.actions__export {
  min-width: 140px;
}

.actions__finish {
  min-width: 120px;
}

@media (max-width: 900px) {
  .verdict__name {
    font-size: 24px;
  }

  .asides {
    grid-template-columns: 1fr;
  }

  .domain__ranks {
    margin-left: 0;
  }
}
</style>

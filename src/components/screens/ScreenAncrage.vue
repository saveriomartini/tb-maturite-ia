<template>
  <AppScreen class="band-page">
    <div class="band-page__main">
      <div class="lead">
        <h1 class="lead__title heading">Préparer l’ancrage</h1>
        <p class="lead__text">
          Situer votre organisation était le premier temps, celui du diagnostic.
          Restent la comparaison à ce que vous visez, qui se déduit de la portée
          déclarée ci-dessous, et l'énoncé de l'écart.
        </p>
      </div>

      <section class="section">
        <DomainCard
          :vm="vm.reachCard.picker"
          :color="vm.reachCard.color"
          :path="vm.reachCard.path"
          :title="vm.reachCard.title"
          :desc="vm.reachCard.desc"
          @select="emit('select-reach', $event)"
        />
      </section>

      <section class="section">
        <h2 class="section-head">Le profil visé, et ce qu’il engage</h2>

        <div class="verdict">
          <p class="verdict__eyebrow eyebrow">{{ vm.targetTermCap }}</p>
          <p class="verdict__name heading">{{ vm.targetLabel }}</p>
          <p class="verdict__from">
            Profil diagnostiqué : {{ vm.acquiredLabel }}
          </p>

          <!-- TEXTE PROVISOIRE — à valider par Saverio -->
          <div
            class="suggested"
            :class="{ 'suggested--apart': vm.relation === 'above' }"
            role="status"
          >
            <p class="suggested__line">
              Profil suggéré par votre contexte : {{ vm.suggestedLabel }}
            </p>
            <p v-if="vm.relation === 'above'" class="suggested__apart">
              Votre profil visé est plus haut que ce profil suggéré.
            </p>
            <ul v-if="vm.showSuggestedReasons" class="suggested__reasons">
              <li v-for="reason in vm.suggestedReasons" :key="reason.text">
                <template v-if="reason.kind === 'cap'">{{
                  reason.text
                }}</template>
                <template v-else
                  >le profil le plus haut suppose {{ reason.text }}</template
                >
              </li>
            </ul>
          </div>
        </div>

        <p class="intention">{{ vm.intentionGap }}</p>
        <p class="passage">{{ vm.passage }}</p>
      </section>

      <section v-if="vm.contextGap" class="section">
        <h2 class="section-head">
          Ce que votre cible suppose de votre contexte
        </h2>

        <p class="conditions__lead">{{ vm.contextGap.lead }}</p>

        <div v-if="vm.contextGap.rows.length" class="panel">
          <div
            v-for="row in vm.contextGap.rows"
            :key="row.label"
            class="domain domain--flat"
          >
            <div class="domain__head">
              <span class="domain__area heading">{{ row.label }}</span>
              <span class="domain__ranks"
                >déclaré : {{ row.declared }} · supposé :
                {{ row.supposed }}</span
              >
            </div>
            <p v-if="row.criterion" class="domain__statement">
              {{ row.criterion }}
            </p>
          </div>
        </div>

        <div
          v-if="vm.contextGap.unanswered"
          class="aside conditions__unanswered"
        >
          <p class="aside__note">{{ vm.contextGap.unanswered.note }}</p>
          <p class="aside__list">{{ vm.contextGap.unanswered.label }}</p>
        </div>
      </section>

      <section class="section">
        <h2 class="section-head">Ce qui vous en sépare</h2>

        <p v-if="vm.empty" class="closed">{{ vm.emptyLabel }}</p>
        <p v-if="vm.unmeasured" class="unmeasured">{{ vm.unmeasured }}</p>

        <div v-if="vm.gates.length" class="panel">
          <article v-for="group in vm.gates" :key="group.level" class="gate">
            <h3 class="panel-head gate__label">
              Pour atteindre « {{ group.label }} »
            </h3>
            <div
              v-for="area in group.areas"
              :key="area.id"
              class="domain"
              :style="{ '--dimension-color': area.dimColor }"
            >
              <div class="domain__head">
                <span class="domain__dimension">{{ area.dim }}</span>
                <span class="domain__area heading">{{ area.name }}</span>
                <span class="domain__ranks"
                  >attendu au rang {{ area.required }} · situé au
                  {{ area.level || "—" }}</span
                >
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
            <button
              type="button"
              class="btn btn-secondary aside__resume"
              @click="emit('resume')"
            >
              {{ vm.pending.resumeLabel }}
            </button>
          </div>
        </div>
      </section>

      <section class="section">
        <TakeAway
          :vm="vm.takeAway"
          @preview="emit('export')"
          @import="emit('import', $event)"
        />
      </section>

      <AppScreenNav @back="emit('back')">
        <template #actions>
          <div class="actions">
            <button
              type="button"
              class="btn btn-primary actions__finish"
              @click="emit('finish')"
            >
              Fin
            </button>
          </div>
        </template>
      </AppScreenNav>
    </div>

    <ProfileBand :vm="vm.band" class="band-page__band" />
  </AppScreen>
</template>

<script setup>
// — ce que la page ne dit plus —
// Le surtitre « Ancrage » redisait ce que l'onglet 4 de l'en-tête affiche, actif
// et souligné, à l'instant où l'on est ici : le mot paraissait trois fois avec
// le titre. Et le chapô s'ouvrait sur « vous avez situé vos domaines de
// capacité » — un récapitulatif de l'écran précédent, qui n'apprenait rien à qui
// vient d'en sortir. Reste ce que la page seule peut dire : d'où vient le profil
// visé, et où s'arrête la phase.
//
// Phase d'ancrage. Elle pose la question de portée, en déduit le profil visé,
// dit l'écart entre l'intention et ce que le contexte porte, nomme les domaines
// qui séparent de la cible — avec l'énoncé à atteindre pour chacun —, et produit
// la pièce à emporter.
//
// — la sortie de la phase, depuis le 11.09.2026 —
// Le bouton « Export » de la barre du bas est devenu le bloc « Emporter »
// (`TakeAway`), en fin de page. Il représentait les trois sorties de la phase
// par la seule première, et ne disait ni ce qui sort, ni où cela va, ni que
// rien ne part tout seul — trois choses qu'un utilisateur a le droit de savoir
// à l'instant où il décide. La barre du bas ne garde que « Fin ».
//
// La question vient en premier et non en dernier : tout ce qui suit en dépend,
// et l'écran serait illisible dans l'autre sens. Elle n'est pas exigée pour
// autant — sans réponse, c'est la suggestion du cadrage qui sert de repère, et
// la page la nomme alors « profil suggéré » partout, jamais « profil visé ».
//
// — la bande des profils, reprise ici —
// La même bande qu'à l'évaluation, à la même place : contenu à gauche, bande de
// 280px collée à droite sous l'en-tête, par la primitive `.band-page` que les
// deux écrans partagent (tokens.css). Le déplacer aurait suffi à la faire lire
// comme une seconde figure ; c'est la même, poursuivie.
//
// Ses barres sont figées sur le résultat du diagnostic et ne bougent pas quand
// on répond à la question de portée — la portée est une intention, elle ne
// réécrit pas un constat. Seules deux marques réagissent, en direct : le profil
// que la portée déclare, et celui que le cadrage suggère. C'est la contrepartie
// d'une règle posée le 10.09.2026 après le test pilote : les phases 1 à 3 ne
// changent plus quand la portée change — l'échelle des paliers des résultats a
// perdu sa marque « cible » pour ce motif —, et ce que la portée change se
// montre ici, dans le même champ de vision que la question qui la pose.
//
// La bande est hors du flux du contenu : elle ne prend pas part à la lecture en
// sections, elle l'accompagne.
//
// — la suggestion, mise en regard et non substituée —
// Ce que les attributs de cadrage appellent est montré sous le profil, avec les
// motifs qui l'ont fait descendre. Il ne borne plus rien : depuis l'entrée
// DECISIONS du 28.08.2026, la cible est celle que l'organisation déclare, et
// c'est un test pilote en PME qui a montré ce que l'ancien calcul faisait —
// l'outil corrigeait une réponse qu'il venait lui-même de solliciter.
//
// Quand la cible déclarée est plus haute que la suggestion, l'écart est marqué :
// un liseré neutre et une phrase, `role="status"` et non `alert`, sans aucune
// couleur d'erreur. Ce n'est pas un avertissement — il n'y a rien à corriger —,
// c'est une information mise à côté d'une autre.
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
// — la portée se pose comme un domaine —
// Elle avait son propre contrôle : cinq pastilles, et le détail de la retenue
// replié dessous. Le test pilote a trouvé la question mal posée, et pour une
// raison de forme : on y choisissait sur des intitulés courts, alors que deux
// portées voisines ne se départagent que sur la situation qu'elles décrivent.
// Elle emprunte donc la carte des vingt-huit domaines — cinq énoncés lisibles
// ensemble, un seul retenu — et le geste appris au questionnaire vaut ici.
//
// Ce qui la distingue reste visible : elle n'a ni interrupteur de hors
// périmètre, ni rang attendu. Pour le reste — nom, définition à déplier, cinq
// énoncés — c'est une carte de domaine. La ressemblance visée est celle du
// composant, pas celle du statut : la portée n'est pas un vingt-neuvième
// domaine et n'entre dans aucun calcul de la mesure.
import AppScreen from "../AppScreen.vue";
import AppScreenNav from "../AppScreenNav.vue";
import ProfileBand from "../ProfileBand.vue";
import DomainCard from "../DomainCard.vue";
import TakeAway from "../TakeAway.vue";

defineProps({
  vm: { type: Object, required: true },
});

const emit = defineEmits([
  "select-reach",
  "export",
  "import",
  "finish",
  "resume",
  "back",
]);
</script>

<style scoped>
.lead__title {
  margin: 0;
  font-size: 26px;
  line-height: 1.15;
}

.lead__text {
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.5;
  text-wrap: pretty;
}

/* Les sections de la page, toutes coiffées à l'identique : la question de
   portée, le profil visé et ce qu'il engage, ce qui en sépare, ce que la mesure
   laisse de côté. La question n'en porte pas le titre — la carte porte le sien,
   en tête et en chemin, comme celle d'un domaine. */
.section {
  margin-top: 30px;
}

/* — ce que la phase produit —
   Le profil visé, nommé et détaché. Il tenait dans le coin droit d'une barre de
   panneau, en capitales de 10px, alors que c'est la réponse que l'écran vient de
   déduire. Le profil diagnostiqué est rappelé sous lui, au corps du hors-texte :
   c'est de la distance entre les deux que dépend tout ce qui suit. */
.verdict {
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

/* — la suggestion du cadrage —
   Sous le profil, au corps du hors-texte : elle éclaire la cible, elle ne la
   dispute pas. Le liseré du cas `above` reprend le gris des autres hors-textes
   de la page : marquer un écart n'est pas signaler une faute, et une couleur
   d'erreur ferait lire une déclaration légitime comme un défaut à réparer. */
.suggested {
  margin: 12px 0 0;
}

.suggested--apart {
  padding-left: 12px;
  border-left: 3px solid var(--color-neutral-300);
}

.suggested__line {
  margin: 0;
  font-size: 12px;
  color: var(--color-neutral-800);
}

.suggested__apart {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

.suggested__reasons {
  margin: 6px 0 0;
  padding-left: 16px;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

.intention {
  margin: 16px 0 0;
  font-size: 13px;
  line-height: 1.5;
  text-wrap: pretty;
}

/* La nature du passage se détache du reste par le seul filet vertical qui la
   tient : même corps, même couleur — c'est le texte de la page qui peut modifier
   une décision d'investissement. */
.passage {
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

/* Les attributs de cadrage empruntent la ligne des domaines, jamais leur bande
   de couleur : ce ne sont pas des domaines du modèle, et l'absence de bande est
   ce qui distingue à l'œil un écart déclaratif d'un écart mesuré. */
.domain--flat {
  border-left: 0;
  padding-left: 0;
}

.domain--flat:last-child {
  border-bottom: 0;
}

.conditions__lead {
  margin: 12px 0 16px;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

.conditions__unanswered {
  margin-top: 16px;
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
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.5;
  text-wrap: pretty;
}

/* Ce que la mesure laisse de côté, dans le même traitement que sur la page de
   résultats — ce sont les deux mêmes listes. Elles étaient deux panneaux pleins,
   du même poids visuel que l'écart : en retrait de corps et sans cadre, elles
   bornent la lecture sans la disputer. */
/* Deux colonnes tant que la place le permet : depuis que la bande borde la page,
   le contenu perd 280px et deux colonnes de hors-texte y deviennent étroites
   avant le point de rupture. Elles se replient donc à la mesure disponible
   plutôt qu'à la largeur de la fenêtre. */
.asides {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
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

.actions__finish {
  min-width: 120px;
}

@media (max-width: 900px) {
  .verdict__name {
    font-size: 24px;
  }

  .domain__ranks {
    margin-left: 0;
  }
}
</style>

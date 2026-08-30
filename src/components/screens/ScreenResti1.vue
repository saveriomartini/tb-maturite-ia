<template>
  <div class="summary">
    <div class="frame">
      <p class="frame__row">
        <span class="frame__label eyebrow">{{ vm.scope.label }}</span>
        <span class="frame__value">{{ vm.scope.value }}</span>
      </p>
      <p v-if="vm.scope.note" class="frame__note">{{ vm.scope.note }}</p>
    </div>

    <header class="verdict">
      <p class="verdict__line">
        <span class="verdict__eyebrow eyebrow">Profil diagnostiqué pour votre organisation :</span>
        <span class="verdict__name heading">{{ vm.acquiredLabel }}</span>
      </p>
      <p class="verdict__desc">{{ vm.acquiredDesc }}</p>
      <p v-if="vm.acquiredPosition" class="verdict__position">{{ vm.acquiredPosition }}</p>
    </header>

    <section class="section">
      <h2 class="section-head">L’échelle des paliers</h2>
      <div class="ladder">
        <div class="scale">
          <MaturityLadder
            :steps="vm.ladder"
            :line-label="vm.line.label"
            :note="vm.ladderNote"
            :focused="focusedGate"
            @focus="emit('focus-gate', $event)"
          />
        </div>

        <div class="ladder__body">
          <div class="line">
            <p class="line__eyebrow eyebrow">{{ vm.line.label }}</p>
            <p class="line__text">{{ vm.line.text }}</p>
          </div>

          <div class="target">
            <p class="target__eyebrow eyebrow">
              Profil visé<template v-if="vm.targetState.label"> : {{ vm.targetState.label }}</template>
            </p>
            <p class="target__text">{{ vm.targetState.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="vm.outOfScopeLabel || vm.pendingLabel" class="section">
      <h2 class="section-head">Ce que la mesure laisse de côté</h2>
      <div class="asides">
        <div v-if="vm.outOfScopeLabel" class="aside">
          <p class="aside__eyebrow eyebrow">Domaines déclarés hors périmètre</p>
          <p class="aside__list">{{ vm.outOfScopeLabel }}</p>
        </div>

        <div v-if="vm.pendingLabel" class="aside">
          <p class="aside__eyebrow eyebrow">Domaines restant à évaluer</p>
          <p class="aside__list">{{ vm.pendingLabel }}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-head">Par dimension</h2>
      <div class="panel">
        <DimensionRadar :dimensions="vm.radar.dimensions" :scale="vm.radar.scale" />
      </div>
    </section>
  </div>
</template>

<script setup>
// Synthèse des résultats : le profil atteint, ce sur quoi il porte, l'échelle
// des paliers, ce que la mesure laisse de côté, la lecture par dimension.
// Section haute de la page de résultats — le détail par domaine la suit sans
// changer d'écran, et la navigation appartient à la page.
//
// — la hiérarchie de la page —
// Le périmètre d'abord, en une ligne serrée sous le titre de la section : ce sur
// quoi la mesure porte, et ce qu'elle y a couvert. Il suivait le verdict, et un
// lecteur qui descend s'était déjà fait une opinion du profil quand il
// apprenait qu'il ne portait que sur une équipe et sur zéro domaine situé. Une
// borne posée après coup ne borne rien : elle se lit comme une réserve, pas
// comme la portée de ce qu'on vient de lire. Elle passe donc devant — au corps
// du hors-texte, en bande serrée, présente sans jamais concurrencer.
//
// Le verdict vient après, et reste au plus gros corps du parcours : c'est ce que
// quarante énoncés ont produit. Son intitulé et son nom tiennent désormais une
// seule ligne — l'intitulé à gauche, le nom aligné à droite —, ce qui laisse la
// ligne du périmètre juste au-dessus dans le même registre de lecture : deux
// lignes qui se répondent, l'une disant sur quoi, l'autre disant quoi. Sa
// description et sa position sur l'échelle de transformation le suivent : elles
// disent ce qu'il veut dire, et vivaient jusqu'ici dans la colonne de droite de
// l'échelle, où elles se lisaient comme un commentaire de l'échelle.
//
// Le reste se range en sections coiffées à l'identique. Les domaines hors
// périmètre et ceux restant à évaluer en forment une : ils bornaient la lecture
// de toute la page depuis le bas d'un panneau qui parlait d'autre chose.
//
// Ce que cette page ne décide pas : le profil visé. Il se déclare en phase
// d'ancrage, après cet écran, parce qu'on ne peut pas demander à une
// organisation jusqu'où elle veut aller avant de lui avoir montré où elle est.
// L'échelle ne porte donc la marque « cible » que si la question a déjà été
// répondue — au retour, par exemple. Elle le *dit* alors, plutôt que de laisser
// l'absence de marque parler : une échelle muette sur sa cible se lit comme une
// cible à zéro. Les quatre cas — non déclarée, plus haut, atteinte, sous le
// palier atteint — ont chacun leur phrase, aucun n'est un défaut silencieux.
//
// Le périmètre ouvre la page, avant le profil. Le modèle source évalue une
// organizational unit et non forcément l'entreprise entière : une restitution
// qui ne nomme pas son périmètre se lit comme un verdict sur tout. Il porte
// l'intitulé du cadrage — « Périmètre de l'évaluation » — parce que c'est la
// même question, et que deux noms pour un attribut obligeaient à refaire le
// rapprochement.
//
// La couverture est appendue à la même ligne, derrière la déclaration : combien
// de domaines ont été situés, combien restent à évaluer, combien ont été
// déclarés hors périmètre. Elle avait son intitulé propre — « Couverture », un
// mot que rien d'autre du parcours n'emploie — sur une deuxième ligne, où elle
// se lisait comme un second sujet. C'en est un seul : ce qu'on a prétendu
// couvrir, et ce qu'on a couvert. Sans ces trois nombres, le profil se lirait
// comme portant sur le modèle entier.
//
// Chaque palier porte son avancement — combien des domaines qu'il attend
// l'atteignent. Le ratio ne mesure pas une acquisition : celle-ci est un seuil,
// et un palier dont tous les domaines sauf un sont au rang n'est pas « presque
// acquis », il n'est pas acquis. Il dit de combien il s'en est fallu, ce qui est
// une autre information — et il ne peut pas dépasser son total. D'où l'absence
// de jauge : rien sur cette échelle ne se remplit par degrés, le repère de rang
// est plein ou vide, et une note sous la colonne dit ce que les nombres ne
// veulent pas dire.
//
// La ligne évolutif / révolutionnaire se trace entre le deuxième et le troisième
// palier. C'est la seule information de l'échelle qui dise que tous les crans ne
// se valent pas : les deux premiers posent l'IA sur des routines inchangées, les
// trois suivants supposent de refaire les routines. Elle ne dépend d'aucune
// réponse et se trace donc aussi sur une session vierge — c'est une propriété du
// modèle, pas un résultat.
//
// La dimension se lit sur deux nombres qui ne disent pas la même chose : la
// moyenne situe l'ensemble, le plancher dit ce qui la retiendrait si elle était
// un palier. Les deux sont rapportés au haut de l'échelle et jamais au rang
// visé : c'est de là que venait le « 3,1 / 3 » relevé en test.
//
// La lecture par dimension se donne deux fois, et ce n'est pas une redite : le
// radar et ses barres comparent les neuf dimensions entre elles — ce que la
// grille par bloc ne permet pas, ses dimensions étant réparties dans quatre
// encadrés —, et la grille par bloc garde le regroupement de restitution et les
// chiffres exacts. La figure situe, le tableau chiffre.
import DimensionRadar from '../DimensionRadar.vue'
import MaturityLadder from '../MaturityLadder.vue'

defineProps({
  vm: { type: Object, required: true },
  // Le palier dont le détail par domaine est focalisé plus bas. La synthèse ne
  // le retient pas : c'est la page qui compose l'échelle et le détail qui le
  // tient, elle seule voyant les deux.
  focusedGate: { type: Number, default: null }
})

const emit = defineEmits(['focus-gate'])
</script>

<style scoped>
/* — le verdict —
   Le nom du profil, au corps le plus fort de tout le parcours. Il portait 22px
   et l'intitulé « Votre profil : » à côté de lui, si bien qu'il pesait
   exactement autant qu'un nom de domaine dans le questionnaire. C'est la
   conclusion de tout le parcours de saisie : elle garde la plus grande taille.

   Intitulé et nom tiennent une ligne, l'un contre le bord gauche et l'autre
   contre le bord droit, alignés sur la même ligne de base. La ligne du
   périmètre, juste au-dessus, est bâtie de même — intitulé à gauche, valeur qui
   suit —, et les deux se lisent comme un couple : ce sur quoi porte la mesure,
   puis ce qu'elle conclut. L'écart de corps entre les deux dit lequel des deux
   est le résultat.

   La description du profil et sa position sur l'échelle de transformation le
   suivent immédiatement. Elles étaient dans la colonne de droite de l'échelle
   des paliers, où elles se lisaient comme un commentaire de l'échelle ; elles
   disent en réalité ce que le verdict veut dire, et c'est ici qu'elles le
   disent. */
.verdict {
  margin: 18px 0 0;
}

/* `space-between` et non une colonne fixe : le nom cherche le bord droit du
   texte, où l'œil le retrouve d'une restitution à l'autre quelle que soit la
   longueur de l'intitulé. `wrap` pour que le nom passe à la ligne plutôt que de
   se comprimer quand la place manque — il reste alors aligné à droite. */
.verdict__line {
  display: flex;
  gap: 8px 24px;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 0;
}

.verdict__eyebrow {
  color: var(--color-neutral-700);
}

.verdict__name {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 38px;
  line-height: 1.08;
  text-align: right;
  text-wrap: balance;
}

/* La description reprend le bord gauche et la largeur de lecture : elle commente
   le verdict, elle ne le prolonge pas à droite. */
.verdict__desc,
.verdict__position {
  max-width: 80ch;
}

.verdict__desc {
  margin: 14px 0 0;
  font-size: 14.5px;
  line-height: 1.5;
  text-wrap: pretty;
}

/* la position suit la description comme une seconde voix : même corps, couleur
   légèrement retirée, pour qu'on voie qu'elle ne vient pas de la même source
   sans avoir à le dire */
.verdict__position {
  margin: 12px 0 0;
  font-size: 14.5px;
  line-height: 1.5;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

/* — le cadrage de la lecture —
   Le périmètre déclaré, et ce que la mesure y a couvert. Ce n'est pas un
   résultat : c'est ce sur quoi le résultat porte. C'est la borne sans laquelle
   le verdict se lirait comme portant sur l'entreprise entière et sur le modèle
   entier — elle ne peut donc pas disparaître, et elle ouvre la section, avant le
   verdict qu'elle borne. En bande serrée entre deux filets, au corps du
   hors-texte : présente, jamais concurrente.

   Pas de marge haute : le titre coiffé de la section porte déjà son filet fort
   et son écart, et la bande vient s'y appuyer. Le filet supérieur de la bande
   reste, pour le cas où elle serait lue hors de cette page. */
.frame {
  padding: 10px 0;
  border-top: 1px solid var(--color-divider);
  border-bottom: 1px solid var(--color-divider);
}

.frame__row {
  display: flex;
  gap: 6px 14px;
  align-items: baseline;
  flex-wrap: wrap;
  margin: 0;
}

/* L'intitulé tient une colonne fixe : la valeur commence au même endroit d'une
   restitution à l'autre, et la note qui la commente s'aligne dessous. */
.frame__label {
  flex: none;
  min-width: 190px;
  color: var(--color-neutral-700);
}

.frame__value {
  font-size: 12px;
  color: var(--color-neutral-800);
}

/* Le périmètre non déclaré est le seul cas commenté : la note dit la lecture
   par défaut, et reste dans le registre du hors-texte — corps réduit, gris. */
.frame__note {
  margin: 5px 0 0;
  padding-left: 190px;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

/* Les sections de la page, toutes coiffées par .section-head : l'échelle des
   paliers, ce que la mesure laisse de côté, la lecture par dimension — puis le
   détail par domaine, sur la page qui compose celle-ci. */
.section {
  margin-top: 34px;
}

.ladder {
  display: grid;
  grid-template-columns: 380px 1fr;
  border: 2px solid var(--color-text);
}

/* Le fond de la colonne est explicite : l'étiquette de la ligne évolutif /
   révolutionnaire s'y découpe en masquant le trait derrière elle, et un fond
   hérité ne lui donnerait rien à masquer. Tout ce qui se passe à l'intérieur
   appartient à MaturityLadder. */
.scale {
  background: var(--color-neutral-100);
  border-right: 2px solid var(--color-text);
}

.ladder__body {
  max-width: 760px;
  padding: 20px 24px;
  background: var(--color-neutral-100);
}

/* La ligne, en toutes lettres. Elle se lit à côté de l'échelle qui la trace :
   le trait dit où elle passe, ce bloc dit pourquoi elle y passe. Encadrée à
   gauche comme la nature du passage à l'ancrage — même registre, celui d'un
   texte qui peut modifier une décision d'investissement. */
.line {
  padding-left: 12px;
  border-left: 2px solid var(--color-text);
}

.line__eyebrow {
  margin: 0 0 5px;
  color: var(--color-neutral-700);
}

.line__text {
  max-width: 80ch;
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  text-wrap: pretty;
}

/* Où en est la cible sur cette échelle — y compris quand il n'y en a pas
   encore. Le cas se dit toujours : une échelle sans marque de cible et sans
   phrase se lirait comme une cible à zéro. */
.target {
  margin-top: 16px;
}

.target__eyebrow {
  margin: 0 0 5px;
  color: var(--color-neutral-700);
}

.target__text {
  max-width: 80ch;
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

/* Ce que la mesure laisse de côté. Ces deux listes finissaient la colonne de
   droite de l'échelle, où elles closaient un panneau qui parlait d'autre chose.
   Elles ont leur propre section : elles bornent la lecture de toute la page, pas
   de l'échelle seule. En retrait de corps et sans cadre plein — c'est la limite
   d'un résultat, ce n'en est pas un. */
.asides {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}

.aside {
  min-width: 0;
  padding-left: 12px;
  border-left: 3px solid var(--color-neutral-300);
}

.aside__eyebrow {
  margin: 0 0 5px;
  color: var(--color-neutral-700);
}

.aside__list {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

@media (max-width: 900px) {
  /* Le nom du profil passe sous son intitulé plutôt que de se serrer contre
     lui, et reprend le bord gauche : à cette largeur, un nom aligné à droite
     sous un intitulé aligné à gauche ne se lit plus comme une ligne. */
  .verdict__name {
    flex-basis: 100%;
    font-size: 30px;
    text-align: left;
  }

  /* Empilé, l'intitulé du cadrage n'a plus de colonne à tenir : la valeur passe
     sous lui, et la note reprend le bord de la page. */
  .frame__label {
    min-width: 0;
  }

  .frame__note {
    padding-left: 0;
  }

  .ladder,
  .asides {
    grid-template-columns: 1fr;
  }

  .scale {
    border-right: 0;
    border-bottom: 2px solid var(--color-text);
  }

}
</style>

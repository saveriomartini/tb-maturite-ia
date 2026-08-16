<template>
  <div class="cadrage3">
    <TransformationQuestion
      :field="vm.transformationField"
      @select="emit('select-transformation', $event)"
    />

    <aside class="callout">
      <p class="callout__title heading">NB</p>
      <p class="callout__text">
        Décrire son organisation AVANT l'évaluation change tout : l'outil s'en sert pour vous
        proposer d'abord les areas de compétence qui comptent le plus pour vous, et vous n'avez
        pas à trancher vous-même par où commencer.
      </p>
      <p class="callout__text callout__text--warning">
        Ne rien indiquer ne bloque pas le diagnostic, mais vous fait parcourir les 25 areas du
        modèle. Chaque réponse en écarte celles qui ne vous concernent pas.
      </p>
    </aside>

    <div class="fork">
      <button type="button" class="btn btn-primary fork__describe" @click="scrollToForm">
        Décrire son organisation
      </button>
      <button type="button" class="btn btn-ghost" @click="emit('next')">
        Passer à l'évaluation
      </button>
    </div>

    <div ref="form" class="form">
      <ContextAttributeForm
        :groups="vm.groups"
        @select-option="(fieldId, value) => emit('select-option', fieldId, value)"
      />
    </div>

    <DescriptiveContext
      :fields="vm.descriptiveFields"
      :open="vm.showContext"
      :toggle-label="vm.contextToggleLabel"
      @select-option="(fieldId, value) => emit('select-option', fieldId, value)"
      @toggle="emit('toggle-context')"
    />
  </div>
</template>

<script setup>
// Cadrage du contexte. La question du degré de transformation ouvre l'écran :
// elle pose le profil visé, donc les areas que le diagnostic parcourra. Le
// formulaire qui suit ne fait que le restreindre — jamais le remonter — et
// l'écran ne montre pas ce qu'il produit : l'écart entre ce qu'on vise et ce
// que le contexte porte ne se discute qu'à la restitution.
//
// Le NB descend sous la question : il justifie le formulaire, et le formulaire
// vient après l'intention. Le contexte descriptif clôt l'écran, replié : il ne
// pèse sur rien.
//
// Le NB dit ce qu'on gagne à décrire son organisation et ce qu'on perd à ne pas
// le faire ; la bifurcation qui le suit rend les deux réponses également
// atteignables, sans faire défiler treize attributs pour trouver la sortie. Le
// pied de page garde le même départ vers l'évaluation : il conclut le
// formulaire rempli, celui-ci le contourne.
import { useTemplateRef } from 'vue'
import ContextAttributeForm from '../ContextAttributeForm.vue'
import DescriptiveContext from '../DescriptiveContext.vue'
import TransformationQuestion from '../TransformationQuestion.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['select-option', 'toggle-context', 'select-transformation', 'next'])

const form = useTemplateRef('form')

// Le retrait sous la barre collée est une affaire de mise en page : il vit dans
// la CSS (`scroll-margin-top`), pas dans un décalage calculé ici. Reste à dire
// s'il faut animer — une préférence système, que le navigateur seul connaît.
function scrollToForm() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  form.value?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}
</script>

<style scoped>
/* Le formulaire ne s'étale pas sur toute la largeur : ses champs restent sur
   deux colonnes lisibles, comme lorsqu'il partageait l'écran avec le panneau
   de recommandation. */
.cadrage3 {
  max-width: 1040px;
}

/* Le NB n'a plus de barre de gauche : le fond gris suffit à le détacher, et le
   texte court sur toute la largeur du bloc plutôt que sur une colonne étroite. */
.callout {
  margin-bottom: 28px;
  padding: 24px 28px;
  background: var(--color-neutral-100);
}

.callout__title {
  margin: 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.callout__text {
  margin: 10px 0 0;
  font-size: 19px;
  line-height: 1.45;
  text-wrap: pretty;
}

/* La bifurcation prolonge le NB : elle lui est collée en haut et prend l'air du
   formulaire qu'elle annonce. Les deux sorties se tiennent aux deux bords du
   formulaire, comme le pied de page tient les siennes : le saut se lit au bord
   droit, loin du chemin qu'il contourne. */
.fork {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: -12px 0 24px;
}

.fork__describe {
  min-width: 220px;
}

/* Le formulaire s'arrête sous la barre collée en haut de page, qui sinon
   recouvrirait son en-tête à l'arrivée du défilement. La marge suit les deux
   hauteurs de cette barre : avec les phrases des phases, puis sans elles. */
.form {
  scroll-margin-top: 148px;
}

/* Ce qu'il en coûte de ne rien répondre : même bloc, un cran plus bas dans la
   hiérarchie, séparé par un filet plutôt que par une couleur d'alerte. */
.callout__text--warning {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-divider);
  font-size: 15px;
}

/* Même point de rupture que l'en-tête, qui perd là les phrases de ses phases et
   raccourcit d'autant. */
@media (max-width: 900px) {
  .form {
    scroll-margin-top: 96px;
  }
}
</style>

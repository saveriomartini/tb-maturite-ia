<template>
  <div class="cadrage3">
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

    <TransformationQuestion
      :field="vm.transformation.field"
      :open="vm.transformation.open"
      :toggle-label="vm.transformation.toggleLabel"
      @select="emit('select-transformation', $event)"
      @toggle="emit('toggle-transformation')"
    />

    <ContextAttributeForm
      :groups="vm.groups"
      @select-option="(fieldId, value) => emit('select-option', fieldId, value)"
    />

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
// Cadrage du contexte. L'écran ne montre plus ce que le formulaire produit :
// la recommandation se calcule en arrière-plan et n'est expliquée qu'au palier,
// une fois la première série d'areas parcourue.
//
// Le NB qui justifie le formulaire lui est rattaché : il occupait une section à
// part, dont il fallait descendre pour atteindre les champs. La raison d'être et
// ce qu'elle justifie tiennent maintenant dans le même bloc.
//
// La question du degré de transformation coiffe le formulaire : ce qu'on veut
// devenir se demande avant ce qu'on est. Le contexte descriptif le clôt, avec
// le même gabarit pliable : ni l'un ni l'autre ne pèse sur le diagnostic, et ce
// qui l'encadre se replie pendant qu'on remplit ce qui compte.
import ContextAttributeForm from '../ContextAttributeForm.vue'
import DescriptiveContext from '../DescriptiveContext.vue'
import TransformationQuestion from '../TransformationQuestion.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['select-option', 'toggle-context', 'select-transformation', 'toggle-transformation'])
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

/* Ce qu'il en coûte de ne rien répondre : même bloc, un cran plus bas dans la
   hiérarchie, séparé par un filet plutôt que par une couleur d'alerte. */
.callout__text--warning {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-divider);
  font-size: 15px;
}
</style>

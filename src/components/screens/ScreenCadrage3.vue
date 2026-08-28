<template>
  <div class="cadrage3">
    <TransformationQuestion
      :field="vm.transformationField"
      @select="emit('select-transformation', $event)"
    />

    <div ref="form" class="form">
      <ContextAttributeForm
        :groups="vm.groups"
        @select-option="(fieldId, value) => emit('select-option', fieldId, value)"
      />
    </div>

    <DescriptiveContext
      :fields="vm.descriptiveFields"
      @select-option="(fieldId, value) => emit('select-option', fieldId, value)"
    />

    <AppDialog
      :open="asking"
      :eyebrow="vm.skipDialog.eyebrow"
      :text="vm.skipDialog.text"
      :actions="vm.skipDialog.actions"
      @action="answer"
      @close="dismiss"
    />
  </div>
</template>

<script setup>
// Cadrage du contexte. L'écran s'ouvre sur la question du degré de
// transformation, qui pose le profil visé, donc les areas que le diagnostic
// parcourra ; le formulaire qui suit ne fait que le restreindre — jamais le
// remonter — et l'écran ne montre pas ce qu'il produit : l'écart entre ce qu'on
// vise et ce que le contexte porte ne se discute qu'à la restitution. Les
// attributs qui décrivent l'organisation closent l'écran : ils ne pèsent sur
// rien, et leur en-tête le dit.
//
// Rien ne plaide plus ici pour le formulaire, et rien ne le contourne : la page
// pose ses questions et laisse le pied de page conclure, comme tous les autres
// écrans. Ce qu'on gagne à décrire son organisation ne se dit qu'au moment où
// l'on s'apprête à partir sans l'avoir fait — et une seule fois.
//
// Le départ vers l'évaluation reste donc au pied de page, mais son garde-fou vit
// ici : `requestNext` décide s'il faut d'abord avertir, la modale le demande, et
// le retour au formulaire se fait sur le bloc que ce composant tient déjà. C'est
// tout ce qu'il expose.
import { ref, useTemplateRef } from 'vue'
import AppDialog from '../AppDialog.vue'
import ContextAttributeForm from '../ContextAttributeForm.vue'
import DescriptiveContext from '../DescriptiveContext.vue'
import TransformationQuestion from '../TransformationQuestion.vue'

const props = defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits([
  'select-option', 'select-transformation', 'dismiss-warning', 'next'
])

const form = useTemplateRef('form')
const asking = ref(false)

// Le retrait sous la barre collée est une affaire de mise en page : il vit dans
// la CSS (`scroll-margin-top`), pas dans un décalage calculé ici. Reste à dire
// s'il faut animer — une préférence système, que le navigateur seul connaît.
function goToForm() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  form.value?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

function requestNext() {
  if (props.vm.warnOnSkip) {
    asking.value = true
    return
  }
  emit('next')
}

// Sortir de la modale, de quelque façon que ce soit — Échap compris — consomme
// l'avertissement : il dit ce que coûte un formulaire vide, pas ce que coûte
// chaque clic.
function dismiss() {
  asking.value = false
  emit('dismiss-warning')
}

function answer(action) {
  dismiss()
  if (action === 'describe') goToForm()
  else emit('next')
}

defineExpose({ requestNext })
</script>

<style scoped>
/* La largeur de lecture est celle de la page entière, pied de page compris :
   elle est posée sur `.tool1` dans ScreenTool1, faute de quoi la navigation
   déborderait des blocs qu'elle conclut. */

/* Le formulaire s'arrête sous la barre collée en haut de page, qui sinon
   recouvrirait son en-tête à l'arrivée du défilement. La marge suit les deux
   hauteurs de cette barre : avec les phrases des phases, puis sans elles. */
.form {
  scroll-margin-top: 148px;
}

/* Même point de rupture que l'en-tête, qui perd là les phrases de ses phases et
   raccourcit d'autant. */
@media (max-width: 900px) {
  .form {
    scroll-margin-top: 96px;
  }
}
</style>

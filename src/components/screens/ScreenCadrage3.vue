<template>
  <div class="cadrage3">
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
// Cadrage du contexte. L'écran ne pose plus que des attributs, et aucun n'est
// exigé : la seule question qui l'était — jusqu'où l'adoption doit transformer
// l'organisation — est passée en phase d'ancrage, où elle se pose après que les
// énoncés ont donné un sens au vocabulaire du modèle. Ce que ces attributs
// produisent ne s'affiche pas ici : ils bornent le profil que l'outil proposera
// de viser, et l'écart entre ce qu'on vise et ce que le contexte porte ne se
// discute qu'à l'ancrage. Les attributs qui décrivent l'organisation closent
// l'écran : ils ne pèsent sur rien, et leur en-tête le dit.
//
// Rien ne plaide plus ici pour le formulaire, et rien ne le contourne : la page
// pose ses questions et laisse le pied de page conclure, comme tous les autres
// écrans. Ce qu'on gagne à décrire son organisation ne se dit qu'au moment où
// l'on s'apprête à partir sans l'avoir fait — et une seule fois.
//
// Le garde-fou vit ici : `requestNext` décide s'il faut d'abord avertir, la
// modale le demande, et le retour au formulaire se fait sur le bloc que ce
// composant tient déjà. C'est tout ce qu'il expose.
//
// Il gardait le passage du cadrage à l'évaluation ; les deux étant désormais
// deux sections de la même page, ce passage n'existe plus, et le garde-fou est
// posé sur celui qui reste — le départ vers l'ancrage, où le profil visé se
// nomme et où ce que les attributs de contexte bornent devient visible.
//
// Le texte de la modale a suivi ce déplacement : il ne peut plus dire « avant
// l'évaluation », qui est faite quand la boîte s'ouvre, et le retour au
// formulaire remonte la page au lieu de la descendre.
import { ref, useTemplateRef } from 'vue'
import AppDialog from '../AppDialog.vue'
import ContextAttributeForm from '../ContextAttributeForm.vue'
import DescriptiveContext from '../DescriptiveContext.vue'
import { scrollToElement } from '../../composables/useAnchorScroll.js'

const props = defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['select-option', 'dismiss-warning', 'next'])

const form = useTemplateRef('form')
const asking = ref(false)

// Le retrait sous la barre collée est une affaire de mise en page : il vit dans
// la CSS (`scroll-margin-top`), pas dans un décalage calculé ici. Reste à dire
// s'il faut animer — une préférence système, que le navigateur seul connaît, et
// que le module de défilement porte désormais pour toute la page.
function goToForm() {
  scrollToElement(form.value)
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
   recouvrirait son en-tête à l'arrivée du défilement. La hauteur est le jeton
   partagé par toutes les cibles de défilement de l'outil — voir
   assets/tokens.css, qui dit pourquoi elle est déclarée et non mesurée. */
.form {
  scroll-margin-top: var(--header-height);
}
</style>

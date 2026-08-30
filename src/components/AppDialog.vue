<template>
  <dialog ref="dialog" class="dialog" @cancel.prevent="emit('close')">
    <p class="eyebrow dialog__eyebrow">{{ eyebrow }}</p>
    <p class="dialog__text">{{ text }}</p>

    <div class="dialog__actions">
      <button
        v-for="action in actions"
        :key="action.id"
        type="button"
        class="btn dialog__btn"
        @click="emit('action', action.id)"
      >
        {{ action.label }}
        <span v-if="action.arrow" class="dialog__arrow" aria-hidden="true">{{ action.arrow }}</span>
      </button>
    </div>
  </dialog>
</template>

<script setup>
// Modale de décision, commune à toutes celles de l'outil : un motif en surtitre,
// ce qui se joue en une phrase, et les sorties empilées. Aucune n'est mise en
// avant par un aplat : le clic qui a ouvert la modale est déjà une intention, la
// boîte ne fait que la confirmer ou l'échanger contre l'autre.
//
// Les sorties sont des données — `[{ id, label, arrow }]` — et l'appelant reçoit
// l'`id` qu'il a fourni. La modale ne connaît donc rien de ce qu'elle demande :
// le motif, les mots et les suites appartiennent à l'écran qui l'ouvre. Leur
// ordre, en revanche, est une convention de l'outil : ce qui ramène en arrière
// d'abord, ce qui poursuit ensuite — et c'est ainsi qu'elles se rangent de
// gauche à droite.
//
// L'élément natif `<dialog>` porte à lui seul ce qu'une modale doit tenir : fond
// bloquant, capture du focus, retour à l'appelant, fermeture par Échap. Le
// composant n'ouvre ni ne ferme de lui-même : `open` est la vérité, l'appelant
// la détient, et Échap remonte comme un événement plutôt que de fermer dans le
// dos du parent — sortir par Échap doit compter comme sortir.
import { useTemplateRef, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  eyebrow: { type: String, required: true },
  text: { type: String, required: true },
  actions: { type: Array, required: true }
})

const emit = defineEmits(['action', 'close'])

const dialog = useTemplateRef('dialog')

watch(
  () => props.open,
  isOpen => {
    const el = dialog.value
    if (!el) return
    if (isOpen && !el.open) el.showModal()
    else if (!isOpen && el.open) el.close()
  },
  { flush: 'post' }
)
</script>

<style scoped>
/* Même langage que les panneaux de l'outil : cadre noir de 2px, fond clair,
   aucun arrondi. La marge automatique recentre la boîte, que le navigateur
   place sinon en haut de la couche modale. La largeur est celle qu'il faut aux
   deux sorties les plus longues pour tenir côte à côte sur une ligne. */
.dialog {
  max-width: 520px;
  margin: auto;
  padding: 20px 24px 22px;
  border: 2px solid var(--color-text);
  border-radius: 0;
  background: var(--color-neutral-100);
  color: var(--color-text);
}

.dialog::backdrop {
  background: color-mix(in srgb, var(--color-text) 45%, transparent);
}

.dialog__eyebrow {
  margin: 0;
  color: var(--color-neutral-700);
}

.dialog__text {
  margin: 10px 0 0;
  font-size: 15px;
  line-height: 1.5;
  text-wrap: pretty;
}

/* Les deux sorties tiennent sur une ligne, aux deux bords de la boîte : le
   retour en arrière à gauche, ce qui poursuit le geste à droite — l'ordre de
   lecture de la page, et celui de la liste `actions`. Elles s'empilent si la
   ligne ne les tient plus. */
.dialog__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  margin-top: 20px;
}

.dialog__btn {
  padding: 10px 14px;
  border: 2px solid var(--color-text);
}

.dialog__btn:hover {
  background: color-mix(in srgb, var(--color-text) 8%, transparent);
}

/* La flèche dit où mène la sortie — ailleurs dans la page, en haut comme en bas,
   ou vers la suite du parcours. Une sortie qui ne mène nulle part, comme une
   annulation, n'en porte pas.
   Corps et fonte sont fixés ici plutôt qu'hérités du bouton : Archivo ne dessine
   pas ces signes, et la pile de repli peut les prendre à deux fontes différentes
   — les boutons se retrouvent alors avec des flèches d'œil inégal. La boîte d'un
   cadratin les cale en plus sur la même largeur, au même bord droit. */
.dialog__arrow {
  display: inline-block;
  width: 1em;
  font-family: system-ui, sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1;
  text-align: center;
}
</style>

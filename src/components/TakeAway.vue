<template>
  <section class="take">
    <h2 class="section-head">{{ vm.title }}</h2>
    <p class="take__lead">{{ vm.lead }}</p>

    <div class="take__rows">
      <article class="row">
        <div class="row__text">
          <p class="row__title heading">{{ vm.preview.title }}</p>
          <p class="row__note">{{ vm.preview.note }}</p>
        </div>
        <button type="button" class="btn btn-secondary row__action" @click="emit('preview')">
          {{ vm.preview.action }}
        </button>
      </article>

      <article class="row">
        <div class="row__text">
          <p class="row__title heading">{{ vm.files.title }}</p>
          <p class="row__note">{{ vm.files.note }}</p>

          <details class="contents">
            <summary class="contents__summary">{{ vm.contents.summary }}</summary>
            <div class="contents__body">
              <div v-for="row in vm.contents.rows" :key="row.kind" class="contents__file">
                <p class="contents__name">{{ row.title }}</p>
                <ul class="contents__list">
                  <li v-for="line in row.lines" :key="line">{{ line }}</li>
                </ul>
              </div>
              <p class="contents__note">{{ vm.contents.note }}</p>
            </div>
          </details>

          <div v-if="links.length" class="saved">
            <p class="saved__note">{{ vm.files.fallback }}</p>
            <p v-for="link in links" :key="link.kind" class="saved__line">
              <a class="saved__link" :href="link.url" :download="link.name">{{ link.name }}</a>
            </p>
          </div>
        </div>
        <button type="button" class="btn btn-secondary row__action" @click="save">
          {{ links.length ? vm.files.again : vm.files.action }}
        </button>
      </article>

      <article class="row">
        <div class="row__text">
          <p class="row__title heading">{{ vm.resume.title }}</p>
          <p class="row__note">{{ vm.resume.note }}</p>
          <p v-if="refusal" class="row__refusal" role="alert">{{ refusal }}</p>
        </div>
        <button type="button" class="btn btn-secondary row__action" @click="pick">
          {{ vm.resume.action }}
        </button>
        <input
          ref="file"
          class="row__input"
          type="file"
          accept="application/json,.json"
          tabindex="-1"
          aria-hidden="true"
          @change="chosen"
        >
      </article>
    </div>

    <AppDialog
      :open="candidate != null"
      :eyebrow="vm.dialog.eyebrow"
      :text="dialogText"
      :actions="vm.dialog.actions"
      @action="answer"
      @close="candidate = null"
    />
  </section>
</template>

<script setup>
// Le bloc « Emporter » de la phase d'ancrage : ce que l'évaluation laisse, et ce
// qu'on peut lui redonner. Trois sorties, une par ligne, chacune avec ce qu'elle
// produit écrit à côté d'elle.
//
// — pourquoi trois lignes et non trois boutons —
// Un bouton « Export » seul, comme celui qu'il remplace, ne dit ni ce qui sort
// ni où cela va. Ici chaque sortie porte sa phrase : l'une imprime, l'autre
// écrit deux fichiers sur le poste, la troisième en relit un. C'est la seule
// place du parcours où l'utilisateur décide de ce qui quitte son navigateur, et
// une décision demande de savoir sur quoi elle porte.
//
// — le clic qui produit deux fichiers —
// Les deux fichiers sont écrits par le même bouton, parce qu'ils décrivent la
// même session et qu'un choix à faire entre eux avant d'avoir vu ce qu'ils
// contiennent serait un choix posé trop tôt. Le navigateur, lui, peut n'en
// enregistrer qu'un : Chrome demande l'autorisation d'en enregistrer plusieurs,
// et la refuse parfois sans le dire. Les deux liens restent donc affichés après
// le clic, chacun sous son nom de fichier. Le repli est dans la page.
//
// Les URL d'objet sont révoquées à la première des deux occasions qui se
// présente — un nouveau clic, ou la disparition du bloc —, sans quoi le contenu
// des fichiers resterait en mémoire jusqu'au rechargement de l'onglet.
//
// — le fichier relu est jugé avant d'être confirmé —
// On ne demande pas de confirmer le remplacement d'une session par un fichier
// dont on ne sait pas encore s'il est lisible : le fichier est analysé au moment
// où il est choisi, et le refus, s'il y a lieu, est rendu avec son motif sans
// que rien n'ait été touché. La modale ne s'ouvre que sur un fichier valide, et
// dit alors ce qu'il va remplacer — y compris, pour un fichier de partage, les
// douze attributs de cadrage qu'il ne porte pas.
import { computed, onBeforeUnmount, ref, useTemplateRef } from 'vue'
import AppDialog from './AppDialog.vue'
import { SCREENS } from '../domain/navigation.js'
import { REFUSALS, SHARE, parseFile } from '../domain/session-file.js'
import { readFileText, revokeUrl, saveUrl, textUrl } from '../composables/useSessionFile.js'

const props = defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['preview', 'import'])

// Un clic sur le second lien ne doit pas suivre le premier d'assez près pour que
// le navigateur les prenne pour un même geste : il ne garderait que le premier.
const SECOND_FILE_DELAY = 200

const file = useTemplateRef('file')
const links = ref([])
const refusal = ref('')
const candidate = ref(null)

const dialogText = computed(() => {
  if (!candidate.value) return props.vm.dialog.text
  return candidate.value.kind === SHARE
    ? `${props.vm.dialog.text} ${props.vm.dialog.shareText}`
    : props.vm.dialog.text
})

function release() {
  links.value.forEach(link => revokeUrl(link.url))
  links.value = []
}

function save() {
  release()
  links.value = props.vm.downloads.map(entry => ({
    kind: entry.kind,
    name: entry.name,
    url: textUrl(entry.text)
  }))
  const [first, second] = links.value
  if (first) saveUrl(first.url, first.name)
  if (second) setTimeout(() => saveUrl(second.url, second.name), SECOND_FILE_DELAY)
}

function pick() {
  refusal.value = ''
  if (file.value) file.value.click()
}

async function chosen(event) {
  const chosenFile = event.target.files && event.target.files[0]
  // Le champ est vidé aussitôt : sans cela, rechoisir le même fichier après un
  // refus ne déclencherait aucun évènement et l'écran resterait muet.
  event.target.value = ''
  if (!chosenFile) return
  let text
  try {
    text = await readFileText(chosenFile)
  } catch {
    refusal.value = REFUSALS.unreadable
    return
  }
  const read = parseFile(text, SCREENS)
  if (!read.ok) {
    refusal.value = read.message
    return
  }
  refusal.value = ''
  candidate.value = read
}

function answer(action) {
  const read = candidate.value
  candidate.value = null
  if (action === 'resume' && read) emit('import', read.state)
}

onBeforeUnmount(release)
</script>

<style scoped>
.take__lead {
  max-width: 720px;
  margin: 0 0 20px;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

.take__rows {
  display: flex;
  flex-direction: column;
}

/* Les trois sorties partagent une ligne : ce qu'elle produit à gauche, le geste
   à droite, et un filet entre elles. Le filet est la seule séparation — trois
   encadrés donneraient trois panneaux là où il y a une liste de sorties. */
.row {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 0;
  border-top: 1px solid var(--color-divider);
}

.row:last-child {
  border-bottom: 1px solid var(--color-divider);
}

.row__text {
  min-width: 0;
}

.row__title {
  margin: 0;
  font-size: 13px;
  letter-spacing: normal;
}

.row__note {
  max-width: 560px;
  margin: 5px 0 0;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--color-neutral-800);
  text-wrap: pretty;
}

/* Le motif d'un refus se lit à la place du texte de la ligne, pas ailleurs : ce
   qui a été refusé, c'est le fichier qu'on vient de choisir ici. */
.row__refusal {
  max-width: 560px;
  margin: 8px 0 0;
  padding-left: 10px;
  border-left: 3px solid var(--color-accent);
  font-size: 11.5px;
  line-height: 1.45;
}

.row__action {
  flex: none;
}

/* Le champ de fichier natif n'est jamais montré : c'est le bouton qui porte le
   libellé et le style de l'outil. Il reste dans le document — et non masqué par
   `display: none` — parce qu'un champ retiré du flux ne s'ouvre plus au clic
   dans certains navigateurs. */
.row__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  border: 0;
  clip-path: inset(50%);
  overflow: hidden;
}

.contents {
  margin-top: 12px;
}

.contents__summary {
  cursor: pointer;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 800;
  color: var(--color-neutral-700);
}

.contents__body {
  max-width: 560px;
  margin-top: 10px;
  padding-left: 12px;
  border-left: 3px solid var(--color-neutral-300);
}

.contents__file + .contents__file {
  margin-top: 12px;
}

.contents__name {
  margin: 0;
  font-size: 11.5px;
  font-weight: 700;
}

.contents__list {
  margin: 4px 0 0;
  padding-left: 16px;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--color-neutral-800);
}

.contents__note {
  margin: 12px 0 0;
  font-size: 11px;
  line-height: 1.45;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

.saved {
  max-width: 560px;
  margin-top: 12px;
}

.saved__note {
  margin: 0;
  font-size: 11px;
  line-height: 1.45;
  color: var(--color-neutral-700);
  text-wrap: pretty;
}

.saved__line {
  margin: 6px 0 0;
  font-size: 11.5px;
}

.saved__link {
  color: var(--color-text);
}

@media (max-width: 700px) {
  .row {
    flex-direction: column;
    gap: 12px;
  }
}
</style>

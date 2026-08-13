# Repères Vue 3 pour ce dépôt

Aide-mémoire personnel, pas un document de décision (voir [DECISIONS.md](DECISIONS.md) pour
ça). Le dépôt utilise **Vue 3.5** avec la Composition API et `<script setup>` — la doc de
référence est donc [vuejs.org/guide](https://vuejs.org/guide/introduction.html), pas
`v2.vuejs.org` (Vue 2, Options API, obsolète et sans rapport avec le code ici).

`<script setup>` est du sucre syntaxique compilé pour la Composition API dans un composant
monofichier (SFC) : tout ce qui est importé ou déclaré au premier niveau du bloc devient
directement utilisable dans le `<template>`, sans `return` explicite ni objet `setup()`.

## Ce que le dépôt utilise, et où

| Concept | Où dans le code | Guide officiel |
|---|---|---|
| `reactive` (état de session) | `useMaturityTool.js` — un seul `reactive(state)` par session | [Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html) |
| `computed` (view-model par écran) | `useMaturityTool.js` — un `computed` par écran (`diag`, `resti1`, …), paresseux : seul l'écran affiché se recalcule | [Computed Properties](https://vuejs.org/guide/essentials/computed.html) |
| `watch` (persistance différée) | `useSessionStorage.js:134` — `watch(state, …, { deep: true })`, débouncé 200 ms avant écriture `localStorage` | [Watchers](https://vuejs.org/guide/essentials/watchers.html) |
| Composables | `useMaturityTool.js`, `useSessionStorage.js` — fonctions `useXxx()` qui encapsulent état + logique réutilisable, hors des composants | [Composables](https://vuejs.org/guide/reusability/composables.html) |
| `defineProps` / `defineEmits` | Systématique dans `src/components/**/*.vue` : un écran reçoit son view-model en `prop`, remonte les intentions en `emit`, ne mute jamais l'état directement | [Props](https://vuejs.org/guide/components/props.html), [Component Events](https://vuejs.org/guide/components/events.html) |
| Slots nommés avec contenu par défaut | `AppScreenNav.vue` — `<slot name="actions">` retombe sur un bouton « Suivant » si l'écran ne fournit rien | [Slots](https://vuejs.org/guide/components/slots.html) |
| `v-for` avec `:key`, `v-if` | Partout (listes d'areas, de goals, de practices) ; conforme à la règle de priorité A du Style Guide officiel | [List Rendering](https://vuejs.org/guide/essentials/list-rendering.html) |
| Liaisons de classe/style dynamiques | `:class="{ 'is-active': … }"`, `:style="{ background: dimension.color }"` (couleurs de dimension pilotées par les données) | [Class and Style Bindings](https://vuejs.org/guide/essentials/class-and-style-bindings.html) |
| `<style scoped>` | Chaque composant, sans exception — les motifs partagés vivent dans `assets/tokens.css` (voir DECISIONS.md, 12.08.2026) | [SFC `<style>`](https://vuejs.org/api/sfc-css-features.html) |
| `createApp(...).mount(...)` | `main.js`, une seule fois | [Creating an Application](https://vuejs.org/guide/essentials/application.html) |

## Écarts volontaires par rapport à un projet Vue générique

- **Pas de `v-model`.** Les champs de formulaire (`ContextField.vue`) sont des groupes de
  boutons `role="radio"` avec `@click="emit('select', …)"`, pas des `<input>` liés en
  bidirectionnel — cohérent avec la règle « prop en descente, emit en remontée » du composable
  vers l'écran.
- **Pas de Vue Router.** Le parcours en quatre phases est une machine à écrans dans
  `src/domain/navigation.js` (fonctions pures), pas des routes — il n'y a rien à
  bookmarker, l'état vit en mémoire (voir README, §1).
- **Pas de Pinia ni Vuex.** Un seul `reactive(state)` créé dans `useMaturityTool()`, passé aux
  écrans via leur view-model ; inutile d'ajouter une bibliothèque de state management pour un
  outil mono-session, sans backend.
- **Pas d'Options API.** Toutes les instructions et exemples de ce fichier ciblent la
  Composition API + `<script setup>` ; la doc `v2.vuejs.org` ou la page « Options API » du
  guide Vue 3 ne s'appliquent pas au code de ce dépôt.

## Hors périmètre de ce dépôt (guide officiel, non consulté ici)

Sections du guide Vue 3 volontairement ignorées, faute d'usage dans le code : Transition /
TransitionGroup / KeepAlive / Teleport / Suspense (pas d'animation ni de portail), Server-Side
Rendering (SPA statique déployée sur GitHub Pages), TypeScript (JS pur, voir `jsconfig`/ESLint),
Render Functions & JSX, Vue et Web Components, directives personnalisées, plugins.

## Conventions de code

`eslint-plugin-vue` applique le [Style Guide officiel de Vue](https://vuejs.org/style-guide/)
(voir README §2.6 et DECISIONS.md, 12.08.2026). `npm run lint:fix` corrige l'essentiel
automatiquement ; un push qui ne passe pas le lint ne se déploie pas.

# Style Guide Vue — conformité du dépôt

Référence : [vuejs.org/style-guide](https://vuejs.org/style-guide/) (Vue 3), pas
`v2.vuejs.org/v2/style-guide/` — ce dépôt est en Vue 3.5 / Composition API (voir
[VUE_GUIDE.md](VUE_GUIDE.md)). Le guide Vue 2 avait un format différent (rangé par priorité
A/B/C/D dans un unique long document) ; le guide Vue 3 garde ces quatre priorités mais les
répartit sur quatre pages. C'est cette version qui est auditée ci-dessous.

La majorité des règles de priorité A et B sont mécaniquement appliquées par
`pluginVue.configs['flat/recommended']` dans `eslint.config.js` — voir le commentaire en tête
de ce fichier et [DECISIONS.md](DECISIONS.md) (12.08.2026). Un push qui viole une règle
active ne passe pas `npm run lint` et ne se déploie pas (README §2.6). Les tableaux ci-dessous
distinguent donc « conforme parce que le lint l'impose » de « conforme par convention, non
vérifié automatiquement ».

## Priorité A — Essentiel (prévention d'erreurs)

| Règle | Conformité | Preuve |
|---|---|---|
| Noms de composants à plusieurs mots | ✅ Conforme, imposé par lint | `vue/multi-word-component-names` actif dans `eslint.config.js:30`, avec la seule exception `App` prévue par le guide lui-même |
| Props détaillées (`type`, éventuellement `required`/`validator`) | ✅ Conforme, imposé par lint | Aucun `defineProps([...])` (syntaxe tableau, non typée) dans tout `src/` ; toutes les déclarations sont `defineProps({ … })` avec `type` — ex. `AppScreenNav.vue:14-20` (`type: String, default`, plus un `validator` pour `align`) |
| `v-for` toujours avec `:key` | ✅ Conforme, imposé par lint | Les 37 occurrences de `v-for` du dépôt portent chacune un `:key` (`vue/require-v-for-key` dans le preset recommandé) |
| Ne jamais combiner `v-if` et `v-for` sur le même élément | ✅ Conforme, imposé par lint | `vue/no-use-if-v-for` dans le preset recommandé ; le filtrage se fait en amont, dans `src/domain` (`scopedAreas`, `gapGroups`) ou sur un élément distinct — ex. `ScreenDiag.vue:46` (`v-if` sur un `<div>` séparé du `<button v-for>` voisin) |
| Style encapsulé par composant (`<style scoped>`) | ✅ Conforme, non vérifié par lint | Tous les fichiers `.vue` portant un bloc `<style>` utilisent `scoped` (vérifié composant par composant) ; seul `MaturityTool.vue` n'a aucun style — c'est un pur aiguilleur vers l'écran courant, sans sortie visuelle propre. Cette règle n'est pas imposée par `eslint-plugin-vue` (pas de règle native pour ça) : la discipline est manuelle, documentée dans DECISIONS.md (12.08.2026) |

## Priorité B — Fortement recommandé

| Règle | Conformité | Preuve |
|---|---|---|
| Un composant par fichier | ✅ Conforme | Chaque `.vue` de `src/components/` déclare exactement un composant |
| Casse des noms de fichier SFC (PascalCase, cohérent) | ✅ Conforme | Tous en PascalCase : `AppHeader.vue`, `ScreenDiag.vue`, `ContextAttributeForm.vue`… aucune exception |
| Composants de base préfixés `Base`/`App`/`V` | N/A | Aucun composant « de base » générique (type `BaseButton`) : les primitives visuelles partagées (`.btn`, `.chip`, `.tag`) sont des classes CSS dans `assets/tokens.css`, pas des composants Vue — choix documenté dans DECISIONS.md |
| Composants étroitement couplés préfixés par le nom du parent | ⚠️ Partiel | `ContextField.vue` n'est utilisé que par `ContextAttributeForm.vue` mais ne porte pas son nom complet en préfixe ; le préfixe partagé `Context` marque tout de même la famille. Écart mineur, sans ambiguïté en pratique (11 fichiers, un seul usage du composant) |
| Ordre général → spécifique dans les noms | ✅ Conforme | `AppHeader`/`AppScreen`/`AppScreenNav` (Écran) ; `ScreenDiag`/`ScreenCadrage1`… (Screen) ; `ContextField`/`ContextAttributeForm` (Context) — le mot le plus général vient toujours en tête |
| Composants auto-fermants quand sans contenu | ✅ Conforme, imposé par lint | `vue/html-self-closing` dans le preset recommandé ; ex. `<GoalChecklist :goals="vm.goals" … />` (`ScreenDiag.vue:55`) |
| Casse des noms de composants dans les templates (PascalCase en SFC) | ✅ Conforme, imposé par lint | `vue/component-name-in-template-casing` fixé à `'PascalCase'` (`eslint.config.js:32`) |
| Casse des noms de composants en JS (PascalCase) | ✅ Conforme | Tous les `import Xxx from './Xxx.vue'` en PascalCase, cohérents avec le nom de fichier |
| Noms complets plutôt qu'abrégés | ❌ Non conforme (délibéré) | `ScreenDiag`/`ScreenDiagStart` abrègent « Diagnostic », `ScreenResti1/2/3` abrègent « Restitution ». Écart assumé pour la brièveté des imports dans `MaturityTool.vue` ; à mentionner comme tel plutôt qu'à corriger a posteriori, le renommage toucherait 9 fichiers pour un gain de lisibilité marginal |
| Casse des props (camelCase déclaré, kebab-case au passage) | ✅ Conforme | Prop `nextLabel` déclarée en camelCase (`AppScreenNav.vue:15`), passée en kebab-case `next-label="Commencer"` (`ScreenDiagStart.vue:13`) |
| Un attribut par ligne sur les éléments à plusieurs attributs | ⚠️ Délégué à Prettier, pas au lint Vue | `vue/max-attributes-per-line` explicitement désactivé dans `eslint.config.js:40`, avec la justification en commentaire : Prettier reformate à l'enregistrement, et les deux outils se contrediraient sinon. Le résultat visuel (un attribut par ligne dès que la balise dépasse la largeur) reste conforme à l'esprit de la règle |
| Expressions simples dans les templates | ✅ Conforme par construction | Toute la logique dérivée vit dans les `computed` de `useMaturityTool.js`, jamais dans le template — c'est la raison d'être du view-model par écran (DECISIONS.md, 12.08.2026) |
| Propriétés calculées simples | ✅ Conforme | Chaque `computed` de `useMaturityTool.js` correspond à un seul écran ou une seule dérivation nommée (`scoped`, `recommendation`, `acquired`, `gaps`…), pas de mega-computed |
| Valeurs d'attributs toujours entre guillemets | ✅ Conforme, imposé par lint | `vue/html-quotes` dans le preset recommandé |
| Raccourcis de directive (`:`, `@`, `#`) toujours utilisés | ✅ Conforme, imposé par lint | `vue/v-bind-style` et `vue/v-on-style` dans le preset recommandé ; aucun `v-bind:`/`v-on:` en toutes lettres dans `src/` |

## Priorité C — Recommandé

| Règle | Conformité | Preuve |
|---|---|---|
| Ordre des options d'un composant (`data`, `computed`, `methods`…) | N/A | Le dépôt n'utilise que la Composition API avec `<script setup>` : il n'existe pas d'objet d'options à ordonner (pas d'Options API, voir VUE_GUIDE.md) |
| Ordre des attributs d'un élément | ✅ Conforme dans l'ensemble | Motif observé de façon répétée : `v-for` / `v-if` → `:key` → attributs statiques (`type`, `class`) → attributs liés (`:class`, `:style`, `:disabled`) → évènements (`@click`) — voir par ex. `ScreenDiag.vue:6-17`, qui suit l'ordre Rendu de liste → Attribut unique → Autres attributs → Évènements du guide |
| Lignes vides entre options multi-lignes | N/A | Même motif que ci-dessus : sans objet d'options, la règle ne s'applique pas. Les blocs `<script setup>` du dépôt sont courts (imports, `defineProps`, `defineEmits`, quelques fonctions) |
| Ordre des balises de haut niveau d'un SFC, `<style>` en dernier | ✅ Conforme, systématique | Tous les `.vue` du dépôt suivent `<template>` → `<script setup>` → `<style scoped>`, sans exception — vérifié sur l'ensemble de `src/` |

## Priorité D — À utiliser avec prudence

| Règle | Conformité | Preuve |
|---|---|---|
| Éviter les sélecteurs d'élément dans les styles `scoped` | ✅ Conforme | Aucun sélecteur d'élément nu (`button {`, `p {`, `div {`…) trouvé dans les blocs `<style scoped>` du dépôt ; tous les styles ciblent des classes (`.context__score`, `.field__option`…). Non vérifié par `eslint-plugin-vue` (règle CSS, hors de son périmètre) — audit manuel |
| Éviter la communication implicite parent-enfant (`$parent`, mutation de prop) | ✅ Conforme | Aucune occurrence de `$parent`/`$refs.x =`/mutation de prop dans `src/` ; le flux est strictement prop-descendante / `emit`-remontante, choix documenté dans DECISIONS.md et détaillé dans VUE_GUIDE.md (« Écarts volontaires ») |

## À retenir pour le rapport

Deux écarts assumés valent d'être cités tels quels en soutenance plutôt que « corrigés » a
posteriori : les noms d'écran abrégés (`Diag`, `Resti`) contre la règle B9, et la délégation du
formatage multi-attributs à Prettier contre la règle B11. Les deux sont documentés ici avec leur
motif — c'est la même logique que le reste du dépôt : une convention n'est écartée que si le motif
tient la route en soutenance (voir DECISIONS.md, en-tête).

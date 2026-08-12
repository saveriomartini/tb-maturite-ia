# Journal des décisions structurelles

Une entrée par décision qui engage la suite. Date, décision, motif, alternative écartée.
Toute décision listée ici doit pouvoir être défendue en soutenance.

| Date | Décision | Motif | Alternative écartée |
|---|---|---|---|
| 30.07.2026 | Référentiel de base : Ozkaya et al. (2026), 8 dimensions et 25 capability areas | La grille des trois indicateurs transversaux (p. 82-83) fournit la sémantique de niveau, applicable à tout domaine | Mesurer directement les 31 critères consolidés : l'échelle aurait dû être inventée pour six d'entre eux |
| 30.07.2026 | Neuvième dimension ajoutée, un domaine et trois objectifs | Trois critères consolidés sont absents d'Ozkaya | Trois domaines distincts : 15 énoncés au lieu de 5, et hétérogène aux huit autres dimensions |
| 30.07.2026 | Un socle contient des dimensions entières | Deux décompositions comme conteneurs simultanés éclataient deux dimensions entre socles | Conserver les piliers Elia comme conteneurs |
| 30.07.2026 | Agrégation au minimum intra-axe, aucun score global | Le référentiel ne restitue jamais un nombre unique et récuse la lecture en échelle de conformité | Moyenne pondérée, compensatoire, à la manière de Bettoni |
| 30.07.2026 | Affichage du nombre de domaines par axe | Rend lisible le biais introduit par la règle du minimum | Pondérer les axes, ce qui contredirait le choix du minimum |
| 12.08.2026 | Séparation stricte règles / état / présentation : `src/domain` (fonctions pures), `src/composables` (état réactif), `src/components` (affichage, CSS en `<style scoped>`) | Les règles d'agrégation et de recommandation sont le cœur défendable du travail : elles doivent être lisibles et testables sans navigateur. Le style vivait auparavant dans des chaînes CSS assemblées en JavaScript, ce qui interdisait `:hover`, les media queries et rendait les vues opaques | Garder un unique composable produisant un view-model porteur du style ; conforme au style guide Vue (priorité A, « component-scoped styling ») mais impossible à relire |
| 12.08.2026 | Conventions de code déléguées au Style Guide officiel de Vue, appliquées par `eslint-plugin-vue` et vérifiées en intégration continue | Une référence externe et reconnue vaut mieux qu'un style maison ; les règles de priorité A (props typées, `v-for` avec clé, style encapsulé) sont précisément celles dont le non-respect était visible dans le code | Fixer les conventions dans le rapport uniquement : rien ne les aurait fait respecter |
| 12.08.2026 | Un view-model calculé par écran, transmis en `prop`, intentions remontées en `emit` | Les `computed` sont paresseux : seul l'écran affiché est recalculé, et chaque écran devient testable isolément | Un view-model global unique : tout se recalculait à chaque clic et chaque écran dépendait de l'ensemble de l'outil |
| | | | |

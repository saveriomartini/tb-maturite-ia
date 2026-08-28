# Prompt Claude Code — lot 2 : le calcul, la session, le parcours

À copier tel quel dans Claude Code, à la racine de `tb-maturite-ia`. Le lot 1 est livré : les 140
énoncés existent dans `src/data/statements.js`, mais **rien ne les consomme encore**. Cette tâche
les branche.

---

Contexte : dépôt `tb-maturite-ia`, outil de diagnostic de maturité d'adoption de l'IA pour des PME
de l'arc jurassien, travail de Bachelor. Lis d'abord `docs/logs/DECISIONS.md`, `docs/PERIMETRE.md`,
`docs/NIVEAU-CIBLE.md`, `src/domain/scoring.js`, `src/domain/model.js`, `src/domain/navigation.js`,
`src/composables/useSessionStorage.js` et `src/composables/useMaturityTool.js`.

L'unité de réponse du questionnaire change : on ne coche plus des pratiques, on **choisit un énoncé
parmi cinq par domaine**, ou l'on déclare le domaine **hors périmètre**. Tout le calcul, la session
et le parcours en découlent. C'est un lot lourd : traite les étapes **une par une, dans l'ordre**,
et montre-moi le diff après chacune.

Le dépôt doit rester exécutable à la fin du lot : `npm run build` passe, et le parcours se joue de
bout en bout. L'habillage visuel viendra ensuite ; ici, on vise le fonctionnement.

**Après chaque étape, cherche ce qui référence ce que tu viens de changer** avant de passer à la
suivante : valeurs d'options, constantes exportées, clés de session, chemins de fichiers cités dans
les commentaires. Les régressions de ce dépôt viennent des effets à distance, pas des étapes
elles-mêmes — au lot précédent, le retrait d'un attribut de contexte a laissé une quinzaine de
renvois périmés et modifié en silence le score des sessions déjà enregistrées.

## Les règles qui gouvernent tout ce lot

- **Un niveau de domaine** vaut 0 (non renseigné), 1 à 5 (l'énoncé choisi), ou hors périmètre.
- **Un palier L est acquis** si l'ensemble des domaines en périmètre dont le rang déclencheur est
  inférieur ou égal à L est non vide et que **tous** sont au niveau L ou au-dessus. Aucune
  compensation : le maillon faible fixe le palier. La garde actuelle contre `[].every()` doit
  survivre — un palier sans aucun domaine attendu n'est pas créditable, mais n'interrompt pas la
  montée.
- **Un domaine hors périmètre** sort du calcul et n'est jamais compté comme acquis ni comme
  manquant. Il est déclaré à part en restitution.
- **Les écarts** se mesurent contre le **palier cible**, groupés par palier intermédiaire.
- **Le tri des écarts** se fait par rang déclencheur croissant, puis par l'ordre du questionnaire.
  **Jamais par le retard constaté** : ce serait une priorisation, qui est hors périmètre.

## Étape 1 — `src/domain/scoring.js` : le nouveau calcul

Écris les fonctions pures suivantes. Elles reçoivent `answers` — une table `{ areaId: 1..5 | 'na' }`
— et ne lisent rien de l'état applicatif.

- `areaLevel(areaId, answers)` → `0` si non renseigné, `1..5` sinon. Un domaine hors périmètre ne
  rend pas de niveau : c'est `isOutOfScope` qui le dit.
- `isOutOfScope(areaId, answers)` → booléen.
- `inScopeAreas(areas, answers)` → les domaines qui comptent, hors périmètre exclus.
- `acquiredLevel(areas, answers, target)` → le palier acquis, selon la règle ci-dessus.
- `blockers(areas, answers, level)` → les domaines en périmètre de rang ≤ `level` dont le niveau
  est inférieur à `level`, **triés par rang déclencheur croissant puis par l'ordre du modèle**.
  Chaque entrée porte de quoi afficher l'écart : identifiant, nom, dimension, couleur, rang exigé,
  niveau actuel, et **l'énoncé du niveau visé** (`STATEMENTS[areaId]`, rang `level`).
- `blockersByGate(areas, answers, target)` → un groupe par palier intermédiaire, du palier suivant
  jusqu'à la cible incluse, chacun avec son niveau et ses domaines. Un domaine n'apparaît que dans
  le premier groupe qui le réclame.
- `toAssess(areas, answers)` → les domaines en périmètre restés à `0`. Ils ne sont **pas** des
  blocages : c'est une incomplétude de mesure, et ils se présentent à part.
- `gateProgress(areas, answers, level)` → `{ done, expected }` : combien de domaines attendus à ce
  palier l'atteignent. Sert à remplir l'échelle des paliers.
- `dimAverage(areas, answers, dimId)` et `dimFloor(areas, answers, dimId)` → moyenne et niveau
  minimal des domaines renseignés en périmètre de cette dimension ; `null` si aucun. Un domaine à
  `0` ne compte pas : ne pas avoir répondu n'est pas un niveau.

Retire ce qui n'a plus d'objet : `areaStats`, `blockTotals`, `missingGoalCount`, `gapGroups`,
`checkedGoalCount`, `practiceKey`, `goalKey`. Les critères et les pratiques restent dans
`model-data.json` et continuent d'être **affichés** — ils ne sont simplement plus une mesure.

Les indicateurs transversaux quittent aussi le calcul et la saisie : ils ont été absorbés dans la
rédaction des énoncés (la grille du § 5 de la source est devenue la grille de dérivation, voir
`docs/ENONCES.md`). Retire `areaIndicatorRanks`, `areaIndicatorAverage`, `blockIndicatorAverage` et
tout ce qui les appelle. `src/data/maturity-indicators.js` **reste** : c'est la référence de
rédaction, et l'écran d'information l'affiche.

## Étape 2 — `src/data/preparation.js` : reposer le seuil

Le profil « Préparation » se comptait en critères validés. Il n'y a plus de critères validés.

Attention au piège : l'énoncé de rang 1 décrit **l'absence**. Tout domaine renseigné est donc au
moins au niveau 1, et le premier palier serait acquis par quiconque répond — ce qui viderait
« Préparation » de son sens.

Applique une règle **provisoire**, isolée dans une constante nommée et une seule fonction, avec un
commentaire disant en toutes lettres qu'elle n'est pas arrêtée. Piste : « Préparation » vaut tant
qu'un nombre suffisant de domaines du premier rang restent au niveau 1, c'est-à-dire tant que
l'organisation a répondu sans que rien ne soit encore en place. Si tu vois mieux, argumente dans ton
compte rendu.

**N'écris aucune entrée dans `docs/logs/DECISIONS.md` pour cette règle.** Le seuil est une décision
qui m'appartient et qui n'est pas prise ; ton implémentation est un point de départ, pas un arbitrage.
Il en va de même partout ailleurs dans ce lot : tu signales les décisions, tu ne les consignes pas.

## Étape 3 — `src/domain/model.js` et `src/domain/navigation.js` : le parcours

Le niveau cible n'existe plus au moment du questionnaire — la question qui le fixe est désormais
posée en fin de parcours (`REACH_QUESTION` dans `src/data/transformation.js`). Donc :

- `orderedAreas(target)` disparaît. Les 28 domaines sont présentés dans **l'ordre du modèle**. Avec
  28 énoncés au lieu de 271 pratiques, une passe complète tient dans une séance : le mécanisme des
  séries n'a plus d'objet.
- Retire `wave`, `deferred`, l'écran `palier` et tout ce qui en dépend, `ScreenPalier.vue` compris.
- **Rétablis une quatrième phase, « Ancrage »**, après « Résultats ». Elle contient : la question de
  portée (`REACH_QUESTION`), le niveau cible qui en découle, l'écart entre intention et capacité, les
  domaines qui séparent de la cible, et l'export. Son sous-titre dit *préparer l'ancrage* — la phase
  s'arrête au seuil de la mise en œuvre.
- Mets `src/data/journey.js` à jour : quatre phases, et les textes de l'Évaluation qui parlent
  encore de valider des pratiques une par une.

## Étape 4 — `src/composables/useSessionStorage.js` : contrat v2

- `SCHEMA_VERSION` passe à 2, et ce serait urgent même sans `answers`. Le lot précédent a retiré
  l'option `program` de `scope`, remplacé les cinq identifiants de `ambition` et supprimé
  `regulatory` : `validForm` écarte silencieusement les valeurs devenues inconnues, et un attribut
  absent vaut `UNANSWERED_SCORE`, c'est-à-dire le score **maximal**. Une session enregistrée avant
  le lot 1 se recharge donc avec deux ou trois réponses perdues et une recommandation plus haute,
  sans le moindre message. Écris ce motif en commentaire : c'est lui qui justifie de jeter plutôt
  que de réinterpréter.
- `answers` remplace `checked` : validation stricte — un identifiant de domaine connu du modèle, une
  valeur qui est un entier de 1 à 5 ou la chaîne `'na'`. Tout le reste tombe silencieusement, comme
  aujourd'hui.
- `indicators` et `checked` sortent de l'instantané et de la validation.
- **Aucune migration depuis la v1** : un état de cases cochées ne se convertit pas en niveau, et
  aucune session n'est en production. Une v1 relue est effacée, comme le fait déjà le contrôle de
  version. Dis-le en commentaire.

## Étape 5 — `src/data/demo-sessions.js` et `src/domain/demo-session.js`

Les trois scénarios écrivent des pratiques validées et des rangs d'indicateurs ; il leur faut
désormais un niveau par domaine.

- Chaque scénario porte une table `answers` explicite, et **quelques domaines hors périmètre** au
  moins dans le cas de la PME qui consomme de l'IA sans en développer — c'est ce que la
  fonctionnalité sert à montrer.
- `mastered`, `partial`, `ranks`, `bias` et `wave` disparaissent.
- Chaque scénario porte aussi la **portée** qu'il déclare en phase d'ancrage.
- Contrainte de fond : les trois cas doivent continuer de tomber aux **trois positions
  différentes** de l'échelle de transformation — l'écart sous la ligne évolutif / révolutionnaire,
  l'écart qui la franchit, l'écart déjà refermé. C'est leur seule raison d'être. Vérifie-le en
  exécutant le calcul, ne l'estime pas, et donne-moi les trois résultats.

## Étape 6 — `useMaturityTool.js` et les écrans : rendre le parcours jouable

Le composable expose encore des view-models bâtis sur `checked` et sur les indicateurs. Reprends-les
pour qu'ils reposent sur `answers`. Ce qu'il faut, au minimum :

- un `StatementPicker.vue` : les cinq énoncés du domaine courant, cliquables, l'un sélectionné, plus
  un bouton **hors périmètre**. Un clic = une réponse. L'échelle entière reste visible ;
- `ScreenDiag` : le sélecteur en tête, puis la colonne de rappel — description, exemples d'artefacts,
  objectifs, et **les pratiques repliées** sous un libellé qui dit leur provenance, du type « les
  pratiques que la source associe à ce domaine ». Jamais « critères à remplir » : elles ne sont plus
  une liste à cocher. Retire `GoalChecklist.vue` et `MaturityIndicatorsForm.vue` ;
- la barre de domaines montre l'état de chacun : non renseigné, niveau, hors périmètre ;
- les écrans de restitution et l'export cessent de parler de critères validés et de pratiques
  manquantes ; ils disent le palier atteint, les domaines qui séparent de la cible avec l'énoncé
  visé, et les domaines hors périmètre ;
- deux états doivent être traités explicitement plutôt que de tomber dans un cas par défaut muet :
  la cible déjà atteinte — `PASSAGES.reached` porte déjà la phrase — et la cible située **sous** le
  palier atteint, qui n'est pas une erreur mais un résultat : soit l'ambition est sous-déclarée,
  soit l'organisation a construit plus que son intention n'exige.

Ne cherche pas la finition visuelle : les graphiques, l'échelle des paliers et la mise en page
appartiennent au lot suivant. Ce qui compte ici, c'est qu'une session se joue en entier sans erreur.

## Étape 7 — les tests

Le calcul est ce que la soutenance interrogera en premier, et il n'a aujourd'hui aucun filet. Ajoute
**Vitest** — seule dépendance nouvelle autorisée par ce lot — avec `npm run test`, et branche-le dans
le workflow de déploiement avant `build`.

Couvre au minimum : le palier au maillon faible ; un domaine hors périmètre exclu du calcul ; tous
les domaines hors périmètre, cas qui doit rendre 0 et non un palier acquis gratuitement par
`[].every()` ; le tri des bloquants ; la séparation entre bloquants et domaines à évaluer ; le
groupement par palier intermédiaire ; le rejet d'une session de schéma 1 ; et qu'**aucune valeur
affichée ne dépasse son total** — l'experte métier a relevé un « 3,1 / 3 » dans la restitution
actuelle, et un test vaut mieux que la supposition que le nouveau calcul l'a fait disparaître.

## Critères d'acceptation

- `npm run lint`, `npm run check:model:strict`, `npm run test` et `npm run build` sortent en 0.
- `npm run dev` : une session se joue en entier — cadrage, 28 domaines, résultats, ancrage, export —
  sans erreur de console.
- Plus aucune référence à `checked`, `practiceKey`, `goalKey`, `wave`, `deferred` ni aux fonctions
  d'indicateurs dans `src/`.
- `src/data/statements.js`, `src/data/model-data.json` et `src/data/maturity-indicators.js` ne sont
  pas modifiés.
- Les trois démonstrations produisent trois positions différentes sur l'échelle — chiffres à l'appui.
- Un domaine hors périmètre ne fait baisser aucun palier : vérifie-le sur un cas construit.
- Aucun tri d'écarts ne dépend du niveau constaté.

## Conventions du dépôt

Français, registre France Num, vocabulaire de l'interface et non du code — « domaine de capacité »,
« critère d'adoption ». Style des fichiers de `src/data/` et `src/domain/` : commentaires denses qui
expliquent le pourquoi. Respecte `docs/admin/VUE_STYLE_GUIDE.md` pour tout composant touché. Vitest
est la seule dépendance nouvelle autorisée. Pas de commit sans que je l'aie demandé ; montre-moi le
diff après chaque étape.

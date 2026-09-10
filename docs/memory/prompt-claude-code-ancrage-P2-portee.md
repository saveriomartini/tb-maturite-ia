# Ancrage — P2 : la portée visée devient une carte à cinq énoncés

Deux temps séparés par une **validation de Saverio**. L'étape 2a peut tourner pendant qu'il teste P4 et P1. L'étape 2b ne démarre qu'après son retour. Les règles communes du prompt P4 valent ici.

## Contexte

Le test pilote a trouvé la question « Portée visée » mal posée. Aujourd'hui, `ScreenAncrage.vue` la rend par `TransformationQuestion`, avec les options de `REACH_QUESTION` (`src/data/transformation.js`) : un libellé, et un détail derrière un « + ».

Décision retenue :

- La portée se présente **comme un domaine** : cinq énoncés, un seul retenu, avec le composant des domaines du questionnaire repris tel quel.
- La carte prend la couleur de la dimension stratégique 1.
- Les cinq énoncés sont dérivés **des cinq profils d'Ozkaya et al. (2026), mis en parallèle avec les cinq degrés de Venkatraman (1994)**.

Cette décision amende le point 1.11 du BACKLOG. Celui-ci voulait que la question porte sur la portée et jamais sur le profil, pour éviter que l'utilisateur nomme lui-même la cible que l'outil lui renvoie. D'où la contrainte ci-dessous : **aucun nom de profil ni de degré dans les énoncés**.

---

## Étape 2a — proposition de textes, sans toucher à `src/`

Crée `docs/proposals/portee-enonces.md`, qui contient :

1. **Pour chaque rang n = 1..5**, un tableau de dérivation à trois colonnes :
   - la description du niveau d'Ozkaya et al., citée depuis `src/data/model-data.json`, avec le chemin exact du champ ;
   - le degré de Venkatraman, repris depuis `TRANSFORMATION_DEGREES` : `name`, `reach`, et la phrase clé de `position` ;
   - l'actuel `REACH_QUESTION.options[n]`, soit `label` et `detail`.
2. **Un énoncé proposé par rang**, avec une ligne qui dit ce qu'il prend à chaque source.
3. **Contraintes de rédaction**, à vérifier et à cocher pour chaque énoncé :
   - [ ] même forme que les énoncés des domaines : suivre `docs/ENONCES.md` et les conventions de `src/data/statements.js`, en indiquant la règle suivie ;
   - [ ] décrit une situation **souhaitée**, compréhensible sans connaître le modèle ;
   - [ ] cumulatif : l'énoncé n suppose les précédents ;
   - [ ] aucun nom de profil, de degré, de source, aucun numéro de rang, jamais « Venkatraman » ;
   - [ ] longueur comparable aux énoncés des domaines ; donne le nombre de mots de chacun ;
   - [ ] le défaut connu des énoncés (110 sur 140 commencent par « Nous ») n'est pas reproduit sans le signaler.
4. **Le titre de la carte**, c'est-à-dire la question posée au-dessus des énoncés, avec trois variantes. Point d'attention : la carte ressemblera à un domaine du questionnaire, alors que tous les domaines demandent la situation **actuelle**. Le titre doit rendre impossible de répondre sur le présent.
5. **Le sort du `hint`** actuel (« Décrivez la situation que vous souhaitez atteindre… ») : le garder sous la carte, le fondre dans le titre, ou le supprimer. Donne une recommandation argumentée.
6. **Le chemin affiché en tête de carte**, l'équivalent du « bloc · dimension » des domaines : deux variantes.

Puis **arrête-toi**. Ne modifie aucun fichier de `src/` à cette étape.

---

## Étape 2b — intégration, après validation

Saverio te transmet les énoncés, le titre et le chemin validés, éventuellement réécrits par lui. Utilise **exactement** ces textes.

### 1. Données — `src/data/transformation.js`

- `REACH_QUESTION.options` : chaque option garde `n` et reçoit `text` (l'énoncé validé). Retire `label` et `detail` s'ils ne servent plus nulle part, après avoir vérifié tous les usages, export compris.
- Mets à jour `question` et `hint` selon la validation.
- Réécris le commentaire d'en-tête de la question de portée. Il doit dire que les énoncés dérivent des profils d'Ozkaya mis en parallèle avec Venkatraman, renvoyer à `docs/proposals/portee-enonces.md`, et conserver la règle qui n'a pas changé : aucun nom de profil dans ce qui s'affiche.

### 2. Composant — reprendre la carte des domaines

- Dans `ScreenDiag.vue`, la carte d'un domaine est écrite en ligne : bandeau de couleur, chemin, titre, `StatementPicker`, rappel. **Extrais-la** dans `src/components/DomainCard.vue`, sans aucun changement de rendu ni de comportement dans `ScreenDiag`. Garde les ancres, l'observateur de défilement, les replis « définition » et « exemples d'artefacts », et `scroll-margin-top`.
  - Si l'extraction menace l'un de ces comportements, n'extrais pas. Réutilise `StatementPicker` et les classes de la carte dans l'Ancrage, puis signale-le.
- Rends optionnelles, par des props ou des slots, les parties sans objet pour la portée : rang attendu (`requiredLabel`), définition, exemples d'artefacts.
- `StatementPicker.vue` : rends `outOfScope` optionnel. Sans lui, pas d'interrupteur. Pour les domaines, le rendu reste identique.

### 3. View-model — `ancrage.reachCard`

Il remplace `reachField` et reproduit la forme de `picker` des domaines :

- `question` ;
- `color` : la couleur de la dimension stratégique 1, lue depuis le modèle et jamais codée en dur ;
- `statements` : `{ value, text, active, reached }`, avec `reached` pour les rangs sous l'énoncé retenu, comme pour les domaines ;
- pas d'`outOfScope` ;
- le chemin et le titre validés.

Le clic appelle `actions.selectReach`. Recliquer l'énoncé retenu annule la portée, comme aujourd'hui.

### 4. Isolation — la portée n'est pas un domaine

La réponse reste dans `state.transformation`. Elle n'apparaît dans aucun des éléments suivants :

- `state.answers` ;
- `EVALUABLE_AREAS` ;
- la barre des 28 domaines ;
- la couverture ;
- le radar ;
- `acquiredLevel` ;
- l'export de la liste des domaines.

L'export continue de porter la cible comme aujourd'hui, avec le nom du profil.

### 5. Nettoyage

Retire `TransformationQuestion` de l'Ancrage. S'il n'est plus utilisé nulle part, supprime le composant, ainsi que les branches de `ContextField`, par exemple `pinActive`, qui n'existaient que pour lui. Vérifie tous les usages avant de supprimer.

### 6. Tests

- `reachCard` : 5 énoncés, au plus un `active`, `reached` cohérent, pas de `outOfScope`.
- `selectReach(n)` écrit `state.transformation = n`, et le reclic annule.
- `state.answers` ne contient jamais de clé de portée ; le nombre de domaines évaluables reste 28.
- `StatementPicker` monté sans `outOfScope` ne rend pas d'interrupteur.
- `ScreenDiag` : rendu inchangé après extraction de `DomainCard`.
- Aucun énoncé de portée ne contient un nom de `LEVELS` ou de `TRANSFORMATION_DEGREES`. Ajoute ce test : c'est la règle de 1.11 qui survit.

### 7. Documentation

- `docs/logs/BACKLOG.md` : sous 1.11, une ligne qui renvoie à ce commit et à `docs/proposals/portee-enonces.md`.
- `docs/logs/DECISIONS-brouillon.md` : une ligne de faits.

## Compte rendu attendu

- Pour l'étape 2a : le fichier de proposition, et rien d'autre.
- Pour l'étape 2b : les fichiers modifiés, `DomainCard` extrait ou non (et pourquoi), les composants supprimés, le résultat des quatre commandes, une capture de la carte de portée à côté d'une carte de domaine.

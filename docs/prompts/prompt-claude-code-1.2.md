# Prompt Claude Code — tâches 1.2 et 1.2b

À copier tel quel dans Claude Code, à la racine de `tb-maturite-ia`. La tâche 1.1 doit être faite
(`src/data/statements.js` et `scripts/check-model.js` existent).

---

Contexte : dépôt `tb-maturite-ia`, outil de diagnostic de maturité d'adoption de l'IA, travail de
Bachelor. Lis d'abord `docs/DECISIONS.md`, `docs/PERIMETRE.md`, `src/data/maturity-indicators.js` et
l'en-tête de `src/data/statements.js`.

L'unité de réponse du questionnaire est désormais un **énoncé descriptif choisi parmi cinq** par
domaine de capacité : cent quarante énoncés à rédiger, vingt-huit domaines. Je les écris moi-même.
Cette tâche produit le **guide de rédaction** qui rend cette écriture mécanique et traçable :
`docs/ENONCES.md`.

## Règle absolue

**Tu n'écris aucun énoncé de questionnaire, pas même à titre d'exemple.** Ces phrases sont du contenu
d'auteur et la déclaration d'usage IA du README §5 en dépend. Partout où le guide appelle un énoncé,
tu laisses un emplacement vide identifié — jamais une proposition, ni une ébauche, ni une
« suggestion à adapter ». Le guide, lui, est de la méthode : tu le rédiges entièrement.

## Ce que `docs/ENONCES.md` doit contenir

**1. Pourquoi ce document.** L'énoncé descriptif à cinq niveaux est la méthode annoncée dans
`PERIMETRE.md` et fondée sur Jeanneret Medina et al. (2024). Le guide existe pour que les cent
quarante énoncés soient une *dérivation traçable* de la source et non un exercice d'auteur — c'est ce
qui permettra de répondre en soutenance à la question « d'où viennent vos énoncés ? ».

**2. La grille de dérivation, extraite de `maturity-indicators.js`.**
Un tableau à cinq lignes (les niveaux) et quatre colonnes : Responsabilité, Planification,
Ressources, puis une colonne « idée commune du niveau ». Les trois premières colonnes reprennent
littéralement les énoncés déjà traduits dans ce fichier — ne les reformule pas. La quatrième est la
synthèse déjà retenue :

```
1  absence — rien d'assigné, rien de planifié, rien d'alloué régulièrement
2  existence désignée — des rôles, un plan, un budget pour ce domaine
3  boucle de mesure — ce qui est mesuré change la conduite
4  reproductibilité au-delà du premier cas — hors de l'équipe qui a lancé
5  anticipation — les choix servent une stratégie et des scénarios à venir
```

Explique sous le tableau ce que la lecture en colonnes montre : les trois indicateurs ne disent pas
trois choses différentes, ils disent la même chose dans trois registres — qui en répond, comment
c'est réglé, avec quels moyens. La sémantique de niveau ne dépend donc pas du domaine, et c'est cette
uniformité qui rend commensurable la comparaison entre domaines sur laquelle repose la règle du
minimum (voir l'entrée correspondante de `DECISIONS.md`).

**3. La méthode, en quatre gestes.**

- fixer l'idée du niveau, depuis la colonne de synthèse ;
- choisir le registre qui discrimine pour ce domaine. Heuristique : gouvernance, conformité, IA
  responsable → Responsabilité ; cycle de vie des données, qualité, tests → Planification ;
  compétences, architecture, infrastructure → Ressources ;
- écrire la manifestation observable de ce registre à ce niveau, dans le vocabulaire du domaine —
  jamais la phrase de la grille recopiée, et jamais les trois registres empilés ;
- vérifier par le test de fausseté : la phrase peut-elle être vraie alors que l'idée du niveau est
  fausse ? Si oui, elle décrit autre chose.

**4. Les contraintes de forme.** Une phrase. Vingt-cinq mots au plus. Présent de l'indicatif, forme
active — l'experte a explicitement demandé de quitter le passif. Situation observable, pas intention
ni capacité. Tranchable par un dirigeant de PME sans consultant ni audit : si répondre suppose une
enquête interne, l'énoncé est mal écrit. Registre France Num, français professionnel de comité de
direction, KPI et ROI conservés — le même que le reste du modèle.

**5. Deux difficultés à traiter explicitement, avec ce que le rédacteur doit faire.**

- *Le niveau 4 parle de services que la cible n'a pas.* « De la même façon dans tous les services »
  ne veut rien dire dans une PME de douze personnes ; `maturity-indicators.js` documente déjà ce
  raccourci de traduction sans résoudre le fond. L'idée réelle du niveau 4 est la reproductibilité
  au-delà du premier cas : elle se rend par « d'un cas d'usage à l'autre » ou « hors de l'équipe qui
  l'a lancé », pas par une géographie de départements.
- *Le niveau 1 décrit l'absence.* Conséquence : tout domaine renseigné est au moins au niveau 1, donc
  le premier palier est acquis par quiconque répond. Signale que le seuil du profil « Préparation »
  (`src/data/preparation.js`) est à reposer en conséquence et que la décision n'est pas encore prise
  — trois pistes ouvertes : Préparation définie sur le nombre de domaines encore au niveau 1,
  Préparation abandonnée, ou niveau 1 décrivant l'exploration naissante plutôt que l'absence, au prix
  d'un écart avec la grille.

**6. Le contrôle de relecture.** Un énoncé de niveau *n* qui ne dit rien de ce que la ligne *n* de la
grille exige est à réécrire. Ce contrôle se fait bloc par bloc, pas énoncé par énoncé. Rappelle aussi
`npm run check:model` et `npm run check:model:strict`.

**7. Exemple travaillé — A1, à compléter par moi.** Reproduis les cinq rangs du domaine A1
« Élaboration de la stratégie IA », avec pour chacun : la cellule de grille instanciée, le registre
retenu, et une ligne vide pour l'énoncé. C'est un gabarit, pas une proposition — les cinq lignes
d'énoncé restent vides et signalées comme telles.

**8. Feuille de route de rédaction.** Un tableau des vingt-huit domaines dans l'ordre de
`model-data.json` : identifiant, nom, palier d'exigence, bloc, et une colonne « registre retenu »
vide que je remplirai. Génère-le depuis les données, ne le recopie pas de mémoire.

## Critères d'acceptation

- `docs/ENONCES.md` créé, en français, dans le registre des autres documents de `docs/`.
- Aucun énoncé de questionnaire rédigé nulle part dans le fichier.
- Les colonnes de la grille reprennent littéralement `maturity-indicators.js`.
- Le tableau des vingt-huit domaines correspond exactement à `model-data.json`.
- `npm run lint` sort en 0. Aucun fichier de `src/` modifié.

## Conventions du dépôt

Français, registre des documents existants dans `docs/` — le pourquoi avant le quoi, phrases
complètes, pas de listes à puces télégraphiques. Aucune dépendance nouvelle. Pas de commit sans que
je l'aie demandé ; montre-moi le fichier d'abord.

# Prompt Claude Code — rédaction des 140 énoncés (POC)

Remplace le prompt précédent de feuille de route. À copier tel quel dans Claude Code, à la racine de
`tb-maturite-ia`. La tâche 1.1 doit être faite : `src/data/statements.js` existe avec ses 28 domaines
et ses 140 emplacements vides.

---

Contexte : dépôt `tb-maturite-ia`, outil de diagnostic de maturité d'adoption de l'IA pour des PME de
l'arc jurassien, travail de Bachelor. Lis d'abord `src/data/model-data.json`,
`src/data/maturity-indicators.js`, l'en-tête de `src/data/statements.js`, `docs/DECISIONS.md` et
`docs/PERIMETRE.md`.

L'unité de réponse du questionnaire est un **énoncé descriptif choisi parmi cinq** par domaine de
capacité. Vingt-huit domaines, cent quarante énoncés. Objectif de cette tâche : **écrire les cent
quarante**, pour obtenir une version jouable de bout en bout. Ce premier jet sera ensuite retravaillé
avec la direction de travail et l'experte métier — vise donc une qualité de brouillon soutenable, pas
un remplissage : chaque phrase doit pouvoir être lue à voix haute devant un comité de direction sans
qu'on ait à l'excuser.

## Comment un énoncé se construit

Chaque énoncé instancie, pour son domaine, la ligne de son niveau dans la grille des trois
indicateurs transversaux du §5 de la source, reprise dans `maturity-indicators.js`. La sémantique de
niveau ne dépend pas du domaine :

```
1  absence — rien d'assigné, rien de planifié, rien d'alloué régulièrement
2  existence désignée — des rôles, un plan, un budget pour ce domaine
3  boucle de mesure — ce qui est mesuré change la conduite
4  reproductibilité au-delà du premier cas — hors de l'équipe qui a lancé
5  anticipation — les choix servent une stratégie et des scénarios à venir
```

Les trois indicateurs — Responsabilité, Planification, Ressources — ne disent pas trois choses
différentes : ils disent la même chose dans trois registres, qui en répond, comment c'est réglé, avec
quels moyens. **Choisis un seul registre par domaine** et tiens-le sur les cinq niveaux. Empiler les
trois donne des phrases de trente-cinq mots, identiques d'un domaine à l'autre.

Heuristique de choix : gouvernance, conformité, IA responsable, partenariats → Responsabilité ; cycle
de vie des données, qualité, tests, processus → Planification ; compétences, budget, architecture,
infrastructure → Ressources. Les `exampleArtifacts` du domaine tranchent souvent : des budgets et des
plans de formation appellent Ressources, des politiques et des comptes rendus de gouvernance
appellent Responsabilité.

## Contraintes de forme, toutes obligatoires

- **Première personne du pluriel, voix active.** « Nous avons défini le périmètre d'adoption… »,
  jamais « le périmètre est défini ». L'experte a explicitement demandé de quitter le passif. Présent
  de l'indicatif, ou passé composé quand l'état résulte d'un acte accompli.
- **Une phrase, vingt-cinq mots au plus.**
- **Une situation observable**, pas une intention ni une capacité. Tranchable par un dirigeant de PME
  sans consultant ni audit : si répondre suppose une enquête interne, l'énoncé est mal écrit.
- **Le niveau 1 décrit une absence sans reproche.** C'est la réponse que donnera la majorité des PME
  sur la majorité des domaines : elle doit se cocher sans humiliation. « Nous n'avons encore désigné
  personne pour… » et non « Nous ne faisons rien ».
- **Le niveau 4 ne parle jamais de services ni de départements.** La grille le formule par
  l'uniformité entre services, ce qui ne veut rien dire dans une PME de douze personnes. L'idée réelle
  est la reproductibilité au-delà du premier cas, et sa formulation dépend du domaine : d'un cas
  d'usage à l'autre, hors de l'équipe qui l'a lancé, d'un fournisseur au suivant, d'un jeu de données
  au suivant. Choisis-la par domaine.
- **Deux niveaux voisins doivent être distinguables** par un lecteur qui les compare. Applique à
  chaque énoncé le test de fausseté : la phrase peut-elle être vraie alors que l'idée du niveau est
  fausse ? Si oui, elle décrit autre chose.
- **Ne recopie pas la grille.** « Des rôles sont désignés pour atteindre les critères du domaine » est
  la phrase générique de l'indicateur, pas un énoncé. Écris ce que ça donne dans ce domaine-là, avec
  son vocabulaire propre — celui de ses critères d'adoption, de ses pratiques et de ses artefacts.
- **Varie la syntaxe entre domaines.** Le risque principal de cette tâche est de produire vingt-huit
  fois le même squelette de phrase avec un complément différent. Relis chaque bloc dans son ensemble :
  si les cinq énoncés de A1 et ceux de A2 se calquent, réécris.
- **Registre France Num** : français professionnel de comité de direction. KPI et ROI conservés.
  Aucun anglicisme au-delà de ceux que le modèle emploie déjà. Vocabulaire de l'interface — « domaine
  de capacité », « critère d'adoption » — et non celui du code.

## Ce que tu produis

Les cent quarante `text` de `src/data/statements.js`, remplis. Ne change pas la structure du fichier,
ni les clés, ni les commentaires de repérage, ni `STATEMENT_RANKS`.

Au-dessus de chaque domaine, ajoute une ligne de commentaire qui trace ta décision, pour que je
puisse l'auditer et la changer :

```js
// registre : Ressources · niveau 4 rendu par « d'un cas d'usage à l'autre »
```

**Ne touche pas à `src/data/model-data.json`** : c'est le report littéral de la source, et c'est ce
qui rend le modèle défendable.

## Méthode de travail

Procède **bloc par bloc** dans l'ordre du modèle — Strategy (A1–A7), Stakeholders (A8–A12), Business
(A13–A18), Technology (A19–A28) — et arrête-toi après chaque bloc pour me montrer le diff. Je corrige
le ton sur le premier bloc ; les trois suivants doivent en hériter.

Avant d'écrire un domaine, lis ses `goals`, ses `practices` et ses `exampleArtifacts` dans
`model-data.json` : c'est là que se trouve le vocabulaire juste.

## Critères d'acceptation

- `npm run check:model:strict` sort en 0 et annonce 140/140.
- `npm run lint` sort en 0. `npm run build` passe.
- `git diff --stat` ne montre que `src/data/statements.js`.
- Aucun énoncé ne dépasse vingt-cinq mots — vérifie-le, ne l'estime pas.
- Aucun énoncé de niveau 4 ne contient « service », « département » ni « filiale ».
- Aucune phrase à la voix passive dans les cent quarante.
- Les cinq énoncés d'un même domaine se distinguent deux à deux.

## Conventions du dépôt

Français. Aucune dépendance nouvelle. Pas de commit sans que je l'aie demandé ; montre-moi le diff
bloc par bloc.

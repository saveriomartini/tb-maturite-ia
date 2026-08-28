# Prompt Claude Code — tâche 1.1

À copier tel quel dans Claude Code, à la racine de `tb-maturite-ia`.

---

Contexte : dépôt `tb-maturite-ia`, outil de diagnostic de maturité d'adoption de l'IA (Vue 3 + Vite),
travail de Bachelor. Lis d'abord `README.md`, `docs/DECISIONS.md` et `docs/PERIMETRE.md` — le journal
des décisions fait autorité sur tout ce qui suit.

Une refonte vient d'être décidée : l'unité de réponse du questionnaire passe du critère d'adoption
coché à un **énoncé descriptif choisi parmi cinq** par domaine de capacité. Vingt-huit domaines, donc
cent quarante énoncés. Cette tâche pose uniquement la **structure de données et son contrôle** ; le
texte des énoncés sera rédigé par moi, pas par toi.

## Ce que tu dois faire

**1. Ne touche pas à `src/data/model-data.json`.**
Ce fichier est le report littéral de la source (Ozkaya et al., 2026) et c'est ce qui rend le modèle
défendable en soutenance. Les énoncés en sont dérivés, pas extraits : ils vivent à côté, exactement
comme `preparation.js` et `transformation.js` (décisions du 15.08.2026 et du 18.08.2026).

**2. Crée `src/data/statements.js`.**

Génère-le à partir de l'ordre réel de `model-data.json` — ne recopie pas une liste de mémoire.
Structure :

```js
export const STATEMENT_RANKS = [1, 2, 3, 4, 5]

export const STATEMENTS = {
  A1: [
    { n: 1, text: '' },
    // … n: 2 à 5, tous vides
  ],
  // … les 28 domaines
}
```

Contraintes :

- **Tous les `text` restent des chaînes vides.** Tu n'écris aucun énoncé — c'est du contenu d'auteur,
  hors de ce que tu produis sur ce projet.
- Le champ `n` est explicite et ne se déduit pas de la position dans le tableau.
- Commentaires de repérage générés depuis les données, dans l'ordre du modèle : un séparateur par
  bloc, une ligne par dimension, et au-dessus de chaque domaine `// A1 — <nom> (exigé au palier <level>)`.
- En-tête de fichier dans le style des autres fichiers de `src/data/` — commentaires denses qui
  expliquent la provenance et les décisions. Il doit dire : que le fichier n'appartient pas au report
  de la source et pourquoi ; que chaque énoncé instancie, pour son domaine, la ligne de son niveau
  dans la grille des trois indicateurs transversaux du §5 de la source (reprise dans
  `maturity-indicators.js`), la sémantique de niveau ne dépendant pas du domaine :

  ```
  1  absence — rien d'assigné, rien de planifié, rien d'alloué régulièrement
  2  existence désignée — des rôles, un plan, un budget pour ce domaine
  3  boucle de mesure — ce qui est mesuré change la conduite
  4  reproductibilité au-delà du premier cas — hors de l'équipe qui a lancé
  5  anticipation — les choix servent une stratégie et des scénarios à venir
  ```

  et qu'un énoncé nomme la manifestation la plus observable de cette situation dans le domaine
  concerné, sans réciter les trois indicateurs à la suite : une phrase, au présent, observable,
  tranchable par un dirigeant sans audit. Renvoie à `docs/ENONCES.md` pour les règles complètes.

**3. Crée `scripts/check-model.js`.**

Script Node ESM, deux modes :

- par défaut : échoue (code 1) sur ce qui est **cassé** — un domaine de `model-data.json` sans entrée
  dans `STATEMENTS`, un nombre d'énoncés différent de cinq, des rangs qui ne sont pas `1,2,3,4,5`
  dans l'ordre, un `text` qui n'est pas une chaîne, une clé de `STATEMENTS` sans domaine
  correspondant ;
- `--strict` : échoue en plus si un `text` est vide.

Dans les deux modes, il liste les domaines dont il reste des rangs à écrire et termine par un
décompte du type `28 domaines · 0/140 énoncés écrits`. Sorties sur `stderr`.

Le motif des deux modes doit figurer en commentaire en tête : brancher le mode strict sur
l'intégration continue rendrait celle-ci rouge pendant toute la durée de la rédaction ; le mode
strict est celui que la livraison devra passer.

Le script lit `model-data.json` avec `node:fs` (pas d'`import` de JSON, qui exige un attribut
d'import selon la version de Node) et importe `STATEMENTS` normalement.

**4. Branche le contrôle.**

Dans `package.json` : `"check:model": "node scripts/check-model.js"`,
`"check:model:strict": "node scripts/check-model.js --strict"`, et
`"lint": "eslint . && node scripts/check-model.js"`.

Dans `eslint.config.js` : une entrée de configuration pour `scripts/**/*.js` avec `globals.node`,
sinon `process` est signalé comme non défini. Ne change rien d'autre à ce fichier — les règles en
place sont justifiées dans le rapport.

## Critères d'acceptation

- `npm run lint` sort en 0.
- `npm run check:model:strict` sort en 1 et annonce 0/140.
- `git diff --stat` ne montre que `package.json` et `eslint.config.js` ; `model-data.json` intact.
- Aucun `text` non vide dans `statements.js`.
- `npm run build` passe.

## Conventions du dépôt

Style Guide Vue appliqué par `eslint-plugin-vue`. Commentaires en français, denses, expliquant le
pourquoi et non le quoi — regarde `src/data/maturity-indicators.js` pour le registre attendu. Aucune
dépendance nouvelle. Pas de commit sans que je l'aie demandé ; montre-moi le diff d'abord.

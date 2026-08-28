# Prompt Claude Code — lot 3 : le verdict, l'échelle, le radar

À copier tel quel dans Claude Code, à la racine de `tb-maturite-ia`. Le lot 2 est livré : le calcul
repose sur `answers`, la session est en v2, le questionnaire présente les 28 domaines d'affilée et la
phase d'ancrage est rétablie. Ce lot retire deux restes du modèle précédent, puis donne sa forme à
ce que l'outil restitue.

---

Contexte : dépôt `tb-maturite-ia`, outil de diagnostic de maturité d'adoption de l'IA pour des PME
de l'arc jurassien, travail de Bachelor. Lis d'abord `docs/logs/DECISIONS.md`,
`docs/admin/PERIMETRE.md`, `src/domain/scoring.js`, `src/data/preparation.js`,
`src/data/transformation.js`, `src/composables/useMaturityTool.js`,
`src/components/screens/ScreenDiag.vue`, `src/components/screens/ScreenResti1.vue`,
`src/components/screens/ScreenAncrage.vue` et les quatre fichiers de `tests/`.

Traite les étapes **une par une, dans l'ordre**, et montre-moi le diff après chacune. Le dépôt doit
rester exécutable à la fin de chaque étape : `npm run lint`, `npm run test` et `npm run build`
passent, et le parcours se joue de bout en bout.

**Après chaque étape, cherche ce qui référence ce que tu viens de changer** avant de passer à la
suivante : exports retirés, clés de view-model, noms de fichiers cités dans les commentaires, textes
d'interface qui nomment ce qui n'existe plus. Les régressions de ce dépôt viennent des effets à
distance, pas des étapes elles-mêmes.

Deux choses que ce lot ne fait pas. La documentation — `README.md`, `docs/logs/NIVEAU-CIBLE.md` —
est reprise dans une phase ultérieure : **n'y touche pas**, même là où elle décrit un état périmé.
Et tu **ne consignes rien dans `docs/logs/DECISIONS.md`** : tu signales les décisions dans ton
compte rendu, je les écris moi-même.

Aucune nouvelle dépendance n'est autorisée par ce lot.

## Étape 1 — retirer le profil « Préparation »

La Préparation a été ajoutée le 15.08.2026 sous une règle disparue. Tant qu'un domaine était acquis
ou ne l'était pas, une organisation qui n'avait validé aucun critère n'avait aucun profil : le
premier retour de l'outil était un constat de carence, au moment précis où l'enjeu est de donner
envie de continuer. La Préparation accusait réception d'un premier effort. L'échelle par énoncés a
supprimé le cas qu'elle traitait — tout domaine renseigné porte un niveau, et le premier palier se
lit sur ces niveaux. Le seuil provisoire écrit au lot 2 ne faisait que rattraper par un plancher un
profil devenu sans objet.

- Retire `PREPARATION`, `PREPARATION_FLOOR_COUNT` et `preparationReached`. Le fichier
  `src/data/preparation.js` ne décrit plus alors aucune préparation : déplace `IN_PROGRESS` dans
  `src/data/in-progress.js` et supprime `preparation.js`. Un fichier dont le nom ne dit plus ce
  qu'il porte est exactement le genre de renvoi périmé qui survit trois lots.
- `IN_PROGRESS` reste, et son emploi se resserre : il vaut tant qu'aucun domaine en périmètre n'est
  renseigné, c'est-à-dire tant qu'il n'y a rien à qualifier. Reprends son texte en conséquence.
- Dans `useMaturityTool.js`, `acquiredProfile` n'a plus que deux branches : un palier du modèle, ou
  rien encore. L'échelle des paliers de `resti1` perd sa marche de rang 0 et commence au premier
  profil du modèle. Vérifie l'export, qui écrivait `Niveau 0 — Préparation`.

**La conséquence est assumée et ne se rattrape pas ici.** Une session dont les trois domaines du
premier rang sont au rang 1 — l'énoncé qui décrit l'absence — acquiert « Exploration localisée ».
N'ajoute aucun seuil de remplacement, aucun garde-fou, aucun texte qui s'en excuse. Si tu vois où
cela gêne à l'écran, dis-le dans ton compte rendu ; ne le corrige pas.

Cette étape renverse la décision du 15.08.2026. Je m'en charge : n'écris rien dans le journal.

## Étape 2 — retirer les critères et les pratiques des écrans d'évaluation

L'unité de réponse est l'énoncé, et lui seul. Les critères d'adoption et les pratiques restent dans
`model-data.json`, qui demeure le report littéral de la source, et le modèle continue de les porter ;
ils ne s'affichent plus dans le questionnaire. Affichés à côté des énoncés, ils rouvrent la lecture
en liste de conditions que la refonte du lot 2 avait fermée, et ils donnent à croire qu'on répond sur
eux.

- Supprime `src/components/CriteriaReference.vue`, la clé `criteria` du view-model `diag` et son
  usage dans `ScreenDiag.vue`.
- Ce qui reste en rappel du domaine : bloc, dimension, nom, description, rang attendu, exemples
  d'artefacts. Rien d'autre.
- Cherche ensuite ce qui lit encore `area.goals` ou `goal.practices` dans `src/` : plus rien ne
  devrait, hors le JSON lui-même. `scripts/check-model.js` ne contrôle que les énoncés et n'est pas
  concerné.
- Reprends le gabarit de l'écran dans la foulée : sans ce panneau, le questionnaire n'a plus qu'une
  colonne de contenu sous le sélecteur, et la grille à deux colonnes du rappel n'a plus d'objet.

## Étape 3 — l'échelle des paliers

Elle est aujourd'hui une liste de cinq lignes qui situe sans expliquer. Ce qu'elle doit montrer, et
qui est déjà calculé :

- le palier atteint, et la cible **seulement si elle a été déclarée** — avant l'ancrage, rien n'en
  porte la marque ;
- l'avancement de chaque palier (`gateProgress`), lisible comme « de combien il s'en est fallu » et
  jamais comme une acquisition partielle : l'acquisition est un seuil, un palier dont tous les
  domaines sauf un sont au rang n'est pas presque acquis ;
- **la ligne évolutif / révolutionnaire**, tracée et nommée entre le deuxième et le troisième palier
  (`REVOLUTIONARY_FROM`). C'est la seule information de l'échelle qui dise que tous les crans ne se
  valent pas, et elle n'y figure nulle part aujourd'hui.

Traite les trois états à l'écran, sans cas par défaut muet : cible non déclarée, cible atteinte,
cible située sous le palier atteint.

SVG ou CSS écrits à la main, couleurs et espacements pris à `src/assets/tokens.css`.

## Étape 4 — le radar, en fichier HTML unique, hors de l'application

Le radar est une maquette avant d'être une fonctionnalité : il se montre et se discute avant d'entrer
dans le parcours. Produis `docs/proto/radar-dimensions.html` — **un seul fichier**, aucune
dépendance, aucun CDN, aucun build, aucun serveur : il s'ouvre par double-clic. Rien de `src/` ne
change à cette étape, et rien n'importe ce fichier.

- Neuf axes, un par dimension du modèle, avec leurs intitulés lisibles — c'est la contrainte qui
  décide de la taille de la figure.
- **Deux tracés** : la moyenne et le plancher de la dimension. Ils doivent se distinguer autrement
  que par la couleur seule, et l'on doit pouvoir n'en afficher qu'un.
- Échelle de 1 à 5, cinq anneaux, graduée.
- **Une dimension sans mesure n'est jamais tracée à zéro.** Aucun domaine renseigné, ou tous
  déclarés hors périmètre : la valeur est absente, pas nulle. Un zéro s'y lirait comme le pire
  résultat possible, alors que rien n'a été mesuré — c'est la même famille de défaut que le
  « 3,1 / 3 » relevé par l'experte métier.
- Quatre jeux de données, en dur : les trois scénarios de démonstration, repris à la main de
  `src/data/demo-sessions.js`, et un quatrième construit pour le cas limite — une dimension entière
  hors périmètre, une autre restée non renseignée. Un sélecteur bascule de l'un à l'autre. Un
  commentaire dit d'où viennent les chiffres et qu'ils sont une copie, pas une lecture du modèle.
- Un texte court, dans la page, qui dit ce que le radar montre **et ce qu'il ne montre pas** : c'est
  un affichage compensatoire — sa surface se lit comme un total — posé à côté d'une règle qui refuse
  la compensation et tout score global (décision du 30.07.2026). Si tu ne trouves pas de formulation
  qui tienne, écris-le dans ton compte rendu plutôt que d'en écrire une qui ne tient pas : c'est un
  argument à trancher avant toute intégration.

## Étape 5 — mise en page des résultats et de l'ancrage

Les deux pages portent désormais tout ce que l'outil produit, et elles ont été écrites pour
fonctionner, pas pour être lues. Reprends leur hiérarchie : ce qu'on lit en premier, ce qui se
détache, ce qui reste du hors-texte. La couverture, les domaines hors périmètre et les domaines
restant à évaluer sont du hors-texte qui borne la lecture — ils ne doivent ni disparaître ni
concurrencer le verdict.

L'aperçu d'export garde sa largeur A4 et son rôle : une pièce de dossier relue sans l'outil.

## Étape 6 — les tests

La suite existante reste verte, `render.test.js` compris — zéro avertissement Vue sur chaque écran,
session remplie et session vierge. Ajoute au minimum :

- plus aucune marche de rang 0 dans l'échelle, et plus rien dans `src/` qui importe un profil de
  préparation ;
- une session dont tous les domaines sont au rang 1 rend le premier palier du modèle : test de
  constat, écrit pour que le jour où quelqu'un voudra changer cela, il sache ce qu'il change ;
- le questionnaire n'expose plus ni critère ni pratique ;
- les trois démonstrations tombent toujours aux trois positions de l'échelle de transformation.

## Critères d'acceptation

- `npm run lint`, `npm run check:model:strict`, `npm run test` et `npm run build` sortent en 0.
- `npm run dev` : une session se joue en entier — cadrage, 28 domaines, résultats, ancrage, export —
  sans erreur de console.
- Plus aucune référence à `preparation`, `PREPARATION`, `preparationReached` ni à
  `CriteriaReference` dans `src/`.
- `src/data/statements.js`, `src/data/model-data.json` et `src/data/maturity-indicators.js` ne sont
  pas modifiés. `README.md` et `docs/logs/NIVEAU-CIBLE.md` non plus.
- `docs/proto/radar-dimensions.html` s'ouvre par double-clic, sans serveur ni réseau, et aucune
  dimension sans mesure n'y est tracée à zéro — vérifie-le sur le quatrième jeu de données.
- Aucune valeur affichée ne dépasse son total.
- Aucune dépendance nouvelle.

## Conventions du dépôt

Français, registre France Num, vocabulaire de l'interface et non du code — « domaine de capacité »,
« palier », « énoncé ». Style des fichiers de `src/data/` et `src/domain/` : commentaires denses qui
expliquent le pourquoi. Respecte `docs/admin/VUE_STYLE_GUIDE.md` pour tout composant touché. Pas de
commit sans que je l'aie demandé ; montre-moi le diff après chaque étape. @docs/memory/*

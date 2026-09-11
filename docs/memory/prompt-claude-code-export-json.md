# Export JSON de session — vérifier, éprouver et clore l'item 3.11

Le code de l'item 3.11 est **déjà écrit et posé dans le dépôt**, mais il n'a **jamais tourné** : il a
été produit dans un conteneur où le registre npm est refusé, donc sans `vitest`, sans `eslint` et
sans `vite build`. Ton travail n'est pas de le concevoir, c'est de l'éprouver, de corriger ce qui
casse, et de rendre les nombres dont le rapport a besoin.

Ne repars pas d'une autre conception. Les quatre arbitrages ci-dessous sont pris et ne se rouvrent
pas.

## Règles communes

- Branche `main`. **Un seul commit** pour tout ce prompt, après que les quatre commandes passent.
- Avant de modifier quoi que ce soit, lis : l'entrée du **11.09.2026** de `docs/logs/DECISIONS.md`
  (elle est déjà écrite, elle porte les motifs et les alternatives écartées), la ligne **3.11** de
  `docs/logs/BACKLOG.md` et la note ajoutée sous « Si ça déborde ».
- Style du dépôt : commentaires en français qui disent **pourquoi**, au registre de l'existant. Pas
  de code mort.
- Tu ne rédiges **aucun texte définitif** affiché à l'utilisateur. Si un libellé doit changer, écris
  une chaîne provisoire courte et factuelle précédée de `// TEXTE PROVISOIRE — à valider par
  Saverio`, et liste-la dans ton compte rendu.
- **N'écris rien dans `docs/logs/DECISIONS.md`** : l'entrée du 11.09 y est déjà. Si tes essais font
  apparaître un fait nouveau, ajoute une ligne de faits dans `docs/logs/DECISIONS-brouillon.md`
  (date, ce qui change, fichiers touchés), sans motif ni alternative.
- À la fin : `npm run lint`, `npm run check:model:strict`, `npm test`, `npm run build` doivent
  passer. Si l'un échoue, corrige ou arrête-toi et explique.

## Ce qui a été livré, et qu'il faut tenir

Nouveaux fichiers :

- `src/domain/session-state.js` — les validateurs de session, **sortis** de `useSessionStorage.js` :
  `SCHEMA_VERSION`, `newSessionId`, `validAnswers`, `validForm`, `validTransformation`, `sanitize`,
  `snapshot`. C'est ce qui fait tenir la clause du backlog « validé par le même validateur que
  localStorage » : la session du navigateur et le fichier relu traversent le même filtre.
- `src/domain/session-file.js` — construction des deux fichiers, sérialisation indentée avec la clé
  `_lisezmoi`, relecture avec quatre motifs de refus (`unreadable`, `foreign`, `version`, `empty`),
  nom de fichier.
- `src/data/take-away.js` — le contenu rédactionnel du bloc.
- `src/composables/useSessionFile.js` — les deux seules opérations de navigateur (URL d'objet,
  lecture d'un fichier choisi).
- `src/components/TakeAway.vue` — le bloc « Emporter ».
- `tests/session-file.test.js` — 19 tests.

Modifiés : `useSessionStorage.js` (ne porte plus que le stockage), `useMaturityTool.js` (vm
`takeAway`, action `importSession`), `MaturityTool.vue` (`@import`), `ScreenAncrage.vue` (le bloc
remplace le bouton « Export » de la barre du bas, qui ne garde que « Fin »),
`docs/logs/BACKLOG.md`, `docs/logs/DECISIONS.md`.

**Les quatre arbitrages, non négociables :**

1. Export **et** reprise, rien de plus. Pas d'agrégat de plusieurs fichiers, pas de statistiques
   comparatives : c'est une perspective du rapport, pas un lot de code.
2. **Deux fichiers, un seul bouton.** `reprise` = instantané complet ; `partage` = 28 réponses,
   trois attributs descriptifs (secteur, taille, territoire), les deux profils dérivés, et rien
   d'autre. **Ne remets pas les douze autres attributs de cadrage dans le fichier de partage**, quel
   que soit l'argument analytique : le motif est au journal.
3. Le bloc est sur l'écran d'**ancrage**, pas dans l'aperçu d'export.
4. **Aucun destinataire nommé** dans l'outil : ni adresse, ni service, ni requête réseau.

## Travail

### 1. Vérification mécanique

Lance les quatre commandes. **Relève et rends les nombres exacts** : combien de tests, dans combien
de fichiers, avant et après l'ajout de `tests/session-file.test.js`. Le rapport annonce encore
« 113 tests, six fichiers » à quatre endroits et le chiffre est de toute façon périmé depuis le lot
du 10.09 — Saverio a besoin du nombre juste, pas d'une estimation.

Vérifie aussi que `render.test.js` passe **sans avertissement Vue** : ce test rend les six écrans
avec `renderToString` et exige `warnings` vide. Le bloc est rendu côté serveur, où il n'y a ni
`document`, ni `URL`, ni `Blob` — s'il y touche au montage, c'est ici que ça se verra.

### 2. Revue de ce qui a été écrit

Sans rien réécrire par goût, contrôle quatre points :

- **Aucun module de `src/domain/` n'importe `vue`.** Le rapport affirme que les règles vivent dans
  des modules de fonctions pures transposables ; `session-state.js` et `session-file.js` doivent le
  rester. Si l'un d'eux tire `vue` par une chaîne d'imports, dis-le.
- `useSessionStorage.js` réexporte `newSessionId` depuis le domaine ; vérifie qu'aucun import du
  dépôt ne pointe encore vers une fonction qui aurait bougé.
- **Aucun appel réseau n'a été introduit dans `src/`** : c'est une propriété vérifiée du chapitre 5.
- Le bouton « Export » ne subsiste nulle part dans la barre de navigation, et la classe CSS
  `.actions__export` a bien disparu avec lui.

### 3. L'épreuve du navigateur — c'est le cœur du prompt

`npm run dev`, charge une démonstration, va en ancrage, et vérifie point par point :

**Téléchargement.** Un clic sur « Télécharger les deux fichiers » écrit `maia-reprise-<id>-<date>.json`
et `maia-partage-<id>-<date>.json`. **Note ce que fait ton Chrome** : il demande en principe une
autorisation d'enregistrer plusieurs fichiers. Si le second ne part pas, vérifie que les deux liens
de repli s'affichent bien sous le bouton et qu'ils fonctionnent. C'est le seul point du lot dont le
comportement dépend du navigateur, et il doit être constaté, pas supposé.

**Contenu.** Ouvre les deux fichiers dans un éditeur. Le fichier de partage ne doit porter, sous
`state.form`, que `domain`, `size`, `footprint` — aucun `horizon`, `governance`, `staffing`,
`data`, `literacy`, `risk`, `scope`, `digital`, `devApproach`, `deployment`, `roi`, `ambition`. Il
ne doit porter ni `screen`, ni `openLevels`, ni `contextWarned`, ni `outOfScopeWarned`, ni `demo`.
Il doit porter `measure` avec les deux profils et le compte des domaines. Le fichier de reprise,
lui, porte tout.

**Reprise.** Recharge le fichier de reprise : la modale annonce ce qui sera remplacé, et après
confirmation l'état est identique (mêmes réponses, même cadrage, même portée, même écran). Recharge
le fichier de partage : la modale doit **en plus** dire que les douze attributs de cadrage resteront
vides. Annule par « Annuler » puis par Échap : dans les deux cas, **rien ne doit être remplacé**.

**Refus.** Quatre essais, quatre messages distincts et aucune session touchée : un fichier texte qui
n'est pas du JSON ; un JSON quelconque (`{"a":1}`) ; un fichier de reprise dont tu passes `"v"` à
`1` à la main ; un fichier de partage vidé de ses réponses, de son cadrage et de sa portée. Vérifie
aussi qu'après un refus, **rechoisir le même fichier redéclenche bien la lecture** (le champ est
vidé pour cela).

**Clavier et points de rupture.** C'est l'item 3.13, resté `[~]` faute d'avoir été fait : profites-en
pour le faire sur ce bloc au moins. Parcours complet à la tabulation — les trois boutons, le
dépliant, les liens de repli, la modale et sa fermeture par Échap —, avec un `focus-visible`
visible partout. Puis contrôle le rendu à **1200 px et 900 px**, où la ligne passe en colonne.

Si l'un de ces points ne tient pas, corrige dans l'esprit du code existant et dis ce que tu as
changé.

### 4. Tests à compléter

Les 19 tests couvrent le domaine. Ajoute ce qui manque **côté composable et rendu**, sans dupliquer
l'existant :

- Le vm `ancrage.takeAway` expose deux entrées, dont les noms de fichier diffèrent et portent
  l'identifiant de session courante.
- `actions.importSession` remplace réellement la session : aucune réponse de l'état précédent ne
  subsiste sous celles du fichier (le piège que `loadDemo` traite déjà en repassant par
  `defaultState`), et l'écran d'arrivée est celui du fichier quand il en porte un, celui d'où l'on
  reprend sinon.
- L'écran `tool4` rend le bloc : le titre « Emporter » est dans le HTML rendu.

### 5. Figure du rapport

L'écran d'ancrage a changé : la capture qui l'illustre dans le chapitre 5 est périmée. Si Playwright
est disponible sur le poste, produis une capture de `tool4` sur la démonstration **Clinique Bel-Air**,
viewport 1440 × 950, `deviceScaleFactor: 2`, sur l'application **construite** (`npm run build` puis
`npm run preview`) et non sur le serveur de développement. Sinon, dis-le et laisse Saverio la
prendre à la main. Ne l'insère pas dans le rapport : le .docx n'est pas dans ce dépôt et ne se
touche pas depuis ici.

### 6. Clôture

- `docs/logs/BACKLOG.md` : si tes essais laissent 3.13 partiellement fait, mets sa cellule à jour en
  disant exactement ce qui a été contrôlé et ce qui ne l'a pas été. Ne le coche pas à la légère.
- Un commit unique, message en français, corps qui dit ce qui a été vérifié et ce qui a dû être
  corrigé.
- **Ne pose ni étiquette ni release.** Le point fixe de la remise est une release GitHub, décidée le
  10.09 : elle appartient à Saverio.

## Compte rendu attendu

1. Le résultat des quatre commandes, avec **le nombre exact de tests et de fichiers**.
2. Ce que ton Chrome fait du double téléchargement.
3. Chaque correction que tu as dû apporter, et pourquoi.
4. Les textes provisoires, avec leur emplacement.
5. Ce qui reste non vérifié, nommément — en particulier ce que tu n'as pas pu contrôler au clavier
   ou aux points de rupture.
6. Une phrase par item : les six passages du rapport que ce lot périme sont **hors de ton
   périmètre** ; rappelle seulement que la liste vit dans `docs/memory/` et que Saverio la traite
   dans Word.

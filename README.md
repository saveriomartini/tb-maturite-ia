# M.A.IA — instrument de diagnostic de maturité d'adoption de l'IA pour les PME

Travail de Bachelor en Informatique de gestion, HEG Arc (Neuchâtel), module 656-1, cycle T-Part
2022-2026. Rapport : *Maturité IA dans les PMEs — De l'adoption opportuniste à l'intégration
stratégique*.

**Auteur** Saverio Martini · **Direction** Maria Sokhn · **Assistant technique** Rafael Moreira Dos Santos
**Ratification** 07.07.2026 · **Restitution** 13.09.2026 · **Soutenance** octobre 2026
**Dépôt** `github.com/saveriomartini/tb-maturite-ia` · **Publication** `https://saveriomartini.github.io/tb-maturite-ia/`

Ce fichier décrit l'état du dépôt au 02.09.2026. Le code et l'outil déployé font foi ; les endroits
où le reste du dossier les contredit encore sont déclarés au § 8 plutôt que tus.

---

## 1. Ce que fait l'outil, et ce qu'il ne fait pas

Il rend navigable de bout en bout un parcours d'auto-évaluation en quatre phases — **Cadrage**
(qui évalue quoi), **Évaluation** (où en sommes-nous), **Résultats** (le palier et sa
décomposition), **Ancrage** (jusqu'où l'on veut porter l'adoption, et ce qui en sépare). Quatre
blocs thématiques, neuf dimensions, vingt-huit domaines de capacité, échelle à cinq niveaux : le
référentiel de base est l'*AI Adoption Maturity Model v1.0* du Software Engineering Institute
(Ozkaya et al., 2026), consolidé avec la matrice de comparaison de six modèles de l'auteur.

Vingt-cinq domaines sont repris d'Ozkaya et al. et traduits ; trois sont rédigés par l'auteur et
forment la neuvième dimension (§ 5.3). Les vingt-huit sont mesurés.

**L'unité de réponse est l'énoncé descriptif.** Pour chaque domaine, cinq situations sont affichées
en entier, les unes sous les autres, et l'on retient celle qui décrit l'organisation — ou l'on
déclare le domaine hors périmètre. Vingt-huit réponses au total, aucune case à cocher, et aucun
numéro de niveau affiché à côté d'un énoncé : le rang porte tout le calcul, mais l'écrire rouvrirait
la lecture en échelle de conformité que la restitution s'efforce de fermer. Les profils sont nommés
sans leur rang partout à l'écran ; l'export est la seule sortie numérotée, parce qu'il se relit hors
de l'outil.

**La règle d'agrégation est non compensatoire.** Un palier L est acquis lorsque tout domaine en
périmètre dont le rang déclencheur est inférieur ou égal à L se trouve au niveau L ou au-dessus. Le
maillon faible fixe le palier, rien ne le compense, et l'outil ne produit **aucun score global**. Un
domaine déclaré hors périmètre sort du calcul — jamais compté comme acquis, jamais compté comme
manquant — et n'est nommé qu'à part ; un domaine non renseigné n'est jamais présenté comme un écart,
il est annoncé comme restant à évaluer.

Ce que l'outil ne fait pas, et pour quel motif :

- **aucune feuille de route priorisée.** La couche prescriptive est hors périmètre par instruction
  de la direction de travail. Le tri des écarts suit le rang exigé du modèle puis l'ordre du
  questionnaire, jamais le retard constaté — trier au retard reviendrait à dire par quoi commencer.
  Le dernier bloc de l'Ancrage annonce cette génération comme prochaine itération, en texte simple ;
- **aucune comparaison inter-PME.** Elle suppose une collecte, que l'architecture exclut. L'exigence
  retenue à la place est l'extensibilité : contrat de session versionné et couture de persistance
  isolée, de sorte qu'une collecte ultérieure ne demande pas de refonte ;
- **aucune évaluation de *readiness*.** Elle mesure autre chose que la maturité d'adoption, et son
  score pondéré est précisément la règle compensatoire que le travail écarte. La porte est déclarée
  en version 2.

Aucun backend, aucune base de données, aucune authentification. L'état de session vit dans le
navigateur et se persiste en `localStorage` ; aucune donnée d'évaluation ne quitte le poste, et la
seule requête sortante de la page est le chargement de la police Archivo. C'est la réponse
d'architecture à l'enjeu de souveraineté posé par la problématique, et la lecture la plus simple du
*privacy by design* annoncé au titre de la nLPD — pas une économie de moyens. La contrepartie est
assumée et se dit à l'utilisateur : une session vit sur un poste et dans un navigateur, elle ne se
reprend pas ailleurs.

---

## 2. Le parcours livré

L'accueil est réduit à **trois portes de même rang** : s'informer, s'évaluer, regarder une
démonstration. La branche de l'outil tient ensuite sur **une seule page qui défile** — le cadrage,
l'évaluation et les résultats y sont trois sections. Elle a été dix écrans, puis cinq pages, puis
trois. La quatrième phase garde son écran, et ce n'est pas un oubli : l'Ancrage s'ouvre sur la
question de portée, dont la réponse commande tout ce qui la suit, et amenée par le défilement on y
répondrait en passant.

| Écran | Phase | Contenu |
|---|---|---|
| `home` | — | Les trois portes, et le pied d'attribution présent partout |
| `info` | — | La carte du parcours ; adoption / maturité d'adoption / readiness ; la grille 5 × 3 dont les énoncés sont dérivés ; le tableau d'équivalences entre échelles ; le modèle et les cinq profils dépliables ; la carte du diagnostic |
| `demo` | — | Trois PME fictives — Menuiserie Rochat, Clinique Bel-Air, Groupe Terravia — dont on charge la session complète |
| `tool` | 1 · 2 · 3 | **Cadrage** : 15 attributs de contexte. **Évaluation** : les 28 domaines empilés dans l'ordre du modèle. **Résultats** : profil, périmètre, échelle des paliers, radar des 9 dimensions, détail par domaine |
| `tool4` | 4 | **Ancrage** : la question de portée, le profil visé qui s'en déduit, la nature du passage, les domaines qui en séparent, le hors périmètre, ce qui reste à évaluer, le bloc de clôture |
| `export` | 4 | L'aperçu imprimable de la pièce à emporter |

**Le cadrage** pose quinze attributs : douze au formulaire, répartis en trois groupes — Organisation
(2), Technologie (3), IA (7) —, plus trois purement descriptifs, qui documentent l'évaluation sans
peser sur elle. Aucun n'est exigé : un formulaire vide place la recommandation au profil le plus
haut, et chaque réponse ne peut alors que la réduire — « on vous propose tout, vos réponses retirent
ce qui ne vous concerne pas ». Des douze, dix scorent sur les deux axes de l'ambition et de la
capacité ; `scope` ne score pas mais plafonne et nomme l'unité évaluée en tête de la restitution ;
`devApproach` est collecté et volontairement inerte (§ 8). Huit options plafonnent durement le
niveau recommandé et treize portent un critère d'acceptation, affiché sous l'option retenue : un
plafond dur décide seul du niveau cible, la réponse ne peut donc pas reposer sur une appréciation.

**L'évaluation** empile les vingt-huit domaines. Il n'y a plus un domaine par écran, donc plus de
position à tenir ni de « suivant » à proposer : la barre des vingt-huit pastilles, collée sous
l'en-tête le temps de la section, fait défiler jusqu'à un domaine et dit de chacun s'il est non
renseigné, à quel rang il a été situé, ou s'il est hors périmètre. À droite, la bande des cinq
profils reste visible pendant tout le défilement et montre, pour chaque palier, combien des domaines
qu'il attend l'atteignent — jamais un pourcentage : « 8 sur 9 » dit ce qui manque là où « 89 % »
suggère une progression continue. La carte d'un domaine ne porte que son bloc, sa dimension, son
nom, sa description, le profil à partir duquel le modèle l'attend, et des exemples d'artefacts
dépliables. Le hors périmètre est un interrupteur placé à droite de l'en-tête du bloc, et non une
sixième option : il ne répond pas à la question, il retire le domaine de la mesure.

**Les résultats** ne se contentent pas de nommer le palier atteint : ils le situent sur l'échelle de
transformation et qualifient la nature du passage vers le profil visé — sous la ligne qui sépare les
degrés évolutifs des degrés révolutionnaires, la franchissant, ou déjà au-dessus. L'échelle des
paliers est un diagramme à deux axes reproduisant la disposition en escalier de la figure source,
avec une légende de crédit ; en dessous de 900 px elle cède la place à la liste verticale qui porte
la même donnée. Le radar des neuf dimensions porte deux lectures distinctes, la moyenne et le
plancher des domaines renseignés.

**L'ancrage** mesure l'écart contre le palier cible issu de la question de portée, et non contre le
palier suivant : poser la question puis mesurer contre autre chose serait incohérent. Le volume est
traité par la présentation — domaines groupés par palier intermédiaire, le prochain déplié et les
suivants repliés, total en tête —, groupement qui n'est pas une mise en forme mais la traduction de
la règle du maillon faible, laquelle impose de franchir les paliers dans l'ordre.

**La démonstration** ne lève pas une simple commodité : la restitution ne se laisse pas juger avant
d'avoir répondu à quinze attributs et situé vingt-huit domaines. Les scénarios n'écrivent que des
entrées — contexte, niveau par domaine, portée déclarée — et jamais un résultat : le profil, l'écart
et la synthèse sont recalculés par le même moteur que pour une vraie session, faute de quoi la
démonstration montrerait autre chose que l'outil. Il y en a trois parce que la restitution ne tient
pas le même discours selon l'endroit où l'écart tombe sur l'échelle : Rochat le place sous la ligne
évolutif / révolutionnaire, Bel-Air la franchit, Terravia n'a plus d'écart. L'en-tête annonce la
provenance — « session xxxx · démonstration » — pour qu'une PME fictive ne s'exporte pas au nom de
la sienne.

Deux éléments d'interface ont été livrés puis retirés, et le dépôt le dit plutôt que de le taire :
un panneau de rappel des critères (`CriteriaReference.vue`, annulé le 28.08.2026) et une bande de
verdict dans l'en-tête (annulée le 30.08.2026). Les motifs sont consignés aux lignes 3.2 et 3.4 du
backlog.

---

## 3. Démarrage pas à pas dans VS Code

### 3.1 Prérequis, une seule fois

1. **Node.js 20 ou supérieur** — la CI tourne sur Node 22. Vérifier : `node -v`. Sinon, installer
   depuis nodejs.org (version LTS).
2. **Git.** Vérifier : `git --version`.
3. **VS Code.** À la première ouverture du dossier, accepter les extensions recommandées de
   `.vscode/extensions.json`. La seule indispensable est **Vue - Official** (`Vue.volar`).

### 3.2 Installer et lancer

```sh
cd chemin/vers/tb-maturite-ia
code .
npm install
npm run dev
```

Le terminal affiche une adresse locale, en général `http://localhost:5173`. `Ctrl+clic` dessus.
Toute modification d'un fichier source se reflète immédiatement, sans relancer. `Ctrl+C` pour
arrêter.

### 3.3 Les commandes du dépôt

| Commande | Ce qu'elle fait |
|---|---|
| `npm run dev` | Serveur de développement, rechargement à chaud |
| `npm run lint` | ESLint (Style Guide officiel de Vue) **puis** `check-model` |
| `npm run lint:fix` | Corrige ce qui est corrigeable automatiquement |
| `npm run test` | Vitest — 94 cas répartis en 5 fichiers |
| `npm run check:model` | 28 domaines × 5 énoncés numérotés, sans rang manquant ni doublon |
| `npm run check:model:strict` | Idem, plus l'échec sur tout énoncé vide — le mode de la livraison |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Sert le contenu réellement publié, sur le port 4173 |

`preview` est le seul test fiable des chemins d'assets et du routage.

Le mode strict passe depuis que les cent quarante énoncés sont écrits. Il n'est délibérément pas
branché sur `lint` : y brancher le mode strict aurait rendu l'intégration continue rouge pendant
toute la durée de la rédaction, et une CI rouge en permanence ne signale plus rien.

### 3.4 Publication

`.github/workflows/deploy.yml` exécute, à chaque poussée sur `main` : `npm ci`, `npm run lint`,
`npm run test`, `npm run build`, puis le déploiement sur GitHub Pages via les actions officielles.
Une poussée qui échoue à l'une de ces étapes ne se déploie pas.

Côté GitHub : **Settings → Pages → Build and deployment → Source = GitHub Actions**. Ne pas choisir
« Deploy from a branch ».

Si le dépôt est renommé, modifier la constante `NOM_DU_DEPOT` dans `vite.config.js` : c'est la cause
quasi certaine d'un déploiement où la page s'affiche blanche et où tous les assets renvoient 404.

Le produit final tient en un script et une feuille de style — 271 ko de JavaScript et 51 ko de CSS,
soit environ 97 ko une fois compressés — servis en fichiers statiques. Une seule dépendance de
production : Vue.

---

## 4. Arborescence

```
tb-maturite-ia/
├── .github/workflows/deploy.yml   lint → test → build → GitHub Pages
├── .vscode/                       extensions recommandées et réglages d'éditeur
├── docs/                          voir § 7
├── scripts/check-model.js         28 domaines × 5 énoncés, branché sur npm run lint
├── tests/                         94 cas, exécutés par la CI avant le build
│   ├── scoring.test.js            les règles : maillon faible, hors périmètre, tri, dimensions
│   ├── restitution.test.js        les view-models : les 3 démos aux 3 positions de l'échelle,
│   │                              et aucune valeur affichée ne dépasse son total
│   ├── session-storage.test.js    la garde du contrat de session
│   ├── sources.test.js            ce que src/ ne contient plus (imports morts, retours interdits)
│   └── render.test.js             un rendu SSR de chaque écran, sans avertissement Vue
├── src/
│   ├── data/                      CONTENU, aucune logique
│   │   ├── model-data.json        SOURCE DE VÉRITÉ — report littéral d'Ozkaya et al. (2026)
│   │   ├── model-data.js          export ES module de model-data.json
│   │   ├── statements.js          les 140 énoncés descriptifs, dérivés et non extraits (§ 5.2)
│   │   ├── context-attributes.js  15 attributs, plafonds durs, exigences du dernier profil
│   │   ├── maturity-indicators.js grille des 3 indicateurs transversaux (§ 5 de la source)
│   │   ├── transformation.js      échelle de transformation, question de portée, lecture de l'écart
│   │   ├── in-progress.js         ce que dit la restitution tant qu'aucun palier n'est nommable
│   │   ├── info.js                contenu de l'écran d'information (concepts, grille, équivalences)
│   │   ├── attribution.js         sources, rôle de chacune, démenti « outil non officiel »
│   │   ├── journey.js             texte du parcours en quatre phases
│   │   └── demo-sessions.js       les 3 PME fictives : contexte, réponses, portée déclarée
│   ├── domain/                    RÈGLES MÉTIER, fonctions pures, aucune dépendance à Vue
│   │   ├── scoring.js             areaLevel, acquiredLevel, blockers, blockersByGate, toAssess,
│   │   │                          gateProgress, dimAverage, dimFloor, statementText
│   │   ├── recommendation.js      niveau cible recommandé : 2 axes, 8 plafonds durs, 5 exigences
│   │   ├── model.js               vues dérivées du modèle, noms de profils, glossaire code ↔ UI
│   │   ├── scope.js               l'unité évaluée, nommée en tête de restitution et d'export
│   │   ├── navigation.js          écrans, phases, ancres de section, écrans retirés
│   │   └── demo-session.js        traduit un scénario en état de session, sans écrire de résultat
│   ├── composables/               ÉTAT réactif
│   │   ├── useMaturityTool.js     session, actions, un view-model calculé par écran
│   │   ├── useSessionStorage.js   persistance locale validée et versionnée (§ 6)
│   │   └── useAnchorScroll.js     défilement vers une ancre de section ou de domaine
│   ├── assets/tokens.css          jetons visuels, primitives partagées, points de rupture
│   ├── App.vue                    gabarit de page, pied d'attribution, modale de remise à zéro
│   ├── components/                PRÉSENTATION
│   │   ├── AppHeader.vue          en-tête collant : marque, session, les 4 phases
│   │   ├── AppScreen.vue          gabarit d'écran (largeur de lecture, gouttières)
│   │   ├── AppScreenNav.vue       pied de navigation, slot `actions` pour les sorties multiples
│   │   ├── AppDialog.vue          modale de décision, commune à toutes celles de l'outil
│   │   ├── AppFooter.vue          attribution + démenti, sous le routeur d'écrans
│   │   ├── MaturityTool.vue       aiguillage vers l'écran courant
│   │   ├── StatementPicker.vue    les 5 énoncés d'un domaine + l'interrupteur de hors périmètre
│   │   ├── ContextField.vue       un attribut de contexte ; ContextCriteria.vue son aide
│   │   ├── ContextAttributeForm.vue, DescriptiveContext.vue   les 12 scorants, les 3 descriptifs
│   │   ├── TransformationQuestion.vue   la question de portée, en Ancrage
│   │   ├── MaturityLadder.vue     l'échelle des paliers, diagramme à deux axes
│   │   ├── DimensionRadar.vue     radar des 9 dimensions + barres moyenne · plancher
│   │   ├── ProfileBand.vue        la bande des 5 profils, collée à droite pendant le défilement
│   │   ├── FrameworkTable.vue, MaturityLevelList.vue, ScopeMap.vue, JourneyMap.vue
│   │   └── screens/               un composant par écran et par section (§ 4.1)
│   └── main.js
├── index.html                     charge la police Archivo (preconnect) et monte l'application
├── eslint.config.js               règles de code = Style Guide officiel de Vue
├── package.json
└── vite.config.js
```

### 4.1 Les composants d'écran, et lesquels sont routés

Six écrans seulement sont routés par `MaturityTool.vue` : `ScreenHome`, `ScreenInfo`, `ScreenDemo`,
`ScreenTool1`, `ScreenAncrage`, `ScreenExport`. Les autres sont devenus des **sections** composées
par eux, et gardent leur nom parce que le remaniement n'a pas renommé les fichiers :

- `ScreenTool1` (l'écran `tool`) compose `ScreenCadrage3` (cadrage), `ScreenDiag` (évaluation) et
  `ScreenTool3` (résultats), plus `ProfileBand` ;
- `ScreenTool3` compose `ScreenResti1` (synthèse) et `ScreenResti2` (détail par domaine) ;
- `ScreenInfo` compose `ScreenCadrage1` (le modèle et les cinq profils) et `ScreenDiagStart` (la
  carte du diagnostic) — deux sections qui ouvraient autrefois le parcours d'évaluation, où elles
  imposaient une lecture avant toute question.

### 4.2 Comment lire le code

Quatre couches, dans cet ordre de dépendance : `data/` (contenu) → `domain/` (règles) →
`composables/` (état) → `components/` (affichage). Une couche ne connaît jamais la suivante.

Concrètement : `domain/scoring.js` ne sait pas qu'une interface existe et se teste sans navigateur ;
`useMaturityTool.js` ne produit que des données — libellés, drapeaux, listes — et jamais de style ;
chaque composant décide de son apparence dans son propre `<style scoped>`, les motifs partagés
vivant dans `assets/tokens.css`. Un écran reçoit son view-model en `prop` et remonte les intentions
de l'utilisateur en `emit` : il ne mute jamais l'état directement. Le view-model est calculé **par
écran** et non globalement — seul l'écran affiché se recalcule, et chaque écran devient vérifiable
isolément.

Le motif de cette séparation, arrêté le 12.08.2026, est que les règles d'agrégation et de
recommandation sont le cœur défendable du travail : elles doivent être lisibles et vérifiables sans
passer par l'écran.

L'adaptation aux tailles d'écran repose sur deux points de rupture déclarés dans `tokens.css`, sans
bibliothèque ni détection en JavaScript : à **1200 px** les grilles à quatre colonnes passent à
deux ; à **900 px** tout ce qui est côte à côte s'empile. Le motif est d'usage : l'outil doit rester
utilisable sur le portable ou la tablette d'un comité de direction en séance.

---

## 5. Le modèle et les énoncés

### 5.1 `src/data/model-data.json` est la source de vérité

Rien de la structure du modèle n'est codé en dur dans les composants. Le fichier est le **report
littéral** de la source — c'est cette littéralité qui rend le modèle défendable en soutenance, et
rien qui ne figure pas dans le PDF source n'a le droit d'y entrer.

| Clé | Contenu |
|---|---|
| `blocks` | 4 blocs thématiques (Strategy, Stakeholders, Business, Technology) |
| `blocks[].dimensions` | 9 dimensions, chacune avec sa couleur d'identification |
| `blocks[].dimensions[].areas` | 28 domaines, avec `level` (rang déclencheur 1-5), `desc`, `goals`, `exampleArtifacts` |
| `levels` | les 5 niveaux : `name`, `tag`, `desc`, `detail` |

Il porte **72 critères d'adoption**, **271 pratiques** et **193 exemples d'artefacts**. Les artefacts
sont affichés, dépliables, sur la carte du domaine au questionnaire. Les critères et les pratiques,
eux, **ne paraissent nulle part** — ni au questionnaire, ni à l'export : affichés à côté des
énoncés, ils rouvrent la lecture en liste de conditions que l'unité de réponse par énoncé avait
fermée, et donnent à croire qu'on répond sur eux. Trois tests de `tests/sources.test.js`
interdisent leur retour. Ils restent dans le modèle, qui demeure le report littéral de la source.

Les noms des 4 blocs sont volontairement laissés en anglais : ce sont des étiquettes de taxonomie,
pas du texte à lire. Les cinq niveaux font exception, parce qu'ils sont le résultat rendu à
l'utilisateur — la seule phrase qu'il retiendra de l'évaluation. Leur `name` est un **profil de
maturité d'adoption** en français, qui fusionne le terme d'Ozkaya et al. avec le stade correspondant
de l'échelle de transformation de Venkatraman (1994) ; les deux échelles se recouvrent, et leur
frontière évolutif / révolutionnaire tombe exactement entre *Implemented* et *Aligned* :

| # | AIMM | Venkatraman | Profil retenu |
|---|---|---|---|
| 1 | Exploratory AI | Localized Exploitation | Exploration localisée |
| 2 | Implemented AI | Internal Integration | Intégration opérationnelle |
| 3 | Aligned AI | Business Process Redesign | Alignement des processus |
| 4 | Scaled AI | Business Network Redesign | Mise à l'échelle en réseau |
| 5 | Future Ready AI | Business Scope Redefinition | Redéfinition stratégique du périmètre |

Ce rapprochement est une **lecture propre à ce travail** : la source ne cite Venkatraman nulle part.
Sa contrepartie de traçabilité est le tableau d'équivalences de l'écran d'information, qui compare en
outre les échelles de Gartner, d'Altimeter et d'Element AI — colonnes marquées « à vérifier » tant
qu'aucun nom d'étage n'y a été relevé dans la publication elle-même. Le nom de Venkatraman n'est
prononcé qu'à trois endroits : cet écran, l'attribution, et la légende de crédit du diagramme des
paliers, où il crédite une figure que le lecteur voit reproduite sous ses yeux. La prose du parcours
dit « l'échelle de transformation », qui se comprend sans référence.

La traduction des 25 domaines repris d'Ozkaya et al. suit le registre de
[France Num](https://www.francenum.gouv.fr/guides-et-conseils/intelligence-artificielle) : français
professionnel accessible à un comité de direction, anglicismes d'usage conservés (ROI, KPI, SLA/SLO,
POC, sandbox) plutôt que systématiquement francisés. Le modèle source distingue l'unité
organisationnelle évaluée de l'organisation entière, et cette distinction n'est pas sans objet dans
une PME : elle est portée **une fois**, par l'attribut `scope` déclaré au cadrage puis nommé en tête
de la restitution et de chaque page de l'export, plutôt que rappelée dans chacun des énoncés.

### 5.2 `src/data/statements.js` : les 140 énoncés

Les énoncés ne sont pas dans `model-data.json`, et c'est délibéré : ils ne figurent pas dans le PDF
source, ils en sont **dérivés**. Ils vivent donc à côté, comme `transformation.js` et
`in-progress.js`.

D'où ils sont dérivés, précisément : la source ne décrit pas ce qu'est un niveau domaine par
domaine ; elle pose une seule fois, au § 5, une grille de trois indicateurs transversaux —
Responsabilité, Planification, Ressources — et, pour chacun, cinq lignes qui disent ce qu'un rang
attend quelle que soit la capacité considérée (`maturity-indicators.js`) :

```
1  absence — rien d'assigné, rien de planifié, rien d'alloué régulièrement
2  existence désignée — des rôles, un plan, un budget pour ce domaine
3  boucle de mesure — ce qui est mesuré change la conduite
4  reproductibilité au-delà du premier cas — hors de l'équipe qui a lancé
5  anticipation — les choix servent une stratégie et des scénarios à venir
```

Un énoncé de rang *n* instancie, pour son domaine, la ligne *n* de cette grille — il en nomme la
manifestation la plus observable dans ce domaine-là, sans réciter les trois indicateurs à la suite.
Une phrase, au présent, observable, tranchable par un dirigeant sans audit et de mémoire, ≤ 25 mots.
La méthode complète, avec la dérivation d'un domaine travaillée en entier comme exemple de
référence, est dans [`docs/logs/ENONCES.md`](docs/logs/ENONCES.md).

Ces indicateurs ont d'abord été posés comme question dans l'outil ; ils ont été **absorbés** dans la
rédaction des énoncés le 28.08.2026. Deux effets, et ce sont eux qui motivent la décision : la
rédaction des 140 énoncés cesse d'être un exercice d'auteur et devient une dérivation traçable de la
source ; et la sémantique de niveau devient uniforme entre domaines, ce qui rend commensurable la
comparaison sur laquelle repose la règle du minimum. `maturity-indicators.js` demeure comme
référence de rédaction et comme section de l'écran d'information.

Deux audits internes portent sur ces énoncés — [contrôle linguistique](docs/audits/enonces-langue.md)
et [traçabilité indicateurs × critères](docs/audits/enonces-tracabilite.md), chacun avec ses
propositions de correction en regard.

### 5.3 La neuvième dimension (A5-A7), contribution propre du travail

Le référentiel de base couvre huit dimensions et 25 domaines. Trois critères de la matrice de
comparaison n'y trouvaient aucun équivalent ; ils forment la neuvième dimension, *Motivations et
Justification de l'adoption*, rattachée au bloc Strategy, mesurée comme les autres depuis le
18.08.2026.

| Domaine | Rang | Critère consolidé | Source |
|---|---|---|---|
| A5 · Gestion du budget et des investissements IA | 2 | C-31, critique de la progression linéaire | Sawang et Sornlertlamvanich (2026) |
| A6 · Pressions et motivations externes | 1 | C-30, axe environnemental du TOE | Hansen et al. (2024) |
| A7 · Adéquation et proportionnalité de la solution (*right-sizing*) | 2 | C-28, filtre d'applicabilité PME | Bettoni et al. (2021), Corti et al. (2025) |

Huit critères d'adoption et vingt-sept pratiques au total. C'est cette dimension, et elle seule, qui
rend le modèle applicable à une PME : le référentiel de base est écrit pour des organisations qui
disposent d'équipes dédiées, et rien d'autre n'y interroge les moyens engagés, la proportionnalité
de la solution, ni la légitimité de ne pas y aller. La critique de la progression linéaire y cesse
d'être une réserve théorique pour devenir une pratique évaluable : l'arrêt, le report et l'adoption
partielle se consignent au même titre que la poursuite.

La dépendance au donneur d'ordre — trait structurant du tissu sous-traitant horloger et
microtechnique de l'arc jurassien — est recensée en A6 et opposable au choix de solution en A7, par
les engagements de confidentialité et le secret de fabrication. Ce que la revendication « PME de
l'arc jurassien » engage exactement, et ce qu'elle n'engage pas, est déclaré dans
[`docs/admin/PERIMETRE.md`](docs/admin/PERIMETRE.md).

---

## 6. Le contrat de session

L'état complet — écran courant, attributs de contexte, portée déclarée, niveau retenu par domaine —
est écrit dans `localStorage` sous la clé `maia.session`, en `SCHEMA_VERSION = 2`. Toute donnée
relue est validée avant d'être réinjectée : les valeurs inconnues sont écartées silencieusement, pas
l'ensemble.

```js
answers[areaId] ∈ { 1, 2, 3, 4, 5, 'na' }   // 'na' = hors périmètre
                                            // absent = non renseigné, ce qui n'est ni l'un ni l'autre
```

**Aucune migration depuis la v1**, et le motif est de mesure, non de confort. `checked` portait des
pratiques validées, `answers` porte un niveau par domaine : rien ne dit à quel rang d'énoncé
correspond un jeu de critères validés, c'est justement ce qui a changé de nature. Mais la version
aurait dû monter même sans `answers` — le lot précédent a retiré une option de `scope`, remplacé les
identifiants d'`ambition` et supprimé l'attribut de régulation, or un attribut absent vaut le score
**maximal** dans le calcul du niveau cible. Une session ancienne se serait rechargée avec des
réponses perdues *et* une recommandation plus haute qu'à l'enregistrement, sans le moindre message.
Une session relue doit valoir ce qu'elle valait, ou ne pas être relue.

L'accès au stockage est protégé : en navigation privée, l'outil tourne sans persistance plutôt que
d'échouer. Les écrans retirés par la fusion (`tool1`, `tool2`, `tool3`) retombent sur `tool` via
`RETIRED_SCREENS`, pour qu'une session enregistrée avant elle ne rouvre pas à l'accueil.

La remise à zéro se demande depuis l'en-tête, présent sur tous les écrans, et passe par la même
modale que les autres décisions engageantes. **La sauvegarde JSON — copier / restaurer une session —
n'est pas livrée** : elle est la première ligne de l'ordre de coupe du backlog.

---

## 7. La documentation du dépôt

```
docs/
├── logs/          les instruments de traçabilité de la démarche
│   ├── DECISIONS.md            journal des décisions structurelles : date, décision, motif,
│   │                           alternative écartée. Chaque entrée doit pouvoir être défendue
│   ├── DECISIONS-brouillon.md  13 entrées des 28.08 et 31.08.2026, pas encore intégrées (§ 8)
│   ├── BACKLOG.md              lots, dépendances, ordre de coupe, partage des rôles, version 2
│   ├── ENONCES.md              guide de rédaction des 140 énoncés et grille de dérivation
│   ├── MERGE.md                les 12 points de conflit tranchés lors du merge des cadrages
│   ├── MODEL_EXTRAS.md         §§ 4.4 à 4.11 de la source : exemples d'artefacts
│   └── NIVEAU-CIBLE.md         le calcul du niveau cible recommandé, en entier
├── audits/        contrôles de langue et de traçabilité sur les énoncés, avec leurs propositions
├── admin/         PERIMETRE.md, la source AIMM v1.0, la ratification, le rapport, les guides Vue
├── memory/        les prompts de travail successifs
├── proto/         prototypes jetables (radar des dimensions)
└── rapport/       matière du rapport
```

Trois instruments assurent la traçabilité de la démarche, et le rapport s'appuie sur eux :
`DECISIONS.md` pour les justifications des chapitres 4 et 5, `BACKLOG.md` pour les lots et l'ordre
de coupe, `docs/audits/` pour les contrôles menés sur les énoncés.

---

## 8. Écarts connus entre le dossier et le code

Un dossier dont la documentation contredit le code affaiblit tout ce que le rapport affirme par
ailleurs. Ce qui reste à résorber au 02.09.2026, avec ce qui fait foi :

| Écart | Ce que dit le code | À faire |
|---|---|---|
| `DECISIONS.md` s'arrête au 18.08.2026 | Les 13 décisions des 28.08 et 31.08 sont appliquées | Intégrer `DECISIONS-brouillon.md` au journal |
| L'entrée du 28.08 et l'item 0.3 du backlog décrivent des pratiques affichées en lecture seule | Le code ne les affiche pas du tout, et trois tests l'interdisent | Mettre le journal en accord avec le code |
| Le backlog montre les lots 2 et 3 largement non cochés | Le calcul, le questionnaire, les résultats et l'ancrage sont livrés | Re-cocher contre le dépôt, sans recopier l'un dans l'autre |
| `attribution.js` déclare le référentiel sous licence CC BY-NC-ND | Mention issue du rapport préliminaire de décembre 2025 ; le document v1.0 employé porte un copyright Carnegie Mellon University et une clause du SEI, sans licence Creative Commons | Corriger la donnée d'attribution |
| Le pied d'attribution est masqué à l'impression, et l'export n'en porte aucun | La pièce emportée sort donc sans attribution ni démenti | Poser l'attribution dans l'en-tête ou le pied de chaque page d'export |
| `PERIMETRE.md` présente le seuil de N minimal comme « une règle du modèle » | Aucune ligne de code ne le porte | Le requalifier en spécification à honorer le jour où la collecte existe |
| `devApproach` est collecté au cadrage | Il ne score sur aucun axe et ne plafonne rien : il est volontairement inerte | Chantier de scoping par pratiques reporté en version 2 — le besoin est clos par le hors périmètre |
| Le code dit `area` et `goal` | L'interface dit « domaine de capacité » et « critère d'adoption » | Décalage **délibéré** : `model-data.json` reste le report littéral de la source anglaise. Propagation aux identifiants reportée en version 2 |

L'export ne porte, à ce jour, que les domaines qui séparent du profil visé, avec pour chacun
l'énoncé de son rang visé, sous un en-tête qui nomme le périmètre, le profil visé et le profil
diagnostiqué. Le récapitulatif du contexte, le radar imprimable et le détail des 28 réponses annoncés
à la ligne 3.10 du backlog n'y sont pas.

Restent également ouverts : la sauvegarde JSON (3.11), le contrôle d'accessibilité et de parcours
clavier à 1200 / 900 px (3.13), la séance de terminologie avec l'experte (4.4b) et la séance test
chronométrée (4.5).

---

## 9. Déclaration d'usage de l'intelligence artificielle

Conformément à la charte déontologique de l'école, l'usage d'outils d'IA générative est déclaré. La
convention appliquée pendant toute la construction est écrite en tête du backlog : **l'auteur rédige
et décide, l'assistant assemble, relit ou critique**, et aucun énoncé de questionnaire ni aucune
correspondance interprétative entre sources n'est rédigé par l'assistant.

**Relèvent du travail de l'auteur**, sans assistance rédactionnelle : le choix du référentiel de base
et sa justification ; la matrice de comparaison des six modèles, son protocole et sa validation ligne
à ligne contre les sources ; l'identification des trois critères consolidés absents d'Ozkaya et la
décision d'en faire une neuvième dimension mesurée ; le découpage de celle-ci en trois domaines,
leur nom, leur rang et la source adossée à chacun ; la règle d'agrégation et le traitement du biais
qu'elle introduit ; la fusion Ozkaya × Venkatraman et le nommage français des cinq profils ;
l'élicitation du niveau cible ; **la rédaction des 140 énoncés descriptifs** et la traduction des
énoncés du référentiel de base.

**Ont été produits avec assistance d'un LLM** : le squelette technique du dépôt (configuration Vite,
workflow d'intégration continue, composants, composables, scripts) ; la génération programmatique de
la structure de `model-data.json` depuis la matrice de comparaison ; les suites de tests ; le codage
initial de la matrice de comparaison, dont aucune ligne n'est entrée dans la version finale sans
avoir été relue contre la source et validée à la main ; les audits internes de langue et de
traçabilité des énoncés (`docs/audits/`), qui sont des relectures critiques et non des rédactions ;
et la mise en forme de la présente documentation.

Cette déclaration est à reprendre et à préciser dans le chapitre méthodologique du rapport, dont le
§ 2.2 en porte déjà la version courte.

---

## 10. Sources

Ozkaya, I. et al. (2026). *The AI Adoption Maturity Model v1.0*. Carnegie Mellon University,
Software Engineering Institute. — référentiel de base : huit dimensions, vingt-cinq domaines de
capacité, la grille des trois indicateurs transversaux, les exemples d'artefacts.

Venkatraman, N. (1994). *IT-Enabled Business Transformation: From Automation to Business Scope
Redefinition*. Sloan Management Review. — échelle de transformation, nommage des cinq profils,
lecture de la nature du passage. Le rapprochement avec l'AIMM est propre à ce travail.

Elia, G. et al. (2024). *Digital Transformation Canvas*. — vocabulaire du parcours et blocs de
restitution.

Jeanneret Medina, M. et al. (2024). HEG-Arc. — méthode des énoncés descriptifs, sur laquelle repose
l'unité de réponse du questionnaire.

Bettoni, A. et al. (2021). IFAC. — C-28, filtre d'applicabilité PME. Fonde A7.

Corti, D. et al. (2025). *Definition of a solution space to guide AI adoption in manufacturing SMEs*.
IFAC-PapersOnLine, 59(10). — espace de solutions contraint par les moyens de la PME. Complète Bettoni
sur A7 : le filtrage des solutions par ce que l'entreprise peut mettre en œuvre et maintenir.

Hansen, et al. (2024). *AI Capability Maturity Model*. — C-30, axe environnemental du TOE. Fonde A6.

Sawang, S. et Sornlertlamvanich, V. (2026). arXiv. — C-31, critique de la progression linéaire.
Fonde A5, et en particulier son troisième critère : l'arrêt et le report comme décisions consignées.

Kudryavtsev, D. et al. (2025). — corroboration, niveau 2 partiellement publié.

Sharma, A. (2026). *The SMB AI Maturity Index*. Working paper SSRN. — précédent de conception et
protocole Delphi. Statut de source limité : auteur unique affilié à un éditeur, validation proposée
non exécutée, usage substantiel de LLM déclaré. Ne fonde aucun construit.

Peffers, K. et al. (2007). *A Design Science Research Methodology*. JMIS. — cadre méthodologique.

---

**Outil non officiel**, sans lien avec le Software Engineering Institute ni avec Accenture. Il
applique un modèle publié sans en être ni une publication, ni une certification, ni une évaluation
reconnue par ses auteurs.

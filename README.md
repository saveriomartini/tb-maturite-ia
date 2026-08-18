# Instrument de diagnostic de maturité IA pour PME

Travail de Bachelor, HEG-Arc, module 66-62, session SP temps partiel 2025-2026.

**Auteur** Saverio Martini · **Direction** Maria Sokhn · **Assistant technique** Rafael Moreira Dos Santos
**Début** 31.03.2026 · **Restitution** 13.09.2026 · **Défense** octobre 2026

---

## 1. Ce que fait l'outil, et ce qu'il ne fait pas

Il rend navigable de bout en bout le parcours d'auto-évaluation en trois phases : Cadrage (degré de
transformation visé, attributs de contexte), Évaluation (questionnaire par domaine de capacité) et
Résultats (profil acquis, détail par bloc, écarts restants, export). Quatre blocs thématiques, neuf
dimensions, vingt-huit domaines de capacité, échelle à cinq niveaux — modèle CMU-SEI / Accenture
*AI Adoption Maturity Model v1.0*, consolidé avec la Matrice N2 de l'auteur.

Les vingt-huit domaines sont tous mesurés : vingt-cinq repris d'Ozkaya et al. (2026) et traduits,
trois rédigés par l'auteur pour la neuvième dimension (§ 4). Une quatrième phase, Ancrage, a été
affichée jusqu'au 15.08.2026 comme hors périmètre ; elle a été retirée du parcours — annoncer sur
chaque écran ce que l'outil ne fait pas est un aveu de conception, pas une information.

Aucun backend, aucune base de données, aucune authentification. L'état de session vit en mémoire
dans le navigateur, donc aucune donnée ne quitte le poste — c'est un choix d'architecture, à
documenter comme tel dans le rapport, pas une lacune.

La comparaison inter-PME est hors périmètre.

---

## 2. Démarrage pas à pas dans VS Code

### 2.1 Prérequis, une seule fois

1. **Node.js 20 ou supérieur.** Vérifier dans un terminal : `node -v`. Si la commande échoue ou
   affiche moins de 20, installer depuis nodejs.org (version LTS).
2. **Git.** Vérifier : `git --version`.
3. **VS Code.** Au premier ouverture du dossier, VS Code proposera d'installer les extensions
   recommandées listées dans `.vscode/extensions.json` — accepter. La seule indispensable est
   **Vue - Official** (`Vue.volar`), qui apporte la coloration et l'autocomplétion des fichiers `.vue`.

### 2.2 Ouvrir le projet

```sh
cd chemin/vers/tb-maturite-ia
code .
```

Puis, dans VS Code, ouvrir un terminal intégré avec `Ctrl+ù` (Windows/Linux) ou `Cmd+J` (macOS).

### 2.3 Installer et lancer

```sh
npm install
npm run dev
```

Le terminal affiche une adresse locale, en général `http://localhost:5173`. `Ctrl+clic` dessus.
Toute modification d'un fichier source se reflète immédiatement dans le navigateur, sans relancer.

Pour arrêter : `Ctrl+C` dans le terminal.

### 2.4 Créer le dépôt GitHub

```sh
git init
git add .
git commit -m "Structure initiale du modele v1.2 et maquette du parcours"
git branch -M main
git remote add origin https://github.com/<votre-compte>/tb-maturite-ia.git
git push -u origin main
```

Le nom du dépôt doit être **`tb-maturite-ia`**. S'il diffère, modifier la constante
`NOM_DU_DEPOT` dans `vite.config.js` : c'est la cause quasi certaine d'un déploiement où
la page s'affiche blanche et où tous les assets renvoient 404.

### 2.5 Activer la publication

Sur GitHub : **Settings → Pages → Build and deployment → Source = GitHub Actions**.
Ne pas choisir « Deploy from a branch » : le workflow fourni utilise les actions officielles Pages.

À chaque `git push` sur `main`, l'onglet **Actions** montre le build. Une fois terminé, la maquette
est en ligne à `https://<votre-compte>.github.io/tb-maturite-ia/`.

### 2.6 Vérifier avant de montrer

```sh
npm run lint
npm run build
npm run preview
```

`lint` applique le [Style Guide officiel de Vue](https://vuejs.org/style-guide/) via
`eslint-plugin-vue` (voir `eslint.config.js`) ; `npm run lint:fix` corrige ce qui est corrigeable
automatiquement. La même commande tourne dans le workflow de publication : un push qui ne passe pas
le lint ne se déploie pas.

`preview` sert le contenu réellement publié, sur le port 4173. C'est le seul test fiable des
chemins d'assets et du routage.

---

## 3. Arborescence

```
tb-maturite-ia/
├── .github/workflows/deploy.yml   publication automatique sur GitHub Pages
├── .vscode/                       extensions recommandées et réglages d'éditeur
├── docs/
│   ├── DECISIONS.md               journal des décisions structurelles (à tenir à jour)
│   ├── MODEL_EXTRAS.md            exemples d'artefacts, extraits des §4.4 à 4.11 de la source
│   ├── NIVEAU-CIBLE.md            calcul du niveau cible recommandé
│   └── PERIMETRE.md               ce qui est dans le TB, ce qui n'y est pas, ce qui est revendiqué
├── src/
│   ├── data/                      CONTENU, aucune logique
│   │   ├── model-data.json        SOURCE DE VÉRITÉ du modèle (blocs, dimensions, areas, niveaux)
│   │   ├── model-data.js          export ES module de model-data.json
│   │   ├── context-attributes.js  attributs de contexte, plafonds, exigences du Level 5
│   │   ├── maturity-indicators.js grille des 3 indicateurs transversaux (§5 de la source)
│   │   ├── preparation.js         profil « Préparation », ajouté hors AIMM sous le profil 1
│   │   ├── demo-sessions.js       PME fictives de la démonstration (contexte, critères validés)
│   │   ├── journey.js             texte du parcours en trois phases
│   │   └── transformation.js      échelle de Venkatraman, lecture de l'écart à la restitution
│   ├── domain/                    RÈGLES MÉTIER, fonctions pures, aucune dépendance à Vue
│   │   ├── model.js               vues dérivées du modèle (areas à plat, noms de profil)
│   │   ├── scoring.js             area acquise, niveau d'un bloc, niveau acquis, gap
│   │   ├── recommendation.js      niveau cible recommandé (ambition × capacité, plafonds)
│   │   ├── demo-session.js        traduit une PME fictive en état de session complet
│   │   └── navigation.js          ordre des écrans, phases, enchaînement
│   ├── composables/               ÉTAT réactif
│   │   ├── useMaturityTool.js     session, actions, un view-model par écran
│   │   └── useSessionStorage.js   persistance locale validée et versionnée
│   ├── assets/tokens.css          jetons visuels + primitives partagées (.panel, .chip, .tag)
│   ├── App.vue                    gabarit de page
│   ├── components/                PRÉSENTATION
│   │   ├── AppHeader.vue          en-tête sticky et onglets de phase
│   │   ├── AppScreen.vue          gabarit d'écran (largeur de lecture, gouttières)
│   │   ├── AppScreenNav.vue       pied de page Retour / Suivant
│   │   ├── MaturityTool.vue       aiguillage vers l'écran courant
│   │   ├── *.vue                  blocs réutilisés (FrameworkTable, ScopeMap, GoalChecklist,
│   │   │                          MaturityLevelList, ContextAttributeForm, ContextField,
│   │   │                          MaturityIndicatorsForm, TargetRecommendationPanel,
│   │   │                          LevelSummary)
│   │   └── screens/               un composant par écran (Home, Info, Demo, Cadrage1-3,
│   │                              DiagStart, Diag, Palier, Resti1-3, Export)
│   └── main.js
├── index.html                     charge la police Archivo (preconnect) et monte l'application
├── eslint.config.js               règles de code = Style Guide officiel de Vue
├── package.json
└── vite.config.js
```

### Comment lire le code

Quatre couches, dans cet ordre de dépendance : `data/` (contenu) → `domain/` (règles) →
`composables/` (état) → `components/` (affichage). Une couche ne connaît jamais la suivante.

Concrètement : `domain/scoring.js` ne sait pas qu'une interface existe et se teste sans navigateur ;
`useMaturityTool.js` ne produit que des données (libellés, drapeaux, listes) et jamais de style ;
chaque composant décide de son apparence dans son propre `<style scoped>`, les quelques motifs
partagés vivant dans `assets/tokens.css`. Un écran reçoit son view-model en `prop` et remonte les
intentions de l'utilisateur en `emit` — il ne mute jamais l'état directement.

---

## 4. `src/data/model-data.json` est la source de vérité

Rien de la structure du modèle n'est codé en dur dans les composants. Le fichier porte :

| Clé | Contenu |
|---|---|
| `blocks` | 4 blocs thématiques (Strategy, Stakeholders, Business, Technology) |
| `blocks[].dimensions` | 9 dimensions au total, chacune avec une couleur d'identification |
| `blocks[].dimensions[].areas` | 28 areas de compétence, avec `level` (1-5), `desc`, `goals`, `practices` |
| `levels` | les 5 niveaux de maturité et leurs propriétés (nom, tag, description, détail) |

Toute la logique de scoring (areas en périmètre selon le niveau cible, niveau acquis par bloc,
calcul du gap) vit dans `src/domain/`, sous forme de fonctions pures, pas dans les composants
d'écran — ceux-ci ne font que lire le view-model exposé par `useMaturityTool.js`.

### Traduction des objectifs, pratiques et niveaux

Les noms, descriptions, objectifs et pratiques des 25 areas issues d'Ozkaya et al. (2026) ont été
traduits de l'anglais vers le français. Le sens reste au plus près de la source ; le registre est
calibré sur celui de [France Num](https://www.francenum.gouv.fr/guides-et-conseils/intelligence-artificielle)
(dispositif du ministère de l'Économie dédié à la transformation numérique et IA des TPE/PME) :
français professionnel accessible à un CoDir, anglicismes d'usage conservés (ROI, KPI, SLA/SLO, POC,
sandbox, roadmap le cas échéant) plutôt que systématiquement francisés. Les trois areas de la Matrice
N2 (A5-A7) n'ont pas de source anglaise : elles sont écrites directement en français, au même
registre (voir la sous-section suivante). Les noms des 4 blocs (Strategy, Stakeholders, Business,
Technology) sont volontairement laissés en anglais : ce sont des étiquettes de la taxonomie source,
pas du texte à lire.

Les cinq niveaux de maturité (`levels`) font exception à la règle des noms laissés en anglais : ce
ne sont pas des étiquettes de taxonomie mais le résultat rendu à l'utilisateur, la seule phrase
qu'il retiendra de l'évaluation. Leur `name` est donc un **profil de maturité d'adoption** en
français, qui fusionne le terme d'Ozkaya et al. avec le stade correspondant de l'échelle de
transformation de Venkatraman (1994) — les deux échelles se recouvrent, et leur frontière
évolutif / révolutionnaire tombe exactement entre Implemented et Aligned :

| # | AIMM | Venkatraman | Profil retenu |
|---|---|---|---|
| 0 | — | — | Préparation *(ajout, hors modèles sources)* |
| 1 | Exploratory AI | Localized Exploitation | Exploration localisée |
| 2 | Implemented AI | Internal Integration | Intégration opérationnelle |
| 3 | Aligned AI | Business Process Redesign | Alignement des processus |
| 4 | Scaled AI | Business Network Redesign | Mise à l'échelle en réseau |
| 5 | Future Ready AI | Business Scope Redefinition | Redéfinition stratégique du périmètre |

La formule courte (`tag`) est réécrite pour porter la même synthèse ; l'énoncé long (`desc`) et le
`detail` restent la traduction fidèle de la source et continuent d'y désigner les niveaux par leur
nom anglais. Le vocabulaire est aligné sur
celui des areas : `organizational unit` est rendu par « l'entreprise », `AI-enabled systems and
workflows` par « systèmes et workflows soutenus par l'IA », et ROI, sandbox et workflow sont
conservés.

Le premier de ces choix demande une justification à part, parce qu'il porte sur une distinction dont
l'outil dépend. Le modèle source distingue l'unité organisationnelle évaluée de l'organisation
entière, et cette distinction n'est **pas** sans objet dans une PME : c'est elle qui autorise une
entreprise à déclarer son seul service après-vente comme unité évaluée au lieu de recevoir un verdict
sur l'ensemble de ses activités (entrée du 18.08.2026 de `docs/DECISIONS.md`). Elle n'est simplement
pas portée par les énoncés. La rendre dans 271 pratiques par « l'unité organisationnelle évaluée »
alourdirait chaque phrase d'un rappel que l'attribut de contexte `scope` fait une fois pour toutes :
le périmètre est déclaré au cadrage, puis nommé en tête de la restitution et de chaque page de
l'export. Sous cette ligne, « l'entreprise » d'un énoncé se lit comme l'unité déclarée.

Le décalage qui subsiste est assumé : une organisation qui a déclaré « un département » lit des
énoncés qui disent « l'entreprise ». Il est borné par la déclaration en tête, et le corriger
supposerait de reprendre la traduction occurrence par occurrence contre le PDF source — les 75
occurrences de « l'entreprise » dans `model-data.json` ne traduisent pas toutes `organizational
unit`, et rien dans le fichier français ne permet de trancher lesquelles.

Chaque niveau porte en outre un `detail` : un exposé long, découpé en paragraphes, traduit des
sections 3.1 à 3.5 du document source (`docs/The_AI_Adoption_Maturity_Model_v1.0.pdf`), une section
par niveau. Il est affiché en repli/dépli depuis le tableau des niveaux de l'écran Cadrage 1, pour
que le lecteur qui le souhaite puisse aller au-delà de la formule courte. Les noms des areas de
compétence cités dans ces textes reprennent leur traduction française telle qu'elle figure dans
`blocks[].dimensions[].areas[].name`, afin que le renvoi d'un paragraphe vers une area reste
vérifiable dans l'outil.

Chaque area porte enfin un `exampleArtifacts` : la liste des exemples d'artefacts associés à la
capability area correspondante, traduite depuis les sections 4.4 à 4.11 du document source
(regroupées dans `docs/MODEL_EXTRAS.md`), avec la même règle de registre que le reste du modèle.
Elle est affichée dans la barre latérale de l'écran Diagnostic. Les trois areas de la Matrice N2
(A5-A7) n'ont pas d'équivalent dans le document source : leurs dix-neuf artefacts sont écrits sur le
même principe — des pièces qu'une PME peut produire et montrer, pas des intentions.

### La neuvième dimension (A5-A7), contribution propre du travail

Le référentiel de base couvre huit dimensions et 25 capability areas. Trois critères de la matrice
de comparaison n'y trouvaient aucun équivalent ; ils forment la neuvième dimension, *Motivations et
Justification de l'adoption*, rattachée au bloc Strategy. Elle est **mesurée comme les autres**
depuis le 18.08.2026. Jusqu'à cette date, ses trois areas étaient déclarées `pending`, sans critère
ni pratique : le modèle réellement évalué se réduisait donc aux 25 areas d'Ozkaya traduites, et la
contribution propre du travail n'était mesurée nulle part.

| Area | Rang | Critère consolidé | Source |
|---|---|---|---|
| A6 · Pressions et motivations externes | 1 | C-30, axe environnemental du TOE | Hansen et al. (2024) |
| A5 · Gestion du budget et des investissements IA | 2 | C-31, critique de la progression linéaire | Sawang et Sornlertlamvanich (2026) |
| A7 · Adéquation et proportionnalité de la solution (right-sizing) | 2 | C-28, filtre d'applicabilité PME | Bettoni et al. (2021), Corti et al. (2025) |

Huit critères d'adoption et vingt-sept pratiques au total. C'est cette dimension, et elle seule, qui
rend le modèle applicable à une PME : le référentiel de base est écrit pour des organisations qui
disposent d'équipes dédiées, et rien d'autre n'y interroge les moyens engagés, la proportionnalité
de la solution, ni la légitimité de ne pas y aller. La critique de la progression linéaire (C-31) y
cesse d'être une réserve théorique pour devenir une pratique évaluable : l'arrêt, le report et
l'adoption partielle se consignent au même titre que la poursuite (A5, troisième critère).

La dépendance au donneur d'ordre — trait structurant du tissu sous-traitant horloger et
microtechnique de l'arc jurassien — est recensée en A6 et opposable au choix de solution en A7, par
les engagements de confidentialité et le secret de fabrication. Ce que la revendication
« PME de l'arc jurassien » engage exactement, et ce qu'elle n'engage pas, est déclaré dans
[`docs/PERIMETRE.md`](docs/PERIMETRE.md).

---

## 5. Déclaration d'usage de l'intelligence artificielle

Conformément à la charte déontologique GES-FOR3-REF016, l'usage d'outils d'IA générative est déclaré.

Ont été produits avec assistance d'un LLM : le squelette technique du dépôt (configuration Vite,
workflow d'intégration continue, composants de navigation, scripts d'export et d'import), la
génération programmatique de la structure du fichier `modele.json` depuis la matrice de comparaison,
les synthèses françaises de la grille des trois indicateurs de maturité, et — depuis le 18.08.2026 —
la **rédaction des énoncés de la neuvième dimension** : les 8 critères d'adoption, 27 pratiques,
3 descriptions et 19 artefacts d'exemple de A5, A6 et A7, rédigés à partir des sources adossées à
chacun de ces domaines (Hansen et al. 2024 ; Sawang et Sornlertlamvanich 2026 ; Bettoni et al. 2021
et Corti et al. 2025) et au registre France Num retenu pour le reste du modèle.

Relèvent du travail de l'auteur : le choix du référentiel de base et sa justification, la matrice de
comparaison des six modèles et son codage, l'identification des trois critères consolidés absents
d'Ozkaya et la décision d'en faire une neuvième dimension, le découpage de celle-ci en trois
domaines, leur nom, leur rang sur l'échelle et la source adossée à chacun, la répartition des
dimensions en socles, la règle d'agrégation et le traitement du biais qu'elle introduit,
l'élicitation du niveau cible, et les énoncés descriptifs des 25 domaines repris du référentiel de
base.

La formulation des énoncés de A5-A7 est donc, à ce jour, la seule partie du modèle dont la
rédaction est assistée. Elle est à reprendre par l'auteur avant soutenance ; tant que cette reprise
n'a pas eu lieu, la présente déclaration vaut telle quelle et doit être portée au rapport dans ces
termes.

Cette déclaration est à reprendre et à préciser dans le chapitre méthodologique du rapport.

---

## 6. Sources

Ozkaya, I. et al. (2026). *The AI Adoption Maturity Model v1.0*. Carnegie Mellon University,
Software Engineering Institute. — référentiel de base, huit dimensions et vingt-cinq domaines.

Elia, G. et al. (2024). *Digital Transformation Canvas*. — vocabulaire du parcours et forme de la restitution.

Bettoni, A. et al. (2021). IFAC. — C-28, filtre d'applicabilité PME. Fonde A7.

Corti, D. et al. (2025). *Definition of a solution space to guide AI adoption in manufacturing SMEs*.
IFAC-PapersOnLine, 59(10). — espace de solutions contraint par les moyens de la PME. Complète
Bettoni sur A7 : le filtrage des solutions par ce que l'entreprise peut mettre en œuvre et maintenir.

Hansen, et al. (2024). *AI Capability Maturity Model*. — C-30, axe environnemental du TOE. Fonde A6.

Kudryavtsev, D. et al. (2025). — corroboration, niveau 2 partiellement publié.

Sawang, S. et Sornlertlamvanich, V. (2026). arXiv. — C-31, critique de la progression linéaire.
Fonde A5, et en particulier son troisième critère : l'arrêt et le report comme décisions consignées.

Sharma, A. (2026). *The SMB AI Maturity Index*. Working paper SSRN. — précédent de conception et
protocole Delphi. Statut de source limité : auteur unique affilié à un éditeur, validation proposée
non exécutée, usage substantiel de LLM déclaré. Ne fonde aucun construit.

Jeanneret Medina, M. et al. (2024). HEG-Arc. — méthode des énoncés descriptifs.

Peffers, K. et al. (2007). *A Design Science Research Methodology*. JMIS. — cadre méthodologique.

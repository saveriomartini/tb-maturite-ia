# Instrument de diagnostic de maturité IA pour PME

Travail de Bachelor, HEG-Arc, module 66-62, session SP temps partiel 2025-2026.

**Auteur** Saverio Martini · **Direction** Maria Sokhn · **Assistant technique** Rafael Moreira Dos Santos
**Début** 31.03.2026 · **Restitution** 13.09.2026 · **Défense** octobre 2026

---

## 1. Ce que fait l'outil, et ce qu'il ne fait pas

Il rend navigable de bout en bout le parcours d'auto-évaluation en quatre phases : Cadrage
(compréhension du modèle, périmètre, niveau cible), Diagnostic (questionnaire par area de
compétence), Restitution (niveaux acquis, détails par bloc, liste des pratiques manquantes, export),
et Ancrage (hors périmètre du TB). Quatre blocs thématiques, neuf dimensions, vingt-huit areas de
compétence, échelle à cinq niveaux — modèle CMU-SEI / Accenture *AI Adoption Maturity Model v1.0*,
consolidé avec la Matrice N2 de l'auteur.

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
│   ├── NIVEAU-CIBLE.md            calcul du niveau cible recommandé
│   └── PERIMETRE.md               ce qui est dans le TB et ce qui n'y est pas
├── src/
│   ├── data/                      CONTENU, aucune logique
│   │   ├── model-data.json        SOURCE DE VÉRITÉ du modèle (blocs, dimensions, areas, niveaux)
│   │   ├── model-data.js          export ES module de model-data.json
│   │   ├── context-attributes.js  attributs de contexte, plafonds, exigences du Level 5
│   │   ├── maturity-indicators.js grille des 3 indicateurs transversaux (§5 de la source)
│   │   ├── preparation.js         profil « Préparation », ajouté hors AIMM sous le profil 1
│   │   ├── demo-sessions.js       PME fictives de la démonstration (contexte, critères validés)
│   │   └── journey.js             texte du parcours en quatre phases
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
N2 (A5-A7, marquées `pending`) étaient déjà rédigées en français par l'auteur et n'ont pas été
retouchées. Les noms des 4 blocs (Strategy, Stakeholders, Business, Technology) sont volontairement
laissés en anglais : ce sont des étiquettes de la taxonomie source, pas du texte à lire.

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
celui des areas : `organizational unit` est rendu par « l'entreprise » (le modèle source distingue
l'unité organisationnelle de l'organisation entière, distinction sans objet dans une PME où les deux
coïncident), `AI-enabled systems and workflows` par « systèmes et workflows soutenus par l'IA », et
ROI, sandbox et workflow sont conservés.

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
(A5-A7, `pending`) n'en portent pas, faute d'équivalent dans le document source.

---

## 5. Déclaration d'usage de l'intelligence artificielle

Conformément à la charte déontologique GES-FOR3-REF016, l'usage d'outils d'IA générative est déclaré.

Ont été produits avec assistance d'un LLM : le squelette technique du dépôt (configuration Vite,
workflow d'intégration continue, composants de navigation, scripts d'export et d'import), la
génération programmatique de la structure du fichier `modele.json` depuis la matrice de comparaison,
et les synthèses françaises de la grille des trois indicateurs de maturité.

Relèvent du travail de l'auteur : le choix du référentiel de base et sa justification, la matrice de
comparaison des six modèles et son codage, la neuvième dimension et ses trois objectifs, la
répartition des dimensions en socles, la règle d'agrégation et le traitement du biais qu'elle
introduit, l'élicitation du niveau cible, et l'intégralité des énoncés descriptifs.

Cette déclaration est à reprendre et à préciser dans le chapitre méthodologique du rapport.

---

## 6. Sources

Ozkaya, I. et al. (2026). *The AI Adoption Maturity Model v1.0*. Carnegie Mellon University,
Software Engineering Institute. — référentiel de base, huit dimensions et vingt-cinq domaines.

Elia, G. et al. (2024). *Digital Transformation Canvas*. — vocabulaire du parcours et forme de la restitution.

Bettoni, A. et al. (2021). IFAC. — C-28, filtre d'applicabilité PME.

Hansen, et al. (2024). *AI Capability Maturity Model*. — C-30, axe environnemental du TOE.

Kudryavtsev, D. et al. (2025). — corroboration, niveau 2 partiellement publié.

Sawang, S. et Sornlertlamvanich, V. (2026). arXiv. — C-31, critique de la progression linéaire.

Sharma, A. (2026). *The SMB AI Maturity Index*. Working paper SSRN. — précédent de conception et
protocole Delphi. Statut de source limité : auteur unique affilié à un éditeur, validation proposée
non exécutée, usage substantiel de LLM déclaré. Ne fonde aucun construit.

Jeanneret Medina, M. et al. (2024). HEG-Arc. — méthode des énoncés descriptifs.

Peffers, K. et al. (2007). *A Design Science Research Methodology*. JMIS. — cadre méthodologique.

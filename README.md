# Instrument de diagnostic de maturité IA pour PME

Maquette basse fidélité — Travail de Bachelor, HEG-Arc, module 66-62, session SP temps partiel 2025-2026.

**Auteur** Saverio Martini · **Direction** Maria Sokhn · **Assistant technique** Rafael Moreira Dos Santos
**Début** 31.03.2026 · **Restitution** 13.09.2026 · **Défense** octobre 2026

---

## 1. Ce que fait cette maquette, et ce qu'elle ne fait pas

Elle rend navigable de bout en bout le parcours d'auto-évaluation : profil et intention, carte des
socles, axes, domaines de pratique, restitution. Neuf dimensions, vingt-six domaines de pratique
(capability areas), échelle à cinq niveaux.

Elle ne mesure rien. Les 115 énoncés descriptifs restent à rédiger : chaque palier affiche
l'emplacement vide et les deux entrées dont il doit être dérivé. Aucun backend, aucune base de
données, aucune authentification. L'état de session vit dans le `localStorage` du navigateur, donc
aucune donnée ne quitte le poste — c'est un choix d'architecture, à documenter comme tel dans le
rapport, pas une lacune.

La comparaison inter-PME est hors périmètre. L'écran de restitution produit en revanche le contrat
de données qu'une API future recevrait sans transformation.

---

## 2. Démarrage pas à pas dans VS Code

### 2.1 Prérequis, une seule fois

1. **Node.js 20 ou supérieur.** Vérifier dans un terminal : `node -v`. Si la commande échoue ou
   affiche moins de 20, installer depuis nodejs.org (version LTS).
2. **Git.** Vérifier : `git --version`.
3. **Python 3.10 ou supérieur**, uniquement pour les scripts de rédaction : `python3 --version`.
4. **VS Code.** Au premier ouverture du dossier, VS Code proposera d'installer les extensions
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
npm run build
npm run preview
```

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
│   ├── PERIMETRE.md               ce qui est dans le TB et ce qui n'y est pas
│   └── couverture.md              tableau de couverture généré, ne pas éditer à la main
├── redaction/                     surface de saisie Excel, non versionnée
├── scripts/
│   ├── export_enonces.py          modèle JSON  →  classeur de rédaction
│   ├── import_enonces.py          classeur     →  modèle JSON
│   ├── gen_couverture.py          modèle JSON  →  docs/couverture.md
│   └── requirements.txt
├── src/
│   ├── data/modele.json           SOURCE DE VÉRITÉ du modèle
│   ├── scoring.js                 règles d'agrégation et niveau cible
│   ├── store.js                   état de session, persistance locale, sélecteurs
│   ├── router/index.js            les cinq routes
│   ├── assets/main.css            jetons visuels
│   ├── App.vue                    bandeau d'avertissement et gabarit
│   ├── components/
│   │   ├── TuileSocle.vue         une tuile de socle sur la carte du parcours
│   │   ├── EchelleEnonces.vue     les cinq paliers d'un domaine de pratique
│   │   └── FigureRadiale.vue      restitution d'un axe, forme de la figure 5 d'Ozkaya
│   └── views/
│       ├── AccueilView.vue        socle 0 : profil et intention, niveau cible
│       ├── ParcoursView.vue       carte des six socles navigables
│       ├── DimensionView.vue      un axe et ses domaines de pratique
│       ├── CapabilityAreaView.vue un domaine, ses objectifs, ses cinq paliers
│       └── RestitutionView.vue    écran Project : niveaux par axe, export
├── index.html
├── package.json
└── vite.config.js
```

---

## 4. `src/data/modele.json` est la source de vérité

Rien de la structure du modèle n'est codé en dur dans les composants. Le fichier porte :

| Clé | Contenu |
|---|---|
| `_meta` | version, sources, avertissements de relecture |
| `echelle` | les cinq niveaux et leurs propriétés normatives |
| `rubrique_niveau` | la grille des trois indicateurs transversaux × cinq niveaux |
| `agregation` | règle intra-dimension, absence de score global, biais déclaré |
| `niveau_cible` | principe d'élicitation et statut d'extrapolation |
| `socles` | six socles navigables et leurs étiquettes Elia |
| `dimensions` | neuf axes, leurs domaines de pratique, objectifs, rattachements |
| `criteres_consolides` | les 31 critères et leurs degrés par modèle |
| `modeles_sources` | les six modèles et leur statut de source |
| `enonces` | 130 emplacements avec statut de rédaction et entrées de dérivation |

Changer une règle de calcul se fait dans ce fichier, pas dans `scoring.js`. Par exemple, remplacer
`"intra_dimension": "min"` par `"mediane"` change la restitution sans toucher au code.

### Relecture auteur obligatoire

Deux éléments portent un marqueur explicite et bloquent l'usage tant qu'ils ne sont pas certifiés :

- les quinze énoncés de `rubrique_niveau` sont des synthèses françaises rédigées d'après les pages
  82-83 de la source. Chacun porte `"certifie_auteur": false`. Les vérifier un à un contre
  l'original avant de dériver quoi que ce soit ;
- `Planning` niveau 5 est incomplet et porte le marqueur `[À COMPLÉTER DEPUIS LA SOURCE]` ;
- les `goals` de chaque domaine hérité portent `[À LIRE DANS LA SOURCE]`. Le texte d'Ozkaya n'est
  volontairement pas recopié ici : il se lit dans la source au moment de rédiger.

---

## 5. Rédiger les énoncés

Ne jamais saisir directement dans le JSON : une virgule manquante dans un fichier de 130 entrées
coûte une soirée. Le flux est un aller-retour.

```sh
python3 -m pip install -r scripts/requirements.txt
python3 scripts/export_enonces.py      # → redaction/enonces_a_rediger.xlsx
# rédiger la colonne texte_fr dans Excel
python3 scripts/import_enonces.py      # → met à jour src/data/modele.json
git diff src/data/modele.json          # relire avant de valider
git commit -am "Enonces du domaine O-11 rediges"
```

Le classeur affiche, pour chaque énoncé, les trois énoncés génériques d'Accountability, Planning et
Resourcing au niveau concerné. Un énoncé se dérive en croisant ces trois lignes avec les objectifs
du domaine, lus dans la source.

Un commit par domaine de pratique rédigé donne gratuitement la traçabilité datée qu'exige le
journal de recherche.

### Trois contraintes de rédaction, non négociables

**Monotonie stricte.** Chaque niveau contient et dépasse le précédent. Pas de chevauchement, pas de saut.
**Un seul objet par énoncé.** Un énoncé qui affirme trois choses à la fois ne permet plus au répondant de
se reconnaître : il choisit au hasard. Éviter les items multi-barillets.
**Le niveau 1 décrit une réalité légitime**, jamais une carence. Une PME peut délibérément y rester.

---

## 6. Générer le tableau de couverture du rapport

```sh
python3 scripts/gen_couverture.py > docs/couverture.md
```

Le tableau est dérivé du modèle, donc il ne peut pas se désynchroniser de la matrice de comparaison.
Le script signale en fin de sortie les domaines qui n'ont aucune corroboration de degré 2, ce qui
identifie mécaniquement les zones faibles du référentiel.

---

## 7. Décisions de conception à défendre

Ces choix ne découlent pas du référentiel. Ils sont de l'auteur et devront être argumentés.

**Neuvième dimension ajoutée.** Motivations et justification de l'adoption est absente d'Ozkaya. Un
domaine de pratique, trois objectifs, issus de C-28 (Bettoni), C-30 (Hansen) et C-31 (Sawang), avec
Sharma en corroboration sur deux des trois. Elle hérite de la grille de niveau des trois
indicateurs transversaux, ce qui lui donne la même sémantique que les huit dimensions héritées.

**Un socle contient des dimensions entières.** Le pilier Partner d'Elia ne peut donc plus être un
socle, puisque ses domaines appartiennent à deux dimensions distinctes. Il redevient une étiquette.
Elia fournit le vocabulaire du parcours et la forme de la restitution, pas la décomposition du construit.

**Agrégation au minimum à l'intérieur d'un axe, aucun score global.** Le référentiel ne restitue
jamais un nombre unique, et il affirme explicitement que les niveaux ne sont pas une échelle de
conformité. Un minimum entre axes transformerait un choix stratégique assumé en verdict d'échec.

**Biais assumé et affiché.** Sous la règle du minimum, un axe composé de quatre domaines est
mécaniquement plus difficile à faire monter qu'un axe composé d'un seul. Le nombre de domaines est
donc affiché en face de chaque axe. Cela rend la déformation lisible ; cela ne la corrige pas.

**Niveau cible.** Le référentiel prescrit à l'organisation de déterminer son niveau visé mais ne
fournit aucun instrument d'élicitation. La traduction des trois réponses d'intention en niveau
cible est une extrapolation de l'auteur, de statut X.

**Deployment at Scale (O-25) est mesuré.** Conséquence mécanique de l'intégrité des dimensions,
alors que la fiche de travail v1.1 le classait en placeholder. À assumer ou à trancher.

---

## 8. Déclaration d'usage de l'intelligence artificielle

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

## 9. Sources

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

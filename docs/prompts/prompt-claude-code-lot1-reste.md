# Prompt Claude Code — lot 1, tâches restantes (1.8 à 1.13)

À copier tel quel dans Claude Code, à la racine de `tb-maturite-ia`. Les 140 énoncés sont écrits ;
ces tâches portent sur le reste du contenu.

---

Contexte : dépôt `tb-maturite-ia`, outil de diagnostic de maturité d'adoption de l'IA pour des PME de
l'arc jurassien, travail de Bachelor. Lis d'abord `docs/DECISIONS.md`, `docs/PERIMETRE.md`,
`docs/NIVEAU-CIBLE.md`, `src/data/transformation.js`, `src/data/context-attributes.js` et
`src/data/model-data.json`.

Six tâches indépendantes. Traite-les **une par une, dans l'ordre**, et montre-moi le diff après
chacune. N'enchaîne pas.

## Interdiction absolue : ne rien inventer de bibliographique

La tâche 1.8 comporte un tableau de rapprochement entre échelles de maturité publiées. **Tu ne dois
écrire aucun nom d'étage d'un modèle tiers que tu n'as pas sous les yeux dans le dépôt.** Pas de
« Awareness / Active / Operational », pas d'étages de Gartner, d'Altimeter ou d'Element AI reconstitués
de mémoire. Un tableau de correspondances fabriqué dans un travail de Bachelor est une faute grave et
invisible à la relecture. Tu produis les colonnes que le dépôt permet de fonder, et tu laisses les
autres vides avec une marque explicite. Je les remplirai après vérification des sources primaires.

---

## 1.13 — Refonte de l'attribut de posture d'adoption

Dans `src/data/context-attributes.js`, l'attribut inspiré des catégories de diffusion de Rogers pose
un problème relevé par l'experte métier : personne ne se déclare « retardataire », et la distinction
entre majorité précoce et majorité tardive n'est pas lisible pour un dirigeant.

Reformule les options sur **ce qui est réellement demandé** : l'organisation préfère-t-elle attendre
que d'autres aient éprouvé la technologie, ou avancer avant eux ? Trois ou quatre options, formulées
comme des postures assumables — aucune ne doit être humiliante à cocher, c'est la condition pour que
la réponse soit sincère. Conserve les scores normalisés et l'axe existants ; ne change que les
libellés, le `hint` et, si nécessaire, le nombre d'options. Si tu changes le nombre d'options,
vérifie tout ce qui référence les valeurs de cet attribut — `LEVEL_CAPS`, `LEVEL_BOOSTS`,
`src/domain/scope.js`, `src/domain/recommendation.js`, les sessions de démonstration.

Garde la trace de l'origine dans le commentaire : la référence aux catégories de Rogers reste
mentionnée comme inspiration, même si les libellés s'en éloignent.

## 1.12 — Passe terminologique

Toujours d'après les retours de l'experte. Cherche chaque terme dans tout `src/` avant de remplacer —
il apparaît souvent dans plusieurs fichiers et dans les libellés d'interface :

- « établissement » et « unité évaluée » → « organisation » ;
- « empreinte organisationnelle » → « territoire » ;
- « littératie » → « connaissances » (y compris dans les identifiants de commentaire, mais **pas**
  dans les identifiants de code : `literacy` reste `literacy`, un renommage de clé casserait les
  sessions enregistrées) ;
- « cas d'affaires » : retraduire, la tournure n'est pas claire en français de Suisse romande ;
- « hybride », « coordination légère », « discuté qualitativement » : ajouter à chacun un critère
  d'acceptation dans le champ prévu à cet effet — le fichier documente déjà cette convention en
  en-tête — plutôt que de rallonger le libellé ;
- l'option de disponibilité des données formulée par « partiellement prêtes » : reformuler sur le
  modèle « solution prête à l'emploi » quand il s'agit d'un produit acquis tel quel.

**Retrait de l'attribut de posture réglementaire** (`regulatory`). Motif : la cible — une PME de l'arc
jurassien — relève de toute façon de la nLPD, et souvent du règlement européen sur l'IA par ses
clients ; l'option « non régulé » est trompeuse, puisqu'il existe toujours des obligations légales
générales. Retire l'attribut et **toutes** ses références : plafonds, bonus, `scope.js`,
`recommendation.js`, sessions de démonstration, et les tests s'il en existe. `npm run build` doit
passer après le retrait.

## 1.11 — Question de portée posée en phase d'ancrage

`src/data/transformation.js` porte cinq degrés, un par profil, chacun avec un champ `reach`. Une
décision récente déplace la question qui fixe le niveau cible : elle n'est plus posée au cadrage mais
en fin de parcours, dans la phase d'ancrage, après l'évaluation.

Écris le contenu de cette question — l'écran viendra plus tard, tu ne produis ici que la donnée :

- elle porte sur **la portée visée**, jamais sur le degré ni sur le palier. Si l'utilisateur choisit
  un palier, l'outil lui renvoie la cible qu'il vient de nommer, et la restitution devient circulaire ;
- les options s'appuient sur les `reach` existants : une fonction isolée, les processus internes, la
  façon même dont le travail est organisé, et ainsi de suite. Formule-les comme des situations
  souhaitées, compréhensibles sans connaître le modèle ;
- **aucune mention de Venkatraman dans le texte affiché.** L'experte a demandé « qui est
  Venkatraman ? » sur un écran de restitution : le nom ne figure que dans l'écran d'information, dans
  l'attribution et dans le rapport. Les commentaires du fichier, eux, gardent la référence ;
- retire l'option « transverse » partout où elle apparaît dans les libellés de portée ou de périmètre :
  c'est un calque de *program*, et une équipe suffit à décrire ce cas ;
- « posture » → « environnement » dans les libellés affichés.

Ajoute une phrase de question elle-même (l'intitulé posé à l'utilisateur) et un `hint`, dans le style
des autres libellés du dépôt.

## 1.8 — Contenu de l'écran d'information

Crée `src/data/info.js` et branche-le sur `src/components/screens/ScreenInfo.vue`, en gardant les
sections existantes de cet écran et en ajoutant les nouvelles. Trois contenus :

**a. Adoption, maturité, readiness.** Trois définitions courtes et la question que chacune pose :
la readiness demande si le socle permet de démarrer ; la maturité d'adoption demande si le résultat
se reproduit d'un cas d'usage au suivant ; l'adoption désigne le fait d'employer l'IA, sans rien dire
de la solidité de cet emploi. Dis explicitement que l'outil mesure la maturité d'adoption et non la
readiness, et qu'une porte « readiness » relève d'une itération ultérieure.

**b. Comment les niveaux sont construits.** Expose la grille des trois indicateurs transversaux du
§5 de la source, reprise **littéralement** depuis `src/data/maturity-indicators.js` — cinq niveaux ×
trois indicateurs — plus la colonne de synthèse :

```
1  absence — rien d'assigné, rien de planifié, rien d'alloué régulièrement
2  existence désignée — des rôles, un plan, un budget pour ce domaine
3  boucle de mesure — ce qui est mesuré change la conduite
4  reproductibilité au-delà du premier cas — hors de l'équipe qui a lancé
5  anticipation — les choix servent une stratégie et des scénarios à venir
```

Explique que chaque énoncé du questionnaire instancie, pour son domaine, la ligne de son niveau : la
sémantique de niveau ne dépend pas du domaine, et c'est cette uniformité qui rend comparables les
niveaux entre domaines.

**c. Tableau d'équivalences des échelles.** Une ligne par palier, avec ces colonnes :

| Palier | Nom retenu dans l'outil | Ozkaya et al. (2026) | Venkatraman (1994) | Gartner | Altimeter | Element AI |

- « Nom retenu » vient de `model-data.json` ; « Ozkaya » est le nom anglais du même niveau ;
  « Venkatraman » vient de `transformation.js`. Ces trois colonnes, tu les remplis depuis le dépôt.
- **Gartner, Altimeter, Element AI : laisse les cellules vides**, avec un marqueur visible du type
  `À VÉRIFIER` et un commentaire dans `info.js` expliquant qu'elles attendent une vérification contre
  les sources primaires. N'invente rien.
- Sous le tableau, deux phrases obligatoires : que le rapprochement est **indicatif** et non une
  correspondance validée, et qu'une case peut légitimement rester sans équivalent direct lorsque
  l'échelle comparée n'a pas cinq étages ; et que **la fusion des noms d'Ozkaya et de Venkatraman
  dans les noms français des paliers est une lecture propre à ce travail** — la source ne cite pas
  Venkatraman.

C'est le seul écran, avec l'attribution, où Venkatraman est nommé.

## 1.10 — Appariement des noms anglais

Dans les cinq blocs `detail` des niveaux de `src/data/model-data.json`, les noms anglais du modèle
apparaissent sans lien avec les noms français retenus : le lecteur rencontre « Implemented » sans
savoir qu'il s'agit d'« Intégration opérationnelle ». À la **première occurrence** de chaque nom
anglais dans un bloc, écris la forme appariée : `Alignement des processus (Aligned AI)`.

Ce fichier est le report littéral de la source et ne se modifie pas à la légère — mais ici tu ne fais
qu'y restituer le vocabulaire de la source elle-même, ce qui renforce la traçabilité au lieu de
l'affaiblir. Ne touche à rien d'autre : pas de reformulation, pas de correction de style, pas de
changement de ponctuation.

## 1.9 — Attribution

Crée le texte d'attribution, employé au pied de page de tous les écrans et dans l'export. Il doit
nommer : Ozkaya et al. (2026), avec la licence CC BY-NC-ND ; Venkatraman (1994) ; Elia et al. (2024)
pour le regroupement en blocs ; Bettoni et al. (2021) pour le domaine qui en provient. Et dire que
l'outil n'est pas officiel et n'a de lien ni avec le SEI ni avec Accenture.

Place-le dans un fichier de données dédié plutôt qu'en dur dans un composant. Le câblage aux
composants relève d'une tâche ultérieure : ici, produis la donnée et branche-la au pied de page si
c'est trivial, sinon laisse-la prête à l'emploi.

## Critères d'acceptation, pour l'ensemble

- `npm run lint` et `npm run check:model:strict` sortent en 0. `npm run build` passe.
- Aucun nom d'étage de Gartner, Altimeter ou Element AI n'apparaît nulle part.
- Le mot « Venkatraman » n'apparaît, dans du **texte affiché**, que dans l'écran d'information et
  l'attribution — vérifie-le par une recherche sur `src/`, commentaires exclus.
- Plus aucune référence à l'attribut de posture réglementaire dans `src/`.
- `src/data/statements.js` n'est pas modifié.
- `git diff --stat` montré après chaque tâche, séparément.

## Conventions du dépôt

Français, registre France Num, vocabulaire de l'interface et non du code. Style des fichiers de
`src/data/` : commentaires denses qui expliquent la provenance et le pourquoi. Respecte
`docs/VUE_STYLE_GUIDE.md` pour tout composant touché. Aucune dépendance nouvelle. Pas de commit sans
que je l'aie demandé.

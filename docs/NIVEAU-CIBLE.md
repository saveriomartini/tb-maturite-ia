# Suggestion du niveau cible

Comment l'écran de cadrage 3 déduit un niveau cible recommandé (1 à 5) des attributs de contexte.

Source des données : [`src/data/context-attributes.js`](../src/data/context-attributes.js).
Calcul : `buildRecommendation()` dans [`src/domain/recommendation.js`](../src/domain/recommendation.js).

La recommandation est **indicative** : l'utilisateur reste libre de retenir un autre niveau cible.
Tant que les 13 attributs ne sont pas tous renseignés, l'encart porte la mention
« recommandation indicative ».

## 1. Deux axes, pas un score

Chaque attribut de contexte porte un `axis` :

| axis | sens | attributs |
|---|---|---|
| `ambition` | ce que l'organisation **veut** atteindre | horizon, risque, déploiement, ROI, ambition d'adoption |
| `capacity` | ce qu'elle est **en mesure de soutenir** | digitalisation, données, littératie, ressources, pilotage |
| `null` | cadrage : ne score pas, mais peut plafonner | périmètre, réglementation, approche de développement IA |

Séparer les deux axes est le cœur de la logique : une organisation peut viser haut sans avoir les
moyens de suivre, et le modèle refuse de recommander un niveau que la capacité ne porte pas.

Cas particulier de l'approche de développement IA (`devApproach`) : elle est collectée et n'entre
volontairement dans aucun calcul. Elle est destinée à un futur scoping par pratiques, non au niveau
cible.

Même statut pour le **degré de transformation visé** (`state.transformation`), posé en tête du
cadrage sous la forme d'une question à cinq réponses — les cinq profils du modèle. Il ne s'agit pas
d'un attribut de contexte : il exprime une intention, là où les attributs décrivent une situation.
Il est mémorisé avec la session mais n'entre encore dans aucun calcul ; la façon dont il corrigera
l'ordre du questionnaire se décide dans un second temps.

## 2. Score par attribut

Chaque option porte un score normalisé `0..1` (troisième valeur du tuple `opts`).
Une seule correction est appliquée à ce stade :

> **Plafond réglementaire** — si la posture réglementaire vaut « fortement régulé », le score de
> l'appétit au risque est borné à `0.5` (`REGULATED_RISK_CEILING`). Un cadre réglementaire fort
> borne le risque effectivement assumable, quelle que soit la réponse donnée.

## 3. Niveau par axe

Le niveau d'un axe est la moyenne des scores de ses attributs, projetée linéairement sur 1..5 :

```text
niveau_axe = 1 + moyenne(scores) × 4
```

Un attribut **non renseigné** compte pour `UNANSWERED_SCORE = 1`, c'est-à-dire le score maximal.
Ne rien décrire ne restreint rien. Trois conséquences voulues :

- un formulaire vide donne `1 + 1 × 4 = 5.0` sur les deux axes, soit le Level 5 : le diagnostic
  porte alors sur **toutes** les areas évaluables du modèle — une évaluation complète ;
- chaque réponse ne peut que **réduire** le périmètre. La lecture est « on vous propose tout, vos
  réponses retirent ce qui ne vous concerne pas », et non l'inverse ;
- la recommandation reste **progressive** : chaque réponse déplace la moyenne au lieu de faire
  basculer le résultat d'un coup.

Ce niveau reste un réel (non arrondi) jusqu'à l'étape suivante.

## 4. Croisement des deux axes

```text
brut  = min(ambition, capacité + 1)
niveau = arrondi(brut), borné à [1, 5]
```

La règle « capacité + 1 » signifie : **on ne recommande jamais plus d'un cran au-dessus de la
capacité actuelle**. Un niveau cible situé juste au-dessus de la capacité constatée est atteignable ;
deux crans au-dessus ne l'est pas.

Lorsque `capacité + 1 < ambition`, l'encart signale l'ajustement (« l'ambition dépasse la capacité
actuelle de plus d'un niveau »).

## 5. Plafonds durs

Certains facteurs sont **bloquants** : ils ne se compensent pas par une moyenne. Ils sont déclarés
dans `LEVEL_CAPS` et s'appliquent **après** l'arrondi.

| Attribut | Valeur déclenchante | Plafond |
|---|---|---|
| Ressources affectées à l'IA | aucun rôle IA | 2 |
| Littératie du conseil et de la direction | faible | 2 |
| Préparation des données | non préparées | 2 |
| Niveau de digitalisation | faible | 2 |
| Périmètre de l'évaluation | une équipe | 3 |
| Pilotage de l'adoption | délégué aux équipes métiers | 3 |
| Horizon de planification | moins de 6 mois, ou 6 à 12 mois | 3 |
| Approche de déploiement | projet par projet | 3 |

Si plusieurs plafonds s'appliquent, **le plus bas gagne**. Le plafond n'est retenu que s'il abaisse
effectivement le niveau ; il ne remonte jamais un niveau bas. Les plafonds à l'origine de la valeur
retenue sont affichés à l'utilisateur avec leur motif.

Noter que le périmètre et la réglementation n'ont pas d'`axis` mais agissent ici : ils ne
contribuent pas à une moyenne, ils bornent.

### Critères d'acceptation

Un plafond dur décide du niveau cible à lui seul : il ne se compense pas. La réponse ne peut donc
pas reposer sur une appréciation — « nos données sont-elles prêtes ? » n'est pas une question
qu'un comité de direction, même accompagné du responsable informatique, peut trancher de façon
reproductible.

Les options des attributs concernés portent pour cette raison un **critère d'acceptation** :
quatrième valeur du tuple `opts` dans `context-attributes.js`, énoncé comme un fait vérifiable
(existe-t-il un responsable désigné ? un flux documenté ? une instance mandatée ?) plutôt que
comme un niveau à estimer.

À l'écran de cadrage 3, un attribut au repos ne montre que son libellé et ses options. L'aide et
les critères sont dépliés par le « + » qui suit le libellé, un attribut à la fois : c'est ce qui
permet de rédiger des critères longs sans encombrer un formulaire de treize attributs.

Sont rédigés à ce jour les quatre attributs dont le libellé seul restait interprétable :
préparation des données, niveau de digitalisation, littératie du conseil et de la direction,
pilotage de l'adoption. Les autres attributs à plafond — ressources affectées à l'IA, périmètre,
horizon, approche de déploiement — ont des libellés qui se suffisent, et n'en portent pas.

## 6. Condition d'accès au Level 5

Le Level 5 suppose que **toutes** les conditions structurelles de `LEVEL5_REQUIREMENTS` sont
réunies :

- périmètre à l'échelle de l'entreprise ;
- horizon supérieur à 3 ans ;
- équipe IA interne dédiée ;
- instance de pilotage transverse ;
- littératie IA avancée du conseil et de la direction.

Une condition n'est comptée comme manquante que si elle est **contredite** par une réponse : un
attribut laissé vide ne bloque pas l'accès au Level 5, conformément à la règle permissive du § 3.
S'il en manque une, le niveau recommandé est ramené à 4 et les conditions manquantes sont listées.

## 7. Facteurs affichés

L'encart justifie la recommandation par au plus deux attributs par axe, choisis parmi ceux
effectivement renseignés :

- **moteurs** (`drivers`) — attributs d'ambition de score `≥ 0.6`, les deux plus élevés ;
- **freins** (`limits`) — attributs de capacité de score `≤ 0.4`, les deux plus bas.

Les niveaux d'ambition et de capacité affichés sont les niveaux d'axe arrondis et bornés à [1, 5],
alors que le croisement du § 4 travaille sur les valeurs non arrondies. Un écart d'affichage d'un
cran est donc possible et attendu.

## 8. Ordre d'application, en une ligne

```text
scores  →  plafond réglementaire du risque
        →  moyenne par axe (non renseigné = 1)
        →  min(ambition, capacité + 1)
        →  arrondi, borné [1, 5]
        →  plafonds durs (le plus bas gagne)
        →  vérification des conditions du Level 5
        →  niveau recommandé
```

## Exemples

**A — PME sans facteur bloquant.** Digitalisation moyenne (0,5), données partiellement prêtes (0,5),
littératie intermédiaire (0,5), rôles internes partagés (0,67), coordination légère (0,5) →
capacité `1 + 0,534 × 4 = 3,14`. Horizon 1 à 3 ans (0,67), risque modéré (0,5), déploiement par
vagues (0,5), ROI qualitatif (0,5), adopteur précoce (0,75) → ambition `1 + 0,584 × 4 = 3,34`.
Croisement : `min(3,34 ; 4,14) = 3,34` → arrondi à 3. Aucun plafond dur ne se déclenche :
**Level 3 recommandé**.

**B — le même cas, sans ressource IA.** Seule la réponse « aucun rôle IA » change. La capacité tombe
à `1 + 0,4 × 4 = 2,6`, mais le croisement reste dicté par l'ambition : `min(3,34 ; 3,6) = 3,34` →
arrondi à 3. C'est le plafond dur qui tranche : sans ressource affectée à l'IA, le niveau est borné
à 2. **Level 2 recommandé**, avec le motif affiché. L'exemple montre pourquoi les plafonds existent :
la moyenne à elle seule absorbait le facteur bloquant.

# Suggestion du niveau cible

Comment l'écran de cadrage 3 déduit un niveau cible recommandé (1 à 5) des attributs de contexte.

Source des données : [`src/data/context-attributes.js`](../src/data/context-attributes.js).
Calcul : `buildRecommendation()` dans [`src/composables/useMaturityTool.js`](../src/composables/useMaturityTool.js).

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

Un attribut **non renseigné** compte pour `NEUTRAL_SCORE = 0.25`, et non zéro. Deux conséquences
voulues :

- un formulaire vide donne `1 + 0.25 × 4 = 2.0` sur les deux axes, soit le Level 2 — le niveau
  d'entrée du modèle, et non le Level 1 ;
- la recommandation est **progressive** : chaque réponse déplace la moyenne au lieu de faire
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

## 6. Condition d'accès au Level 5

Le Level 5 suppose que **toutes** les conditions structurelles de `LEVEL5_REQUIREMENTS` sont
réunies :

- périmètre à l'échelle de l'entreprise ;
- horizon supérieur à 3 ans ;
- équipe IA interne dédiée ;
- instance de pilotage transverse ;
- littératie IA avancée du conseil et de la direction.

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
        →  moyenne par axe (non renseigné = 0.25)
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

# Contrôle linguistique des 140 énoncés

Lot B du prompt de restructuration v2.0 (31.08.2026). Référence retenue : `docs/ENONCES.md` —
c'est le seul document du dépôt qui fixe le registre et les contraintes de forme des énoncés
(§4 : registre France Num, présent actif, ≤25 mots, situation observable, test de fausseté §3). Le
Lot C (`docs/audits/enonces-tracabilite.md`) a déjà vérifié le fond ; ce rapport porte uniquement
sur la langue.

## Méthode

Cinq critères, ceux du prompt de restructuration, tous instruits sur les 140 énoncés :

1. registre commercial, compréhensible par un dirigeant de PME industrielle sans culture IA ;
2. absence de jargon académique ou d'anglicisme non nécessaire ;
3. longueur ≤25 mots (`docs/ENONCES.md` §4), homogène à l'intérieur d'un domaine ;
4. formulation observable — le test de fausseté du §3 : peut-on reconnaître la situation sans être
   au niveau visé ? Aucune intention ni capacité (« souhaite », « pourrait », « est en mesure de ») ;
5. variété des amorces — défaut connu, 110 énoncés sur 140 commencent par « Nous ».

## Verdict global

**Critères 1 à 4 : conformes sur les 140 énoncés, aucune exception trouvée.** Aucun anglicisme non
nécessaire (le mot « hallucination », pourtant présent dans les goals d'A20 sous sa forme anglaise
dans la source, est traduit par « réponse fausse » dans l'énoncé — signe que la règle a été
appliquée et pas seulement énoncée). Aucun jargon de référentiel. Aucune formulation à l'intention
ou à la capacité (« souhaite », « pourrait », « est en mesure de ») rencontrée. Longueur : les
énoncés les plus longs relevés à la lecture (A15 r4, A6 r4, A7 r4, A20 r5, environ 22 à 23 mots)
restent sous le plafond ; aucun rang d'un domaine ne détonne par sa longueur à côté de ses quatre
voisins. Ce constat n'engage pas un comptage mot à mot des 140 énoncés — il s'appuie sur une lecture
domaine par domaine et sur la vérification ciblée des énoncés visuellement les plus longs.

**Critère 5 : confirmé, exactement 110/140.** Comptage refait indépendamment du chiffre déjà cité
par `docs/logs/BACKLOG.md` (item 1.7b) — il tombe juste. Le détail par domaine et les 30 amorces
alternatives sont ci-dessous.

Aucun énoncé n'est verdicté « à revoir sur le fond » dans ce rapport — le fond relève du Lot C, pas
de celui-ci.

## Comptage des amorces

| Amorce | Occurrences |
|---|---|
| Nous | 110 |
| Nos (possessif) | 6 |
| Un / Une | 4 |
| Quand | 3 |
| Chaque | 2 |
| Avant | 2 |
| Toute / Tout | 2 |
| La | 2 |
| Cette / Ces | 2 |
| Personne, Les, À, Après, Pour, L'accompagnement, Ce | 1 chacun |

**7 domaines sur 28 ont leurs cinq énoncés qui commencent tous par « Nous »** : A5, A12, A16, A18,
A22, A23, A27. Ce ne sont pas des énoncés mal écrits pris un par un — `docs/ENONCES.md` note même
que le parallélisme est un atout *à l'intérieur* d'un domaine, cinq phrases comparables d'un coup
d'œil. Le défaut est un effet d'agrégat, visible seulement en lecture continue (l'export, ou les 140
énoncés mis bout à bout) : proposer un verdict « à retoucher » sur chacun des 110 énoncés
individuellement aurait été trompeur, puisque rien n'est fautif dans la phrase elle-même. Le
correctif proposé porte donc sur la sélection de domaines, pas sur l'énoncé isolé — voir
`docs/audits/enonces-langue-propositions.md`.

## Détail par domaine

Amorce de chacun des cinq rangs, verdict, remarque si nécessaire. Verdict « conforme » = les cinq
critères tiennent, y compris la variété d'amorce prise isolément (aucun énoncé n'est fautif en soi).

| Domaine | R1 | R2 | R3 | R4 | R5 | Verdict | Remarque |
|---|---|---|---|---|---|---|---|
| A1 | Nous | Un | Nous | Nous | Nous | Conforme | — |
| A2 | Nous | Nous | À | Nous | Nous | Conforme | — |
| A3 | Nous | Nous | Nous | Quand | Nous | Conforme | — |
| A4 | Nous | Nous | Chaque | Nous | Nous | Conforme | — |
| A5 | Nous | Nous | Nous | Nous | Nous | Conforme | 5/5 Nous — candidat prioritaire à variation (voir propositions) |
| A6 | Les | Une | Nous | Nous | Nous | Conforme | — |
| A7 | Nous | Avant | Après | Nous | Nous | Conforme | — |
| A8 | Nos | Nous | Nous | Quand | Nous | Conforme | — |
| A9 | Nous | Nous | Nous | L'accompagnement | Nous | Conforme | — |
| A10 | Nous | Nous | Nous | Tout | Nous | Conforme | — |
| A11 | Personne | Nous | Cette | Nos | Nous | Conforme | Domaine le mieux réparti (2/5 Nous) |
| A12 | Nous | Nous | Nous | Nous | Nous | Conforme | 5/5 Nous — candidat prioritaire |
| A13 | Quand | Nous | Nous | Nous | Nous | Conforme | — |
| A14 | Nous | Nous | Nous | La | Nous | Conforme | — |
| A15 | Nous | Pour | Nous | La | Nous | Conforme | — |
| A16 | Nous | Nous | Nous | Nous | Nous | Conforme | 5/5 Nous — candidat prioritaire |
| A17 | Nos | Nous | Nous | Nous | Nous | Conforme | — |
| A18 | Nous | Nous | Nous | Nous | Nous | Conforme | 5/5 Nous — candidat prioritaire |
| A19 | Chaque | Nous | Nous | Toute | Nous | Conforme | — |
| A20 | Nous | Avant | Nous | Nous | Nous | Conforme | — |
| A21 | Nos | Nous | Nous | Un | Nous | Conforme | — |
| A22 | Nous | Nous | Nous | Nous | Nous | Conforme | 5/5 Nous — candidat prioritaire |
| A23 | Nous | Nous | Nous | Nous | Nous | Conforme | 5/5 Nous — candidat prioritaire |
| A24 | Nous | Nous | Nous | Ces | Nous | Conforme | — |
| A25 | Une | Nous | Ce | Nous | Nous | Conforme | — |
| A26 | Nous | Nous | Nous | Nos | Nous | Conforme | — |
| A27 | Nous | Nous | Nous | Nous | Nous | Conforme | 5/5 Nous — candidat prioritaire |
| A28 | Nos | Nous | Nous | Nous | Nous | Conforme | — |

## Ce que ce rapport ne couvre pas

Le recouvrement lexical entre domaines voisins (A2/A27, A16/A25, A19/A26/A28) est un constat du
Lot C, pas de celui-ci — il touche le fond (le lecteur confond deux domaines), pas la langue prise
isolément. Voir `docs/audits/enonces-tracabilite.md`.

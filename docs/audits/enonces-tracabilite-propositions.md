# Propositions de correction — traçabilité indicateurs × goals

Hypothèses à arbitrer, pour les items « priorité haute/moyenne » de
`docs/audits/enonces-tracabilite.md`. **Non appliquées à `src/data/statements.js`.** Chaque
proposition précise le rang de la grille de dérivation visé (préservé dans les quatre cas) et si
elle est purement formelle ou si elle déplace le sens de l'énoncé.

## A6 — Pressions et motivations externes, rang 2

> **Avant :** « Une personne de la direction recense ce qui nous pousse vers l'IA, clients, appels
> d'offres ou réglementation, et en rend compte en séance. »
>
> **Après :** « Une personne de la direction recense ce qui nous pousse vers l'IA — poids de nos
> donneurs d'ordre, appels d'offres, réglementation — et en rend compte en séance. »

Rang 2 préservé (existence désignée : un rôle qui recense et rend compte). **Déplace le sens** :
remplace « clients » par « poids de nos donneurs d'ordre », plus proche du goal 1 et du point que
`docs/PERIMETRE.md` désigne comme l'ancrage régional du modèle. Minoritaire, justifié par le constat
transversal du rapport de traçabilité.

## A7 — Right-sizing, rang 1

> **Avant :** « Nous retenons les outils d'IA qu'on nous propose, sans avoir mesuré ce que leur
> exploitation demanderait chez nous. »
>
> **Après :** « Nous retenons les outils d'IA qu'on nous propose, sans avoir examiné si une solution
> plus simple, sans IA, suffirait. »

Rang 1 préservé (absence : acceptation sans examen préalable). **Déplace le sens**, plus nettement
que les trois autres propositions : le manque décrit change, de « l'exploitation non mesurée » vers
« l'alternative sans IA non examinée ». Justification : le premier manque reste de toute façon
couvert par les rangs 2 à 4 du même domaine (compétences, charge, réversibilité) ; le second n'est
couvert nulle part ailleurs dans A7, alors qu'il est le critère que `docs/PERIMETRE.md` cite comme
« la condition d'applicabilité [du modèle à une PME], pas un complément ». C'est la proposition la
plus significative du lot — à trancher en priorité.

## A5 — Gestion du budget, rang 3

> **Avant :** « Nous n'engageons un nouveau palier de dépense qu'au vu de ce que le précédent a
> rapporté, et nous consignons cette décision. »
>
> **Après :** « Nous engageons ou arrêtons chaque palier de dépense au vu du précédent, et nous
> consignons la décision dans les deux cas. »

Rang 3 préservé (boucle de mesure : décision consignée au vu du précédent). **Déplace le sens** :
nomme l'arrêt comme issue aussi légitime que la poursuite, conformément au goal 3 du domaine et à
`docs/DECISIONS.md` (18.08.2026), qui en fait « une pratique évaluable ». Sans cette précision,
l'arrêt reste seulement suggéré au rang 5 (« garder de quoi absorber un arrêt »), jamais consigné
comme décision à part entière.

## A10 — Gestion des risques, rang 4

> **Avant :** « Tout nouvel usage de l'IA passe par la même analyse de risques, du premier cas
> d'usage au dernier en date. »
>
> **Après :** « Tout nouvel usage de l'IA passe par la même analyse de risques, menée par quelqu'un
> d'extérieur au projet, du premier cas au dernier. »

Rang 4 préservé (reproductibilité : « du premier cas au dernier »). **Déplace le sens** : ajoute
l'exigence d'indépendance du contrôle, qui distingue le goal 3 (contrôles testés indépendamment) du
goal 2 (processus de gestion établi, auto-évalué au rang 3). Sans elle, rien dans A10 ne rend visible
ce que « indépendamment » ajoute à une simple boucle de correction.

---

## Items « priorité basse » — aucune proposition produite

Un goal en retrait sur un domaine qui en porte 2 ou 3 n'est pas nécessairement un défaut : la
correction forcerait à empiler plus d'une idée par phrase, ce que `docs/ENONCES.md` §3 déconseille
explicitement. Consignés pour information, à votre appréciation :

| Domaine | Goal en retrait | Motif de l'absence de proposition |
|---|---|---|
| A4 | Rayonnement et collaboration externe | Pratique annexe de la source, les deux autres goals portent le domaine |
| A9 | Recrutement en phase avec la culture IA · pilotage individuel par objectifs | Toucherait plus d'un rang à la fois, pas une correction ponctuelle |
| A12 | Identification systématique des populations affectées | Effleuré au rang 3 (« client ou collaborateur »), pas absent en esprit |
| A14 | Évaluation technique du workflow (données, risques) | Le domaine mesure déjà le gain et le coût ; ajouter la dimension technique alourdirait la phrase |
| A18 | Évaluation des biais | Sous-aspect du goal 1 déjà couvert pour le reste |
| A19 | Risques de sécurité intégrés à l'architecture | Couvert par A24 — partage à confirmer volontaire, pas à corriger dans A19 seul |
| A23 | Communication des changements aux parties prenantes | Sous-aspect du goal 2, le cœur (traçabilité, vérification) est couvert |
| A25 | Données de conformité/audit/ROI | Écart structurel (le domaine entier est tourné vers l'opérationnel) — à arbitrer plutôt qu'à corriger par un mot |
| A27 | Dépendances aux données externes (distinctes des fournisseurs) | Même remarque qu'A25 |
| A28 | Objectifs de performance/fiabilité (SLA/SLO) | Le domaine entier est tourné vers le coût de l'extension — à arbitrer plutôt qu'à corriger par un mot |

Pour A9, A25, A27, A28 : si vous jugez le trou significatif, la correction utile n'est probablement
pas un mot ajouté à un rang existant mais une relecture du domaine entier — à faire lors d'une
éventuelle passe de fond, pas dans ce lot.

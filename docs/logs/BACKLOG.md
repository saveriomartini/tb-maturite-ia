# Backlog d'intégration — merge des fichiers de cadrage

Version 2 — 26.08.2026, après réponse de la direction de travail.
Échéance : restitution le **13.09.2026**. Base : `main` @ `c1820d4`.
**Statuts relevés contre le dépôt le 10.09.2026** (`main` @ `2f06872`, plus les modifications du jour
non encore validées) : chaque case a été vérifiée dans le code, dans les tests ou dans
`DECISIONS.md`, et non déduite de l'intention. Là où le livré diffère de ce que la ligne annonçait,
c'est la ligne qui est corrigée — jamais l'inverse, et sans recopier ici ce que le code dit déjà.
Sources du merge : `outil-maturite-adoption-ia.html` (SEI preliminary, déc. 2025) et
`maturite-adoption-ia-cadrage.xlsx`.

## Décisions arrêtées

| # | Point | Retenu | Conséquence |
|---|---|---|---|
| 1 | Structure du modèle | current | AIMM v1.0, 28 domaines, 9 dimensions. **Confirmé par la direction de travail.** Preliminary comparé et écarté |
| 2 | Unité de réponse | **incoming** | **Énoncés seuls** : un énoncé parmi cinq par domaine, sans critères ni pratiques cochables. 28 réponses au lieu de ~70 |
| 3 | Règle de palier | incoming | Niveau 1–5 par domaine ; palier L acquis si tout domaine de rang ≤ L est au niveau ≥ L |
| 4 | Hors périmètre | incoming | Statut `na` par domaine, exclu du calcul, déclaré en restitution |
| 5 | Contexte et intention | current, **intention déplacée** | Les 13 attributs de contexte **restent au cadrage** ; le degré de transformation passe en phase Résultats, où il fixe le niveau cible *après* l'évaluation et porte l'analyse des écarts |
| 6 | Énoncé cible et tri | **C** | Écarts triés par **rang exigé du modèle**, puis ordre du questionnaire ; jamais par retard constaté. Énoncé du rang visé affiché. Matériau d'entrée de la phase d'ancrage, qui reste hors périmètre |
| 7 | Graphiques | incoming | Échelle des 5 paliers à remplissage, radar 9 dimensions, verdict collant |
| 8 | Évaluation rapide (20 questions) | v2 | Elle mesure la *readiness* (Bettoni) et non la maturité de l'adoption, et son score pondéré 0–100 est la règle d'agrégation que le travail écarte depuis le 30.07. L'intégrer mettrait dans le même outil les deux règles dont le rapport arbitre entre elles. Le croisement des deux cadres part au rapport et dans l'écran Info ; la porte « readiness » est déclarée en v2, motivée par le fait que l'outil OCDE équivalent exclut la Suisse |
| 9 | Noms des paliers | both | Les cinq noms français fusionnent le verbe d'Ozkaya et le complément de Venkatraman — un rapprochement propre à ce travail, qu'AIMM ne revendique pas. La contribution est donc dans le vocabulaire primaire : le tableau d'équivalences en est la contrepartie de traçabilité, dans Info **et** dans l'export. À corriger : les noms anglais employés sans appariement dans les `detail` de `model-data.json` |
| 10 | Sauvegarde | both | localStorage + copier / restaurer un JSON |
| 11 | Livraison | current | Build Vite déployé sur Pages ; pas de variante single-file |
| 12 | Attribution | incoming | CC BY-NC-ND, « outil non officiel », dans l'interface et l'export |

**Ancrage est réintroduit comme quatrième phase** (renverse le 15.08). Le motif du retrait — une
phase grisée qui annonce ce que l'outil ne fait pas — tombe dès lors qu'elle a un contenu : niveau
cible, écart intention / capacité, domaines qui séparent avec l'énoncé du rang visé, export. Le
sous-titre dit *préparer l'ancrage*, jamais *ancrer* : la phase s'arrête au seuil de la mise en œuvre.

## Ce que le point 2 emporte

Supprimés : saisie par pratique, `checked`, `areaStats`, `blockTotals`, `missingGoalCount`,
`GoalChecklist.vue`, seuil de Préparation en critères, migration des sessions v1.
Conservés dans `model-data.json` : les 271 pratiques et les critères d'adoption — la fidélité
littérale à la source ne dépend pas de ce que l'interface affiche.

Troisième position sur l'unité de mesure en dix jours (pratique → critère le 15.08 → énoncé
aujourd'hui) : l'entrée DECISIONS doit le reconnaître et porter le motif, faute de quoi le journal
se lit comme une suite de revirements.

## Ce que le point 5 emporte

Le niveau cible n'existe plus au moment du questionnaire. Il n'ordonne donc plus les domaines, et le
mécanisme des séries (`wave`, `deferred`, écran `palier`, `skipToRestitution`, `orderedAreas(target)`)
perd son objet : avec 28 énoncés au lieu de 271 pratiques, une passe complète dans l'ordre du modèle
tient en une séance. Les domaines sont présentés de A1 à A28, sans arrêt intermédiaire.

L'écran de cadrage change peu : il perd la question de transformation et garde les 13 attributs.
Ceux-ci ne plafonnent plus rien avant l'évaluation ; ils alimentent, en Ancrage, le niveau que la
capacité de l'organisation soutient — à mettre en regard de l'intention qu'elle déclare alors.

Le parcours devient : **Cadrage** (qui évalue quoi) → **Diagnostic** (où en sommes-nous) →
**Résultats** (palier, échelle, radar, hors périmètre) → **Ancrage** (portée visée, niveau cible,
écart, domaines qui séparent, export).

Troisième pièce de l'entrée du 16.08 renversée (après l'unité de mesure). Le motif est cohérent :
l'intention se déclare quand l'organisation a de quoi la juger, c'est-à-dire après avoir vu où elle
en est — argument déjà employé le 15.08 pour retirer le choix du profil visé du cadrage.

## Retours de l'experte (jeu de commentaires du 24.08)

Déjà couverts par les décisions ci-dessus : la confusion critères / indicateurs de maturité (0.4,
absorption — meilleure réponse que la séparation qu'elle proposait) ; la liste de pratiques prise
pour une obligation (0.3) ; l'absence de priorisation, renvoyée à une prochaine itération (point 6
et 3.8b) ; la forme active « nous avons défini… », que la refonte en énoncés adopte.

Reste à traiter : passe terminologique (1.12), refonte de l'attribut de posture d'adoption (1.13),
retrait de l'option « transverse » et de la variable de régulation (1.11 et 1.12), confinement de
Venkatraman à l'écran Info et à l'attribution (1.8), défaut d'affichage « 3,1 / 3 » couvert par un
test (2.10), séance de terminologie (4.4b).

Sa liste de contrôle finale — objet mesuré, cohérence modèle / outil, parcours, ordonnancement des
domaines, logique de calcul — est couverte par les entrées `DECISIONS.md` du lot 0 ; le point
« HELP pour les écrans de restitution » est ce que 3.5 à 3.8 produisent.

## Retours de l'experte (seconde série, 10.09)

Quatre demandes après la seconde campagne d'évaluations terrain, sur une application jugée « beaucoup
plus claire » que la précédente. Arbitrage de l'auteur, motifs complets dans
`docs/logs/RETOURS-EXPERTE.md` :

- **Bandeau des domaines groupé par bloc plutôt que par dimension — écarté.** Les quatre blocs sont
  une pièce du modèle et c'est leur place dans la navigation ; la dimension et le domaine sont
  signalés dans la carte de chaque énoncé. La difficulté relevée est de lecture initiale, pas de
  structure.
- **« ne pas appliquer » → « non applicable » — fait le 10.09** (entrée DECISIONS du même jour).
- **Bande de profil vivante — inchangée.** D'autres retours de la même campagne l'ont appréciée, et
  voir le résultat se construire au fil des réponses est l'effet recherché.
- **Page d'information en trois niveaux de lecture — retenu, priorité haute.**

Deux chantiers de navigation naissent de cette série sans y avoir été demandés : ils répondent à la
friction que l'experte décrit (savoir où l'on en est) par le parcours plutôt que par les intitulés.

## Conventions

- **Qui** : `S` = Saverio rédige ou décide ; `C` = Claude assemble, relit ou critique (D15 : aucun
  énoncé de questionnaire, aucune correspondance interprétative rédigés par Claude).
- **Estimation** : en demi-journées, à charge pleine. Total ≈ 13 j (−2 j depuis la v1 du backlog).
- **Statut** : `[ ]` à faire · `[~]` en cours · `[x]` fait · `[?]` bloqué par une décision.
- **DEC** = produit une entrée dans `docs/DECISIONS.md` (date, décision, motif, alternative écartée).

---

## Lot 0 — Décisions et contrat (27–28.08) · ≈ ¾j

| ID | Tâche | Qui | Est. | Sortie | Statut |
|---|---|---|---|---|---|
| 0.1 | ~~Mail à Maria~~ — **répondu** : énoncés seuls · option C · AIMM v1.0 confirmé | — | — | Réponse citable dans PERIMETRE.md | [x] |
| 0.2 | **DEC** Unité de réponse = énoncé descriptif. Motif : la source donne le critère comme condition d'acquisition mais ne gradue pas ; l'énoncé à cinq niveaux est la méthode annoncée dans PERIMETRE.md et fondée sur Jeanneret Medina et al. (2024) ; la saisie passe de ~70 verdicts à 28, seule échelle tenable en séance de CoDir. Écarté : garder les critères en second plan, qui aurait maintenu deux unités de mesure concurrentes. Renverse l'entrée du 18.08 | S | ¼j | Entrée DECISIONS | [x] |
| 0.3 | **DEC** Pratiques en **lecture seule, repliées, dans la colonne de rappel du diagnostic**. Motifs : elles écraseraient visuellement cinq énoncés courts ; visibles, elles recréent mentalement la checklist retirée (« huit sur quinze, donc niveau 3 ») ; rédigées à l'infinitif, elles ramènent le prescriptif au moment du constat. **Exclues de l'export** — deux cent soixante et onze actions dans la pièce remise au dirigeant seraient la feuille de route non produite. Repli : objectifs seuls si les tests montrent un ralentissement. Elles restent dans `model-data.json` quoi qu'il arrive. **Décision prise puis renversée le même jour, après livraison** : le repli n'a pas suffi, le panneau `CriteriaReference.vue` est retiré et trois tests interdisent le retour des critères et des pratiques au questionnaire (voir 3.2). Les deux entrées sont au journal, la seconde consignée le 10.09 | S | ¼j | 2 entrées DECISIONS | [x] |
| 0.4 | **DEC** Indicateurs transversaux **absorbés dans les énoncés** : ils sortent du parcours et deviennent la grille de dérivation des cinq niveaux. Deux conséquences à écrire — la rédaction des 140 énoncés devient une dérivation traçable de la source, et la sémantique de niveau devient uniforme entre domaines, ce qui rend la règle du minimum commensurable (fonde l'entrée 2.12). Écarté : le maintien, qui donnait 84 rangs hors calcul pour 28 énoncés ; la pose unique, qui perdait ce que les indicateurs montrent | S | ¼j | Entrée DECISIONS | [x] |
| 0.5 | **DEC** Le degré de transformation passe en Résultats ; les attributs de contexte restent au cadrage. Le niveau cible devient postérieur à l'évaluation : il ne cadre plus le questionnaire, il en interprète le résultat. Renverse l'entrée du 16.08 — à assumer explicitement | S | ¼j | Entrée DECISIONS | [x] |
| 0.5a | **DEC** Réintroduction de la phase Ancrage, avec la question de portée, le niveau cible, l'écart et les énoncés du rang visé. Renverse le 15.08 : la phase avait été retirée parce qu'elle était vide, elle ne l'est plus. Sous-titre « préparer l'ancrage » ; dernier paragraphe disant où l'outil s'arrête | S | ¼j | Entrée DECISIONS | [x] |
| 0.5d | **DEC** L'écart porte sur le **palier cible** issu de la question de portée, et non sur le palier suivant : poser la question et mesurer contre autre chose serait incohérent. Volume traité par la présentation, non par la règle — regroupement par paliers intermédiaires, le prochain déplié, les suivants repliés, total en tête. **Livré sans le repli** : les paliers intermédiaires sont tous dépliés, le volume constaté ne l'ayant pas réclamé | S | ¼j | Entrée DECISIONS | [x] |
| 0.5f | **DEC** Deux états en plus du cas nominal : **cible atteinte** (phrase déjà écrite dans `transformation.js`) et **cible en dessous du palier atteint** — ambition sous-déclarée ou construction excédant l'intention. Ni l'un ni l'autre n'est une erreur ; aucun ne tombe dans un `else` silencieux | S | ¼j | Entrée DECISIONS | [x] |
| 0.5e | ~~Ligne à Maria~~ — **sans objet** : elle a elle-même validé le déplacement de la question de transformation en fin de parcours, comme pont vers l'ancrage complet | — | — | — | [x] |
| 0.5b | **DEC** Suppression des séries : les 28 domaines sont présentés dans l'ordre du modèle, l'écran `palier` disparaît. Écarté : faire ordonner les domaines par la recommandation issue des attributs, qui rétablirait le profil visé silencieux abandonné le 16.08 | S | — | Entrée DECISIONS | [x] |
| 0.5c | **DEC** L'intention est-elle encore bornée par la capacité ? Proposition : non. Plafonner une intention déclarée après coup revient à corriger une réponse qu'on vient de solliciter ; l'écart entre les deux se donne à lire, il ne se rectifie pas. **Tranché en ce sens le 28.08** : la capacité ne borne plus l'intention, et l'écart s'affiche en Ancrage. **Porté dans le calcul** : `Math.min(intention, recommandation)` retiré de `useMaturityTool.js`, la recommandation devient une suggestion affichée en regard (`suggestedLevel`, `suggestedReasons`, `relation`) ; option retenue — sans portée déclarée, la suggestion sert de repère sous le nom de « profil suggéré » | S | — | Entrée DECISIONS | [x] |
| 0.6 | **DEC** Seuil du profil « Préparation » reposé : avec des énoncés, le niveau 1 décrit déjà l'absence. Proposition : Préparation = au moins 3 domaines renseignés sans que le palier 1 soit acquis. **Reposé autrement le 08.09** : deux textes et non un seuil chiffré — « Diagnostic en cours » tant qu'un domaine du premier rang n'a pas de réponse, « Encore en préparation » dès qu'ils en ont tous une sans atteindre le niveau 2 | S | — | Entrée DECISIONS | [x] |
| 0.7 | **DEC** Radar par dimension (9 axes, source de la mesure) ; le bloc reste le regroupement du détail. *`DimensionRadar.vue` est livré et conforme ; c'est l'entrée du journal qui manque* | S | — | Entrée DECISIONS | [ ] |
| 0.8 | Contrat de session v2 : `answers[areaId] ∈ {1..5, 'na'}`, `form` conservé, `indicators` et `checked` retirés, `SCHEMA_VERSION = 2`. Pas de migration v1 : un état de cases cochées ne se convertit pas en niveau, et aucune session n'est en production | C | ¼j | `useSessionStorage.js` + README (§6 depuis la renumérotation) | [x] |
| 0.9 | Entrées DECISIONS pour les points 1, 4, 6, 7, 8, 10, 11, 12. *Écrites : 1 (structure), 4 (hors périmètre), 6 (énoncé cible et tri), 8 (évaluation rapide), 12 (attribution, refaite le 10.09). Manquent : 7 (graphiques, voir 0.7), 10 (sauvegarde), 11 (livraison)* | S/C | ¼j | 8 entrées | [~] |

---

## Lot 1 — Contenu (28.08 → 05.09) · ≈ 4½j · **chemin critique, inchangé**

| ID | Tâche | Qui | Est. | Sortie | Dépend | Statut |
|---|---|---|---|---|---|---|
| 1.1 | Clé `statements` (5 chaînes) par area dans `model-data.json` + `scripts/check-model.js` (28 × 5 non vides, échec sinon) branché sur `npm run lint` | C | ¼j | Schéma + script | 0.8 | [x] |
| 1.2 | Guide de rédaction — **devenu rétro-documentation** : les registres ont été arrêtés pendant la rédaction et sont tracés en commentaire dans `statements.js` ; le guide les consigne et sert à répondre en soutenance à « d'où viennent vos énoncés ? ». Contenu : **grille de 5 × 3 cellules** extraite de la source (cinq niveaux × trois indicateurs), la sémantique de niveau ne dépendant pas du domaine ; chaque énoncé instancie la ligne de son niveau. Une situation observable au présent, une phrase, ≤ 25 mots ; l'énoncé nomme **la manifestation la plus observable** de la conjonction dans ce domaine, les deux autres facettes restant implicites — jamais les trois empilées ; registre France Num ; les énoncés de Maria = étalon de ton, jamais matière | S (C relit) | ½j | `docs/ENONCES.md` | — | [x] |
| 1.2b | Dérivation travaillée en entier sur un domaine (A1) comme exemple de référence dans `ENONCES.md` : les cinq énoncés, et pour chacun la cellule de grille qu'il instancie | S | ¼j | `docs/ENONCES.md` | 1.2 | [x] |
| 1.3 | Énoncés — bloc Strategy (A1–A7, 35) | S | 1j | JSON | 1.1, 1.2 | [x] |
| 1.4 | Énoncés — bloc Stakeholders (A8–A12, 25) | S | ¾j | JSON | 1.3 | [x] |
| 1.5 | Énoncés — bloc Business (A13–A18, 30) | S | ¾j | JSON | 1.4 | [x] |
| 1.6 | Énoncés — bloc Technology (A19–A28, 50) | S | 1j | JSON | 1.5 | [x] |
| 1.7 | Révision bloc par bloc : longueur, doublons, genre, et **contrôle mécanique** — un énoncé de niveau n qui ne dit rien de ce que la ligne n de la grille exige est à réécrire. *Mené et écrit : `docs/audits/enonces-tracabilite.md` pour le contrôle contre la grille, `docs/audits/enonces-langue.md` pour la langue. Les corrections sont proposées dans les deux fichiers `-propositions.md` et **non appliquées** à `statements.js`* | C | ½j au fil | Diff proposé | 1.3–1.6 | [~] |
| 1.7b | **Passe d'attaque de phrase** : 110 énoncés sur 140 commencent par « Nous ». Le parallélisme est un atout *à l'intérieur* d'un domaine — cinq phrases comparables d'un coup d'œil — et un défaut *entre* domaines, visible seulement dans l'export détaillé. Varier le sujet sur la moitié des domaines sans quitter la première personne active : « Nos fournisseurs d'IA figurent dans un inventaire que nous tenons à jour ». *Sept domaines réécrits en proposition dans `docs/audits/enonces-langue-propositions.md`, soit un quart et non la moitié visée ; rien n'est appliqué au fichier* | S/C | ½j | `src/data/statements.js` | 1.6 | [~] |
| 1.7c | **Test d'attribution à l'aveugle** sur les recouvrements identifiés (A2/A27, A16/A25, A19/A26/A28) : présenter dix énoncés hors contexte et demander de quel domaine ils relèvent. Matériau d'évaluation pour le rapport, et seul contrôle réel que la distinction tient | S | ¼j | — | 1.6 | [ ] |
| 1.8 | Contenu Info : adoption / maturité / readiness + tableau d'équivalences (5 paliers × Ozkaya, Venkatraman, Gartner, Altimeter, Element AI). Chaque ligne vérifiée contre sa source primaire ; « pas d'équivalent direct » admis quand les échelles n'ont pas cinq étages ; présenté comme rapprochement indicatif, non comme correspondance validée. Une phrase disant que la fusion Ozkaya × Venkatraman est une lecture propre à ce travail. Section « comment les niveaux sont construits » exposant la grille 5 × 3. **Venkatraman n'est nommé que sur cet écran, dans l'attribution et dans le rapport** — jamais dans la prose des autres écrans (retour de l'experte : « qui est Venkatraman ? ») | S | ¾j | `src/data/info.js` | — | [x] |
| 1.10 | Appariement des noms anglais dans les cinq blocs `detail` de `model-data.json` : première occurrence sous la forme « Alignement des processus (Aligned AI) ». Le texte traduit reste intact par ailleurs | S | ¼j | `src/data/model-data.json` | 1.8 | [x] |
| 1.11 | Formulation de la question de transformation posée en Ancrage : elle porte sur la **portée** visée (`reach`), jamais sur le degré ni sur le palier, faute de quoi l'utilisateur nomme lui-même la cible que l'outil lui renvoie. Intègre les retours de l'experte sur cet écran : retrait de l'option « transverse » (un mot calqué de *program* ; une équipe suffit), « posture » → « environnement », et aucune mention de Venkatraman dans la prose affichée | S | ½j | `src/data/transformation.js` | 0.5, 1.13 | [x] |
| 1.12 | **Passe terminologique** sur les 13 attributs de contexte et le cadrage, d'après les retours de l'experte : établissement et unité évaluée → organisation ; empreinte organisationnelle → territoire ; littéracie → connaissances ; « cas d'affaires » retraduit ; hybride, coordination légère, « qualitativement » explicités ; « solution prête à l'emploi ». Retrait de la variable de régulation — la cible jurassienne relève de toute façon de la nLPD ou du règlement européen | S | ¾j | `src/data/context-attributes.js`, `domain/scope.js` | — | [x] |
| 1.13 | Refonte de l'attribut de posture d'adoption (catégories de Rogers) : « qui veut être retardataire ? », et la distinction majorité précoce / tardive n'est pas lisible. Reformuler sur ce qui est réellement demandé — attendre que d'autres aient éprouvé la technologie, ou avancer avant eux | S | ½j | `src/data/context-attributes.js` | — | [x] |
| 1.9 | Texte d'attribution (pied de page + export) : Ozkaya et al. 2026 — copyright Carnegie Mellon University et mention de marque, la licence CC BY-NC-ND annoncée ici venait du rapport préliminaire et a été corrigée le 10.09.2026 —, Venkatraman 1994, Elia et al. 2024, Bettoni et al. 2021, « outil non officiel » | S | ¼j | `src/data/attribution.js` | — | [x] |

**Amendement du 10.09.2026 (point 1.11).** La question de portée garde sa règle — elle porte sur ce
que l’adoption doit avoir touché, jamais sur le degré ni sur le palier — mais change de forme : cinq
énoncés présentés comme un domaine de capacité, dans la carte du questionnaire, au lieu de cinq
intitulés courts dont le détail se dépliait. Le test pilote avait trouvé la question mal posée sous
cette seconde forme : on y choisissait sur des intitulés, alors que deux portées voisines ne se
départagent que sur la situation qu’elles décrivent. La dérivation des cinq énoncés, rang par rang,
depuis les niveaux d’Ozkaya et al. (2026) et les degrés de `transformation.js`, est écrite dans
`docs/proposals/portee-enonces.md` ; les textes validés le 10.09.2026 sont ceux qui sont intégrés.
L’interdiction de nommer un profil, un degré ou un rang dans ce qui s’affiche est désormais tenue par
un test (`tests/sources.test.js`) et non par la seule relecture.

L'énoncé cible du point 6 ne demande aucun contenu : c'est `statements[L]` du rang visé.

---

## Lot 2 — Domaine (01.09 → 04.09) · ≈ 2j

Fonctions pures. Peut démarrer sur des énoncés placeholder.

| ID | Tâche | Qui | Est. | Fichier | Dépend | Statut |
|---|---|---|---|---|---|---|
| 2.1 | `areaLevel(areaId, answers)` → 0 (non renseigné) · 1–5 ; `isOutOfScope` ; `inScopeAreas` | C | ¼j | `domain/scoring.js` | 0.8 | [x] |
| 2.2 | `acquiredLevel` réécrit : L acquis si l'ensemble des domaines en périmètre de rang ≤ L est non vide et tous au niveau ≥ L ; arrêt au premier échec ; garde `[].every()` conservée | C | ¼j | `domain/scoring.js` | 2.1 | [x] |
| 2.3 | `blockers(L)` : domaines de rang ≤ L sous le niveau L, **triés par rang exigé croissant puis ordre du questionnaire**. `blockersByGate(target)` regroupe par palier intermédiaire, du palier suivant jusqu'à la cible. Les non renseignés sortent et forment `toAssess`. `gateProgress(L)` pour l'échelle | C | ½j | `domain/scoring.js` | 2.2, 0.5d | [x] |
| 2.4 | `dimAverage`, `dimFloor` sur les domaines renseignés en périmètre ; `null` si aucun | C | ¼j | `domain/scoring.js` | 2.1, 0.7 | [x] |
| 2.5 | Retirer `areaStats`, `blockTotals`, `missingGoalCount`, `gapGroups`, `practiceKey`, `goalKey` — ou les réduire à ce que 0.3 conserve. **0.3 ayant été renversée, ils sont retirés sans reste** | C | ¼j | `domain/scoring.js` | 0.3 | [x] |
| 2.6 | Seuil de « Préparation » reposé selon 0.6 | C | ¼j | `data/in-progress.js` — le fichier `preparation.js` n'a pas été créé, le seuil étant devenu deux textes et non un nombre | 0.6 | [x] |
| 2.7 | `navigation.js` et `useMaturityTool.js` : suppression de `wave`, `deferred`, de l'écran `palier` et de `skipToRestitution` ; `orderedAreas(target)` remplacé par l'ordre du modèle ; quatrième phase Ancrage rétablie dans `journey.js` et `navigation.js`, avec ses écrans | C | ½j | `domain/navigation.js`, `data/journey.js`, `composables/` | 0.5, 0.5a, 0.5b | [x] |
| 2.8 | `useSessionStorage.js` v2 : validation de `answers`, `checked` retiré | C | ¼j | `composables/` | 0.8 | [x] |
| 2.9 | Démonstrations réécrites : chaque scénario porte un niveau par domaine et quelques `na` (cas consommateur d'IA). Vérifier que les trois cas retombent aux trois positions de l'échelle Venkatraman — `mastered`, `partial` et `wave` n'ont plus de sens ; chaque scénario porte en outre le degré de transformation qu'il déclare en restitution | S (contenu) / C (câblage) | ½j | `data/demo-sessions.js`, `domain/demo-session.js` | 2.2, 0.5b | [x] |
| 2.10 | Vitest + `npm run test` dans la CI avant `build`. Cas : maillon faible, `na` exclu, tout `na` → 0, tri des blockers, séparation `toAssess`, recommandation inchangée, et **aucune valeur affichée ne dépasse son total** — l'experte a relevé un « 3,1 / 3 » en restitution ; le nouveau calcul le supprime sans doute, un test le garantit | C | ½j | `tests/`, `deploy.yml` | 2.1–2.8 | [x] |
| 2.11 | **Analyse de sensibilité** de la règle au minimum : sur les trois sessions de démonstration, faire varier chaque réponse d'un niveau et compter les changements de palier. Sortie chiffrée pour le rapport et, si l'instabilité est forte, déclenchement de la condition de révision 2 (voir 0.10) | C (calcul) / S (lecture) | ½j | `scripts/sensitivity.js` | 2.2, 2.9 | [ ] |
| 2.12 | **DEC 0.10** Reformulation de l'entrée du 30.07 : fondement (règle conjonctive du CMM et rangs déclencheurs de la source), faiblesse admise (statistique d'ordre, pouvoir discriminant, progrès invisible), parades (`gateProgress`, moyenne *et* plancher par dimension, dénombrements ; jamais de score sur 100), échelle de repli en quatre paliers, et **deux conditions de révision vérifiables** : verdict identique sur toutes les sessions de test → profil par dimension (représentation continue CMMI) ; plus d'un tiers des réponses déplaçant le palier → la progression passe devant le verdict en restitution. Références : Paulk et al. 1993 ; Nardo et al. 2008 (OCDE/JRC) ; Munda et Nardo ; PNUD 2010 | S | ½j | `docs/DECISIONS.md` | 2.11 | [ ] |

---

## Lot 3 — Interface (03.09 → 09.09) · ≈ 3j

| ID | Tâche | Qui | Est. | Composant | Dépend | Statut |
|---|---|---|---|---|---|---|
| 3.1 | `ScreenDiag` : les cinq énoncés présentés en liste choisissable (un clic = une réponse) + bouton « HP » ; pas de repli, l'échelle entière est visible. Retrait de `GoalChecklist.vue` | C | ½j | `ScreenDiag.vue`, `StatementPicker.vue` | 2.1, 1.1 | [x] |
| 3.2 | ~~Colonne de rappel, **après** les énoncés dans l'ordre de lecture (à droite en large, section sous la question en étroit) : description, exemples d'artefacts, objectifs (2–3, visibles), pratiques repliées sous un libellé qui dit leur provenance — « les pratiques que la source associe à ce domaine », jamais « critères à remplir »~~ — **annulée le 28.08.2026, après avoir été livrée**. Le panneau a existé sous le nom `CriteriaReference.vue`, avec ce libellé exact. Motif du retrait : affichés à côté des énoncés, les critères d'adoption et les pratiques rouvrent la lecture en liste de conditions que l'unité de réponse par énoncé avait fermée, et donnent à croire qu'on répond sur eux. Ce que le rappel garde : bloc, dimension, nom, description, rang attendu, exemples d'artefacts. Le modèle continue de les porter dans `model-data.json`, qui reste le report littéral de la source ; trois tests interdisent désormais qu'ils reviennent au questionnaire | — | — | — | — | [x] |
| 3.3 | Barre de domaines : état par pastille (non renseigné / niveau / HP) ; progression « n/28 domaines renseignés » | C | ¼j | `ScreenDiag.vue` | 3.1 | [x] |
| 3.4 | ~~Verdict collant dans `AppHeader`, phases 2–3 : profil atteint, profil suivant, progression~~ — **annulée le 30.08.2026, après avoir été livrée**. La bande donnait au palier un troisième nom — « Profil atteint » — à quelques centimètres de celui que la restitution lui donne, et son compte de domaines n'avait pas le même dénominateur que la couverture affichée juste en dessous : deux nombres contradictoires dans un même champ de vision. Ce qu'elle rendait vraiment, savoir où l'on en est des vingt-huit domaines, est repris par la barre de `ScreenDiag`, qui entoure le domaine qu'on est en train de lire (voir 3.3) | C | ¼j | `AppHeader.vue` | 2.2 | [x] |
| 3.5 | `MaturityLadder.vue` : 5 paliers, remplissage = `gateProgress`, états acquis / suivant / à venir, clic → focalise les écarts. Jetons de `tokens.css` | C | ½j | nouveau | 2.3 | [x] |
| 3.6 | `DimensionRadar.vue` : SVG 9 axes, `dimension.color`, polygone sur `dimAverage`, + barres moyenne · plancher | C | ½j | nouveau | 2.4 | [x] |
| 3.7 | `ScreenTool1` : retrait de la seule question de transformation, les 13 attributs restent. Premier écran d'Ancrage : question de portée, niveau cible qui en découle, rappel de l'unité évaluée, écart avec le niveau que la capacité soutient. Retrait de `ScreenPalier.vue` | C | ½j | `ScreenTool1.vue`, `ScreenAncrage.vue` — un seul écran d'ancrage et non deux, 3.7 et 3.8 ayant été livrés ensemble | 2.7, 1.11 | [x] |
| 3.8 | Second écran d'Ancrage — **ce qui sépare de la cible**, groupé par palier intermédiaire (prochain déplié, suivants repliés, total en tête), chaque domaine avec l'énoncé de son rang visé ; **hors périmètre déclaré** ; **à évaluer** si des domaines sont restés vides. Les deux états de 0.5f traités explicitement. **Livré sans le repli des paliers suivants** : ils sont tous dépliés | C | ¾j | `ScreenAncrage.vue` | 2.3, 0.5d, 0.5f | [x] |
| 3.8b | Bloc de clôture d'Ancrage : où l'outil s'arrête, ce qui relève de l'accompagnement, et la génération d'une feuille de route priorisée annoncée comme prochaine itération. **Texte simple encadré, pas de bouton désactivé** — un élément qui paraît cliquable sans l'être frustre. Rédigé comme la suite du produit, non comme une excuse ; sert aussi de pistes futures au rapport. *Le chapô de l'écran dit où la phase s'arrête, et l'écran d'information annonce la feuille de route comme une itération ultérieure. L'encadré de clôture demandé ici, qui nomme ce qui relève de l'accompagnement, n'existe pas* | S (texte) / C (intégration) | ¼j | `ScreenAncrage.vue` | 0.5a | [~] |
| 3.9 | `ScreenInfo` : adoption / maturité / readiness + tableau d'équivalences | C | ¼j | `ScreenInfo.vue`, `FrameworkTable.vue` | 1.8 | [x] |
| 3.10 | `ScreenExport`, désormais clôture de la phase Ancrage : unité évaluée, contexte, profil, radar imprimable, domaines bloquants avec énoncé cible, détail des 28 réponses, attribution en pied. **Livré à ce jour** : l'en-tête de périmètre et de profils, les domaines bloquants avec leur énoncé cible, l'attribution et le démenti au pied de chaque page. **Restent** : le récapitulatif de contexte, le radar imprimable, le détail des 28 réponses | C | ½j | `ScreenExport.vue` | 3.6, 1.9 | [ ] |
| 3.11 | Sauvegarde JSON : copier / restaurer, validé par le même validateur que localStorage ; « Tout effacer » avec confirmation | C | ¼j | `ScreenExport.vue` | 2.8 | [ ] |
| 3.12 | Pied de page d'attribution partout ; `@media print` cohérent | C | ¼j | `App.vue`, `ScreenExport.vue` | 1.9 | [x] |
| 3.13 | `npm run lint`, contrôle à 1200 / 900 px, parcours clavier (`focus-visible` sur énoncés, HP, échelle). *`lint` et `test` tournent en intégration continue avant le `build` ; le contrôle à 1200 / 900 px et le parcours clavier sont des vérifications à l'œil, elles n'ont pas été faites* | C | ¼j | — | 3.1–3.12 | [~] |

---

## Lot 4 — Documentation et livraison (08.09 → 12.09) · ≈ 1½j

| ID | Tâche | Qui | Est. | Fichier | Statut |
|---|---|---|---|---|---|
| 4.1 | README : ce que fait l'outil (énoncés, hors périmètre, contexte en résultats), les composants, la clé `statements`, le contrat v2, le sort des 271 pratiques, les sources. *Les numéros de section ont changé depuis cette ligne : parcours en §2, arborescence en §4, modèle et énoncés en §5, contrat de session en §6, sources en §10* | S/C | ½j | `README.md` | [x] |
| 4.2 | README déclaration d'usage IA : les 140 énoncés rédigés par l'auteur, révision linguistique assistée ; scripts et composants assistés | S | ¼j | `README.md` §9 | [x] |
| 4.3 | `PERIMETRE.md` : chantier MLOps fermé par HP ; position sur la couche prescriptive citant la réponse de la direction de travail ; évaluation rapide déclarée v2. *MLOps et couche prescriptive : faits. Le seuil de N minimal y est requalifié en spécification depuis le 10.09. L'évaluation rapide n'y est toujours pas déclarée v2 — elle ne l'est qu'au point 8 ci-dessus et au journal* | S | ¼j | `docs/admin/PERIMETRE.md` | [~] |
| 4.4 | Relecture `DECISIONS.md` : la suite pratique → critère → énoncé doit se lire comme une progression argumentée | S | ¼j | `docs/DECISIONS.md` | [ ] |
| 4.4b | Séance de terminologie avec l'experte, sur ce que 1.12 et 1.13 auront produit, plus les messages affichés à l'écran (sa demande explicite en fin de jeu de commentaires) | S | ½j | — | [ ] |
| 4.5 | Séance test : session complète chronométrée (cible : CoDir en moins d'une heure), les trois démos, un export. **Observer si les pratiques sont dépliées systématiquement** — si oui, appliquer le repli de 0.3 | S | ½j | — | [ ] |
| 4.6 | `build`, `preview`, push, vérification Pages, puis **release GitHub `v1.0-tb`** sur le commit de remise : elle épingle le commit, y joint une archive et lui donne une date publique, ce qu'une étiquette locale ne fait pas. Le corps de la release redit ce que l'outil n'est pas et d'où vient le modèle. Fenêtre : modifications jusqu'au samedi 12.09 au soir, release le 12 au soir ou le 13 au matin, avant la restitution. *Une étiquette `v1.0-tb` traîne en local sur `2f06872`, jamais poussée : elle ne couvre pas le travail du 10.09 et doit être retirée ou déplacée avant que la release ne pose la sienne sous le même nom* | C | — | README § 3.5 | [~] |
| 4.7 | **Release `v1.1-tb-rapport`** le 28.09.2026, à l'échéance du rapport en français révisé : le dépôt porte aussi le rapport, il continue donc de bouger après la remise du code, et l'état rendu le 13.09 ne doit pas se laisser recouvrir. Sans objet si rien ne bouge d'ici là | S/C | — | README § 3.5 | [ ] |

12–13.09 : marge.

---

## Lot 5 — Suites de la seconde série d'évaluations (10.09 → )

| ID | Tâche | Qui | Est. | Sortie | Statut |
|---|---|---|---|---|---|
| 5.1 | **DEC** Libellé court de la sortie hors périmètre : « non applicable ». Nom accessible et comportement inchangés | S/C | — | `useMaturityTool.js` + entrée DECISIONS du 10.09 | [x] |
| 5.2 | Page d'information en **trois parties numérotées** : 1 pour répondre au questionnaire (parcours, les trois mots, carte des domaines) — ouverte et annoncée comme la seule à lire ; 2 pour comprendre le résultat (construction des niveaux, cadre de référence) ; 3 pour comprendre la méthode (équivalences d'échelles, attribution) — les deux dernières repliées. Écarté d'avance : des onglets ou des sous-écrans, qui toucheraient `navigation.js`, le contrat de session et les tests pour un gain nul | S/C | ½j | `ScreenInfo.vue`, `PARTS` et `PROVENANCE` dans `data/info.js` | [x] |
| 5.2b | Au passage : la liste des quatre sources et le rôle de chacune ferme la partie 3, branchée depuis `data/attribution.js`. Le pied de page ne porte que le référentiel de base et sa licence, faute de place ; les trois emprunts n'étaient lisibles nulle part à l'écran, ce que `attribution.js` annonçait pourtant déjà | S/C | — | `ScreenInfo.vue`, `data/info.js` | [x] |
| 5.3 | À la sélection d'un énoncé, **défilement forcé vers le premier domaine encore vide**, et non vers le domaine suivant dans l'ordre : la reprise d'une réponse ne doit pas renvoyer l'utilisateur à la fin de ce qu'il a déjà rempli. Comportement à borner — pas de saut quand on corrige une réponse déjà donnée, pas de saut au dernier domaine renseigné. Réutilise `scrollToAnchor` (`useAnchorScroll.js`). Livré avec trois abstentions — réponse corrigée ou annulée, réponse au clavier, questionnaire complet — et la règle sortie dans `domain/navigation.js` pour être testable sans navigateur | S/C | ½j | `nextEmptyAreaId` dans `domain/navigation.js`, `ScreenDiag.vue`, `StatementPicker.vue`, `useMaturityTool.js`, `tests/navigation.test.js` | [x] |
| 5.4 | Petite modale de confirmation sur « non applicable » : rappelle ce que l'exclusion emporte — « vous retenez que ce domaine de capacité ne s'applique pas à votre organisation et vous l'excluez de l'évaluation » — puis, si l'utilisateur confirme, saut forcé vers le prochain domaine vide — 5.3 le fait déjà pour l'interrupteur, la modale vient donc se poser devant. À n'ouvrir qu'à l'enclenchement, jamais au retrait, et à ne pas répéter vingt-huit fois : mémoriser l'acquittement dans la session, sur le modèle de `contextWarned`. `AppDialog.vue` existe. Livré : l'avertissement se consomme à la première exclusion confirmée et non sur une annulation ni sur Échap, une seule modale sert toute la page, et retirer une exclusion ne demande rien | S/C | ½j | `useMaturityTool.js` (`OUT_OF_SCOPE_DIALOG`, `outOfScopeWarned`), `useSessionStorage.js`, `ScreenDiag.vue`, `ScreenTool1.vue`, `MaturityTool.vue`, `tests/session-storage.test.js` | [x] |

Dépendance : 5.4 après 5.3, qui définit le saut qu'elle déclenche. Ordre arrêté par l'auteur :
5.1 → 5.2 → 5.3 → 5.4.

---

## Calendrier

| Semaine | Lots | Jalon |
|---|---|---|
| 27.08 → 30.08 | 0 entier, 1.1–1.3, 2.1–2.4 | Décisions écrites, contrat v2, énoncés Strategy livrés |
| 31.08 → 06.09 | 1.4–1.8, 2.5–2.10, 3.1–3.5 | 140 énoncés livrés, tests verts, questionnaire jouable |
| 07.09 → 11.09 | 3.6–3.13, 4.1–4.5 | Restitution complète, docs à jour |
| 12.09 → 13.09 | 4.6 + marge | Modifications jusqu'au 12 au soir ; release `v1.0-tb` sur le commit de remise, puis restitution le 13 |
| 14.09 → 28.09 | 4.7 | Rapport en français révisé ; release `v1.1-tb-rapport` si le dépôt a bougé |

## Si ça déborde

Couper dans cet ordre : 3.11 (sauvegarde JSON) · 3.6 (radar → barres seules) · 3.7 (contexte en tête
de Resti1 plutôt qu'en écran propre) · 2.10 (Vitest → test manuel documenté).

Ne pas couper : 1.3–1.6, 2.2, 4.2.

## Version 2

- Porte « Évaluation rapide » : 20 questions pondérées, score 0–100 par pilier, étiquetée *readiness*
  (Bettoni), jamais fusionnée au profil.
- Variante single-file (`vite-plugin-singlefile`).
- Scoping par pratiques adossé à `devApproach` — probablement sans objet une fois HP livré.
- Propagation `area→domain`, `goal→criterion` jusqu'aux identifiants et aux clés de session.
- Statistiques inter-PME (collecte, seuil de N minimal).

# Traçabilité des 140 énoncés — indicateurs × goals

Lot C du prompt de restructuration v2.0 (31.08.2026). Vérifie que les cinq énoncés de
chaque domaine constituent la synthèse entre la grille des trois indicateurs de maturité
(`maturity-indicators.js`, §5 de la source, reprise dans `docs/ENONCES.md`) et les goals
d'Ozkaya et al. (2026) du domaine (`model-data.json`).

## Méthode

Sources retenues, aucune incomplète ni contradictoire pour les 28 domaines : `docs/ENONCES.md`
(grille de dérivation et méthode), `maturity-indicators.js` (les trois indicateurs), `model-data.json`
(goals par domaine), `docs/PERIMETRE.md` (ce que le domaine revendique). Le registre choisi par
domaine (Responsabilité / Planification / Ressources) est celui déjà tracé en commentaire dans
`statements.js` — repris tel quel, non rediscuté ici.

Deux vérifications par domaine :

1. **Fidélité à la grille** — chaque rang instancie-t-il l'idée de son niveau (absence · existence
   désignée · boucle de mesure · reproductibilité au-delà du premier cas · anticipation) dans le
   registre choisi, par le test de fausseté de `docs/ENONCES.md` §3 ? Verdict par rang.
2. **Couverture des goals** — les 2 ou 3 goals du domaine sont-ils tous instanciés par au moins un
   rang, dans leur vocabulaire propre ? Verdict par goal, pas par rang : un goal peut rester en
   retrait sans que ce soit un défaut — un domaine à trois goals ne leur doit pas un rang chacun.
   Le signal à traiter est un goal **structurant** absent, pas un sous-aspect secondaire.

Verdicts : couvert · partiellement couvert · non couvert · hors sujet · redondant. Aucun énoncé des
140 n'a été jugé hors sujet ni redondant avec un autre rang de son propre domaine ; aucun saut ni
recouvrement de rang n'a été trouvé — la progressivité tient partout. Les redondances trouvées sont
toutes **inter-domaines**, rassemblées dans les constats ci-dessous plutôt que répétées 28 fois.

## Constats transversaux

**A6 et A7 — les deux trouvailles qui comptent.** `docs/PERIMETRE.md` cite explicitement deux
pratiques comme conditions d'applicabilité du modèle à une PME, et aucune des deux n'est
reconnaissable dans les énoncés qui portent censément ces domaines :

- **A7, goal 1** (« le besoin métier est établi avant la solution, et la pertinence même du recours
  à l'IA est examinée » — « examiner les réponses sans IA ») n'est instancié dans **aucun** des cinq
  rangs de A7. Les cinq énoncés partent tous d'une solution IA déjà entendue comme acquise et
  portent sur son dimensionnement (compétences, charge, réversibilité), jamais sur la question
  antérieure — IA ou pas IA. C'est pourtant le critère que PERIMETRE.md désigne comme « la condition
  d'applicabilité, pas un complément ». **Non couvert.**
- **A6, goal 1** (« documenter le poids des principaux donneurs d'ordre… et ce qu'il implique pour
  la marge de décision ») n'apparaît dans aucun énoncé — le rang 2 parle de « clients, appels
  d'offres, réglementation » mais jamais de dépendance à un ou deux donneurs d'ordre. PERIMETRE.md
  présente pourtant ce point comme *le* trait qui ancre le modèle dans l'arc jurassien et le
  rattache nommément à A6. **Partiellement couvert.**

**Trois paires à recouvrement lexical, déjà repérées par `BACKLOG.md` (item 1.7c, test d'attribution
à l'aveugle non encore mené) :**

- **A2 / A27** — A2 r1 (« prestataires pris au cas par cas, personne ne suit dans la durée ») et
  A27 r1 (« nous ne savons pas précisément de quels fournisseurs nous dépendons ») décrivent la même
  absence de suivi fournisseur. Distinction voulue : A2 = sélection stratégique en amont, A27 =
  gestion du risque de dépendance en aval (chaîne d'approvisionnement, sous-traitants) — mais rien
  dans le vocabulaire des rangs 1-2 ne rend cette différence de moment lisible.
- **A16 / A25** — A16 r5 (« décrochage, dérive des résultats, désaffection ») emprunte le
  vocabulaire que A25 revendique pour lui (« détection de dérive, dégradation »). Distinction voulue :
  A16 = performance métier perçue, A25 = comportement technique en production — tient sur le papier,
  fragile à l'oral.
- **A19 / A26 / A28** — les trois rangs 4 partagent le même schéma « les mêmes moyens/méthode, projet
  après projet » (raccordement technique / capacité au quotidien / généralisation d'un usage validé).
  Distinguables en théorie, jamais éprouvés en pratique.

Ces trois paires ne se tranchent pas par la lecture du document seul — l'item 1.7c du backlog
(test d'attribution à l'aveugle) reste la seule vérification qui vaille, ce constat ne fait que le
confirmer utile.

**Fidélité à la grille : aucune exception.** Les 140 rangs instancient correctement l'idée de leur
niveau — y compris les deux pièges documentés dans `docs/ENONCES.md` §5 (rang 4 rendu par « d'un cas
à l'autre / hors de l'équipe qui a lancé » et jamais par « dans tous les services » ; rang 1 décrivant
l'absence de façon uniforme). Aucune correction à proposer sur cet axe.

---

## Bloc B1 · Strategy

### A1 — Élaboration de la stratégie IA (palier 2 · Responsabilité)
Goals : (1) périmètre défini · (2) stratégie établie · (3) avancement évalué régulièrement.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (2), en creux | Couvert |
| 2 | Existence désignée | (1) + (2) | Couvert |
| 3 | Boucle de mesure | (3) | Couvert |
| 4 | Reproductibilité | (2) | Couvert |
| 5 | Anticipation | (2) | Couvert |

Couverture des goals : 3/3. Domaine étalon du guide (`docs/ENONCES.md` §7) — cohérent avec l'audit.
Voisinage avec A4 (rang 5 des deux domaines) vérifié : A1r5 porte sur le choix d'initiatives selon une
trajectoire, A4r5 sur la construction de scénarios robustes — la distinction que `docs/ENONCES.md` §7
demandait de surveiller tient.

### A2 — Développement des partenariats IA (palier 3 · Responsabilité)
Goals : (1) veille secteur · (2) partenaires sollicités selon capacités · (3) contrats revus.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (2), en creux | Couvert |
| 2 | Existence désignée | (3) | Couvert |
| 3 | Boucle de mesure | (3) | Couvert |
| 4 | Reproductibilité | (2) | Couvert |
| 5 | Anticipation | (1) + (3) | Couvert |

Couverture : 3/3. Voir constat transversal A2/A27.

### A3 — Ajustement de la structure organisationnelle (palier 3 · Planification)
Goals : (1) processus évalués/ajustés · (2) structure évaluée proactivement.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (1) | Couvert |
| 3 | Boucle de mesure | (1) | Couvert |
| 4 | Reproductibilité | (1) | Couvert |
| 5 | Anticipation | (2) | Couvert |

Couverture : 2/2. Rang 4 à surveiller légèrement à côté de A9 r4 (les deux parlent d'un
« accompagnement/démarche repris d'un cas au suivant ») — distinguable (processus vs. équipes), pas
signalé comme redondance forte.

### A4 — Planification prospective (palier 5 · Planification)
Goals : (1) méthodes analytiques établies · (2) stratégie actualisée selon scénarios · (3) rayonnement externe.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (2), en creux | Couvert |
| 2 | Existence désignée | (2) | Couvert |
| 3 | Boucle de mesure | (2) | Couvert |
| 4 | Reproductibilité (variante : objet plutôt qu'équipe) | (1) | Couvert |
| 5 | Anticipation | (2) | Couvert |

Couverture : 2/3 — le goal (3), rayonnement et collaboration externe, n'apparaît dans aucun rang.
Secondaire : les deux autres goals absorbent l'idée du domaine (feuilles de route, scénarios), le
rayonnement externe est une pratique annexe de la source. Partiellement couvert, priorité basse.

### A5 — Gestion du budget et des investissements IA (palier 2 · Ressources)
Goals : (1) enveloppe distincte · (2) engagement par paliers · (3) arrêt/report/adoption partielle consignés.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (1) | Couvert |
| 3 | Boucle de mesure | (2) | Couvert |
| 4 | Reproductibilité | (2) | Couvert |
| 5 | Anticipation | (3), en creux (« absorber un arrêt ») | Partiellement couvert |

Couverture : le goal (3) — trait distinctif du domaine selon `docs/DECISIONS.md` (18.08.2026), qui
en fait « une pratique évaluable » et non une réserve théorique — n'affleure qu'en fin de rang 5,
jamais comme fait consigné. **Priorité moyenne**, proposition en fichier séparé.

### A6 — Pressions et motivations externes (palier 1 · Responsabilité)
Goals : (1) pressions identifiées et nommées · (2) motivations propres distinguées des pressions subies.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (1) — sans le poids du donneur d'ordre | **Partiellement couvert** |
| 3 | Boucle de mesure | (2) | Couvert |
| 4 | Reproductibilité | (2) | Couvert |
| 5 | Anticipation | (2) | Couvert |

Voir constat transversal en tête de document. **Priorité haute.**

### A7 — Adéquation et proportionnalité de la solution (right-sizing) (palier 2 · Ressources)
Goals : (1) besoin établi avant solution, réponses sans IA examinées · (2) solutions filtrées par ce que l'entreprise peut tenir · (3) confidentialité/souveraineté bornent le choix.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (2), en creux — goal (1) absent | **Non couvert sur (1)** |
| 2 | Existence désignée | (2) | Couvert |
| 3 | Boucle de mesure | (2) | Couvert |
| 4 | Reproductibilité | (2) + (3) | Couvert |
| 5 | Anticipation | (3) | Couvert |

Voir constat transversal en tête de document. **Priorité haute.**

---

## Bloc B2 · Stakeholders

### A8 — Développement des compétences IA des collaborateurs (palier 1 · Ressources)
Goals : (1) rôles/compétences identifiés · (2) formations dispensées.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (2), en creux | Couvert |
| 2 | Existence désignée | (1) + (2) | Couvert |
| 3 | Boucle de mesure | (1) | Couvert |
| 4 | Reproductibilité | (2) | Couvert |
| 5 | Anticipation | (1) | Couvert |

Couverture : 2/2, bien répartie.

### A9 — Évolution de la culture d'entreprise (palier 3 · Planification)
Goals : (1) culture ouverte/participative · (2) collaborateurs en phase recrutés/développés · (3) préparation suivie et pilotée (objectifs individuels).

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (1) | Couvert |
| 3 | Boucle de mesure | (1) | Couvert |
| 4 | Reproductibilité | (2)/(3), en creux | Couvert |
| 5 | Anticipation | (2) | Couvert |

Couverture : le goal (1) porte quatre des cinq rangs ; (2) et (3) — recrutement en phase avec la
culture IA, pilotage individuel par objectifs — ne sont instanciés qu'en creux. **Partiellement
couvert sur (2)/(3), priorité basse** : pas de proposition ponctuelle, la correction toucherait
plus d'un rang à la fois (voir fichier de propositions).

### A10 — Gestion des risques (palier 2 · Planification)
Goals : (1) risques identifiés/évalués/communiqués · (2) processus de gestion établi · (3) efficacité des contrôles testée **de manière indépendante**.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (1) + (2) | Couvert |
| 3 | Boucle de mesure | (2), auto-évaluation | **Partiellement couvert sur (3)** |
| 4 | Reproductibilité | (2) | Couvert |
| 5 | Anticipation | (1) | Couvert |

Le trait distinctif du goal (3) — l'indépendance du test, par opposition à l'auto-évaluation du
goal (2) — n'est instancié nulle part. **Priorité moyenne**, proposition en fichier séparé.

### A11 — Politiques et conformité (palier 2 · Responsabilité)
Goals : (1) politiques alignées · (2) conformité gérée.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (2), en creux | Couvert |
| 2 | Existence désignée | (1) + (2) | Couvert |
| 3 | Boucle de mesure | (1) | Couvert |
| 4 | Reproductibilité | (1) | Couvert |
| 5 | Anticipation | (2) | Couvert |

Couverture : 2/2, bien répartie.

### A12 — IA responsable (palier 2 · Responsabilité)
Goals : (1) parties prenantes/populations affectées identifiées · (2) approche définie · (3) approche mise en œuvre.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (2), en creux | Couvert |
| 2 | Existence désignée | (2) + (3) | Couvert |
| 3 | Boucle de mesure | (3) | Couvert |
| 4 | Reproductibilité | (3) | Couvert |
| 5 | Anticipation | (2) | Couvert |

Couverture : le goal (1) — identification systématique des populations affectées, impact ressources
— n'apparaît qu'à travers « client ou collaborateur » (r3), jamais comme démarche d'identification.
**Partiellement couvert, priorité basse.**

---

## Bloc B3 · Business

### A13 — Expérimentation (palier 1 · Ressources)
Goals : (1) POC réalisées · (2) expérimentation opérationnelle menée.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (2), en creux | Couvert |
| 2 | Existence désignée | (1) + (2) | Couvert |
| 3 | Boucle de mesure | (1) | Couvert |
| 4 | Reproductibilité | (2) | Couvert |
| 5 | Anticipation | (2) | Couvert |

Couverture : 2/2, bien répartie.

### A14 — Innovation des processus métier (palier 3 · Planification)
Goals : (1) processus identifiés/priorisés · (2) workflows évalués (risques, pertinence technique) · (3) workflows validés pour montée en charge.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (1) | Couvert |
| 3 | Boucle de mesure | (1) | Couvert |
| 4 | Reproductibilité | (3) | Couvert |
| 5 | Anticipation | — | Couvert |

Couverture : le goal (2) — évaluation technique du workflow (volume, véracité des données, risques) —
n'est instancié dans aucun rang ; les énoncés mesurent le gain économique (r2) et le coût/délai (r3),
jamais la pertinence des données. **Partiellement couvert, priorité basse.**

### A15 — Automatisation à supervision humaine (palier 3 · Responsabilité)
Goals : (1) systèmes conçus pour renforcer le rôle humain · (2) supervision pour décisions critiques.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (1) | Couvert |
| 3 | Boucle de mesure | (1) | Couvert |
| 4 | Reproductibilité | (1) | Couvert |
| 5 | Anticipation | (2) | Couvert |

Couverture : 2/2. Le vocabulaire précis du goal (2) — santé, sécurité, réputation — n'est pas cité,
mais l'idée (décisions qu'on ne délègue jamais) tient. Non signalé comme défaut.

### A16 — Mesure et analyse (palier 3 · Planification)
Goals : (1) objectifs de mesure identifiés · (2) résultats communiqués.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (1) | Couvert |
| 3 | Boucle de mesure | (1) | Couvert |
| 4 | Reproductibilité | (1) | Couvert |
| 5 | Anticipation | — | Couvert |

Couverture : le goal (2) — communication des résultats, tableaux de bord par niveau de management —
n'est instancié dans aucun rang, le domaine reste centré sur la mesure elle-même. Partiellement
couvert, priorité basse. Voir constat transversal A16/A25.

---

## Bloc B3 · Gouvernance des données

### A17 — Gestion du cycle de vie des données (palier 2 · Responsabilité)
Goals : (1) données acquises/tracées · (2) gouvernance attribuée · (3) confidentialité/sécurité assurées.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (2), en creux | Couvert |
| 2 | Existence désignée | (2) | Couvert |
| 3 | Boucle de mesure | (3) | Couvert |
| 4 | Reproductibilité | (1) | Couvert |
| 5 | Anticipation | (3) | Couvert |

Couverture : 3/3, bien répartie.

### A18 — Assurance qualité des données (palier 2 · Planification)
Goals : (1) exigences de qualité identifiées (y compris biais) · (2) données préparées.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (1) + (2) | Couvert |
| 3 | Boucle de mesure | (1) | Couvert |
| 4 | Reproductibilité | (2) | Couvert |
| 5 | Anticipation | (2) | Couvert |

Couverture : 2/2, mais le mot « biais » du goal (1) n'apparaît dans aucun énoncé — sous-aspect
secondaire, pas signalé comme un défaut à corriger séparément.

---

## Bloc B4 · Technology

### A19 — Architecture IA (palier 2 · Ressources)
Goals : (1) architectures développées · (2) risques sécurité/opérationnels pris en compte · (3) montée en charge anticipée.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (1) | Couvert |
| 3 | Boucle de mesure | (1) | Couvert |
| 4 | Reproductibilité | (1) | Couvert |
| 5 | Anticipation | (3) | Couvert |

Le goal (2) — risques de sécurité intégrés à l'architecture, IAM des agents — n'est instancié nulle
part dans A19, mais A24 (Sécurité des modèles et agents IA) le couvre entièrement de son côté.
**Partiellement couvert, à confirmer que le partage avec A24 est volontaire** — priorité basse si
oui, à corriger si le partage n'était pas intentionnel.

### A20 — Tests et évaluation (palier 2 · Planification)
Goals : (1) tests spécifiques IA réalisés · (2) qualité suivie et documentée.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (1) | Couvert |
| 3 | Boucle de mesure | (2) | Couvert |
| 4 | Reproductibilité | (1) | Couvert |
| 5 | Anticipation | (1) | Couvert |

Couverture : 2/2, bien répartie.

### A21 — Intégration aux systèmes existants (palier 3 · Ressources)
Goals : (1) intégration par architecture/interopérabilité · (2) cycle de vie des systèmes existants géré.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (1) | Couvert |
| 3 | Boucle de mesure | (1) | Couvert |
| 4 | Reproductibilité | (1) | Couvert |
| 5 | Anticipation | (2) | Couvert |

Couverture : 2/2, bien répartie.

### A22 — Transparence et explicabilité (palier 3 · Responsabilité)
Goals : (1) exigences identifiées · (2) exigences prises en compte dans la conception · (3) explications pertinentes pour les utilisateurs.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (2) | Couvert |
| 3 | Boucle de mesure | (3) | Couvert |
| 4 | Reproductibilité | (2) | Couvert |
| 5 | Anticipation | (2) | Couvert |

Couverture : 3/3, bien répartie.

### A23 — Gestion des modèles IA (palier 2 · Planification)
Goals : (1) version tracée/maîtrisable · (2) changements documentés et **communiqués aux parties prenantes** · (3) conditions d'évaluation formelles avant mise à disposition.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (1) | Couvert |
| 3 | Boucle de mesure | (3) | Couvert |
| 4 | Reproductibilité | (3) | Couvert |
| 5 | Anticipation | — | Couvert |

Le volet « communiqué aux parties prenantes » du goal (2) reste absent — tout reste interne et
technique (comparaison, vérification). **Partiellement couvert, priorité basse.**

### A24 — Sécurité des modèles et agents IA (palier 2 · Responsabilité)
Goals : (1) modèles/agents protégés contre compromission · (2) actions suivies et contrôlées.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (1) | Couvert |
| 3 | Boucle de mesure | (2) | Couvert |
| 4 | Reproductibilité | (2) | Couvert |
| 5 | Anticipation | (2) | Couvert |

Couverture : 2/2, bien répartie — et complète le partage avec A19 (voir A19).

### A25 — Suivi (palier 3 · Planification)
Goals : (1) informations exploitables collectées/utilisées · (2) défaillances détectées/traitées · (3) données conformité/audit/ROI collectées.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (1) | Couvert |
| 3 | Boucle de mesure | (2) | Couvert |
| 4 | Reproductibilité | (1) | Couvert |
| 5 | Anticipation | (2) | Couvert |

Le goal (3) — collecte de données pour la conformité, l'audit et le ROI — n'apparaît dans aucun
rang ; A25 reste entièrement centré sur le suivi opérationnel (goals 1-2). **Partiellement couvert,
priorité basse.** Voir constat transversal A16/A25.

### A26 — Infrastructure technologique (palier 2 · Ressources)
Goals : (1) exigences d'infrastructure définies · (2) infrastructure fournie · (3) stratégie de renouvellement proactive.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (1) + (2) | Couvert |
| 3 | Boucle de mesure | (2) | Couvert |
| 4 | Reproductibilité | — | Couvert |
| 5 | Anticipation | (3) | Couvert |

Couverture : 3/3, bien répartie. Voir constat transversal A19/A26/A28.

### A27 — Gestion de la chaîne d'approvisionnement (palier 3 · Planification)
Goals : (1) inventaire tiers tenu à jour · (2) tiers évalués pour conformité · (3) dépendances aux **données** externes gérées.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (1) | Couvert |
| 3 | Boucle de mesure | (2) | Couvert |
| 4 | Reproductibilité | (1) | Couvert |
| 5 | Anticipation | (2) | Couvert |

Le goal (3) — dépendances aux données externes, distinct des dépendances fournisseurs — n'est
instancié nulle part ; A27 reste centré sur les fournisseurs et sous-traitants. **Partiellement
couvert, priorité basse.** Voir constat transversal A2/A27.

### A28 — Déploiement à l'échelle (palier 4 · Ressources)
Goals : (1) montée en charge planifiée/documentée · (2) objectifs de performance/fiabilité définis et atteints.

| Rang | Idée de grille | Goal instancié | Verdict |
|---|---|---|---|
| 1 | Absence | (1), en creux | Couvert |
| 2 | Existence désignée | (1) | Couvert |
| 3 | Boucle de mesure | (1) | Couvert |
| 4 | Reproductibilité | (1) | Couvert |
| 5 | Anticipation | (1) | Couvert |

Le goal (2) — SLA/SLO, fiabilité en service à l'échelle — n'apparaît dans aucun rang, A28 reste
centré sur les moyens et le coût de l'extension. **Partiellement couvert, priorité basse.** Voir
constat transversal A19/A26/A28.

---

## Récapitulatif

- 140/140 rangs fidèles à la grille de dérivation ; aucune correction proposée sur cet axe.
- 2 domaines à trou de couverture jugé prioritaire : **A6** (partiellement), **A7** (non couvert) —
  tous deux touchent une pratique que `docs/PERIMETRE.md` cite nommément comme condition
  d'applicabilité PME ou d'ancrage régional.
- 2 domaines à trou de couverture jugé secondaire mais réel : **A5** (arrêt/report en creux),
  **A10** (contrôle jamais qualifié d'indépendant).
- 9 domaines à un goal en retrait sans enjeu de fond identifié : A4, A9 (×2 goals), A12, A14, A18,
  A19, A23, A25, A27, A28 — consignés, aucune proposition de réécriture forcée.
- 3 paires inter-domaines à recouvrement lexical (A2/A27, A16/A25, A19/A26/A28), déjà identifiées par
  `BACKLOG.md` (item 1.7c) : le test d'attribution à l'aveugle reste la seule vérification qui tranche.

Propositions de correction pour les items « priorité haute/moyenne » : voir
`docs/audits/enonces-tracabilite-propositions.md`.

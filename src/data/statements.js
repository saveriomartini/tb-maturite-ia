// Énoncés descriptifs du questionnaire — un jeu de cinq par domaine de capacité.
//
// Ce fichier n'appartient pas au report de la source. `model-data.json` est le
// relevé littéral d'Ozkaya et al. (2026) — c'est cette littéralité qui rend le
// modèle défendable en soutenance, et rien qui ne figure pas dans le PDF n'a le
// droit d'y entrer. Or les énoncés ci-dessous ne s'y trouvent pas : ils en sont
// *dérivés*, pas extraits. Ils vivent donc à côté, exactement comme
// preparation.js et transformation.js (docs/DECISIONS.md, entrées du 15.08.2026
// et du 18.08.2026).
//
// D'où ils sont dérivés, précisément. La source ne décrit pas ce qu'est un
// niveau domaine par domaine : elle pose une seule fois, au §5, une grille de
// trois indicateurs transversaux — Responsabilité, Planification, Ressources —
// et, pour chacun, cinq lignes qui disent ce qu'un rang attend quelle que soit
// la capacité considérée (grille reprise dans maturity-indicators.js). C'est
// cette grille qui fournit la sémantique de niveau du modèle (décision du
// 30.07.2026), et elle ne dépend pas du domaine :
//
//   1  absence — rien d'assigné, rien de planifié, rien d'alloué régulièrement
//   2  existence désignée — des rôles, un plan, un budget pour ce domaine
//   3  boucle de mesure — ce qui est mesuré change la conduite
//   4  reproductibilité au-delà du premier cas — hors de l'équipe qui a lancé
//   5  anticipation — les choix servent une stratégie et des scénarios à venir
//
// Un énoncé de rang n instancie donc, pour son domaine, la ligne n de cette
// grille. Instancier n'est pas réciter : on ne redit pas les trois indicateurs
// à la suite, on nomme la manifestation la plus observable de cette situation
// dans ce domaine-là. Une phrase, au présent, observable, tranchable par un
// dirigeant sans audit — celui qui répond doit pouvoir dire oui ou non de
// mémoire, en séance, sans aller chercher une pièce.
//
// Les règles complètes de rédaction — ce qui se dit, ce qui ne se dit pas, et
// comment on tranche entre deux rangs voisins — sont dans docs/ENONCES.md.
//
// Les `text` sont vides tant que la rédaction n'a pas eu lieu : c'est du contenu
// d'auteur (voir la déclaration d'usage de l'IA, §5 du README), et la structure
// est posée avant lui pour que scripts/check-model.js puisse suivre l'avancement
// et garantir qu'aucun domaine du modèle ne reste sans jeu d'énoncés.

// Les cinq rangs de l'échelle, dans l'ordre. Le questionnaire n'affiche pas le
// nom du niveau — on demande laquelle des cinq situations décrit l'entreprise,
// pas de se situer sur une échelle (même parti que maturity-indicators.js).
export const STATEMENT_RANKS = [1, 2, 3, 4, 5]

// Le rang n'est pas déduit de la position dans le tableau : il est porté par
// `n`. Une ligne déplacée ou dupliquée pendant la rédaction changerait sinon le
// niveau qu'elle décrit sans que rien ne le signale — check-model.js vérifie que
// les deux coïncident.
export const STATEMENTS = {

  // ──────────────────────────────────────────────────────────────────────
  // Bloc B1 · Strategy
  // ──────────────────────────────────────────────────────────────────────

  // D11 · Alignement stratégique et Structure de l'organisation

  // A1 — Élaboration de la stratégie IA (exigé au palier 2)
  // registre : Responsabilité · niveau 4 rendu par « d’une initiative IA à la suivante, hors de celle qui a inspiré la stratégie »
  A1: [
    { n: 1, text: 'Nous n’avons encore désigné personne pour dire ce que l’IA doit apporter à notre activité.' },
    { n: 2, text: 'Un membre de la direction porte notre stratégie d’adoption de l’IA, que nous avons formulée par écrit avec ses jalons.' },
    { n: 3, text: 'Nous rendons compte de l’avancement devant la direction, qui réoriente la stratégie quand les résultats s’écartent des objectifs annoncés.' },
    { n: 4, text: 'Nous arbitrons chaque nouvelle initiative IA au regard de cette stratégie, y compris celles qui ne viennent pas de l’équipe qui l’a rédigée.' },
    { n: 5, text: 'Nous choisissons nos initiatives IA d’après la trajectoire que nous visons à trois ou cinq ans, non d’après les occasions qui passent.' }
  ],

  // A2 — Développement des partenariats IA (exigé au palier 3)
  // registre : Responsabilité · niveau 4 rendu par « la même grille d’un fournisseur au suivant, quel que soit le projet »
  A2: [
    { n: 1, text: 'Nous prenons nos prestataires d’IA au cas par cas, sans que personne ne suive dans la durée ce qu’ils nous apportent.' },
    { n: 2, text: 'Nous avons désigné qui retient un fournisseur d’IA, signe le contrat et y inscrit nos exigences sur la propriété des données.' },
    { n: 3, text: 'À l’échéance, nous comparons ce que le fournisseur a livré aux critères de qualité du contrat, et cette comparaison décide du renouvellement.' },
    { n: 4, text: 'Nous passons tout nouveau fournisseur d’IA par la même grille d’évaluation, quel que soit le projet qui le sollicite.' },
    { n: 5, text: 'Nous suivons les évolutions du marché de l’IA et nouons nos partenariats de façon à pouvoir changer de fournisseur sans refaire nos solutions.' }
  ],

  // A3 — Ajustement de la structure organisationnelle (exigé au palier 3)
  // registre : Planification · niveau 4 rendu par « la démarche d’ajustement reprise d’une activité à l’autre »
  A3: [
    { n: 1, text: 'Nous n’avons rien changé à notre organisation ni à nos façons de travailler depuis que l’IA est entrée dans l’entreprise.' },
    { n: 2, text: 'Nous suivons un plan d’adaptation de nos processus à l’IA, qui nomme les personnes concernées et les étapes prévues.' },
    { n: 3, text: 'Nous mesurons ce que l’IA change sur les délais et la charge de nos processus, et nous corrigeons ce plan à chaque revue.' },
    { n: 4, text: 'Quand l’IA arrive sur une nouvelle activité, nous reprenons la démarche d’ajustement éprouvée sur la précédente au lieu d’improviser.' },
    { n: 5, text: 'Nous faisons évoluer notre organisation d’après les métiers et les compétences que nous voulons réunir dans quelques années.' }
  ],

  // A4 — Planification prospective (exigé au palier 5)
  // registre : Planification · niveau 4 rendu par « le même exercice de prospective quel qu’en soit l’objet »
  A4: [
    { n: 1, text: 'Nous ne nous projetons pas au-delà des projets d’IA que nous menons aujourd’hui.' },
    { n: 2, text: 'Nous tenons une feuille de route des compétences et des technologies d’IA que nous voulons acquérir, avec ses échéances.' },
    { n: 3, text: 'Chaque année, nous confrontons ce que cette feuille de route prévoyait à ce qui s’est réellement produit, et nous la corrigeons.' },
    { n: 4, text: 'Nous menons nos exercices de prospective de la même manière, qu’ils portent sur nos métiers, nos données ou nos outils.' },
    { n: 5, text: 'Nous préparons plusieurs scénarios d’évolution — réglementaire, technologique, concurrentielle — et retenons la feuille de route qui résiste le mieux à chacun.' }
  ],

  // D12 · Motivations et Justification de l'adoption

  // A5 — Gestion du budget et des investissements IA (exigé au palier 2)
  // registre : Ressources · niveau 4 rendu par « les mêmes règles d’engagement quel que soit le projet qui demande la dépense »
  A5: [
    { n: 1, text: 'Nous réglons nos dépenses d’IA au fil de l’eau, sur le budget informatique courant, sans enveloppe qui leur soit propre.' },
    { n: 2, text: 'Nous avons fixé une enveloppe IA distincte, qui sépare l’investissement initial des coûts récurrents, et nous savons qui engage quel montant.' },
    { n: 3, text: 'Nous n’engageons un nouveau palier de dépense qu’au vu de ce que le précédent a rapporté, et nous consignons cette décision.' },
    { n: 4, text: 'Nous appliquons les mêmes règles d’engagement et les mêmes seuils à toutes nos dépenses d’IA, quel que soit le projet qui les demande.' },
    { n: 5, text: 'Nous répartissons notre enveloppe IA selon ce que nous voulons pouvoir faire dans trois ans, en gardant de quoi absorber un arrêt.' }
  ],

  // A6 — Pressions et motivations externes (exigé au palier 1)
  // registre : Responsabilité · niveau 4 rendu par « le même traitement d’une sollicitation à la suivante, quelle qu’en soit l’origine »
  A6: [
    { n: 1, text: 'Les demandes d’IA qui nous viennent de nos clients ou de notre secteur, nous les traitons à l’arrivée, sans que personne ne les rassemble.' },
    { n: 2, text: 'Une personne de la direction recense ce qui nous pousse vers l’IA, clients, appels d’offres ou réglementation, et en rend compte en séance.' },
    { n: 3, text: 'Nous comparons les bénéfices qu’on nous annonce aux résultats obtenus par des entreprises comparables, et cette comparaison décide de la suite.' },
    { n: 4, text: 'Nous traitons chaque sollicitation de la même manière, qu’elle vienne d’un client, d’un concurrent ou d’un fournisseur, et nous consignons notre réponse.' },
    { n: 5, text: 'Nous distinguons ce que notre marché exigera demain de ce qu’il annonce aujourd’hui, et nous préparons nos réponses avant qu’on nous les réclame.' }
  ],

  // A7 — Adéquation et proportionnalité de la solution (right-sizing) (exigé au palier 2)
  // registre : Ressources · niveau 4 rendu par « la même grille de filtrage d’un cas d’usage au suivant »
  A7: [
    { n: 1, text: 'Nous retenons les outils d’IA qu’on nous propose, sans avoir mesuré ce que leur exploitation demanderait chez nous.' },
    { n: 2, text: 'Avant de retenir une solution d’IA, nous vérifions les compétences qu’elle exige et nous désignons qui l’exploitera une fois en service.' },
    { n: 3, text: 'Après quelques mois, nous constatons la charge réelle d’exploitation de nos solutions et nous abandonnons celles qui coûtent plus qu’elles ne rapportent.' },
    { n: 4, text: 'Nous passons toute solution que nous envisageons par la même grille — compétences, charge, réversibilité, hébergement des données — d’un cas d’usage au suivant.' },
    { n: 5, text: 'Nous préférons les solutions que nous saurons remplacer, en gardant la maîtrise de nos données, à celles qui nous lieraient durablement.' }
  ],

  // ──────────────────────────────────────────────────────────────────────
  // Bloc B2 · Stakeholders
  // ──────────────────────────────────────────────────────────────────────

  // D21 · Compétences de la main-d'œuvre et Culture

  // A8 — Développement des compétences IA des collaborateurs (exigé au palier 1)
  // registre : Ressources · niveau 4 rendu par « le parcours de formation repris tel quel d’un collaborateur au suivant »
  A8: [
    { n: 1, text: 'Nos collaborateurs se débrouillent seuls avec l’IA, sans que nous ayons prévu ni temps ni formation pour cela.' },
    { n: 2, text: 'Nous avons inscrit au budget un plan de formation à l’IA et désigné les rôles qui doivent en bénéficier.' },
    { n: 3, text: 'Nous comparons les compétences acquises à celles dont nos projets d’IA ont besoin, et cet écart décide des formations suivantes.' },
    { n: 4, text: 'Quand un collaborateur prend un rôle lié à l’IA, nous lui donnons le parcours de formation déjà éprouvé, sans le reconstruire.' },
    { n: 5, text: 'Nous formons dès aujourd’hui aux compétences dont nos métiers auront besoin dans quelques années, et pas seulement à celles que nos outils réclament.' }
  ],

  // A9 — Évolution de la culture d'entreprise (exigé au palier 3)
  // registre : Planification · niveau 4 rendu par « l’accompagnement de la première équipe touchée repris pour les suivantes »
  A9: [
    { n: 1, text: 'Nous n’avons rien organisé pour parler de l’IA avec nos équipes : chacun s’en fait son idée.' },
    { n: 2, text: 'Nous parlons de l’IA à nos équipes à date fixe — réunion, note interne — et nous disons ce que nous en attendons.' },
    { n: 3, text: 'Nous recueillons ce que nos collaborateurs pensent de l’IA, et ce que nous entendons change notre manière d’introduire les nouveaux usages.' },
    { n: 4, text: 'L’accompagnement que nous avons mis au point pour la première équipe touchée, nous le reprenons pour celles qui viennent ensuite.' },
    { n: 5, text: 'Nous préparons nos équipes aux métiers que l’IA va transformer, en ouvrant des passerelles avant que les postes concernés ne changent.' }
  ],

  // D22 · Éthique et Gestion du Risque

  // A10 — Gestion des risques (exigé au palier 2)
  // registre : Planification · niveau 4 rendu par « la même analyse de risques du premier cas d’usage au dernier en date »
  A10: [
    { n: 1, text: 'Nous n’avons pas listé ce que l’usage de l’IA peut nous faire courir comme risques.' },
    { n: 2, text: 'Nous tenons une liste des risques liés à l’IA — fuite de données, erreur, dépendance — avec, pour chacun, la parade prévue.' },
    { n: 3, text: 'Nous revoyons cette liste après chaque incident et à chaque nouvel usage, puis nous durcissons les parades qui n’ont pas tenu.' },
    { n: 4, text: 'Tout nouvel usage de l’IA passe par la même analyse de risques, du premier cas d’usage au dernier en date.' },
    { n: 5, text: 'Nous fixons ce que nous acceptons de risquer avec l’IA au regard des usages que nous prévoyons d’ouvrir, pas seulement des usages actuels.' }
  ],

  // A11 — Politiques et conformité (exigé au palier 2)
  // registre : Responsabilité · niveau 4 rendu par « des règles qui valent pour tous nos outils, y compris ceux qu’une équipe a adoptés seule »
  A11: [
    { n: 1, text: 'Personne chez nous ne suit ce que la réglementation sur l’IA nous impose.' },
    { n: 2, text: 'Nous avons chargé quelqu’un de nos règles d’usage de l’IA et du suivi des obligations qui s’appliquent à notre secteur.' },
    { n: 3, text: 'Cette personne rend compte à la direction des écarts constatés, et nous modifions nos règles quand la réglementation ou un client l’exige.' },
    { n: 4, text: 'Nos règles d’usage de l’IA valent pour tous nos outils, y compris ceux qu’une équipe a adoptés de son côté.' },
    { n: 5, text: 'Nous suivons les textes en préparation sur l’IA et adaptons nos règles avant qu’ils n’entrent en vigueur.' }
  ],

  // A12 — IA responsable (exigé au palier 2)
  // registre : Responsabilité · niveau 4 rendu par « les mêmes principes à chaque nouvel usage, y compris ceux qu’un fournisseur livre déjà configurés »
  A12: [
    { n: 1, text: 'Nous n’avons pas encore dit ce que nous nous interdisons de faire avec l’IA.' },
    { n: 2, text: 'Nous avons écrit nos principes d’usage de l’IA — données personnelles, transparence, équité — et nous les avons fait connaître à nos équipes.' },
    { n: 3, text: 'Nous examinons les cas où l’IA a mal traité un client ou un collaborateur, et ces cas nous font resserrer nos principes.' },
    { n: 4, text: 'Nous appliquons ces principes à chaque nouvel usage de l’IA, y compris ceux qu’un fournisseur nous livre déjà configurés.' },
    { n: 5, text: 'Nous révisons nos principes d’usage à mesure que l’IA et les attentes de la société évoluent, avant qu’un incident ne nous y oblige.' }
  ],

  // ──────────────────────────────────────────────────────────────────────
  // Bloc B3 · Business
  // ──────────────────────────────────────────────────────────────────────

  // D31 · Innovation, Mesure et Analyse

  // A13 — Expérimentation (exigé au palier 1)
  // registre : Ressources · niveau 4 rendu par « le même dispositif d’essai monté d’un cas d’usage au suivant »
  A13: [
    { n: 1, text: 'Quand quelqu’un essaie un outil d’IA, il le fait sur son temps et avec ses moyens, sans que nous l’ayons prévu.' },
    { n: 2, text: 'Nous réservons du temps et un environnement de test à nos essais d’IA, avec un cas d’usage et un délai fixés d’avance.' },
    { n: 3, text: 'Nous clôturons chaque essai par un constat chiffré, et ce constat décide si nous engageons la suite ou si nous arrêtons.' },
    { n: 4, text: 'Nous montons nos essais suivants avec le même dispositif que le premier, même cadre et mêmes critères, sans le réinventer.' },
    { n: 5, text: 'Nous entretenons une capacité d’essai permanente, pour éprouver rapidement une technologie d’IA que nous n’utilisons pas encore.' }
  ],

  // A14 — Innovation des processus métier (exigé au palier 3)
  // registre : Planification · niveau 4 rendu par « la refonte du premier processus servant de modèle aux suivantes »
  A14: [
    { n: 1, text: 'Nous ajoutons l’IA à nos façons de travailler actuelles, sans avoir examiné les processus qu’elle permettrait de faire autrement.' },
    { n: 2, text: 'Nous avons dressé la liste des processus que l’IA pourrait améliorer et nous les avons classés par gain attendu.' },
    { n: 3, text: 'Nous mesurons le délai et le coût de nos processus avant et après refonte, et ce résultat nous dit lequel refondre ensuite.' },
    { n: 4, text: 'La façon dont nous avons repensé le premier processus, avec son repli et ses exceptions, nous sert de modèle pour les suivants.' },
    { n: 5, text: 'Nous repensons nos processus en visant le fonctionnement que nous voulons dans quelques années, pas le gain immédiat sur une étape.' }
  ],

  // A15 — Automatisation à supervision humaine (exigé au palier 3)
  // registre : Responsabilité · niveau 4 rendu par « la règle de validation d’un premier usage valant pour tout nouvel usage »
  A15: [
    { n: 1, text: 'Nous n’avons pas dit qui répond d’une décision quand l’IA en a préparé le résultat.' },
    { n: 2, text: 'Pour chaque usage de l’IA, nous avons nommé la personne qui valide le résultat avant qu’il ne produise un effet.' },
    { n: 3, text: 'Nous relevons les cas où cette personne a corrigé l’IA, et ces corrections nous font resserrer ou alléger la validation.' },
    { n: 4, text: 'La règle de validation que nous avons posée sur un premier usage vaut pour les suivants, y compris ceux qu’un outil automatise seul.' },
    { n: 5, text: 'Nous fixons à l’avance les décisions que nous ne confierons jamais à l’IA, quelles que soient ses performances à venir.' }
  ],

  // A16 — Mesure et analyse (exigé au palier 3)
  // registre : Planification · niveau 4 rendu par « les mêmes indicateurs sur chaque usage, ce qui les rend comparables entre eux »
  A16: [
    { n: 1, text: 'Nous ne savons pas ce que l’IA nous a effectivement rapporté : nous ne l’avons pas mesuré.' },
    { n: 2, text: 'Nous avons choisi quelques indicateurs pour nos usages de l’IA, temps gagné, volume traité ou erreurs, et nous les relevons.' },
    { n: 3, text: 'Nous confrontons ces relevés à ce que nous attendions et nous réorientons nos usages de l’IA quand l’écart persiste.' },
    { n: 4, text: 'Nous mesurons chaque usage de l’IA avec les mêmes indicateurs, ce qui nous permet de les comparer entre eux.' },
    { n: 5, text: 'Nous suivons aussi ce qui annonce un décrochage, dérive des résultats ou désaffection des utilisateurs, pour agir avant que la performance ne baisse.' }
  ],

  // D32 · Gouvernance des données

  // A17 — Gestion du cycle de vie des données (exigé au palier 2)
  // registre : Responsabilité · niveau 4 rendu par « la même traçabilité d’un jeu de données au suivant »
  A17: [
    { n: 1, text: 'Nos données servent aux outils d’IA sans que nous ayons désigné qui répond de leur origine et de leur usage.' },
    { n: 2, text: 'Nous avons nommé, pour chaque source de données que l’IA utilise, la personne qui en répond et qui autorise les accès.' },
    { n: 3, text: 'Nous vérifions à intervalle fixe qui accède à quelles données, et ce constat nous fait retirer les accès devenus inutiles.' },
    { n: 4, text: 'Nous traçons l’origine et les usages de chaque jeu de données de la même façon, d’un cas d’usage au suivant.' },
    { n: 5, text: 'Nous décidons dès la collecte ce que nous conserverons et ce que nous supprimerons, au regard des usages que nous prévoyons.' }
  ],

  // A18 — Assurance qualité des données (exigé au palier 2)
  // registre : Planification · niveau 4 rendu par « les mêmes règles de préparation d’un jeu de données au suivant »
  A18: [
    { n: 1, text: 'Nous donnons à l’IA nos données telles qu’elles sont, sans avoir dit ce qu’elles doivent valoir pour rester exploitables.' },
    { n: 2, text: 'Nous avons fixé ce qu’une donnée doit valoir pour servir à l’IA, et nous préparons nos fichiers avant de les lui donner.' },
    { n: 3, text: 'Nous constatons les erreurs que nos données provoquent dans les résultats de l’IA, et nous remontons corriger la source.' },
    { n: 4, text: 'Nous préparons chaque nouveau jeu de données selon les mêmes règles, quel que soit l’usage qu’il servira.' },
    { n: 5, text: 'Nous constituons dès maintenant les données que nos usages futurs de l’IA exigeront, plutôt que de les reconstituer au moment du projet.' }
  ],

  // ──────────────────────────────────────────────────────────────────────
  // Bloc B4 · Technology
  // ──────────────────────────────────────────────────────────────────────

  // D41 · Architecture et Intégration des technologies IA

  // A19 — Architecture IA (exigé au palier 2)
  // registre : Ressources · niveau 4 rendu par « les mêmes interfaces de raccordement d’une solution à la suivante »
  A19: [
    { n: 1, text: 'Chaque outil d’IA que nous ajoutons vient avec sa propre technique, sans que nous ayons arrêté de règles communes de raccordement.' },
    { n: 2, text: 'Nous avons arrêté la liste des briques techniques admises pour l’IA et la manière dont elles se raccordent à nos logiciels.' },
    { n: 3, text: 'Nous relevons ce que ces raccordements coûtent et supportent réellement, et nous remplaçons les briques qui ne tiennent pas.' },
    { n: 4, text: 'Toute nouvelle solution d’IA se raccorde par les mêmes interfaces que la précédente, sans montage particulier à chaque fois.' },
    { n: 5, text: 'Nous choisissons nos briques techniques en tenant compte des volumes et des usages que nous prévoyons, pas seulement de ceux d’aujourd’hui.' }
  ],

  // A20 — Tests et évaluation (exigé au palier 2)
  // registre : Planification · niveau 4 rendu par « la même série de cas d’épreuve quel que soit le fournisseur »
  A20: [
    { n: 1, text: 'Nous mettons les outils d’IA en service sans les avoir éprouvés autrement qu’en les utilisant.' },
    { n: 2, text: 'Avant de mettre un outil d’IA en service, nous le faisons essayer sur des cas réels par ceux qui s’en serviront.' },
    { n: 3, text: 'Nous gardons une série de cas de référence et nous les rejouons à chaque évolution, ce qui nous dit si la qualité tient.' },
    { n: 4, text: 'Nous éprouvons chaque nouvel outil d’IA avec la même série de cas, quel que soit le fournisseur qui le livre.' },
    { n: 5, text: 'Nous éprouvons aussi ce qui n’a pas encore mal tourné, réponse fausse ou dérive lente, pour ne pas le découvrir en production.' }
  ],

  // A21 — Intégration aux systèmes existants (exigé au palier 3)
  // registre : Ressources · niveau 4 rendu par « le même chemin de branchement d’un outil au suivant »
  A21: [
    { n: 1, text: 'Nos outils d’IA fonctionnent à côté de nos logiciels métier : nous recopions les informations d’un système à l’autre.' },
    { n: 2, text: 'Nous avons relié nos outils d’IA à nos logiciels métier et nous entretenons ces liaisons comme le reste de notre informatique.' },
    { n: 3, text: 'Nous relevons les ruptures et les ressaisies que ces liaisons laissent subsister, et nous les corrigeons par ordre de gêne.' },
    { n: 4, text: 'Un nouvel outil d’IA se branche sur nos systèmes par le même chemin que le précédent, sans que nous refassions l’intégration.' },
    { n: 5, text: 'Nous retirons les systèmes anciens qui bloqueraient nos usages d’IA à venir, avant qu’ils ne nous en empêchent.' }
  ],

  // A22 — Transparence et explicabilité (exigé au palier 3)
  // registre : Responsabilité · niveau 4 rendu par « la même explication pour tout résultat transmis, le nôtre comme celui d’un fournisseur »
  A22: [
    { n: 1, text: 'Nous utilisons les résultats de l’IA sans pouvoir dire à un client ni à un collaborateur d’où ils viennent.' },
    { n: 2, text: 'Nous savons dire, pour chaque usage de l’IA, sur quoi elle s’appuie et ce que nous en gardons comme trace.' },
    { n: 3, text: 'Nous demandons à ceux qui s’en servent si l’explication leur suffit, et nous la reprenons quand elle ne suffit pas.' },
    { n: 4, text: 'Nous expliquons de la même façon tout résultat d’IA que nous transmettons, qu’il vienne de notre outil ou de celui d’un fournisseur.' },
    { n: 5, text: 'Nous conservons de quoi expliquer les décisions où l’IA est intervenue, aussi longtemps qu’un client ou un contrôle pourra les questionner.' }
  ],

  // D42 · Production et Gestion de modèles (MLOPS)

  // A23 — Gestion des modèles IA (exigé au palier 2)
  // registre : Planification · niveau 4 rendu par « la même vérification à chaque changement de modèle, le nôtre comme celui du fournisseur »
  A23: [
    { n: 1, text: 'Nous ne savons pas quelle version des modèles d’IA nos outils utilisent aujourd’hui.' },
    { n: 2, text: 'Nous tenons la liste des modèles d’IA que nous utilisons, avec leur version et l’usage auquel chacun sert.' },
    { n: 3, text: 'Nous comparons les résultats après chaque changement de version et nous revenons en arrière quand la qualité baisse.' },
    { n: 4, text: 'Nous faisons passer tout changement de modèle par la même vérification, qu’il vienne de nous ou d’une mise à jour du fournisseur.' },
    { n: 5, text: 'Nous prévoyons dès la mise en service comment nous remplacerons un modèle, pour que son retrait ne nous arrête pas.' }
  ],

  // A24 — Sécurité des modèles et agents IA (exigé au palier 2)
  // registre : Responsabilité · niveau 4 rendu par « les mêmes règles d’accès pour tout nouvel outil déployé, y compris ceux qui agissent seuls »
  A24: [
    { n: 1, text: 'Nous n’avons pas réglé qui peut donner quelles informations à un outil d’IA.' },
    { n: 2, text: 'Nous avons fixé les droits de chacun sur nos outils d’IA et ce que nous autorisons à y déposer comme informations.' },
    { n: 3, text: 'Nous regardons ce que ces outils ont réellement fait et consulté, et nous resserrons les droits qui vont au-delà du nécessaire.' },
    { n: 4, text: 'Ces mêmes règles d’accès valent pour tout nouvel outil d’IA que nous déployons, y compris ceux qui agissent sans nous.' },
    { n: 5, text: 'Nous encadrons dès maintenant ce qu’un outil d’IA pourra faire seul, avant de lui confier des tâches qui engagent l’entreprise.' }
  ],

  // A25 — Suivi (exigé au palier 3)
  // registre : Planification · niveau 4 rendu par « le même suivi du premier outil mis en production au dernier »
  A25: [
    { n: 1, text: 'Une fois en service, nos outils d’IA tournent sans que nous regardions comment ils se comportent.' },
    { n: 2, text: 'Nous avons prévu qui regarde le fonctionnement de nos outils d’IA, à quelle fréquence et sur quels points.' },
    { n: 3, text: 'Ce que ce suivi remonte, baisse de qualité, plainte ou incident, déclenche une correction et non une simple note.' },
    { n: 4, text: 'Nous suivons chaque outil d’IA déployé de la même manière, du premier mis en production au dernier.' },
    { n: 5, text: 'Nous savons d’avance ce que nous ferons si un outil d’IA tombe ou dérive, et qui prend le relais entre-temps.' }
  ],

  // D43 · Infrastructure technologique ICT

  // A26 — Infrastructure technologique (exigé au palier 2)
  // registre : Ressources · niveau 4 rendu par « les mêmes moyens à disposition quel que soit le projet porté »
  A26: [
    { n: 1, text: 'Nous faisons tourner l’IA sur les moyens informatiques déjà en place, sans avoir vérifié qu’ils y suffisent.' },
    { n: 2, text: 'Nous avons inscrit au budget les moyens que l’IA demande, puissance, stockage et abonnements, et nous les avons mis en place.' },
    { n: 3, text: 'Nous suivons ce que ces moyens coûtent et supportent, et nous les ajustons à la hausse comme à la baisse.' },
    { n: 4, text: 'Nos équipes disposent des mêmes moyens pour éprouver et faire tourner l’IA, quel que soit le projet qu’elles portent.' },
    { n: 5, text: 'Nous fixons à l’avance quand renouveler nos moyens informatiques, plutôt que d’attendre qu’un outil d’IA ne fonctionne plus.' }
  ],

  // A27 — Gestion de la chaîne d'approvisionnement (exigé au palier 3)
  // registre : Planification · niveau 4 rendu par « tout nouveau fournisseur inscrit à l’inventaire au même titre que les autres »
  A27: [
    { n: 1, text: 'Nous ne savons pas précisément de quels fournisseurs nos usages de l’IA dépendent.' },
    { n: 2, text: 'Nous tenons l’inventaire des fournisseurs dont dépendent nos usages de l’IA, avec ce que chacun héberge et traite.' },
    { n: 3, text: 'Nous mettons cet inventaire à jour à date fixe et nous relançons les fournisseurs dont les engagements ne tiennent plus.' },
    { n: 4, text: 'Nous inscrivons à cet inventaire tout nouveau fournisseur d’IA au même titre que les autres, y compris ses propres sous-traitants.' },
    { n: 5, text: 'Nous avons prévu, pour nos fournisseurs les plus critiques, comment continuer sans eux et ce que cela nous demanderait.' }
  ],

  // A28 — Déploiement à l'échelle (exigé au palier 4)
  // registre : Ressources · niveau 4 rendu par « la même méthode et les mêmes moyens d’une extension à la suivante »
  A28: [
    { n: 1, text: 'Nos usages de l’IA restent là où ils sont nés, sans que nous ayons prévu les moyens de les étendre.' },
    { n: 2, text: 'Nous avons chiffré les moyens, postes, licences et accompagnement, que demanderait la généralisation d’un usage aujourd’hui limité.' },
    { n: 3, text: 'Nous constatons ce que l’extension d’un usage coûte et rapporte réellement, et ce constat décide de l’extension suivante.' },
    { n: 4, text: 'Nous étendons chaque usage d’IA avec la même méthode et les mêmes moyens que le précédent, sans repartir de zéro.' },
    { n: 5, text: 'Nous dimensionnons nos moyens pour l’usage que nous visons dans quelques années, et nous retirons au passage les outils redondants.' }
  ]
}

// Indicateurs de maturité — AI Adoption Maturity Model v1.0, §5 « Maturity
// Indicators » (p. 82-83).
//
// La source pose trois indicateurs transversaux — Accountability, Planning,
// Resourcing — et, pour chacun, cinq énoncés qui disent ce qu'un niveau de
// maturité attend, quelle que soit l'area de compétence. C'est cette grille qui
// fournit la sémantique de niveau du modèle (voir docs/DECISIONS.md, entrée du
// 30.07.2026) ; elle est donc rédigée une seule fois et posée telle quelle sur
// chaque area évaluable du questionnaire.
//
// Trois écarts assumés par rapport à la source :
//   — les énoncés sont raccourcis. La grille d'origine est un texte de
//     référentiel ; ici elle est répondue à l'écran, entre deux objectifs, et
//     doit se lire d'un coup d'œil. Le registre suit celui du reste du modèle
//     (France Num : français professionnel de CoDir, KPI et ROI conservés) ;
//   — le nom du niveau n'est pas affiché. On demande laquelle des cinq
//     situations décrit l'organisation, pas de se situer sur une échelle : le
//     rang se déduit, il ne se choisit pas. Il reste porté par `n`, pour que la
//     réponse redevienne un niveau le jour où elle entrera dans le calcul ;
//   — `organizational unit sub-components` est rendu par « les services », dans
//     la même logique que le reste du modèle, où l'unité organisationnelle est
//     rendue par « l'entreprise » : dans une PME, la sous-unité est le service.
//     Ce raccourci de traduction ne dit pas que l'organisation évaluée et
//     l'entreprise se confondent — elles ne se confondent pas, et l'outil repose
//     sur leur distinction, qu'il porte une fois en la nommant en tête de la
//     restitution (voir domain/scope.js) plutôt qu'à chaque énoncé.
//
// Ce fichier ne porte que du contenu. La réponse est collectée et persistée,
// mais n'entre dans aucun calcul : domain/scoring.js l'ignore entièrement.

// La réponse par défaut, tenue pour acquise tant qu'aucun rang n'est cliqué.
// Le premier énoncé de chaque indicateur est celui de l'absence — rien
// d'assigné, rien de planifié, rien d'alloué de façon régulière : c'est la
// situation d'une organisation qui ne s'est pas encore prononcée, et la retenir
// d'avance épargne un clic à qui n'a rien à déclarer. Elle n'est pas écrite
// dans la session pour autant : ne rien stocker et lire ce rang à défaut donne
// le même résultat sans que la session porte 84 réponses que personne n'a
// données.
export const DEFAULT_INDICATOR_RANK = 1

export const MATURITY_INDICATORS = [
  {
    id: 'accountability',
    name: 'Responsabilité',
    // Abréviation de deux lettres. Elle coiffait les sous-colonnes du détail
    // par domaine, où le nom entier tenait trois fois la largeur du rang qu'il
    // annonçait ; ces colonnes ont été retirées et plus rien ne l'affiche
    // aujourd'hui. Elle reste ici parce qu'elle décrit l'indicateur, pas la vue
    // qui s'en servait — la restitution la retrouvera si elle en a besoin.
    short: 'Re',
    // La définition de l'indicateur, telle que la source l'introduit : de quoi
    // parle-t-on quand on demande de choisir un énoncé.
    desc: 'Qui, dans l’entreprise, répond de ce domaine et fait progresser ses processus.',
    statements: [
      { n: 1, text: 'Personne n’en porte formellement la responsabilité.' },
      { n: 2, text: 'Des rôles sont désignés pour atteindre les critères du domaine.' },
      { n: 3, text: 'Des objectifs et des indicateurs (KPI, ROI) sont définis et rapportés à la direction.' },
      { n: 4, text: 'Les processus sont mesurés et pilotés de la même façon dans tous les services.' },
      { n: 5, text: 'Les améliorations des processus sont choisies et menées selon la stratégie long terme.' }
    ]
  },
  {
    id: 'planning',
    name: 'Planification',
    short: 'Pl',
    desc: 'Les plans et les règles qui rendent l’atteinte des critères constante et prévisible.',
    statements: [
      { n: 1, text: 'Rien n’est planifié de façon régulière.' },
      { n: 2, text: 'Un plan existe pour atteindre les critères et nomme les parties prenantes.' },
      { n: 3, text: 'Le plan est actualisé périodiquement au vu des résultats mesurés.' },
      { n: 4, text: 'Les plans et politiques définissent des processus communs, que chaque service adapte.' },
      { n: 5, text: 'La planification anticipe les évolutions possibles : réglementaires, sociétales, technologiques.' }
    ]
  },
  {
    id: 'resourcing',
    name: 'Ressources',
    short: 'Rs',
    desc: 'Les moyens — personnes, budget, technologie — mis à disposition pour faire tourner les processus.',
    statements: [
      { n: 1, text: 'Les moyens sont alloués au coup par coup.' },
      { n: 2, text: 'Le processus budgétaire alloue des moyens suffisants au domaine.' },
      { n: 3, text: 'Les moyens sont alloués au vu de la performance mesurée.' },
      { n: 4, text: 'Les moyens sont alloués et gérés de la même façon dans tous les services.' },
      { n: 5, text: 'Les moyens servent la stratégie long terme, quels que soient les scénarios d’avenir.' }
    ]
  }
]

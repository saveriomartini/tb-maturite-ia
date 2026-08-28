// Texte du parcours utilisateur en quatre phases (Cadrage, Évaluation,
// Résultats, Ancrage) : étapes, points de friction et opportunités.
// Contenu rédactionnel, au même titre que model-data.json — aucune logique.
//
// L'Ancrage était affiché grisé comme hors périmètre, puis retiré : annoncer sur
// chaque écran ce que l'outil ne fait pas est un aveu de conception. Il revient
// parce qu'il a un contenu — la portée visée, le niveau cible qui en découle,
// l'écart, et la pièce à emporter. Il s'arrête là : préparer l'ancrage, pas le
// conduire. Ce que l'organisation fera ensuite ne se joue pas dans un outil de
// diagnostic.
//
// Le degré de transformation visé n'est plus une question de cadrage : il se
// déduit de la portée déclarée à l'ancrage, une fois les énoncés lus. Les textes
// de l'Évaluation ne parlent plus de valider des pratiques une par une — l'unité
// de réponse est le domaine, et la réponse est un énoncé parmi cinq.

export const JOURNEY = [
  {
    n: '1',
    name: 'Cadrage',
    steps: [
      'vous décrivez votre organisation en quelques attributs',
      'l’outil retient ce que votre contexte peut porter'
    ],
    frictions: [
      'décrire son organisation avant d’avoir commencé peut sembler fastidieux',
      'difficulté à percevoir la vue d’ensemble et les détails en même temps'
    ],
    opps: [
      'aucun attribut n’est obligatoire : ce que vous ne dites pas ne vous retire rien',
      's’approprier un vocabulaire commun sur l’adoption de l’IA'
    ]
  },
  {
    n: '2',
    name: 'Évaluation',
    steps: [
      'pour chaque domaine de capacité, vous retenez l’énoncé qui décrit votre situation',
      'un domaine qui ne vous concerne pas se déclare hors périmètre'
    ],
    frictions: [
      'trancher entre deux énoncés voisins demande parfois de vérifier auprès d’un collègue'
    ],
    opps: [
      'un choix par domaine : 28 réponses tiennent dans une séance',
      'les énoncés décrivent des situations concrètes, pas des niveaux à s’attribuer'
    ]
  },
  {
    n: '3',
    name: 'Résultats',
    steps: [
      'vous situez votre organisation sur l’échelle des profils d’adoption',
      'vous lisez, domaine par domaine, ce que vos réponses donnent'
    ],
    frictions: ['frustration de voir un palier retenu par un seul domaine'],
    opps: [
      'la règle est explicite : aucun palier ne se compense',
      'le détail par dimension montre où l’écart se concentre'
    ]
  },
  {
    n: '4',
    name: 'Ancrage',
    steps: [
      'vous déclarez jusqu’où l’adoption de l’IA doit avoir porté',
      'vous emportez les domaines qui vous en séparent, prêts à exporter'
    ],
    frictions: [
      'la portée visée engage : elle se déclare après l’évaluation, pas avant'
    ],
    opps: [
      'l’écart est nommé domaine par domaine, avec l’énoncé à atteindre',
      'la pièce exportée dit sur quoi elle porte et ce qu’elle laisse de côté'
    ]
  }
]

// Échelle de transformation de Venkatraman (1994) — couche ajoutée hors AIMM.
//
// Ozkaya et al. (2026) nomment cinq niveaux de maturité d'adoption ; ils ne
// disent pas ce qui sépare *qualitativement* un niveau du suivant. Venkatraman
// le dit, sur une autre échelle et pour une autre technologie : ses cinq degrés
// de transformation induite par les systèmes d'information se recouvrent terme
// à terme avec ceux d'Ozkaya, et leur frontière évolutif / révolutionnaire tombe
// exactement entre Implemented et Aligned — c'est la fusion sur laquelle repose
// le nommage français des profils (docs/DECISIONS.md, entrée du 15.08.2026).
//
// Ce que Venkatraman apporte et qui manque au modèle seul : les deux premiers
// degrés posent la technologie sur des routines qui ne changent pas, et le
// bénéfice y reste borné par ces routines ; les trois suivants supposent de
// refaire les routines elles-mêmes. Le passage du second au troisième n'est donc
// pas un cran de plus sur une échelle continue — c'est le seul de la série qui
// change de nature, et la restitution n'a pas le droit de le présenter comme les
// autres.
//
// Le PDF de l'AIMM ne cite Venkatraman nulle part : le rapprochement est une
// lecture propre à ce travail, et ce fichier la tient à l'écart de
// model-data.json, qui reste le report littéral de la source — même règle que
// pour preparation.js.

// Le nom de Venkatraman ne sort d'aucune des chaînes de ce fichier. L'experte
// métier a demandé « qui est Venkatraman ? » devant un écran de restitution :
// une source citée en pleine phrase à un dirigeant ne l'aide pas, elle
// l'arrête. L'attribution le nomme, l'écran d'information le nomme et le
// rapport le nomme ; la prose du parcours dit « l'échelle de transformation »
// et « la ligne entre degrés évolutifs et révolutionnaires », qui se
// comprennent sans référence. Les commentaires, eux, gardent la source : c'est
// ici que la traçabilité se lit, pas à l'écran.

// Rang à partir duquel on est au-dessus de la ligne. Il ne se déduit d'aucun
// calcul : c'est la frontière que Venkatraman trace dans sa figure, reportée sur
// l'échelle du modèle.
export const REVOLUTIONARY_FROM = 3

// Un degré par profil du modèle. `reach` dit ce que la transformation touche à
// ce degré — il sert à finir la phrase du passage, quand l'écart se joue déjà
// au-dessus de la ligne et que la question n'est plus la nature mais la portée.
export const TRANSFORMATION_DEGREES = [
  {
    n: 1,
    name: 'Exploitation localisée',
    reach: 'une fonction isolée',
    position:
      'Sur l’échelle de transformation, ce profil correspond à ' +
      'l’exploitation localisée : l’IA est essayée là où elle tombe bien, sans que rien ' +
      'change autour d’elle. C’est le premier des deux degrés dits évolutifs — le ' +
      'bénéfice y reste borné par des façons de travailler qu’on n’a pas touchées, et ' +
      'c’est le propos même du niveau : apprendre où l’IA mérite d’être appliquée avant ' +
      'd’engager quoi que ce soit.'
  },
  {
    n: 2,
    name: 'Intégration interne',
    reach: 'les processus internes existants',
    position:
      'Sur l’échelle de transformation, ce profil correspond à l’intégration interne : l’IA ' +
      'franchit les cloisons entre fonctions et s’installe dans les processus existants, ' +
      'sans les redessiner. C’est le second et dernier degré évolutif, celui où ' +
      'l’entreprise tire tout ce qui peut l’être de l’IA sans changer sa façon de ' +
      'travailler. Au-delà, le bénéfice cesse de progresser par ajout.'
  },
  {
    n: 3,
    name: 'Réingénierie des processus',
    reach: 'la façon même dont le travail est organisé',
    position:
      'Sur l’échelle de transformation, ce profil correspond à la réingénierie des ' +
      'processus, premier des trois degrés dits révolutionnaires : les processus ne ' +
      'reçoivent plus l’IA, ils sont refaits autour d’elle. C’est le seuil où l’éventail ' +
      'des bénéfices s’ouvre, précisément parce que c’est le premier où la façon de ' +
      'travailler change.'
  },
  {
    n: 4,
    name: 'Réingénierie du réseau d’affaires',
    reach: 'le réseau de partenaires, de fournisseurs et de clients',
    position:
      'Sur l’échelle de transformation, ce profil correspond à la réingénierie du réseau ' +
      'd’affaires : la transformation ne s’arrête plus aux murs de l’entreprise, elle ' +
      'porte sur ses relations avec ses partenaires, ses fournisseurs et ses clients. Le ' +
      'degré de transformation est engagé ; ce qui augmente désormais, c’est sa portée.'
  },
  {
    n: 5,
    name: 'Redéfinition du périmètre d’activité',
    reach: 'le périmètre d’activité lui-même',
    position:
      'Sur l’échelle de transformation, ce profil correspond à la redéfinition du périmètre ' +
      'd’activité, son degré le plus haut : ce n’est plus la façon de faire qui change, ' +
      'c’est ce que l’entreprise fait. À ce point, revenir aux anciennes façons de ' +
      'travailler ne serait plus un renoncement mais un risque d’existence.'
  }
]

// La nature du passage, selon la position de l'écart par rapport à la ligne.
// Trois cas, et un quatrième pour l'absence d'écart — qui n'est pas un manque de
// texte mais une position à commenter, le modèle tenant explicitement qu'aucune
// organisation n'a vocation à monter jusqu'en haut.
//
// `{reach}` est remplacé par la portée du profil visé : ce n'est qu'au-dessus de
// la ligne que la question devient « jusqu'où », et la phrase ne se termine donc
// que dans ce cas-là. Le jeton est placé après un verbe, jamais après « à » ou
// « de » : les portées commencent par leur article et « jusqu'à le réseau »
// n'aurait pas de correction possible depuis le point d'insertion.
export const PASSAGES = {
  evolutionary:
    'Ce passage reste sous la ligne qui sépare les degrés évolutifs des degrés ' +
    'révolutionnaires : il ne demande pas de redessiner vos processus, mais de rendre ' +
    'fiable, mesuré et gouverné ce qui s’y fait déjà. Le bénéfice qu’il ouvre reste borné ' +
    'par des routines inchangées — c’est la contrepartie assumée d’un profil qui coûte ' +
    'peu à tenir, et non un défaut du diagnostic.',

  crossing:
    'Ce passage franchit la ligne qui sépare les degrés évolutifs des degrés ' +
    'révolutionnaires, et c’est le seul de l’échelle qui change de nature. Jusqu’ici, ' +
    'l’IA se posait sur des processus qui restaient les mêmes ; au-delà, ce sont les ' +
    'processus eux-mêmes qu’il faut reprendre. Aucune quantité d’IA ajoutée à des façons ' +
    'de faire inchangées ne fait franchir ce seuil : tant que la routine ne bouge pas, le ' +
    'bénéfice reste borné. Ce n’est pas un effort de plus, c’est un effort d’une autre ' +
    'nature — et il se décide avant de se planifier.',

  revolutionary:
    'Ce passage se joue au-dessus de la ligne évolutif / révolutionnaire : vos processus ' +
    'sont déjà refaits autour de l’IA, et la question n’est plus de savoir s’il faut les ' +
    'reprendre mais jusqu’où la transformation porte. Au degré visé, elle atteint {reach}.',

  reached:
    'Vous êtes au degré de transformation que vous visiez. Le modèle n’est pas une échelle ' +
    'de conformité et ses auteurs le disent : le meilleur profil n’est pas le plus haut, ' +
    'c’est celui qui aligne les capacités IA sur les objectifs, l’appétit au risque et les ' +
    'moyens de l’organisation. Certaines s’arrêtent délibérément plus bas, parce que le ' +
    'degré suivant leur coûterait plus qu’il ne leur rendrait. Monter encore se décide ; ' +
    'ce n’est pas une étape obligée.'
}

// — question de portée, posée en phase d'ancrage —
//
// Le degré de transformation visé se demandait au cadrage, avant d'avoir rien
// évalué, et sous la forme des cinq profils du modèle. Deux défauts, et le
// second est le plus grave :
//   — au cadrage, l'organisation n'a pas encore lu un seul énoncé : elle
//     répond sur un vocabulaire qu'elle découvre. La question est donc reportée
//     à l'ancrage, après l'évaluation, quand les mots du modèle ont un sens ;
//   — surtout, la question portait sur le palier lui-même. Un utilisateur qui
//     désigne « Alignement des processus » s'entend répondre qu'il vise
//     l'alignement des processus : la restitution lui renvoie la cible qu'il
//     vient de nommer, et l'outil ne lui apprend rien. La question porte donc
//     sur la **portée visée** — ce que la transformation doit toucher —, jamais
//     sur le degré ni sur le rang. Le degré s'en déduit, il ne se choisit pas.
//
// Les options reprennent les `reach` des cinq degrés ci-dessus, tournées en
// situations souhaitées : chacune se comprend sans rien connaître du modèle, ni
// de l'échelle dont elle est tirée. Elles sont cumulatives — une portée contient
// les précédentes —, ce que le `hint` dit plutôt que chaque libellé.
//
// `n` est le degré correspondant : c'est lui qui fixe l'intention, à croiser
// ensuite avec la recommandation issue du contexte (voir docs/NIVEAU-CIBLE.md,
// § 0). L'écran qui pose la question viendra plus tard ; ce fichier n'en porte
// que le contenu.
export const REACH_QUESTION = {
  id: 'reach',
  question: 'Si l’adoption de l’IA réussit chez vous, jusqu’où doit-elle avoir porté ?',
  hint:
    'Décrivez la situation que vous souhaitez atteindre, non celle d’aujourd’hui. ' +
    'Chaque situation suppose les précédentes : la dernière retenue vaut pour toutes ' +
    'celles qui la précèdent.',
  options: [
    {
      n: 1,
      label: 'Une fonction s’en trouve outillée',
      detail:
        'L’IA sert dans une activité précise — un service, un poste, une tâche — et le ' +
        'reste de l’entreprise continue de travailler comme avant.'
    },
    {
      n: 2,
      label: 'Nos processus internes s’en trouvent équipés',
      detail:
        'L’IA est présente dans les processus qui font tourner l’entreprise, d’un service ' +
        'à l’autre. Ces processus restent ceux d’aujourd’hui : l’IA s’y ajoute, elle ne ' +
        'les redessine pas.'
    },
    {
      n: 3,
      label: 'Notre façon de travailler est revue',
      detail:
        'Les processus sont repensés autour de ce que l’IA permet, et non l’inverse. ' +
        'Certaines étapes disparaissent, d’autres changent de main : c’est l’organisation ' +
        'du travail elle-même qui bouge.'
    },
    {
      n: 4,
      label: 'Nos relations d’affaires sont revues',
      detail:
        'La transformation dépasse les murs de l’entreprise : ce qui change touche la ' +
        'façon de travailler avec les fournisseurs, les donneurs d’ordre et les clients ' +
        '— échanges, délais, engagements réciproques.'
    },
    {
      n: 5,
      label: 'Notre activité elle-même est redéfinie',
      detail:
        'Ce n’est plus la façon de faire qui change, c’est ce que l’entreprise fait : ' +
        'l’IA ouvre des prestations, des marchés ou un métier qui n’étaient pas les siens.'
    }
  ]
}

export function transformationDegree(n) {
  return TRANSFORMATION_DEGREES.find(degree => degree.n === n) || null
}

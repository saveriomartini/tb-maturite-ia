// Contenu rédactionnel du bloc « Emporter », au même titre que journey.js ou
// in-progress.js : aucune logique, rien qui se calcule.
//
// Le bloc réunit les trois sorties de la phase d'ancrage — la feuille à
// imprimer, les deux fichiers de réponses, la reprise d'une session — là où
// jusqu'ici un seul bouton « Export » les représentait toutes par la première.
//
// Ce qu'il dit avant de proposer quoi que ce soit : rien ne part tout seul. La
// phrase n'est pas une précaution d'usage, c'est la propriété que le chapitre 5
// revendique face au corpus d'outils examiné, et l'écran est le seul endroit où
// l'utilisateur peut la constater au moment où elle compte.

export const TAKE_AWAY = {
  title: 'Emporter',
  lead: 'Ce qui sort de l’outil sort par vous. Il n’y a ni compte, ni envoi, ni destinataire : ' +
    'les fichiers sont écrits sur votre poste, et vous seul décidez ensuite ce que vous en faites.',

  preview: {
    title: 'La feuille à imprimer',
    note: 'Les domaines de capacité qui vous séparent du profil visé, avec l’énoncé à atteindre ' +
      'pour chacun, au format A4.',
    action: 'Ouvrir l’aperçu'
  },

  files: {
    title: 'Vos réponses, en deux fichiers',
    note: 'Un fichier de reprise, pour rouvrir cette évaluation plus tard ou sur un autre poste. ' +
      'Un fichier de partage, réduit à ce qui a un sens pour un tiers, si vous voulez transmettre ' +
      'vos réponses à quelqu’un.',
    action: 'Télécharger les deux fichiers',
    again: 'Télécharger à nouveau',
    // Un clic, deux fichiers : le navigateur peut demander l'autorisation
    // d'enregistrer plusieurs fichiers, ou ne prendre que le premier. Les deux
    // liens restent donc affichés après le clic — le repli est dans la page, et
    // non dans un parcours à refaire.
    fallback: 'Les deux fichiers sont ici tant que vous ne quittez pas la page. Si votre ' +
      'navigateur n’en a enregistré qu’un, reprenez l’autre par son lien.'
  },

  contents: {
    summary: 'Ce que contient chaque fichier',
    rows: [
      {
        kind: 'reprise',
        title: 'Fichier de reprise',
        lines: [
          'Les énoncés retenus pour chacun des 28 domaines de capacité, et les domaines déclarés hors périmètre.',
          'Les 15 attributs de cadrage et la portée visée.',
          'L’état de votre parcours dans l’outil : la phase ouverte, les niveaux dépliés, les avertissements déjà lus.',
          'Un identifiant de session tiré au hasard, qui ne désigne personne.'
        ]
      },
      {
        kind: 'partage',
        title: 'Fichier de partage',
        lines: [
          'Les énoncés retenus pour chacun des 28 domaines de capacité, et les domaines déclarés hors périmètre.',
          'Trois attributs seulement : secteur d’activité, taille, territoire.',
          'La portée visée et le profil diagnostiqué qui se déduit de vos réponses.',
          'Ni les douze autres attributs de cadrage, qui décrivent le fonctionnement de votre organisation, ni ce que vous avez fait dans l’outil.'
        ]
      }
    ],
    // La phrase qui ferme le dépliant. Elle tient parce que le questionnaire n'a
    // aucun champ libre : ce n'est pas une promesse, c'est une propriété de la
    // forme des questions.
    note: 'Aucun des deux ne peut contenir de nom, d’adresse ni de texte libre : ' +
      'l’outil ne pose que des questions à réponses fermées.'
  },

  resume: {
    title: 'Reprendre une session',
    note: 'Relisez un fichier produit ici pour retrouver une évaluation. Le fichier remplace ' +
      'la session en cours ; rien n’est écrasé tant que vous n’avez pas confirmé.',
    action: 'Choisir un fichier'
  },

  dialog: {
    eyebrow: 'Ce qui sera remplacé',
    text: 'Les attributs de cadrage, la portée visée et les énoncés retenus pour chaque domaine ' +
      'de capacité seront ceux du fichier.',
    // Un fichier de partage ne porte pas le cadrage : le dire avant de
    // remplacer, et non après, quand douze attributs se seront vidés.
    shareText: 'Ce fichier de partage ne porte pas les douze attributs de cadrage : ils ' +
      'resteront vides, et la suggestion de profil qui s’en déduit avec.',
    actions: [
      { id: 'cancel', label: 'Annuler' },
      { id: 'resume', label: 'Reprendre', arrow: '→' }
    ]
  }
}

// Texte du parcours utilisateur en quatre phases (Cadrage, Diagnostic,
// Restitution, Ancrage) : étapes, points de friction et opportunités.
// Contenu rédactionnel, au même titre que model-data.json — aucune logique.

export const JOURNEY = [
  {
    n: '1',
    name: 'Cadrage',
    steps: [
      'vous comprenez le modèle et validez vos connaissances de base sur l’IA',
      'vous déterminez le périmètre de l’évaluation et le niveau cible'
    ],
    frictions: [
      'manque de temps à consacrer à l’apprentissage',
      'difficulté à percevoir la vue d’ensemble et les détails en même temps',
      'description de son organisation peut être fastidieuse'
    ],
    opps: [
      's’approprier un vocabulaire technique adapté',
      'sélection des critères et objectifs les plus pertinents = clarification, gain de temps et d’adhérence'
    ]
  },
  {
    n: '2',
    name: 'Diagnostic',
    steps: [
      'vous répondez au questionnaire et définissez votre niveau actuel',
      'selon le niveau cible vous êtes soumis seulement aux pratiques et objectifs qui vous concernent'
    ],
    frictions: ['coordination et analyse profonde requise pour valider une pratique'],
    opps: ['choix binaire oui/non pour valider la liste de pratiques d’un objectif = définition claire et objective de son niveau']
  },
  {
    n: '3',
    name: 'Restitution',
    steps: [
      'vous visualisez les résultats, une appréciation qualitative et un score chiffré de votre avancement',
      'vous obtenez une liste des pratiques manquantes (le gap)'
    ],
    frictions: ['frustration de voir un objectif non atteint pour une seule pratique manquante'],
    opps: [
      'adhésion à la règle du niveau le plus bas pour chaque bloc',
      'identification rapide des gaps simplifiée par le regroupement par bloc/thématique'
    ]
  },
  {
    n: '4',
    name: 'Ancrage',
    steps: [
      'vous générez une roadmap actionnable selon vos priorités',
      'vous lancez des projets concrets'
    ],
    frictions: ['difficulté à établir les priorités et allouer les ressources'],
    opps: ['motivation à agir rapidement avec des objectifs clairs']
  }
]

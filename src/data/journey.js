// Texte du parcours utilisateur en trois phases (Cadrage, Évaluation,
// Résultats) : étapes, points de friction et opportunités.
// Contenu rédactionnel, au même titre que model-data.json — aucune logique.
//
// Les définitions ne mentionnent plus de « niveau cible » : le profil visé se
// déduit du contexte et ne s'annonce qu'au palier, une fois la première série
// d'areas parcourue. L'annoncer ici rouvrirait dès le cadrage une décision qu'on
// ne demande plus.

export const JOURNEY = [
  {
    n: '1',
    name: 'Cadrage',
    steps: [
      'vous décrivez votre organisation en quelques attributs',
      'l’outil en déduit les areas de compétence à évaluer en priorité'
    ],
    frictions: [
      'décrire son organisation avant d’avoir commencé peut sembler fastidieux',
      'difficulté à percevoir la vue d’ensemble et les détails en même temps'
    ],
    opps: [
      'la sélection des areas est faite pour vous : rien à trancher soi-même',
      's’approprier un vocabulaire commun sur l’adoption de l’IA'
    ]
  },
  {
    n: '2',
    name: 'Évaluation',
    steps: [
      'vous validez, area par area, les pratiques déjà en place',
      'seules les pratiques que votre situation appelle vous sont présentées'
    ],
    frictions: ['valider une pratique demande parfois de vérifier auprès d’un collègue'],
    opps: ['choix binaire oui / non : une définition claire et objective de ce qui est acquis']
  },
  {
    n: '3',
    name: 'Résultats',
    steps: [
      'vous situez votre organisation sur l’échelle des profils d’adoption',
      'vous obtenez la liste des pratiques manquantes, prête à exporter'
    ],
    frictions: ['frustration de voir un objectif non atteint pour une seule pratique manquante'],
    opps: [
      'les écarts regroupés par bloc se lisent d’un coup d’œil',
      'une liste d’actions concrètes pour engager la suite'
    ]
  }
]

// Context attributes — AI Adoption Maturity Model v1.0, §4.1 « Context Attributes »
// et Table 1 « Representative Context Attributes » (p. 26-27).
//
// Le calcul du niveau cible qui exploite ce fichier est documenté dans
// docs/NIVEAU-CIBLE.md.
//
// Les attributs sont regroupés selon les trois familles du modèle (fonctions
// organisationnelles / technologiques / IA). Chaque attribut porte :
//   aimm  : l'attribut correspondant de la Table 1, '' si l'attribut vient
//           du cadrage métier (littératie, digitalisation, ROI, pilotage,
//           déploiement) — traçabilité vers la source, non affiché dans l'outil
//   axis  : 'ambition' (ce que l'organisation veut atteindre)
//           'capacity' (ce qu'elle est en mesure de soutenir)
//           null       (attribut de cadrage : ne score pas, mais peut plafonner)
//   opts  : [valeur, libellé, score normalisé 0..1]

export const CONTEXT_GROUPS = [
  {
    id: 'org',
    label: 'Fonctions organisationnelles',
    fields: [
      {
        id: 'scope', short: 'Périmètre', label: 'Périmètre de l’évaluation', aimm: 'Organizational scope', axis: null,
        hint: 'Frontière de la discussion sur la maturité',
        opts: [
          ['team', 'Une équipe', 0],
          ['unit', 'Un département', 0.25],
          ['sector', 'Un secteur d’activité', 0.5],
          ['program', 'Un programme transverse', 0.75],
          ['org', 'Toute l’entreprise', 1]
        ]
      },
      {
        id: 'horizon', short: 'Horizon', label: 'Horizon de planification', aimm: 'Planning horizon', axis: 'ambition',
        hint: 'Échéance des objectifs d’adoption visés',
        opts: [
          ['h6', 'Moins de 6 mois', 0],
          ['h12', '6 à 12 mois', 0.33],
          ['h3a', '1 à 3 ans', 0.67],
          ['h3p', 'Plus de 3 ans', 1]
        ]
      },
      {
        id: 'regulatory', short: 'Réglementation', label: 'Posture réglementaire', aimm: 'Regulatory posture', axis: null,
        hint: 'Un cadre réglementaire fort abaisse l’appétit au risque retenu',
        opts: [
          ['regulated', 'Fortement régulé', 0],
          ['semi', 'Partiellement régulé', 0.5],
          ['unregulated', 'Non régulé', 1]
        ]
      }
    ]
  },
  {
    id: 'tech',
    label: 'Fonctions technologiques',
    fields: [
      {
        id: 'digital', short: 'Digitalisation', label: 'Niveau de digitalisation actuel', aimm: '', axis: 'capacity',
        hint: 'D’où part l’organisation : systèmes et processus numérisés',
        opts: [
          ['low', 'Faible', 0],
          ['mid', 'Moyen', 0.5],
          ['high', 'Élevé', 1]
        ]
      },
      {
        id: 'data', short: 'Données', label: 'Préparation des données', aimm: 'Data readiness', axis: 'capacity',
        hint: 'Disponibilité de jeux de données exploitables par l’IA',
        opts: [
          ['none', 'Non préparées', 0],
          ['partial', 'Partiellement prêtes', 0.5],
          ['ready', 'Prêtes ou acquises pour l’IA', 1]
        ]
      },
      {
        id: 'devApproach', short: 'Développement IA', label: 'Approche de développement IA', aimm: 'Primary AI development approach', axis: null,
        hint: 'Oriente les areas techniques à prioriser, sans modifier le niveau cible',
        opts: [
          ['buy', 'Acheter sur étagère', 0],
          ['customize', 'Personnaliser', 0.33],
          ['hybrid', 'Hybride', 0.67],
          ['build', 'Construire en interne', 1]
        ]
      }
    ]
  },
  {
    id: 'ai',
    label: 'Fonctions IA',
    fields: [
      {
        id: 'literacy', short: 'Littératie', label: 'Littératie IA du conseil et de la direction', aimm: '', axis: 'capacity',
        hint: 'Sensibilisation et connaissances de base au niveau du conseil d’administration et du comité de direction',
        opts: [
          ['low', 'Faible', 0],
          ['mid', 'Intermédiaire', 0.5],
          ['high', 'Avancée', 1]
        ]
      },
      {
        id: 'risk', short: 'Risque', label: 'Appétit au risque', aimm: 'AI risk profile', axis: 'ambition',
        hint: 'Degré de risque que l’organisation accepte d’assumer',
        opts: [
          ['averse', 'Prudent', 0],
          ['moderate', 'Modéré', 0.5],
          ['open', 'Ouvert', 1]
        ]
      },
      {
        id: 'staffing', short: 'Ressources', label: 'Ressources affectées à l’IA', aimm: 'AI staffing', axis: 'capacity',
        hint: 'Manière de doter les initiatives IA en compétences',
        opts: [
          ['none', 'Aucun rôle IA', 0],
          ['contracted', 'Externalisé', 0.33],
          ['shared', 'Rôles internes partagés', 0.67],
          ['dedicated', 'Équipe interne dédiée', 1]
        ]
      },
      {
        id: 'governance', short: 'Pilotage', label: 'Pilotage de l’adoption', aimm: '', axis: 'capacity',
        hint: 'Adoption déléguée aux métiers ou portée par une instance transverse',
        opts: [
          ['delegated', 'Délégué aux équipes métiers', 0],
          ['coordinated', 'Coordination légère', 0.5],
          ['crossfunctional', 'Instance transverse (commission IA)', 1]
        ]
      },
      {
        id: 'deployment', short: 'Déploiement', label: 'Approche de déploiement', aimm: '', axis: 'ambition',
        hint: 'Adoption conduite projet par projet ou à l’échelle de l’entreprise',
        opts: [
          ['project', 'Projet par projet', 0],
          ['waves', 'Par vagues successives', 0.5],
          ['enterprise', 'Programme d’entreprise', 1]
        ]
      },
      {
        id: 'roi', short: 'ROI', label: 'Anticipation du retour sur investissement', aimm: '', axis: 'ambition',
        hint: 'Le ROI a-t-il été discuté en amont ou repoussé après une phase pilote ?',
        opts: [
          ['deferred', 'Reporté après la phase pilote', 0],
          ['qualitative', 'Discuté qualitativement en amont', 0.5],
          ['business', 'Cas d’affaires chiffré en amont', 1]
        ]
      },
      {
        id: 'ambition', short: 'Ambition', label: 'Ambition d’adoption', aimm: 'AI business goal', axis: 'ambition',
        hint: 'Archétype qui caractérise l’approche de l’organisation face à l’IA',
        opts: [
          ['laggard', 'Retardataire', 0],
          ['late', 'Majorité tardive', 0.25],
          ['earlyMajority', 'Majorité précoce', 0.5],
          ['earlyAdopter', 'Adopteur précoce', 0.75],
          ['leader', 'Leader / innovateur IA', 1]
        ]
      }
    ]
  }
]

// Attributs purement descriptifs : documentent l'évaluation (Table 1) sans
// intervenir dans le calcul du niveau cible.
export const DESCRIPTIVE_FIELDS = [
  {
    id: 'domain', label: 'Domaine d’activité', aimm: 'Domain', axis: null, hint: '',
    opts: [
      ['finance', 'Finance', 0], ['health', 'Santé', 0], ['industry', 'Industrie', 0],
      ['public', 'Secteur public', 0], ['tech', 'Technologie', 0], ['other', 'Autre', 0]
    ]
  },
  {
    id: 'size', label: 'Taille de l’unité évaluée', aimm: 'Size', axis: null, hint: '',
    opts: [
      ['xs', '10 à 49', 0], ['s', '50 à 99', 0],
      ['m', '100 à 199', 0], ['l', '200 et plus', 0]
    ]
  },
  {
    id: 'footprint', label: 'Empreinte organisationnelle', aimm: 'Organization footprint', axis: null, hint: '',
    opts: [['national', 'Nationale', 0], ['regional', 'Régionale', 0], ['global', 'Mondiale', 0]]
  }
]

// Plafonds durs : facteurs bloquants qui ne se compensent pas par une moyenne.
export const LEVEL_CAPS = [
  { field: 'staffing', values: ['none'], max: 2, why: 'aucune ressource n’est affectée à l’IA' },
  { field: 'literacy', values: ['low'], max: 2, why: 'la littératie IA du conseil et de la direction est faible' },
  { field: 'data', values: ['none'], max: 2, why: 'les données ne sont pas préparées pour l’IA' },
  { field: 'digital', values: ['low'], max: 2, why: 'le niveau de digitalisation est faible' },
  { field: 'scope', values: ['team'], max: 3, why: 'le périmètre se limite à une équipe' },
  { field: 'governance', values: ['delegated'], max: 3, why: 'l’adoption est entièrement déléguée aux équipes métiers' },
  { field: 'horizon', values: ['h6', 'h12'], max: 3, why: 'l’horizon de planification est inférieur à un an' },
  { field: 'deployment', values: ['project'], max: 3, why: 'le déploiement est conduit projet par projet' }
]

// Le Level 5 suppose que toutes ces conditions structurelles sont réunies.
export const LEVEL5_REQUIREMENTS = [
  { field: 'scope', values: ['org'], why: 'un périmètre à l’échelle de l’entreprise' },
  { field: 'horizon', values: ['h3p'], why: 'un horizon supérieur à 3 ans' },
  { field: 'staffing', values: ['dedicated'], why: 'une équipe IA interne dédiée' },
  { field: 'governance', values: ['crossfunctional'], why: 'une instance de pilotage transverse' },
  { field: 'literacy', values: ['high'], why: 'une littératie IA avancée du conseil et de la direction' }
]

// Un cadre réglementaire fort borne l'appétit au risque effectivement retenu.
export const REGULATED_RISK_CEILING = 0.5

export const ALL_FIELDS = CONTEXT_GROUPS.reduce((acc, g) => acc.concat(g.fields), [])

export function fieldById(id) {
  return ALL_FIELDS.find(f => f.id === id) || DESCRIPTIVE_FIELDS.find(f => f.id === id)
}

export function optionLabel(fieldId, value) {
  const f = fieldById(fieldId)
  if (!f) return ''
  const o = f.opts.find(x => x[0] === value)
  return o ? o[1] : ''
}

// Context attributes — AI Adoption Maturity Model v1.0, §4.1 « Context Attributes »
// et Table 1 « Representative Context Attributes » (p. 26-27).
//
// Le calcul du niveau cible qui exploite ce fichier est documenté dans
// docs/NIVEAU-CIBLE.md.
//
// Les attributs sont regroupés selon les trois familles du modèle — fonctions
// organisationnelles, technologiques, IA. À l'écran, les trois groupes ne
// portent que « Organisation », « Technologie » et « IA » : aucun des champs
// qu'ils réunissent n'est une fonction, et le mot de la source, calqué de
// l'anglais *functions*, faisait chercher au lecteur des fonctions dans une
// liste de périmètres, d'horizons et de niveaux. La famille du modèle reste
// nommée ici, où la traçabilité se lit. Chaque attribut porte :
//   aimm  : l'attribut correspondant de la Table 1, '' si l'attribut vient
//           du cadrage métier (connaissances, digitalisation, ROI, pilotage,
//           déploiement) — traçabilité vers la source, non affiché dans l'outil
//   axis  : 'ambition' (ce que l'organisation veut atteindre)
//           'capacity' (ce qu'elle est en mesure de soutenir)
//           null       (attribut de cadrage : ne score pas, mais peut plafonner)
//   opts  : [valeur, libellé, score normalisé 0..1, critère d'acceptation]
//
// Le critère d'acceptation est facultatif. Il est rédigé pour les attributs
// dont le libellé seul n'est pas répondable en séance de direction — ceux dont
// une option déclenche un plafond dur (LEVEL_CAPS) décident à eux seuls du
// niveau cible, et ne peuvent pas reposer sur un jugement. Chaque critère
// énonce donc un fait vérifiable, pas une appréciation.

export const CONTEXT_GROUPS = [
  {
    id: 'org',
    label: 'Organisation',
    fields: [
      // Quatre options et non cinq : « un programme transverse » a été retiré le
      // 28.08.2026. C'était un calque de l'anglais *program*, qui ne nomme rien
      // dans une PME — l'équipe qui porte l'initiative suffit à décrire ce cas,
      // et le mot « transverse » faisait hésiter entre le périmètre évalué et
      // l'instance qui pilote (voir l'attribut de pilotage, où il garde son
      // sens). Les scores sont redistribués régulièrement sur les quatre rangs
      // restants ; l'attribut n'ayant pas d'`axis`, ils ne pèsent sur aucune
      // moyenne et seul « une équipe » agit, par le plafond qu'il déclenche.
      {
        id: 'scope', short: 'Périmètre', label: 'Périmètre de l’évaluation', aimm: 'Organizational scope', axis: null,
        hint: '',
        opts: [
          ['team', 'Une équipe', 0],
          ['unit', 'Un département', 0.33],
          ['sector', 'Un secteur d’activité', 0.67],
          ['org', 'Toute l’entreprise', 1]
        ]
      },
      {
        // Sans aide : « échéance des objectifs d'adoption visés » paraphrasait
        // « horizon de planification » sans rien y ajouter, et les quatre
        // options — des durées — se lisent seules.
        id: 'horizon', short: 'Horizon', label: 'Horizon de planification', aimm: 'Planning horizon', axis: 'ambition',
        hint: '',
        opts: [
          ['h6', 'Moins de 6 mois', 0],
          ['h12', '6 à 12 mois', 0.33],
          ['h3a', '1 à 3 ans', 0.67],
          ['h3p', 'Plus de 3 ans', 1]
        ]
      }
      // L'attribut de posture réglementaire (`regulatory`, Table 1 « Regulatory
      // posture ») a été retiré le 28.08.2026. Il proposait « non régulé », et
      // c'était faux pour la cible du travail : une PME de l'arc jurassien relève
      // de la nLPD, et souvent du règlement européen sur l'IA par les clients
      // qu'elle sert. Un attribut dont une option sur trois ne décrit aucune
      // organisation réelle n'informe pas le calcul, il le fausse — et il faisait
      // en outre baisser l'appétit au risque retenu au nom d'une réponse que
      // personne n'était en mesure de donner correctement. Les obligations
      // légales générales ne se déclarent donc plus : elles sont acquises.
    ]
  },
  {
    id: 'tech',
    label: 'Technologie',
    fields: [
      {
        id: 'digital', short: 'Digitalisation', label: 'Niveau de digitalisation actuel', aimm: '', axis: 'capacity',
        hint: 'Ce qui est déjà numérisé dans les processus cœur de métier, et si les applications communiquent entre elles',
        opts: [
          ['low', 'Faible', 0,
            'Les processus cœur de métier reposent encore sur le papier, la messagerie ou des fichiers locaux ; les applications en place ne s’échangent pas de données.'],
          ['mid', 'Moyen', 0.5,
            'Les processus cœur de métier tournent dans des applications partagées, mais les échanges entre elles restent manuels : ressaisies, exports et imports de fichiers.'],
          ['high', 'Élevé', 1,
            'Les processus cœur de métier sont numérisés de bout en bout et les applications s’échangent des données automatiquement (interfaces, API) ; les données de gestion sont disponibles sans ressaisie.']
        ]
      },
      {
        id: 'data', short: 'Données', label: 'Préparation des données', aimm: 'Data readiness', axis: 'capacity',
        hint: 'Combien de temps faut-il pour fournir un jeu de données exploitable à un nouveau cas d’usage IA, et qui en répond ?',
        opts: [
          ['none', 'Non préparées', 0,
            'Les données vivent dans les applications métier ou des fichiers, sans inventaire ni responsable désigné. Constituer un jeu de données est un projet en soi : plusieurs mois, ou délai inconnu.'],
          ['partial', 'Partiellement prêtes à l’emploi', 0.5,
            'Au moins un domaine clé est déjà consolidé et exploité (reporting, tableaux de bord), avec un responsable identifié. Sa réutilisation pour l’IA reste à qualifier : qualité, documentation, droits d’usage. Compter quelques semaines.'],
          ['ready', 'Prêtes à l’emploi', 1,
            'Les jeux de données visés sont accessibles par un flux documenté et maintenu, leur qualité est suivie et leur droit d’usage pour l’IA est tranché (données personnelles, contrats tiers) — ou la solution retenue est prête à l’emploi et vient avec ses données. Compter quelques jours.']
        ]
      },
      {
        // Sans aide affichée : la mention qui annonçait un ciblage par pratiques
        // « encore à venir » décrivait un chantier, pas le champ. Ce que
        // l'attribut fait au calcul se lit dans `axis: null` — il n'y entre pas
        // — et cela reste vrai sans le dire sur l'écran de celui qui répond.
        id: 'devApproach', short: 'Développement IA', label: 'Approche de développement IA', aimm: 'Primary AI development approach', axis: null,
        hint: '',
        // Trois options et non quatre : « Hybride » a été retiré le 30.08.2026.
        // L'attribut demande l'approche *principale*, et « hybride » est la
        // réponse qu'on choisit quand on ne veut pas trancher — toute PME qui
        // achète un outil et en personnalise un autre s'y reconnaît, si bien que
        // l'option attirait les réponses sans rien apprendre de l'organisation.
        // Les scores sont redistribués régulièrement sur les trois rangs
        // restants ; l'attribut n'ayant pas d'`axis`, ils ne pèsent sur aucune
        // moyenne.
        opts: [
          ['buy', 'Acheter sur étagère', 0],
          ['customize', 'Personnaliser', 0.5],
          ['build', 'Construire en interne', 1]
        ]
      }
    ]
  },
  {
    id: 'ai',
    label: 'IA',
    fields: [
      {
        id: 'literacy', short: 'Connaissances', label: 'Connaissances IA du conseil et de la direction', aimm: '', axis: 'capacity',
        hint: 'Ce que le conseil d’administration et le comité de direction savent faire eux-mêmes face à une proposition IA',
        opts: [
          ['low', 'Faible', 0,
            'Aucune sensibilisation formelle n’a eu lieu ; l’IA n’a pas été portée à l’ordre du jour et l’appréciation d’une proposition repose sur une ou deux personnes.'],
          ['mid', 'Intermédiaire', 0.5,
            'Le conseil et la direction ont été sensibilisés (formation, séminaire, intervention d’expert) et distinguent les usages possibles de leurs limites ; juger une proposition demande encore l’avis d’un tiers.'],
          ['high', 'Avancée', 1,
            'L’IA figure régulièrement à l’ordre du jour ; le conseil et la direction discutent d’eux-mêmes cas d’usage, risques et obligations réglementaires, et savent challenger un fournisseur sans appui externe.']
        ]
      },
      {
        id: 'risk', short: 'Risque', label: 'Appétit au risque', aimm: 'AI risk profile', axis: 'ambition',
        hint: '',
        opts: [
          ['averse', 'Prudent', 0],
          ['moderate', 'Modéré', 0.5],
          ['open', 'Ouvert', 1]
        ]
      },
      {
        id: 'staffing', short: 'Ressources', label: 'Ressources affectées à l’IA', aimm: 'AI staffing', axis: 'capacity',
        hint: '',
        opts: [
          ['none', 'Aucun rôle IA', 0],
          ['contracted', 'Externalisé', 0.33],
          ['shared', 'Rôles internes partagés', 0.67],
          ['dedicated', 'Équipe interne dédiée', 1]
        ]
      },
      {
        id: 'governance', short: 'Pilotage', label: 'Pilotage de l’adoption', aimm: '', axis: 'capacity',
        hint: 'Qui recense les initiatives IA, qui les arbitre, et avec quel mandat',
        opts: [
          ['delegated', 'Délégué aux équipes métiers', 0,
            'Chaque équipe décide seule de ses initiatives IA ; aucune instance ne les recense ni ne les arbitre au niveau de l’organisation.'],
          ['coordinated', 'Coordination légère', 0.5,
            'Un référent ou un groupe de travail recense les initiatives et diffuse des règles communes, sans mandat d’arbitrage ni budget propre.'],
          ['crossfunctional', 'Instance transverse (commission IA)', 1,
            'Une instance mandatée, réunissant métiers, IT et conformité, se réunit à intervalle fixe, arbitre le portefeuille d’initiatives et rend compte à la direction.']
        ]
      },
      {
        id: 'deployment', short: 'Déploiement', label: 'Approche de déploiement', aimm: '', axis: 'ambition',
        hint: '',
        opts: [
          ['project', 'Projet par projet', 0],
          ['waves', 'Par vagues successives', 0.5],
          ['enterprise', 'Programme d’entreprise', 1]
        ]
      },
      {
        id: 'roi', short: 'ROI', label: 'Anticipation du retour sur investissement', aimm: '', axis: 'ambition',
        hint: '',
        opts: [
          ['deferred', 'Reporté après la phase pilote', 0],
          ['qualitative', 'Discuté qualitativement en amont', 0.5,
            'Les gains attendus ont été nommés et débattus avant de lancer le projet — gain de temps, qualité, capacité à absorber une charge —, mais aucun n’a été chiffré ni rapporté au coût de la solution.'],
          ['business', 'Rentabilité chiffrée en amont', 1]
        ]
      },
      // Les catégories d'adoptants de Rogers (1962) restent l'inspiration de cet
      // attribut — c'est bien la même question qu'il pose, et le même axe. Leurs
      // noms, eux, ont été abandonnés : personne ne se déclare « retardataire »,
      // et la frontière entre majorité précoce et majorité tardive n'est pas
      // lisible pour un dirigeant qui ne connaît pas la courbe. Une option
      // humiliante à cocher n'est pas répondue sincèrement : elle est répondue
      // un cran au-dessus, et l'attribut mesure alors la pudeur plutôt que le
      // rythme. Les libellés disent donc ce qui est réellement demandé —
      // attendre que d'autres aient éprouvé la technologie, ou avancer avant
      // eux — et chacun énonce une préférence défendable en comité de direction.
      {
        id: 'ambition', short: 'Rythme', label: 'Rythme d’adoption', aimm: 'AI business goal', axis: 'ambition',
        hint: 'Préférez-vous laisser d’autres éprouver la technologie avant vous, ou avancer avant eux ?',
        opts: [
          ['proven', 'Adopter ce qui a fait ses preuves', 0],
          ['sector', 'Avancer au rythme du secteur', 0.33],
          ['ahead', 'Prendre une longueur d’avance', 0.67],
          ['pioneer', 'Ouvrir la voie', 1]
        ]
      }
    ]
  }
]

// Attributs purement descriptifs : documentent l'évaluation (Table 1) sans
// intervenir dans le calcul du niveau cible.
export const DESCRIPTIVE_FIELDS = [
  {
    id: 'domain', label: 'Secteur d’activité', aimm: 'Domain', axis: null, hint: '',
    opts: [
      ['finance', 'Finance', 0], ['health', 'Santé', 0], ['industry', 'Industrie', 0],
      ['public', 'Secteur public', 0], ['tech', 'Technologie', 0], ['other', 'Autre', 0]
    ]
  },
  {
    id: 'size', label: 'Taille de l’organisation évaluée', aimm: 'Size', axis: null, hint: '',
    opts: [
      ['xs', '10 à 49', 0], ['s', '50 à 99', 0],
      ['m', '100 à 199', 0], ['l', '200 et plus', 0]
    ]
  },
  {
    id: 'footprint', label: 'Territoire', aimm: 'Organization footprint', axis: null, hint: '',
    opts: [['national', 'Nationale', 0], ['regional', 'Régionale', 0], ['global', 'Mondiale', 0]]
  }
]

// Plafonds durs : facteurs bloquants qui ne se compensent pas par une moyenne.
export const LEVEL_CAPS = [
  { field: 'staffing', values: ['none'], max: 2, why: 'aucune ressource n’est affectée à l’IA' },
  { field: 'literacy', values: ['low'], max: 2, why: 'les connaissances IA du conseil et de la direction sont faibles' },
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
  { field: 'literacy', values: ['high'], why: 'des connaissances IA avancées du conseil et de la direction' }
]

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

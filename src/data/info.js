// Contenu de l'écran d'information — le seul écran, avec l'attribution, où le
// lecteur vient chercher d'où vient ce qu'on lui montre.
//
// Trois contenus, dans l'ordre où ils se lisent :
//   — les trois mots qu'on confond (adoption, maturité d'adoption, readiness),
//     et ce que l'outil mesure parmi eux ;
//   — comment un niveau est construit : la grille des trois indicateurs
//     transversaux du § 5 de la source, reprise telle quelle ;
//   — le tableau d'équivalences entre échelles, avec ce qu'il ne prétend pas
//     être.
//
// Ce fichier ne porte que du texte et des jointures entre données déjà écrites
// ailleurs. Rien n'y est recopié à la main de ce qui existe : la grille vient de
// maturity-indicators.js, les noms de profils de model-data.json, les degrés de
// transformation de transformation.js. Une reprise manuelle aurait dérivé au
// premier remaniement, et l'écran d'information est précisément celui qui n'a
// pas le droit de mentir sur le contenu du modèle.

import { MATURITY_INDICATORS } from './maturity-indicators.js'
import { TRANSFORMATION_DEGREES } from './transformation.js'
import { AIMM } from './model-data.js'

// — a. Adoption, maturité d'adoption, readiness —
//
// Les trois mots circulent comme des synonymes dans la littérature commerciale,
// et ils ne le sont pas : ils ne posent pas la même question, et deux d'entre
// eux ne se mesurent pas avec le même instrument. Les distinguer d'entrée évite
// la déception la plus prévisible — celle d'un dirigeant venu chercher « suis-je
// prêt ? » et qui reçoit « ce que vous faites se reproduit-il ? ».
export const CONCEPTS = {
  title: 'Adoption, maturité d’adoption, readiness',
  lead:
    'Trois mots souvent employés l’un pour l’autre. Ils ne posent pas la même question, ' +
    'et l’outil n’en mesure qu’un.',
  terms: [
    {
      term: 'Adoption',
      question: 'Employons-nous l’IA ?',
      definition:
        'Le fait d’employer l’IA — un outil en service, un usage installé. L’adoption dit ' +
        'qu’il se passe quelque chose ; elle ne dit rien de la solidité de cet emploi, ni ' +
        'de ce qui arrive au cas d’usage suivant.'
    },
    {
      term: 'Readiness',
      question: 'Le socle permet-il de démarrer ?',
      definition:
        'L’état de préparation : données, compétences, infrastructure, cadre de décision. ' +
        'La readiness se prononce avant l’usage — elle dit si l’on peut s’y mettre, pas ce ' +
        'que l’on obtient une fois lancé.'
    },
    {
      term: 'Maturité d’adoption',
      question: 'Le résultat se reproduit-il d’un cas d’usage au suivant ?',
      definition:
        'La capacité à obtenir le même résultat une deuxième fois, puis ailleurs que dans ' +
        'l’équipe qui a commencé. C’est une propriété des pratiques, pas des outils : elle ' +
        'se lit sur ce qui est assigné, planifié, doté et mesuré.'
    }
  ],
  measured:
    'Cet outil mesure la maturité d’adoption, et non la readiness. La différence n’est pas ' +
    'de degré : une organisation peut être prête sans rien avoir adopté, et employer l’IA ' +
    'tous les jours sans qu’aucun résultat ne se reproduise. Une porte « readiness », qui ' +
    'poserait la première question à une organisation qui n’a encore rien lancé, relève ' +
    'd’une itération ultérieure et ne figure pas dans cette version.'
}

// — b. Comment les niveaux sont construits —
//
// La grille des trois indicateurs transversaux est la sémantique de niveau du
// modèle : cinq situations par indicateur, valables pour n'importe quel domaine
// (voir docs/DECISIONS.md, entrée du 30.07.2026). Les lignes sont importées de
// maturity-indicators.js et non recopiées — c'est le même texte que celui qui
// est répondu à l'écran, à la virgule près, et il ne peut pas diverger.
//
// La colonne de synthèse, elle, est écrite ici : elle nomme en trois mots ce que
// les trois cases d'une même ligne ont en commun. C'est cette lecture
// horizontale qui explique pourquoi les niveaux se comparent d'un domaine à
// l'autre, et elle n'existe pas dans la source, qui pose la grille sans la
// résumer.
export const LEVEL_SYNTHESIS = [
  {
    n: 1,
    name: 'absence',
    gloss: 'rien d’assigné, rien de planifié, rien d’alloué régulièrement'
  },
  {
    n: 2,
    name: 'existence désignée',
    gloss: 'des rôles, un plan, un budget pour ce domaine'
  },
  {
    n: 3,
    name: 'boucle de mesure',
    gloss: 'ce qui est mesuré change la conduite'
  },
  {
    n: 4,
    name: 'reproductibilité au-delà du premier cas',
    gloss: 'hors de l’équipe qui a lancé'
  },
  {
    n: 5,
    name: 'anticipation',
    gloss: 'les choix servent une stratégie et des scénarios à venir'
  }
]

export const LEVEL_BUILD = {
  title: 'Comment les niveaux sont construits',
  lead:
    'Un niveau n’est pas une note attribuée au jugé. Il est défini une fois pour toutes par ' +
    'trois indicateurs transversaux, et chaque domaine du modèle en reçoit la même lecture.',
  // Les en-têtes de colonnes : le rang, les trois indicateurs, la synthèse.
  indicators: MATURITY_INDICATORS.map(indicator => ({
    id: indicator.id,
    name: indicator.name,
    desc: indicator.desc
  })),
  // Une ligne par rang : les trois énoncés de ce rang, puis sa synthèse.
  rows: LEVEL_SYNTHESIS.map(synthesis => ({
    n: synthesis.n,
    synthesis: `${synthesis.name} — ${synthesis.gloss}`,
    cells: MATURITY_INDICATORS.map(indicator => ({
      id: indicator.id,
      text: indicator.statements.find(statement => statement.n === synthesis.n).text
    }))
  })),
  notes: [
    'Chaque énoncé du questionnaire instancie, pour son domaine, la ligne de son niveau : ' +
      'le rang 3 d’un domaine dit toujours qu’une mesure existe et qu’elle change la conduite, ' +
      'quel que soit le domaine où on le lit.',
    'La sémantique de niveau ne dépend donc pas du domaine, et c’est cette uniformité qui rend ' +
      'les niveaux comparables entre domaines : un rang 3 en gestion des données et un rang 3 en ' +
      'stratégie décrivent le même degré d’installation, appliqué à deux objets différents.'
  ]
}

// — c. Tableau d'équivalences des échelles —
//
// Trois colonnes sont fondées sur le dépôt et remplies ici :
//   — « Nom retenu » vient de model-data.json (`levels[].name`) ;
//   — « Ozkaya et al. (2026) » est le nom anglais du même niveau. Il figure dans
//     model-data.json pour les niveaux 2 à 4, cités dans le report littéral des
//     `detail` ; les cinq sont rassemblés dans le tableau de correspondance du
//     README (§ « Les cinq niveaux de maturité »), qui est la trace de lecture
//     de la source dans ce dépôt ;
//   — « Venkatraman (1994) » vient de transformation.js (`name` du degré).
//
// Trois colonnes restent vides, et c'est délibéré : Gartner, Altimeter et
// Element AI ne sont présents dans ce dépôt ni en texte, ni en tableau, ni en
// note de lecture. Écrire de mémoire le nom d'un étage d'une échelle publiée
// produirait un tableau de correspondances faux et invérifiable à la relecture —
// la faute est d'autant plus grave qu'elle passe inaperçue. Les cellules portent
// donc un marqueur explicite et attendent la vérification contre les sources
// primaires ; elles ne se remplissent qu'après.
export const TO_VERIFY = 'À VÉRIFIER'

export const SCALE_MAP = {
  title: 'Équivalences entre échelles',
  lead:
    'Où se situe chaque palier de cet outil par rapport aux échelles de maturité publiées.',
  columns: [
    { id: 'n', label: 'Palier' },
    { id: 'retained', label: 'Nom retenu dans l’outil' },
    { id: 'ozkaya', label: 'Ozkaya et al. (2026)' },
    { id: 'venkatraman', label: 'Venkatraman (1994)' },
    { id: 'gartner', label: 'Gartner' },
    { id: 'altimeter', label: 'Altimeter' },
    { id: 'elementAI', label: 'Element AI' }
  ],
  // Les noms anglais des cinq niveaux du modèle de base, dans l'ordre des rangs.
  rows: AIMM.levels.map((level, index) => ({
    n: level.n,
    retained: level.name,
    ozkaya: ['Exploratory AI', 'Implemented AI', 'Aligned AI', 'Scaled AI', 'Future Ready AI'][index],
    venkatraman: TRANSFORMATION_DEGREES.find(degree => degree.n === level.n).name,
    gartner: TO_VERIFY,
    altimeter: TO_VERIFY,
    elementAI: TO_VERIFY
  })),
  notes: [
    'Ce rapprochement est indicatif : il aide à se repérer d’une échelle à l’autre, il n’est ' +
      'pas une correspondance validée par les auteurs de ces modèles. Une case peut ' +
      'légitimement rester sans équivalent direct — toutes les échelles comparées n’ont pas ' +
      'cinq étages, et rien n’oblige leurs paliers à se recouvrir un à un.',
    'La fusion des noms d’Ozkaya et al. et de ceux de Venkatraman dans les noms français des ' +
      'paliers est une lecture propre à ce travail : la source ne cite pas Venkatraman, et ne ' +
      'revendique aucun rapprochement avec son échelle de transformation.'
  ],
  pending:
    'Les colonnes marquées « ' + TO_VERIFY + ' » attendent d’être renseignées contre les ' +
    'sources primaires. Aucun nom d’étage n’y est écrit tant qu’il n’a pas été relevé dans ' +
    'la publication elle-même.'
}

export const INFO = {
  concepts: CONCEPTS,
  levelBuild: LEVEL_BUILD,
  scaleMap: SCALE_MAP
}

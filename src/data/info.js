// Contenu de l'écran d'information — le seul écran, avec l'attribution, où le
// lecteur vient chercher d'où vient ce qu'on lui montre.
//
// Quatre contenus, plus le découpage de la page en parties :
//   — les trois mots qu'on confond (adoption, maturité d'adoption, readiness),
//     et ce que l'outil mesure parmi eux ;
//   — comment un niveau est construit : la grille des trois indicateurs
//     transversaux du § 5 de la source, reprise telle quelle ;
//   — le tableau d'équivalences entre échelles, avec ce qu'il ne prétend pas
//     être ;
//   — les quatre sources et ce que chacune fonde ici. La donnée attendait dans
//     attribution.js, dont le pied de page ne porte que la forme courte : les
//     trois emprunts qui s'ajoutent au référentiel de base se lisent ici, comme
//     ce fichier l'annonçait déjà.
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
import { SOURCES } from './attribution.js'

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
// Les trois autres colonnes attendaient une vérification contre les sources
// primaires. Elle a eu lieu le 12.09.2026, et son résultat est inégal :
//   — « Altimeter » vient de The AI Maturity Playbook (Etlinger, 2018), relevé
//     dans l'aperçu du rapport publié par Altimeter lui-même. L'échelle n'a que
//     quatre phases pour cinq paliers : une case reste donc sans équivalent, cas
//     que la note sous le tableau prévoit expressément ;
//   — « Element AI » vient de The AI Maturity Framework (2020), dont le
//     whitepaper n'est plus accessible en ligne depuis le rachat par ServiceNow.
//     Les cinq paliers sont relevés dans Hansen et al. (2024), article open
//     access à comité de lecture qui cite le document avec sa référence
//     complète. C'est une reprise de seconde main, assumée comme telle : la
//     source citée dans la provenance est celle qui a réellement été lue ;
//   — « Gartner » vient de la page publique du AI Maturity Model and AI Roadmap
//     Toolkit, section « What are the stages of AI maturity? », consultée le
//     12.09.2026. C'est une page Gartner, et les cinq étages y sont nommés et
//     définis : la colonne est fondée sur l'éditeur lui-même, non sur une
//     reprise. La précaution garde son objet — trois nommages incompatibles de
//     cette échelle circulent de seconde main, dont deux ne figurent nulle part
//     chez Gartner — et c'est bien pourquoi rien n'a été écrit avant d'avoir la
//     page sous les yeux.
//
// Aucune cellule ne porte donc plus de marqueur d'attente, et les constantes qui
// en tenaient lieu ont disparu avec leur objet : un marqueur exporté que rien
// n'emploie est une invitation à remplir une case sans source, exactement ce que
// le dispositif servait à empêcher. Seul subsiste le tiret des cases sans
// équivalent, qui n'est pas un aveu de recherche mais un constat d'échelle.

// Une case vide n'est pas un manque quand l'échelle comparée n'a pas cinq
// étages : le tiret dit qu'il n'y a rien à mettre, non qu'on ne l'a pas trouvé.
export const NO_EQUIVALENT = '—'

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
    gartner: ['Foundational', 'Emerging', 'Operational', 'Scaled', 'Transformational'][index],
    // Quatre phases pour cinq paliers. « Integrating » — « AI is part of the
    // fabric of the company » — décrit le palier 5 et non le 4 : la case sans
    // équivalent tombe donc au rang 4, et non en fin d'échelle.
    altimeter: ['Exploring', 'Experimenting', 'Formalizing', NO_EQUIVALENT, 'Integrating'][index],
    elementAI: ['Exploring', 'Experimenting', 'Formalizing', 'Optimizing', 'Transforming'][index]
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
  // Ce qu'il reste à dire du relevé lui-même, une fois toutes les colonnes
  // renseignées : non plus ce qui manque, mais sur quoi chaque nom repose.
  pending:
    'Chaque nom d’étage a été relevé dans sa source, jamais reconstitué : Gartner et Altimeter ' +
    'sur une page de l’éditeur, Element AI dans une reprise académique du whitepaper ' +
    'd’origine, devenu introuvable en ligne depuis le rachat de la société. Les sources lues ' +
    'figurent ci-dessous.'
}

// — d. Le découpage de la page en trois parties —
//
// Les sections étaient empilées à plat, sans hiérarchie, et la page ne disait pas
// ce qu'il fallait avoir lu avant de commencer : la seconde série d'évaluations
// terrain l'a relevée comme « très complète », ce qui, sur une page
// d'introduction, est le reproche et non l'éloge — tout y pèse le même poids,
// donc rien n'est prioritaire.
//
// Trois parties, et une seule à lire. La première prépare la réponse : ce qu'on
// va demander, dans quel ordre, et sur quoi porte la question. Les deux autres
// répondent à des questions qui ne se posent pas encore — ce que vaut un niveau,
// d'où vient l'échelle — et se replient donc par défaut. Le repli est ce qui
// distingue le facultatif : un intertitre qui l'annonce sans rien fermer laisse
// la page aussi longue, et la longueur est justement ce qui décourage.
//
// `optional` ne dit pas l'importance mais le moment : la partie 2 est ce qu'on
// relit en regard de la restitution, la 3 ce qu'on lit avant de citer l'outil
// ailleurs. Ni l'une ni l'autre n'aide à répondre.
export const PARTS = [
  {
    id: 'answer',
    n: 1,
    title: 'Pour répondre au questionnaire',
    tag: 'À lire avant de commencer',
    lead:
      'Ce que le diagnostic va demander, dans quel ordre, et sur quoi porte exactement la ' +
      'question. Quelques minutes, qui évitent l’essentiel des hésitations devant les énoncés.',
    optional: false
  },
  {
    id: 'result',
    n: 2,
    title: 'Pour comprendre votre résultat',
    tag: 'Facultatif',
    lead:
      'Ce qu’un niveau veut dire, et comment le modèle est agencé. Se lit aussi bien après le ' +
      'diagnostic, en regard de la restitution.',
    optional: true
  },
  {
    id: 'method',
    n: 3,
    title: 'Pour comprendre la méthode',
    tag: 'Facultatif',
    lead:
      'D’où vient le modèle, à quoi ses paliers se comparent, et ce que ce travail y a ajouté. ' +
      'À lire avant de citer l’outil ailleurs.',
    optional: true
  }
]

// — e. D'où vient le modèle —
//
// La liste des sources et le rôle de chacune, reprise telle quelle
// d'attribution.js : le pied de page ne porte que le référentiel de base et son
// copyright, faute de place, et les trois emprunts n'étaient donc lisibles nulle
// part à l'écran. Rien n'est réécrit ici — une source recopiée à la main dérive
// au premier remaniement, et c'est la page qui n'a pas le droit de mentir sur
// la provenance.
//
// Les échelles simplement comparées font liste à part, et ce n'est pas une
// question de rang. `SOURCES` répond à « ce que la source fonde ici » : les
// dimensions viennent d'Ozkaya, les blocs d'Elia, un domaine de Bettoni. Une
// échelle que le tableau d'équivalences met en regard ne fonde rien — elle sert
// de repère. Les inscrire dans la même liste reviendrait à leur prêter une part
// dans le modèle qu'elles n'ont pas, ce qui est exactement le malentendu que
// l'attribution existe pour lever.
//
// La référence d'Element AI est celle de la reprise, non celle du whitepaper :
// c'est ce document-là qui a été lu, et un lecteur qui voudrait remonter à
// l'original n'irait pas loin — il n'est plus en ligne.
export const COMPARED = [
  {
    ref:
      'Gartner. AI Maturity Model and AI Roadmap Toolkit, section « What are the stages of ' +
      'AI maturity? ». Page consultée le 12.09.2026.',
    role:
      'Colonne « Gartner » du tableau d’équivalences. Cinq étages, nommés et définis sur une ' +
      'page de l’éditeur. Ne fonde rien dans le modèle : l’échelle sert de repère de lecture.'
  },
  {
    ref: 'Etlinger, S. (2018). The AI Maturity Playbook: Five Pillars of Enterprise Success. ' +
      'Altimeter, a Prophet Company.',
    role:
      'Colonne « Altimeter » du tableau d’équivalences. Quatre phases, relevées dans ' +
      'l’aperçu du rapport publié par Altimeter. Ne fonde rien dans le modèle : l’échelle ' +
      'sert de repère de lecture.'
  },
  {
    ref:
      'Hansen, H. F., Lillesund, E., Mikalef, P. & Altwaijry, N. (2024). Understanding ' +
      'Artificial Intelligence Diffusion through an AI Capability Maturity Model. ' +
      'Information Systems Frontiers, 26, 2147-2163.',
    role:
      'Colonne « Element AI » du tableau d’équivalences. Les cinq paliers d’Element AI ' +
      '(2020), The AI Maturity Framework, sont relevés dans cet article : le whitepaper ' +
      'd’origine n’est plus accessible depuis le rachat d’Element AI par ServiceNow.'
  }
]

export const PROVENANCE = {
  title: 'D’où vient le modèle',
  lead: 'Quatre sources, et ce que chacune fonde dans cet outil.',
  sources: SOURCES,
  comparedTitle: 'Échelles comparées, qui ne fondent rien ici',
  comparedLead:
    'Citées par le tableau d’équivalences pour situer les paliers, sans part dans la ' +
    'construction du modèle.',
  compared: COMPARED
}

export const INFO = {
  parts: PARTS,
  concepts: CONCEPTS,
  levelBuild: LEVEL_BUILD,
  scaleMap: SCALE_MAP,
  provenance: PROVENANCE
}

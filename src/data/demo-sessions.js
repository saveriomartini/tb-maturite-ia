// Sessions de démonstration — PME fictives, écrites à la main.
//
// L'accueil annonce trois portes de même rang, dont une démonstration : un
// parcours pré-rempli qui montre ce que l'outil restitue sans rien avoir à
// saisir. Ce fichier en porte la matière — les organisations, leur contexte, ce
// qu'elles ont répondu — et rien d'autre : la fabrication de l'état de session
// appartient à src/domain/demo-session.js.
//
// Les trois cas ne sont pas trois variantes du même. Chacun place l'écart entre
// profil atteint et profil visé à un endroit différent de l'échelle de
// transformation, et c'est là tout ce qu'ils démontrent : sous la ligne
// évolutif / révolutionnaire, la franchissant, ou déjà refermé. La restitution
// tient un discours distinct dans chacun de ces cas (voir
// src/data/transformation.js) — sans trois cas, on n'en verrait qu'un.
//
// — ce que porte un scénario —
//
//   `answers`   un niveau par domaine de capacité : le rang de l'énoncé retenu
//               (1 à 5), ou `'na'` pour un domaine déclaré hors périmètre. Un
//               domaine absent de la table n'a pas été renseigné — la
//               restitution le compte parmi les domaines restant à évaluer, et
//               jamais comme un manque. C'est exactement ce que le questionnaire
//               produit : la démonstration ne doit pas écrire un état que
//               l'utilisateur ne pourrait pas atteindre lui-même.
//
//   `reach`     la portée déclarée en phase d'ancrage — le `n` d'une option de
//               REACH_QUESTION. C'est elle qui fixe l'intention ; le profil visé
//               en découle, borné par ce que le contexte porte.
//
// Les tables sont écrites à la main, domaine par domaine, plutôt que dérivées
// d'un état global comme elles l'étaient du temps des pratiques validées. Avec
// 28 réponses et non plus 271 clés, la table tient sous les yeux : on lit ce que
// la PME fictive a répondu sans avoir à dérouler une règle de génération.
//
// Aucun scénario n'écrit de résultat : le profil atteint, l'écart et la synthèse
// sont recalculés par domain/scoring.js comme pour une vraie session, faute de
// quoi la démonstration montrerait autre chose que l'outil.

export const DEMO_SESSIONS = [
  {
    id: 'rochat',
    name: 'Menuiserie Rochat',
    profile: '32 personnes · industrie · régional',
    story:
      'L’atelier a formé ses équipes et laissé deux collaborateurs essayer l’IA sur ' +
      'le chiffrage des devis. L’envie est là ; les données, elles, vivent encore ' +
      'dans des fichiers, et personne n’est affecté à l’IA.',
    shows:
      'Le contexte ramène l’ambition à ce qu’il peut porter, et l’écart qui reste ne ' +
      'demande pas de redessiner les processus — il se joue sous la ligne évolutif / ' +
      'révolutionnaire. Deux domaines y sont déclarés hors périmètre.',
    // Portée déclarée : « notre façon de travailler est revue ». Le contexte
    // ramènera le profil visé plus bas — c'est l'un des deux écarts que la
    // restitution nomme.
    reach: 3,
    form: {
      scope: 'org', horizon: 'h3a',
      digital: 'low', data: 'none', devApproach: 'buy',
      literacy: 'mid', risk: 'moderate', staffing: 'contracted',
      governance: 'coordinated', deployment: 'project', roi: 'qualitative',
      ambition: 'sector',
      domain: 'industry', size: 'xs', footprint: 'regional'
    },
    // L'atelier a franchi le premier rang — ses collaborateurs se forment, un
    // client lui demande de l'IA, deux essais tournent — et rien du deuxième
    // n'est en place : ni enveloppe (A5), ni examen de ce que la solution
    // suppose (A7), ni cycle de vie des données (A17).
    //
    // A23 et A25 sont déclarés hors périmètre : l'atelier achète un service et
    // n'entraîne aucun modèle ; ni le cycle de vie des modèles ni leur suivi en
    // production ne sont à lui. C'est *sa* déclaration, pas un retrait décidé
    // par l'outil — le modèle, lui, tient qu'une PME consommatrice reste
    // concernée par ce qu'elle exploite, et A24 (sécurité des modèles et agents)
    // reste donc dans la mesure, à son niveau réel.
    //
    // A4 et A28 n'ont pas été renseignés : la séance s'est arrêtée avant. Ils ne
    // comptent ni comme acquis ni comme manquants — la restitution les annonce
    // comme restant à évaluer.
    answers: {
      A6: 2, A8: 2, A13: 2,
      A1: 1, A5: 1, A7: 1, A10: 1, A11: 2, A12: 1,
      A17: 1, A18: 1, A19: 1, A20: 1, A26: 2,
      A23: 'na', A24: 1, A25: 'na',
      A2: 1, A3: 1, A9: 2, A14: 1, A15: 1, A16: 1, A21: 1, A22: 1, A27: 1
    }
  },
  {
    id: 'belair',
    name: 'Clinique Bel-Air',
    profile: '140 personnes · santé · national',
    story:
      'L’organisation a mis son socle en ordre avant de rien déployer : politiques, ' +
      'gestion des risques, cycle de vie des données. Les données de patients qu’elle ' +
      'traite lui imposent un appétit au risque mesuré.',
    shows:
      'Le profil visé est de l’autre côté de la ligne : c’est le seul passage de ' +
      'l’échelle qui change de nature, et la restitution refuse de le présenter comme ' +
      'un effort de plus.',
    reach: 3,
    form: {
      scope: 'org', horizon: 'h3a',
      digital: 'mid', data: 'partial', devApproach: 'customize',
      literacy: 'mid', risk: 'moderate', staffing: 'shared',
      governance: 'coordinated', deployment: 'waves', roi: 'qualitative',
      ambition: 'sector',
      domain: 'health', size: 'm', footprint: 'national'
    },
    // Tout le socle est tenu : les deux premiers rangs sont au niveau 2 ou
    // au-dessus, sans exception. Ce qui manque est d'un autre ordre — refaire
    // les processus autour de l'IA (A14, A15), en mesurer les effets (A16),
    // faire évoluer la culture (A9). Le troisième rang n'y est pas.
    answers: {
      A6: 3, A8: 3, A13: 3,
      A1: 3, A5: 2, A7: 3, A10: 3, A11: 3, A12: 3,
      A17: 3, A18: 2, A19: 2, A20: 2, A23: 2, A24: 3, A26: 2,
      A2: 2, A3: 2, A9: 2, A14: 2, A15: 1, A16: 2, A21: 2, A22: 2, A25: 2, A27: 2,
      A28: 1, A4: 2
    }
  },
  {
    id: 'terravia',
    name: 'Groupe Terravia',
    profile: '210 personnes · distribution · national',
    story:
      'Le distributeur a refait ses processus autour de l’IA : données prêtes, commission ' +
      'IA mandatée, systèmes intégrés. Il s’arrête là — porter la transformation jusqu’à ' +
      'son réseau de fournisseurs lui coûterait plus qu’il ne lui rendrait.',
    shows:
      'Le profil visé est atteint, et la restitution ne pousse pas au suivant : le modèle ' +
      'tient que le meilleur profil n’est pas le plus haut mais celui qui aligne ' +
      'capacités, appétit au risque et objectifs.',
    reach: 3,
    form: {
      scope: 'org', horizon: 'h3a',
      digital: 'high', data: 'ready', devApproach: 'hybrid',
      literacy: 'mid', risk: 'moderate', staffing: 'shared',
      governance: 'crossfunctional', deployment: 'waves', roi: 'qualitative',
      ambition: 'sector',
      domain: 'other', size: 'l', footprint: 'national'
    },
    // Les trois premiers rangs au niveau 3 ou au-dessus, sans exception : c'est
    // ce qu'« Alignement des processus » met en jeu, et rien de moins ne
    // l'acquiert. Au-delà, le travail est entamé sans être poursuivi — c'est ce
    // que décrit une organisation qui s'arrête volontairement là.
    answers: {
      A6: 4, A8: 3, A13: 4,
      A1: 4, A5: 3, A7: 3, A10: 3, A11: 4, A12: 3,
      A17: 4, A18: 3, A19: 3, A20: 3, A23: 3, A24: 3, A26: 4,
      A2: 3, A3: 3, A9: 3, A14: 4, A15: 3, A16: 3, A21: 3, A22: 3, A25: 3, A27: 3,
      A28: 2, A4: 2
    }
  }
]

// Sessions de démonstration — PME fictives, écrites à la main.
//
// L'accueil annonce trois portes de même rang, dont une démonstration : un
// parcours pré-rempli qui montre ce que l'outil restitue sans rien avoir à
// saisir. Ce fichier en porte la matière — les organisations, leur contexte, ce
// qu'elles ont validé — et rien d'autre : la fabrication de l'état de session
// appartient à src/domain/demo-session.js, qui seul sait ce qu'est une clé de
// pratique ou un rang d'indicateur.
//
// Les trois cas ne sont pas trois variantes du même. Chacun place l'écart entre
// profil atteint et profil visé à un endroit différent de l'échelle de
// transformation, et c'est là tout ce qu'ils démontrent : sous la ligne
// évolutif / révolutionnaire, la franchissant, ou déjà refermé. La restitution
// tient un discours distinct dans chacun de ces cas (voir
// src/data/transformation.js) — sans trois cas, on n'en verrait qu'un.
//
// Deux réglages traversent les trois scénarios :
//
//   `wave`      jusqu'où le questionnaire est allé. À 1, la seconde série n'a
//               pas été ouverte et la restitution annonce des domaines non
//               évalués ; à 2, tout a été présenté et ce bloc disparaît.
//
//   `ranks`     les indicateurs de maturité ne se saisissent pas domaine par
//   `bias`      domaine ici : ils se déduisent de l'état du domaine — maîtrisé,
//               entamé, intact — puis se décalent par indicateur. Une
//               organisation qui nomme des responsables sans jamais doter les
//               initiatives le montre sur les 28 domaines à la fois, ce qu'une
//               saisie manuelle de 84 rangs rendrait illisible à écrire comme à
//               relire.
//
// Les identifiants de domaine (`mastered`, `partial`) sont ceux du modèle — A1 à
// A28, les vingt-cinq d'Ozkaya et al. (2026) et les trois de la neuvième
// dimension. `partial` compte des critères d'adoption validés, jamais des
// pratiques : c'est l'unité de saisie du questionnaire, et une démonstration ne
// doit pas produire un état que l'utilisateur ne pourrait pas atteindre lui-même.
//
// A5, A6 et A7 sont entrés dans la mesure le 18.08.2026 (voir docs/DECISIONS.md).
// Les trois scénarios les portent désormais : A6 relève du premier rang, A5 et A7
// du deuxième, et une PME fictive qui ne les aurait pas validés retomberait au
// profil « Préparation » — ce que ni son récit ni ce qu'elle est censée démontrer
// ne diraient plus.

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
      'révolutionnaire.',
    // Visé : « Alignement des processus ». Le formulaire le ramènera plus bas.
    transformation: 3,
    form: {
      scope: 'org', horizon: 'h3a',
      digital: 'low', data: 'none', devApproach: 'buy',
      literacy: 'mid', risk: 'moderate', staffing: 'contracted',
      governance: 'coordinated', deployment: 'project', roi: 'qualitative',
      ambition: 'sector',
      domain: 'industry', size: 'xs', footprint: 'regional'
    },
    wave: 1,
    // L'atelier sait pourquoi il s'y met — ses clients le lui demandent — mais
    // n'a ni enveloppe (A5) ni examen de ce que la solution suppose (A7).
    mastered: ['A6', 'A8', 'A13'],
    partial: { A1: 1, A11: 1, A17: 1, A24: 1 },
    ranks: { mastered: 3, partial: 2, untouched: 1 },
    bias: { accountability: 0, planning: 0, resourcing: -1 }
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
    transformation: 3,
    form: {
      scope: 'org', horizon: 'h3a',
      digital: 'mid', data: 'partial', devApproach: 'customize',
      literacy: 'mid', risk: 'moderate', staffing: 'shared',
      governance: 'coordinated', deployment: 'waves', roi: 'qualitative',
      ambition: 'sector',
      domain: 'health', size: 'm', footprint: 'national'
    },
    wave: 1,
    mastered: [
      'A6', 'A8', 'A13',
      'A1', 'A5', 'A7', 'A10', 'A11', 'A12', 'A17', 'A18', 'A19', 'A20', 'A23', 'A24', 'A26'
    ],
    partial: { A9: 1, A14: 1, A16: 1, A21: 1, A25: 1 },
    ranks: { mastered: 3, partial: 2, untouched: 1 },
    bias: { accountability: 1, planning: 0, resourcing: 0 }
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
    transformation: 3,
    form: {
      scope: 'org', horizon: 'h3a',
      digital: 'high', data: 'ready', devApproach: 'hybrid',
      literacy: 'mid', risk: 'moderate', staffing: 'shared',
      governance: 'crossfunctional', deployment: 'waves', roi: 'qualitative',
      ambition: 'sector',
      domain: 'other', size: 'l', footprint: 'national'
    },
    // La seconde série a été ouverte : tout a été présenté, et la restitution
    // n'a donc aucun domaine non évalué à mettre de côté.
    wave: 2,
    // Les trois premiers rangs du modèle, au complet : c'est ce qu'« Alignement
    // des processus » met en jeu, et rien de moins ne l'acquiert.
    mastered: [
      'A6', 'A8', 'A13',
      'A1', 'A5', 'A7', 'A10', 'A11', 'A12', 'A17', 'A18', 'A19', 'A20', 'A23', 'A24', 'A26',
      'A2', 'A3', 'A9', 'A14', 'A15', 'A16', 'A21', 'A22', 'A25', 'A27'
    ],
    // Au-delà du profil visé, le travail est entamé sans être poursuivi : c'est
    // ce que décrit une organisation qui s'arrête volontairement là.
    partial: { A28: 1, A4: 1 },
    ranks: { mastered: 3, partial: 2, untouched: 1 },
    bias: { accountability: 0, planning: 0, resourcing: -1 }
  }
]

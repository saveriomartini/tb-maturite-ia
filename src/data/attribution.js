// Attribution — d'où vient ce que l'outil affiche, et ce qu'il n'est pas.
//
// L'outil restitue un profil de maturité à partir d'un référentiel qu'il n'a pas
// écrit, sous des noms de paliers qui fusionnent deux échelles publiées. Sans
// attribution, un lecteur pressé lui prête l'autorité de ses sources : il croit
// lire le modèle du SEI, alors qu'il lit une traduction, un regroupement et un
// nommage qui appartiennent à ce travail. La ligne d'attribution est donc une
// pièce de la traçabilité, pas une politesse — elle vit au pied de tous les
// écrans et dans l'export, c'est-à-dire partout où un résultat peut être lu hors
// de l'outil.
//
// Ce fichier ne porte que la donnée. Le tableau qui détaille le rapprochement
// des échelles est ailleurs (src/data/info.js), et c'est le seul autre endroit,
// avec le rapport, où Venkatraman est nommé à l'écran.

export const LICENSE = 'CC BY-NC-ND'

// Une entrée par source, dans l'ordre de ce qu'elle apporte au modèle : le
// référentiel de base d'abord, puis les trois emprunts qui s'y ajoutent.
// `role` dit ce que la source fonde ici, et rien d'autre : une référence sans
// son rôle n'apprend pas au lecteur ce qu'il tient entre les mains.
export const SOURCES = [
  {
    ref: 'Ozkaya, I. et al. (2026). The AI Adoption Maturity Model v1.0. Carnegie Mellon University, Software Engineering Institute.',
    role:
      'Référentiel de base : les dimensions, les domaines de capacité, les critères, les ' +
      'pratiques et l’échelle à cinq niveaux. Employé sous licence ' + LICENSE + '.'
  },
  {
    ref: 'Venkatraman, N. (1994). IT-Enabled Business Transformation.',
    role:
      'Échelle de transformation : ce qui sépare qualitativement un niveau du suivant, et ' +
      'la ligne entre degrés évolutifs et révolutionnaires. Le rapprochement avec les cinq ' +
      'niveaux du référentiel de base est une lecture propre à ce travail.'
  },
  {
    ref: 'Elia, G. et al. (2024). Digital Transformation Canvas.',
    role: 'Regroupement des dimensions en quatre blocs, et vocabulaire du parcours.'
  },
  {
    ref: 'Bettoni, A. et al. (2021). IFAC.',
    role:
      'Fonde le domaine « Adéquation et proportionnalité de la solution (right-sizing) », ' +
      'ajouté au référentiel de base pour les PME.'
  }
]

// La phrase qui doit survivre à toutes les coupes : elle dit ce que l'outil
// n'est pas, et c'est le seul malentendu qui puisse nuire à quelqu'un.
export const DISCLAIMER =
  'Outil non officiel, sans lien avec le Software Engineering Institute (SEI) ni avec ' +
  'Accenture. Il applique un modèle publié ; il n’en est ni une publication, ni une ' +
  'certification, ni une évaluation reconnue par ses auteurs.'

// Forme courte, pour un pied de page où la liste complète ne tient pas : les
// quatre sources en une ligne, puis le démenti. C'est la version affichée par
// défaut ; SOURCES reste disponible pour l'export et l'écran d'information, où
// la place existe.
export const SHORT =
  'D’après Ozkaya et al. (2026), The AI Adoption Maturity Model v1.0 (CMU SEI, ' + LICENSE +
  ') ; Venkatraman (1994) ; Elia et al. (2024) ; Bettoni et al. (2021).'

export const ATTRIBUTION = {
  license: LICENSE,
  sources: SOURCES,
  disclaimer: DISCLAIMER,
  short: SHORT
}

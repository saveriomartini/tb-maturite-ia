// Profil « Préparation » — ajout hors AIMM.
//
// Ce profil n'existe ni dans le modèle CMU SEI / Accenture ni dans l'échelle de
// Venkatraman : il est ajouté sous le premier profil du modèle pour donner un
// point d'appui à une organisation qui n'a encore rien acquis. Il est tenu à
// l'écart de model-data.json, qui reste le report fidèle de la source.
//
// Il ne joue aucun rôle dans le calcul de la recommandation ni dans le
// périmètre : c'est un état de restitution, atteint dès qu'un nombre suffisant
// de pratiques est validé, et effacé dès que le premier profil du modèle
// (Exploration localisée) est acquis.

export const PREPARATION = {
  n: 0,
  name: 'Préparation',
  tag: 'Vous êtes en train de vous préparer à l’adoption de l’IA.',
  desc:
    'Vous vous préparez à l’adoption de l’IA. Les pratiques que vous avez déjà ' +
    'validées ne suffisent pas encore à couvrir le premier profil du modèle, mais ' +
    'elles montrent que le terrain se prépare : c’est de là que part toute ' +
    'trajectoire d’adoption. La liste des pratiques restantes figure à l’écran ' +
    'suivant — elle indique par où continuer.'
}

// Texte affiché tant que le seuil n'est pas franchi : aucun profil ne peut
// encore être qualifié, mais on ne renvoie pas l'utilisateur à un constat vide.
export const IN_PROGRESS = {
  name: 'Diagnostic en cours',
  desc:
    'Le diagnostic est encore trop peu avancé pour qualifier un profil. ' +
    'Continuez à valider les pratiques que votre organisation maîtrise : votre ' +
    'profil s’affichera dès les premières validées.'
}

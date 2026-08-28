// Texte de restitution tant qu'aucun palier ne peut être nommé — ajout hors AIMM.
//
// Ce n'est pas un profil, et il n'a pas de rang : c'est ce que la restitution
// dit quand il n'y a rien à qualifier. Il est tenu à l'écart de
// model-data.json, qui reste le report littéral de la source — même règle que
// pour statements.js et transformation.js.
//
// Son emploi s'est resserré avec l'échelle par énoncés. Tant que la mesure se
// comptait en critères d'adoption validés, une organisation pouvait répondre
// longtemps sans qu'aucun palier soit acquis, et il fallait un profil sous le
// premier pour ne pas ouvrir la restitution sur un constat de carence. L'énoncé
// de rang 1 décrivant l'absence, tout domaine renseigné porte désormais un
// niveau : le premier palier se lit sur les domaines du premier rang dès qu'ils
// sont tous situés. Ce texte ne couvre donc plus que le début du parcours —
// aucun domaine renseigné, ou le premier rang encore incomplet.
export const IN_PROGRESS = {
  name: 'Diagnostic en cours',
  desc:
    'Aucun palier ne peut encore être nommé : les domaines de capacité du premier rang ne ' +
    'sont pas tous situés. Un palier ne s’acquiert que lorsque tous les domaines qu’il attend ' +
    'l’atteignent — il n’y a donc rien à qualifier pour l’instant. Poursuivez le questionnaire : ' +
    'votre profil s’affichera dès que le premier rang sera complet.'
}

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
//
// — deux absences de palier, deux textes —
// Depuis que le premier palier exige le niveau 2 (DECISIONS.md, 08.09.2026),
// l'absence de palier a deux causes, et une seule phrase pour les deux disait
// faux dans la moitié des cas : une organisation qui a répondu sur tous les
// domaines du premier rang et les a tous laissés au niveau 1 lisait « poursuivez
// le questionnaire » alors qu'elle l'avait terminé. Le premier rang mesuré mais
// non tenu n'est pas un diagnostic inachevé, c'est un résultat — rien n'a encore
// été mis en place et confié à quelqu'un —, et c'est ce que dit NOT_ENGAGED.
// Ni l'un ni l'autre n'est un profil : ils n'ont pas de rang, ne sont pas dans
// l'échelle à cinq niveaux de la source, et n'entrent dans aucun calcul.
export const IN_PROGRESS = {
  name: 'Diagnostic en cours',
  desc:
    'Aucun palier ne peut encore être nommé : les domaines de capacité du premier rang ne ' +
    'sont pas tous situés. Un palier ne s’acquiert que lorsque tous les domaines qu’il attend ' +
    'l’atteignent — il n’y a donc rien à qualifier pour l’instant. Poursuivez le questionnaire : ' +
    'votre profil s’affichera dès que le premier rang sera complet.'
}

// Le premier rang a été mesuré, et il n'est pas tenu : les domaines qu'il
// attend sont tous situés, sans qu'ils atteignent tous le niveau 2. Le
// questionnaire a donc dit quelque chose de l'organisation, et le texte le lui
// rend au lieu de la renvoyer à une saisie déjà faite.
export const NOT_ENGAGED = {
  name: 'Encore en préparation',
  desc:
    'Les domaines de capacité du premier rang sont tous situés, mais ils n’atteignent pas tous ' +
    'le niveau où une chose est en place et confiée à quelqu’un : le premier palier n’est donc ' +
    'pas acquis, et il n’y a pas de profil à nommer. Ce n’est pas un diagnostic incomplet, c’est ' +
    'un point de départ — les écarts ci-dessous nomment ce qui sépare du premier palier.'
}

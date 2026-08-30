// — périmètre de l’évaluation —
// Le modèle source évalue une *organizational unit*, pas nécessairement
// l'entreprise entière : « for the selected organizational scope » ouvre la
// dimension Organizational Strategy (docs/MODEL_EXTRAS.md, § 4.4). L'attribut
// de contexte `scope` porte cette unité depuis le cadrage, mais il n'y servait
// qu'à plafonner le profil recommandé — il ne reparaissait ni dans la
// restitution ni dans l'export.
//
// C'est pourtant l'information qui manque le plus en aval. Deux organisations
// peuvent s'arrêter au même profil pour des raisons opposées : l'une a
// délibérément restreint son adoption à une fonction, l'autre visait large et
// n'y est pas arrivée. Le rang ne les distingue pas — le référentiel décrit au
// deuxième profil des cas d'usage intégrés aux processus internes, il ne dit
// pas « un seul processus », et l'étroitesse y est une propriété du stade, pas
// une décision enregistrée. Le périmètre déclaré, lui, les distingue : le dire
// en tête rattache le résultat à ce que l'organisation a prétendu couvrir.
//
// Un document qui ne nomme pas l'organisation qu'il évalue se lit comme un
// verdict sur l'entreprise entière. La nommer ne corrige aucun calcul — rien ici
// n'entre dans le scoring — mais rend la restitution opposable.

import { optionLabel } from '../data/context-attributes.js'

// L'intitulé est celui du cadrage, mot pour mot : c'est la même question,
// posée là et rappelée ici. Elle s'appelait « Organisation évaluée » en
// restitution et « Périmètre de l'évaluation » au formulaire, et deux noms pour
// un seul attribut obligeaient le lecteur à refaire le rapprochement — celui-là
// même dont dépend la portée qu'il accorde au verdict.
export const EVALUATION_UNIT_LABEL = 'Périmètre de l’évaluation'

// Le périmètre est facultatif au cadrage : seul le degré de transformation est
// exigé. Non renseigné, il ne se tait pas — l'absence est justement le cas où
// le malentendu est le plus probable, et elle se déclare donc comme telle. La
// note dit la lecture par défaut, qui est aussi celle du calcul : un attribut
// vide y vaut le score maximal (voir UNANSWERED_SCORE dans recommendation.js).
// Masculin : la ligne s'intitule « Périmètre de l'évaluation » et non plus
// « Organisation évaluée », et la valeur s'accorde avec son intitulé.
export const UNDECLARED_UNIT = 'Non déclaré'
export const UNDECLARED_NOTE =
  'Faute de périmètre déclaré, ces résultats se lisent comme portant sur l’entreprise entière.'

// Un périmètre déclaré se nomme et rien de plus : la conséquence de lecture se
// tire d'elle-même, et l'écrire à chaque fois ferait de la ligne un avertissement
// là où elle n'est qu'une identité. Seule l'absence est commentée.
export function evaluationUnit(form) {
  const value = form.scope
  const label = value == null ? '' : optionLabel('scope', value)
  if (!label) {
    return { label: EVALUATION_UNIT_LABEL, value: UNDECLARED_UNIT, note: UNDECLARED_NOTE, declared: false }
  }
  return { label: EVALUATION_UNIT_LABEL, value: label, note: null, declared: true }
}

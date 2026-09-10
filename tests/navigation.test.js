// La règle de progression du questionnaire : où déposer l'utilisateur après une
// réponse.
//
// Elle vit dans `domain/navigation.js` et non dans l'écran, pour être vérifiable
// sans navigateur : ce qu'elle décide est le choix d'un domaine dans une liste,
// et rien de ce qui s'affiche n'y entre. L'écran garde ce qui le regarde — à
// quel moment défiler, et s'en abstenir quand la réponse vient du clavier.
//
// Ce qui se joue ici est une promesse faite à l'utilisateur : une réponse le
// mène à une question qui n'en a pas. Un défilement qui le ramènerait sur un
// domaine déjà rempli, ou qui remonterait la page sans nécessité, est le défaut
// que ces cas ferment.

import { describe, expect, it } from 'vitest'
import { nextEmptyAreaId } from '../src/domain/navigation.js'

// Une liste de domaines telle que le view-model la rend : l'ordre du modèle, et
// un drapeau qui dit si le domaine porte une réponse — hors périmètre compris.
function areas(pattern) {
  return pattern.split('').map((mark, index) => ({
    id: `A${index + 1}`,
    answered: mark === 'x'
  }))
}

describe('le domaine vide suivant', () => {
  it('descend jusqu’au premier domaine sans réponse', () => {
    // A1 vient d'être répondu ; A2 l'est déjà, A3 ne l'est pas.
    expect(nextEmptyAreaId(areas('xx..'), 'A1')).toBe('A3')
  })

  it('ne renvoie jamais sur le domaine qu’on vient de répondre', () => {
    // Le drapeau du domaine de départ est encore à faux au moment du clic :
    // l'état n'a pas été recalculé. La règle le tient pour répondu quand même,
    // faute de quoi elle ferait défiler sur place.
    expect(nextEmptyAreaId(areas('..x.'), 'A1')).toBe('A2')
    expect(nextEmptyAreaId(areas('.xx.'), 'A1')).toBe('A4')
  })

  it('remonte au premier domaine sauté quand il n’y a plus rien en dessous', () => {
    // A2 est resté vide, on répond A4 : il ne reste que lui, et remonter est le
    // seul moyen de l’atteindre.
    expect(nextEmptyAreaId(areas('x.x.'), 'A4')).toBe('A2')
  })

  it('ne rend rien quand tous les domaines portent une réponse', () => {
    // Le questionnaire est complet : la suite du parcours se prend en bas de
    // page, et ce n'est pas à la dernière réponse de l'y emmener.
    expect(nextEmptyAreaId(areas('xxx.'), 'A4')).toBeNull()
    expect(nextEmptyAreaId(areas('xxxx'), 'A2')).toBeNull()
  })

  it('parcourt toute la liste quand le domaine de départ lui est étranger', () => {
    // Cas de robustesse : un identifiant qui n'est pas dans la liste ne doit pas
    // faire rendre le mauvais domaine ni lever — la règle repart alors du haut.
    expect(nextEmptyAreaId(areas('x.'), 'Z9')).toBe('A2')
    expect(nextEmptyAreaId([], 'A1')).toBeNull()
    expect(nextEmptyAreaId(undefined, 'A1')).toBeNull()
  })
})

// Ce que `src/` ne contient plus.
//
// Les trois autres suites lisent le calcul, les view-models et les templates :
// aucune ne voit ce qui reste *branché* dans le dépôt. Or les régressions de ce
// dépôt viennent des effets à distance — un module retiré mais encore importé
// dans un écran où personne ne passe, un composant supprimé dont l'import
// survit, un chemin qui ne casse qu'à l'exécution. Ces contrôles portent donc
// sur les fichiers eux-mêmes, et sur ce qu'ils citent.
//
// Ils ne remplacent pas un test de comportement : rien ici ne vérifie que
// l'outil calcule juste. Ils vérifient qu'une suppression a bien été menée
// jusqu'au bout, ce qu'aucun test de comportement ne peut faire — un import
// mort ne change aucun résultat, il attend le remaniement suivant.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const SRC = new URL('../src/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

// Tous les fichiers de code de src/, à plat. Le JSON du modèle est exclu : il
// est le report littéral de la source AIMM, il porte légitimement les critères
// d'adoption et les pratiques, et il n'importe rien.
function sourceFiles(dir = SRC, found = []) {
  readdirSync(dir).forEach(entry => {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) return sourceFiles(path, found)
    if (/\.(js|vue)$/.test(entry)) found.push(path)
  })
  return found
}

const FILES = sourceFiles().map(path => ({
  path: path.slice(SRC.length).replace(/\\/g, '/'),
  text: readFileSync(path, 'utf8')
}))

describe('le profil « Préparation » n’est plus branché nulle part', () => {
  // Le profil hors modèle placé sous « Exploration localisée » a été retiré :
  // l'échelle par énoncés a supprimé le cas qu'il traitait. Ce qui doit avoir
  // disparu, c'est le module et ses symboles — un import survivant ferait
  // échouer le build, mais un symbole réintroduit à la main passerait inaperçu.
  it('aucun fichier n’importe le module supprimé', () => {
    FILES.forEach(file => {
      expect(file.text, file.path).not.toMatch(/from\s+'[^']*preparation\.js'/)
    })
  })

  it('aucun fichier ne nomme PREPARATION ni preparationReached', () => {
    FILES.forEach(file => {
      expect(file.text, file.path).not.toContain('PREPARATION')
      expect(file.text, file.path).not.toContain('preparationReached')
    })
  })

  // Le texte affiché tant qu'aucun palier n'est nommé, lui, reste : il n'a
  // jamais été un profil, et il vit désormais dans un fichier qui dit ce qu'il
  // porte.
  it('le texte « diagnostic en cours » a survécu, dans in-progress.js', () => {
    const home = FILES.find(file => file.path === 'data/in-progress.js')
    expect(home).toBeDefined()
    expect(home.text).toContain('export const IN_PROGRESS')
  })
})

describe('les deux composants de restitution du backlog existent et sont branchés', () => {
  // Lignes 3.5 et 3.6 de docs/logs/BACKLOG.md. Un composant peut exister sans
  // être monté nulle part — le build ne s'en plaint pas, et il ne se voit qu'à
  // l'écran, sur une page où personne ne passe.
  it('MaturityLadder.vue existe et la synthèse le monte', () => {
    expect(FILES.some(file => file.path === 'components/MaturityLadder.vue')).toBe(true)
    const summary = FILES.find(file => file.path === 'components/screens/ScreenResti1.vue')
    expect(summary.text).toContain('<MaturityLadder')
  })

  it('DimensionRadar.vue existe et la synthèse le monte', () => {
    expect(FILES.some(file => file.path === 'components/DimensionRadar.vue')).toBe(true)
    const summary = FILES.find(file => file.path === 'components/screens/ScreenResti1.vue')
    expect(summary.text).toContain('<DimensionRadar')
  })

  // La maquette reste où elle est : le composant ne l'importe pas, et elle ne
  // devient pas la source du composant. Les deux vivent leur vie — c'est le prix
  // de l'autonomie de la maquette, qui s'ouvre par double-clic.
  it('aucun fichier de src/ ne dépend de la maquette de docs/proto/', () => {
    FILES.forEach(file => {
      expect(file.text, file.path).not.toContain('radar-dimensions.html')
    })
  })
})

describe('les critères d’adoption et les pratiques ne sont plus lus par le questionnaire', () => {
  // Ils restent dans le modèle — model-data.json ne s'amincit pas — mais plus
  // rien de src/ ne les parcourt : l'unité de réponse est l'énoncé, et lui seul.
  it('aucun fichier ne lit `.goals` ni `.practices`', () => {
    FILES.forEach(file => {
      expect(file.text, file.path).not.toMatch(/\.goals\b/)
      expect(file.text, file.path).not.toMatch(/\.practices\b/)
    })
  })

  it('le composant de rappel des critères a disparu, import compris', () => {
    expect(FILES.some(file => file.path === 'components/CriteriaReference.vue')).toBe(false)
    FILES.forEach(file => {
      expect(file.text, file.path).not.toContain('CriteriaReference')
    })
  })
})

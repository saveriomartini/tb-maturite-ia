// Contrôle de cohérence entre le modèle et ses énoncés descriptifs.
//
// `model-data.json` porte les 28 domaines de capacité ; `src/data/statements.js`
// doit porter, pour chacun, cinq énoncés numérotés de 1 à 5. Rien dans le code
// ne rapproche ces deux fichiers à l'exécution — un domaine oublié ne se verrait
// qu'à l'écran, sur l'écran où il manque, et seulement si quelqu'un y passe.
//
// Deux modes, et le motif de leur séparation :
//   — par défaut, le script n'échoue que sur ce qui est *cassé* : un domaine
//     sans jeu d'énoncés, un jeu qui n'en compte pas cinq, des rangs hors
//     séquence, un `text` qui n'est pas une chaîne, une clé qui ne correspond à
//     aucun domaine. Un énoncé encore vide n'est pas une erreur : c'est de la
//     rédaction qui n'a pas eu lieu. C'est ce mode qui est branché sur `lint`,
//     donc sur l'intégration continue — y brancher le mode strict rendrait
//     celle-ci rouge pendant toute la durée de la rédaction, et une CI rouge en
//     permanence ne signale plus rien ;
//   — `--strict` échoue en plus sur tout `text` vide. C'est le mode que la
//     livraison devra passer : le jour où il sort en 0, les 140 énoncés sont
//     écrits.
//
// Dans les deux cas le script dit où en est la rédaction, sur stderr, pour que
// l'avancement se lise sans ouvrir le fichier.
//
// `model-data.json` est lu avec node:fs plutôt qu'importé : l'import de JSON
// exige un attribut d'import dont la syntaxe dépend de la version de Node, et
// ce script doit tourner partout sans qu'on ait à s'en soucier.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { STATEMENTS, STATEMENT_RANKS } from '../src/data/statements.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const model = JSON.parse(readFileSync(join(root, 'src/data/model-data.json'), 'utf8'))

const strict = process.argv.includes('--strict')

// L'ordre du modèle, pas celui de STATEMENTS : c'est le modèle qui fait foi sur
// la liste des domaines à couvrir.
const areas = model.blocks.flatMap((block) =>
  block.dimensions.flatMap((dimension) =>
    dimension.areas.map((area) => ({ id: area.id, name: area.name }))
  )
)

const errors = []
const pending = []
let written = 0

for (const area of areas) {
  const set = STATEMENTS[area.id]

  if (!Array.isArray(set)) {
    errors.push(`${area.id} — ${area.name} : aucun jeu d'énoncés dans STATEMENTS`)
    continue
  }

  if (set.length !== STATEMENT_RANKS.length) {
    errors.push(`${area.id} : ${set.length} énoncés au lieu de ${STATEMENT_RANKS.length}`)
  }

  const missing = []

  set.forEach((statement, index) => {
    const expected = STATEMENT_RANKS[index]
    if (statement.n !== expected) {
      errors.push(`${area.id} : rang ${statement.n} en position ${index + 1}, attendu ${expected}`)
    }
    if (typeof statement.text !== 'string') {
      errors.push(`${area.id}, rang ${statement.n} : \`text\` n'est pas une chaîne`)
      return
    }
    if (statement.text.trim() === '') {
      missing.push(statement.n)
      if (strict) {
        errors.push(`${area.id}, rang ${statement.n} : énoncé vide`)
      }
    } else {
      written += 1
    }
  })

  if (missing.length > 0) {
    pending.push(`${area.id} — ${area.name} : rangs ${missing.join(', ')}`)
  }
}

// L'inverse : une clé de STATEMENTS qui ne correspond à aucun domaine du modèle.
// Elle passerait inaperçue — personne ne la lit — tout en laissant croire que le
// travail de rédaction a porté sur un domaine qui n'existe pas.
const known = new Set(areas.map((area) => area.id))
for (const id of Object.keys(STATEMENTS)) {
  if (!known.has(id)) {
    errors.push(`${id} : clé de STATEMENTS sans domaine correspondant dans model-data.json`)
  }
}

for (const error of errors) {
  process.stderr.write(`  ✗ ${error}\n`)
}

if (pending.length > 0) {
  process.stderr.write(`\nÀ rédiger (${pending.length} domaines) :\n`)
  for (const line of pending) {
    process.stderr.write(`  · ${line}\n`)
  }
}

const total = areas.length * STATEMENT_RANKS.length
process.stderr.write(`\n${areas.length} domaines · ${written}/${total} énoncés écrits\n`)

process.exit(errors.length > 0 ? 1 : 0)

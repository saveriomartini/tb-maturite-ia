// L'attribut `aiVisibility` (DECISIONS, 29.10.2026) : ce que la direction sait
// des outils d'IA que ses collaborateurs utilisent. Trois propriétés tiennent
// la décision, et chacune se vérifie ici : il n'entre dans aucun calcul, la
// restitution nomme les domaines qui en dépendent quand aucun relevé n'est tenu,
// et il ne sort pas dans le fichier de partage.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useMaturityTool } from '../src/composables/useMaturityTool.js'
import {
  ALL_FIELDS, LEVEL5_REQUIREMENTS, LEVEL_CAPS, VISIBILITY_BLIND,
  VISIBILITY_DEPENDENT_AREAS, VISIBILITY_FIELD, fieldById
} from '../src/data/context-attributes.js'
import { EVALUABLE_AREAS } from '../src/domain/model.js'
import { buildRecommendation } from '../src/domain/recommendation.js'
import { SHARE, serialize } from '../src/domain/session-file.js'

beforeEach(() => {
  vi.stubGlobal('window', { scrollTo: () => {} })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const field = fieldById(VISIBILITY_FIELD)
const values = field.opts.map(opt => opt[0])

describe('l’attribut de connaissance des usages', () => {
  it('fait partie du cadrage, sans axe ni plafond', () => {
    expect(ALL_FIELDS.map(f => f.id)).toContain(VISIBILITY_FIELD)
    expect(field.axis).toBeNull()
    expect(LEVEL_CAPS.some(cap => cap.field === VISIBILITY_FIELD)).toBe(false)
    expect(LEVEL5_REQUIREMENTS.some(req => req.field === VISIBILITY_FIELD)).toBe(false)
    expect(values).toEqual(['unasked', 'hearsay', 'inventory'])
  })

  it('ne change pas le niveau recommandé, quelle que soit la réponse', () => {
    const base = {}
    ALL_FIELDS.forEach(f => { if (f.id !== VISIBILITY_FIELD) base[f.id] = f.opts[1][0] })
    const levels = values.map(v => buildRecommendation({ ...base, [VISIBILITY_FIELD]: v }).level)
    expect(new Set(levels).size).toBe(1)
  })

  it('désigne quatre domaines existants', () => {
    const ids = EVALUABLE_AREAS.map(area => area.id)
    VISIBILITY_DEPENDENT_AREAS.forEach(id => expect(ids).toContain(id))
  })
})

describe('la note de restitution', () => {
  function withVisibility(value) {
    const tool = useMaturityTool()
    tool.actions.loadDemo('rochat')
    if (tool.state.form[VISIBILITY_FIELD] !== value) {
      tool.state.form = { ...tool.state.form, [VISIBILITY_FIELD]: value }
    }
    return tool
  }

  it('nomme les domaines dépendants quand aucun relevé n’est tenu, sans toucher au profil', () => {
    const reference = withVisibility('inventory').resti1.acquiredLabel
    VISIBILITY_BLIND.forEach(value => {
      const tool = withVisibility(value)
      const note = tool.resti1.visibilityNote
      expect(note).toBeTruthy()
      VISIBILITY_DEPENDENT_AREAS.forEach(id => {
        expect(note).toContain(EVALUABLE_AREAS.find(area => area.id === id).name)
      })
      expect(tool.resti1.acquiredLabel).toBe(reference)
    })
  })

  it('se tait quand un relevé est tenu ou que la question est laissée sans réponse', () => {
    expect(withVisibility('inventory').resti1.visibilityNote).toBeNull()
    expect(withVisibility(null).resti1.visibilityNote).toBeNull()
  })
})

describe('le fichier de partage', () => {
  it('ne porte pas l’attribut', () => {
    const tool = withDemo()
    const shared = JSON.parse(serialize(SHARE, tool.state, new Date(2026, 9, 29)))
    expect(shared.state.form[VISIBILITY_FIELD]).toBeUndefined()
  })
})

function withDemo() {
  const tool = useMaturityTool()
  tool.actions.loadDemo('rochat')
  return tool
}

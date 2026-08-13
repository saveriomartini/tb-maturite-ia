// État de session et view-models d'écran.
//
// Le composable ne produit que des *données* : libellés, drapeaux, listes. Toute
// décision d'apparence appartient aux composants et à leur CSS. Chaque écran a
// son propre view-model calculé (`computed`), donc paresseux : seul celui de
// l'écran affiché est évalué.

import { computed, reactive } from 'vue'
import { CONTEXT_GROUPS, DESCRIPTIVE_FIELDS } from '../data/context-attributes.js'
import { JOURNEY } from '../data/journey.js'
import { AREAS, BLOCKS, DIMENSION_COUNT, LEVELS, levelDescription, levelLabel, scopedAreas } from '../domain/model.js'
import { NEXT_OF, PHASE_ENTRY, PHASE_OF, SCREENS, previousScreen } from '../domain/navigation.js'
import { buildRecommendation } from '../domain/recommendation.js'
import {
  acquiredLevel, areaStats, blockTotals, gapGroups, missingPracticeCount, practiceKey
} from '../domain/scoring.js'
import { clearSession, loadSession, newSessionId, persistSession } from './useSessionStorage.js'

const DEFAULT_TARGET = 2
const MODEL_VERSION = 'v1'
const GAP_GROUPS_PER_PAGE = 4

const RESET_CONFIRMATION =
  'Réinitialiser la session ? Les attributs de contexte, le niveau cible et les pratiques validées seront effacés.'

const NO_LEVEL_DESCRIPTION =
  'Aucun niveau n’est encore acquis : au moins une des areas attendues au Level 1 ' +
  'n’a pas tous ses objectifs atteints. Un niveau est acquis lorsque toutes les areas ' +
  'attendues jusqu’à ce niveau le sont, sans exception — un seul objectif inachevé ' +
  'suffit à retenir l’ensemble. Le détail des pratiques restantes figure à l’écran suivant.'

function defaultState() {
  return {
    screen: 'home',
    diagIdx: 0,
    checked: {},
    openLevels: {},
    target: DEFAULT_TARGET,
    form: {},
    showContext: false,
    session: newSessionId()
  }
}

function scrollToTop() {
  window.scrollTo(0, 0)
}

function today() {
  return new Intl.DateTimeFormat('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date())
}

export function useMaturityTool() {
  const restored = loadSession(SCREENS)
  const state = reactive({ ...defaultState(), ...restored })
  const wasRestored = Boolean(restored)
  persistSession(state)

  // — dérivations communes à plusieurs écrans —

  const scoped = computed(() => scopedAreas(state.target))
  const recommendation = computed(() => buildRecommendation(state.form))
  const acquired = computed(() => acquiredLevel(scoped.value, state.checked, state.target))
  const gaps = computed(() => gapGroups(scoped.value, state.checked))

  // L'index courant est borné : réduire le niveau cible peut raccourcir la liste
  // des areas sous les pieds du questionnaire.
  const diagIndex = computed(() => Math.min(state.diagIdx, Math.max(0, scoped.value.length - 1)))
  const currentArea = computed(() => scoped.value[diagIndex.value] || null)

  const scopeSummary = computed(() => {
    const dimensions = new Set(scoped.value.map(area => area.dimId)).size
    return `ici ${scoped.value.length} areas parmi ${dimensions} dimensions ` +
      `(sur ${AREAS.length} areas / ${DIMENSION_COUNT} dimensions)`
  })

  const targetLabel = computed(() => levelLabel(state.target))
  // « Aucun » plutôt que « Non atteint » : le libellé qualifie le niveau acquis,
  // et voisine le niveau cible — « non atteint » se lisait comme un constat sur
  // la cible, pas sur l'acquis.
  const acquiredLabel = computed(() => (acquired.value ? levelLabel(acquired.value) : 'Aucun'))

  const answeredCount = computed(() => Object.keys(state.form).filter(id => state.form[id] != null).length)
  const hasProgress = computed(() =>
    answeredCount.value > 0 ||
    Object.keys(state.checked).length > 0 ||
    state.target !== DEFAULT_TARGET ||
    state.screen !== 'home'
  )

  // — navigation et mutations —

  function go(screen) {
    if (screen === 'diagStart' || screen === 'home') state.diagIdx = 0
    state.screen = screen
    scrollToTop()
  }

  const nav = {
    home: () => go('home'),
    start: () => go('cadrage1'),
    phase: screen => { if (screen) go(screen) },
    back() {
      // Dans le questionnaire, « précédent » recule d'une area avant de quitter
      // l'écran ; l'aperçu d'export revient à la liste du gap.
      if (state.screen === 'diag' && state.diagIdx > 0) {
        state.diagIdx -= 1
        scrollToTop()
        return
      }
      if (state.screen === 'export') {
        go('resti3')
        return
      }
      go(previousScreen(state.screen))
    },
    next() {
      if (state.screen === 'diag') {
        if (state.diagIdx + 1 < scoped.value.length) {
          state.diagIdx += 1
          scrollToTop()
        } else {
          go('resti1')
        }
        return
      }
      go(NEXT_OF[state.screen] || 'resti3')
    },
    exportPreview: () => go('export'),
    finish: () => go('home')
  }

  const actions = {
    togglePractice(key) {
      state.checked[key] = !state.checked[key]
    },
    toggleLevelDetail(n) {
      state.openLevels[n] = !state.openLevels[n]
    },
    toggleDescriptiveContext() {
      state.showContext = !state.showContext
    },
    // Recliquer sur l'option retenue l'annule : l'attribut redevient non renseigné.
    selectOption(fieldId, value) {
      state.form = { ...state.form, [fieldId]: state.form[fieldId] === value ? null : value }
    },
    selectTarget(n) {
      state.target = n
      state.diagIdx = 0
    },
    applyRecommendation() {
      actions.selectTarget(recommendation.value.level)
    },
    goToArea(index) {
      if (index < 0) return
      state.diagIdx = index
      scrollToTop()
    },
    resetSession() {
      if (!window.confirm(RESET_CONFIRMATION)) return
      clearSession()
      Object.assign(state, defaultState())
      scrollToTop()
    }
  }

  // — view-models par écran —

  const header = computed(() => ({
    sessionLabel: `session ${state.session} · ${targetLabel.value} (cible)` +
      (wasRestored && hasProgress.value ? ' · restaurée' : ''),
    hasProgress: hasProgress.value,
    phases: JOURNEY.map((phase, index) => ({
      n: phase.n,
      name: phase.name,
      desc: phase.steps[0],
      active: PHASE_OF[state.screen] === index + 1,
      screen: PHASE_ENTRY[index]
    }))
  }))

  const home = computed(() => ({
    journey: JOURNEY.map((phase, index) => ({
      n: phase.n,
      name: phase.name,
      steps: phase.steps,
      frictions: phase.frictions,
      opps: phase.opps,
      outOfScope: !PHASE_ENTRY[index]
    }))
  }))

  const cadrage1 = computed(() => ({
    blocks: BLOCKS.map(block => ({
      id: block.id,
      name: block.name,
      dimensionColors: block.dimensions.map(dimension => dimension.color),
      dimensions: block.dimensions.map(dimension => ({
        id: dimension.id,
        name: dimension.name,
        color: dimension.color,
        areas: dimension.areas.map(area => ({ id: area.id, name: area.name, pending: area.pending }))
      }))
    })),
    levels: LEVELS.map(level => ({
      n: level.n,
      label: levelLabel(level.n),
      tag: level.tag,
      detail: level.detail || [],
      open: Boolean(state.openLevels[level.n])
    }))
  }))

  function buildField(field) {
    const value = state.form[field.id]
    return {
      id: field.id,
      label: field.label,
      hint: field.hint,
      options: field.opts.map(([optionValue, optionLabelText]) => ({
        value: optionValue,
        label: optionLabelText,
        active: value === optionValue
      }))
    }
  }

  // Facteurs affichés sous la recommandation : ce qui la tire vers le haut, ce
  // qui la retient, et les règles qui l'ont éventuellement plafonnée.
  function recommendationFactors(rec) {
    const factors = []
    if (!rec.empty) {
      factors.push({
        key: 'Ambition',
        value: `Level ${rec.ambitionLevel}` + (rec.drivers.length ? ` — ${rec.drivers.join(', ')}` : '')
      })
      factors.push({
        key: 'Capacité',
        value: `Level ${rec.capacityLevel}` + (rec.limits.length ? ` — ${rec.limits.join(', ')}` : '')
      })
    }
    if (rec.cappedByCapacity && !rec.capNotes.length) {
      factors.push({ key: 'Ajustement', value: 'l’ambition dépasse la capacité actuelle de plus d’un niveau' })
    }
    if (rec.capNotes.length) {
      factors.push({ key: 'Plafond', value: `Level ${rec.level} — ${rec.capNotes.map(cap => cap.why).join(' ; ')}` })
    }
    if (rec.level5Missing.length) {
      factors.push({ key: 'Level 5', value: `exige ${rec.level5Missing.map(req => req.why).join(', ')}` })
    }
    return factors
  }

  const cadrage3 = computed(() => {
    const rec = recommendation.value
    const mismatch = !rec.empty && state.target !== rec.level
    return {
      groups: CONTEXT_GROUPS.map(group => ({
        id: group.id,
        label: group.label,
        fields: group.fields.map(buildField)
      })),
      descriptiveFields: DESCRIPTIVE_FIELDS.map(buildField),
      showContext: state.showContext,
      contextToggleLabel: `${state.showContext ? '− masquer' : '+ afficher'} le contexte descriptif`,
      recommendation: {
        label: levelLabel(rec.level),
        why: rec.empty
          ? 'Renseignez les attributs de contexte : le niveau cible est déduit de votre ambition d’adoption et de la capacité que vous pouvez soutenir.'
          : 'Le niveau recommandé ne dépasse jamais d’un cran la capacité actuelle, puis les facteurs bloquants le plafonnent. Vous pouvez retenir un autre niveau cible ci-dessous.',
        factors: recommendationFactors(rec),
        provisional: !rec.complete,
        completenessLabel: `${rec.answered} / ${rec.total} attributs renseignés`,
        completenessPercent: Math.round(rec.answered / rec.total * 100),
        canApply: mismatch,
        applyLabel: `Appliquer le Level ${rec.level}`
      },
      targetOptions: LEVELS.map(level => ({
        n: level.n,
        label: levelLabel(level.n),
        active: state.target === level.n,
        recommended: level.n === rec.level && !rec.empty
      })),
      mismatchLabel: mismatch
        ? `Choix manuel : le niveau retenu (Level ${state.target}) diffère de la recommandation (Level ${rec.level}).`
        : '',
      scopeSummary: scopeSummary.value
    }
  })

  const diagStart = computed(() => ({
    targetLabel: targetLabel.value,
    scopeSummary: scopeSummary.value,
    blocks: BLOCKS.map(block => ({
      id: block.id,
      name: block.name,
      dimensions: block.dimensions.map(dimension => ({
        id: dimension.id,
        name: dimension.name,
        color: dimension.color,
        areas: dimension.areas.map(area => ({
          id: area.id,
          label: area.name + (area.pending ? ' — à définir' : ` · L${area.level}`),
          pending: area.pending,
          inScope: !area.pending && area.level <= state.target
        }))
      }))
    }))
  }))

  // Index de la première area en périmètre d'une dimension, -1 si la dimension
  // est entièrement hors périmètre : sert aussi de test d'accessibilité du lien.
  function firstAreaOfDimension(dimensionId) {
    return scoped.value.findIndex(area => area.dimId === dimensionId)
  }

  const diag = computed(() => {
    const area = currentArea.value
    const stats = area ? areaStats(area, state.checked) : null
    const currentBlock = area ? BLOCKS.find(block => block.id === area.blockId) : null

    function dimensionLink(dimension) {
      const index = firstAreaOfDimension(dimension.id)
      return {
        id: dimension.id,
        name: dimension.name,
        color: dimension.color,
        index,
        available: index >= 0,
        active: Boolean(area) && dimension.id === area.dimId
      }
    }

    return {
      levelLabel: area ? levelLabel(area.level) : targetLabel.value,
      progress: `Area ${diagIndex.value + 1} / ${scoped.value.length} · ${area ? area.dim : ''}`,
      nextLabel: diagIndex.value + 1 < scoped.value.length ? 'Suivant' : 'Terminer',
      dimensions: BLOCKS.flatMap(block => block.dimensions.map(dimensionLink)),
      blockName: area ? area.block : '',
      blockDimensions: currentBlock ? currentBlock.dimensions.map(dimensionLink) : [],
      area: {
        name: area ? area.name : '',
        desc: area ? area.desc : '',
        color: area ? area.dimColor : 'transparent',
        exampleArtifacts: area ? area.exampleArtifacts || [] : [],
        scoreLabel: stats
          ? `Objectifs atteints ${stats.goalsDone}/${stats.goalsTotal} · ` +
            `Pratiques validées ${stats.practicesDone}/${stats.practicesTotal}`
          : '',
        hint: stats && stats.acquired ? 'area acquise' : 'tous les objectifs doivent être atteints'
      },
      goals: area
        ? area.goals.map((goal, goalIndex) => ({
          label: `Objectif ${goalIndex + 1} :`,
          text: goal.goal,
          done: goal.practices.every(
            (practice, practiceIndex) => state.checked[practiceKey(area.id, goalIndex, practiceIndex)]
          ),
          practices: goal.practices.map((practice, practiceIndex) => {
            const key = practiceKey(area.id, goalIndex, practiceIndex)
            return { key, text: practice, checked: Boolean(state.checked[key]) }
          })
        }))
        : []
    }
  })

  const resti1 = computed(() => ({
    targetLabel: targetLabel.value,
    acquiredLabel: acquiredLabel.value,
    acquiredDesc: acquired.value ? levelDescription(acquired.value) : NO_LEVEL_DESCRIPTION,
    ladder: LEVELS.map(level => ({
      n: level.n,
      label: levelLabel(level.n),
      acquired: level.n === acquired.value,
      isTarget: level.n === state.target,
      reached: level.n <= acquired.value,
      beyondTarget: level.n > state.target
    })),
    // Le bloc ne porte pas de niveau : il regroupe des areas pour la lecture,
    // l'escalier se joue sur le périmètre entier.
    blocks: BLOCKS.map(block => {
      const totals = blockTotals(scoped.value, state.checked, block.id)
      return {
        id: block.id,
        name: block.name,
        dimensionColors: block.dimensions.map(dimension => dimension.color),
        goals: `${totals.goalsDone}/${totals.goalsTotal}`,
        practices: `${totals.practicesDone}/${totals.practicesTotal}`,
        percent: totals.practicesTotal ? Math.round(totals.practicesDone / totals.practicesTotal * 100) : 0
      }
    })
  }))

  const resti2 = computed(() => ({
    targetLabel: targetLabel.value,
    acquiredLabel: acquiredLabel.value,
    blocks: BLOCKS.map(block => ({
      id: block.id,
      name: block.name,
      rows: block.dimensions.flatMap(dimension =>
        scoped.value
          .filter(area => area.dimId === dimension.id)
          .map((area, indexInDimension) => {
            const stats = areaStats(area, state.checked)
            return {
              id: area.id,
              dim: indexInDimension === 0 ? dimension.name : '',
              firstOfDimension: indexInDimension === 0,
              color: dimension.color,
              area: area.name,
              goals: `${stats.goalsDone}/${stats.goalsTotal}`,
              practices: `${stats.practicesDone}/${stats.practicesTotal}`,
              acquired: stats.acquired
            }
          })
      )
    }))
  }))

  const resti3 = computed(() => {
    const groups = gaps.value
    return {
      targetLabel: targetLabel.value,
      acquiredLabel: acquiredLabel.value,
      gapSummary: `${missingPracticeCount(groups)} pratiques manquantes réparties sur ` +
        `${groups.length} areas de compétence`,
      blocks: BLOCKS
        .map(block => ({
          id: block.id,
          name: block.name,
          groups: groups.filter(group => group.blockId === block.id)
        }))
        .filter(block => block.groups.length > 0)
    }
  })

  const exportPreview = computed(() => {
    const groups = gaps.value
    const pages = []
    for (let i = 0; i < groups.length; i += GAP_GROUPS_PER_PAGE) {
      pages.push(groups.slice(i, i + GAP_GROUPS_PER_PAGE))
    }
    if (!pages.length) pages.push([])
    return {
      meta: `Export ${today()} · model: ${MODEL_VERSION} · session: ${state.session}`,
      targetLabel: targetLabel.value,
      acquiredLabel: acquiredLabel.value,
      pages: pages.map((pageGroups, index) => ({
        groups: pageGroups,
        empty: pageGroups.length === 0,
        label: `page ${index + 1} / ${pages.length}`
      }))
    }
  })

  return reactive({
    state,
    nav,
    actions,
    header,
    home,
    cadrage1,
    cadrage3,
    diagStart,
    diag,
    resti1,
    resti2,
    resti3,
    exportPreview
  })
}

// État de session et view-models d'écran.
//
// Le composable ne produit que des *données* : libellés, drapeaux, listes. Toute
// décision d'apparence appartient aux composants et à leur CSS. Chaque écran a
// son propre view-model calculé (`computed`), donc paresseux : seul celui de
// l'écran affiché est évalué.

import { computed, reactive, watch } from 'vue'
import { CONTEXT_GROUPS, DESCRIPTIVE_FIELDS } from '../data/context-attributes.js'
import { JOURNEY } from '../data/journey.js'
import { IN_PROGRESS, PREPARATION } from '../data/preparation.js'
import {
  BLOCKS, LEVELS, levelDescription, orderedAreas, profileExportLabel, profileName
} from '../domain/model.js'
import { NEXT_OF, PHASE_ENTRY, PHASE_OF, SCREENS, isToolScreen, previousScreen } from '../domain/navigation.js'
import { buildRecommendation } from '../domain/recommendation.js'
import {
  acquiredLevel, areaStats, blockTotals, gapGroups, missingPracticeCount, practiceKey, preparationReached
} from '../domain/scoring.js'
import { clearSession, loadSession, newSessionId, persistSession } from './useSessionStorage.js'

// Le profil le plus haut du modèle, nommé plutôt que numéroté dans les textes.
const MAX_PROFILE = LEVELS[LEVELS.length - 1].n
const MODEL_VERSION = 'v1'
const GAP_GROUPS_PER_PAGE = 4

const RESET_CONFIRMATION =
  'Réinitialiser la session ? Les attributs de contexte, le profil visé et les pratiques validées seront effacés.'

// `target` à null : le profil visé suit la recommandation, qui se déplace au fil
// des attributs de contexte. Un entier n'y apparaît qu'après un choix manuel au
// palier. `wave` dit jusqu'où le questionnaire est ouvert (1 = première série
// seule), `seen` retient les areas effectivement présentées — la restitution ne
// parle que de celles-là.
function defaultState() {
  return {
    screen: 'home',
    diagIdx: 0,
    checked: {},
    openLevels: {},
    seen: {},
    wave: 1,
    target: null,
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

  const recommendation = computed(() => buildRecommendation(state.form))
  // Le profil visé n'est plus une décision demandée d'entrée : il se déduit du
  // contexte et ne se discute qu'au palier, une fois la première série faite.
  const target = computed(() => (state.target == null ? recommendation.value.level : state.target))

  const ordered = computed(() => orderedAreas(target.value))
  // Ce que le questionnaire propose aujourd'hui, ce qu'il a réellement présenté,
  // et ce qui reste en attente. La mesure porte sur `evaluated` : on ne compte
  // comme manquante aucune pratique qu'on n'a pas montrée.
  const presented = computed(() => ordered.value.filter(area => area.wave <= state.wave))
  const evaluated = computed(() => ordered.value.filter(area => state.seen[area.id]))
  const deferred = computed(() => ordered.value.filter(area => !state.seen[area.id]))

  const acquired = computed(() => acquiredLevel(evaluated.value, state.checked, target.value))
  const gaps = computed(() => gapGroups(evaluated.value, state.checked))

  // L'index courant est borné : changer de profil visé peut raccourcir la liste
  // des areas sous les pieds du questionnaire.
  const diagIndex = computed(() => Math.min(state.diagIdx, Math.max(0, presented.value.length - 1)))
  const currentArea = computed(() => presented.value[diagIndex.value] || null)

  // Une area devient « évaluée » dès qu'elle s'affiche — pas dès qu'elle est
  // ordonnée, sinon la première le serait depuis l'accueil. Le marquage est un
  // effet de la navigation, d'où le watch plutôt qu'un computed.
  const shownArea = computed(() => (state.screen === 'tool2' ? currentArea.value : null))
  watch(shownArea, area => { if (area) state.seen[area.id] = true }, { immediate: true })

  const targetLabel = computed(() => profileName(target.value))

  // Trois états à la restitution, du plus avancé au moins avancé : un profil du
  // modèle est acquis ; aucun ne l'est mais assez de pratiques sont validées
  // pour créditer la Préparation ; le diagnostic est trop peu avancé pour
  // qualifier quoi que ce soit. Aucun de ces états ne dit « aucun » : le
  // libellé accuse toujours réception de ce qui a été fait.
  const preparation = computed(() => preparationReached(state.checked))
  const acquiredProfile = computed(() => {
    if (acquired.value) {
      return {
        label: profileName(acquired.value),
        desc: levelDescription(acquired.value),
        exportLabel: profileExportLabel(acquired.value)
      }
    }
    if (preparation.value) {
      return {
        label: PREPARATION.name,
        desc: PREPARATION.desc,
        exportLabel: `Niveau ${PREPARATION.n} — ${PREPARATION.name}`
      }
    }
    return { label: IN_PROGRESS.name, desc: IN_PROGRESS.desc, exportLabel: IN_PROGRESS.name }
  })
  const acquiredLabel = computed(() => acquiredProfile.value.label)

  const answeredCount = computed(() => Object.keys(state.form).filter(id => state.form[id] != null).length)
  const hasProgress = computed(() =>
    answeredCount.value > 0 ||
    Object.keys(state.checked).length > 0 ||
    state.target != null ||
    state.screen !== 'home'
  )

  // — navigation et mutations —

  function go(screen) {
    if (screen === 'home') state.diagIdx = 0
    state.screen = screen
    scrollToTop()
  }

  // Revenir au questionnaire depuis la restitution : à la dernière area
  // présentée, pas à la première.
  function backToQuestionnaire() {
    state.diagIdx = Math.max(0, presented.value.length - 1)
    go('tool2')
  }

  const nav = {
    home: () => go('home'),
    info: () => go('info'),
    demo: () => go('demo'),
    start: () => go('tool1'),
    phase: screen => { if (screen) go(screen) },
    back() {
      // Dans le questionnaire, « précédent » recule d'une area avant de quitter
      // l'écran ; l'aperçu d'export revient à la liste du gap.
      if (state.screen === 'tool2' && diagIndex.value > 0) {
        state.diagIdx = diagIndex.value - 1
        scrollToTop()
        return
      }
      // Le palier ne se retraverse qu'une fois : la seconde série achevée, la
      // restitution redonne sur le questionnaire.
      if (state.screen === 'tool3' && !deferred.value.length) {
        backToQuestionnaire()
        return
      }
      go(previousScreen(state.screen))
    },
    next() {
      if (state.screen === 'tool2') {
        if (diagIndex.value + 1 < presented.value.length) {
          state.diagIdx = diagIndex.value + 1
          scrollToTop()
          return
        }
        // Fin d'une série : on s'arrête au palier tant qu'il reste des areas à
        // proposer, sinon tout a été vu et la restitution suit directement.
        go(deferred.value.length ? 'palier' : 'tool3')
        return
      }
      if (state.screen === 'palier') {
        actions.continueDiagnostic()
        return
      }
      go(NEXT_OF[state.screen] || 'tool3b')
    },
    // Quitter le questionnaire en laissant la seconde série de côté : les areas
    // non présentées ne comptent pas comme manquantes, la restitution le dit.
    skipToRestitution: () => go('tool3'),
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
    // Recliquer sur le profil retenu annule le choix manuel : la cible repasse
    // sous la recommandation. L'index n'est pas remis à zéro — les areas déjà
    // présentées le restent, seul l'ordre des suivantes change.
    selectTarget(n) {
      state.target = state.target === n ? null : n
    },
    // Ouvrir la seconde série et reprendre à la première area jamais présentée.
    continueDiagnostic() {
      state.wave = 2
      const index = presented.value.findIndex(area => !state.seen[area.id])
      state.diagIdx = index >= 0 ? index : Math.max(0, presented.value.length - 1)
      go('tool2')
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

  // Le profil visé ne figure plus dans l'en-tête : il est annoncé au palier, une
  // fois la première série faite, et pas avant. Les phases ne s'affichent que
  // dans la branche outil — ailleurs elles ne désignent aucune progression.
  const header = computed(() => ({
    sessionLabel: `session ${state.session}` +
      (wasRestored && hasProgress.value ? ' · restaurée' : ''),
    hasProgress: hasProgress.value,
    showPhases: isToolScreen(state.screen),
    phases: JOURNEY.map((phase, index) => ({
      n: phase.n,
      name: phase.name,
      desc: phase.steps[0],
      active: PHASE_OF[state.screen] === index + 1,
      screen: PHASE_ENTRY[index]
    }))
  }))

  // L'accueil ne raconte plus le parcours : il n'offre que trois portes, dont
  // celle qui commence l'évaluation. Tout le reste — le modèle, la carte des
  // areas — est derrière « en savoir plus » et n'a pas à être lu d'abord.
  const home = computed(() => ({
    blocks: [
      {
        id: 'info',
        letter: 'i',
        name: 'Information',
        desc: 'Le modèle, ses 4 blocs et ses profils d’adoption, et ce que le diagnostic mesure.',
        action: 'En savoir plus',
        target: 'info',
        ready: true
      },
      {
        id: 'tool',
        letter: 't',
        name: 'Outil',
        desc: 'Décrivez votre organisation, validez les pratiques en place, obtenez vos écarts.',
        action: 'Démarrer le diagnostic',
        target: 'tool',
        ready: true,
        primary: true
      },
      {
        id: 'demo',
        letter: 'd',
        name: 'Démonstration',
        desc: 'Un parcours pré-rempli pour voir les résultats sans rien saisir.',
        action: 'Voir une démonstration',
        target: 'demo',
        ready: false
      }
    ]
  }))

  // La carte du parcours ouvre le cadrage : elle situe les trois phases avant la
  // première question, au lieu de retenir l'accueil.
  const journey = computed(() => ({
    phases: JOURNEY.map(phase => ({
      n: phase.n,
      name: phase.name,
      steps: phase.steps,
      frictions: phase.frictions,
      opps: phase.opps
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
      label: level.name,
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
      })),
      // Critères d'acceptation, rédigés pour les seuls attributs dont une option
      // plafonne le niveau cible : la liste est vide ailleurs, et le composant
      // n'affiche alors rien.
      criteria: field.opts
        .filter(([, , , criterion]) => criterion)
        .map(([optionValue, optionLabelText, , criterion]) => ({
          value: optionValue,
          label: optionLabelText,
          text: criterion,
          active: value === optionValue
        }))
    }
  }

  // Facteurs affichés sous la recommandation : uniquement ce qui a retenu le
  // profil. Les deux axes du calcul — ambition et capacité — ne sont plus
  // exposés : ils décrivent la mécanique interne, pas une information dont
  // l'utilisateur ait besoin pour lire le résultat.
  function recommendationFactors(rec) {
    const factors = []
    if (rec.cappedByCapacity && !rec.capNotes.length) {
      factors.push({
        key: 'Ajustement',
        value: 'le profil est ramené à ce que l’organisation peut soutenir aujourd’hui'
      })
    }
    if (rec.capNotes.length) {
      factors.push({
        key: 'Plafond',
        value: `${profileName(rec.level)} — ${rec.capNotes.map(cap => cap.why).join(' ; ')}`
      })
    }
    if (rec.level5Missing.length) {
      factors.push({
        key: 'Profil le plus haut',
        value: `${profileName(MAX_PROFILE)} exige ${rec.level5Missing.map(req => req.why).join(', ')}`
      })
    }
    return factors
  }

  // Le cadrage ne montre plus que le formulaire : la recommandation qu'il
  // alimente se calcule en silence et ne s'explique qu'au palier.
  const cadrage3 = computed(() => ({
    groups: CONTEXT_GROUPS.map(group => ({
      id: group.id,
      label: group.label,
      fields: group.fields.map(buildField)
    })),
    descriptiveFields: DESCRIPTIVE_FIELDS.map(buildField),
    showContext: state.showContext,
    contextToggleLabel: `${state.showContext ? '− masquer' : '+ afficher'} le contexte descriptif`
  }))

  // Areas que le profil détecté met en jeu : ce sont celles du diagnostic, et
  // les seules qu'on montre. Rien n'annonce qu'il en existe d'autres — la
  // question ne se pose qu'une fois le parcours terminé.
  const requiredIds = computed(() => new Set(
    ordered.value.filter(area => area.wave === 1).map(area => area.id)
  ))

  // Cette carte a quitté le parcours pour la page d'information : elle peut donc
  // être lue avant tout cadrage. Le texte ne prétend alors pas décrire une
  // sélection personnelle — il montre celle d'une organisation type.
  const diagStart = computed(() => ({
    intro: answeredCount.value
      ? `Le diagnostic porte sur ${requiredIds.value.size} areas de compétence, retenues à partir de ce que ` +
        `vous avez décrit. Pour chacune, vous validez les pratiques déjà en place dans votre organisation.`
      : `Le diagnostic ne parcourt pas les 28 areas de compétence du modèle : il retient celles que votre ` +
        `situation appelle. Voici, à titre d'exemple, les ${requiredIds.value.size} areas d'une organisation ` +
        `type. Pour chacune, vous validez les pratiques déjà en place.`,
    blocks: BLOCKS
      .map(block => ({
        id: block.id,
        name: block.name,
        dimensions: block.dimensions
          .map(dimension => ({
            id: dimension.id,
            name: dimension.name,
            color: dimension.color,
            areas: dimension.areas
              .filter(area => requiredIds.value.has(area.id))
              .map(area => ({ id: area.id, label: area.name }))
          }))
          .filter(dimension => dimension.areas.length > 0)
      }))
      .filter(block => block.dimensions.length > 0)
  }))

  // — palier —
  // Diagnostic terminé : c'est ici, et pas avant, qu'on nomme le profil qui a
  // désigné les areas parcourues, qu'on laisse le corriger s'il ne colle pas,
  // et qu'on demande s'il faut s'arrêter là ou monter aux profils suivants.
  const palier = computed(() => {
    const rec = recommendation.value
    return {
      profileLabel: targetLabel.value,
      evaluatedCount: evaluated.value.length,
      // Deux formulations : tant que le profil suit la recommandation, il
      // explique exactement la sélection qu'on vient de parcourir. Une fois
      // corrigé à la main, il ne la décrit plus — le texte cesse alors de le
      // prétendre.
      why: state.target == null
        ? `Vos réponses de cadrage situent votre organisation au profil « ${targetLabel.value} ». Le ` +
          `diagnostic a porté sur les ${evaluated.value.length} areas de compétence que ce profil met en ` +
          `jeu : c'est là qu'un écart se traduit le plus vite en action.`
        : `Vous avez retenu le profil « ${targetLabel.value} ». Le diagnostic a porté jusqu'ici sur ` +
          `${evaluated.value.length} areas de compétence.`,
      question:
        'Vous pouvez vous en tenir là et lire vos résultats, ou continuer avec les areas qu’appellent les ' +
        'profils plus avancés.',
      factors: recommendationFactors(rec),
      manual: state.target != null,
      manualLabel: state.target != null
        ? `Profil choisi manuellement. Recliquez-le pour revenir à la proposition (${profileName(rec.level)}).`
        : '',
      profileOptions: LEVELS.map(level => ({
        n: level.n,
        label: level.name,
        active: target.value === level.n,
        recommended: level.n === rec.level
      })),
      continueLabel: 'Poursuivre avec les profils suivants',
      skipLabel: 'Passer aux résultats'
    }
  })

  // Index de la première area proposée d'une dimension, -1 si aucune ne l'est
  // encore : sert aussi de test d'accessibilité du lien.
  function firstAreaOfDimension(dimensionId) {
    return presented.value.findIndex(area => area.dimId === dimensionId)
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
      profileLabel: area ? profileName(area.level) : targetLabel.value,
      progress: `Area ${diagIndex.value + 1} / ${presented.value.length} · ${area ? area.dim : ''}`,
      nextLabel: diagIndex.value + 1 < presented.value.length ? 'Suivant' : 'Terminer',
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
    acquiredDesc: acquiredProfile.value.desc,
    // La Préparation ouvre l'échelle : hors modèle, jamais visée, elle n'est
    // créditée que tant qu'aucun profil du modèle ne l'est — passé ce point,
    // elle reste franchie mais cesse d'être le profil courant.
    ladder: [
      {
        n: PREPARATION.n,
        label: PREPARATION.name,
        acquired: !acquired.value && preparation.value,
        isTarget: false,
        reached: preparation.value || acquired.value > 0,
        beyondTarget: false
      },
      ...LEVELS.map(level => ({
        n: level.n,
        label: level.name,
        acquired: level.n === acquired.value,
        isTarget: level.n === target.value,
        reached: level.n <= acquired.value,
        beyondTarget: level.n > target.value
      }))
    ],
    // Le bloc ne porte pas de niveau : il regroupe des areas pour la lecture,
    // l'escalier se joue sur le périmètre entier.
    blocks: BLOCKS.map(block => {
      const totals = blockTotals(evaluated.value, state.checked, block.id)
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
        evaluated.value
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

  // Le gap ne parle que des areas parcourues. Celles jamais présentées sont
  // annoncées à part : ne pas avoir été interrogé n'est pas un manque.
  const resti3 = computed(() => {
    const groups = gaps.value
    const deferredCount = deferred.value.length
    return {
      targetLabel: targetLabel.value,
      acquiredLabel: acquiredLabel.value,
      gapSummary: `${missingPracticeCount(groups)} pratiques manquantes réparties sur ` +
        `${groups.length} areas de compétence, sur ${evaluated.value.length} évaluées`,
      blocks: BLOCKS
        .map(block => ({
          id: block.id,
          name: block.name,
          groups: groups.filter(group => group.blockId === block.id)
        }))
        .filter(block => block.groups.length > 0),
      deferred: deferredCount
        ? {
          summary: `${deferredCount} areas de compétence n'ont pas été évaluées`,
          note: 'Elles relèvent de profils plus avancés et ne comptent ni comme acquises ni comme ' +
            'manquantes : les pratiques correspondantes ne vous ont pas été présentées.',
          resumeLabel: 'Poursuivre le diagnostic'
        }
        : null
    }
  })

  const exportPreview = computed(() => {
    // Les areas sont ordonnées par bloc : le nom du bloc n'est annoncé qu'à sa
    // toute première area, même si la liste déborde sur les pages suivantes.
    const groups = gaps.value.map((group, i, all) => ({
      ...group,
      showBlock: i === 0 || all[i - 1].blockId !== group.blockId
    }))
    const pages = []
    for (let i = 0; i < groups.length; i += GAP_GROUPS_PER_PAGE) {
      pages.push(groups.slice(i, i + GAP_GROUPS_PER_PAGE))
    }
    if (!pages.length) pages.push([])
    return {
      meta: `Export ${today()} · model: ${MODEL_VERSION} · session: ${state.session}`,
      // Seule sortie numérotée : relue hors de l'outil, elle doit situer le
      // profil dans l'échelle sans supposer qu'on la connaisse par cœur.
      targetLabel: profileExportLabel(target.value),
      acquiredLabel: acquiredProfile.value.exportLabel,
      // Le document dit sur quoi il porte : sans cette ligne, un lecteur
      // extérieur prendrait la liste pour un bilan complet du modèle.
      coverage: `${evaluated.value.length} areas de compétence évaluées sur ${ordered.value.length}` +
        (deferred.value.length ? ` · ${deferred.value.length} non évaluées` : ''),
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
    journey,
    cadrage1,
    cadrage3,
    diagStart,
    diag,
    palier,
    resti1,
    resti2,
    resti3,
    exportPreview
  })
}

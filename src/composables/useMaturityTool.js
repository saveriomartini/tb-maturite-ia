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
  BLOCKS, EVALUABLE_AREAS, LEVELS, levelDescription, orderedAreas, profileExportLabel, profileName
} from '../domain/model.js'
import { NEXT_OF, PHASE_ENTRY, PHASE_OF, SCREENS, isToolScreen, previousScreen } from '../domain/navigation.js'
import { buildRecommendation } from '../domain/recommendation.js'
import {
  acquiredLevel, areaStats, blockTotals, gapGroups, goalKey, missingPracticeCount, practiceKey,
  preparationReached
} from '../domain/scoring.js'
import { clearSession, loadSession, newSessionId, persistSession } from './useSessionStorage.js'

// Le profil le plus haut du modèle, nommé plutôt que numéroté dans les textes.
const MAX_PROFILE = LEVELS[LEVELS.length - 1].n
const MODEL_VERSION = 'v1'
const GAP_GROUPS_PER_PAGE = 4

const RESET_CONFIRMATION =
  'Réinitialiser la session ? Les attributs de contexte, le degré de transformation visé et les ' +
  'objectifs validés seront effacés.'

// Question d'intention posée avant le formulaire de contexte. Elle recueille le
// profil que l'organisation *souhaite* atteindre, là où les attributs décrivent
// ce qu'elle est. C'est elle qui fixe le profil visé, donc les areas parcourues.
const TRANSFORMATION_QUESTION =
  'Quel degré de transformation l’adoption de l’IA doit-elle déterminer dans votre organisation, ' +
  'selon vous ?'

// `transformation` porte le profil déclaré au cadrage ; à null, le profil visé
// suit la seule recommandation, qui se déplace au fil des attributs de contexte.
// `wave` dit jusqu'où le questionnaire est ouvert (1 = première série seule),
// `seen` retient les areas effectivement présentées — la restitution ne parle
// que de celles-là. `offScope` désigne l'area hors cadrage consultée depuis la
// barre : une vue passagère, jamais persistée, qui laisse la position du
// parcours (`diagIdx`) exactement où elle était.
function defaultState() {
  return {
    screen: 'home',
    diagIdx: 0,
    checked: {},
    openLevels: {},
    seen: {},
    wave: 1,
    offScope: null,
    form: {},
    showContext: true,
    transformation: null,
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
  // Le profil visé est celui que l'organisation déclare viser, borné par ce que
  // son contexte porte : le formulaire ne peut que le descendre, jamais le
  // remonter. Viser bas avec les moyens de viser haut laisse le diagnostic sur
  // le périmètre demandé ; viser haut sans les moyens le ramène à ce qui est
  // soutenable. Dans les deux cas l'écart reste tu jusqu'à la restitution.
  // Sans intention déclarée, la recommandation décide seule — formulaire vide,
  // elle vaut le profil le plus haut, donc toutes les areas du modèle.
  const target = computed(() =>
    state.transformation == null
      ? recommendation.value.level
      : Math.min(state.transformation, recommendation.value.level)
  )

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
    state.transformation != null ||
    state.screen !== 'home'
  )

  // — navigation et mutations —

  function go(screen) {
    if (screen === 'home') state.diagIdx = 0
    // Changer d'écran referme toujours la consultation hors cadrage : elle ne
    // survit pas au questionnaire qu'elle interrompt.
    state.offScope = null
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
    // La validation porte sur l'objectif : ses pratiques suivent en bloc. On
    // écrit malgré tout une clé par pratique — le calcul et le gap continuent
    // de raisonner en pratiques. Un objectif à moitié coché, hérité d'une
    // session antérieure, se complète au premier clic plutôt que de se vider.
    toggleGoal(keys) {
      const on = !keys.every(key => state.checked[key])
      keys.forEach(key => { state.checked[key] = on })
    },
    toggleLevelDetail(n) {
      state.openLevels[n] = !state.openLevels[n]
    },
    toggleDescriptiveContext() {
      state.showContext = !state.showContext
    },
    // Même convention que les attributs de contexte : recliquer le profil retenu
    // annule la réponse — le profil visé repasse alors sous la seule
    // recommandation. L'index n'est pas remis à zéro : les areas déjà
    // présentées le restent, seul l'ordre des suivantes change.
    selectTransformation(n) {
      state.transformation = state.transformation === n ? null : n
    },
    // Recliquer sur l'option retenue l'annule : l'attribut redevient non renseigné.
    selectOption(fieldId, value) {
      state.form = { ...state.form, [fieldId]: state.form[fieldId] === value ? null : value }
    },
    // Ouvrir la seconde série et reprendre à la première area jamais présentée.
    continueDiagnostic() {
      state.wave = 2
      const index = presented.value.findIndex(area => !state.seen[area.id])
      state.diagIdx = index >= 0 ? index : Math.max(0, presented.value.length - 1)
      go('tool2')
    },
    // La barre navigue par identifiant, pas par rang : elle montre désormais des
    // areas que le parcours ne contient pas, et qui n'ont donc pas de rang.
    // Cliquer l'une d'elles ne déplace pas le questionnaire — il reste où il en
    // était et se retrouve intact au retour.
    openArea(id) {
      const index = presented.value.findIndex(area => area.id === id)
      if (index >= 0) {
        state.diagIdx = index
        state.offScope = null
      } else {
        state.offScope = id
      }
      scrollToTop()
    },
    closeOffScope() {
      state.offScope = null
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
        name: 'Information',
        desc: 'Le modèle, ses 4 blocs et ses profils d’adoption, et ce que le diagnostic mesure.',
        action: 'En savoir plus',
        target: 'info',
        ready: true
      },
      {
        id: 'tool',
        name: 'Outil',
        desc: 'Décrivez votre organisation, validez les objectifs atteints, obtenez vos écarts.',
        action: 'Démarrer le diagnostic',
        target: 'tool',
        ready: true,
        primary: true
      },
      {
        id: 'demo',
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

  // La question d'intention prend la forme d'un attribut de contexte — même
  // libellé, mêmes options cliquables, même aide dépliable — pour n'introduire
  // aucune mécanique nouvelle dans le cadrage. Ses options sont les cinq profils
  // du modèle tels quels, chacun rappelé par sa formule courte sous le « + ».
  const transformationField = computed(() => ({
    id: 'transformation',
    label: TRANSFORMATION_QUESTION,
    hint: '',
    options: LEVELS.map(level => ({
      value: level.n,
      label: level.name,
      active: state.transformation === level.n
    })),
    // Les cinq définitions sont fournies ; laquelle s'affiche est une décision
    // d'écran (voir `pinActive` dans ContextField) : la seule retenue au repos,
    // les cinq derrière le « + ».
    criteria: LEVELS.map(level => ({
      value: level.n,
      label: level.name,
      text: level.tag,
      active: state.transformation === level.n
    }))
  }))

  // Le cadrage ne montre plus que le formulaire : la recommandation qu'il
  // alimente se calcule en silence et ne s'explique qu'au palier.
  const cadrage3 = computed(() => ({
    transformationField: transformationField.value,
    groups: CONTEXT_GROUPS.map(group => ({
      id: group.id,
      label: group.label,
      fields: group.fields.map(buildField)
    })),
    descriptiveFields: DESCRIPTIVE_FIELDS.map(buildField),
    showContext: state.showContext,
    // Le panneau nomme lui-même son contenu : le libellé n'a plus à le répéter.
    contextToggleLabel: state.showContext ? '− replier' : '+ déplier'
  }))

  // Cette carte a quitté le parcours pour la page d'information, et avec lui la
  // session : elle ne montre plus la sélection du cadrage en cours mais le
  // modèle évaluable entier, que l'écran laisse filtrer par profil. Le view-model
  // ne livre donc que des constantes du modèle — quel profil on consulte est une
  // affaire d'écran, sans effet sur le profil visé du diagnostic.
  const diagStart = computed(() => ({
    intro: `Le diagnostic parcourt les ${EVALUABLE_AREAS.length} areas de compétence évaluables du modèle. ` +
      `Pour chacune, vous validez les objectifs déjà atteints dans votre organisation ; les pratiques qu'ils ` +
      `recouvrent se déplient sous chaque objectif. Aucune n'est retirée d'avance : un profil d'adoption ne ` +
      `fait que désigner celles qu'il met en jeu.`,
    total: EVALUABLE_AREAS.length,
    // Un profil met en jeu les areas de son rang et de tous ceux d'en dessous —
    // la même règle que la première série du questionnaire.
    profiles: LEVELS.map(level => ({
      n: level.n,
      label: level.name,
      tag: level.tag,
      count: EVALUABLE_AREAS.filter(area => area.level <= level.n).length
    })),
    blocks: BLOCKS
      .map(block => ({
        id: block.id,
        name: block.name,
        dimensions: block.dimensions
          .map(dimension => ({
            id: dimension.id,
            name: dimension.name,
            color: dimension.color,
            // Les areas encore à définir restent hors carte : elles ne sont
            // évaluables sous aucun profil.
            areas: dimension.areas
              .filter(area => !area.pending)
              .map(area => ({ id: area.id, label: area.name, level: area.level }))
          }))
          .filter(dimension => dimension.areas.length > 0)
      }))
      .filter(block => block.dimensions.length > 0)
  }))

  // — palier —
  // Diagnostic terminé : c'est ici, et pas avant, qu'on nomme le profil qui a
  // désigné les areas parcourues, et qu'on demande s'il faut s'arrêter là ou
  // monter aux profils suivants. Le profil ne s'y corrige plus : il a été
  // déclaré au cadrage.
  const palier = computed(() => {
    const rec = recommendation.value
    // Le texte nomme le profil sans dire d'où il vient : selon les cas il est
    // celui qu'on a demandé, ou celui auquel le contexte a ramené la demande.
    // Distinguer les deux, c'est ouvrir la discussion sur l'écart — elle
    // appartient à la restitution.
    const cappedByIntent = state.transformation != null && state.transformation < rec.level
    return {
      evaluatedCount: evaluated.value.length,
      why: `Le diagnostic a porté sur les ${evaluated.value.length} areas de compétence que met en jeu le ` +
        `profil « ${targetLabel.value} » : c'est là qu'un écart se traduit le plus vite en action.`,
      question:
        'Vous pouvez vous en tenir là et lire vos résultats, ou continuer avec les areas qu’appellent les ' +
        'profils plus avancés.',
      // Les facteurs justifient un plafond de la recommandation : ils n'ont
      // rien à expliquer quand c'est l'intention déclarée, plus basse, qui a
      // fixé le profil — les afficher motiverait une limite qui n'a pas joué.
      factors: cappedByIntent ? [] : recommendationFactors(rec),
      continueLabel: 'Poursuivre avec les profils suivants',
      skipLabel: 'Passer aux résultats'
    }
  })

  const diag = computed(() => {
    const area = currentArea.value
    // Une area hors cadrage se consulte sans quitter le questionnaire : elle
    // prend la place de l'area courante à l'écran, mais pas dans le parcours.
    const offScopeArea = state.offScope
      ? EVALUABLE_AREAS.find(candidate => candidate.id === state.offScope) || null
      : null
    // Ce que la colonne de rappel décrit : l'area consultée s'il y en a une,
    // l'area courante sinon.
    const shown = offScopeArea || area
    const stats = area && !offScopeArea ? areaStats(area, state.checked) : null

    // La barre de parcours ne connaît que deux termes : le bloc, qui coiffe, et
    // l'area, numérotée dans l'ordre du modèle. Elle montre toujours les 25
    // areas évaluables, quel que soit le profil visé : celui-ci n'en retire
    // aucune de la barre, il éteint seulement celles qu'il ne met pas en jeu.
    // Les numéros suivent donc le modèle et non le parcours — changer de profil
    // au palier rallume des cases, il n'en renumérote aucune.
    const inWalk = new Set(presented.value.map(presentedArea => presentedArea.id))
    const groupsByBlock = new Map()
    EVALUABLE_AREAS.forEach((modelArea, index) => {
      let group = groupsByBlock.get(modelArea.blockId)
      if (!group) {
        group = { key: modelArea.blockId, name: modelArea.block, areas: [] }
        groupsByBlock.set(modelArea.blockId, group)
      }
      const inScope = inWalk.has(modelArea.id)
      group.areas.push({
        id: modelArea.id,
        number: index + 1,
        name: modelArea.name,
        // Pas de couleur hors cadrage : la case retombe sur le gris de la CSS,
        // qui est le seul endroit à décider de quel gris il s'agit.
        color: inScope ? modelArea.dimColor : null,
        inScope,
        active: shown ? modelArea.id === shown.id : false
      })
    })
    const blockGroups = [...groupsByBlock.values()]

    return {
      // Hors cadrage, le compteur cesse de situer : l'area consultée n'occupe
      // aucun rang dans le parcours, en annoncer un mentirait.
      progress: offScopeArea ? 'Area hors cadrage' : `Area ${diagIndex.value + 1} / ${presented.value.length}`,
      nextLabel: diagIndex.value + 1 < presented.value.length ? 'Suivant' : 'Terminer',
      blockGroups,
      // Ce que le questionnaire affiche à la place des objectifs quand l'area
      // consultée est hors cadrage. Le message dit pourquoi elle est vide, et
      // par où elle peut rejoindre le parcours.
      offScope: offScopeArea
        ? {
          message: `« ${offScopeArea.name} » et ses pratiques ne sont pas applicables selon le profil ` +
            'visé : cette area est sortie du cadrage.',
          note: 'Elle reste consultable, mais rien n’y est à valider. En fin de série, le palier propose ' +
            'de poursuivre avec les profils plus avancés : elle rejoindra alors le questionnaire.',
          backLabel: 'Revenir au questionnaire'
        }
        : null,
      // La colonne de rappel s'en tient à l'area affichée : ce qu'elle est, ce
      // qu'elle demande. L'avancement chiffré n'y figure plus — la case cochée
      // et l'indice du pied de page le disent déjà.
      area: {
        name: shown ? shown.name : '',
        desc: shown ? shown.desc : '',
        color: shown && !offScopeArea ? shown.dimColor : null,
        exampleArtifacts: shown ? shown.exampleArtifacts || [] : [],
        offScope: Boolean(offScopeArea),
        // Le pied de page n'accuse que la réussite : rien à dire tant que
        // l'area n'est pas acquise, les carrés des objectifs le montrent déjà.
        hint: stats && stats.acquired ? 'area acquise' : ''
      },
      // L'objectif est l'unité de réponse : une case, un verdict. Ses pratiques
      // ne sont plus des interrupteurs mais le détail de ce qu'il recouvre —
      // repliable, comme l'aide d'un attribut de contexte. `keys` porte les
      // clés que la validation écrit ; `done` reste vrai au sens du calcul,
      // c'est-à-dire toutes pratiques validées.
      goals: area && !offScopeArea
        ? area.goals.map((goal, goalIndex) => {
          const keys = goal.practices.map(
            (practice, practiceIndex) => practiceKey(area.id, goalIndex, practiceIndex)
          )
          const done = keys.every(key => state.checked[key])
          return {
            key: goalKey(area.id, goalIndex),
            text: goal.goal,
            done,
            keys,
            practices: goal.practices
          }
        })
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

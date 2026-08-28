// État de session et view-models d'écran.
//
// Le composable ne produit que des *données* : libellés, drapeaux, listes. Toute
// décision d'apparence appartient aux composants et à leur CSS. Chaque écran a
// son propre view-model calculé (`computed`), donc paresseux : seul celui de
// l'écran affiché est évalué.

import { computed, reactive } from 'vue'
import { ALL_FIELDS, CONTEXT_GROUPS, DESCRIPTIVE_FIELDS } from '../data/context-attributes.js'
import { JOURNEY } from '../data/journey.js'
import { INFO } from '../data/info.js'
import { IN_PROGRESS } from '../data/in-progress.js'
import { STATEMENTS } from '../data/statements.js'
import {
  PASSAGES, REACH_QUESTION, REVOLUTIONARY_FROM, REVOLUTIONARY_LINE, transformationDegree
} from '../data/transformation.js'
import {
  BLOCKS, EVALUABLE_AREAS, LEVELS, levelDescription, profileExportLabel, profileName
} from '../domain/model.js'
import { NEXT_OF, PHASE_ENTRY, PHASE_OF, SCREENS, isToolScreen, previousScreen } from '../domain/navigation.js'
import { buildDemoSession, demoScenarios } from '../domain/demo-session.js'
import { buildRecommendation } from '../domain/recommendation.js'
import { evaluationUnit } from '../domain/scope.js'
import {
  MAX_RANK, OUT_OF_SCOPE, acquiredLevel, areaLevel, blockers, blockersByGate, dimAverage,
  dimFloor, gateProgress, inScopeAreas, isOutOfScope, toAssess
} from '../domain/scoring.js'
import { clearSession, loadSession, newSessionId, persistSession } from './useSessionStorage.js'

const MODEL_VERSION = 'v1'
const GAP_GROUPS_PER_PAGE = 4

// Les deux modales de l'outil ont la même forme — un motif, ce qui se joue, deux
// sorties — et leurs textes vivent donc ici, au même titre que les libellés de
// boutons des autres écrans. La sortie qui poursuit ce qui a été cliqué vient en
// second : la première est toujours celle qui ramène en arrière.
const RESET_DIALOG = {
  eyebrow: 'Réinitialiser la session',
  text: 'Les attributs de contexte, la portée visée et les énoncés retenus pour chaque domaine ' +
    'de capacité seront effacés.',
  actions: [
    { id: 'cancel', label: 'Annuler' },
    { id: 'reset', label: 'Réinitialiser', arrow: '→' }
  ]
}

const SKIP_DIALOG = {
  eyebrow: 'Cadrage incomplet',
  text: 'Décrire son organisation AVANT l’évaluation change ce que l’outil peut en dire : il s’en ' +
    'sert pour borner le profil qu’il vous proposera de viser, à la fin du parcours, et pour ' +
    'situer votre résultat dans votre contexte plutôt que dans l’absolu.',
  actions: [
    { id: 'describe', label: 'Décrire mon organisation', arrow: '↓' },
    { id: 'skip', label: 'Ignorer et continuer', arrow: '→' }
  ]
}

// Charger une démonstration écrase ce qui est en cours, comme la remise à zéro
// — et la même modale le demande, avec le même ordre de sorties. Elle ne
// s'ouvre que s'il y a quelque chose à perdre : sur une session vierge, le clic
// est sans conséquence et n'a rien à confirmer.
const DEMO_DIALOG = {
  eyebrow: 'Remplacer la session en cours',
  text: 'La démonstration écrit une session complète : les attributs de contexte et les énoncés ' +
    'retenus pour chaque domaine de capacité seront remplacés par ceux de l’exemple.',
  actions: [
    { id: 'cancel', label: 'Annuler' },
    { id: 'load', label: 'Charger la démonstration', arrow: '→' }
  ]
}

// — l'échelle des paliers, ce qu'elle dit de la cible —
//
// Quatre cas, et chacun se dit pour lui-même : sans texte, l'absence de marque
// de cible se lirait comme une cible à zéro, et une cible marquée *sous* le
// palier atteint se lirait comme une erreur de l'outil. Aucun n'est laissé à un
// défaut muet.
//
// Ces textes ne commentent que l'échelle. Ce que le passage vers la cible
// engage — sa nature, son coût — appartient à la phase d'ancrage, qui est aussi
// la seule à l'avoir demandé : le redire ici répondrait à une question qui n'a
// pas encore été posée.
const LADDER_TARGET = {
  undeclared:
    'Aucun profil visé n’est encore déclaré : la question de portée se pose à l’étape suivante. ' +
    'L’échelle ne porte donc aucune marque de cible — l’outil ne vise pas à votre place.',
  above:
    'Le profil visé est marqué plus haut sur l’échelle. Ce qui vous en sépare, domaine par ' +
    'domaine, se lit à l’étape suivante.',
  reached:
    'Le profil visé est celui que le diagnostic constate : les deux marques tombent au même cran.',
  below:
    'Le profil visé est marqué sous le palier atteint : vos réponses décrivent une organisation ' +
    'qui a construit plus haut que la portée déclarée ne l’exige. Ce n’est pas une incohérence, ' +
    'et le modèle l’autorise — le meilleur profil n’est pas le plus haut.'
}

// Ce que l'avancement d'un palier veut dire, et ce qu'il ne veut pas dire. La
// phrase est à l'écran et non en commentaire : c'est au lecteur qu'elle
// s'adresse, parce que « 8 sur 9 » se lit spontanément comme « presque acquis ».
const LADDER_NOTE =
  'Un palier s’acquiert d’un seul coup, quand tous les domaines qu’il attend l’atteignent : il ' +
  'n’y a pas d’acquisition partielle. Les nombres ci-dessus disent de combien il s’en est fallu, ' +
  'pas où vous en êtes sur ce palier.'

// Le questionnaire pose la même question sur chaque domaine, et cette question
// n'est pas « à quel niveau êtes-vous ? » : on demande laquelle des cinq
// situations décrit l'organisation. Le rang se déduit, il ne se choisit pas —
// même parti que la grille dont les énoncés sont dérivés.
const PICKER_QUESTION = 'Laquelle de ces situations décrit le mieux votre organisation ?'
const PICKER_HINT =
  'Une seule réponse. Recliquer celle qui est retenue l’annule — le domaine redevient ' +
  'non renseigné, et la mesure le dira plutôt que de le compter comme un manque.'

// Le hors périmètre est une réponse, pas une abstention : il déclare que le
// domaine ne concerne pas l'organisation. Il sort alors du calcul — jamais
// compté comme acquis, jamais compté comme manquant — et se retrouve nommé à
// part en restitution. C'est ce que dit la note sous le bouton.
const OUT_OF_SCOPE_LABEL = 'Ce domaine ne concerne pas mon organisation'
const OUT_OF_SCOPE_NOTE =
  'Le domaine sort du calcul : il ne retient aucun palier et n’en fait franchir aucun. ' +
  'La restitution le déclare à part.'

// État initial. `answers` porte une réponse par domaine — le rang de l'énoncé
// retenu, ou `'na'` — et remplace la table des pratiques cochées : l'unité de
// réponse a changé, le format persisté aussi (voir useSessionStorage.js).
//
// `contextWarned` retient que l'avertissement de saut a été montré : ce qu'on
// perd à partir sans avoir décrit son organisation se dit une fois, à la
// première tentative, et ne se répète pas ensuite. Il suit la session, sans quoi
// un simple rechargement le reposerait.
//
// `transformation` porte le degré déduit de la portée déclarée en phase
// d'ancrage. À null — c'est-à-dire tant que la question n'a pas été posée —, le
// profil visé suit la seule recommandation issue du contexte.
//
// `wave`, `seen` et `offScope` ont disparu avec les séries : les 28 domaines
// sont présentés d'affilée, dans l'ordre du modèle, et aucun n'est hors cadrage.
function defaultState() {
  return {
    screen: 'home',
    diagIdx: 0,
    answers: {},
    openLevels: {},
    form: {},
    transformation: null,
    contextWarned: false,
    demo: null,
    session: newSessionId()
  }
}

function scrollToTop() {
  window.scrollTo(0, 0)
}

function today() {
  return new Intl.DateTimeFormat('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date())
}

// Une moyenne de rangs, telle qu'elle se lit : une décimale, virgule décimale.
// Elle est toujours rapportée au haut de l'échelle et jamais au rang visé — le
// « 3,1 / 3 » relevé par l'experte métier venait précisément de là. Une moyenne
// de niveaux ne peut pas dépasser 5 ; elle pouvait dépasser la cible.
function rankLabel(average) {
  if (average === null) return '—'
  return new Intl.NumberFormat('fr-CH', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    .format(average)
}

export function useMaturityTool() {
  const restored = loadSession(SCREENS)
  const state = reactive({ ...defaultState(), ...restored })
  const wasRestored = Boolean(restored)
  persistSession(state)

  // — dérivations communes à plusieurs écrans —

  const recommendation = computed(() => buildRecommendation(state.form))

  // Le profil visé est celui que l'organisation déclare viser — par la portée
  // qu'elle donne à l'adoption —, borné par ce que son contexte porte : le
  // formulaire ne peut que le descendre, jamais le remonter. Sans portée
  // déclarée, la recommandation décide seule ; formulaire vide, elle vaut le
  // profil le plus haut.
  const target = computed(() =>
    state.transformation == null
      ? recommendation.value.level
      : Math.min(state.transformation, recommendation.value.level)
  )

  // La cible n'est *nommée* qu'une fois la portée déclarée. Avant l'ancrage,
  // elle existe comme borne de calcul mais rien ne l'affiche : l'annoncer
  // reviendrait à répondre à la place de l'utilisateur à une question qu'on ne
  // lui a pas encore posée.
  const targetDeclared = computed(() => state.transformation != null)
  const targetLabel = computed(() => profileName(target.value))

  // Combien de domaines portent une réponse. Le hors périmètre en est une —
  // c'est une déclaration, pas une abstention —, il compte donc ici : ce nombre
  // dit ce qui a été traité, pas ce qui a été mesuré. La couverture de la
  // restitution, elle, sépare les deux, parce qu'à ce moment-là la distinction
  // change le sens du résultat.
  const answered = computed(() =>
    EVALUABLE_AREAS.filter(area => area.id in state.answers).length
  )

  const scoped = computed(() => inScopeAreas(EVALUABLE_AREAS, state.answers))
  const outOfScopeAreas = computed(() => EVALUABLE_AREAS.filter(area => isOutOfScope(area.id, state.answers)))
  const pending = computed(() => toAssess(EVALUABLE_AREAS, state.answers))

  // Le palier atteint se calcule sur toute l'échelle, sans être borné par la
  // cible : c'est un fait sur l'organisation, pas sur son intention. Le borner
  // rendrait invisible le cas — traité plus bas — où l'on a construit plus haut
  // que ce qu'on déclare viser.
  const acquired = computed(() => acquiredLevel(EVALUABLE_AREAS, state.answers))

  // Le cadrage est complet quand chacun des attributs qui nourrissent la
  // recommandation a une réponse. Les champs descriptifs n'en sont pas : ils
  // documentent l'évaluation sans peser sur elle. Plus rien n'y est exigé — la
  // seule question qui l'était, le degré de transformation, est passée à
  // l'ancrage.
  const contextComplete = computed(() => ALL_FIELDS.every(field => state.form[field.id] != null))

  // L'index courant est borné par sécurité : une session restaurée peut porter
  // une position écrite par un modèle plus long.
  const diagIndex = computed(() => Math.min(state.diagIdx, EVALUABLE_AREAS.length - 1))
  const currentArea = computed(() => EVALUABLE_AREAS[diagIndex.value] || null)

  // L'unité sur laquelle porte l'évaluation. Elle ne pèse sur aucun calcul —
  // `scope` continue de n'agir que comme plafond dans la recommandation — mais
  // elle se nomme en tête de la restitution et de l'export : sans elle, le
  // document se lit comme un verdict sur l'entreprise entière, et une
  // organisation qui a répondu pour sa seule fonction support se verrait
  // reprocher en séance des domaines qu'elle n'a jamais prétendu couvrir.
  const unit = computed(() => evaluationUnit(state.form))

  // Deux états à la restitution, et deux seulement : un palier du modèle, ou
  // rien encore. Le second ne dit pas « aucun » — il dit que le diagnostic n'est
  // pas assez avancé pour qualifier quoi que ce soit.
  //
  // Il n'y a plus de profil sous le premier palier du modèle. L'échelle par
  // énoncés a supprimé le cas qu'il traitait : tout domaine renseigné porte un
  // niveau, et le premier palier se lit sur ces niveaux. La conséquence est
  // assumée — une organisation dont les trois domaines du premier rang tiennent
  // l'énoncé de rang 1, celui qui décrit l'absence, acquiert « Exploration
  // localisée ». C'est ce que le modèle appelle le premier palier, et l'outil ne
  // met aucun seuil de son cru entre les deux.
  const acquiredProfile = computed(() => {
    if (acquired.value) {
      return {
        label: profileName(acquired.value),
        desc: levelDescription(acquired.value),
        exportLabel: profileExportLabel(acquired.value)
      }
    }
    return { label: IN_PROGRESS.name, desc: IN_PROGRESS.desc, exportLabel: IN_PROGRESS.name }
  })
  const acquiredLabel = computed(() => acquiredProfile.value.label)

  // Le profil atteint, situé sur l'échelle de transformation. La description que
  // l'AIMM donne d'un niveau dit ce que l'organisation y sait faire ; elle ne dit
  // pas quel degré de transformation ce niveau représente, ni pourquoi le
  // suivant coûte ce qu'il coûte. Venkatraman le dit, et c'est cette phrase-là
  // qui rend l'échelle lisible autrement que comme une note.
  //
  // Tant qu'aucun palier n'est acquis, il n'y a pas de degré à nommer : on ne
  // situe pas ce qui n'est pas encore un profil.
  const acquiredPosition = computed(() => {
    const degree = transformationDegree(acquired.value)
    return degree ? degree.position : null
  })

  // La nature du passage tient à la seule position de l'écart par rapport à la
  // ligne : ni le nombre de domaines qui manquent ni leur contenu n'y changent
  // rien. C'est ce qui la rend utile — elle dit ce qu'on s'apprête à entreprendre
  // avant de dire par quoi commencer, et distingue le seul passage de l'échelle
  // qui ne se rattrape pas en faisant davantage de la même chose.
  //
  // Deux états sont traités pour eux-mêmes plutôt que laissés à un cas par
  // défaut : la cible exactement atteinte, et la cible *sous* le palier atteint.
  // Le second n'est pas une anomalie — c'est un résultat, et il a deux lectures
  // que la restitution ne tranche pas.
  const passageNature = computed(() => {
    if (acquired.value > target.value) return PASSAGES.beyond
    if (acquired.value === target.value) return PASSAGES.reached
    if (acquired.value >= REVOLUTIONARY_FROM) {
      const degree = transformationDegree(target.value)
      return PASSAGES.revolutionary.replace('{reach}', degree ? degree.reach : 'plus loin')
    }
    return target.value >= REVOLUTIONARY_FROM ? PASSAGES.crossing : PASSAGES.evolutionary
  })

  // Ce que la portée déclarée et le contexte disent l'un de l'autre. L'écart
  // reste tu pendant tout le parcours et ne devient un résultat qu'ici : au
  // cadrage il aurait été une objection, à l'ancrage il est une information.
  const intentionGap = computed(() => {
    if (!targetDeclared.value) {
      return 'Faute de portée déclarée, le profil visé retenu est celui que vos attributs de ' +
        `contexte portent : « ${targetLabel.value} ».`
    }
    const declared = state.transformation
    const carried = recommendation.value.level
    if (declared > carried) {
      return `La portée que vous déclarez appelle « ${profileName(declared)} ». Vos attributs de ` +
        `contexte n’en portent que « ${profileName(carried)} » : c’est ce profil, le plus bas des ` +
        'deux, qui sert de cible — on ne fait pas viser un rang que l’organisation n’a pas les ' +
        'moyens de tenir.'
    }
    if (declared < carried) {
      return `Vos attributs de contexte porteraient « ${profileName(carried)} », plus haut que la ` +
        `portée que vous déclarez. La cible reste « ${profileName(declared)} » : viser étroit avec ` +
        'les moyens de viser large est une décision, pas une limite.'
    }
    return `La portée que vous déclarez et ce que votre contexte porte désignent le même profil, ` +
      `« ${targetLabel.value} ».`
  })

  // Les domaines qui séparent de la cible, groupés par palier intermédiaire. Le
  // tri à l'intérieur d'un groupe est celui de domain/scoring.js — rang
  // déclencheur, puis ordre du questionnaire — et jamais le retard constaté :
  // trier au retard serait une priorisation, qui est hors périmètre.
  //
  // Les domaines restés sans réponse sont retirés de cette liste, et c'est une
  // décision de restitution et non de calcul : ils retiennent bel et bien le
  // palier — `blockers` les rend, à raison —, mais ils ne disent rien de
  // l'organisation. Les afficher ici les ferait lire comme des manques constatés,
  // alors qu'ils sont une mesure qui n'a pas eu lieu ; ils sont annoncés à part,
  // avec de quoi y retourner. Sans ce retrait, le même domaine figurerait dans
  // les deux listes et la note qui les sépare serait fausse.
  const gates = computed(() =>
    blockersByGate(EVALUABLE_AREAS, state.answers, target.value)
      .map(group => ({ ...group, areas: group.areas.filter(entry => entry.level > 0) }))
      .filter(group => group.areas.length > 0)
  )

  // La cible est-elle tenue ? La question ne se lit pas sur la liste ci-dessus :
  // celle-ci peut être vide alors que le profil visé n'est pas acquis, si tout
  // ce qui le retient est resté sans réponse. C'est le palier qui tranche.
  const targetReached = computed(() => acquired.value >= target.value)

  const answeredCount = computed(() => Object.keys(state.form).filter(id => state.form[id] != null).length)
  const hasProgress = computed(() =>
    answeredCount.value > 0 ||
    Object.keys(state.answers).length > 0 ||
    state.transformation != null ||
    state.screen !== 'home'
  )

  // — navigation et mutations —

  function go(screen) {
    if (screen === 'home') state.diagIdx = 0
    state.screen = screen
    scrollToTop()
  }

  const nav = {
    home: () => go('home'),
    info: () => go('info'),
    demo: () => go('demo'),
    start: () => go('tool1'),
    phase: screen => { if (screen) go(screen) },
    back() {
      // Dans le questionnaire, « précédent » recule d'un domaine avant de
      // quitter l'écran.
      if (state.screen === 'tool2' && diagIndex.value > 0) {
        state.diagIdx = diagIndex.value - 1
        scrollToTop()
        return
      }
      go(previousScreen(state.screen))
    },
    next() {
      if (state.screen === 'tool2') {
        if (diagIndex.value + 1 < EVALUABLE_AREAS.length) {
          state.diagIdx = diagIndex.value + 1
          scrollToTop()
          return
        }
        // Dernier domaine : tout a été présenté, les résultats suivent. Il n'y a
        // plus de palier à traverser — il n'y a plus qu'une série.
        go('tool3')
        return
      }
      go(NEXT_OF[state.screen] || 'tool4')
    },
    // Reprendre le questionnaire depuis l'ancrage, sur le premier domaine resté
    // sans réponse : c'est ce qu'on vient y chercher. À défaut — tout est
    // renseigné —, on repart du début plutôt que de ne rien faire.
    resumeQuestionnaire() {
      const index = EVALUABLE_AREAS.findIndex(area => !(area.id in state.answers))
      state.diagIdx = index >= 0 ? index : 0
      go('tool2')
    },
    exportPreview: () => go('export'),
    finish: () => go('home')
  }

  const actions = {
    // Une réponse par domaine : le rang de l'énoncé retenu, ou le hors
    // périmètre. Même convention que partout dans l'outil — recliquer la réponse
    // retenue l'annule, et le domaine redevient non renseigné. La clé est alors
    // retirée plutôt que mise à zéro : `answers` ne porte que des réponses, et
    // un 0 stocké se relirait comme une mesure.
    answerArea(areaId, value) {
      const next = { ...state.answers }
      if (next[areaId] === value) delete next[areaId]
      else next[areaId] = value
      state.answers = next
    },
    toggleLevelDetail(n) {
      state.openLevels[n] = !state.openLevels[n]
    },
    // La portée visée, déclarée en phase d'ancrage. Elle fixe le degré de
    // transformation — le profil visé s'en déduit, borné par la recommandation.
    // Recliquer la réponse retenue l'annule, comme un attribut de contexte.
    selectReach(n) {
      state.transformation = state.transformation === n ? null : n
    },
    // Recliquer sur l'option retenue l'annule : l'attribut redevient non renseigné.
    selectOption(fieldId, value) {
      state.form = { ...state.form, [fieldId]: state.form[fieldId] === value ? null : value }
    },
    // La barre navigue par identifiant : les 28 domaines y figurent tous, et
    // aucun n'est hors du parcours depuis que le profil visé ne les ordonne plus.
    openArea(id) {
      const index = EVALUABLE_AREAS.findIndex(area => area.id === id)
      if (index >= 0) state.diagIdx = index
      scrollToTop()
    },
    // L'avertissement de saut est consommé dès qu'il a été lu, quelle que soit
    // la sortie choisie : il dit ce que coûte un formulaire vide, pas ce que
    // coûte chaque clic sur « Passer à l'évaluation ».
    dismissContextWarning() {
      state.contextWarned = true
    },
    // La confirmation est une affaire d'écran : elle se demande dans la modale
    // que porte App, et l'action ne s'exécute qu'une fois la réponse obtenue.
    resetSession() {
      clearSession()
      Object.assign(state, defaultState())
      scrollToTop()
    },
    // Charger une démonstration, c'est repartir d'une session neuve — nouvel
    // identifiant compris — puis y écrire l'exemple. Passer par `defaultState`
    // plutôt que par les seules clés du scénario garantit qu'aucun reste de la
    // session précédente ne subsiste : une réponse oubliée fausserait le profil
    // atteint, et la démonstration montrerait un résultat que le scénario ne
    // produit pas.
    loadDemo(id) {
      const session = buildDemoSession(id)
      if (!session) return
      clearSession()
      Object.assign(state, defaultState(), session)
      scrollToTop()
    }
  }

  // — view-models par écran —

  // Le profil visé ne figure pas dans l'en-tête : il n'est nommé qu'à l'ancrage,
  // une fois la portée déclarée. Les phases ne s'affichent que dans la branche
  // outil — ailleurs elles ne désignent aucune progression.
  const header = computed(() => ({
    // Une session de démonstration ne se distingue d'une vraie par rien de ce
    // qui s'affiche : mêmes écrans, mêmes calculs. L'en-tête est le seul endroit
    // où le dire, et il doit le dire — on n'exporte pas une PME fictive en
    // croyant exporter la sienne.
    sessionLabel: `session ${state.session}` +
      (state.demo ? ' · démonstration' : '') +
      (wasRestored && hasProgress.value ? ' · restaurée' : ''),
    hasProgress: hasProgress.value,
    resetDialog: RESET_DIALOG,
    showPhases: isToolScreen(state.screen),
    // — le verdict collant —
    // Il ne suit que les phases d'évaluation et de résultats. Au cadrage, rien
    // n'a été répondu et il n'y aurait qu'un profil vide à annoncer ; à
    // l'ancrage, la page porte déjà le profil visé et le profil atteint en
    // regard, et un troisième rappel en tête ferait trois verdicts pour un.
    //
    // Il dit trois choses, et pas une de plus : le palier tenu, le premier qui
    // ne l'est pas, et combien de domaines portent une réponse. C'est ce qu'on
    // veut savoir sans remonter, pendant qu'on répond ou qu'on descend une page
    // de résultats.
    //
    // Le profil suivant n'existe pas au haut de l'échelle : à ce point, il n'y a
    // plus de palier à annoncer, et en inventer un serait faire croire que le
    // modèle continue.
    verdict: [2, 3].includes(PHASE_OF[state.screen])
      ? {
        acquiredLabel: acquiredProfile.value.label,
        nextLabel: acquired.value < MAX_RANK ? profileName(acquired.value + 1) : null,
        progress: `${answered.value} / ${EVALUABLE_AREAS.length} domaines renseignés`
      }
      : null,
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
  // domaines — est derrière « en savoir plus » et n'a pas à être lu d'abord.
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
        desc: 'Décrivez votre organisation, situez chaque domaine de capacité, obtenez vos écarts.',
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
        ready: true
      }
    ]
  }))

  // La démonstration ne se raconte pas, elle se charge : l'écran ne montre que
  // les organisations disponibles et ce que chacune donne à voir. Le scénario
  // reste muet sur ses résultats — les nommer ici les figerait dans un texte que
  // le modèle pourrait démentir demain ; il dit ce qu'il illustre, la
  // restitution dit ce qu'il vaut.
  const demo = computed(() => ({
    scenarios: demoScenarios(),
    action: 'Voir les résultats',
    // La confirmation ne se pose que s'il y a quelque chose à écraser.
    confirm: hasProgress.value,
    dialog: DEMO_DIALOG
  }))

  // La carte du parcours ouvre le cadrage : elle situe les quatre phases avant
  // la première question, au lieu de retenir l'accueil.
  const journey = computed(() => ({
    phases: JOURNEY.map(phase => ({
      n: phase.n,
      name: phase.name,
      steps: phase.steps,
      frictions: phase.frictions,
      opps: phase.opps
    }))
  }))

  // L'écran d'information ne dépend d'aucune session : ce qu'il explique — les
  // trois mots, la grille de niveaux, les équivalences d'échelles — vaut avant
  // comme après le diagnostic. Le contenu passe tout de même par le view-model,
  // pour que l'écran continue de ne recevoir que des props et n'aille jamais
  // chercher lui-même dans src/data.
  const info = computed(() => INFO)

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

  // Le cadrage ne montre que le formulaire, et rien n'y est exigé : la seule
  // question qui l'était — le degré de transformation visé — est passée en phase
  // d'ancrage, où l'organisation a lu les énoncés et sait de quoi il retourne.
  //
  // Ce qu'on gagne à décrire son organisation ne s'affiche pas dans la page :
  // rien n'y étant bloquant, l'argument n'a lieu d'être qu'au moment où l'on
  // s'apprête à partir sans avoir répondu — et une seule fois.
  const cadrage3 = computed(() => ({
    warnOnSkip: !contextComplete.value && !state.contextWarned,
    skipDialog: SKIP_DIALOG,
    groups: CONTEXT_GROUPS.map(group => ({
      id: group.id,
      label: group.label,
      fields: group.fields.map(buildField)
    })),
    descriptiveFields: DESCRIPTIVE_FIELDS.map(buildField)
  }))

  // Cette carte a quitté le parcours pour la page d'information, et avec lui la
  // session : elle montre le modèle évaluable entier, que l'écran laisse filtrer
  // par profil. Le view-model ne livre donc que des constantes du modèle — quel
  // profil on consulte est une affaire d'écran, sans effet sur le diagnostic.
  const diagStart = computed(() => ({
    intro: `Le diagnostic parcourt les ${EVALUABLE_AREAS.length} domaines de capacité évaluables du ` +
      `modèle, dans son ordre. Pour chacun, cinq énoncés décrivent cinq situations : vous retenez ` +
      `celui qui décrit la vôtre, ou vous déclarez le domaine hors périmètre. Les critères ` +
      `d'adoption et les pratiques que la source associe au domaine restent affichés à côté — ils ` +
      `disent ce que le modèle y met, ils ne sont pas une liste à cocher.`,
    total: EVALUABLE_AREAS.length,
    // Un profil met en jeu les domaines de son rang et de tous ceux d'en
    // dessous : c'est la règle d'acquisition, lue à l'envers.
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
            // Un domaine non évaluable resterait hors carte : rien ne sert de
            // montrer ce qu'aucun profil ne met en jeu. Aucun ne l'est depuis
            // que la neuvième dimension est rédigée (18.08.2026), mais le
            // filtre reste la garde de ce cas.
            areas: dimension.areas
              .filter(area => !area.pending)
              .map(area => ({ id: area.id, label: area.name, level: area.level }))
          }))
          .filter(dimension => dimension.areas.length > 0)
      }))
      .filter(block => block.dimensions.length > 0)
  }))

  const diag = computed(() => {
    const area = currentArea.value
    const level = area ? areaLevel(area.id, state.answers) : 0
    const outOfScope = area ? isOutOfScope(area.id, state.answers) : false

    // La barre de parcours ne connaît que deux termes : le bloc, qui coiffe, et
    // le domaine, numéroté dans l'ordre du modèle. Elle montre les 28 domaines
    // évaluables — il n'y en a plus qui soient hors du parcours — et dit l'état
    // de chacun : non renseigné, niveau retenu, hors périmètre. La marque tient
    // en un caractère, à côté du numéro qui, lui, ne change jamais.
    const groupsByBlock = new Map()
    EVALUABLE_AREAS.forEach((modelArea, index) => {
      let group = groupsByBlock.get(modelArea.blockId)
      if (!group) {
        group = { key: modelArea.blockId, name: modelArea.block, areas: [] }
        groupsByBlock.set(modelArea.blockId, group)
      }
      const areaOut = isOutOfScope(modelArea.id, state.answers)
      const areaRank = areaLevel(modelArea.id, state.answers)
      group.areas.push({
        id: modelArea.id,
        number: index + 1,
        name: modelArea.name,
        color: areaOut ? null : modelArea.dimColor,
        answered: areaRank > 0,
        outOfScope: areaOut,
        mark: areaOut ? '×' : (areaRank || '·'),
        state: areaOut ? 'hors périmètre' : (areaRank ? `niveau ${areaRank}` : 'non renseigné'),
        active: area ? modelArea.id === area.id : false
      })
    })

    return {
      // Deux nombres, et ils ne disent pas la même chose : où l'on en est du
      // parcours, et combien de domaines portent une réponse. On peut être au
      // vingtième domaine sans en avoir renseigné trois — la position seule
      // laissait croire à un avancement qui n'existait pas.
      progress: `Domaine ${diagIndex.value + 1} / ${EVALUABLE_AREAS.length}` +
        ` · ${answered.value} / ${EVALUABLE_AREAS.length} domaines renseignés`,
      nextLabel: diagIndex.value + 1 < EVALUABLE_AREAS.length ? 'Suivant' : 'Terminer',
      blockGroups: [...groupsByBlock.values()],
      // Ce que le domaine est : de quoi lire les énoncés sans avoir à les
      // deviner. Le rappel n'accuse rien — la réponse est juste au-dessus.
      area: {
        id: area ? area.id : '',
        name: area ? area.name : '',
        desc: area ? area.desc : '',
        color: area ? area.dimColor : null,
        dim: area ? area.dim : '',
        block: area ? area.block : '',
        exampleArtifacts: area ? area.exampleArtifacts || [] : [],
        // Le rang auquel le modèle attend ce domaine. Il ne se cache pas : il
        // explique pourquoi un domaine pèse sur tel palier et pas sur tel autre.
        required: area ? area.level : 0
      },
      // L'unité de réponse : cinq énoncés, un retenu, plus la sortie « hors
      // périmètre ». L'échelle entière reste visible — on choisit parmi cinq
      // situations, on ne parcourt pas une jauge.
      picker: {
        question: PICKER_QUESTION,
        hint: PICKER_HINT,
        statements: area
          ? (STATEMENTS[area.id] || []).map(statement => ({
            value: statement.n,
            text: statement.text,
            active: level === statement.n
          }))
          : [],
        outOfScope: {
          value: OUT_OF_SCOPE,
          label: OUT_OF_SCOPE_LABEL,
          note: OUT_OF_SCOPE_NOTE,
          active: outOfScope
        }
      }
      // Les critères d'adoption et les pratiques ne sont plus exposés ici. Ils
      // restent dans model-data.json et le modèle continue de les porter — c'est
      // le report littéral de la source, il ne s'amincit pas —, mais l'unité de
      // réponse est l'énoncé, et lui seul. Affichés à côté des énoncés, ils
      // rouvraient la lecture en liste de conditions et donnaient à croire qu'on
      // répondait sur eux.
    }
  })

  // — résultats (phase 3) —
  // Ce que le diagnostic constate, et rien de ce qu'on vise : la cible n'est
  // nommée qu'à l'ancrage, où elle se déclare. Tant qu'elle ne l'est pas,
  // l'échelle des paliers ne porte aucune marque de cible.
  const resti1 = computed(() => ({
    unit: unit.value,
    acquiredLabel: acquiredLabel.value,
    acquiredDesc: acquiredProfile.value.desc,
    acquiredPosition: acquiredPosition.value,
    // Sur quoi porte la mesure : les domaines en périmètre effectivement
    // renseignés, ceux qui restent à évaluer, ceux qui en sont sortis. Les trois
    // nombres se lisent ensemble — le premier ne veut rien dire sans les deux
    // autres.
    coverage: `${scoped.value.length - pending.value.length} domaines de capacité situés sur ` +
      `${scoped.value.length} en périmètre` +
      (pending.value.length ? ` · ${pending.value.length} à évaluer` : '') +
      (outOfScopeAreas.value.length ? ` · ${outOfScopeAreas.value.length} hors périmètre` : ''),
    // Les deux listes sont assemblées ici plutôt que dans le template : la vue
    // ne calcule rien, pas même une jointure.
    outOfScopeLabel: outOfScopeAreas.value.map(area => area.name).join(' · '),
    pendingLabel: pending.value.map(area => area.name).join(' · '),
    // L'échelle des paliers. Elle commence au premier profil du modèle et n'a
    // plus de marche de rang 0 : il n'y a rien sous « Exploration localisée »,
    // et un palier hors modèle placé là redirait ce que la couverture dit déjà.
    //
    // Chaque palier porte son avancement — combien des domaines qu'il attend
    // l'atteignent. Ce ratio n'entre nulle part dans l'acquisition, qui reste un
    // seuil : il dit de combien il s'en est fallu, pas « presque acquis ». Et il
    // ne peut pas dépasser son total, par construction.
    ladder: LEVELS.map(level => {
      const progress = gateProgress(EVALUABLE_AREAS, state.answers, level.n)
      const missing = progress.expected - progress.done
      // Les domaines renseignés que ce palier attend et qui n'y sont pas. Même
      // retrait qu'à l'ancrage : `blockers` rend aussi les domaines restés sans
      // réponse — à raison, ils retiennent le palier — mais les focaliser les
      // ferait lire comme des manques constatés, alors qu'ils sont une mesure
      // qui n'a pas eu lieu. Ils sont annoncés à part, avec de quoi y retourner.
      const blocking = blockers(EVALUABLE_AREAS, state.answers, level.n)
        .filter(entry => entry.level > 0)
      return {
        n: level.n,
        label: level.name,
        acquired: level.n === acquired.value,
        isTarget: targetDeclared.value && level.n === target.value,
        reached: level.n <= acquired.value,
        // Les trois états de l'échelle. « Suivant » est le premier palier non
        // tenu : c'est le seul dont il y ait quelque chose à dire tout de
        // suite, les autres supposant celui-là franchi. Il n'existe pas quand
        // le haut de l'échelle est atteint.
        next: level.n === acquired.value + 1,
        upcoming: level.n > acquired.value + 1,
        // Le retrait ne vaut que pour ce qui est à la fois au-dessus de la cible
        // et au-dessus du palier atteint. Un palier tenu mais plus haut que la
        // portée déclarée reste pleinement lisible : c'est un fait acquis, pas
        // un excédent à estomper.
        beyondTarget: targetDeclared.value && level.n > target.value && level.n > acquired.value,
        // La ligne se trace *au-dessus* du premier palier révolutionnaire,
        // c'est-à-dire entre le deuxième et le troisième.
        opensLine: level.n === REVOLUTIONARY_FROM,
        progress,
        // L'avancement en toutes lettres, et jamais en jauge ni en pourcentage :
        // une barre aux quatre cinquièmes se lit « presque acquis », alors qu'un
        // seul domaine manquant suffit à ne pas franchir le seuil. Le texte dit
        // ce qu'il compte, et l'écart dit de combien il s'en est fallu.
        progressLabel: progress.expected
          ? `${progress.done} des ${progress.expected} domaines attendus y sont`
          : 'aucun domaine attendu n’est en périmètre',
        shortfall: progress.expected && missing > 0
          ? `il en manque ${missing}`
          : null,
        // De quoi focaliser le détail par domaine sur ce que ce palier retient.
        // La liste est vide sur un palier tenu — il n'y a rien à montrer — et le
        // libellé vaut alors null : l'écran n'a pas à fabriquer une phrase pour
        // un cas qui ne se produit pas.
        blocking: blocking.map(entry => entry.id),
        focusLabel: blocking.length
          ? `${blocking.length} domaine${blocking.length > 1 ? 's' : ''} renseigné` +
            `${blocking.length > 1 ? 's' : ''} retien${blocking.length > 1 ? 'nent' : 't'} ` +
            `« ${level.name} »`
          : null
      }
    }),
    // La ligne qui partage l'échelle. Elle ne dépend d'aucune réponse : elle est
    // une propriété du modèle, et se trace donc aussi sur une session vierge.
    line: {
      label: REVOLUTIONARY_LINE.label,
      text: REVOLUTIONARY_LINE.text
    },
    ladderNote: LADDER_NOTE,
    // Où en est la cible sur cette échelle. Quatre cas, tous dits.
    targetState: {
      label: targetDeclared.value ? targetLabel.value : null,
      text: !targetDeclared.value
        ? LADDER_TARGET.undeclared
        : acquired.value > target.value
          ? LADDER_TARGET.below
          : acquired.value === target.value
            ? LADDER_TARGET.reached
            : LADDER_TARGET.above
    },
    // Les neuf dimensions à plat, en nombres et non en libellés : le radar et
    // les barres ont besoin de valeurs pour placer un point et calculer une
    // largeur. C'est la même mesure que celle des blocs ci-dessous, dans l'autre
    // sens de lecture — là, groupée par bloc et rendue en toutes lettres ; ici,
    // les neuf ensemble, ce qui est le seul moyen de les comparer entre elles.
    //
    // `null` reste `null` et ne devient jamais 0. Une dimension dont aucun
    // domaine en périmètre n'est renseigné n'a pas été mesurée : un zéro s'y
    // lirait comme le pire résultat possible, alors que rien n'a été mesuré.
    // C'est la figure qui doit s'en accommoder, pas la donnée qui doit mentir.
    radar: {
      scale: MAX_RANK,
      dimensions: BLOCKS.flatMap(block =>
        block.dimensions.map(dimension => {
          const average = dimAverage(EVALUABLE_AREAS, state.answers, dimension.id)
          const floor = dimFloor(EVALUABLE_AREAS, state.answers, dimension.id)
          const rated = inScopeAreas(EVALUABLE_AREAS, state.answers)
            .filter(area => area.dimId === dimension.id && areaLevel(area.id, state.answers) > 0)
          const inDimension = EVALUABLE_AREAS.filter(area => area.dimId === dimension.id)
          return {
            id: dimension.id,
            name: dimension.name,
            color: dimension.color,
            block: block.name,
            average,
            floor,
            averageLabel: rankLabel(average),
            floorLabel: floor === null ? '—' : String(floor),
            // Pourquoi il n'y a pas de valeur, quand il n'y en a pas. Les deux
            // absences ne sont pas la même chose et la figure ne peut les
            // montrer ni l'une ni l'autre : elle n'a qu'un trou à offrir.
            missing: average === null
              ? (inDimension.every(area => isOutOfScope(area.id, state.answers))
                ? 'tous hors périmètre'
                : 'aucun domaine renseigné')
              : null,
            rated: `${rated.length} sur ${inDimension.length}`
          }
        })
      )
    },
    // Le bloc ne porte pas de niveau : il regroupe des dimensions pour la
    // lecture, l'échelle se joue sur le périmètre entier. Chaque dimension se
    // lit sur deux nombres qui ne disent pas la même chose — la moyenne situe
    // l'ensemble, le plancher dit ce qui la retiendrait si elle était un palier.
    // Aucun des deux n'est agrégé en un score global : le modèle n'en restitue
    // aucun.
    blocks: BLOCKS.map(block => ({
      id: block.id,
      name: block.name,
      dimensionColors: block.dimensions.map(dimension => dimension.color),
      dimensions: block.dimensions.map(dimension => {
        const average = dimAverage(EVALUABLE_AREAS, state.answers, dimension.id)
        const floor = dimFloor(EVALUABLE_AREAS, state.answers, dimension.id)
        return {
          id: dimension.id,
          name: dimension.name,
          color: dimension.color,
          // Rapporté au haut de l'échelle, jamais au rang visé : une moyenne de
          // niveaux ne peut pas dépasser 5, elle pouvait dépasser la cible.
          average: rankLabel(average),
          scale: MAX_RANK,
          floor: floor === null ? '—' : String(floor)
        }
      })
    }))
  }))

  // Le détail domaine par domaine, dans l'ordre du modèle. Trois états, et
  // chacun se dit : un niveau, un domaine non renseigné, un domaine hors
  // périmètre. Les deux derniers ne sont pas des zéros — les afficher comme tels
  // les ferait lire comme des mesures.
  const resti2 = computed(() => ({
    rows: BLOCKS.flatMap(block =>
      block.dimensions.flatMap(dimension =>
        EVALUABLE_AREAS
          .filter(area => area.dimId === dimension.id)
          .map((area, indexInDimension) => {
            const level = areaLevel(area.id, state.answers)
            const out = isOutOfScope(area.id, state.answers)
            return {
              id: area.id,
              dim: indexInDimension === 0 ? dimension.name : '',
              firstOfDimension: indexInDimension === 0,
              color: dimension.color,
              area: area.name,
              required: area.level,
              level,
              // Ce que la ligne affiche dans la colonne du niveau : le rang, ou
              // la raison de son absence.
              levelLabel: out ? 'hors périmètre' : (level ? String(level) : 'non renseigné'),
              outOfScope: out,
              // Un domaine est « au rang » quand il atteint le rang auquel le
              // modèle l'attend. C'est la seule marque binaire de la page, et
              // elle ne vaut que pour ce rang-là — pas pour le palier global.
              atRequired: !out && level >= area.level
            }
          })
      )
    )
  }))

  // — ancrage (phase 4) —
  // La portée visée s'y déclare, le profil visé s'en déduit, l'écart s'y lit, et
  // la pièce à emporter s'y produit. La phase s'arrête là : préparer l'ancrage,
  // pas le conduire.
  const reachField = computed(() => ({
    id: REACH_QUESTION.id,
    label: REACH_QUESTION.question,
    hint: REACH_QUESTION.hint,
    options: REACH_QUESTION.options.map(option => ({
      value: option.n,
      label: option.label,
      active: state.transformation === option.n
    })),
    // Les cinq situations détaillées sont fournies ; laquelle s'affiche est une
    // décision d'écran (voir `pinActive` dans ContextField) : la seule retenue
    // au repos, les cinq derrière le « + ».
    criteria: REACH_QUESTION.options.map(option => ({
      value: option.n,
      label: option.label,
      text: option.detail,
      active: state.transformation === option.n
    }))
  }))

  const ancrage = computed(() => ({
    reachField: reachField.value,
    declared: targetDeclared.value,
    targetLabel: targetLabel.value,
    acquiredLabel: acquiredLabel.value,
    // L'écart se lit en deux temps : sa nature d'abord — ce qu'on s'apprête à
    // entreprendre —, les domaines ensuite. L'ordre inverse ferait lire une
    // liste de tâches là où il y a parfois un changement de nature.
    passage: passageNature.value,
    intentionGap: intentionGap.value,
    // Un groupe par palier intermédiaire, du palier suivant à la cible incluse.
    gates: gates.value.map(group => ({
      level: group.level,
      label: profileName(group.level),
      areas: group.areas
    })),
    // Rien à lever : la cible est tenue, ou dépassée. Les deux se disent, et
    // aucun des deux ne se dit comme un écart. Le drapeau se lit sur le palier
    // et non sur la liste : celle-ci peut être vide alors que la cible n'est pas
    // tenue, quand tout ce qui la retient est resté sans réponse.
    empty: targetReached.value,
    emptyLabel: acquired.value > target.value
      ? 'Le profil visé est en deçà du profil atteint'
      : 'Profil visé atteint',
    // Ce cas-là ne se laisse pas deviner : la cible n'est pas tenue, et pourtant
    // il n'y a rien à montrer. Le dire évite qu'on lise l'absence de liste comme
    // une absence d'écart.
    unmeasured: !targetReached.value && gates.value.length === 0
      ? 'Aucun domaine renseigné ne retient le profil visé : ce qui vous en sépare tient ' +
        'entièrement aux domaines restés à évaluer, ci-dessous.'
      : '',
    outOfScope: outOfScopeAreas.value.length
      ? {
        summary: `${outOfScopeAreas.value.length} domaine${outOfScopeAreas.value.length > 1 ? 's' : ''} ` +
          'de capacité déclaré' + (outOfScopeAreas.value.length > 1 ? 's' : '') + ' hors périmètre',
        note: 'Ils sont sortis du calcul : ils ne retiennent aucun palier et n’en font franchir ' +
          'aucun. Ils sont déclarés ici pour que la lecture des résultats sache sur quoi elle porte.',
        areasLabel: outOfScopeAreas.value.map(area => area.name).join(' · ')
      }
      : null,
    pending: pending.value.length
      ? {
        summary: `${pending.value.length} domaine${pending.value.length > 1 ? 's' : ''} ` +
          'de capacité reste' + (pending.value.length > 1 ? 'nt' : '') + ' à évaluer',
        note: 'Ce ne sont pas des manques : faute de réponse, ils ne disent rien de votre ' +
          'organisation. L’écart ci-dessus ne les compte pas, et la mesure reste incomplète tant ' +
          'qu’ils n’ont pas été situés.',
        areasLabel: pending.value.map(area => area.name).join(' · '),
        resumeLabel: 'Revenir au questionnaire'
      }
      : null
  }))

  const exportPreview = computed(() => {
    // Une entrée par domaine qui sépare de la cible, à plat et dans l'ordre des
    // paliers : le document se lit hors de l'outil, sans repli ni interaction.
    const entries = gates.value.flatMap(group =>
      group.areas.map(area => ({ ...area, gate: group.level, gateLabel: profileName(group.level) }))
    )
    const rows = entries.map((entry, index) => ({
      ...entry,
      showGate: index === 0 || entries[index - 1].gate !== entry.gate
    }))
    const pages = []
    for (let i = 0; i < rows.length; i += GAP_GROUPS_PER_PAGE) {
      pages.push(rows.slice(i, i + GAP_GROUPS_PER_PAGE))
    }
    if (!pages.length) pages.push([])
    return {
      meta: `Export ${today()} · model: ${MODEL_VERSION} · session: ${state.session}`,
      // Ce que l'export nomme avant tout autre chose : l'unité sur laquelle il
      // porte. Relu hors de l'outil, il n'a personne pour le préciser.
      unit: unit.value,
      // Seule sortie numérotée : relue hors de l'outil, elle doit situer le
      // profil dans l'échelle sans supposer qu'on la connaisse par cœur.
      targetLabel: profileExportLabel(target.value),
      acquiredLabel: acquiredProfile.value.exportLabel,
      // Le document dit sur quoi il porte : sans cette ligne, un lecteur
      // extérieur prendrait la liste pour un bilan complet du modèle.
      coverage: `${scoped.value.length - pending.value.length} domaines de capacité situés sur ` +
        `${scoped.value.length} en périmètre` +
        (pending.value.length ? ` · ${pending.value.length} à évaluer` : '') +
        (outOfScopeAreas.value.length ? ` · ${outOfScopeAreas.value.length} hors périmètre` : ''),
      // Le même partage qu'à l'écran : la cible dépassée, la cible tenue, et le
      // cas où rien n'est listé parce que rien n'a été mesuré.
      emptyLabel: acquired.value > target.value
        ? 'Aucun domaine ne sépare du profil visé : le profil atteint le dépasse.'
        : targetReached.value
          ? 'Aucun domaine ne sépare du profil visé — tous les domaines qu’il met en jeu l’atteignent.'
          : 'Aucun domaine renseigné ne retient le profil visé : ce qui en sépare tient aux ' +
            'domaines restés à évaluer, que la couverture ci-dessus dénombre.',
      pages: pages.map((pageRows, index) => ({
        rows: pageRows,
        empty: pageRows.length === 0,
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
    demo,
    journey,
    info,
    cadrage1,
    cadrage3,
    diagStart,
    diag,
    resti1,
    resti2,
    ancrage,
    exportPreview
  })
}

// Ce que la restitution affiche, lu sur les view-models eux-mêmes et non sur le
// calcul qui les alimente. Deux choses s'y vérifient que les tests de règles ne
// peuvent pas voir : que les trois démonstrations tombent bien aux trois
// positions de l'échelle de transformation — c'est leur seule raison d'être —,
// et qu'aucune valeur affichée ne dépasse son total.
//
// Ce dernier point n'est pas une précaution abstraite : l'experte métier a relevé
// un « 3,1 / 3 » dans la restitution, un rang moyen rapporté au rang visé au lieu
// du haut de l'échelle. Le calcul a changé depuis ; supposer que le défaut a
// disparu avec lui ne vaut pas mieux que la supposition qui l'avait laissé
// passer.
//
// Le composable tourne sans navigateur : il ne touche à `window` que pour
// persister — ce qu'il abandonne silencieusement s'il n'y en a pas — et pour
// remonter la page, à quoi une doublure suffit.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useMaturityTool } from '../src/composables/useMaturityTool.js'
import { DEMO_SESSIONS } from '../src/data/demo-sessions.js'
import { PASSAGES, REVOLUTIONARY_FROM } from '../src/data/transformation.js'
import {
  AREAS, DIMENSION_COUNT, EVALUABLE_AREAS, LEVELS, profileName
} from '../src/domain/model.js'
import { MAX_RANK, MIN_RANK, OUT_OF_SCOPE } from '../src/domain/scoring.js'

beforeEach(() => {
  vi.stubGlobal('window', { scrollTo: () => {} })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

// Une session chargée depuis un scénario de démonstration, prête à être lue.
function demo(id) {
  const tool = useMaturityTool()
  tool.actions.loadDemo(id)
  return tool
}

// Les trois positions, telles que la restitution les nomme. On compare le texte
// du passage aux quatre du modèle plutôt qu'un rang à un autre : c'est ce texte
// que le lecteur reçoit, et c'est lui qui doit différer d'un cas à l'autre.
function positionOf(tool) {
  const passage = tool.ancrage.passage
  if (passage === PASSAGES.reached) return 'reached'
  if (passage === PASSAGES.beyond) return 'beyond'
  if (passage === PASSAGES.crossing) return 'crossing'
  if (passage === PASSAGES.evolutionary) return 'evolutionary'
  return 'revolutionary'
}

describe('les trois démonstrations', () => {
  it('tombent à trois positions différentes de l’échelle de transformation', () => {
    const positions = DEMO_SESSIONS.map(scenario => positionOf(demo(scenario.id)))
    expect(positions).toEqual(['evolutionary', 'crossing', 'reached'])
    expect(new Set(positions).size).toBe(3)
  })

  it('sous la ligne : la Menuiserie Rochat vise plus bas que la ligne et n’y est pas', () => {
    const tool = demo('rochat')
    expect(tool.ancrage.targetLabel).toBe('Intégration opérationnelle')
    expect(tool.resti1.acquiredLabel).toBe('Exploration localisée')
    expect(tool.ancrage.gates.length).toBeGreaterThan(0)
    expect(tool.ancrage.gates[0].level).toBe(2)
  })

  it('la franchissant : la Clinique Bel-Air vise au-dessus de la ligne sans y être', () => {
    const tool = demo('belair')
    expect(tool.resti1.acquiredLabel).toBe('Intégration opérationnelle')
    expect(tool.ancrage.gates.map(group => group.level)).toEqual([REVOLUTIONARY_FROM])
  })

  it('déjà refermé : le Groupe Terravia n’a plus d’écart', () => {
    const tool = demo('terravia')
    expect(tool.ancrage.empty).toBe(true)
    expect(tool.ancrage.gates).toHaveLength(0)
    expect(tool.ancrage.emptyLabel).toBe('Profil visé atteint')
  })

  it('la PME qui consomme de l’IA déclare des domaines hors périmètre, et ils sont dits à part', () => {
    const tool = demo('rochat')
    expect(tool.ancrage.outOfScope).not.toBeNull()
    expect(tool.ancrage.outOfScope.areasLabel).toBeTruthy()
    // Aucun domaine hors périmètre ne se retrouve dans l'écart.
    const cited = tool.ancrage.gates.flatMap(group => group.areas.map(area => area.id))
    const out = EVALUABLE_AREAS
      .filter(area => tool.state.answers[area.id] === OUT_OF_SCOPE)
      .map(area => area.id)
    expect(out.length).toBeGreaterThan(0)
    out.forEach(id => expect(cited).not.toContain(id))
  })

  it('les domaines restés sans réponse sont annoncés à part, jamais comme un écart', () => {
    const tool = demo('rochat')
    expect(tool.ancrage.pending).not.toBeNull()
    const cited = tool.ancrage.gates.flatMap(group => group.areas.map(area => area.id))
    const pending = EVALUABLE_AREAS
      .filter(area => !(area.id in tool.state.answers))
      .map(area => area.id)
    expect(pending.length).toBeGreaterThan(0)
    pending.forEach(id => expect(cited).not.toContain(id))
  })
})

describe('l’échelle des paliers', () => {
  // L'échelle portait une marche de rang 0, le profil « Préparation », ajouté
  // hors modèle sous « Exploration localisée ». Il a été retiré : l'échelle par
  // énoncés a supprimé le cas qu'il traitait, tout domaine renseigné portant
  // désormais un niveau. L'échelle commence donc au premier profil du modèle.
  it('n’a plus de marche de rang 0 : elle commence au premier profil du modèle', () => {
    const tool = demo('belair')
    expect(tool.resti1.ladder).toHaveLength(LEVELS.length)
    expect(tool.resti1.ladder.map(step => step.n)).toEqual(LEVELS.map(level => level.n))
    expect(tool.resti1.ladder[0].n).toBe(1)
    tool.resti1.ladder.forEach(step => expect(step.n).toBeGreaterThanOrEqual(1))
  })

  it('ne peut plus exporter de « Niveau 0 »', () => {
    const vierge = useMaturityTool()
    expect(vierge.exportPreview.acquiredLabel).not.toContain('Niveau 0')
    DEMO_SESSIONS.forEach(scenario => {
      expect(demo(scenario.id).exportPreview.acquiredLabel).not.toContain('Niveau 0')
    })
  })

  // La ligne évolutif / révolutionnaire se trace entre le deuxième et le
  // troisième palier. Elle ne dépend d'aucune réponse : c'est une propriété du
  // modèle, et elle doit donc se trouver aussi sur une session vierge.
  it('trace la ligne évolutif / révolutionnaire, y compris sur une session vierge', () => {
    const vierge = useMaturityTool()
    const marked = vierge.resti1.ladder.filter(step => step.opensLine)
    expect(marked).toHaveLength(1)
    expect(marked[0].n).toBe(REVOLUTIONARY_FROM)
    expect(vierge.resti1.line.label).toBeTruthy()
    expect(vierge.resti1.line.text).toBeTruthy()
  })

  // L'acquisition est un seuil : l'avancement dit de combien il s'en est fallu,
  // jamais où l'on en serait « sur » un palier. Le view-model ne rend donc aucun
  // ratio prêt à remplir une jauge, et l'écart n'est nommé que s'il en reste un.
  it('l’avancement d’un palier acquis n’annonce aucun manque', () => {
    const tool = demo('terravia')
    tool.resti1.ladder.forEach(step => {
      if (step.reached) expect(step.shortfall, step.label).toBeNull()
      expect(step.progressLabel, step.label).toBeTruthy()
    })
  })

  // Les quatre positions de la cible sur l'échelle, chacune avec son texte :
  // non déclarée, plus haut, atteinte, sous le palier atteint. Aucune n'est
  // laissée à un défaut muet — une échelle sans marque de cible et sans phrase
  // se lirait comme une cible à zéro.
  it('dit toujours où en est la cible, et les quatre cas diffèrent', () => {
    const tool = demo('terravia')

    const declared = tool.resti1.targetState.text
    expect(tool.resti1.targetState.label).toBe(tool.ancrage.targetLabel)

    tool.actions.selectReach(tool.state.transformation) // annule la portée
    const undeclared = tool.resti1.targetState
    expect(undeclared.label).toBeNull()
    expect(undeclared.text).toBeTruthy()
    expect(tool.resti1.ladder.some(step => step.isTarget)).toBe(false)

    tool.actions.selectReach(1)
    const below = tool.resti1.targetState.text

    const belair = demo('belair')
    const above = belair.resti1.targetState.text

    const textes = new Set([declared, undeclared.text, below, above])
    expect(textes.size).toBe(4)
    textes.forEach(texte => expect(texte).toBeTruthy())
  })

  // Un palier tenu mais plus haut que la portée déclarée n'est pas un excédent
  // à estomper : c'est un fait acquis, et il reste pleinement lisible.
  it('n’estompe jamais un palier atteint, même au-dessus de la cible', () => {
    const tool = demo('terravia')
    tool.actions.selectReach(1)
    tool.resti1.ladder.forEach(step => {
      if (step.reached) expect(step.beyondTarget, step.label).toBe(false)
    })
  })
})

describe('l’échelle : états, remplissage, focalisation', () => {
  // Les trois états de la ligne 3.5 du backlog. Ils partagent l'échelle sans se
  // recouvrir : chaque palier est tenu, ou le suivant, ou à venir — et un seul
  // porte la marque du diagnostic.
  it('acquis, suivant et à venir se partagent l’échelle sans se recouvrir', () => {
    DEMO_SESSIONS.forEach(scenario => {
      const tool = demo(scenario.id)
      tool.resti1.ladder.forEach(step => {
        const etats = [step.reached, step.next, step.upcoming].filter(Boolean)
        expect(etats, `${scenario.name} — ${step.label}`).toHaveLength(1)
      })
      expect(tool.resti1.ladder.filter(step => step.acquired)).toHaveLength(1)
      expect(tool.resti1.ladder.filter(step => step.next)).toHaveLength(1)
    })
  })

  it('une session vierge n’a aucun palier tenu, et le premier est le suivant', () => {
    const tool = useMaturityTool()
    expect(tool.resti1.ladder.some(step => step.reached)).toBe(false)
    expect(tool.resti1.ladder[0].next).toBe(true)
  })

  // Le remplissage est proportionnel à gateProgress. Il ne peut pas déborder :
  // les domaines atteints sont un sous-ensemble des domaines attendus. Un palier
  // tenu est plein — c'est ce qui rend le seuil lisible malgré la barre.
  it('le remplissage ne dépasse jamais son total, et un palier tenu est plein', () => {
    const sessions = [...DEMO_SESSIONS.map(scenario => demo(scenario.id)), useMaturityTool()]
    sessions.forEach(tool => {
      tool.resti1.ladder.forEach(step => {
        const { done, expected } = step.progress
        expect(done, step.label).toBeLessThanOrEqual(expected)
        expect(done, step.label).toBeGreaterThanOrEqual(0)
        if (step.reached && expected) expect(done, step.label).toBe(expected)
      })
    })
  })

  // La focalisation n'expose que des domaines renseignés. Un domaine sans
  // réponse retient bel et bien le palier — `blockers` le rend, à raison — mais
  // le focaliser le ferait lire comme un manque constaté, alors qu'il est une
  // mesure qui n'a pas eu lieu. Même retrait qu'à l'ancrage.
  it('ne focalise jamais un domaine resté sans réponse', () => {
    const tool = demo('rochat')
    const sansReponse = EVALUABLE_AREAS
      .filter(area => !(area.id in tool.state.answers))
      .map(area => area.id)
    expect(sansReponse.length).toBeGreaterThan(0)

    const focalises = tool.resti1.ladder.flatMap(step => step.blocking)
    sansReponse.forEach(id => expect(focalises).not.toContain(id))
  })

  it('ne focalise jamais un domaine hors périmètre', () => {
    const tool = demo('rochat')
    const hors = EVALUABLE_AREAS
      .filter(area => tool.state.answers[area.id] === OUT_OF_SCOPE)
      .map(area => area.id)
    expect(hors.length).toBeGreaterThan(0)

    const focalises = tool.resti1.ladder.flatMap(step => step.blocking)
    hors.forEach(id => expect(focalises).not.toContain(id))
  })

  // Un palier tenu ne retient rien : il n'y a rien à focaliser, et le libellé
  // vaut null plutôt qu'une phrase fabriquée pour un cas qui ne se produit pas.
  it('un palier tenu n’offre rien à focaliser', () => {
    const tool = demo('terravia')
    tool.resti1.ladder.forEach(step => {
      if (!step.reached) return
      expect(step.blocking, step.label).toHaveLength(0)
      expect(step.focusLabel, step.label).toBeNull()
    })
  })

  it('un palier qui retient des domaines les annonce et les compte juste', () => {
    const tool = demo('rochat')
    const suivant = tool.resti1.ladder.find(step => step.next)
    expect(suivant.blocking.length).toBeGreaterThan(0)
    expect(suivant.focusLabel).toContain(String(suivant.blocking.length))
    expect(suivant.focusLabel).toContain(suivant.label)
  })
})

describe('la lecture par dimension du radar', () => {
  // Neuf dimensions, en nombres : c'est ce dont la figure a besoin pour placer
  // un point. Les libellés restent à côté, pour le tableau.
  it('rend les neuf dimensions du modèle, en valeurs et non en libellés', () => {
    const tool = demo('belair')
    expect(tool.resti1.radar.dimensions).toHaveLength(DIMENSION_COUNT)
    expect(tool.resti1.radar.scale).toBe(MAX_RANK)
    tool.resti1.radar.dimensions.forEach(dimension => {
      expect(typeof dimension.average, dimension.id).toBe('number')
      expect(dimension.average, dimension.id).toBeLessThanOrEqual(MAX_RANK)
      expect(dimension.average, dimension.id).toBeGreaterThanOrEqual(dimension.floor)
      expect(dimension.color, dimension.id).toBeTruthy()
    })
  })

  // LE POINT DE LA LIGNE 3.6 QUI NE SE NÉGOCIE PAS.
  //
  // Une dimension sans mesure ne vaut pas 0 : elle vaut `null`, et la figure
  // doit s'en accommoder plutôt que la donnée mentir. Un zéro s'y lirait comme
  // le pire résultat possible alors que rien n'a été mesuré — même famille de
  // défaut que le « 3,1 / 3 » relevé par l'experte métier.
  it('ne rend jamais 0 pour une dimension sans mesure', () => {
    const vierge = useMaturityTool()
    vierge.resti1.radar.dimensions.forEach(dimension => {
      expect(dimension.average, dimension.id).toBeNull()
      expect(dimension.floor, dimension.id).toBeNull()
      expect(dimension.average, dimension.id).not.toBe(0)
    })

    const horsPerimetre = useMaturityTool()
    EVALUABLE_AREAS.forEach(area => horsPerimetre.actions.answerArea(area.id, OUT_OF_SCOPE))
    horsPerimetre.resti1.radar.dimensions.forEach(dimension => {
      expect(dimension.average, dimension.id).toBeNull()
      expect(dimension.floor, dimension.id).toBeNull()
    })
  })

  // Les deux absences ne sont pas la même chose, et la figure n'a qu'un trou à
  // offrir pour les deux : c'est le texte qui les distingue.
  it('distingue « tous hors périmètre » de « aucun domaine renseigné »', () => {
    const vierge = useMaturityTool()
    vierge.resti1.radar.dimensions.forEach(dimension => {
      expect(dimension.missing, dimension.id).toBe('aucun domaine renseigné')
    })

    const horsPerimetre = useMaturityTool()
    EVALUABLE_AREAS.forEach(area => horsPerimetre.actions.answerArea(area.id, OUT_OF_SCOPE))
    horsPerimetre.resti1.radar.dimensions.forEach(dimension => {
      expect(dimension.missing, dimension.id).toBe('tous hors périmètre')
    })
  })

  it('une dimension mesurée ne porte aucune raison d’absence', () => {
    demo('terravia').resti1.radar.dimensions.forEach(dimension => {
      expect(dimension.missing, dimension.id).toBeNull()
    })
  })

  // Le radar et la grille par bloc lisent la même mesure : si les deux
  // divergeaient, la page se contredirait d'une section à l'autre.
  it('dit la même mesure que la grille par bloc', () => {
    const tool = demo('rochat')
    const grille = tool.resti1.blocks.flatMap(block => block.dimensions)
    tool.resti1.radar.dimensions.forEach((dimension, index) => {
      expect(dimension.averageLabel, dimension.id).toBe(grille[index].average)
      expect(dimension.floorLabel, dimension.id).toBe(grille[index].floor)
      expect(tool.resti1.radar.scale).toBe(grille[index].scale)
    })
  })
})

describe('la session entièrement au rang le plus bas', () => {
  // TEST DE CONSTAT — il fixe une conséquence assumée, pas une règle défendue.
  //
  // L'énoncé de rang 1 décrit l'absence : « rien n'est en place ». Une
  // organisation qui retient cet énoncé sur les 28 domaines a donc répondu
  // partout, et tous les domaines du premier rang atteignent le rang 1. Le
  // premier palier du modèle est acquis à la lettre, et l'outil le nomme :
  // « Exploration localisée ».
  //
  // Rien ne rattrape cela, et c'est délibéré. Le profil « Préparation » qui
  // s'intercalait a été retiré, et aucun seuil de remplacement ne l'a suivi :
  // un plancher inventé ici serait une règle de l'outil et non du modèle, et il
  // devrait être défendu comme telle.
  //
  // Ce test est écrit pour que le jour où quelqu'un voudra changer cela, il
  // sache exactement ce qu'il change : il ne « corrige » pas un bogue, il
  // renverse une décision.
  it('acquiert le premier palier du modèle, et le nomme', () => {
    const tool = useMaturityTool()
    EVALUABLE_AREAS.forEach(area => tool.actions.answerArea(area.id, MIN_RANK))

    expect(tool.resti1.acquiredLabel).toBe(profileName(1))
    expect(tool.resti1.acquiredLabel).toBe('Exploration localisée')
    expect(tool.resti1.ladder[0].acquired).toBe(true)
    expect(tool.exportPreview.acquiredLabel).toBe('Niveau 1 — Exploration localisée')
  })

  // Le pendant : tant que le premier rang n'est pas complet, aucun palier n'est
  // acquis et la restitution ne nomme pas de profil. C'est le seul cas que le
  // texte « diagnostic en cours » couvre encore.
  it('ne nomme aucun profil tant que le premier rang est incomplet', () => {
    const tool = useMaturityTool()
    const premiers = EVALUABLE_AREAS.filter(area => area.level === 1)
    premiers.slice(1).forEach(area => tool.actions.answerArea(area.id, MIN_RANK))

    expect(tool.resti1.ladder.some(step => step.acquired)).toBe(false)
    expect(tool.resti1.acquiredLabel).toBe('Diagnostic en cours')
  })
})

describe('le questionnaire n’expose que des énoncés', () => {
  // Les critères d'adoption et les pratiques restent dans le modèle : ils y
  // sont le report littéral de la source. Le questionnaire ne les montre plus —
  // affichés à côté des énoncés, ils rouvraient la lecture en liste de
  // conditions et donnaient à croire qu'on répondait sur eux.
  //
  // Le contrôle porte sur le view-model et non sur le template : c'est lui qui
  // décide de ce que l'écran peut afficher, et un template ne peut pas montrer
  // ce qu'on ne lui donne pas.
  it('le view-model du questionnaire ne porte aucune clé de critères', () => {
    const tool = demo('belair')
    expect(tool.diag).not.toHaveProperty('criteria')
    expect(tool.diag.areas).toHaveLength(EVALUABLE_AREAS.length)
    tool.diag.areas.forEach(area => {
      expect(area, area.id).not.toHaveProperty('goals')
      expect(area.picker, area.id).not.toHaveProperty('practices')
    })
  })

  // Et il ne les porte pas davantage sous un autre nom : aucun texte de critère
  // ni de pratique du modèle ne se retrouve dans ce que l'écran reçoit.
  // Les 28 domaines étant désormais sur la même page, c'est le view-model entier
  // qu'on sérialise, et une seule fois : plus rien ne transite domaine par
  // domaine, et le contrôle porte sur tout ce que l'écran reçoit d'un coup.
  it('aucun texte de critère ni de pratique ne transite par le questionnaire', () => {
    const tool = demo('belair')
    const serialise = JSON.stringify(tool.diag)

    EVALUABLE_AREAS.forEach(area => {
      const source = AREAS.find(candidate => candidate.id === area.id)
      const textes = (source.goals || []).flatMap(goal => [goal.goal, ...(goal.practices || [])])

      expect(textes.length, area.id).toBeGreaterThan(0)
      textes.forEach(texte => {
        expect(serialise.includes(JSON.stringify(texte).slice(1, -1)), `${area.id} — ${texte}`).toBe(false)
      })
    })
  })

  // Ce que le rappel garde, en revanche : le rang auquel le modèle attend le
  // domaine. Il explique pourquoi ce domaine pèse sur tel palier et pas sur tel
  // autre, et il n'était pas exposé à l'écran jusqu'ici.
  it('le rappel garde le rang attendu du domaine', () => {
    const tool = demo('belair')
    EVALUABLE_AREAS.forEach((area, index) => {
      expect(tool.diag.areas[index].id, `domaine ${index + 1}`).toBe(area.id)
      expect(tool.diag.areas[index].required, area.id).toBe(area.level)
    })
  })
})

describe('le verdict collant de l’en-tête', () => {
  // Ligne 3.4 du backlog. Il ne suit que l'évaluation et les résultats : au
  // cadrage il n'aurait qu'un profil vide à annoncer, et à l'ancrage la page
  // porte déjà le profil visé et le profil atteint en regard.
  it('ne paraît sur aucun écran hors de l’évaluation et des résultats', () => {
    const tool = demo('rochat')
    const attendu = {
      home: false, info: false, demo: false,
      tool4: false, export: false
    }
    Object.keys(attendu).forEach(screen => {
      tool.state.screen = screen
      expect(Boolean(tool.header.verdict), screen).toBe(attendu[screen])
    })
  })

  // Les trois premières phases étant empilées sur une même page, ce n'est plus
  // l'écran qui décide mais la phase courante — celle que le défilement
  // désigne. Au cadrage, le verdict n'aurait qu'un profil vide à annoncer ; il
  // paraît dès l'évaluation et reste jusqu'aux résultats.
  it('sur la page empilée, suit la phase courante et non l’écran', () => {
    const tool = demo('rochat')
    tool.state.screen = 'tool'
    const attendu = { 1: false, 2: true, 3: true }
    Object.keys(attendu).forEach(phase => {
      tool.actions.setPhase(Number(phase))
      expect(Boolean(tool.header.verdict), `phase ${phase}`).toBe(attendu[phase])
    })
  })

  it('dit le palier tenu et le premier qui ne l’est pas', () => {
    const tool = demo('rochat')
    tool.state.screen = 'tool'
    tool.actions.setPhase(2)
    expect(tool.header.verdict.acquiredLabel).toBe(tool.resti1.acquiredLabel)
    const suivant = tool.resti1.ladder.find(step => step.next)
    expect(tool.header.verdict.nextLabel).toBe(suivant.label)
  })

  // Au haut de l'échelle il n'y a plus de palier à annoncer, et en inventer un
  // ferait croire que le modèle continue.
  it('n’annonce aucun profil suivant au haut de l’échelle', () => {
    const tool = useMaturityTool()
    tool.state.screen = 'tool'
    tool.actions.setPhase(3)
    EVALUABLE_AREAS.forEach(area => tool.actions.answerArea(area.id, MAX_RANK))
    expect(tool.header.verdict.nextLabel).toBeNull()
    expect(tool.resti1.ladder.some(step => step.next)).toBe(false)
  })

  it('sur une session vierge, annonce le premier palier du modèle comme suivant', () => {
    const tool = useMaturityTool()
    tool.state.screen = 'tool'
    tool.actions.setPhase(2)
    expect(tool.header.verdict.acquiredLabel).toBe('Diagnostic en cours')
    expect(tool.header.verdict.nextLabel).toBe(profileName(1))
    expect(tool.header.verdict.progress).toBe(`0 / ${EVALUABLE_AREAS.length} domaines renseignés`)
  })
})

describe('la progression du questionnaire', () => {
  // Ligne 3.3 du backlog. La position dans le parcours a disparu avec
  // l'empilement — les 28 domaines sont sur la même page, il n'y a plus de
  // vingtième domaine où être. Reste le nombre de domaines renseignés, que le
  // verdict collé en haut de page porte seul désormais.
  it('dit le nombre de domaines renseignés, et il suit les réponses', () => {
    const tool = useMaturityTool()
    tool.state.screen = 'tool'
    tool.actions.setPhase(2)

    expect(tool.header.verdict.progress).toBe(`0 / ${EVALUABLE_AREAS.length} domaines renseignés`)

    tool.actions.answerArea(EVALUABLE_AREAS[0].id, 2)
    expect(tool.header.verdict.progress).toBe(`1 / ${EVALUABLE_AREAS.length} domaines renseignés`)
  })

  // Ce que la fusion a retiré, et qui ne doit pas revenir sous un autre nom : le
  // questionnaire ne rend plus de position, plus de « suivant », et le
  // composable n'a plus d'action pour déplacer un index.
  it('n’expose plus ni position ni « suivant »', () => {
    const tool = useMaturityTool()
    expect(tool.diag).not.toHaveProperty('progress')
    expect(tool.diag).not.toHaveProperty('nextLabel')
    expect(tool.actions).not.toHaveProperty('openArea')
    expect(tool.state).not.toHaveProperty('diagIdx')
  })

  // Le hors périmètre est une réponse et non une abstention : il compte comme
  // domaine renseigné. Ce nombre dit ce qui a été traité, pas ce qui a été
  // mesuré — c'est la couverture de la restitution qui sépare les deux.
  it('compte le hors périmètre comme une réponse', () => {
    const tool = useMaturityTool()
    tool.state.screen = 'tool'
    tool.actions.setPhase(2)
    EVALUABLE_AREAS.forEach(area => tool.actions.answerArea(area.id, OUT_OF_SCOPE))
    expect(tool.header.verdict.progress)
      .toBe(`${EVALUABLE_AREAS.length} / ${EVALUABLE_AREAS.length} domaines renseignés`)
  })

  it('ne dépasse jamais le nombre de domaines du modèle', () => {
    const sessions = [...DEMO_SESSIONS.map(scenario => demo(scenario.id)), useMaturityTool()]
    sessions.forEach(tool => {
      tool.state.screen = 'tool'
      tool.actions.setPhase(2)
      const [compte] = tool.header.verdict.progress.split(' ')
      expect(Number(compte)).toBeLessThanOrEqual(EVALUABLE_AREAS.length)
      expect(Number(compte)).toBeGreaterThanOrEqual(0)
    })
  })
})

describe('bloquants et domaines à évaluer ne se mélangent pas', () => {
  it('un domaine sans réponse n’est jamais présenté comme un écart', () => {
    const tool = useMaturityTool()
    // Tout au rang 2, sauf un domaine du premier rang laissé sans réponse et un
    // autre renseigné trop bas. Le second sépare de la cible, le premier non.
    EVALUABLE_AREAS.forEach(area => tool.actions.answerArea(area.id, 2))
    const premiers = EVALUABLE_AREAS.filter(area => area.level === 1)
    const muet = premiers[0]
    const bas = premiers[1]
    tool.actions.answerArea(muet.id, 2) // annule la réponse
    tool.actions.answerArea(bas.id, 2)
    tool.actions.answerArea(bas.id, 1)
    tool.actions.selectReach(2)

    const cited = tool.ancrage.gates.flatMap(group => group.areas.map(area => area.id))
    expect(cited).toContain(bas.id)
    expect(cited).not.toContain(muet.id)
    expect(tool.ancrage.pending.areasLabel).toContain(muet.name)
  })

  it('dit explicitement quand la liste est vide sans que la cible soit tenue', () => {
    const tool = useMaturityTool()
    EVALUABLE_AREAS.forEach(area => tool.actions.answerArea(area.id, 2))
    const muet = EVALUABLE_AREAS.find(area => area.level === 1)
    tool.actions.answerArea(muet.id, 2) // annule la réponse
    tool.actions.selectReach(2)

    expect(tool.ancrage.gates).toHaveLength(0)
    expect(tool.ancrage.empty).toBe(false)
    expect(tool.ancrage.unmeasured).toContain('restés à évaluer')
  })
})

describe('les deux états que la restitution doit nommer', () => {
  it('cible atteinte : le texte du modèle, et aucun écart', () => {
    const tool = demo('terravia')
    expect(tool.ancrage.passage).toBe(PASSAGES.reached)
  })

  it('cible sous le palier atteint : un résultat, pas une erreur', () => {
    // Terravia est au troisième palier. En déclarant une portée plus étroite,
    // la cible passe *sous* le profil atteint : ce n'est ni un écart ni une
    // anomalie, et la restitution a un texte pour ça.
    const tool = demo('terravia')
    tool.actions.selectReach(1)
    expect(tool.ancrage.passage).toBe(PASSAGES.beyond)
    expect(tool.ancrage.empty).toBe(true)
    expect(tool.ancrage.emptyLabel).toBe('Le profil visé est en deçà du profil atteint')
    expect(tool.exportPreview.emptyLabel).toContain('dépasse')
  })
})

describe('aucune valeur affichée ne dépasse son total', () => {
  // Le contrôle porte sur toutes les sessions qu'on sait produire : les trois
  // démonstrations, une session vierge, et une session entièrement remplie au
  // rang le plus haut — les trois régimes où un dénominateur pourrait glisser.
  function sessions() {
    const built = DEMO_SESSIONS.map(scenario => [scenario.name, demo(scenario.id)])

    const vierge = useMaturityTool()
    built.push(['session vierge', vierge])

    const pleine = useMaturityTool()
    EVALUABLE_AREAS.forEach(area => pleine.actions.answerArea(area.id, 5))
    pleine.actions.selectReach(1)
    built.push(['session au plus haut rang', pleine])

    const horsPerimetre = useMaturityTool()
    EVALUABLE_AREAS.forEach(area => horsPerimetre.actions.answerArea(area.id, OUT_OF_SCOPE))
    built.push(['tout hors périmètre', horsPerimetre])

    return built
  }

  it('l’avancement d’un palier ne dépasse jamais le nombre de domaines attendus', () => {
    sessions().forEach(([name, tool]) => {
      tool.resti1.ladder.forEach(level => {
        if (!level.progress) return
        expect(level.progress.done, `${name} — ${level.label}`)
          .toBeLessThanOrEqual(level.progress.expected)
        expect(level.progress.done, `${name} — ${level.label}`).toBeGreaterThanOrEqual(0)
      })
    })
  })

  it('la moyenne et le plancher d’une dimension ne dépassent jamais le haut de l’échelle', () => {
    sessions().forEach(([name, tool]) => {
      tool.resti1.blocks.forEach(block => {
        block.dimensions.forEach(dimension => {
          const read = value => (value === '—' ? null : Number(value.replace(',', '.')))
          const average = read(dimension.average)
          const floor = read(dimension.floor)
          if (average !== null) {
            expect(average, `${name} — ${dimension.name} (moyenne)`).toBeLessThanOrEqual(dimension.scale)
            expect(average, `${name} — ${dimension.name} (moyenne)`).toBeGreaterThan(0)
          }
          if (floor !== null) {
            expect(floor, `${name} — ${dimension.name} (plancher)`).toBeLessThanOrEqual(dimension.scale)
          }
          if (average !== null && floor !== null) {
            // Le plancher est un minimum : il ne peut pas dépasser la moyenne.
            expect(floor, `${name} — ${dimension.name}`).toBeLessThanOrEqual(average)
          }
        })
      })
    })
  })

  it('le niveau d’un domaine ne dépasse jamais le haut de l’échelle', () => {
    sessions().forEach(([name, tool]) => {
      tool.resti2.rows.forEach(row => {
        expect(row.level, `${name} — ${row.area}`).toBeLessThanOrEqual(dimensionScale(tool))
        expect(row.required, `${name} — ${row.area}`).toBeLessThanOrEqual(dimensionScale(tool))
      })
    })
  })
})

// Le haut de l'échelle tel que la page l'affiche : on le relit du view-model
// plutôt que de le réécrire dans le test, faute de quoi le test cesserait de
// vérifier le même 5 que l'écran.
function dimensionScale(tool) {
  return tool.resti1.blocks[0].dimensions[0].scale
}

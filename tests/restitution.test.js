// Ce que la restitution affiche, lu sur les view-models eux-mêmes et non sur le
// calcul qui les alimente. Deux choses s'y vérifient que les tests de règles ne
// peuvent pas voir : où les démonstrations tombent sur l'échelle de
// transformation — c'était leur raison d'être, et elles n'y couvrent plus que
// deux positions sur trois depuis que la cible est celle qu'on déclare, voir le
// commentaire du premier bloc —, et qu'aucune valeur affichée ne dépasse son
// total.
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
import { ATTRIBUTION } from '../src/data/attribution.js'
import {
  ALL_FIELDS, LEVEL5_REQUIREMENTS, LEVEL_CAPS, fieldById
} from '../src/data/context-attributes.js'
import { DEMO_SESSIONS } from '../src/data/demo-sessions.js'
import { PASSAGES, REACH_QUESTION, REVOLUTIONARY_FROM } from '../src/data/transformation.js'
import {
  AREAS, DIMENSION_COUNT, EVALUABLE_AREAS, LEVELS, dimensionColor, profileName
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

// Déclarer une portée sans se soucier de celle qui l'était déjà : `selectReach`
// annule la réponse quand on reclique celle qui est retenue, ce qui rendrait
// « déclarer le rang 3 » indistinct de « ne rien déclarer » sur une session de
// démonstration qui vise déjà 3.
function declareReach(tool, n) {
  if (tool.state.transformation !== n) tool.actions.selectReach(n)
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
  // LES TROIS POSITIONS NE SONT PLUS TENUES, ET C'EST LA DONNÉE QUI DOIT BOUGER.
  //
  // La Menuiserie Rochat déclare une portée de rang 3 ; son contexte n'en
  // suggérait que 2, et l'ancien calcul la ramenait là — c'est ce plafonnement
  // qui lui donnait sa position « sous la ligne ». La cible étant désormais
  // celle que l'organisation déclare (entrée DECISIONS du 28.08.2026, point
  // 0.5c du BACKLOG), Rochat vise 3 comme la Clinique Bel-Air et occupe la même
  // position qu'elle.
  //
  // Le scénario n'a pas été corrigé pour rattraper le test : ce serait ajuster
  // la donnée à un contrôle, alors que c'est le contrôle qui constate ce que la
  // décision a produit. Faire retomber les trois cas à trois positions demande
  // de rebaisser la portée que Rochat déclare — un choix de contenu, qui revient
  // à Saverio et non à ce commit.
  it('ne tombent plus qu’à deux positions de l’échelle de transformation', () => {
    const positions = DEMO_SESSIONS.map(scenario => positionOf(demo(scenario.id)))
    expect(positions).toEqual(['crossing', 'crossing', 'reached'])
  })

  it('la Menuiserie Rochat vise ce qu’elle déclare, plus haut que ce que son contexte suggère', () => {
    const tool = demo('rochat')
    expect(tool.state.transformation).toBe(3)
    expect(tool.ancrage.targetLabel).toBe('Alignement des processus')
    expect(tool.ancrage.relation).toBe('above')
    expect(tool.ancrage.suggestedLabel).toBe('Intégration opérationnelle')
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

describe('la cible appartient à l’organisation', () => {
  // Le cœur de la décision du 28.08.2026, désormais dans le calcul : ce que le
  // contexte suggère ne fait plus descendre ce que l'organisation déclare.
  it('une portée déclarée au-dessus de la suggestion reste la cible', () => {
    const tool = demo('rochat') // contexte plafonné au rang 2
    tool.actions.selectReach(5)
    expect(tool.ancrage.suggestedLevel).toBeLessThan(5)
    expect(tool.ancrage.targetLabel).toBe(profileName(5))
    expect(tool.ancrage.relation).toBe('above')
  })

  // Sur les vingt-cinq paires et non sur les seuls cas de démonstration : c'est
  // la propriété qui a été renversée, elle se vérifie partout où elle jouait.
  // Les deux contextes disponibles encadrent les régimes possibles — le
  // formulaire vide, qui suggère le rang le plus haut, et celui de la Menuiserie
  // Rochat, que ses plafonds durs ramènent au rang 2.
  it('la suggestion ne fait jamais descendre une cible déclarée, sur les 25 paires', () => {
    const contextes = [
      ['formulaire vide', () => useMaturityTool()],
      ['contexte plafonné', () => demo('rochat')]
    ]
    contextes.forEach(([nom, build]) => {
      LEVELS.forEach(declared => {
        const tool = build()
        declareReach(tool, declared.n)
        const suggested = tool.ancrage.suggestedLevel
        expect(tool.ancrage.targetLabel, `${nom} — suggéré ${suggested} × déclaré ${declared.n}`)
          .toBe(profileName(declared.n))
      })
    })
  })

  it('rend les quatre états de la relation entre cible et suggestion', () => {
    const tool = demo('rochat')
    const suggested = tool.ancrage.suggestedLevel
    expect(suggested).toBeGreaterThan(1)
    expect(suggested).toBeLessThan(5)

    tool.actions.selectReach(tool.state.transformation) // annule la portée
    expect(tool.ancrage.relation).toBe('undeclared')

    tool.actions.selectReach(suggested)
    expect(tool.ancrage.relation).toBe('equal')

    tool.actions.selectReach(suggested + 1)
    expect(tool.ancrage.relation).toBe('above')

    tool.actions.selectReach(suggested - 1)
    expect(tool.ancrage.relation).toBe('below')
  })

  // Sans portée déclarée, un repère subsiste — c'est l'option retenue — mais il
  // ne se donne jamais pour une cible : ni à l'écran, ni dans la pièce qui
  // quitte l'outil, où personne n'est là pour le préciser.
  it('sans portée déclarée, rien ne nomme un « profil visé »', () => {
    const tool = useMaturityTool()
    expect(tool.ancrage.declared).toBe(false)
    expect(tool.ancrage.targetTermCap).toBe('Profil suggéré')
    expect(tool.exportPreview.targetTermCap).toBe('Profil suggéré')
    expect(tool.ancrage.intentionGap).toContain('suggèrent')
    ;[tool.ancrage.emptyLabel, tool.ancrage.unmeasured, tool.exportPreview.emptyLabel]
      .forEach(label => expect(label).not.toContain('profil visé'))
  })

  // L'écart se dit, il ne se rectifie pas : aucune des formules écartées le
  // 28.08.2026 ne doit reparaître dans le texte, quel que soit l'état.
  it('l’écart ne dit jamais que la cible est corrigée', () => {
    const proscrits = ['sert de cible', 'ne fait pas viser', 'le plus bas des deux', 'La cible reste']
    ;[null, 1, 2, 3, 4, 5].forEach(n => {
      const tool = demo('rochat')
      if (n === null) tool.actions.selectReach(tool.state.transformation)
      else declareReach(tool, n)
      expect(tool.ancrage.intentionGap, `${n}`).toBeTruthy()
      proscrits.forEach(mot => expect(tool.ancrage.intentionGap, `${n} — ${mot}`).not.toContain(mot))
    })
  })

  // Les motifs affichés sous la suggestion viennent du modèle et non d'ici : une
  // paraphrase écrite dans le view-model dériverait du texte de la source.
  it('les motifs de la suggestion sont ceux que le modèle écrit', () => {
    const tool = demo('rochat')
    expect(tool.ancrage.suggestedReasons.length).toBeGreaterThan(0)
    const connus = [...LEVEL_CAPS, ...LEVEL5_REQUIREMENTS].map(entry => entry.why)
    tool.ancrage.suggestedReasons.forEach(reason => {
      expect(['cap', 'level5']).toContain(reason.kind)
      expect(connus, reason.text).toContain(reason.text)
    })
  })
})

describe('ce que la cible suppose du contexte', () => {
  // Le bloc met en regard la cible déclarée et les attributs de cadrage, mais
  // seulement sur les mécanismes exactement inversibles : les plafonds durs et
  // les conditions du profil le plus haut. Les deux axes en sont exclus — leur
  // rang vient d'une moyenne, aucun attribut n'y porte de valeur attendue —, et
  // c'est ce que ces cas vérifient en creux : rien n'y cite un attribut qui ne
  // conditionne rien.
  //
  // Chaque cas part d'un cadrage vide, où la suggestion vaut le profil le plus
  // haut, et n'y pose que les attributs dont il a besoin : un formulaire de
  // démonstration ferait dépendre le résultat de réponses qui ne regardent pas
  // le cas.
  function scoped(form, reach) {
    const tool = useMaturityTool()
    Object.entries(form).forEach(([id, value]) => tool.actions.selectOption(id, value))
    if (reach != null) declareReach(tool, reach)
    return tool
  }

  it('n’existe pas quand la cible est égale, en dessous, ou non déclarée', () => {
    // Périmètre limité à une équipe : la suggestion tombe au rang 3.
    const form = { scope: 'team' }
    expect(scoped(form).ancrage.contextGap).toBeNull()
    expect(scoped(form, 3).ancrage.relation).toBe('equal')
    expect(scoped(form, 3).ancrage.contextGap).toBeNull()
    expect(scoped(form, 2).ancrage.relation).toBe('below')
    expect(scoped(form, 2).ancrage.contextGap).toBeNull()
  })

  it('un plafond sous la cible donne une ligne, avec la valeur minimale supposée', () => {
    const tool = scoped({ scope: 'team' }, 4)
    expect(tool.ancrage.relation).toBe('above')
    const rows = tool.ancrage.contextGap.rows
    expect(rows).toHaveLength(1)
    expect(rows[0].label).toBe('Périmètre de l’évaluation')
    expect(rows[0].declared).toBe('Une équipe')
    // Dérivé des `opts` : l'option de plus bas score qui ne plafonne plus.
    expect(rows[0].supposed).toBe('au minimum « Un département »')
  })

  it('un plafond dont le maximum atteint la cible ne donne aucune ligne', () => {
    // Deux plafonds : les ressources ramènent la suggestion à 2, le périmètre
    // s'arrête à 3. Visant 3, seul le premier sépare encore.
    const tool = scoped({ scope: 'team', staffing: 'none' }, 3)
    expect(tool.ancrage.relation).toBe('above')
    const labels = tool.ancrage.contextGap.rows.map(row => row.label)
    expect(labels).toEqual(['Ressources affectées à l’IA'])
  })

  it('cible au plus haut : une condition contredite se dit, un champ vide part à part', () => {
    const tool = scoped({ governance: 'coordinated' }, 5)
    expect(tool.ancrage.relation).toBe('above')
    const gap = tool.ancrage.contextGap
    expect(gap.rows).toHaveLength(1)
    expect(gap.rows[0].label).toBe('Pilotage de l’adoption')
    expect(gap.rows[0].declared).toBe('Coordination légère')
    expect(gap.rows[0].supposed).toBe('Instance transverse (commission IA)')
    // Les autres conditions du profil le plus haut sont restées vides : elles ne
    // contredisent rien — règle permissive — et se disent hors des lignes.
    expect(gap.unanswered.label).toContain('Ressources')
    expect(gap.unanswered.note).toContain('ne restreint rien')
    LEVEL5_REQUIREMENTS
      .filter(req => req.field !== 'governance')
      .forEach(req => expect(gap.rows.map(row => row.label)).not.toContain(fieldById(req.field).label))
  })

  it('un attribut vide qui ne conditionne rien n’apparaît nulle part', () => {
    const gap = scoped({ governance: 'coordinated' }, 5).ancrage.contextGap
    const conditioned = new Set([...LEVEL_CAPS, ...LEVEL5_REQUIREMENTS].map(entry => entry.field))
    ALL_FIELDS
      .filter(field => !conditioned.has(field.id))
      .forEach(field => expect(gap.unanswered.label, field.id).not.toContain(field.short))
  })

  it('les motifs nus de la suggestion s’effacent quand le bloc les reprend', () => {
    const tool = demo('rochat')
    expect(tool.ancrage.contextGap).not.toBeNull()
    expect(tool.ancrage.suggestedReasons.length).toBeGreaterThan(0)
    expect(tool.ancrage.showSuggestedReasons).toBe(false)
  })
})

describe('l’échelle des paliers', () => {
  // L'échelle portait une marche de rang 0, le profil « Préparation », ajouté
  // hors modèle sous « Exploration localisée ». Il a été retiré : l'échelle ne
  // montre que les cinq profils de la source. Le cas qu'il traitait est tenu
  // hors de l'échelle, par un texte de restitution sans rang, « Diagnostic en
  // cours », qu'une organisation restée au niveau 1 lit depuis le 08.09.2026.
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

  // L'échelle a porté une marque « cible » et un estompage des paliers qui la
  // dépassaient, tous deux suspendus à la portée déclarée. Ce test vérifiait
  // qu'ils apparaissaient et disparaissaient avec elle ; il vérifie désormais
  // l'inverse, et c'est un renversement, pas un durcissement.
  //
  // Motif : la portée se déclare en ancrage, après les résultats. Deux drapeaux
  // qui en dépendaient faisaient donc bouger un écran *précédent* — le test
  // pilote l'a relevé. Les deux sont partis le 10.09.2026, et ce qu'ils
  // montraient est passé sur la bande des profils en ancrage.
  //
  // L'absence est vérifiée sur la clé et non sur sa valeur : un `isTarget:
  // false` qui subsisterait passerait un `some()` sans que rien ne le signale,
  // et c'est précisément la porte par laquelle le couplage reviendrait.
  it('l’échelle des résultats ne porte jamais de cible', () => {
    const tool = demo('terravia')
    for (let n = 1; n <= 5; n += 1) {
      declareReach(tool, n)
      tool.resti1.ladder.forEach(step => {
        expect(step, `portée ${n} — ${step.label}`).not.toHaveProperty('isTarget')
        expect(step, `portée ${n} — ${step.label}`).not.toHaveProperty('beyondTarget')
      })
    }
  })
})

describe('l’échelle : états, remplissage', () => {
  // Deux états visibles, et ils ne se recouvrent pas : un palier est tenu, ou il
  // ne l'est pas. « Suivant » — le premier palier non tenu — n'est plus un état
  // nommé depuis le 31.08.2026 : il ne portait qu'un libellé retiré de
  // l'affichage, redondant avec le contraste que `upcoming` porte déjà par la
  // couleur. Ce test ne vérifie donc plus que l'exclusivité qui reste.
  it('un seul palier est acquis, et acquis exclut à venir', () => {
    DEMO_SESSIONS.forEach(scenario => {
      const tool = demo(scenario.id)
      tool.resti1.ladder.forEach(step => {
        if (step.acquired) expect(step.upcoming, `${scenario.name} — ${step.label}`).toBe(false)
      })
      expect(tool.resti1.ladder.filter(step => step.acquired)).toHaveLength(1)
    })
  })

  it('une session vierge n’a aucun palier tenu, et le premier palier n’est pas mis en retrait', () => {
    const tool = useMaturityTool()
    expect(tool.resti1.ladder.some(step => step.reached)).toBe(false)
    expect(tool.resti1.ladder[0].upcoming).toBe(false)
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

  // La grille par bloc affichait les mêmes neuf dimensions et les mêmes deux
  // nombres que le radar, quelques centimètres plus bas ; le test qui vivait ici
  // n'avait d'autre objet que de garantir que les deux sections ne se
  // contredisent pas. La grille est retirée, et avec elle la contradiction
  // possible. Reste à vérifier que le radar porte bien les deux nombres en clair
  // — c'est lui, désormais, qui les dit seul.
  it('porte en clair les deux nombres de chaque dimension', () => {
    const tool = demo('rochat')
    expect(tool.resti1).not.toHaveProperty('blocks')
    tool.resti1.radar.dimensions.forEach(dimension => {
      expect(dimension.averageLabel, dimension.id).toBeTypeOf('string')
      expect(dimension.floorLabel, dimension.id).toBeTypeOf('string')
    })
  })
})

describe('la session entièrement au rang le plus bas', () => {
  // L'énoncé de rang 1 décrit l'absence : « rien n'est en place ». Une
  // organisation qui retient cet énoncé sur les 28 domaines a répondu partout
  // sans rien attester. Le premier palier a longtemps été acquis dans ce cas, et
  // l'outil le nommait « Exploration localisée » : la décision du 08.09.2026 y
  // met un plancher, le palier 1 exigeant le niveau 2 sur les domaines qu'il
  // attend (docs/logs/DECISIONS.md).
  //
  // Ce test est écrit pour que le jour où quelqu'un voudra changer cela, il
  // sache exactement ce qu'il change : il ne « corrige » pas un bogue, il
  // renverse une décision.
  it('n’acquiert aucun palier et ne nomme aucun profil', () => {
    const tool = useMaturityTool()
    EVALUABLE_AREAS.forEach(area => tool.actions.answerArea(area.id, MIN_RANK))

    expect(tool.resti1.ladder.some(step => step.acquired)).toBe(false)
    expect(tool.exportPreview.acquiredLabel).not.toContain(profileName(1))
  })

  // Elle a pourtant répondu partout : la restitution ne peut pas lui demander de
  // poursuivre un questionnaire terminé. Le premier rang mesuré et non tenu est
  // un résultat, et il a son propre texte.
  it('nomme « Encore en préparation » plutôt que « Diagnostic en cours »', () => {
    const tool = useMaturityTool()
    EVALUABLE_AREAS.forEach(area => tool.actions.answerArea(area.id, MIN_RANK))

    expect(tool.resti1.acquiredLabel).toBe('Encore en préparation')
    expect(tool.exportPreview.acquiredLabel).toBe('Encore en préparation')
  })

  // Le premier rang suffit à trancher : il est le seul à retenir le palier 0.
  // Une session où il est situé sans être tenu est un résultat même si le reste
  // du questionnaire n'a pas été ouvert.
  it('nomme « Encore en préparation » dès que le premier rang est situé, même seul', () => {
    const tool = useMaturityTool()
    EVALUABLE_AREAS
      .filter(area => area.level === 1)
      .forEach(area => tool.actions.answerArea(area.id, MIN_RANK))

    expect(tool.resti1.ladder.some(step => step.acquired)).toBe(false)
    expect(tool.resti1.acquiredLabel).toBe('Encore en préparation')
  })

  it('nomme le premier profil dès que les domaines du premier rang sont au niveau 2', () => {
    const tool = useMaturityTool()
    EVALUABLE_AREAS.forEach(area => tool.actions.answerArea(area.id, MIN_RANK))
    EVALUABLE_AREAS
      .filter(area => area.level === 1)
      .forEach(area => tool.actions.answerArea(area.id, 2))

    expect(tool.resti1.acquiredLabel).toBe(profileName(1))
    expect(tool.resti1.acquiredLabel).toBe('Exploration localisée')
    expect(tool.resti1.ladder[0].acquired).toBe(true)
    expect(tool.exportPreview.acquiredLabel).toBe('Niveau 1 — Exploration localisée')
  })

  // Le pendant : tant que le premier rang n'est pas complet, aucun palier n'est
  // acquis et la restitution ne nomme pas de profil. C'est le seul cas que le
  // texte « diagnostic en cours » couvre encore — le rang 1 mesuré mais non
  // tenu a le sien depuis le 08.09.2026.
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

  // Ce que le rappel garde, en revanche : le profil à partir duquel le modèle
  // attend le domaine. Il explique pourquoi ce domaine pèse sur tel palier et
  // pas sur tel autre. Le libellé ne dit plus « attendu au rang 2 » — le rang
  // d'entrée n'est pas le niveau à atteindre.
  it('le rappel garde le profil d’entrée du domaine', () => {
    const tool = demo('belair')
    EVALUABLE_AREAS.forEach((area, index) => {
      const shown = tool.diag.areas[index]
      expect(shown.id, `domaine ${index + 1}`).toBe(area.id)
      expect(shown.requiredLabel, area.id).toBe(`* pour le profil ${area.level}`)
    })
  })
})

describe('la progression du questionnaire', () => {
  // Ligne 3.3 du backlog. La position dans le parcours a disparu avec
  // l'empilement — les 28 domaines sont sur la même page, il n'y a plus de
  // vingtième domaine où être.
  //
  // Le compte de domaines renseignés a suivi : il vivait dans la bande de
  // verdict de l'en-tête, retirée parce qu'elle redisait sous un troisième nom
  // le profil que la restitution nomme, et parce que son dénominateur — les 28
  // domaines du modèle, hors périmètre compris — n'était pas celui de la
  // couverture affichée quelques centimètres plus bas. La couverture de la
  // restitution est désormais le seul compte, et la barre des domaines dit à
  // elle seule où l'on en est.
  it('n’expose plus ni position, ni « suivant », ni verdict d’en-tête', () => {
    const tool = useMaturityTool()
    expect(tool.diag).not.toHaveProperty('progress')
    expect(tool.diag).not.toHaveProperty('nextLabel')
    expect(tool.actions).not.toHaveProperty('openArea')
    expect(tool.state).not.toHaveProperty('diagIdx')
    expect(tool.header).not.toHaveProperty('verdict')
  })

  // Ce que l'en-tête garde, et rien de plus : la session, sa remise à zéro et
  // les quatre phases. Les onglets ne portent plus la première étape de leur
  // phase — elle redisait la consigne du questionnaire sur l'onglet 2.
  it('l’en-tête ne porte que la session et les phases', () => {
    const tool = demo('rochat')
    tool.state.screen = 'tool'
    expect(Object.keys(tool.header).sort())
      .toEqual([
        'hasProgress', 'phases', 'resetDialog', 'sessionLabel', 'showBrand', 'showPhases',
        'showSession', 'showSubtitle'
      ])
    tool.header.phases.forEach(phase => {
      expect(phase).not.toHaveProperty('desc')
    })
  })

  // L'identifiant de session ne paraît qu'une fois l'évaluation commencée : sur
  // l'accueil il ne désigne rien. La session de démonstration fait exception,
  // parce que ne pas la signaler ferait prendre une PME fictive pour la sienne.
  it('l’en-tête ne montre la session que hors de l’accueil', () => {
    const tool = useMaturityTool()
    tool.state.screen = 'home'
    expect(tool.header.showSession).toBe(false)
    ;['info', 'demo', 'tool', 'tool4', 'export'].forEach(screen => {
      tool.state.screen = screen
      expect(tool.header.showSession, screen).toBe(true)
    })
    const demoTool = demo('rochat')
    demoTool.state.screen = 'home'
    expect(demoTool.header.showSession).toBe(true)
  })

  // L'accueil dit lui-même ce que l'outil mesure, plus bas et plus complètement,
  // et porte le sigle en titre. L'en-tête se tait donc là, et seulement là.
  it('l’en-tête ne porte sigle ni sous-titre sur l’accueil', () => {
    const tool = useMaturityTool()
    tool.state.screen = 'home'
    expect(tool.header.showSubtitle).toBe(false)
    // Le sigle lui-même se tait au même endroit : l'accueil le porte en titre,
    // et le bouton n'y mènerait qu'à la page affichée.
    expect(tool.header.showBrand).toBe(false)
    ;['info', 'demo', 'tool', 'tool4', 'export'].forEach(screen => {
      tool.state.screen = screen
      expect(tool.header.showSubtitle, screen).toBe(true)
      expect(tool.header.showBrand, screen).toBe(true)
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
    expect(tool.ancrage.emptyLabel).toBe('Le profil visé est en deçà du profil diagnostiqué')
    expect(tool.exportPreview.emptyLabel).toContain('dépasse')
  })

  it("l'export porte l'attribution et le démenti", () => {
    // Le pied de page de l'application est masqué à l'impression : si l'export
    // ne porte pas l'attribution lui-même, la pièce emportée sort sans dire
    // d'où vient le modèle ni ce qu'elle n'est pas. Le test lit la donnée du
    // fichier d'attribution plutôt qu'une chaîne recopiée — une attente
    // recopiée à la main dérive au premier remaniement du texte.
    const tool = demo('terravia')
    expect(tool.exportPreview.attribution.short).toBe(ATTRIBUTION.short)
    expect(tool.exportPreview.attribution.disclaimer).toBe(ATTRIBUTION.disclaimer)
    expect(tool.exportPreview.attribution.short).toContain('Carnegie Mellon University')
    // Une session vierge s'exporte aussi, et sur une page vide l'attribution
    // est la seule chose que le lecteur ait pour situer le document.
    expect(useMaturityTool().exportPreview.attribution.disclaimer).toBe(ATTRIBUTION.disclaimer)
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
      const scale = tool.resti1.radar.scale
      tool.resti1.radar.dimensions.forEach(dimension => {
        const read = value => (value === '—' ? null : Number(value.replace(',', '.')))
        const average = read(dimension.averageLabel)
        const floor = read(dimension.floorLabel)
        if (average !== null) {
          expect(average, `${name} — ${dimension.name} (moyenne)`).toBeLessThanOrEqual(scale)
          expect(average, `${name} — ${dimension.name} (moyenne)`).toBeGreaterThan(0)
        }
        if (floor !== null) {
          expect(floor, `${name} — ${dimension.name} (plancher)`).toBeLessThanOrEqual(scale)
        }
        if (average !== null && floor !== null) {
          // Le plancher est un minimum : il ne peut pas dépasser la moyenne.
          expect(floor, `${name} — ${dimension.name}`).toBeLessThanOrEqual(average)
        }
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

// — la portée ne remonte pas le parcours —
//
// La règle posée le 10.09.2026 après le test pilote : les phases 1 à 3 ne
// changent plus quand la portée change. Elle se vérifie sur les deux vues que la
// page `tool` rend — la restitution et la bande des profils —, et par une
// égalité profonde plutôt que sur les seuls drapeaux qui portaient le couplage :
// un test qui n'énumère que les champs connus ne verra pas le prochain.
//
// L'instantané passe par JSON : les deux vm ne portent que des nombres, des
// chaînes, des booléens et des `null`, et une copie inerte se compare sans que
// la réactivité s'en mêle.
function frozen(tool) {
  return JSON.parse(JSON.stringify({ resti1: tool.resti1, band: tool.toolPage.band }))
}

describe('la portée déclarée en ancrage ne change rien en amont', () => {
  it('laisse les résultats et la bande de la page tool intacts, pour les cinq portées', () => {
    DEMO_SESSIONS.forEach(scenario => {
      const tool = demo(scenario.id)
      const before = frozen(tool)

      for (let n = 1; n <= 5; n += 1) {
        declareReach(tool, n)
        expect(tool.state.transformation, `${scenario.name} — portée ${n}`).toBe(n)
        expect(frozen(tool), `${scenario.name} — portée ${n}`).toEqual(before)
      }

      // Et à l'annulation : recliquer la portée retenue la retire, ce qui est le
      // seul chemin de retour vers l'état non déclaré.
      tool.actions.selectReach(tool.state.transformation)
      expect(tool.state.transformation, `${scenario.name} — annulation`).toBeNull()
      expect(frozen(tool), `${scenario.name} — annulation`).toEqual(before)
    })
  })
})

// — la bande des profils en ancrage —
//
// C'est là, et là seulement, que la portée se voit : les mêmes barres qu'à
// l'évaluation, plus deux marques. Ce que ces tests gardent, c'est la frontière
// — les marques réagissent, le remplissage non.
describe('la bande de l’ancrage : le remplissage tient, les marques réagissent', () => {
  // Le remplissage vient du diagnostic. Il est relu depuis la bande de la page
  // `tool`, et non recopié dans le test : c'est l'égalité des deux bandes qui
  // est en jeu, pas une valeur particulière.
  function filling(bars) {
    return bars.map(({ n, label, done, expected, full, acquired, count }) =>
      ({ n, label, done, expected, full, acquired, count }))
  }

  it('marque exactement le profil de la portée déclarée, et lui seul', () => {
    DEMO_SESSIONS.forEach(scenario => {
      const tool = demo(scenario.id)
      const diagnostic = filling(tool.toolPage.band.bars)

      for (let n = 1; n <= 5; n += 1) {
        declareReach(tool, n)
        const marked = tool.ancrage.band.bars.filter(bar => bar.isTarget)
        expect(marked, `${scenario.name} — portée ${n}`).toHaveLength(1)
        expect(marked[0].n, `${scenario.name} — portée ${n}`).toBe(n)
        // Les comptes n'ont pas bougé d'un domaine.
        expect(filling(tool.ancrage.band.bars), `${scenario.name} — portée ${n}`).toEqual(diagnostic)
      }
    })
  })

  // Sans portée déclarée, rien n'est marqué cible : le repère qui tient sa place
  // est la suggestion, et elle porte son propre nom. Une marque « cible » posée
  // par défaut ferait passer un avis pour une décision.
  it('ne marque aucune cible tant que la portée n’est pas déclarée', () => {
    const tool = useMaturityTool()
    expect(tool.state.transformation).toBeNull()
    expect(tool.ancrage.band.bars.some(bar => bar.isTarget)).toBe(false)
  })

  // La suggestion, elle, est là dans les deux cas : elle ne dépend que du
  // cadrage, et déclarer une portée ne la fait pas disparaître — c'est même
  // quand les deux diffèrent qu'elle a le plus à dire.
  it('pose la suggestion sur le rang du profil suggéré, portée déclarée ou non', () => {
    DEMO_SESSIONS.forEach(scenario => {
      const tool = demo(scenario.id)
      const check = when => {
        const marked = tool.ancrage.band.bars.filter(bar => bar.isSuggested)
        expect(marked, `${scenario.name} — ${when}`).toHaveLength(1)
        expect(marked[0].n, `${scenario.name} — ${when}`).toBe(tool.ancrage.suggestedLevel)
      }

      tool.actions.selectReach(tool.state.transformation)
      expect(tool.state.transformation).toBeNull()
      check('portée non déclarée')

      for (let n = 1; n <= 5; n += 1) {
        declareReach(tool, n)
        check(`portée ${n}`)
      }
    })
  })

  // Le chemin qui reste : strictement au-dessus du palier acquis, jusqu'au
  // repère inclus. En deçà du palier acquis, rien — ce qui est tenu n'est pas un
  // chemin.
  it('teinte le chemin qui reste, du profil suivant l’acquis jusqu’au repère', () => {
    DEMO_SESSIONS.forEach(scenario => {
      const tool = demo(scenario.id)
      for (let n = 1; n <= 5; n += 1) {
        declareReach(tool, n)
        const acquired = tool.resti1.ladder.find(step => step.acquired).n
        const remaining = tool.ancrage.band.bars.filter(bar => bar.betweenAcquiredAndTarget)
        expect(remaining.map(bar => bar.n), `${scenario.name} — portée ${n}`)
          .toEqual(tool.ancrage.band.bars.map(bar => bar.n).filter(rank => rank > acquired && rank <= n))
      }
    })
  })
})

// Le haut de l'échelle tel que la page l'affiche : on le relit du view-model
// plutôt que de le réécrire dans le test, faute de quoi le test cesserait de
// vérifier le même 5 que l'écran.
function dimensionScale(tool) {
  return tool.resti1.radar.scale
}

// — la carte de portée —
//
// Depuis le 10.09.2026, la portée se pose comme un domaine : une carte, cinq
// énoncés, un seul retenu. Ce qui se vérifie ici n’est pas son apparence mais ce
// que le vm promet à la carte — la forme du `picker` d’un domaine, à trois
// différences près, et chacune est une décision qu’un remaniement pourrait
// défaire sans rien casser d’autre.
describe(`la portée se présente comme un domaine, sans en être un`, () => {
  it(`rend cinq énoncés, au plus un retenu, et les rangs sous lui marqués`, () => {
    const tool = demo('rochat')

    for (let n = 1; n <= 5; n += 1) {
      declareReach(tool, n)
      const { statements } = tool.ancrage.reachCard.picker

      expect(statements, `portée ${n}`).toHaveLength(5)
      expect(statements.filter(statement => statement.active).map(s => s.value)).toEqual([n])
      // Cumulatif : tout ce qui est sous l'énoncé retenu est marqué franchi, et
      // rien au-dessus. C'est la règle que le `hint` énonce sous la carte.
      expect(statements.filter(statement => statement.reached).map(s => s.value))
        .toEqual([1, 2, 3, 4, 5].filter(rank => rank < n))
      // Les valeurs sont les rangs du modèle, dans l'ordre, et les textes ceux
      // qui ont été validés : la carte ne réécrit rien.
      expect(statements.map(statement => statement.value)).toEqual([1, 2, 3, 4, 5])
      expect(statements.map(statement => statement.text))
        .toEqual(REACH_QUESTION.options.map(option => option.text))
    }
  })

  it(`n’offre aucune sortie « hors périmètre »`, () => {
    const tool = demo('rochat')
    declareReach(tool, 3)
    // Une portée ne se retire pas de la mesure : elle est ce qui la fixe. Le
    // sélecteur n'affiche l'interrupteur que si le vm lui en donne un.
    expect(tool.ancrage.reachCard.picker.outOfScope).toBeUndefined()
  })

  it(`sans portée déclarée, aucun énoncé n’est retenu ni marqué`, () => {
    const tool = demo('rochat')
    tool.actions.selectReach(tool.state.transformation)
    expect(tool.state.transformation).toBeNull()

    const { statements } = tool.ancrage.reachCard.picker
    expect(statements.some(statement => statement.active)).toBe(false)
    // Et surtout aucun `reached` : une carte vierge ne doit pas donner à croire
    // que les premiers rangs sont acquis d'office.
    expect(statements.some(statement => statement.reached)).toBe(false)
  })

  it(`emprunte la couleur de la dimension au modèle, jamais en dur`, () => {
    const tool = demo('rochat')
    const color = dimensionColor('D11')
    expect(color).toMatch(/^#[0-9a-f]{6}$/i)
    expect(tool.ancrage.reachCard.color).toBe(color)
    expect(tool.ancrage.reachCard.picker.color).toBe(color)
  })

  it(`— un clic déclare la portée, le même clic l’annule`, () => {
    const tool = demo('rochat')
    tool.actions.selectReach(2)
    expect(tool.state.transformation).toBe(2)
    tool.actions.selectReach(4)
    expect(tool.state.transformation).toBe(4)
    tool.actions.selectReach(4)
    expect(tool.state.transformation).toBeNull()
  })

  it(`n’écrit jamais dans les réponses du questionnaire`, () => {
    const tool = demo('rochat')
    const areaIds = new Set(EVALUABLE_AREAS.map(area => area.id))

    for (let n = 1; n <= 5; n += 1) {
      declareReach(tool, n)
      // La réponse vit dans `state.transformation` et nulle part ailleurs :
      // aucune clé nouvelle, et aucune clé étrangère aux 28 domaines.
      expect(Object.keys(tool.state.answers).every(key => areaIds.has(key)), `portée ${n}`)
        .toBe(true)
      expect(tool.state.answers[REACH_QUESTION.id], `portée ${n}`).toBeUndefined()
    }

    // Le compte des domaines évaluables ne bouge pas : la portée n'en est pas un
    // vingt-neuvième.
    expect(EVALUABLE_AREAS).toHaveLength(28)
    expect(tool.diag.areas).toHaveLength(28)
  })
})

// Le bloc « Emporter » de l'ancrage (item 3.11) : ce que le vm en donne, et ce
// que l'import fait réellement à la session. Le contenu des deux fichiers est
// couvert par `session-file.test.js`, qui n'a pas de composable à sa portée ;
// ce qui reste à vérifier ici est ce que seul le composable peut montrer.
describe('emporter et reprendre une session', () => {
  it('expose deux téléchargements, distincts par leur nom, portant tous deux la session courante', () => {
    const tool = demo('rochat')
    const { downloads } = tool.ancrage.takeAway
    expect(downloads).toHaveLength(2)
    const [first, second] = downloads
    expect(first.name).not.toBe(second.name)
    expect(first.name).toContain(tool.state.session)
    expect(second.name).toContain(tool.state.session)
  })

  // Le piège que `loadDemo` traite déjà en repassant par `defaultState` : sans
  // lui, une réponse de la session remplacée resterait sous celle du fichier
  // relu, aux domaines que le fichier ne renseigne pas.
  it('remplace la session : aucune réponse de la session précédente ne subsiste', () => {
    const tool = demo('rochat')
    expect(tool.state.answers[EVALUABLE_AREAS[0].id]).toBeDefined()
    tool.actions.importSession({
      answers: { [EVALUABLE_AREAS[0].id]: 1 },
      openLevels: {},
      form: {}
    })
    expect(tool.state.answers).toEqual({ [EVALUABLE_AREAS[0].id]: 1 })
  })

  // Un fichier de reprise porte un écran, et c'est celui-là qui s'ouvre. Un
  // fichier de partage n'en porte pas : se retrouver ramené à l'accueil après
  // avoir relu ses propres réponses serait une perte, pas une garde — l'écran
  // d'où l'on reprend fait donc l'affaire.
  it('atterrit sur l’écran du fichier quand il en porte un, sur celui d’où l’on reprend sinon', () => {
    const versReprise = useMaturityTool()
    versReprise.state.screen = 'tool4'
    versReprise.actions.importSession({ answers: {}, openLevels: {}, form: {}, screen: 'tool' })
    expect(versReprise.state.screen).toBe('tool')

    const versPartage = useMaturityTool()
    versPartage.state.screen = 'tool4'
    versPartage.actions.importSession({ answers: {}, openLevels: {}, form: {} })
    expect(versPartage.state.screen).toBe('tool4')
  })
})

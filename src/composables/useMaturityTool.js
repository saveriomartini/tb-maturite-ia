import { reactive, computed } from 'vue'
import { AIMM } from '../data/model-data.js'
import {
  CONTEXT_GROUPS, DESCRIPTIVE_FIELDS, ALL_FIELDS,
  LEVEL_CAPS, LEVEL5_REQUIREMENTS, REGULATED_RISK_CEILING, optionLabel
} from '../data/context-attributes.js'
import { loadSession, persistSession, clearSession, newSessionId } from './useSessionStorage.js'

const JOURNEY_TEXT = [
  { n: '1', name: 'Cadrage', steps: ['vous comprenez le modèle et validez vos connaissances de base sur l’IA', 'vous déterminez le périmètre de l’évaluation et le niveau cible'],
    frictions: ['manque de temps à consacrer à l’apprentissage', 'difficulté à percevoir la vue d’ensemble et les détails en même temps', 'description de son organisation peut être fastidieuse'],
    opps: ['s’approprier un vocabulaire technique adapté', 'sélection des critères et objectifs les plus pertinents = clarification, gain de temps et d’adhérence'] },
  { n: '2', name: 'Diagnostic', steps: ['vous répondez au questionnaire et définissez votre niveau actuel', 'selon le niveau cible vous êtes soumis seulement aux pratiques et objectifs qui vous concernent'],
    frictions: ['coordination et analyse profonde requise pour valider une pratique'],
    opps: ['choix binaire oui/non pour valider la liste de pratiques d’un objectif = définition claire et objective de son niveau'] },
  { n: '3', name: 'Restitution', steps: ['vous visualisez les résultats, une appréciation qualitative et un score chiffré de votre avancement', 'vous obtenez une liste des pratiques manquantes (le gap)'],
    frictions: ['frustration de voir un objectif non atteint pour une seule pratique manquante'],
    opps: ['adhésion à la règle du niveau le plus bas pour chaque bloc', 'identification rapide des gaps simplifiée par le regroupement par bloc/thématique'] },
  { n: '4', name: 'Ancrage', steps: ['vous générez une roadmap actionnable selon vos priorités', 'vous lancez des projets concrets'],
    frictions: ['difficulté à établir les priorités et allouer les ressources'],
    opps: ['motivation à agir rapidement avec des objectifs clairs'] }
]

const SCREENS = ['home', 'cadrage1', 'cadrage2', 'cadrage3', 'diagStart', 'diag', 'resti1', 'resti2', 'resti3', 'export']
const PHASE_OF = { home: 0, cadrage1: 1, cadrage2: 1, cadrage3: 1, diagStart: 2, diag: 2, resti1: 3, resti2: 3, resti3: 3, export: 3 }
const NEXT_OF = { home: 'cadrage1', cadrage1: 'cadrage2', cadrage2: 'cadrage3', cadrage3: 'diagStart', diagStart: 'diag', resti1: 'resti2', resti2: 'resti3' }

function chip(active, opts) {
  const o = opts || {}
  if (o.dimColor) {
    return 'border:' + (active ? '2px' : '1px') + ' solid ' + (active ? 'var(--color-text)' : 'var(--color-divider)') +
      ';background:' + o.dimColor + ';color:var(--color-text)' +
      ';padding:' + (o.pad || '7px 9px') + ';font-size:' + (o.fs || '10.5px') +
      ';line-height:1.3;font-weight:' + (active ? 800 : 500) + ';opacity:' + (o.mute ? 0.45 : 1) +
      ';cursor:' + (o.cursor || 'default') + (o.nowrap ? ';white-space:nowrap;flex:none' : '')
  }
  return 'border:1px solid ' + (active ? 'var(--color-text)' : 'var(--color-divider)') +
    ';background:' + (active ? 'var(--color-text)' : 'var(--color-neutral-100)') +
    ';color:' + (active ? '#fff' : (o.mute ? 'var(--color-neutral-600)' : 'var(--color-text)')) +
    ';padding:' + (o.pad || '7px 9px') + ';font-size:' + (o.fs || '10.5px') + ';line-height:1.3;font-weight:' + (active ? 700 : 500) + ';cursor:' + (o.cursor || 'default') + (o.nowrap ? ';white-space:nowrap;flex:none' : '')
}

// — recommandation du niveau cible —
// Deux axes : l'ambition affichée par l'organisation et la capacité qu'elle peut
// soutenir. On ne recommande jamais plus d'un cran au-dessus de la capacité, puis
// on applique les plafonds durs (facteurs bloquants qui ne se compensent pas).

function fieldScore(field, form) {
  const v = form[field.id]
  if (v == null) return null
  const o = field.opts.find(x => x[0] === v)
  if (!o) return null
  // Un cadre réglementaire fort borne l'appétit au risque effectivement retenu.
  if (field.id === 'risk' && form.regulatory === 'regulated') return Math.min(o[2], REGULATED_RISK_CEILING)
  return o[2]
}

// Valeur prise par un attribut non renseigné. 0.25 place le formulaire vide
// exactement au Level 2 sur les deux axes — le niveau d'entrée du modèle — et
// rend la recommandation progressive : chaque réponse déplace la moyenne au lieu
// de la faire basculer.
const NEUTRAL_SCORE = 0.25

function axisFields(axis, form) {
  return ALL_FIELDS.filter(f => f.axis === axis)
    .map(f => ({ f, s: fieldScore(f, form) }))
    .filter(x => x.s != null)
}

function axisLevel(axis, form) {
  const fields = ALL_FIELDS.filter(f => f.axis === axis)
  if (!fields.length) return null
  const sum = fields.reduce((n, f) => {
    const s = fieldScore(f, form)
    return n + (s == null ? NEUTRAL_SCORE : s)
  }, 0)
  return levelFromScore(sum / fields.length)
}

function levelFromScore(s) {
  return 1 + s * 4
}

function factorText(x, form) {
  return (x.f.short || x.f.label) + ' : ' + optionLabel(x.f.id, form[x.f.id]).toLowerCase()
}

function buildRecommendation(form) {
  const answered = ALL_FIELDS.filter(f => form[f.id] != null).length
  const total = ALL_FIELDS.length
  const amb = axisFields('ambition', form)
  const cap = axisFields('capacity', form)
  const ambitionLevel = axisLevel('ambition', form)
  const capacityLevel = axisLevel('capacity', form)

  const raw = Math.min(ambitionLevel, capacityLevel + 1)
  let level = Math.max(1, Math.min(5, Math.round(raw)))
  const cappedByCapacity = capacityLevel + 1 < ambitionLevel

  const matched = LEVEL_CAPS.filter(c => c.values.indexOf(form[c.field]) >= 0)
  let capNotes = []
  if (matched.length) {
    const capMax = matched.reduce((m, c) => Math.min(m, c.max), 5)
    if (capMax < level) {
      level = capMax
      capNotes = matched.filter(c => c.max === capMax)
    }
  }

  const level5Missing = LEVEL5_REQUIREMENTS.filter(r => r.values.indexOf(form[r.field]) < 0)
  const blockedFrom5 = level === 5 && level5Missing.length > 0
  if (blockedFrom5) level = 4

  const drivers = amb.slice().sort((a, b) => b.s - a.s).filter(x => x.s >= 0.6).slice(0, 2).map(x => factorText(x, form))
  const limits = cap.slice().sort((a, b) => a.s - b.s).filter(x => x.s <= 0.4).slice(0, 2).map(x => factorText(x, form))

  return {
    level, answered, total, complete: answered === total, empty: answered === 0,
    ambitionLevel: Math.max(1, Math.min(5, Math.round(ambitionLevel))),
    capacityLevel: Math.max(1, Math.min(5, Math.round(capacityLevel))),
    cappedByCapacity, capNotes, level5Missing: blockedFrom5 ? level5Missing : [], drivers, limits
  }
}

function defaultState() {
  return {
    screen: 'home',
    diagIdx: 0,
    checked: {},
    openLevels: {},
    target: 2,
    form: {},
    showContext: false,
    session: newSessionId()
  }
}

export function useMaturityTool() {
  const restored = loadSession(SCREENS)
  const state = reactive(Object.assign(defaultState(), restored || {}))
  const wasRestored = !!restored
  persistSession(state)

  function resetSession() {
    clearSession()
    Object.assign(state, defaultState())
    window.scrollTo(0, 0)
  }

  const data = AIMM

  const allAreas = computed(() => {
    const out = []
    data.blocks.forEach(b => b.dimensions.forEach(d => d.areas.forEach(a =>
      out.push({ ...a, block: b.name, blockId: b.id, dim: d.name, dimId: d.id, dimColor: d.color })
    )))
    return out
  })

  const scoped = computed(() => allAreas.value.filter(a => !a.pending && a.level <= state.target))

  function levelLabel(n) {
    const l = data.levels.find(x => x.n === n)
    return l ? 'Level ' + n + ' - ' + l.name : '—'
  }

  function areaStats(a) {
    const c = state.checked
    let goalsDone = 0, prat = 0, pratTotal = 0
    a.goals.forEach((g, gi) => {
      let done = 0
      g.practices.forEach((p, pi) => { if (c[a.id + '-' + gi + '-' + pi]) done++ })
      prat += done; pratTotal += g.practices.length
      if (done === g.practices.length) goalsDone++
    })
    return { goalsDone, goalsTotal: a.goals.length, prat, pratTotal, acquired: goalsDone === a.goals.length && a.goals.length > 0 }
  }

  function blockLevel(blockId) {
    let lvl = 0
    for (let L = 1; L <= state.target; L++) {
      const areas = scoped.value.filter(a => a.blockId === blockId && a.level <= L)
      if (areas.every(a => areaStats(a).acquired)) lvl = L; else break
    }
    return lvl
  }

  const acquiredLevel = computed(() => {
    const ls = data.blocks.filter(b => scoped.value.some(a => a.blockId === b.id)).map(b => blockLevel(b.id))
    return ls.length ? Math.min.apply(null, ls) : 0
  })

  function go(s) {
    if (s === 'diagStart' || s === 'home') state.diagIdx = 0
    state.screen = s
    window.scrollTo(0, 0)
  }

  function toggle(key) {
    state.checked[key] = !state.checked[key]
  }

  const recommendation = computed(() => buildRecommendation(state.form))

  function gapGroups() {
    const groups = []
    scoped.value.forEach(a => {
      const objs = []
      a.goals.forEach((g, gi) => {
        const missing = g.practices.map((p, pi) => ({ p, pi })).filter(x => !state.checked[a.id + '-' + gi + '-' + x.pi])
        if (missing.length) objs.push({ label: 'Obj. ' + (gi + 1), goal: g.goal, practices: missing.map(x => ({ t: x.p })) })
      })
      if (objs.length) groups.push({ block: a.block, blockId: a.blockId, dim: a.dim, dimColor: a.dimColor, area: a.name, objs })
    })
    return groups
  }

  const vm = computed(() => {
    const st = state, s = st.screen, target = state.target
    const curPhase = PHASE_OF[s]
    const idx = SCREENS.indexOf(s)

    const phases = JOURNEY_TEXT.map((p, i) => {
      const num = i + 1, active = curPhase === num, disabled = num === 4
      const dest = ['cadrage1', 'diagStart', 'resti1'][num - 1]
      return {
        n: String(num), name: p.name, l1: p.steps[0],
        flag: disabled ? 'désactivé' : '',
        flagStyle: disabled ? 'font-size:9px;text-transform:uppercase;letter-spacing:0.08em;border:1px solid var(--color-neutral-500);color:var(--color-neutral-600);padding:1px 5px' : 'display:none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        tabStyle: 'padding:12px 18px 14px;border-right:1px solid var(--color-divider);border-bottom:' + (active ? '4px solid var(--color-text)' : '4px solid transparent') + ';opacity:' + (disabled ? 0.45 : 1) + ';margin-bottom:-2px',
        numStyle: 'font-family:var(--font-heading);font-weight:800;font-size:20px;line-height:1;color:' + (active ? 'var(--color-text)' : 'var(--color-neutral-500)'),
        nameStyle: 'font-family:var(--font-heading);font-weight:800;font-size:14px;letter-spacing:-0.01em',
        descStyle: 'font-size:10.5px;line-height:1.35;color:var(--color-neutral-700);margin-top:5px;max-width:290px',
        onClick: disabled ? function () {} : function () { go(dest) }
      }
    })

    const journey = JOURNEY_TEXT.map((p, i) => {
      const disabled = i === 3
      return {
        n: p.n, name: p.name, num: i === 3 ? 'var(--color-neutral-500)' : 'var(--color-text)',
        flag: disabled ? 'hors périmètre' : '',
        flagStyle: disabled ? 'font-size:9px;text-transform:uppercase;letter-spacing:0.08em;border:1px solid var(--color-neutral-500);color:var(--color-neutral-600);padding:1px 5px' : 'display:none',
        colStyle: 'padding:16px 16px 20px;border-right:' + (i < 3 ? '1px solid var(--color-divider)' : '0') + ';opacity:' + (disabled ? 0.5 : 1),
        frictionColStyle: 'padding:12px 16px 16px;border-right:' + (i < 3 ? '1px solid var(--color-divider)' : '0') + ';opacity:' + (disabled ? 0.5 : 1),
        steps: p.steps.map(t => ({ t, style: 'border:1px solid var(--color-divider);background:#fff;padding:10px 12px;font-size:11.5px;line-height:1.4' })),
        frictions: p.frictions.map(t => ({ t })),
        opps: p.opps.map(t => ({ t }))
      }
    })

    const lastBlock = data.blocks.length - 1
    const frameworkRows = data.blocks.map((b, bi) => {
      const top = bi === 0 ? 14 : 5
      const bottom = bi === lastBlock ? 14 : 5
      const lastDim = b.dimensions.length - 1
      return {
        name: b.name,
        cellStyle: 'grid-column:1;grid-row:span ' + b.dimensions.length + ';border-right:2px solid var(--color-text);display:flex;padding:' + top + 'px 14px ' + bottom + 'px',
        chipStyle: 'flex:1;display:flex;align-items:center;border:1px solid var(--color-text);background:transparent;color:var(--color-text);padding:12px 12px;font-family:var(--font-heading);font-weight:800;font-size:13px',
        dims: b.dimensions.map((d, di) => {
          const pad = (di === 0 ? top : 3) + 'px 14px ' + (di === lastDim ? bottom : 3) + 'px'
          return {
            name: d.name,
            cellStyle: 'grid-column:2;border-right:2px solid var(--color-text);display:flex;padding:' + pad,
            chipStyle: chip(false, { fs: '10.5px', dimColor: d.color }) + ';flex:1;display:flex;align-items:center',
            areasCellStyle: 'grid-column:3;display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:' + pad,
            areas: d.areas.map(a => ({
              name: a.name,
              style: chip(false, { fs: '9.5px', pad: '6px 7px', mute: a.pending }) + ';border-left:4px solid ' + d.color + (a.pending ? ';border-style:dashed;border-left-style:solid' : '')
            }))
          }
        })
      }
    })
    const levelRows = data.levels.map((l, i) => {
      const open = !!st.openLevels[l.n]
      return {
        label: 'Level ' + l.n + ' - ' + l.name, tag: l.tag, open,
        wrapStyle: 'border-bottom:' + (i < 4 ? '1px solid var(--color-divider)' : '0') + ';background:' + (i % 2 ? 'var(--color-neutral-100)' : 'transparent'),
        rowStyle: 'display:flex;gap:20px;align-items:baseline;padding:11px 16px;cursor:pointer',
        labelStyle: 'font-family:var(--font-heading);font-weight:800;font-size:13px;width:210px;flex:none',
        tagStyle: 'font-size:12px;color:var(--color-neutral-800);line-height:1.4;flex:1',
        toggleLabel: open ? '− replier' : '+ détail',
        toggleStyle: 'flex:none;font-size:9.5px;text-transform:uppercase;letter-spacing:0.08em;font-weight:800;padding:4px 8px;white-space:nowrap;border:1px solid var(--color-text)' + (open ? ';background:var(--color-text);color:#fff' : ''),
        detail: l.detail || [],
        detailStyle: 'padding:0 16px 14px 246px' + (open ? '' : ';display:none'),
        paraStyle: 'font-size:12px;line-height:1.55;color:var(--color-neutral-800);margin:0 0 10px;max-width:780px;text-wrap:pretty',
        onToggle: function () { state.openLevels[l.n] = !open }
      }
    })

    const rec = recommendation.value

    function buildField(f) {
      const value = st.form[f.id]
      return {
        id: f.id, label: f.label, hint: f.hint, aimm: f.aimm,
        aimmStyle: f.aimm
          ? 'font-size:8.5px;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;color:var(--color-neutral-600);border:1px solid var(--color-neutral-400);padding:1px 4px;white-space:nowrap'
          : 'display:none',
        hintStyle: f.hint ? 'font-size:10.5px;color:var(--color-neutral-700);margin-top:6px;text-wrap:pretty' : 'display:none',
        dotStyle: 'width:6px;height:6px;flex:none;border:1px solid var(--color-text);background:' + (value != null ? 'var(--color-text)' : 'transparent'),
        options: f.opts.map(o => ({
          value: o[0], label: o[1], active: value === o[0],
          style: chip(value === o[0], { cursor: 'pointer', pad: '7px 11px', fs: '11px', nowrap: true }) +
            ';font-family:inherit;margin:0;border-radius:0;text-align:left',
          onClick: function () {
            state.form = { ...state.form, [f.id]: state.form[f.id] === o[0] ? null : o[0] }
          }
        }))
      }
    }

    const formGroups = CONTEXT_GROUPS.map(g => ({
      id: g.id, label: g.label, fields: g.fields.map(buildField)
    }))
    const descriptiveFields = DESCRIPTIVE_FIELDS.map(buildField)

    const recFactors = []
    if (!rec.empty) {
      recFactors.push({
        k: 'Ambition', v: 'Level ' + rec.ambitionLevel + (rec.drivers.length ? ' — ' + rec.drivers.join(', ') : '')
      })
    }
    if (!rec.empty) {
      recFactors.push({
        k: 'Capacité', v: 'Level ' + rec.capacityLevel + (rec.limits.length ? ' — ' + rec.limits.join(', ') : '')
      })
    }
    if (rec.cappedByCapacity && !rec.capNotes.length) {
      recFactors.push({ k: 'Ajustement', v: 'l’ambition dépasse la capacité actuelle de plus d’un niveau' })
    }
    if (rec.capNotes.length) {
      recFactors.push({ k: 'Plafond', v: 'Level ' + rec.level + ' — ' + rec.capNotes.map(c => c.why).join(' ; ') })
    }
    if (rec.level5Missing.length) {
      recFactors.push({ k: 'Level 5', v: 'exige ' + rec.level5Missing.map(r => r.why).join(', ') })
    }

    const recWhy = rec.empty
      ? 'Renseignez les attributs de contexte : le niveau cible est déduit de votre ambition d’adoption et de la capacité que vous pouvez soutenir.'
      : 'Le niveau recommandé ne dépasse jamais d’un cran la capacité actuelle, puis les facteurs bloquants le plafonnent. Vous pouvez retenir un autre niveau cible ci-dessous.'

    const targetOptions = data.levels.map(l => ({
      label: 'Level ' + l.n + ' - ' + l.name,
      active: target === l.n,
      badge: l.n === rec.level && !rec.empty ? 'recommandé' : '',
      badgeStyle: l.n === rec.level && !rec.empty
        ? 'font-size:8.5px;text-transform:uppercase;letter-spacing:0.07em;font-weight:800;padding:1px 4px;border:1px solid currentColor;margin-left:6px;white-space:nowrap'
        : 'display:none',
      style: chip(target === l.n, { cursor: 'pointer', pad: '8px 10px', fs: '11px', nowrap: true }) +
        ';font-family:inherit;margin:0;border-radius:0;text-align:left;display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%',
      onClick: function () { state.target = l.n; state.diagIdx = 0 }
    }))

    const scopedList = scoped.value
    const dimCount = new Set(scopedList.map(a => a.dimId)).size
    const scopeSummary = 'ici ' + scopedList.length + ' areas parmi ' + dimCount + ' dimensions (sur 28 areas / 9 dimensions)'

    const scopeMap = data.blocks.map((b, i) => ({
      name: b.name,
      colStyle: 'border-right:' + (i < 3 ? '2px solid var(--color-text)' : '0') + ';background:var(--color-bg)',
      dims: b.dimensions.map(d => ({
        name: d.name,
        headStyle: 'font-size:11px;font-weight:700;line-height:1.3;padding:8px 10px;border-bottom:1px solid var(--color-divider);background:' + d.color,
        areas: d.areas.map(a => {
          const inScope = !a.pending && a.level <= target
          return { name: a.name + (a.pending ? ' — à définir' : ' · L' + a.level), style: 'font-size:9.5px;line-height:1.3;padding:5px 7px;border:1px solid ' + (inScope ? 'var(--color-text)' : 'var(--color-neutral-300)') + ';background:' + (inScope ? 'var(--color-neutral-200)' : 'transparent') + ';color:' + (inScope ? 'var(--color-text)' : 'var(--color-neutral-500)') + (a.pending ? ';border-style:dashed' : '') }
        })
      }))
    }))

    const diagIdx = Math.min(st.diagIdx, Math.max(0, scopedList.length - 1))
    const cur = scopedList[diagIdx] || null
    const curStats = cur ? areaStats(cur) : null
    const dimStrip = []
    data.blocks.forEach(b => b.dimensions.forEach(d => {
      const on = cur && d.id === cur.dimId
      const jump = scopedList.findIndex(a => a.dimId === d.id)
      const live = jump >= 0
      dimStrip.push({
        name: d.name,
        style: 'font-size:9px;line-height:1.25;padding:5px 6px;max-width:112px;border:' + (on ? '2px' : '1px') + ' solid ' + (on ? 'var(--color-text)' : 'var(--color-divider)') + ';background:' + d.color + ';color:var(--color-text);font-weight:' + (on ? 800 : 500) + ';cursor:' + (live ? 'pointer' : 'not-allowed') + ';opacity:' + (live ? (on ? 1 : 0.78) : 0.35),
        onClick: live ? function () { state.diagIdx = jump; window.scrollTo(0, 0) } : function () {}
      })
    }))
    const curBlock = cur ? data.blocks.find(b => b.id === cur.blockId) : null
    const curBlockDims = curBlock ? curBlock.dimensions.map(d => {
      const jump = scopedList.findIndex(a => a.dimId === d.id)
      return {
        name: d.name,
        style: chip(cur && d.id === cur.dimId, { fs: '10.5px', pad: '7px 9px', cursor: jump >= 0 ? 'pointer' : 'not-allowed', mute: jump < 0, dimColor: d.color }),
        onClick: jump >= 0 ? function () { state.diagIdx = jump; window.scrollTo(0, 0) } : function () {}
      }
    }) : []
    const curGoals = cur ? cur.goals.map((g, gi) => {
      const done = g.practices.every((p, pi) => st.checked[cur.id + '-' + gi + '-' + pi])
      return {
        label: 'Objectif ' + (gi + 1) + ' :', text: g.goal,
        state: done ? 'atteint' : 'non atteint',
        stateStyle: 'margin-left:auto;flex:none;font-size:9.5px;text-transform:uppercase;letter-spacing:0.07em;font-weight:800;padding:3px 7px;border:1px solid ' + (done ? 'var(--color-text)' : 'var(--color-neutral-400)') + ';color:' + (done ? 'var(--color-text)' : 'var(--color-neutral-600)') + ';background:' + (done ? 'var(--color-neutral-200)' : 'transparent'),
        wrapStyle: 'border-left:3px solid ' + (done ? 'var(--color-text)' : 'var(--color-neutral-300)') + ';padding:2px 0 14px 14px;border-bottom:1px solid var(--color-divider)',
        cards: g.practices.map((p, pi) => {
          const key = cur.id + '-' + gi + '-' + pi, on = !!st.checked[key]
          return {
            text: p, mark: on ? 'oui' : 'non',
            markStyle: 'font-size:9px;text-transform:uppercase;letter-spacing:0.08em;font-weight:800;margin-bottom:6px;color:' + (on ? 'var(--color-text)' : 'var(--color-neutral-600)'),
            style: 'cursor:pointer;background:#fff;color:var(--color-text);text-wrap:pretty;border:' + (on ? '3px' : '1px') + ' solid ' + (on ? 'var(--color-text)' : 'var(--color-neutral-400)') + ';padding:' + (on ? '10px 11px' : '12px 13px') + ';font-weight:' + (on ? 600 : 400),
            onClick: function () { toggle(key) }
          }
        })
      }
    }) : []

    const acq = acquiredLevel.value
    const acqLevel = data.levels.find(l => l.n === acq)
    const levelLadder = data.levels.map((l, i) => {
      const isAcq = l.n === acq, isTarget = l.n === target
      return {
        label: 'Level ' + l.n + ' - ' + l.name,
        badge: isAcq ? 'acquis' : (isTarget ? 'cible' : ''),
        tagStyle: (isAcq || isTarget) ? 'margin-left:auto;font-size:9px;text-transform:uppercase;letter-spacing:0.08em;font-weight:800;padding:2px 6px;border:1px solid var(--color-text);color:' + (isAcq ? '#fff' : 'var(--color-text)') + ';background:' + (isAcq ? 'var(--color-text)' : 'transparent') : 'display:none',
        rowStyle: 'display:flex;align-items:center;gap:12px;padding:13px 16px;border-bottom:' + (i < 4 ? '1px solid var(--color-divider)' : '0') + ';background:' + (isAcq ? 'var(--color-neutral-200)' : (l.n <= acq ? 'var(--color-neutral-200)' : 'transparent')) + ';opacity:' + (l.n > target ? 0.45 : 1)
      }
    })
    const blockScores = data.blocks.map((b, i) => {
      const areas = scopedList.filter(a => a.blockId === b.id)
      let go2 = 0, gt = 0, po = 0, pt = 0
      areas.forEach(a => { const s2 = areaStats(a); go2 += s2.goalsDone; gt += s2.goalsTotal; po += s2.prat; pt += s2.pratTotal })
      const pct = pt ? Math.round(po / pt * 100) : 0
      return {
        name: b.name, levelLabel: 'niveau du bloc : ' + (blockLevel(b.id) ? levelLabel(blockLevel(b.id)) : 'non atteint'),
        obj: go2 + '/' + gt, prat: po + '/' + pt,
        colStyle: 'padding:16px 18px 18px;border-right:' + (i < 3 ? '2px solid var(--color-text)' : '0') + ';background:var(--color-neutral-100)',
        barStyle: 'height:6px;width:' + pct + '%;background:var(--color-text)'
      }
    })
    const detailBlocks = data.blocks.map(b => {
      const rows = []
      b.dimensions.forEach(d => {
        const areas = d.areas.filter(a => !a.pending && a.level <= target)
        areas.forEach((a, ai) => {
          const full = scopedList.find(x => x.id === a.id) || a
          const s2 = areaStats(full)
          rows.push({
            dim: ai === 0 ? d.name : '', area: a.name, obj: s2.goalsDone + '/' + s2.goalsTotal, prat: s2.prat + '/' + s2.pratTotal,
            dimStyle: 'font-size:10.5px;line-height:1.3;font-weight:700;vertical-align:top;border-left:5px solid ' + d.color + (ai === 0 ? ';background:' + d.color : ''),
            areaStyle: 'font-size:11px;vertical-align:top',
            objStyle: 'font-size:11px;font-weight:700;color:var(--color-text)',
            pratStyle: 'font-size:11px'
          })
        })
      })
      return { name: b.name, rows }
    })

    const groups = gapGroups()
    const gapBlocks = data.blocks.map(b => ({
      name: b.name,
      groups: groups.filter(g => g.blockId === b.id).map(g => ({
        dim: g.dim, area: g.area, objs: g.objs,
        dimStyle: 'font-size:11px;line-height:1.35;font-weight:700;padding:6px 8px;background:' + g.dimColor,
        wrapStyle: 'padding:14px 16px;border-bottom:1px solid var(--color-divider);border-left:6px solid ' + g.dimColor
      }))
    })).filter(b => b.groups.length)
    const missingCount = groups.reduce((n, g) => n + g.objs.reduce((m, o) => m + o.practices.length, 0), 0)
    const exportMeta = 'Export 10.08.2026 · model: v1 · session: ' + st.session
    const groupsWithSwatch = groups.map(g => ({ ...g, swatchStyle: 'width:9px;height:9px;flex:none;background:' + g.dimColor + ';border:1px solid var(--color-text)' }))
    const pages = []
    for (let i = 0; i < groupsWithSwatch.length; i += 4) pages.push({ groups: groupsWithSwatch.slice(i, i + 4) })
    if (!pages.length) pages.push({ groups: [], empty: true })
    const exportPages = pages.map((p, i) => ({
      groups: p.groups,
      emptyStyle: p.empty ? 'border:1px solid var(--color-text);background:var(--color-neutral-200);padding:16px;font-size:11px;line-height:1.45' : 'display:none',
      label: 'page ' + (i + 1) + ' / ' + pages.length
    }))

    const answeredCount = Object.keys(st.form).filter(k => st.form[k] != null).length
    const hasProgress = answeredCount > 0 || Object.keys(st.checked).length > 0 ||
      st.target !== 2 || st.screen !== 'home'

    return {
      sessionLabel: 'session ' + st.session + ' · ' + levelLabel(target) + ' (cible)' +
        (wasRestored && hasProgress ? ' · restaurée' : ''),
      hasProgress,
      onResetSession: function () {
        if (window.confirm('Réinitialiser la session ? Les attributs de contexte, le niveau cible et les pratiques validées seront effacés.')) resetSession()
      },
      phases, journey, frameworkRows, levelRows,
      isHome: s === 'home', isCadrage1: s === 'cadrage1', isCadrage2: s === 'cadrage2', isCadrage3: s === 'cadrage3',
      isDiagStart: s === 'diagStart', isDiag: s === 'diag', isResti1: s === 'resti1', isResti2: s === 'resti2', isResti3: s === 'resti3', isExport: s === 'export',
      onStart: function () { go('cadrage1') },
      onBack: function () {
        if (s === 'diag' && st.diagIdx > 0) { state.diagIdx = st.diagIdx - 1; window.scrollTo(0, 0); return }
        if (s === 'export') { go('resti3'); return }
        go(SCREENS[Math.max(0, idx - 1)])
      },
      onNextScreen: function () {
        if (s === 'diag') {
          if (st.diagIdx + 1 < scopedList.length) { state.diagIdx = st.diagIdx + 1; window.scrollTo(0, 0) }
          else go('resti1')
          return
        }
        go(NEXT_OF[s] || 'resti3')
      },
      onExport: function () { go('export') },
      onFinish: function () { go('home') },
      formGroups, descriptiveFields, targetOptions, scopeSummary, scopeMap,
      showContext: st.showContext,
      onToggleContext: function () { state.showContext = !st.showContext },
      contextToggleLabel: (st.showContext ? '− masquer' : '+ afficher') + ' le contexte descriptif',
      contextPanelStyle: st.showContext ? '' : 'display:none',
      recommendedLabel: levelLabel(rec.level),
      recommendedWhy: recWhy,
      recommendedFactors: recFactors,
      completenessLabel: rec.answered + ' / ' + rec.total + ' attributs renseignés',
      completenessBarStyle: 'height:4px;width:' + Math.round(rec.answered / rec.total * 100) + '%;background:#fff',
      provisionalLabel: rec.complete ? '' : 'recommandation indicative',
      provisionalStyle: rec.complete
        ? 'display:none'
        : 'font-size:9px;text-transform:uppercase;letter-spacing:0.08em;font-weight:800;border:1px solid #fff;padding:2px 6px;white-space:nowrap',
      canApplyRecommendation: !rec.empty && target !== rec.level,
      applyLabel: 'Appliquer le Level ' + rec.level,
      onApplyRecommendation: function () { state.target = rec.level; state.diagIdx = 0 },
      targetMismatchLabel: !rec.empty && target !== rec.level
        ? 'Choix manuel : le niveau retenu (Level ' + target + ') diffère de la recommandation (Level ' + rec.level + ').'
        : '',
      targetMismatchStyle: !rec.empty && target !== rec.level
        ? 'font-size:10.5px;line-height:1.4;color:var(--color-neutral-800);border-left:3px solid var(--color-text);padding:6px 0 6px 9px;margin-top:12px'
        : 'display:none',
      targetLabel: levelLabel(target),
      levelBadgeStyle: 'font-family:var(--font-heading);font-weight:800;font-size:13px;background:var(--color-text);color:#fff;padding:6px 12px',
      curAreaLevelLabel: cur ? levelLabel(cur.level) : levelLabel(target),
      curBlockName: cur ? cur.block : '', curBlockDims,
      curDimBandStyle: 'height:8px;margin:-16px -16px 14px;background:' + (cur ? cur.dimColor : 'transparent'),
      curAreaName: cur ? cur.name : '', curAreaDesc: cur ? cur.desc : '',
      curAreaScore: curStats ? 'Objectifs atteints ' + curStats.goalsDone + '/' + curStats.goalsTotal + ' · Pratiques validées ' + curStats.prat + '/' + curStats.pratTotal : '',
      curAreaHint: curStats && curStats.acquired ? 'area acquise' : 'tous les objectifs doivent être atteints',
      curGoals, dimStrip,
      diagProgress: 'Area ' + (diagIdx + 1) + ' / ' + scopedList.length + ' · ' + (cur ? cur.dim : ''),
      diagNextLabel: diagIdx + 1 < scopedList.length ? 'Suivant' : 'Terminer',
      acquiredLabel: acq ? levelLabel(acq) : 'Non atteint',
      acquiredDesc: acqLevel ? acqLevel.desc : 'Aucun niveau n’est encore acquis : au moins une area du niveau 1 reste incomplète. Chaque bloc prend le niveau le plus bas de ses areas.',
      levelLadder, blockScores, detailBlocks, gapBlocks,
      gapSummary: missingCount + ' pratiques manquantes réparties sur ' + groups.length + ' areas de compétence',
      exportMeta, exportPages
    }
  })

  return { state, vm }
}

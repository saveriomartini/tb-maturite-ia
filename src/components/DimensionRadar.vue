<template>
  <div class="radar" :class="{ 'radar--compact': compact }">
    <div class="radar__figure">
      <svg class="radar__svg" :viewBox="viewBox" role="img" :aria-labelledby="titleId">
        <title :id="titleId">
          Les neuf dimensions du modèle :
          {{ compact ? 'moyenne de chacune' : 'moyenne et plancher de chacune' }}, sur une échelle
          de 1 à {{ scale }}
        </title>

        <polygon
          v-for="ring in rings"
          :key="ring.rank"
          :points="ring.points"
          fill="none"
          :stroke="ring.outer ? 'var(--color-text)' : 'var(--color-neutral-300)'"
          :stroke-width="ring.outer ? 2 : 1"
        />

        <line
          v-for="axis in axes"
          :key="axis.id"
          :x1="axis.inner.x"
          :y1="axis.inner.y"
          :x2="axis.outer.x"
          :y2="axis.outer.y"
          stroke="var(--color-neutral-400)"
          stroke-width="1"
        />

        <rect
          v-for="axis in axes"
          :key="`tip-${axis.id}`"
          :x="axis.outer.x - 4"
          :y="axis.outer.y - 4"
          width="8"
          height="8"
          :fill="axis.color"
          stroke="var(--color-neutral-600)"
          stroke-width="1"
        />

        <path
          v-for="(segment, index) in compact ? [] : floorShape.segments"
          :key="`floor-${index}`"
          :d="segment.d"
          fill="none"
          stroke="var(--color-neutral-800)"
          stroke-width="2.5"
          stroke-dasharray="7 5"
          stroke-linejoin="round"
          stroke-linecap="round"
        />

        <path
          v-for="(segment, index) in averageShape.segments"
          :key="`average-${index}`"
          :d="segment.d"
          :fill="segment.closed ? 'var(--color-text)' : 'none'"
          fill-opacity="0.10"
          stroke="var(--color-text)"
          stroke-width="2.5"
          stroke-linejoin="round"
          stroke-linecap="round"
        />

        <rect
          v-for="mark in compact ? [] : floorShape.marks"
          :key="`floor-mark-${mark.id}`"
          :x="mark.x - 4.5"
          :y="mark.y - 4.5"
          width="9"
          height="9"
          fill="var(--color-neutral-100)"
          stroke="var(--color-neutral-800)"
          stroke-width="2.5"
        />

        <circle
          v-for="mark in averageShape.marks"
          :key="`average-mark-${mark.id}`"
          :cx="mark.x"
          :cy="mark.y"
          :r="compact ? 3 : 4.5"
          fill="var(--color-neutral-100)"
          stroke="var(--color-text)"
          stroke-width="2.5"
        />

        <text
          v-for="tick in compact ? [] : ticks"
          :key="`tick-${tick.rank}`"
          :x="tick.x"
          :y="tick.y"
          font-size="11"
          font-weight="700"
          fill="var(--color-neutral-700)"
        >{{ tick.rank }}</text>

        <text
          v-for="axis in compact ? [] : axes"
          :key="`label-${axis.id}`"
          :text-anchor="axis.anchor"
          font-size="11.5"
          font-weight="700"
          fill="var(--color-text)"
        >
          <tspan v-for="line in axis.lines" :key="line.y" :x="axis.label.x" :y="line.y">{{ line.text }}</tspan>
          <tspan
            v-if="axis.missing"
            :x="axis.label.x"
            :y="axis.missingY"
            font-size="10"
            font-weight="500"
            font-style="italic"
            fill="var(--color-neutral-700)"
          >non mesurée — {{ axis.missing }}</tspan>
        </text>
      </svg>

      <p v-if="!compact" class="legend">
        <span class="legend__item">
          <svg class="legend__swatch" viewBox="0 0 34 12" aria-hidden="true">
            <line x1="1" y1="6" x2="33" y2="6" stroke="var(--color-text)" stroke-width="2.5" />
            <circle cx="17" cy="6" r="4" fill="var(--color-neutral-100)" stroke="var(--color-text)" stroke-width="2.5" />
          </svg>
          moyenne
        </span>
        <span class="legend__item">
          <svg class="legend__swatch" viewBox="0 0 34 12" aria-hidden="true">
            <line x1="1" y1="6" x2="33" y2="6" stroke="var(--color-neutral-800)" stroke-width="2.5" stroke-dasharray="6 4" />
            <rect x="13" y="2" width="8" height="8" fill="var(--color-neutral-100)" stroke="var(--color-neutral-800)" stroke-width="2.5" />
          </svg>
          plancher
        </span>
      </p>
    </div>

    <ul v-if="!compact" class="bars">
      <li v-for="row in bars" :key="row.id" class="bar" :style="{ '--dimension-color': row.color }">
        <p class="bar__name">{{ row.name }}</p>

        <div v-if="row.missing" class="bar__absent">{{ row.missing }} · {{ row.rated }}</div>

        <div v-else class="bar__tracks">
          <p class="track">
            <span class="track__label">moyenne</span>
            <span class="track__rail">
              <span class="track__value track__value--average" :style="{ width: row.averageWidth }" />
            </span>
            <span class="track__figure">{{ row.averageLabel }}<span class="track__total">/{{ scale }}</span></span>
          </p>
          <p class="track">
            <span class="track__label">plancher</span>
            <span class="track__rail">
              <span class="track__value track__value--floor" :style="{ width: row.floorWidth }" />
            </span>
            <span class="track__figure">{{ row.floorLabel }}<span class="track__total">/{{ scale }}</span></span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
// Radar des neuf dimensions, et les barres moyenne · plancher qui l'accompagnent.
// Voir docs/logs/BACKLOG.md, ligne 3.6.
//
// — deux lectures, et elles ne disent pas la même chose —
// La moyenne situe l'ensemble des domaines renseignés d'une dimension ; le
// plancher nomme le plus bas d'entre eux, celui qui la retiendrait si elle était
// un palier. Les deux sont tracés, jamais agrégés en un score : le modèle n'en
// restitue aucun. Ils se distinguent autrement que par la couleur — trait plein
// et repère rond pour la moyenne, trait tireté et repère carré pour le plancher
// —, si bien que la figure survit à une photocopie en noir et blanc.
//
// `dimension.color` ne sert qu'à identifier l'axe et sa barre : la couleur dit
// de quelle dimension il s'agit, jamais où elle en est. Un code couleur qui
// porterait un résultat entrerait en concurrence avec les deux tracés.
//
// — ce que la figure ne montre pas —
// Sa surface se lit comme un total, alors que la règle d'agrégation du modèle
// refuse la compensation : un palier n'est acquis que lorsque *tous* les
// domaines qu'il attend l'atteignent (décision du 30.07.2026). Un creux ne se
// rattrape donc pas par une pointe voisine, quoi qu'en dise le dessin. Le radar
// situe et ouvre la discussion ; c'est l'échelle des paliers qui conclut, et
// c'est elle qui ouvre la page.
//
// — une dimension sans mesure n'est jamais tracée à zéro —
// Aucun domaine renseigné, ou tous déclarés hors périmètre : la valeur est
// absente, pas nulle. Le tracé s'interrompt sur cet axe plutôt que de passer par
// le centre ou de couper d'un bord à l'autre, l'intitulé de l'axe dit laquelle
// des deux absences c'est, et la barre correspondante n'est pas dessinée. Un
// zéro s'y lirait comme le pire résultat possible, alors que rien n'a été
// mesuré — même famille de défaut que le « 3,1 / 3 » relevé par l'experte
// métier.
//
// Le rang 1 n'est pas au centre : au centre, il serait un point, donc
// indiscernable d'une absence. Le premier anneau porte donc un rayon non nul, et
// le centre ne porte aucune valeur.
//
// Le dessin est entièrement calculé en `computed` et rendu par le gabarit : rien
// n'y touche au DOM, si bien que la figure se rend aussi hors navigateur — c'est
// ce que vérifie tests/render.test.js.
//
// — la réduction —
// La même figure sert deux fois : pleine sur la page de résultats, réduite dans
// la bande des profils pendant qu'on répond. La version réduite ne redessine
// rien : elle recadre le viewBox sur la figure et laisse tomber tout ce qu'une
// vignette de 230 pixels ne saurait porter — intitulés d'axes, graduation,
// légende, barres, et le tracé du plancher. Ne reste que la forme de la moyenne
// sur les neuf axes, qui est la seule chose qu'on lise d'un coup d'œil. Elle
// n'est pas une lecture au rabais de la grande : c'est le même calcul, et ce
// qu'elle montre en moins, la page de résultats le montre en entier.
import { computed, useId } from 'vue'

const props = defineProps({
  dimensions: { type: Array, required: true },
  scale: { type: Number, required: true },
  compact: { type: Boolean, default: false }
})

// Les deux figures coexistent sur la page de l'outil — la vignette dans la
// bande, la figure pleine dans la section des résultats. Un identifiant fixe sur
// le titre accessible se serait donc retrouvé deux fois dans le document.
const titleId = useId()

// Le recadrage, seule différence de géométrie entre les deux : la figure occupe
// un carré centré sur `CENTER`, de rayon `R_MAX` ; tout le reste du cadre est
// la place des intitulés, qui ne sont pas dessinés en réduction.
const viewBox = computed(() => {
  if (!props.compact) return `0 0 ${WIDTH} ${HEIGHT}`
  const margin = 12
  const side = (R_MAX + margin) * 2
  return `${CENTER.x - R_MAX - margin} ${CENTER.y - R_MAX - margin} ${side} ${side}`
})

// La figure est dimensionnée par ses intitulés, pas l'inverse : neuf noms de
// dimension de quarante caractères décident de la marge, et donc du rayon.
const WIDTH = 900
const HEIGHT = 600
const CENTER = { x: 450, y: 292 }
const R_MAX = 160
const R_MIN = 44
const MIN_RANK = 1
const LINE_HEIGHT = 14
const LABEL_WRAP = 24

const count = computed(() => props.dimensions.length)
const step = computed(() => (Math.PI * 2) / count.value)

function angleOf(index) {
  return -Math.PI / 2 + index * step.value
}

function radiusOf(value) {
  const span = props.scale - MIN_RANK
  if (span <= 0) return R_MAX
  return R_MIN + ((value - MIN_RANK) / span) * (R_MAX - R_MIN)
}

function pointOf(index, value) {
  const angle = angleOf(index)
  const r = radiusOf(value)
  return {
    x: Number((CENTER.x + r * Math.cos(angle)).toFixed(1)),
    y: Number((CENTER.y + r * Math.sin(angle)).toFixed(1))
  }
}

// Les intitulés sont coupés aux mots : aucun n'est tronqué, aucun ne sort du
// cadre. C'est la contrainte qui a fixé la taille de la figure.
function wrap(text) {
  const lines = []
  let line = ''
  text.split(' ').forEach(word => {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length > LABEL_WRAP && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  })
  if (line) lines.push(line)
  return lines
}

// Les anneaux sont polygonaux et non circulaires : un anneau rond suggérerait
// une échelle continue entre deux axes, alors qu'il n'y a rien entre deux
// dimensions.
const rings = computed(() => {
  const list = []
  for (let rank = MIN_RANK; rank <= props.scale; rank++) {
    list.push({
      rank,
      outer: rank === props.scale,
      points: props.dimensions
        .map((dimension, index) => {
          const point = pointOf(index, rank)
          return `${point.x},${point.y}`
        })
        .join(' ')
    })
  }
  return list
})

const axes = computed(() =>
  props.dimensions.map((dimension, index) => {
    const angle = angleOf(index)
    const cos = Math.cos(angle)
    const label = {
      x: Number((CENTER.x + (R_MAX + 26) * cos).toFixed(1)),
      y: Number((CENTER.y + (R_MAX + 26) * Math.sin(angle)).toFixed(1))
    }
    const texts = wrap(dimension.name)
    // Le bloc d'intitulé est centré verticalement sur le bout de l'axe.
    const offset = -((texts.length - 1) * LINE_HEIGHT) / 2
    return {
      id: dimension.id,
      color: dimension.color,
      missing: dimension.missing,
      anchor: cos > 0.25 ? 'start' : cos < -0.25 ? 'end' : 'middle',
      inner: pointOf(index, MIN_RANK),
      outer: pointOf(index, props.scale),
      label,
      lines: texts.map((text, line) => ({
        text,
        y: Number((label.y + offset + line * LINE_HEIGHT).toFixed(1))
      })),
      missingY: Number((label.y + offset + texts.length * LINE_HEIGHT).toFixed(1))
    }
  })
)

// La graduation, une seule fois, sur l'axe qui monte : répétée sur les neuf,
// elle encombrerait la figure sans rien ajouter.
const ticks = computed(() => {
  const list = []
  for (let rank = MIN_RANK; rank <= props.scale; rank++) {
    const point = pointOf(0, rank)
    list.push({ rank, x: Number((point.x + 6).toFixed(1)), y: Number((point.y + 4).toFixed(1)) })
  }
  return list
})

// Un tracé peut avoir des trous, et c'est tout l'enjeu : une dimension sans
// mesure n'a pas de point. On dessine donc des segments ouverts sur les suites
// d'axes consécutifs qui ont une valeur, en faisant le tour de la figure. Si les
// neuf en ont une, il n'y a qu'une suite et elle se referme en polygone. S'il y
// a un trou, le tracé s'interrompt : il ne passe pas par le centre et ne coupe
// pas d'un bord à l'autre — les deux tromperaient sur ce qui n'a pas été mesuré.
function shapeOf(values) {
  const present = values.map(value => value !== null && value !== undefined)
  const marks = values
    .map((value, index) => ({ value, index }))
    .filter(entry => present[entry.index])
    .map(entry => {
      const point = pointOf(entry.index, entry.value)
      return { id: props.dimensions[entry.index].id, x: point.x, y: point.y }
    })

  const draw = (indices, closed) => {
    const d = indices
      .map((index, order) => {
        const point = pointOf(index, values[index])
        return `${order === 0 ? 'M' : 'L'}${point.x},${point.y}`
      })
      .join(' ')
    return { d: closed ? `${d} Z` : d, closed }
  }

  if (present.every(Boolean)) {
    return { segments: [draw(values.map((_, index) => index), true)], marks }
  }
  if (!present.some(Boolean)) return { segments: [], marks }

  // On part d'un axe sans valeur, ce qui garantit qu'aucune suite n'enjambe le
  // début du tour : avec au moins un trou, un tel axe existe toujours.
  const start = present.indexOf(false)
  const runs = []
  let current = null
  for (let offset = 1; offset <= count.value; offset++) {
    const index = (start + offset) % count.value
    if (present[index]) {
      if (!current) {
        current = []
        runs.push(current)
      }
      current.push(index)
    } else {
      current = null
    }
  }

  return {
    segments: runs.filter(run => run.length > 1).map(run => draw(run, false)),
    marks
  }
}

const averageShape = computed(() => shapeOf(props.dimensions.map(dimension => dimension.average)))
const floorShape = computed(() => shapeOf(props.dimensions.map(dimension => dimension.floor)))

// Les barres. Elles disent la même mesure que la figure, en la rendant
// comparable d'une dimension à l'autre : sur le radar, deux dimensions
// diamétralement opposées ne se comparent pas d'un coup d'œil.
//
// Une barre part de zéro, ce qu'un rayon ne peut pas faire : le rang 1 y occupe
// donc un cinquième du rail, et il reste visible. Une dimension sans mesure n'a
// pas de barre du tout — la raison de l'absence tient la place.
const bars = computed(() =>
  props.dimensions.map(dimension => ({
    id: dimension.id,
    name: dimension.name,
    color: dimension.color,
    missing: dimension.missing,
    rated: dimension.rated,
    averageLabel: dimension.averageLabel,
    floorLabel: dimension.floorLabel,
    averageWidth: width(dimension.average),
    floorWidth: width(dimension.floor)
  }))
)

function width(value) {
  if (value === null || value === undefined) return '0%'
  return `${Math.min(100, (value / props.scale) * 100)}%`
}
</script>

<style scoped>
.radar__figure {
  padding: 12px 16px 14px;
}

/* En réduction, la figure est seule dans son cadre : elle n'a plus d'intitulés
   à border, et la bande qui l'accueille porte déjà ses propres marges. */
.radar--compact .radar__figure {
  padding: 0;
}

.radar__svg {
  display: block;
  width: 100%;
  height: auto;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 20px;
  justify-content: center;
  margin: 4px 0 0;
  font-size: 11px;
  color: var(--color-neutral-800);
}

.legend__item {
  display: flex;
  gap: 7px;
  align-items: center;
}

.legend__swatch {
  flex: none;
  width: 34px;
  height: 12px;
}

/* — les barres —
   Deux colonnes de rails alignés : c'est l'alignement qui rend les neuf
   dimensions comparables, et c'est précisément ce que le radar ne sait pas
   faire. */
.bars {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 2px solid var(--color-text);
}

.bar {
  min-width: 0;
  padding: 10px 14px;
  border-left: 5px solid var(--dimension-color);
  border-bottom: 1px solid var(--color-divider);
}

.bar:nth-child(2n) {
  border-left-color: var(--dimension-color);
}

.bar__name {
  margin: 0 0 6px;
  font-size: 10.5px;
  font-weight: 700;
  line-height: 1.3;
  text-wrap: pretty;
}

/* Pas de barre à zéro, pas de rail vide : la raison de l'absence occupe la
   place que les deux rails auraient prise. */
.bar__absent {
  font-size: 10.5px;
  line-height: 1.4;
  font-style: italic;
  color: var(--color-neutral-700);
}

.bar__tracks {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.track {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0;
}

.track__label {
  flex: none;
  width: 52px;
  font-size: 10px;
  color: var(--color-neutral-700);
}

.track__rail {
  flex: 1 1 auto;
  min-width: 0;
  height: 10px;
  background: var(--color-neutral-200);
}

.track__value {
  display: block;
  height: 100%;
}

/* La moyenne prend la teinte de sa dimension, le plancher la reprend en creux :
   même couleur, hachurée par un liseré, pour qu'on lise deux mesures d'une même
   dimension et non deux dimensions. */
.track__value--average {
  background: var(--dimension-color);
}

.track__value--floor {
  background: var(--dimension-color);
  opacity: 0.45;
  box-shadow: inset 0 0 0 1px var(--color-neutral-600);
}

.track__figure {
  flex: none;
  width: 52px;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 12px;
  text-align: right;
  white-space: nowrap;
}

/* le total ne fait que donner son échelle au chiffre : moitié moins haut, en
   gris, il dit « sur combien » sans disputer la place à ce qui compte */
.track__total {
  font-size: 9.5px;
  font-weight: 500;
  color: var(--color-neutral-700);
}

@media (max-width: 900px) {
  .bars {
    grid-template-columns: 1fr;
  }
}
</style>

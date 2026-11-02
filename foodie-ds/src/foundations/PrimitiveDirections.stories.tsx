import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import '../tokens/primitives.css'
import './PrimitiveDirections.css'

/*
 * Side-by-side comparison of the two proposed primitive directions.
 * This page lists token NAMES only; values are read live from primitives.css.
 */

type DirectionId = 'a' | 'b'

const directions: { id: DirectionId; name: string; tagline: string; points: string[] }[] = [
  {
    id: 'a',
    name: 'Masala',
    tagline: 'Saffron, warm and efficient. Information first, like a well-printed menu.',
    points: [
      'Saffron orange brand, warm greys',
      'Compact 1.125 type scale, 12–32px',
      'Soft radii (2–16px)',
      'Warm-tinted, diffuse shadows',
      'Snappy motion, 100–360ms',
    ],
  },
  {
    id: 'b',
    name: 'Tandoor',
    tagline: 'Tomato-chilli, bold and playful. Big headlines, round shapes, a bit of bounce.',
    points: [
      'Red-orange brand, cool slate greys',
      'Expressive 1.2 type scale, 12–40px',
      'Round radii (4–24px)',
      'Crisp two-layer shadows',
      'Expressive motion, 120–480ms + spring',
    ],
  },
]

const hues = [
  { key: 'brand', label: 'Brand' },
  { key: 'neutral', label: 'Neutral' },
  { key: 'green', label: 'Green — veg, success, ratings' },
  { key: 'red', label: 'Red — non-veg, error' },
  { key: 'amber', label: 'Amber — warning, offers' },
]
const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
const fontSizes = ['4xl', '3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs']
const weights = ['regular', 'medium', 'semibold', 'bold']
const spaceA = ['0-5', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16']
const spaceB = ['1', '2', '3', '4', '6', '8', '10', '12', '16', '20']
const radii = ['xs', 'sm', 'md', 'lg', 'xl', 'pill']
const shadows = ['sm', 'md', 'lg', 'xl']
const durations = ['fast', 'base', 'slow', 'slower']

/* ---------- helpers ---------- */

function luminance(hex: string) {
  const c = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}

function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

/** Reads custom property values from the rendered direction column. */
function useTokenValues(names: string[]) {
  const ref = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const key = names.join('|')
  useEffect(() => {
    if (!ref.current) return
    const cs = getComputedStyle(ref.current)
    setValues(Object.fromEntries(key.split('|').map((n) => [n, cs.getPropertyValue(`--${n}`).trim()])))
  }, [key])
  return [ref, values] as const
}

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="pd__section-title">{title}</h2>
      {note && <p className="pd__section-note">{note}</p>}
      {children}
    </section>
  )
}

function Compare({ children }: { children: (id: DirectionId) => ReactNode }) {
  return (
    <div className="pd__grid">
      {directions.map((d) => (
        <div key={d.id} data-direction={d.id} className="pd-col">
          <span className="pd-col__tag">
            {d.id.toUpperCase()} · {d.name}
          </span>
          {children(d.id)}
        </div>
      ))}
    </div>
  )
}

/** Browsers normalise "100ms" to ".1s"; show ms for readability. */
function toMs(v = '') {
  if (!v) return ''
  return v.endsWith('ms') ? v : `${Math.round(parseFloat(v) * 1000)}ms`
}

/* ---------- sections ---------- */

function SampleCard() {
  return (
    <>
      <article className="pd-card">
        <div className="pd-card__media">
          <span className="pd-card__offer fds-truncate">60% OFF up to ₹120</span>
        </div>
        <div className="pd-card__body">
          <div className="pd-card__row">
            <h3
              className="pd-card__title fds-truncate"
              title="Shree Krishna Pure Veg Bhojanalaya & South Indian Tiffin Centre"
            >
              Shree Krishna Pure Veg Bhojanalaya & South Indian Tiffin Centre
            </h3>
            <span className="pd-card__rating">4.3 ★</span>
          </div>
          <p className="pd-card__meta fds-truncate">25–30 mins · 2.1 km · ₹350 for two</p>
          <div className="pd-dish">
            <span className="pd-mark pd-mark--veg" role="img" aria-label="Veg" />
            <div className="pd-dish__info">
              <div className="pd-dish__name fds-truncate">Paneer Butter Masala</div>
              <div className="pd-dish__price">₹249</div>
            </div>
            <button type="button" className="pd-btn pd-btn--outline">
              ADD
            </button>
          </div>
          <div className="pd-dish">
            <span className="pd-mark pd-mark--nonveg" role="img" aria-label="Non-veg" />
            <div className="pd-dish__info">
              <div className="pd-dish__name fds-truncate">Hyderabadi Chicken Dum Biryani</div>
              <div className="pd-dish__price">₹1,249</div>
            </div>
            <button type="button" className="pd-btn pd-btn--outline">
              ADD
            </button>
          </div>
        </div>
      </article>
      <button type="button" className="pd-btn pd-btn--block">
        View cart · ₹1,498
      </button>
      <div className="pd-status">
        <span className="pd-chip pd-chip--brand">Free delivery</span>
        <span className="pd-chip pd-chip--success">Order delivered</span>
        <span className="pd-chip pd-chip--error">Payment failed</span>
        <span className="pd-chip pd-chip--warning">Running late</span>
      </div>
    </>
  )
}

function ColorScale({ hue }: { hue: string }) {
  const names = steps.map((s) => `palette-${hue}-${s}`)
  const [ref, values] = useTokenValues(names)
  return (
    <ul className="pd-scale" ref={ref as React.Ref<HTMLUListElement>}>
      {steps.map((s, i) => {
        const hex = values[names[i]] ?? ''
        const onWhite = hex ? contrast(hex, '#ffffff') : 0
        const fg = onWhite >= 4.5 ? 'var(--palette-neutral-50)' : 'var(--palette-neutral-900)'
        return (
          <li
            key={s}
            className="pd-swatch"
            style={{ background: `var(--palette-${hue}-${s})`, color: fg }}
            title={`--palette-${hue}-${s}`}
          >
            <span className="pd-swatch__step">{s}</span>
            <span className="pd-swatch__meta">
              {hex} {hex && `· ${onWhite.toFixed(1)}:1${onWhite >= 4.5 ? ' ✓' : ''}`}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function TypeScale() {
  const names = fontSizes.map((s) => `scale-font-size-${s}`)
  const [ref, values] = useTokenValues(names)
  return (
    <div ref={ref} className="pd-scale">
      {fontSizes.map((s, i) => {
        const rem = parseFloat(values[names[i]] ?? '')
        return (
          <div key={s} className="pd-type-row">
            <span className="pd-type-row__label">
              {s} · {rem ? `${rem * 16}px` : ''}
            </span>
            <span className="pd-type-row__sample fds-truncate" style={{ fontSize: `var(--${names[i]})` }}>
              Masala Dosa ₹149
            </span>
          </div>
        )
      })}
      <div className="pd-weights">
        {weights.map((w) => (
          <span key={w} style={{ fontWeight: `var(--scale-font-weight-${w})` }}>
            {w}
          </span>
        ))}
      </div>
      <div className="pd-type-row">
        <span className="pd-type-row__label">Devanagari check</span>
        <span className="pd-type-row__sample" style={{ fontSize: 'var(--scale-font-size-lg)' }}>
          पनीर बटर मसाला
        </span>
      </div>
    </div>
  )
}

function SpaceScale({ id }: { id: DirectionId }) {
  const list = id === 'a' ? spaceA : spaceB
  const names = list.map((s) => `scale-space-${s}`)
  const [ref, values] = useTokenValues(names)
  return (
    <div ref={ref} className="pd-scale">
      {list.map((s, i) => {
        const rem = parseFloat(values[names[i]] ?? '')
        return (
          <div key={s} className="pd-space-row">
            <span className="pd-space-row__label">
              {s} · {rem ? rem * 16 : ''}
            </span>
            <span className="pd-space-row__bar" style={{ width: `var(--${names[i]})` }} />
          </div>
        )
      })}
    </div>
  )
}

function Radii() {
  const names = radii.map((r) => `scale-radius-${r}`)
  const [ref, values] = useTokenValues(names)
  return (
    <div ref={ref} className="pd-tiles">
      {radii.map((r, i) => (
        <div key={r} className="pd-tile pd-tile--radius" style={{ borderRadius: `var(--${names[i]})` }}>
          {r} {values[names[i]] && r !== 'pill' ? values[names[i]] : ''}
        </div>
      ))}
    </div>
  )
}

function Shadows() {
  return (
    <div className="pd-tiles">
      {shadows.map((s) => (
        <div key={s} className="pd-tile pd-tile--shadow" style={{ boxShadow: `var(--scale-shadow-${s})` }}>
          {s}
        </div>
      ))}
    </div>
  )
}

function Motion({ id, on }: { id: DirectionId; on: boolean }) {
  const easings = id === 'b' ? ['standard', 'spring'] : ['standard']
  const names = durations.map((d) => `scale-duration-${d}`)
  const [ref, values] = useTokenValues(names)
  return (
    <div ref={ref} className="pd-scale">
      {easings.map((e) =>
        durations.map((d, i) => (
          <div key={`${e}-${d}`} className="pd-motion-row">
            <span>
              {d} · {toMs(values[names[i]])} · {e}
            </span>
            <div className={`pd-motion-track${on ? ' is-on' : ''}`}>
              <span
                className="pd-motion-dot"
                style={{
                  transitionDuration: `var(--scale-duration-${d})`,
                  transitionTimingFunction: `var(--scale-easing-${e})`,
                }}
              />
            </div>
          </div>
        )),
      )}
    </div>
  )
}

/* ---------- page ---------- */

function PrimitiveDirections() {
  const [motionOn, setMotionOn] = useState(false)
  return (
    <div className="pd">
      <Section
        title="Primitive directions"
        note="Two proposals for tokens/primitives.css. Same token names in both, so the semantic layer works on either. Nothing is adopted yet."
      >
        <div className="pd__grid">
          {directions.map((d) => (
            <div key={d.id} data-direction={d.id} className="pd-col">
              <span className="pd-col__tag">Direction {d.id.toUpperCase()}</span>
              <h3 className="pd-col__name">{d.name}</h3>
              <p className="pd-col__tagline">{d.tagline}</p>
              <ul className="pd-col__list">
                {d.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="In context"
        note="A rough restaurant card built only from each direction's primitives. Not a real component, just a feel check."
      >
        <Compare>{() => <SampleCard />}</Compare>
      </Section>

      <Section
        title="Color"
        note="Generated in OKLCH so lightness is even across hues. Ratio = contrast against white. Step 600 is the first that passes 4.5:1 in every scale."
      >
        <div className="pd__grid">
          {hues.map((h) => (
            <div key={h.key} style={{ display: 'contents' }}>
              <p className="pd__subgrid-label">{h.label}</p>
              {directions.map((d) => (
                <div key={d.id} data-direction={d.id}>
                  <ColorScale hue={h.key} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Type scale" note="Both use the system font stack with Noto Sans Devanagari fallback.">
        <Compare>{() => <TypeScale />}</Compare>
      </Section>

      <Section title="Spacing" note="Both on a 4px base. A adds a 2px half-step; B skips 20 and adds 80.">
        <Compare>{(id) => <SpaceScale id={id} />}</Compare>
      </Section>

      <Section title="Radius">
        <Compare>{() => <Radii />}</Compare>
      </Section>

      <Section title="Shadow">
        <Compare>{() => <Shadows />}</Compare>
      </Section>

      <Section title="Motion" note="Tap play to compare durations and easing.">
        <button type="button" className="pd-btn" data-direction="a" onClick={() => setMotionOn((v) => !v)}>
          {motionOn ? '◀ Reset' : '▶ Play'}
        </button>
        <div style={{ marginTop: 'var(--space-4)' }}>
          <Compare>{(id) => <Motion id={id} on={motionOn} />}</Compare>
        </div>
      </Section>
    </div>
  )
}

const meta = {
  title: 'Foundations/Primitive Directions',
  component: PrimitiveDirections,
  parameters: { fdsWide: true },
  globals: { viewport: { value: 'responsive', isRotated: false } },
} satisfies Meta<typeof PrimitiveDirections>

export default meta
type Story = StoryObj<typeof meta>

export const SideBySide: Story = {}

import type { Meta, StoryObj } from '@storybook/react-vite'
import './Tokens.css'

// Lists token NAMES only. Values live in src/tokens/tokens.css.
const colorTokens = [
  'color-brand',
  'color-action-primary-bg',
  'color-action-primary-bg-hover',
  'color-action-primary-bg-pressed',
  'color-action-secondary-bg',
  'color-action-secondary-fg',
  'color-action-disabled-bg',
  'color-bg-page',
  'color-bg-surface',
  'color-bg-subtle',
  'color-text-primary',
  'color-text-secondary',
  'color-text-disabled',
  'color-text-brand',
  'color-text-link',
  'color-border-default',
  'color-border-strong',
  'color-focus-ring',
  'color-veg',
  'color-nonveg',
  'color-rating-bg',
  'color-success-bg',
  'color-error-bg',
  'color-warning-bg',
  'color-info-bg',
  'color-offer-bg',
]

const spaceTokens = ['space-1', 'space-2', 'space-3', 'space-4', 'space-5', 'space-6', 'space-8', 'space-10', 'space-12']

const fontSizeTokens = ['font-size-xs', 'font-size-sm', 'font-size-md', 'font-size-lg', 'font-size-xl', 'font-size-2xl']

const radiusTokens = ['radius-sm', 'radius-md', 'radius-lg', 'radius-xl', 'radius-pill']

const shadowTokens = ['shadow-sm', 'shadow-md', 'shadow-lg']

function TokenSheet() {
  return (
    <div className="tokens">
      <section>
        <h2 className="tokens__heading">Color</h2>
        <ul className="tokens__list">
          {colorTokens.map((t) => (
            <li key={t} className="tokens__row">
              <span className="tokens__swatch" style={{ background: `var(--${t})` }} />
              <code className="tokens__name fds-truncate">--{t}</code>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="tokens__heading">Spacing</h2>
        <ul className="tokens__list">
          {spaceTokens.map((t) => (
            <li key={t} className="tokens__row">
              <span className="tokens__bar" style={{ width: `var(--${t})` }} />
              <code className="tokens__name">--{t}</code>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="tokens__heading">Type scale</h2>
        <ul className="tokens__list">
          {fontSizeTokens.map((t) => (
            <li key={t} className="tokens__row">
              <span className="fds-truncate" style={{ fontSize: `var(--${t})` }}>
                Paneer Butter Masala — ₹249
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="tokens__heading">Radius</h2>
        <ul className="tokens__list">
          {radiusTokens.map((t) => (
            <li key={t} className="tokens__row">
              <span
                className="tokens__swatch"
                style={{ borderRadius: `var(--${t})`, background: 'var(--color-bg-subtle)' }}
              />
              <code className="tokens__name">--{t}</code>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="tokens__heading">Elevation</h2>
        <ul className="tokens__list">
          {shadowTokens.map((t) => (
            <li key={t} className="tokens__row">
              <span
                className="tokens__swatch"
                style={{ boxShadow: `var(--${t})`, background: 'var(--color-bg-surface)' }}
              />
              <code className="tokens__name">--{t}</code>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

const meta = {
  title: 'Foundations/Tokens',
  component: TokenSheet,
} satisfies Meta<typeof TokenSheet>

export default meta
type Story = StoryObj<typeof meta>

export const All: Story = {}

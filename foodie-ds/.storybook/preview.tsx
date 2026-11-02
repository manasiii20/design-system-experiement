import type { Preview } from '@storybook/react-vite'
import '../src/styles/global.css'

// 390px is the design target. Other sizes are for checking resilience only.
const viewports = {
  foodieMobile: {
    name: 'Design target (390 × 844)',
    styles: { width: '390px', height: '844px' },
    type: 'mobile',
  },
  smallMobile: {
    name: 'Small Android (360 × 740)',
    styles: { width: '360px', height: '740px' },
    type: 'mobile',
  },
  compactMobile: {
    name: 'Compact (320 × 640)',
    styles: { width: '320px', height: '640px' },
    type: 'mobile',
  },
} as const

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    viewport: { options: viewports },
    backgrounds: { disabled: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      test: 'todo',
    },
  },
  initialGlobals: {
    viewport: { value: 'foodieMobile', isRotated: false },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: 'var(--layout-viewport-width)',
          padding: 'var(--layout-gutter)',
          background: 'var(--color-bg-surface)',
          minHeight: '100%',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export default preview

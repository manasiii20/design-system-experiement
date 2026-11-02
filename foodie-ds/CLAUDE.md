# foodie-ds — CLAUDE.md

Design system for a food delivery app for Indian users, in the spirit of Swiggy and Zomato.
Read this whole file before writing or changing any component.

## Brief

**Product.** A mobile food delivery app. People browse restaurants, scan menus, customise dishes,
add to cart, apply offers, pay, and track their order.

**Users.** Indian, mostly on mid-range and budget Android phones, often on patchy 4G, often one-handed,
often outdoors in bright light. Many read English as a second language. Restaurant and dish names
mix English with Hindi and other Indian languages and can be long
(e.g. "Shree Krishna Pure Veg Bhojanalaya & South Indian Tiffin Centre").

**Feel.** Warm, appetising, fast, and trustworthy. Bold saffron primary, lots of white space,
food photography does the heavy lifting. Dense information (rating, ETA, price for two, offers)
must still scan in under a second.

**Indian-market conventions the components must support:**
- Prices in rupees: `₹249`, grouped the Indian way (`₹1,24,999`). Format with
  `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })`
  unless paise are needed.
- Veg / non-veg marks (square outline with a dot) on every dish, using `--color-veg` / `--color-nonveg`.
  Never rely on color alone: include an accessible label ("Veg" / "Non-veg").
- Ratings as a compact green badge (`4.3 ★`) with a rating count (`1.2K+ ratings`).
- Offers and coupons ("60% OFF up to ₹120", "Free delivery") are first-class UI, not an afterthought.
- Delivery ETA as a range ("25–30 mins") and distance in km.
- Text may be Devanagari or other Indic scripts; never assume Latin-only glyph heights.

**Target viewport.** Mobile first, designed at **390px wide**. Must still work at 360px and 320px.
Wider screens show the 390px column centred (see `src/styles/global.css`).

## Tech stack

- Vite + React + TypeScript.
- Storybook (`@storybook/react-vite`) for development and review of every component.
- **Plain CSS with CSS custom properties.** No UI library, no CSS-in-JS, no Tailwind,
  no Sass. One `.css` file per component, imported by the component.
- Do not add runtime dependencies without asking.

## Commands

Run from `foodie-ds/`:

| Task | Command |
| --- | --- |
| App playground | `npm run dev` |
| Storybook | `npm run storybook` (port 6006) |
| Type-check | `npm run typecheck` |
| Lint | `npm run lint` |
| Build app | `npm run build` |
| Build Storybook | `npm run build-storybook` |
| Story tests (Vitest + Playwright) | `npm test` |

Before saying a component is done: `npm run typecheck`, `npm run lint`, and `npm run build-storybook` pass.

## Project layout

```
src/
  tokens/tokens.css        # the ONLY place raw values may appear
  styles/global.css        # reset, base element styles, app shell
  styles/utilities.css     # .fds-truncate, .fds-clamp, .fds-visually-hidden
  foundations/             # token reference stories
  components/
    Button/
      Button.tsx
      Button.css
      Button.stories.tsx
      index.ts
```

- Component folders and files are PascalCase. CSS classes use BEM with an `fds-` prefix:
  `.fds-button`, `.fds-button__icon`, `.fds-button--primary`.
- Export the component and its props type from the folder's `index.ts`.

## Rule 1: Tokens only. Never hardcode.

Never hardcode **colors, spacing, font sizes**, or any other visual value in components or stories.
Always use a token from `src/tokens/tokens.css`.

- ✅ `padding: var(--space-3) var(--space-4);`
- ✅ `color: var(--color-text-secondary);`
- ✅ `font-size: var(--font-size-sm);`
- ❌ `padding: 12px 16px;` `color: #6e6e78;` `font-size: 14px;` `rgba(0,0,0,.5)` `color: red`
- ❌ Inline `style={{ marginTop: 8 }}` with a literal value.

Details:
- Components use **semantic tokens** only (`--color-*`, `--space-*`, `--font-*`, `--radius-*`, ...).
  `--palette-*` primitives exist only so semantic tokens can reference them. Never use them in components.
- This covers font weight, line height, radius, border width, shadow, z-index, duration, easing,
  and opacity too.
- Allowed literals: `0`, `100%`, `auto`, `none`, `inherit`, `currentColor`, `transparent`,
  unitless `1` for flex, and layout keywords. Local CSS custom properties that are not design decisions
  (e.g. `--fds-lines: 2` for line clamping) are fine.
- If no token fits, **stop and ask** (see Rule 7). Do not approximate with a literal, and do not
  add a token "just for now".

## Rule 2: Every interactive state, every time

Every component must implement and show these states:

| State | How |
| --- | --- |
| **Default** | Resting appearance. |
| **Hover** | `:hover`, wrapped in `@media (hover: hover)` so it doesn't stick on touch screens. |
| **Pressed** | `:active` plus a `data-pressed` / `aria-pressed` style when the component is a toggle. Use `--pressed-scale` and the `*-pressed` color tokens. |
| **Focus** | `:focus-visible` with `--focus-ring-width`, `--focus-ring-offset`, `--color-focus-ring`. Never remove the outline without replacing it. |
| **Disabled** | Native `disabled` where possible, otherwise `aria-disabled="true"` and block interaction. Use the `--color-action-disabled-*` / `--color-text-disabled` tokens. |
| **Loading** | A `loading` prop. Show a spinner or skeleton, set `aria-busy="true"`, block repeat activation, and **keep the component's size unchanged** (no layout shift). |

Non-interactive display components (e.g. a rating badge) still need a loading/skeleton state and
must document why hover/pressed/focus don't apply in their story.

Transitions use `--duration-*` and `--easing-standard`. `tokens.css` zeroes durations under
`prefers-reduced-motion`, so don't hardcode a duration anywhere.

## Rule 3: Touch targets are at least 44 × 44px

- Every tappable element has a hit area of at least `var(--size-touch-target)` in both dimensions.
- If the visual is smaller (an icon button, a "+" stepper, a close ×), expand the hit area with
  padding or a `::before` pseudo-element. Do not shrink the target to match the visual.
- Keep at least `var(--space-2)` between adjacent targets.

## Rule 4: Long names must not break layout

Restaurant names, dish names, addresses, and customisation text can be long, and can be in Indic scripts.

- Single-line contexts (cards, list rows, headers, buttons, chips): truncate with an ellipsis using
  `.fds-truncate`, or the same properties in the component's CSS.
- Multi-line contexts (dish descriptions, card titles that may wrap): clamp with `.fds-clamp` and
  `--fds-lines`.
- Any flex/grid child holding text needs `min-width: 0` or truncation won't work.
- When truncating, put the full text in `title` or an accessible name so it isn't lost.
- Prices, ratings, ETAs, and veg marks must **never** be truncated or squeezed. The name truncates; they stay.
- Never fix width problems by shrinking the font size.

## Rule 5: Every component gets a Storybook story with all variants

`ComponentName.stories.tsx` next to the component, using CSF3 and `satisfies Meta<typeof Component>`.

Each story file must include:
1. **One story per variant** (e.g. `Primary`, `Secondary`, `Ghost`) and per size.
2. **A `States` story** showing default, hover, pressed, focus, disabled, and loading side by side.
   Hover/pressed/focus can't be triggered statically, so render them with a forced class
   (e.g. `.is-hover`, `.is-pressed`, `.is-focus`) that the component CSS styles identically to the
   real pseudo-class. These classes exist for documentation only.
3. **A `LongText` story** with realistic long Indian restaurant/dish names, proving truncation works
   at 390px and at 320px.
4. **An `AllVariants` story**: the full matrix on one screen for visual review.
5. Realistic Indian content: "Paneer Butter Masala", "Hyderabadi Chicken Dum Biryani", "₹249",
   "25–30 mins". No lorem ipsum.
6. `argTypes` for every public prop so controls work.

Stories follow the same token rules: no hardcoded values in decorators or inline styles.
Storybook defaults to the 390px viewport (`.storybook/preview.tsx`).

## Rule 6: Accessibility baseline

- Use semantic HTML first (`<button>`, `<a>`, `<input>`, `<label>`). ARIA only to fill gaps.
- Text contrast is at least 4.5:1 (3:1 for large text and UI boundaries). `--color-brand` is decorative
  and fails as text on white; use `--color-text-brand` or `--color-action-primary-bg`.
- Icon-only controls need an `aria-label`.
- Body and input text is at least `--font-size-md` (16px) so iOS doesn't zoom inputs.
- Check the a11y panel in Storybook. Don't ship with new violations.

## Rule 7: Token governance. Ask before adding a token.

**Ask before adding any new token.** This includes new colors, spacing steps, font sizes, radii,
shadows, durations, and new semantic aliases of existing primitives.

When a token seems to be missing:
1. Check whether an existing token fits. Prefer reuse.
2. If not, stop and ask the user. Say:
   - the proposed name and value,
   - which component needs it and why,
   - which existing tokens you considered and why they don't fit.
3. Only add it to `src/tokens/tokens.css` after explicit approval. Never add tokens anywhere else.

The same applies to renaming, removing, or changing the value of an existing token.

## Component checklist

Before calling a component done:

- [ ] No hardcoded colors, spacing, font sizes, or other raw values in `.css`, `.tsx`, or stories.
- [ ] Default, hover, pressed, focus, disabled, and loading states implemented.
- [ ] Every tap target ≥ 44 × 44px.
- [ ] Long names truncate or clamp; prices, ratings, and veg marks never do.
- [ ] Stories: every variant, `States`, `LongText`, `AllVariants`, with Indian content.
- [ ] Looks right at 390px, still works at 320px.
- [ ] Keyboard operable, visible focus, accessible name, no new a11y violations.
- [ ] No new tokens added without asking.
- [ ] `npm run typecheck`, `npm run lint`, `npm run build-storybook` pass.

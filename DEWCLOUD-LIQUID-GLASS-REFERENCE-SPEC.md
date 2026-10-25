# DewCloud Liquid Glass UI Reference v1.0.1

Status: **base layout direction approved; lighting.1 refinement pending review**. See `LIGHTING-REFINEMENT-NOTE.md` for current material deltas, screenshots and targeted verification. Earlier QA records remain historical baseline evidence. This version is a separate example, not a replacement approval of the original DewCloud core.

Reference directory: `C:\Users\robertb\OneDrive\Documents\GitHub\DewCloud-UI\examples\dewcloud-liquid-glass-ui-reference-v1.0.1`.

## Visual authority and scope

The implementation foundation is the existing `DewCloud-UI` repository at commit `462aae2a8c5a7647c66b7fa62ffbb7191aeba7ce`. Original token and component CSS, token JSON, background assets, icon geometry and the lighting helper are preserved in `vendor/` with provenance hashes. Original core files remain untouched.

All **three** supplied photographs are direct visual references. Their byte-preserved copies and hashes are under `visual-references/` and in `PROVENANCE.json`. They define the new reference's material direction: deep navy surroundings, frosted blue glass, curved capsule controls, luminous edge reflections, restrained interior glow, crisp text, distinct selected/pressed/disabled appearances and optional directional light. Their layouts, labels, finance figures, avatars and application content are not cloned.

Photo 1 primarily informs the capsule curvature, icon-state progression and polished rims. Photo 2 informs the frosted surface hierarchy, readable forms/tables and labelled teal/blue palette. Photo 3 informs side navigation, edge reflections and consistent active/focus treatment across a practical workspace. Motion is implemented from the written interaction requirements; a still photograph cannot prove a particular animation or sensor behaviour.

The previous `dewcloud-ui-reference-v1.0.1` example remains intact. This new directory and name identify the liquid-glass system distinctly.

## Architecture and standalone use

```text
index.html / reference.js      Working native component showcase
ui/reference.css              Preserved previous layout/semantic foundation
ui/liquid-tokens.css           Executable reference-specific theme/material layer
ui/liquid-tokens.json          Versioned cross-platform token inventory
ui/liquid-glass.css            Materials, controls, states and fallbacks
ui/lighting.js                 Decorative pointer/optional sensor controller
ui/controls.js                 Themes, semantic controls, dialogs and notifications
ui/icons.json                 Original DewCloud icon path geometry
vendor/                       Unchanged upstream snapshot and provenance sources
visual-references/            Three supplied input photographs
evidence/                     Reference-only captures and verification results
```

No package manager, external CDN, framework, WebGL or production service is required. From the reference directory:

```powershell
python -B -m http.server 8892 --bind 127.0.0.1
```

Open `http://127.0.0.1:8892/?theme=dark`. Use `theme=light` or `theme=auto` to compare. HTTP serving is required for ES modules and local JSON; double-clicking the HTML is not the supported launch method. Bind to loopback for local review. Stop the server with Ctrl+C.

The entire directory can be copied elsewhere. Upstream and source-image paths in provenance are historical records, never runtime dependencies. No customer artwork, account service or customer-project dependency is included.

## Versioned token boundary

The original core token files are imported unchanged before the new layer. Reference-specific overrides are namespaced `--dc-*`. The palette follows labelled values in the supplied images and is recorded explicitly; it is not silently presented as a newly approved core palette.

| Token | Dark / shared value | Purpose |
|---|---|---|
| `--dc-bg` | `#132139` | Navy base; restrained midnight/cool ambient background gradients surround it. |
| `--dc-surface` | `#18263B` | Surface hierarchy token. |
| `--dc-teal-100`, `--dc-teal-200` | `#5EEAD4`, `#2DD4BF` | Teal accents and restrained highlights. |
| `--dc-blue-100`, `--dc-blue-200` | `#60A5FA`, `#3B82F6` | Blue accent family. |
| `--dc-text` | `#E5E7EB`; light `#1F2933` | Main interface text. |
| `--dc-muted` | `#B8CDE0`; light `#3D5368` | Readable secondary text. |
| `--dc-panel` | `rgba(18,44,69,.88)` | Slightly frosted dark material; light mode uses a near-white translucent material. |
| `--dc-radius-panel`, `--dc-radius-field` | 18px, 14px | Panel and field geometry, consistent with the source scale. |
| `--dc-radius-control` | 999px | Capsule buttons, segmented items and navigation. |
| `--dc-blur` | 10px | Restrained backdrop blur on UI surfaces. |
| Rim width | 1.5px; large icon 1.9px | Masked curved edge reflection. |
| `--dc-motion-fast`, `--dc-motion-settle` | 110ms, 180ms | Interaction timing inventory. CSS/JS lighting uses event-driven smoothing. |
| `--dc-ease` | `cubic-bezier(.2,.7,.2,1)` | Restrained material response. |

Additional fill, border, rim, inset and shadow values are in `liquid-tokens.css` and JSON. Readability takes precedence over directly using a bright accent as a button fill: white button labels sit on deeper blue/teal fills, with bright accents at the edges. Danger uses an explicit red/rose semantic treatment, independent of ordinary accent selection.

Dark is the default. Light uses dark text and visible control boundaries. Auto follows the current `prefers-color-scheme` setting and reacts when it changes. Theme selection is local UI state/query-string state, not an account preference or server update.

## Material and interaction model

`.dc-liquid` combines three separate responsibilities:

1. A translucent, slightly frosted base with a restrained inset and shadow.
2. A thin, masked conic reflection **on the edge only**. The brighter arc changes direction with the light source.
3. A broad, faint curved reflection inside the surface, behind its contents. There is no bright circular spotlight, image tint or geometric card tilt.

| State | Behaviour |
|---|---|
| Default | Calm rounded material with a fixed key-light position. |
| Hover | Etched ink illuminates first; diffused interior light follows; the directional rim supports it. Text geometry stays still. |
| Pressed | One-pixel depth cue, deeper inset and denser fill. Reduced motion removes the travel. |
| Selected/current | Persistent illuminated ink and local-accent interior, supporting rim and semantic `aria-current` / `aria-pressed`. No looping animation. |
| Focus | Explicit high-contrast outline outside the surface; it is not replaced by decorative glow. |
| Disabled | Muted, noninteractive and static. Both reflection pseudo-elements are suppressed and the lighting controller skips the element. |

Cards react only when the cursor is within or near them. No wobble, card rotation, content parallax or changing dimensions are used. Decorative reflections never carry essential information. Customer artwork/document canvases must stay opaque and neutral; apply `.dc-liquid` to the surrounding chrome, never to an illustration or image element.

## Lighting controller

`LiquidLighting` is a reusable controller with `refresh()`, `enableTilt()`, `disableTilt()` and `destroy()`. `setup()` wires the demonstration controls and returns the controller. A MutationObserver refreshes the surface inventory after dynamic page/route changes; it observes only relevant structural/state mutations.

Pointer input is accepted only for a fine pointer with hover capability; touch pointer movement is not treated as mouse lighting. Visible element rectangles are cached and refreshed after scroll/resize/structural changes. Only nearby or changing surfaces receive CSS-variable updates. Work is coalesced through one `requestAnimationFrame` chain, capped to roughly 31 updates/second, with shortest-angle interpolation and bounded strength. The loop stops after convergence and while the page is hidden. There is no permanent idle render loop.

Each surface has its own `--dc-rim-angle`, `--dc-light-x`, `--dc-light-y` and `--dc-light-strength`. A disabled surface is skipped even if its parent panel is responding to the cursor. Descendant disabled fields and artwork must never become independently animated surfaces.

## Mobile orientation and privacy

Tilt is optional and initially off. “Enable tilt” is the explicit user gesture. The controller checks for a secure context and the orientation interface, requests permission when the browser exposes that method, and handles denial, rejection or missing support with a readable fallback. It does not request absolute orientation or magnetometer access. These requirements follow the [W3C Device Orientation specification](https://www.w3.org/TR/orientation-event/).

The first finite sensor event calibrates a neutral device position. Beta/gamma changes are bounded to a ±22° working range and adjusted for screen orientation. Values only influence the decorative light direction; they are not stored, transmitted or used for navigation or identity. “Disable tilt” removes the listener and restores the static position. A grant with no hardware events is reported as waiting for supported input, never as proven working hardware.

Reduced motion or lower/static effects disable the tilt control and remove any active sensor listener. Pointer/static fallback remains useful when permission is absent. All navigation, controls, downloads and reading work without sensors. Physical iOS/Android/tablet behaviour must be tested separately; browser-injected events are synthetic API-path evidence only.

## Reduced motion, fallback and performance

- **Standard:** frosted material and optional directional reflections.
- **Static reflections:** fixed polished rims, no pointer or sensor tracking.
- **Low effects:** opaque readable surfaces, no blur or moving reflection layers. Selected and primary states remain explicit.
- **Reduced motion:** tracking and sensors stop, highlights reset, travelling press/hover effects and transitions are removed. Content remains unchanged.
- **No backdrop-filter support:** solid material fallback. If mask composition is unavailable, the animated rim is omitted while a conventional visible border remains.
- **Forced colours:** native system colours, explicit boundaries/focus, no glass decoration.
- **Hidden page:** pending animation work is cancelled; no background rendering loop is retained.

Decorative movement can be disabled without losing functionality, consistent with [WCAG guidance on animation from interaction](https://www.w3.org/TR/wcag/#animation-from-interactions). Focus remains an explicit contrasting boundary rather than an ambient bloom; see [W3C Focus Appearance guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance).

## Component usage and future applications

Include `ui/liquid-glass.css` and import `setup` from `ui/controls.js`. Use native semantic HTML from `index.html` as the component contract:

```html
<button class="primary">Save changes</button>
<button class="glass-btn icon-button" aria-label="Refresh"><span data-icon="refresh"></span></button>
<section class="glass-card"><h2>Account overview</h2>…</section>
<button class="glass-toggle switch" role="switch" aria-checked="false" aria-label="Show adjustments"><span class="knob"></span></button>
```

`setup()` decorates the supported control/panel inventory; direct integrations can instantiate `LiquidLighting` and call `refresh()` after rendering. Teardown with `destroy()` when the app shell is disposed. Explicitly wire application actions; the reference's notifications and synthetic entries are demonstration code.

For Blazor/Radzen or other frameworks, retain real form binding, validation, keyboard semantics, authorization and native component ownership. Apply classes at stable rendered boundaries and dispose event subscriptions with the host component. The example is framework-independent CSS/JavaScript, **not** a tested Radzen package or a production authentication/finance implementation.

The showcase includes icon/action/pill controls, selection/switches, cards, side navigation, labelled forms, searchable synthetic ledger data, native modal/focus wrapping, notifications, progress, empty/error states and authentication layout. Amounts are tabular examples, never real financial data. Preserve at least 44px control targets where demonstrated, readable table text and a labelled contained scroll region on smaller screens. Do not encode positive/negative meaning by colour alone; the amounts also have signs and category text.

## Verification and approval

The evidence folder records rendered desktop/tablet/mobile views, actual pointer/pressed/selected/disabled checks, theme changes, keyboard behaviour, reduced-motion/low-effects behaviour and synthetic sensor permission paths. SHA-256 inventories record the exact version. Targeted contrast and Chrome evidence do not constitute complete WCAG, assistive-technology, browser or native-device certification.

Approval is requested for the three-image interpretation, material intensity, light/dark treatments, lighting response, native adapter architecture and reference-specific token layer. No core files, production application or release package is automatically changed by approval of this preview alone.

## Etched.1 correction precedence

The current material contract and timing are specified in `ETCHED-GLASS-IMPLEMENTATION.md` and versioned tokens. These supersede earlier lighting.1 material-intensity descriptions in this document and historical screenshots. The background/layout/core palette is unchanged. This v1.0.1 candidate awaits visual approval; current checks are in `evidence/etched.1/`.

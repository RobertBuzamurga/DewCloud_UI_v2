# DewCloud etched-glass material and motion — v1.0.1 / etched.1

Correction candidate for review, 24 October 2026. Previous v1.0.0 / lighting.1 remains untouched in its sibling directory. This is a standalone CSS/JavaScript reference; no original DewCloud core component, customer branding, data or credentials are required.

## Material contract

The existing layout, typography, navy shell, native controls and semantic states are retained. `LiquidLighting.refresh()` decorates supported native controls with `dc-etch`; it does not wrap text or images. Cards keep the established directional reflections. Do not apply this class to artwork canvases, images or document pages.

Default controls use neutral graphite/pale glass and crisp, lightly recessed text/icon edges. Hover and keyboard focus start with an 85ms foreground colour/shadow transition. Interior illumination starts after 75ms and diffuses over 240ms. The rim's supporting brightening starts after 150ms over 180ms. These overlap into one response; none loops. Selected/current/checked states retain the illuminated ink, accent-filled interior and supporting rim. Press uses the existing shallow inset cue. Disabled surfaces are neutral and static, with no icon glow or reflection pseudo-elements.

Only text uses text-shadow and only the inline SVG receives small drop-shadows; no whole-control blur/filter is applied. Background and content geometry are unchanged. The `::after` interior layer is behind content and expands within the control, not across surrounding artwork.

## Tokens and per-control accent

CSS is executable; `ui/liquid-tokens.json` records the versioned values. Important tokens: `--dc-etch-ink`, `--dc-lit-ink`, `--dc-etch-cut`, `--dc-etch-lip`, `--dc-energy`, `--dc-ink-halo`, `--dc-rim-accent`, and the three `--dc-etch-*-ms` / delay values. Background tokens remain #132139 / #18263B. Original upstream token files remain unchanged.

Set `--dc-accent` on an individual control or an ancestor. Derived ink/interior/rim tokens are resolved on each `dc-etch` control, so local overrides work without cloning styles. Approved teal is the default; blue primary and danger controls use their existing semantic accents. Optional `data-accent="blue"` and `data-accent="teal"` are convenience presets. Example:

```html
<button style="--dc-accent:#60A5FA">View summary</button>
<button data-accent="teal" aria-pressed="true">Selected view</button>
```

Dark theme mixes the local accent toward white for illuminated ink; light theme mixes toward dark navy. Retest contrast for any consumer-supplied accent, font size or background. Preserve semantic state and the independent focus outline; glow must never be the only state indicator. Do not use opacity on essential labels to imply disabled semantics without native disabled/aria-disabled behaviour.

## Live motion state ownership

The controller snapshots the initial reduced-motion preference once and then updates its own `reducedMotion` boolean from `MediaQueryListEvent.matches`. Animation gates, input gates and status rendering all read that one state. They no longer repeatedly evaluate the media-query getter during animation/observer work.

The previous Chromium reproduction showed updated query matches/CSS while the controller's reduce callback/status did not synchronise. The same-material A/B test isolates the event-latched state change. Native media-query changes are used in QA; the production module does not dispatch fake preference events, poll the OS or keep an idle animation loop.

Entering reduced motion removes the orientation listener, clears calibration/sensor/pointer state, cancels queued animation, restores 35deg / 38% / 16% / strength .4, marks input static/frame zero and updates the tilt button/status. Leaving reduced motion restores only permitted pointer behaviour. Sensors stay off until a fresh explicit enable action. Static selected/focus illumination remains visible without timed transitions or scaling. Low effects and no-blur paths remain readable solid surfaces.

`destroy()` is idempotent, cancels input and removes its listeners/observer. The media-query change handler has a stable identity for removal. Do not create controllers repeatedly without disposing the preceding instance. Physical orientation remains a separate hardware acceptance test; synthetic permission/events do not certify a device.

## Reuse in CSS/JavaScript and Blazor/.NET

Serve this directory locally with `python -B -m http.server 8900 --bind 127.0.0.1`, then open `http://127.0.0.1:8900/?theme=dark`. No build or CDN is required. Include `ui/liquid-glass.css`. Import `setup()` from `ui/controls.js` for this showcase, or use `LiquidLighting` directly for an application shell.

```javascript
import {LiquidLighting} from './ui/lighting.js';
const lighting = new LiquidLighting(document);
// After application-owned DOM changes, refresh if needed.
lighting.refresh();
// On shell disposal / application route teardown:
lighting.destroy();
```

Blazor consumers may call an ES-module adapter from OnAfterRenderAsync(firstRender), retain the returned controller through that adapter and dispose it from IAsyncDisposable. Keep controls' native Razor bindings, validation, keyboard semantics and authorisation. Do not run showcase form handlers over application-owned forms. This reference is not a compiled/tested Radzen or Blazor component library. It is a reusable visual/controller foundation, not a finance application, authentication provider or security certification.

Earlier screenshots and QA under `evidence/` are historical lighting.1 records. Current correction evidence and verification are under `evidence/etched.1/`. The original v1.0.0 source is the recovery reference. No commit, push, publication or deployment is included.

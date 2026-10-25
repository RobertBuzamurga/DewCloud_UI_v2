# DewCloud UI Technical Handbook

## Architecture
DewCloud UI is split into two packages:
- **master-ui** – source components, tokens and Blazor wrappers.
- **ui-suite** – demos and the path‑driven configurator.

The system ships plain Web Components that consume CSS custom properties. Optional
wrappers live under `master-ui/blazor` to surface the same components to .NET
applications.

## Tokens
Design tokens are distributed as a CSS file (`master-ui/styles/tokens.css`).
These variables define colour, radius and motion primitives consumed by every
component. Packs are referenced by path, e.g. `?pack=path:/master-ui/styles/tokens.css`.

## Effects API
Background and texture effects are generated on the fly by the configurator. The
`materials-lib` modules expose helpers that return image data URLs which are then
plugged into CSS `background-image` rules.

## Wrapper recipe
To expose a component to another framework, create a light wrapper that simply
renders the Web Component and forwards attributes/props. The Blazor wrappers in
`master-ui/blazor` can be used as a reference.

## Packaging rules
Exported packs should contain the token CSS and any derived assets (for example,
PNG or SVG previews). The configurator writes these files to
`ui-suite/configurator/out/` without touching the `master-ui` source.

## Governance notes
Changes to tokens or components should be made in `master-ui` and reviewed via
pull request. Generated artifacts under `ui-suite/configurator/out/` are treated
as build outputs and may be regenerated at any time.

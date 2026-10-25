# Liquid Glass — lighting refinement 1

24 October 2026. Version: **v1.0.0 / lighting.1**. The approved layout direction is retained; this brighter material pass is ready for owner review. Only the current isolated previews have been updated.

## Material changes

| Material / token | Before | Refined |
|---|---|---|
| Dark navy `--dc-bg` / `--dc-surface` | `#0F172A` / `#111827` | `#132139` / `#18263B` |
| Background gradient: ambient / start / end | `#0D3652` / `#061323` / `#07182B` | `#16445F` / `#0C1E32` / `#10283F`; now named `--dc-bg-ambient/start/end` |
| Dark panel `--dc-panel` | `rgba(14,35,57,.88)` | `rgba(18,44,69,.88)`; transparency unchanged |
| Control top / bottom | `rgba(78,130,176,.48)` / `rgba(14,46,76,.88)` | `rgba(90,153,203,.58)` / `rgba(19,59,93,.90)` |
| Border / hot rim / cool rim alpha | `.47` / `.94` / `.60` | `.55` / `.98` / `.72` in dark mode |
| `--dc-rim-width` / `--dc-icon-rim-width` | 1.25px / 1.6px | 1.5px / 1.9px; decorative masks only, no layout change |
| Rim resting opacity / response | `.42 + strength × .50` | `.52 + strength × .46`; default `.62 → .704` |
| Broad interior reflection: top / wash / base alpha | `.13` / `.06` / `.04` | `.17` / `.07` / `.06`; named reflection tokens |
| Top inset reflection | 1px at `.25` alpha | 2px at `.38` alpha; less dense bottom inset |
| `--dc-control-illumination` | No dedicated inner fill glow | 16px inset blue reflection at `.13` alpha |
| Hover illumination / external glow | No dedicated inner glow; 15px outer glow at `.16` | 16px inner glow at `.18`; 16px outer glow at `.23` |
| Selected controls | Existing blue fill and rim | Same fill; brighter inset and modestly stronger 16px glow |

The existing conic rim angles, cursor/sensor strength calculation, smoothing, frame cap, radii, 10px blur and motion timings are unchanged. The new illumination sits behind content; there is no spotlight disc, added parallax or content animation. No primary/teal/danger lettering, font weights or typography sizes were changed.

Light mode keeps its existing background and panel/control palette. Its new inner glow uses lower `.08` / `.12` resting/hover alpha and `.17` outer-glow alpha. Shared rim geometry is refined in both themes. Selected icon wrappers inherit their control's foreground instead of the surrounding muted caption. Light-mode pressed secondary controls use a denser pale-blue fill (`#B7D6ED → #D1E4F3`) to retain dark-ink contrast. These are material/state contrast corrections; component markup and typography hierarchy are unchanged.

The original five-colour visual-reference swatch strip remains a record of the input palette; the lifted dark shell values are explicitly documented above and in the executable token inventory. Original DewCloud core tokens remain unchanged.

## Verification and use

The matching shared material layer passed targeted Chrome checks for directional lighting, disabled states, reduced motion at page load, static/low/non-blur fallbacks and keyboard focus. Four sensor permission paths were tested synthetically. Live OS motion-preference emulation was inconsistent after pointer interaction; physical sensor and wider-browser testing remains pending. No controller or component-layout changes were made.

42 targeted rendered contrast samples across both themes passed; minimum 5.56:1. Screenshots and contrast results are in `evidence/lighting-refinement-1/`. Prior evidence is retained as the baseline, rather than relabelled as results of this pass. Source snapshots and core assets remain unchanged. No runtime dependency was added.

Serve this directory as described in README. Open `http://127.0.0.1:8892/?theme=dark&lighting=1` or `?theme=light&lighting=1`. Approval of the base direction does not imply approval to implement in production. **STOP for owner review.**

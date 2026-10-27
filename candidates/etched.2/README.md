# Candidate: etched.2 visual refinement

Status: **IN PROGRESS — reference images need visual inspection**
Base: approved **v1.0.1 / etched.1**
Branch: `candidate/etched-2-visual-refinement`

This candidate is isolated from `main`. It must not replace the approved release until the owner reviews and approves it.

## Scope

Apply the 27 October direction to the reusable DewCloud Liquid Glass reference:

- Image 1 supplies the illumination treatment.
- Image 2 supplies the button material.
- Keep the existing layout, typography, component geometry, accessibility and functional behaviour.
- Keep the resulting material reusable across DewCloud applications. Do not introduce Command Centre dashboard styling.
- Validate dark and light themes and hover, focus, selected, pressed and disabled states.

The supplied 27 October pair could not be recovered from the conversation's Library artifacts. The only image saved on that date is an unrelated SharePoint screenshot. Repository visual references are from the earlier 24 October source set and are not assumed to be the new pair. Consequently, no reference-specific hue, material, highlight shape, or intensity is asserted here.

## Established implementation baseline

The approved implementation uses neutral etched controls with foreground-first illumination, delayed interior diffusion and supporting rim light. Current timings are:

- Foreground: 85ms.
- Interior starts after 75ms and diffuses over 240ms.
- Rim starts after 150ms and brightens over 180ms.

These are baseline values, not fixed requirements. Retune only after inspecting the requested image pair. Preserve state semantics and the current independent focus indicator.

## Candidate implementation plan

1. Keep the existing DOM, classes and component dimensions.
2. Express image-derived surface, illumination, rim, edge and state values as candidate-scoped CSS custom properties.
3. Keep semantic accent handling local to controls and theme-aware.
4. Retain the current controller and native interaction behaviour unless visual testing identifies a specific regression.
5. Record timing changes in the token inventory, candidate note and QA evidence.
6. Do not copy dashboard structure, layout, labels or data into this reference.

## Review matrix

| Theme | Default | Hover | Keyboard focus | Selected/current | Pressed | Disabled |
|---|---|---|---|---|---|---|
| Dark | Pending image pair | Pending | Pending | Pending | Pending | Pending |
| Light | Pending image pair | Pending | Pending | Pending | Pending | Pending |

No visual-state validation is claimed until the candidate styles and screenshots have been produced and inspected.

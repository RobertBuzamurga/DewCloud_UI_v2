# DewCloud UI – User Guide

## What is it?
DewCloud UI provides a glass‑morphism component library and a configurator that
lets you theme those components.

## Previewing
Open `ui-suite/demo/index.html` or `ui-suite/configurator/config.html` directly
from the file system. You can supply a token pack via query string, for example:

```
config.html?pack=path:/master-ui/styles/tokens.css
```

## Exporting
Inside the configurator, tweak the flags and press **Export**. The browser will
offer a download and, when possible, also write a `theme.zip` into
`ui-suite/configurator/out/` containing the chosen `tokens.css` and a `flags.json`
summary.

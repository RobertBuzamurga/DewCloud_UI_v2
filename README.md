# DewCloud Liquid Glass UI Reference v1.0.1

Current material revision: **etched.1**, correction candidate ready for review. Read `ETCHED-GLASS-IMPLEMENTATION.md` for current material, timing and live-motion behaviour. `LIGHTING-REFINEMENT-NOTE.md` and older evidence describe the preserved preceding material.

A working, customer-independent reference candidate, interpreted from all three supplied DewCloud images and built on the preserved DewCloud-UI source. Original core tokens/components and the earlier reference remain unchanged. This new reference is awaiting owner approval.

From this directory:

```powershell
python -B -m http.server 8892 --bind 127.0.0.1
```

Open `http://127.0.0.1:8892/?theme=dark`. The header provides Dark, Light and Auto. A local HTTP server is required for modules/JSON; double-clicking the HTML is not supported. Stop with Ctrl+C. No build, package install, CDN, WebGL or framework is needed.

Try moving the pointer around the icon buttons and pill navigation. The bright arc travels around the edge while the content stays still. Compare selected/pressed/disabled states, use Tab for explicit focus, open the modal and Escape out, switch reporting periods, filter the synthetic table and advance example progress. Forms and destructive actions are local demonstrations only.

The Effects selector offers Liquid glass, Static reflections and Low effects. Reduced motion automatically removes tracking and animation. Enable tilt is optional and requires an explicit gesture; denial, missing APIs or unsupported devices leave all controls usable. No sensor value is transmitted or saved. Physical-device validation remains separate from synthetic tests.

Read **DEWCLOUD-LIQUID-GLASS-REFERENCE-SPEC.md** in this directory for tokens, component usage, lighting architecture, mobile behaviour, accessibility/fallbacks and reuse in finance or other applications. `ui/liquid-tokens.json` records versioned values; executable CSS remains the rendering source. `PROVENANCE.json` identifies the original files and all three input-image hashes. `evidence/` records reference-only visual and browser checks.

Copy this entire directory to reuse it. Its runtime imports are local; no upstream checkout or customer project is needed. Use `tools/verify_reference.py` to check its preserved inputs. Original path strings in provenance are historical records, not resource dependencies. Include `ui/liquid-glass.css`, then call `setup()` from `ui/controls.js`, or instantiate `LiquidLighting` directly and call `destroy()` when disposing an application shell.

Native semantic adapters are used instead of claiming all original Web Components work: the existing modal has a syntax error, the old switch references a missing graphic, and some shadow styles assume hosting paths. Those originals are preserved in the source checkout. The new masked-rim and lighting modules are isolated reference code, not upstream core repairs or a tested Radzen package.

No deployment, publication or repository push is authorized or performed by this example.

Current entrypoint/version is v1.0.1 / etched.1. The original v1.0.0 sibling remains the byte-preserved recovery source. Current review evidence is in `evidence/etched.1/`; no repository commit or publication has occurred.

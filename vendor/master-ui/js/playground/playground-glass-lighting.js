// js/playground-glass-lighting.js
// DewCloud — Glass Lighting & Motion helpers (PRM-aware), playground-friendly.

// ----- Reduced motion state -----
export const prefersReducedMotion =
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

let _suppressSensors   = prefersReducedMotion;
let _suppressAnimation = prefersReducedMotion;

/** Manually force reduced motion in code (mirrors PRM). */
export function setReducedMotion(enabled) {
  _suppressSensors   = !!enabled;
  _suppressAnimation = !!enabled;
}

/** Request orientation permission on iOS; resolves true if we can proceed. */
export async function enableDeviceOrientationOnce() {
  if (_suppressSensors) return false;
  try {
    if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
      const res = await DeviceOrientationEvent.requestPermission();
      return res === 'granted';
    }
    return true;
  } catch {
    return false;
  }
}

// ----- Helpers -----
function el(ref) {
  if (!ref) return null;
  if (typeof ref === 'string') {
    // Allow both "#id" or plain "id"
    return document.getElementById(ref.replace(/^#/, '')) || document.querySelector(ref);
  }
  return ref; // assume Element
}
function num(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

// ----- Highlight rotation -----
/**
 * Rotate an SVG gradient by device orientation.
 * @param {string|SVGElement} gradientRef element or id/selector
 * @param {[number,number]} center [cx, cy] rotation center (default [256,256])
 * @returns {Function} dispose() — removes listeners/raf
 */
export function bindHighlightRotation(gradientRef, center = [256, 256]) {
  if (_suppressSensors) return () => {};
  const grad = el(gradientRef);
  if (!grad) return () => {};

  let rafId = 0;
  const [cx, cy] = [num(center[0], 256), num(center[1], 256)];

  const onOrientation = (e) => {
    const beta  = e?.beta  ?? 0;
    const gamma = e?.gamma ?? 0;
    const angle = Math.atan2(gamma, beta) * 180 / Math.PI;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      grad.setAttribute('gradientTransform', `rotate(${angle} ${cx} ${cy})`);
    });
  };

  window.addEventListener('deviceorientation', onOrientation, { passive: true });

  return function dispose() {
    window.removeEventListener('deviceorientation', onOrientation);
    cancelAnimationFrame(rafId);
  };
}

// ----- Loader + glint sync -----
/**
 * Spin a loader + glint in sync.
 * @param {string|SVGElement} loaderRef element or id/selector
 * @param {string|SVGElement} glintRef element or id/selector
 * @param {number} rpm revolutions per minute (default 30)
 * @returns {Function} stop() — cancels the animation
 */
export function startLoaderSync(loaderRef, glintRef, rpm = 30) {
  if (_suppressAnimation) return () => {};
  const loader = el(loaderRef);
  const glint  = el(glintRef);
  if (!loader || !glint) return () => {};

  let a = 0;
  let last = performance.now();
  let rafId = 0;
  const cx = 256, cy = 256;
  const degPerSec = rpm * 360 / 60;

  const tick = (now) => {
    const dt = (now - last) / 1000;
    last = now;
    a = (a + degPerSec * dt) % 360;
    loader.setAttribute('transform', `rotate(${a} ${cx} ${cy})`);
    glint.setAttribute('transform',  `rotate(${a} ${cx} ${cy})`);
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);

  return function stop() {
    cancelAnimationFrame(rafId);
  };
}

/**
 * Apply a PRM class so your CSS can swap animations for static marks.
 */
export function applyReducedMotionContainer(el) {
  if (!el) return;
  if (prefersReducedMotion) el.classList.add('rm-static-loader');
}

// ----- Auto-hook: mark <body> if PRM -----
document.addEventListener('DOMContentLoaded', () => {
  if (prefersReducedMotion) document.body.classList.add('prefers-reduced-motion');
});
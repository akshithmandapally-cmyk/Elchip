/* ─── pages/auth.js — Authentication Bridge & Team ELCHIP Redirect ─────────
   The old generic gatekeeper has been removed completely.
   Any requests to auth now smoothly delegate to the Team ELCHIP Member Hub.
   ────────────────────────────────────────────────────────────────────────── */

window.renderAuth = function(container) {
  if (typeof window.renderTeam === 'function') {
    return window.renderTeam(container);
  }
  window.location.hash = '#/team';
};

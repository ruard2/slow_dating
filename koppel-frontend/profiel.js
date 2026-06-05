/**
 * profiel.js — Anoniem gebruikersprofiel opbouwen
 *
 * Genereert een UUID bij eerste bezoek (opgeslagen in localStorage).
 * Stuurt resultaten na elke voltooide sessie naar de backend.
 * Later: koppel de userId aan een account bij login.
 *
 * Gebruik:
 *   ProfielClient.init()                          ← in <body onload>
 *   ProfielClient.saveDISC(scores, primary, ...)  ← na KleurKompas
 *   ProfielClient.saveKK(topQualities, routes)    ← na Kernkwadranten
 *   ProfielClient.addThema(thema)                 ← bij vertaalmatrix herkenning
 *   ProfielClient.getReport()                     ← genereer rapport
 *   ProfielClient.getUserId()                     ← huidige anonieme ID
 */

const ProfielClient = (() => {
  const BACKEND = window.KOPPEL_BACKEND_URL || 'https://kleurkompas-backend.up.railway.app';
  const LS_KEY  = 'kk_user_id';

  let _userId = null;
  let _profile = null;

  // ── UUID generator (geen externe libs nodig) ──────────────
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    let id = localStorage.getItem(LS_KEY);
    if (!id) {
      id = generateUUID();
      localStorage.setItem(LS_KEY, id);
    }
    _userId = id;

    // Haal profiel op van backend (stil, geen blokkering)
    fetch(`${BACKEND}/api/profile/${_userId}`, {
      headers: { 'x-user-id': _userId }
    })
    .then(r => r.ok ? r.json() : null)
    .then(p => { if (p) _profile = p; })
    .catch(() => {}); // stil falen als backend offline is

    return _userId;
  }

  // ── Private helper ────────────────────────────────────────
  async function post(endpoint, body) {
    if (!_userId) return null;
    try {
      const res = await fetch(`${BACKEND}${endpoint}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': _userId },
        body:    JSON.stringify({ userId: _userId, ...body }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.profile) _profile = data.profile;
      return data;
    } catch (e) {
      // Backend offline? Geen probleem — app werkt door
      return null;
    }
  }

  // ── DISC sessie opslaan ───────────────────────────────────
  // scores: {R, G, Gr, B}
  // primary, secondary, feelingColor, stressColor: kleurcode string
  function saveDISC({ scores, primary, secondary, feelingColor, stressColor }) {
    return post('/api/profile/disc', { scores, primary, secondary, feelingColor, stressColor });
  }

  // ── Kernkwadranten sessie opslaan ─────────────────────────
  // topQualities: [{id, name, score}]
  // routesCompleted: number
  function saveKernkwadranten({ topQualities, routesCompleted }) {
    return post('/api/profile/kernkwadranten', { topQualities, routesCompleted });
  }

  // ── Thema herkenning (vertaalmatrix, groeikaarten) ────────
  function addThema(thema) {
    return post('/api/profile/thema', { thema });
  }

  // ── Rapport ophalen ───────────────────────────────────────
  async function getReport() {
    if (!_userId) return null;
    try {
      const res = await fetch(`${BACKEND}/api/profile/${_userId}/report`, {
        headers: { 'x-user-id': _userId }
      });
      return res.ok ? res.json() : null;
    } catch (e) { return null; }
  }

  // ── Lokaal profiel tonen ──────────────────────────────────
  function getLocal() { return _profile; }
  function getUserId() { return _userId; }

  // ── Profiel-samenvatting in de UI tonen ───────────────────
  // Optioneel: toon een klein profiel-icoontje rechtsbovenin
  function showProfileBadge() {
    if (!_profile || !_profile.disc || !_profile.disc.primary) return;

    const colors = { R: '#e53935', G: '#f9a825', Gr: '#43a047', B: '#1e88e5' };
    const hex = colors[_profile.disc.primary] || '#888';
    const sessions = _profile.totalSessions || 0;

    // Verwijder oude badge
    const old = document.getElementById('profiel-badge');
    if (old) old.remove();

    const badge = document.createElement('div');
    badge.id = 'profiel-badge';
    badge.title = `Jouw profiel: ${sessions} sessie${sessions !== 1 ? 's' : ''} • Tik voor details`;
    badge.style.cssText = `
      position: fixed; top: 12px; right: 12px; z-index: 8888;
      width: 32px; height: 32px; border-radius: 50%;
      background: ${hex}; border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      cursor: pointer; display: flex; align-items: center;
      justify-content: center; font-size: 0.65rem;
      font-weight: 700; color: white;
    `;
    badge.textContent = sessions > 9 ? '9+' : String(sessions);
    badge.onclick = showProfileModal;
    document.body.appendChild(badge);
  }

  // ── Profiel-modal ─────────────────────────────────────────
  function showProfileModal() {
    const p = _profile;
    if (!p) return;

    const colorNames = { R: 'Rood', G: 'Geel', Gr: 'Groen', B: 'Blauw' };
    const colorHex   = { R: '#e53935', G: '#f9a825', Gr: '#43a047', B: '#1e88e5' };

    const old = document.getElementById('profiel-modal');
    if (old) { old.remove(); return; } // toggle

    const topQ = (p.kernkwadranten?.topQualities || []).slice(0, 3).map(q => q.name || q.id).join(', ') || '—';
    const insights = (p.insights || []).slice(0, 3);

    const disc = p.disc || {};
    const primary   = disc.primary   ? `<span style="background:${colorHex[disc.primary]};color:white;padding:2px 8px;border-radius:4px;font-weight:700;">${colorNames[disc.primary]}</span>` : '—';
    const secondary = disc.secondary ? `<span style="background:${colorHex[disc.secondary]}22;color:${colorHex[disc.secondary]};padding:2px 8px;border-radius:4px;font-weight:600;">${colorNames[disc.secondary]}</span>` : '—';

    const modal = document.createElement('div');
    modal.id = 'profiel-modal';
    modal.style.cssText = `
      position: fixed; top: 52px; right: 12px; z-index: 9000;
      background: white; border-radius: 16px; padding: 18px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18); max-width: 280px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 0.83rem; color: #333;
    `;
    modal.innerHTML = `
      <div style="font-weight:700; font-size:0.95rem; margin-bottom:12px;">
        &#128100; Jouw profiel
      </div>
      <div style="margin-bottom:8px;">
        <span style="color:#888;font-size:0.75rem;">DISC</span><br>
        ${primary} ${secondary}
      </div>
      ${disc.feelingColor ? `
      <div style="margin-bottom:8px;">
        <span style="color:#888;font-size:0.75rem;">Diepere behoefte</span><br>
        ${colorNames[disc.feelingColor] || '—'}
      </div>` : ''}
      <div style="margin-bottom:8px;">
        <span style="color:#888;font-size:0.75rem;">Kernkwaliteiten</span><br>
        ${topQ}
      </div>
      ${insights.length ? `
      <div style="margin-bottom:10px;">
        <span style="color:#888;font-size:0.75rem;">Inzichten</span>
        ${insights.map(i => `<div style="margin-top:4px;padding:6px 8px;background:#f5f5f5;border-radius:6px;font-size:0.78rem;">${i}</div>`).join('')}
      </div>` : ''}
      <div style="font-size:0.7rem;color:#bbb;margin-top:8px;">
        ${p.totalSessions} sessie${p.totalSessions !== 1 ? 's' : ''} • profiel bouwt op
      </div>
      <button onclick="document.getElementById('profiel-modal').remove()"
        style="margin-top:10px;width:100%;padding:7px;border:none;border-radius:8px;
               background:#f0f0f0;cursor:pointer;font-size:0.82rem;">
        Sluiten
      </button>
    `;

    // Sluit bij klik buiten modal
    setTimeout(() => {
      document.addEventListener('click', function closer(e) {
        if (!modal.contains(e.target) && e.target.id !== 'profiel-badge') {
          modal.remove();
          document.removeEventListener('click', closer);
        }
      });
    }, 100);

    document.body.appendChild(modal);
  }

  return {
    init,
    saveDISC,
    saveKernkwadranten,
    addThema,
    getReport,
    getLocal,
    getUserId,
    showProfileBadge,
    showProfileModal,
  };
})();

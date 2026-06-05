const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const cors   = require('cors');
const fs     = require('fs');
const path   = require('path');
const profileStore = require('./profiles');

// Load persisted profiles on startup
profileStore.loadProfiles();

// Load content data (cases, domains, patterns)
function loadContentData(filename) {
  try {
    const fp = path.join(__dirname, 'data', filename);
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch (e) {
    console.warn(`[content] Could not load ${filename}:`, e.message);
    return null;
  }
}
const CONTENT = {
  cases:    loadContentData('cases.json'),
  domains:  loadContentData('domains.json'),
  patterns: loadContentData('patterns.json'),
};

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';
const ADMIN_KEY    = process.env.ADMIN_KEY    || 'change-me-in-production';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// ── Session store ──────────────────────────────────────────
// sessions: Map<code, Session>
// Session: {
//   code, app,
//   players: { '1': socketId, '2': socketId },
//   state:   { p1: {...}, p2: {...} },
//   createdAt
// }
const sessions = new Map();

function generateCode() {
  // 6 chars, easy to type, no ambiguous chars (0/O, 1/I/L)
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function getOrCreate(code) {
  return sessions.get(code);
}

// ── REST health ────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ ok: true }));

app.get('/api/session/:code', (req, res) => {
  const s = sessions.get(req.params.code.toUpperCase());
  if (!s) return res.status(404).json({ error: 'Sessie niet gevonden' });
  res.json({ code: s.code, app: s.app, playerCount: Object.keys(s.players).length });
});

// ── Socket.io ──────────────────────────────────────────────
io.on('connection', (socket) => {

  // ── CREATE SESSION ────────────────────────────────────────
  socket.on('create_session', ({ app: appName }) => {
    // generate unique code
    let code;
    let tries = 0;
    do {
      code = generateCode();
      tries++;
    } while (sessions.has(code) && tries < 20);

    const session = {
      code,
      app: appName || 'kleurkompas',
      players: { '1': socket.id },
      state: { p1: null, p2: null },
      createdAt: Date.now()
    };
    sessions.set(code, session);

    // Auto-expire after 24 hours
    setTimeout(() => sessions.delete(code), 24 * 60 * 60 * 1000);

    socket.join(code);
    socket.data.code = code;
    socket.data.player = '1';

    socket.emit('session_created', { code, player: '1', app: appName });
    console.log(`[+] Session ${code} created by ${socket.id}`);
  });

  // ── JOIN SESSION ──────────────────────────────────────────
  socket.on('join_session', ({ code: rawCode }) => {
    const code = (rawCode || '').toUpperCase().trim();
    const session = sessions.get(code);

    if (!session) {
      return socket.emit('session_error', { message: 'Code niet gevonden. Controleer en probeer opnieuw.' });
    }

    const takenSlots = Object.keys(session.players).length;
    if (takenSlots >= 2) {
      // Allow reconnect if same socket already in session
      const existingPlayer = Object.entries(session.players).find(([, sid]) => sid === socket.id);
      if (!existingPlayer) {
        return socket.emit('session_error', { message: 'Deze sessie is al vol (2 spelers).' });
      }
    }

    // Assign player slot
    const player = session.players['1'] && session.players['1'] !== socket.id ? '2' : '1';
    session.players[player] = socket.id;

    socket.join(code);
    socket.data.code = code;
    socket.data.player = player;

    socket.emit('session_joined', {
      code,
      player,
      app: session.app,
      state: session.state
    });

    // Notify all in room
    const count = Object.keys(session.players).length;
    io.to(code).emit('player_count', { count });

    if (count === 2) {
      io.to(code).emit('both_connected', { code });
      console.log(`[=] Session ${code}: both players connected`);
    }

    console.log(`[+] Player ${player} joined session ${code}`);
  });

  // ── UPDATE STATE ──────────────────────────────────────────
  // Called when a player finishes their part (scores, primary color, etc.)
  socket.on('player_done', ({ code: rawCode, player, data }) => {
    const code = (rawCode || '').toUpperCase().trim();
    const session = sessions.get(code);
    if (!session) return;

    const key = player === '1' ? 'p1' : 'p2';
    session.state[key] = { ...data, done: true };

    // Broadcast update to all in room
    io.to(code).emit('session_update', { state: session.state });

    // Check if both done
    if (session.state.p1?.done && session.state.p2?.done) {
      io.to(code).emit('session_complete', { state: session.state });
      console.log(`[v] Session ${code}: both players done`);
    }
  });

  // ── PARTIAL UPDATE (e.g. progress, current scenario) ─────
  socket.on('player_progress', ({ code: rawCode, player, progress }) => {
    const code = (rawCode || '').toUpperCase().trim();
    const session = sessions.get(code);
    if (!session) return;

    // Broadcast progress to partner only (not self)
    socket.to(code).emit('partner_progress', { player, progress });
  });

  // ── RESET SESSION ─────────────────────────────────────────
  socket.on('reset_session', ({ code: rawCode }) => {
    const code = (rawCode || '').toUpperCase().trim();
    const session = sessions.get(code);
    if (!session) return;

    session.state = { p1: null, p2: null };
    io.to(code).emit('session_reset', {});
    console.log(`[~] Session ${code} reset`);
  });

  // ── DISCONNECT ────────────────────────────────────────────
  socket.on('disconnect', () => {
    const code = socket.data.code;
    const player = socket.data.player;
    if (!code) return;

    const session = sessions.get(code);
    if (!session) return;

    // Don't immediately remove player — allow reconnect within 30s
    setTimeout(() => {
      const s = sessions.get(code);
      if (!s) return;
      // If socket hasn't reconnected
      if (s.players[player] === socket.id) {
        delete s.players[player];
        io.to(code).emit('player_count', { count: Object.keys(s.players).length });
        io.to(code).emit('partner_disconnected', { player });
        console.log(`[-] Player ${player} disconnected from ${code}`);
      }
    }, 30000);
  });
});

// ══════════════════════════════════════════════════════════
// PROFILE API
// ══════════════════════════════════════════════════════════

// Middleware: elke profile-request vereist een userId header of param
function requireUserId(req, res, next) {
  const userId = req.params.userId || req.body.userId || req.headers['x-user-id'];
  if (!userId || userId.length < 8) {
    return res.status(400).json({ error: 'Geen geldig userId opgegeven.' });
  }
  req.userId = userId;
  next();
}

// GET /api/profile/:userId — profiel ophalen (of aanmaken)
app.get('/api/profile/:userId', requireUserId, (req, res) => {
  const p = profileStore.getOrCreate(req.userId);
  res.json(p);
});

// POST /api/profile/disc — DISC-sessie opslaan
app.post('/api/profile/disc', requireUserId, (req, res) => {
  const { scores, primary, secondary, feelingColor, stressColor } = req.body;
  if (!scores) return res.status(400).json({ error: 'scores ontbreekt' });

  const p = profileStore.updateDisc(req.userId, { scores, primary, secondary, feelingColor, stressColor });
  res.json({ ok: true, profile: sanitize(p) });
});

// POST /api/profile/kernkwadranten — kernkwadranten-sessie opslaan
app.post('/api/profile/kernkwadranten', requireUserId, (req, res) => {
  const { topQualities, routesCompleted } = req.body;
  const p = profileStore.updateKernkwadranten(req.userId, { topQualities, routesCompleted });
  res.json({ ok: true, profile: sanitize(p) });
});

// POST /api/profile/waarden — waarden-sessie opslaan
app.post('/api/profile/waarden', requireUserId, (req, res) => {
  const { gekozenZelf, bevestigdVanPartner, modus } = req.body;
  const p = profileStore.updateWaarden(req.userId, { gekozenZelf, bevestigdVanPartner, modus });
  res.json({ ok: true, profile: sanitize(p) });
});

// POST /api/profile/thema — herkend thema toevoegen
app.post('/api/profile/thema', requireUserId, (req, res) => {
  const { thema } = req.body;
  if (!thema) return res.status(400).json({ error: 'thema ontbreekt' });
  const p = profileStore.addRecognizedThema(req.userId, thema);
  res.json({ ok: true, recognizedThemas: p.recognizedThemas });
});

// GET /api/profile/:userId/report — genereer rapport
app.get('/api/profile/:userId/report', requireUserId, (req, res) => {
  const report = profileStore.generateReport(req.userId);
  if (!report) return res.status(404).json({ error: 'Profiel niet gevonden' });
  res.json(report);
});

// POST /api/profile/:userId/link-account — koppel later een accountId (bij login)
app.post('/api/profile/:userId/link-account', requireUserId, (req, res) => {
  const { accountId } = req.body;
  if (!accountId) return res.status(400).json({ error: 'accountId ontbreekt' });
  const p = profileStore.getOrCreate(req.userId);
  p.accountId = accountId;
  profileStore.saveProfiles();
  res.json({ ok: true });
});

// ══════════════════════════════════════════════════════════
// CONTENT API  (cases, domains, patterns)
// Publiek — geen auth nodig, alleen lezen
// ══════════════════════════════════════════════════════════

// GET /api/content/domains — alle 15 domeinen
app.get('/api/content/domains', (req, res) => {
  if (!CONTENT.domains) return res.status(503).json({ error: 'Content niet beschikbaar' });
  res.json(CONTENT.domains);
});

// GET /api/content/patterns — alle patronen
app.get('/api/content/patterns', (req, res) => {
  if (!CONTENT.patterns) return res.status(503).json({ error: 'Content niet beschikbaar' });
  res.json(CONTENT.patterns);
});

// GET /api/content/cases — cases ophalen
// Query params: ?domain=D1&type=tension&mode=couple&limit=10
app.get('/api/content/cases', (req, res) => {
  if (!CONTENT.cases) return res.status(503).json({ error: 'Content niet beschikbaar' });

  let cases = CONTENT.cases.cases || [];

  // Filters
  if (req.query.domain) {
    cases = cases.filter(c => c.domain && c.domain.domain_id === req.query.domain.toUpperCase());
  }
  if (req.query.type) {
    cases = cases.filter(c => c.case_type === req.query.type);
  }
  if (req.query.mode) {
    cases = cases.filter(c => Array.isArray(c.mode) && c.mode.includes(req.query.mode));
  }
  if (req.query.intensity) {
    cases = cases.filter(c => c.intensity === req.query.intensity);
  }

  // Shuffle optioneel (voor willekeurige volgorde in app)
  if (req.query.shuffle === '1') {
    for (let i = cases.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cases[i], cases[j]] = [cases[j], cases[i]];
    }
  }

  const limit = parseInt(req.query.limit) || cases.length;
  const page  = parseInt(req.query.page)  || 0;

  res.json({
    total: cases.length,
    count: Math.min(limit, cases.length - page * limit),
    cases: cases.slice(page * limit, page * limit + limit),
  });
});

// GET /api/content/cases/:caseId — één specifieke case
app.get('/api/content/cases/:caseId', (req, res) => {
  if (!CONTENT.cases) return res.status(503).json({ error: 'Content niet beschikbaar' });
  const found = (CONTENT.cases.cases || []).find(c => c.case_id === req.params.caseId);
  if (!found) return res.status(404).json({ error: 'Case niet gevonden' });
  res.json(found);
});

// ══════════════════════════════════════════════════════════
// TAG SCORING API
// ══════════════════════════════════════════════════════════

// POST /api/profile/tags — schrijf antwoord-tags na een gespeelde ronde
// Body: { caseId, domain, caseType, tags, modus, koppelCode }
app.post('/api/profile/tags', requireUserId, (req, res) => {
  const { caseId, domain, caseType, tags, modus, koppelCode } = req.body;
  if (!caseId || !tags) return res.status(400).json({ error: 'caseId en tags zijn verplicht' });

  const p = profileStore.updateTags(req.userId, { caseId, domain, caseType, tags, modus, koppelCode });
  res.json({ ok: true, profile: sanitize(p) });
});

// GET /api/relatiekaart — relatiekaart voor een koppel
// Query: ?partnerUserId=xxx
app.get('/api/relatiekaart', requireUserId, (req, res) => {
  const { partnerUserId } = req.query;
  if (!partnerUserId) return res.status(400).json({ error: 'partnerUserId is verplicht' });

  const kaart = profileStore.buildRelatiekaart(req.userId, partnerUserId);
  if (!kaart) return res.status(404).json({ error: 'Een of beide profielen niet gevonden' });
  res.json(kaart);
});

// ── Admin endpoints (beveiligd met ADMIN_KEY) ──────────────
function adminAuth(req, res, next) {
  const key = req.headers['x-admin-key'] || req.query.key;
  if (key !== ADMIN_KEY) return res.status(403).json({ error: 'Verboden' });
  next();
}

// GET /admin/profiles — alle profielen (voor data-export / monetisering)
app.get('/admin/profiles', adminAuth, (req, res) => {
  const all = [];
  profileStore.profiles.forEach((p) => all.push(p));
  res.json({ count: all.length, profiles: all });
});

// GET /admin/profiles/export — CSV-export van kerndata
app.get('/admin/profiles/export', adminAuth, (req, res) => {
  const rows = ['userId,createdAt,sessions,primaryColor,secondaryColor,feelingColor,stressColor,directness,expressiveness,steadiness,precision,topQuality1,topQuality2,topQuality3,insights'];
  profileStore.profiles.forEach((p) => {
    const d  = p.disc;
    const kk = p.kernkwadranten;
    const t  = p.traits;
    const tq = kk.topQualities.slice(0, 3).map(q => q.name || q.id).join('\t');
    rows.push([
      p.userId, p.createdAt, p.totalSessions,
      d.primary, d.secondary, d.feelingColor, d.stressColor,
      t.directness, t.expressiveness, t.steadiness, t.precision,
      ...(kk.topQualities.slice(0, 3).map(q => q.name || q.id)),
      p.insights.length,
    ].join(','));
  });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="profiles.csv"');
  res.send(rows.join('\n'));
});

// ── Helper: veilige subset van profiel voor frontend ──────
// Verwijdert ruwe sessie-data; stuurt alleen samenvatting
function sanitize(p) {
  return {
    userId:        p.userId,
    totalSessions: p.totalSessions,
    rondeCount:    (p.rondes || []).length,
    disc: {
      primary:      p.disc.primary,
      secondary:    p.disc.secondary,
      feelingColor: p.disc.feelingColor,
      stressColor:  p.disc.stressColor,
      confidence:   p.disc.confidence,
      sessionCount: p.disc.sessions.length,
    },
    kernkwadranten: {
      topQualities:    p.kernkwadranten.topQualities.slice(0, 5),
      sessionCount:    p.kernkwadranten.sessions.length,
      routesCompleted: p.kernkwadranten.routesCompleted,
    },
    waarden: p.waarden ? {
      topZelf:      (p.waarden.topZelf || []).slice(0, 5),
      topOntvangen: (p.waarden.topOntvangen || []).slice(0, 5),
      sessionCount: (p.waarden.sessions || []).length,
    } : null,
    // Nieuwe tag-gebaseerde profiel-data
    topBehoeften:        (p.topBehoeften        || []).slice(0, 5),
    topBeschermingen:    (p.topBeschermingen    || []).slice(0, 5),
    topGevoeligePlekken: (p.topGevoeligePlekken || []).slice(0, 3),
    topPatronen:         (p.topPatronen         || []).slice(0, 3),
    topSkills:           (p.topSkills           || []).slice(0, 3),
    sterkeDomainen:      p.sterkeDomainen  || [],
    groeiDomainen:       p.groeiDomainen   || [],
    traits:              p.traits,
    patterns:            p.patterns,
    recognizedThemas:    p.recognizedThemas,
    insights:            p.insights,
  };
}

// ── Start server ───────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Kleurkompas backend running on port ${PORT}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
});

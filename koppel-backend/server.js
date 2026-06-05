const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const cors   = require('cors');
const profileStore = require('./profiles');

// Load persisted profiles on startup
profileStore.loadProfiles();

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

// ── Helper: verwijder sessie-details voor frontend (stuur alleen samenvatting) ──
function sanitize(p) {
  return {
    userId:        p.userId,
    totalSessions: p.totalSessions,
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
    traits:           p.traits,
    patterns:         p.patterns,
    recognizedThemas: p.recognizedThemas,
    insights:         p.insights,
    waarden: p.waarden ? {
      topZelf:        (p.waarden.topZelf || []).slice(0, 5),
      topOntvangen:   (p.waarden.topOntvangen || []).slice(0, 5),
      sessionCount:   (p.waarden.sessions || []).length,
    } : null,
  };
}

// ── Start server ───────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Kleurkompas backend running on port ${PORT}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
});

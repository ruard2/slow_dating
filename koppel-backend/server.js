const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const cors   = require('cors');
const fs     = require('fs');
const path   = require('path');
const profileStore = require('./profiles');

// Load persisted profiles on startup
profileStore.loadProfiles();

// ── Calling-state store ──────────────────────────────���─────────
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const CALLING_FILE = path.join(__dirname, 'data', 'calling_states.json');
const callingStates = new Map();

function loadCallingStates() {
  try {
    const data = JSON.parse(fs.readFileSync(CALLING_FILE, 'utf8'));
    Object.entries(data).forEach(([code, st]) => callingStates.set(code, st));
    console.log(`[calling] Loaded ${callingStates.size} states`);
  } catch(e) {}
}
function saveCallingStates() {
  try {
    const obj = {}; callingStates.forEach((st, code) => { obj[code] = st; });
    fs.writeFileSync(CALLING_FILE, JSON.stringify(obj), 'utf8');
  } catch(e) { console.warn('[calling] save error:', e.message); }
}
function getCS(code) {
  if (!callingStates.has(code)) callingStates.set(code, {
    code, sharedSeconds: 0, connectedBothSince: null,
    messages: { p1: 0, p2: 0 }, boardsCompleted: 0,
    callUnlocked: false, asker: null,
    consent: { p1: null, p2: null },
    cooldownUntil: null, cooldownAsker: null,
    createdAt: Date.now()
  });
  // migrate old boolean field
  const cs = callingStates.get(code);
  if (typeof cs.boardCompleted !== 'undefined') { cs.boardsCompleted = cs.boardCompleted ? 1 : 0; delete cs.boardCompleted; }
  if (typeof cs.boardsCompleted === 'undefined') cs.boardsCompleted = 0;
  return cs;
}
function effectiveSecs(cs) {
  const bonus = cs.connectedBothSince ? Math.floor((Date.now() - cs.connectedBothSince) / 1000) : 0;
  return cs.sharedSeconds + bonus;
}
function condMet(cs) {
  return effectiveSecs(cs) >= 1800 &&
         (cs.messages.p1 || 0) >= 10 && (cs.messages.p2 || 0) >= 10 &&
         (cs.boardsCompleted || 0) >= 5;
}
function buildCSPayload(cs, forPlayer) {
  return {
    sharedSeconds:   effectiveSecs(cs),
    messages:        cs.messages,
    boardsCompleted: cs.boardsCompleted || 0,
    callUnlocked:    cs.callUnlocked,
    consent:        cs.consent,
    asker:          cs.asker,
    conditionsMet:  condMet(cs),
    cooldownUntil:  cs.cooldownUntil,
    showCooldown:   cs.cooldownAsker === forPlayer && !!cs.cooldownUntil && cs.cooldownUntil > Date.now(),
  };
}
function emitCS(commCode) {
  const cs = callingStates.get(commCode);
  const session = sessions.get(commCode);
  if (!cs || !session) return;
  Object.entries(session.players).forEach(([player, socketId]) => {
    const sock = io.sockets.sockets.get(socketId);
    if (sock) sock.emit('call_state_update', buildCSPayload(cs, player));
  });
}
// ── Couple progress store ─────────────────────────────────────
const PROGRESS_FILE = path.join(__dirname, 'data', 'couple_progress.json');
const coupleProgress = new Map();

function loadCoupleProgress() {
  try {
    const data = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    Object.entries(data).forEach(([code, p]) => coupleProgress.set(code, p));
    console.log(`[progress] Loaded ${coupleProgress.size} couples`);
  } catch(e) {}
}
function saveCoupleProgress() {
  try {
    const obj = {}; coupleProgress.forEach((p, code) => { obj[code] = p; });
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(obj), 'utf8');
  } catch(e) { console.warn('[progress] save error:', e.message); }
}
function getCP(commCode) {
  if (!coupleProgress.has(commCode)) coupleProgress.set(commCode, {
    commCode, games: {}, totalGamesCompleted: 0,
    cardsUnlocked: [1], createdAt: Date.now()
  });
  return coupleProgress.get(commCode);
}
function recordGameComplete(commCode, boardName, durationSecs) {
  const cp = getCP(commCode);
  if (!cp.games[boardName]) {
    cp.games[boardName] = { completedAt: Date.now(), durationSecs, plays: 1 };
    cp.totalGamesCompleted++;
  } else {
    cp.games[boardName].plays = (cp.games[boardName].plays || 1) + 1;
    cp.games[boardName].lastPlayedAt = Date.now();
  }
  saveCoupleProgress();
}
loadCoupleProgress();

// ── Tick active timers every 30s
setInterval(() => {
  callingStates.forEach((cs, code) => {
    if (cs.connectedBothSince) emitCS(code);
  });
  saveCallingStates();
}, 30000);
loadCallingStates();

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

// Serveer frontend statische bestanden
// __dirname = koppel-backend/, ../koppel-frontend = koppel-frontend/
const FRONTEND_DIR = path.join(__dirname, '../koppel-frontend');
app.use(express.static(FRONTEND_DIR));
app.get('/', (_, res) => res.sendFile(path.join(FRONTEND_DIR, 'world.html')));

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

// GET /api/progress/:commCode — koppelvoortgang + unlock status
app.get('/api/progress/:commCode', (req, res) => {
  const code = (req.params.commCode || '').toUpperCase().trim();
  const cp = coupleProgress.get(code) || { games: {}, totalGamesCompleted: 0, cardsUnlocked: [1] };
  const cs = callingStates.get(code);
  res.json({
    gamesCompleted:  cp.totalGamesCompleted || 0,
    games:           cp.games || {},
    cardsUnlocked:   cp.cardsUnlocked || [1],
    boardsCompleted: cs ? (cs.boardsCompleted || 0) : 0,
  });
});

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

  // ── JOIN OR CREATE (vaste koppelcode, bijv. globale sessie) ─
  socket.on('join_or_create', ({ app: appName, code: rawCode }) => {
    const code = (rawCode || '').toUpperCase().trim();
    if (!code) return socket.emit('session_error', { message: 'Geen code opgegeven.' });

    if (sessions.has(code)) {
      const session = sessions.get(code);

      // Check if this socket is already in the session
      const existingEntry = Object.entries(session.players).find(([, sid]) => sid === socket.id);
      if (existingEntry) {
        // Already in session — just re-join room and confirm
        socket.join(code); socket.data.code = code; socket.data.player = existingEntry[0];
        socket.emit('session_joined', { code, player: existingEntry[0], app: session.app, state: session.state });
        return;
      }

      // Find a free or disconnected slot
      let assignedPlayer = null;
      for (const p of ['1', '2']) {
        if (!session.players[p]) {
          assignedPlayer = p; break; // empty slot
        }
        // Check if existing socket is disconnected
        const existingSock = io.sockets.sockets.get(session.players[p]);
        if (!existingSock || !existingSock.connected) {
          assignedPlayer = p; break; // take over disconnected slot
        }
      }

      if (!assignedPlayer) {
        return socket.emit('session_error', { message: 'Sessie is al vol.' });
      }

      session.players[assignedPlayer] = socket.id;
      socket.join(code); socket.data.code = code; socket.data.player = assignedPlayer;
      socket.emit('session_joined', { code, player: assignedPlayer, app: session.app, state: session.state });
      const count = Object.values(session.players).filter(sid => {
        const s = io.sockets.sockets.get(sid); return s && s.connected;
      }).length;
      io.to(code).emit('player_count', { count });
      if (count === 2) {
        io.to(code).emit('both_connected', { code });
        if (code.includes('.')) session.startedBothAt = session.startedBothAt || Date.now();
        if (!code.includes('.')) {
          const cs = getCS(code);
          if (!cs.connectedBothSince) { cs.connectedBothSince = Date.now(); saveCallingStates(); }
          emitCS(code);
        }
      } else if (!code.includes('.')) {
        const cs = getCS(code);
        socket.emit('call_state_update', buildCSPayload(cs, assignedPlayer));
      }
      console.log(`[+] Player ${assignedPlayer} joined (join_or_create) ${code}`);
    } else {
      const session = { code, app: appName || 'global', players: { '1': socket.id }, state: { p1: null, p2: null }, createdAt: Date.now() };
      sessions.set(code, session);
      setTimeout(() => sessions.delete(code), 24 * 60 * 60 * 1000);
      socket.join(code); socket.data.code = code; socket.data.player = '1';
      socket.emit('session_created', { code, player: '1', app: appName });
      if (!code.includes('.')) {
        const cs = getCS(code);
        socket.emit('call_state_update', buildCSPayload(cs, '1'));
      }
      console.log(`[+] Session ${code} created (join_or_create) by ${socket.id}`);
    }
  });

  // ── JOIN SESSION ──────────────────────────────────────────
  socket.on('join_session', ({ code: rawCode }) => {
    const code = (rawCode || '').toUpperCase().trim();
    const session = sessions.get(code);

    if (!session) {
      // Auto-recreate session — comm_code exists in localStorage but backend restarted
      sessions.set(code, { app: 'global', players: {}, state: {} });
      console.log(`[+] Session ${code} auto-recreated (join_session, backend restart recovery)`);
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
      if (code.includes('.')) session.startedBothAt = session.startedBothAt || Date.now();
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
      // Track board completion for calling unlock + couple progress
      if (code.includes('.')) {
        const commCode  = code.split('.')[0];
        const boardName = code.split('.')[1] || 'unknown';
        const durationSecs = session.startedBothAt
          ? Math.floor((Date.now() - session.startedBothAt) / 1000) : 0;
        // Calling state: count unique boards
        const cs = getCS(commCode);
        if (!cs.completedBoards) cs.completedBoards = [];
        if (!cs.completedBoards.includes(boardName)) {
          cs.completedBoards.push(boardName);
          cs.boardsCompleted = cs.completedBoards.length;
          saveCallingStates(); emitCS(commCode);
        }
        // Couple progress
        recordGameComplete(commCode, boardName, durationSecs);
      }
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

  // ── JOIN COMM ROOM (for receiving game_invite events) ────
  socket.on('join_comm', ({ code: rawCode }) => {
    const code = (rawCode || '').toUpperCase().trim();
    if (!code) return;
    socket.join(code);
    console.log(`[join_comm] ${socket.id} joined room ${code}`);
  });

  // ── ANNOUNCE GAME (tell partner you opened a game) ────────
  // No session check — just relay to all others in the room
  socket.on('announce_game', ({ code: rawCode, gameKey, gameName }) => {
    const code = (rawCode || '').toUpperCase().trim();
    if (!code || !gameKey) return;
    console.log(`[announce_game] ${gameKey} -> room ${code}`);
    socket.to(code).emit('game_invite', { gameKey, gameName });
  });

  // ── CHAT MESSAGE (relay to whole room) ───────────────────
  socket.on('chat_message', ({ code: rawCode, player, text, ts }) => {
    const code = (rawCode || '').toUpperCase().trim();
    const session = sessions.get(code);
    if (!session) return;
    // __GAME__ invites: only send to partner (not back to sender)
    if (typeof text === 'string' && text.startsWith('__GAME__:')) {
      socket.to(code).emit('chat_message', { player, text, ts: ts || Date.now() });
      return;
    }
    io.to(code).emit('chat_message', { player, text, ts: ts || Date.now() });
    // Count messages in global comm sessions for calling unlock
    if (!code.includes('.') && player) {
      const cs = getCS(code);
      const key = player === '1' ? 'p1' : 'p2';
      cs.messages[key] = (cs.messages[key] || 0) + 1;
      saveCallingStates();
      emitCS(code);
    }
  });

  // ── TYPING INDICATOR (relay to partner) ──────────────────
  socket.on('typing', ({ code: rawCode }) => {
    const code = (rawCode || '').toUpperCase().trim();
    socket.to(code).emit('typing');
  });

  // ── WEBRTC SIGNALING (relay to partner) ──────────────────
  socket.on('webrtc_offer', ({ code: rawCode, offer }) => {
    const code = (rawCode || '').toUpperCase().trim();
    socket.to(code).emit('webrtc_offer', { offer });
  });
  socket.on('webrtc_answer', ({ code: rawCode, answer }) => {
    const code = (rawCode || '').toUpperCase().trim();
    socket.to(code).emit('webrtc_answer', { answer });
  });
  socket.on('webrtc_ice', ({ code: rawCode, candidate }) => {
    const code = (rawCode || '').toUpperCase().trim();
    socket.to(code).emit('webrtc_ice', { candidate });
  });

  // ── DISCONNECT ────────────────────────────────────────────
  // ── CALLING UNLOCK EVENTS ─────────────────────────────────

  socket.on('call_unlock_ask', ({ code: rawCode }) => {
    const code = (rawCode || '').toUpperCase().trim();
    const cs = callingStates.get(code); if (!cs || !condMet(cs)) return;
    if (cs.cooldownUntil && cs.cooldownUntil > Date.now()) return;
    if (cs.callUnlocked || cs.asker) return; // already in progress
    const player = socket.data.player;
    cs.asker = player;
    const key = player === '1' ? 'p1' : 'p2';
    cs.consent[key] = 'yes';
    saveCallingStates(); emitCS(code);
  });

  socket.on('call_unlock_answer', ({ code: rawCode, answer, reason }) => {
    const code = (rawCode || '').toUpperCase().trim();
    const cs = callingStates.get(code); if (!cs || !cs.asker) return;
    const player = socket.data.player;
    const key = player === '1' ? 'p1' : 'p2';
    cs.consent[key] = answer;
    if (answer === 'yes' && cs.consent.p1 === 'yes' && cs.consent.p2 === 'yes') {
      cs.callUnlocked = true; cs.asker = null;
      cs.cooldownUntil = null; cs.cooldownAsker = null;
      saveCallingStates(); emitCS(code);
      io.to(code).emit('call_unlocked_celebration');
    } else if (answer === 'no') {
      const askerPlayer = cs.asker;
      cs.consent = { p1: null, p2: null }; cs.asker = null;
      cs.cooldownUntil = Date.now() + 30 * 60 * 1000;
      cs.cooldownAsker = askerPlayer;
      if (reason && reason.trim())
        io.to(code).emit('chat_message', { player, text: reason.trim(), ts: Date.now() });
      saveCallingStates(); emitCS(code);
    }
  });

  socket.on('call_withdraw_no', ({ code: rawCode }) => {
    const code = (rawCode || '').toUpperCase().trim();
    const cs = callingStates.get(code); if (!cs) return;
    cs.consent = { p1: null, p2: null }; cs.asker = null;
    cs.cooldownUntil = null; cs.cooldownAsker = null;
    saveCallingStates(); emitCS(code);
  });

  socket.on('call_relock', ({ code: rawCode }) => {
    const code = (rawCode || '').toUpperCase().trim();
    const cs = callingStates.get(code); if (!cs) return;
    cs.callUnlocked = false; cs.consent = { p1: null, p2: null }; cs.asker = null;
    saveCallingStates(); emitCS(code);
  });

  // ── DISCONNECT ────────────────────────────────────────────
  socket.on('disconnect', () => {
    const code = socket.data.code;
    const player = socket.data.player;
    if (!code) return;
    // Pause calling timer
    if (!code.includes('.') && callingStates.has(code)) {
      const cs = callingStates.get(code);
      if (cs.connectedBothSince) {
        cs.sharedSeconds += Math.floor((Date.now() - cs.connectedBothSince) / 1000);
        cs.connectedBothSince = null;
        saveCallingStates();
      }
    }

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

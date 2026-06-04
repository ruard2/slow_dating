const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

const app = express();
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Serve static frontend locally (not used on Railway — Netlify handles this)
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static(path.join(__dirname, '../frontend')));
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: FRONTEND_URL, methods: ['GET', 'POST'] },
  maxHttpBufferSize: 15e6,
});

const LADDERS = { 3:19, 18:37, 35:54, 45:66, 53:72 };
const SNAKES  = { 32:12, 41:23, 58:38, 69:48, 77:63 };
const POWER_SWITCH = new Set([10,20,30,40,50,60,70]);
const MYSTERY_SQ   = new Set([17,36,51,64,74]);

function createGame(roomId) {
  return {
    roomId, players: {},
    positions: [0,0], clothing: [5,5],
    currentTurn: 0, phase: 'waiting',
    winner: null, powerSwitch: null,
    diceValue: null, lastRolls: [],
    fantasyEntries: [], setupData: {},
    squareVisits: {},
    moveLog: [],
  };
}

function rollDice() { return Math.floor(Math.random()*6)+1; }

function processMove(game, playerIdx, dice) {
  const prevRolls = game.lastRolls;
  const isDouble = prevRolls.length > 0 && prevRolls[prevRolls.length-1].player === playerIdx
    && prevRolls[prevRolls.length-1].dice === dice;
  game.lastRolls = [...prevRolls.slice(-4), { player: playerIdx, dice }];

  let pos = game.positions[playerIdx] + dice;
  const log = { player: playerIdx, dice, from: game.positions[playerIdx] };

  if (pos > 80) pos = 80 - (pos - 80);

  let ladder = null, snake = null;
  if (LADDERS[pos] !== undefined) {
    ladder = { from: pos, to: LADDERS[pos] };
    pos = LADDERS[pos];
    game.clothing[playerIdx] = Math.max(0, game.clothing[playerIdx] - 1);
  } else if (SNAKES[pos] !== undefined) {
    snake = { from: pos, to: SNAKES[pos] };
    pos = SNAKES[pos];
    game.clothing[playerIdx] = Math.min(5, game.clothing[playerIdx] + 1);
  }

  game.positions[playerIdx] = pos;
  game.diceValue = dice;
  log.to = pos; log.ladder = ladder; log.snake = snake;
  game.moveLog.push(log);
  // Track how many times this square has been visited
  game.squareVisits[pos] = (game.squareVisits[pos] || 0) + 1;

  if (POWER_SWITCH.has(pos)) game.powerSwitch = { activePlayer: playerIdx, turnsLeft: 3 };
  if (pos === 80) { game.winner = playerIdx; game.phase = 'finished'; }
  else game.phase = MYSTERY_SQ.has(pos) ? 'mystery' : 'action';

  return { log, ladder, snake, isDouble, isMystery: MYSTERY_SQ.has(pos) };
}

function advanceTurn(game) {
  if (game.powerSwitch) {
    game.powerSwitch.turnsLeft--;
    if (game.powerSwitch.turnsLeft <= 0) game.powerSwitch = null;
  }
  game.currentTurn = game.currentTurn === 0 ? 1 : 0;
  game.phase = 'playing';
  game.diceValue = null;
}

function getActive(game) {
  return game.powerSwitch ? game.powerSwitch.activePlayer : game.currentTurn;
}

function sanitize(game) {
  const playerNames = Object.values(game.players).reduce((a,p)=>{ a[p.number]=p.name; return a; },{});
  return {
    roomId: game.roomId, playerNames,
    positions: game.positions, clothing: game.clothing,
    currentTurn: game.currentTurn, phase: game.phase,
    winner: game.winner, powerSwitch: game.powerSwitch,
    diceValue: game.diceValue, fantasyText: game.fantasyText,
    setupData: game.setupData, playerCount: Object.keys(game.players).length,
  };
}

const rooms = {}, socketToRoom = {};

io.on('connection', socket => {
  socket.on('create_room', ({ playerName }) => {
    const roomId = uuidv4().slice(0,6).toUpperCase();
    const game = createGame(roomId);
    game.players[socket.id] = { name: playerName, number: 0 };
    rooms[roomId] = game; socketToRoom[socket.id] = roomId;
    socket.join(roomId);
    socket.emit('room_created', { roomId, playerNumber: 0, game: sanitize(game) });
  });

  socket.on('join_room', ({ roomId, playerName }) => {
    const game = rooms[roomId];
    if (!game) { socket.emit('error', { message: 'Kamer niet gevonden.' }); return; }
    if (Object.keys(game.players).length >= 2) { socket.emit('error', { message: 'Kamer is vol.' }); return; }
    game.players[socket.id] = { name: playerName, number: 1 };
    socketToRoom[socket.id] = roomId;
    socket.join(roomId);
    game.phase = 'setup';
    socket.emit('room_joined', { roomId, playerNumber: 1, game: sanitize(game) });
    io.to(roomId).emit('enter_setup', { game: sanitize(game) });
  });

  socket.on('player_setup', ({ intensity, word }) => {
    const roomId = socketToRoom[socket.id];
    const game = rooms[roomId]; if (!game) return;
    const n = game.players[socket.id]?.number;
    game.setupData[n] = { intensity, word };
    io.to(roomId).emit('setup_update', { setupData: game.setupData });
    if (Object.keys(game.setupData).length === 2) {
      game.phase = 'playing';
      io.to(roomId).emit('game_start', { game: sanitize(game) });
    }
  });

  socket.on('roll_dice', () => {
    const roomId = socketToRoom[socket.id];
    const game = rooms[roomId];
    if (!game || game.phase !== 'playing') return;
    const pn = game.players[socket.id]?.number;
    if (pn !== getActive(game)) return;
    const dice = rollDice();
    const result = processMove(game, pn, dice);
    io.to(roomId).emit('move_result', {
      diceValue: dice, playerNumber: pn,
      positions: game.positions, clothing: game.clothing,
      result, phase: game.phase,
      pendingSquare: game.positions[pn],
      winner: game.winner, powerSwitch: game.powerSwitch,
      currentTurn: game.currentTurn,
      visitCount: game.squareVisits[game.positions[pn]] || 1,
    });
  });

  socket.on('action_done', () => {
    const roomId = socketToRoom[socket.id];
    const game = rooms[roomId];
    if (!game || !['action','mystery'].includes(game.phase)) return;
    advanceTurn(game);
    io.to(roomId).emit('turn_advanced', { phase: game.phase, currentTurn: game.currentTurn, powerSwitch: game.powerSwitch, clothing: game.clothing });
  });

  socket.on('skip_action', () => {
    const roomId = socketToRoom[socket.id];
    const game = rooms[roomId];
    if (!game || game.phase !== 'action') return;
    const pn = game.players[socket.id]?.number;
    if (pn !== getActive(game)) return;
    game.clothing[pn] = Math.min(5, game.clothing[pn] + 1);
    advanceTurn(game);
    io.to(roomId).emit('turn_advanced', { phase: game.phase, currentTurn: game.currentTurn, powerSwitch: game.powerSwitch, clothing: game.clothing });
  });

  socket.on('replay_payment_board', () => {
    const roomId = socketToRoom[socket.id];
    const game = rooms[roomId]; if (!game) return;
    const pn = game.players[socket.id]?.number; if (pn === undefined) return;
    game.positions[pn] = Math.max(1, (game.positions[pn]||1) - 3);
    io.to(roomId).emit('position_update', { positions: game.positions, clothing: game.clothing });
  });

  // Fantasy notebook — append een entry met speler-kleur
  socket.on('fantasy_append', ({ text }) => {
    const roomId = socketToRoom[socket.id];
    const game = rooms[roomId]; if (!game) return;
    const pn = game.players[socket.id]?.number;
    const name = game.players[socket.id]?.name || '?';
    const entry = { playerNum: pn, playerName: name, text, id: Date.now() };
    game.fantasyEntries.push(entry);
    io.to(roomId).emit('fantasy_entries', { entries: game.fantasyEntries });
  });

  socket.on('timer_sync', data => {
    const roomId = socketToRoom[socket.id];
    if (roomId) socket.to(roomId).emit('timer_sync', data);
  });

  socket.on('media_reaction', ({ reaction }) => {
    const roomId = socketToRoom[socket.id];
    const game = rooms[roomId]; if (!game) return;
    const player = game.players[socket.id];
    socket.to(roomId).emit('media_reaction', { reaction, from: player?.name });
  });

  socket.on('typing_indicator', () => {
    const roomId = socketToRoom[socket.id];
    if (roomId) socket.to(roomId).emit('typing_indicator');
  });

  socket.on('chat_message', msg => {
    const roomId = socketToRoom[socket.id];
    const game = rooms[roomId]; if (!game) return;
    const player = game.players[socket.id];
    socket.to(roomId).emit('chat_message', { ...msg, sender: player?.name||'?', timestamp: Date.now() });
  });

  socket.on('disconnect', () => {
    const roomId = socketToRoom[socket.id];
    if (roomId && rooms[roomId]) {
      delete rooms[roomId].players[socket.id];
      io.to(roomId).emit('player_disconnected', { message: 'Je partner heeft de verbinding verbroken.' });
      if (!Object.keys(rooms[roomId].players).length) delete rooms[roomId];
    }
    delete socketToRoom[socket.id];
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

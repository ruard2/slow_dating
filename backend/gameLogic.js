const LADDERS = { 3: 19, 18: 37, 35: 54, 45: 66, 53: 72 };
const SNAKES  = { 32: 12, 41: 23, 58: 38, 69: 48, 77: 63 };
const POWER_SWITCH_SQUARES = new Set([10, 20, 30, 40, 50, 60, 70]);

function createGame(roomId) {
  return {
    roomId,
    players: {},           // socketId → { name, number }
    positions: [0, 0],     // [player1, player2], 0 = not on board yet
    clothing: [5, 5],      // clothing items per player
    currentTurn: 0,        // 0 or 1
    phase: 'waiting',      // waiting | playing | action | finished
    winner: null,
    pendingAction: null,   // { square, content } currently being resolved
    powerSwitch: null,     // null | { activePlayer, turnsLeft }
    diceValue: null,
    moveLog: [],
  };
}

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function processMove(game, playerIndex, diceValue) {
  let pos = game.positions[playerIndex] + diceValue;

  const log = { player: playerIndex, dice: diceValue, from: game.positions[playerIndex] };

  if (pos > 80) {
    // bounce back
    pos = 80 - (pos - 80);
  }

  let ladder = null;
  let snake = null;

  if (LADDERS[pos] !== undefined) {
    ladder = { from: pos, to: LADDERS[pos] };
    pos = LADDERS[pos];
    // Ladder: take off clothing
    game.clothing[playerIndex] = Math.max(0, game.clothing[playerIndex] - 1);
  } else if (SNAKES[pos] !== undefined) {
    snake = { from: pos, to: SNAKES[pos] };
    pos = SNAKES[pos];
    // Snake: put clothing back on
    game.clothing[playerIndex] = Math.min(5, game.clothing[playerIndex] + 1);
  }

  game.positions[playerIndex] = pos;
  log.to = pos;
  log.ladder = ladder;
  log.snake = snake;
  game.moveLog.push(log);
  game.diceValue = diceValue;

  // Check power switch
  if (POWER_SWITCH_SQUARES.has(pos)) {
    game.powerSwitch = { activePlayer: playerIndex, turnsLeft: 3 };
  }

  // Check winner
  if (pos === 80) {
    game.winner = playerIndex;
    game.phase = 'finished';
    return { log, isPowerSwitch: false };
  }

  game.phase = 'action';
  return { log, ladder, snake, isPowerSwitch: POWER_SWITCH_SQUARES.has(pos) };
}

function advanceTurn(game) {
  // Decrement power switch
  if (game.powerSwitch) {
    game.powerSwitch.turnsLeft--;
    if (game.powerSwitch.turnsLeft <= 0) {
      game.powerSwitch = null;
    }
  }

  game.currentTurn = game.currentTurn === 0 ? 1 : 0;
  game.phase = 'playing';
  game.pendingAction = null;
  game.diceValue = null;
}

function getActivePlayer(game) {
  if (game.powerSwitch) {
    return game.powerSwitch.activePlayer;
  }
  return game.currentTurn;
}

module.exports = { createGame, rollDice, processMove, advanceTurn, getActivePlayer, LADDERS, SNAKES, POWER_SWITCH_SQUARES };

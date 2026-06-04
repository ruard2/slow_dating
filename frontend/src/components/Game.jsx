import { useState } from 'react';
import { EVENT_CARDS } from '../data/eventCards.js';
import Board from './Board.jsx';
import Dice from './Dice.jsx';
import ActionCard from './ActionCard.jsx';
import ClothingTracker from './ClothingTracker.jsx';
import EventCardOverlay from './EventCardOverlay.jsx';
import WinnerScreen from './WinnerScreen.jsx';
import ChatBar from './ChatBar.jsx';

export default function Game({
  game,
  myPlayerNumber,
  myName,
  onRollDice,
  onActionDone,
  onDrawEventCard,
  onSendChat,
  chatMessages,
  rolling,
  lastMove,
}) {
  const [eventCardIndex, setEventCardIndex] = useState(null);

  const { positions, clothing, currentTurn, phase, winner, powerSwitch, playerNames, diceValue } = game;

  const myPos = positions[myPlayerNumber];
  const opponentNumber = myPlayerNumber === 0 ? 1 : 0;
  const opponentName = playerNames[opponentNumber] || 'Partner';
  const isMyTurn = currentTurn === myPlayerNumber;

  const activePlayer = powerSwitch ? powerSwitch.activePlayer : currentTurn;
  const isMyActivePlayer = activePlayer === myPlayerNumber;
  const activePlayerName = playerNames[activePlayer] || '?';

  const canRoll = phase === 'playing' && isMyActivePlayer && !rolling;
  const pendingSquare = phase === 'action' ? positions[activePlayer] : null;

  function handleDrawEvent() {
    const idx = Math.floor(Math.random() * EVENT_CARDS.length);
    setEventCardIndex(idx);
    if (onDrawEventCard) onDrawEventCard();
  }

  if (winner !== null) {
    return (
      <WinnerScreen
        winnerName={playerNames[winner]}
        myName={myName}
        isWinner={winner === myPlayerNumber}
        onPlayAgain={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-night flex flex-col" style={{ maxWidth: '480px', margin: '0 auto' }}>
      {/* Header */}
      <div className="glass border-b border-rose/20 px-4 py-3 flex items-center justify-between">
        <div>
          <span className="font-display text-gold font-semibold text-sm">🐍 Slangen & Ladders</span>
          {powerSwitch && (
            <div className="text-xs text-yellow-400 mt-0.5">
              ⚡ {playerNames[powerSwitch.activePlayer]} is baas ({powerSwitch.turnsLeft} beurten)
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">
            {isMyActivePlayer
              ? <span className="text-blush font-semibold">Jouw beurt ✨</span>
              : <span className="text-gray-400">{activePlayerName} is aan de beurt</span>}
          </div>
        </div>
      </div>

      {/* Clothing trackers */}
      <div className="px-3 pt-3 grid grid-cols-2 gap-2">
        <ClothingTracker
          count={clothing[myPlayerNumber]}
          playerName={`${myName} (jij)`}
          isMe={true}
        />
        <ClothingTracker
          count={clothing[opponentNumber]}
          playerName={opponentName}
          isMe={false}
        />
      </div>

      {/* Board */}
      <div className="px-3 pt-3">
        <Board
          positions={positions}
          highlightedSquare={pendingSquare}
        />
      </div>

      {/* Move result notification */}
      {lastMove && (
        <div className="mx-3 mt-2 px-3 py-2 rounded-xl text-sm text-center animate-slide-up"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {lastMove.ladder && (
            <span className="text-orange-400">
              🪜 Ladder! {lastMove.ladder.from} → {lastMove.ladder.to} (+1 kledingstuk uit)
            </span>
          )}
          {lastMove.snake && (
            <span className="text-red-400">
              🐍 Slang! {lastMove.snake.from} → {lastMove.snake.to} (+1 kledingstuk aan)
            </span>
          )}
          {!lastMove.ladder && !lastMove.snake && diceValue && (
            <span className="text-gray-400">
              🎲 {playerNames[lastMove.player]} gooide <strong className="text-white">{diceValue}</strong>
            </span>
          )}
        </div>
      )}

      {/* Dice + Action area */}
      <div className="px-3 pt-3 pb-20 space-y-3">
        {/* Dice */}
        {phase === 'playing' && (
          <div className="glass rounded-2xl p-4 flex flex-col items-center">
            <p className="text-sm text-gray-400 mb-3">
              {canRoll ? 'Gooi de dobbelsteen!' : `Wacht op ${activePlayerName}...`}
            </p>
            <Dice
              value={diceValue}
              rolling={rolling}
              onRoll={onRollDice}
              disabled={!canRoll}
            />
          </div>
        )}

        {/* Action card */}
        {phase === 'action' && pendingSquare && (
          <ActionCard
            squareNumber={pendingSquare}
            isMyTurn={isMyActivePlayer}
            onDone={onActionDone}
            playerName={activePlayerName}
            powerSwitch={powerSwitch}
            clothingCount={clothing[activePlayer]}
          />
        )}

        {/* Event card button */}
        <button
          onClick={handleDrawEvent}
          className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #150a2a, #1a0a2e)',
            border: '1px solid rgba(107,33,168,0.4)',
            color: '#c084fc',
          }}
        >
          🃏 Trek een Mystery Event Kaart
        </button>

        {/* Positions info */}
        <div className="glass rounded-xl p-3 grid grid-cols-2 gap-2 text-center text-sm">
          <div>
            <div className="text-blush font-semibold">{myName}</div>
            <div className="text-white font-bold text-lg">Vak {myPos || '-'}</div>
          </div>
          <div>
            <div className="text-purple-400 font-semibold">{opponentName}</div>
            <div className="text-white font-bold text-lg">Vak {positions[opponentNumber] || '-'}</div>
          </div>
        </div>
      </div>

      {/* Event card overlay */}
      <EventCardOverlay
        cardIndex={eventCardIndex}
        onClose={() => setEventCardIndex(null)}
      />

      {/* Chat */}
      <ChatBar messages={chatMessages} onSend={onSendChat} myName={myName} />
    </div>
  );
}

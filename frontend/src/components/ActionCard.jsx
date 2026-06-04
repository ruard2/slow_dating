import { useState, useEffect, useRef } from 'react';
import { SQUARES, SQUARE_COLORS } from '../data/boardData.js';

const TYPE_ICONS = {
  blue:   '💙',
  red:    '🔥',
  purple: '💜',
  green:  '💚',
  orange: '🟠',
  snake:  '🐍',
  gold:   '🏆',
};

function EdgeSession({ duration, onDone }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [active, setActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const containerRef = useRef(null);

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `${sec}s`;
  }

  async function startSession() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      if (containerRef.current?.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      }
      setActive(true);
    } catch {
      // permission denied — still start timer without camera
      setActive(true);
    }
  }

  function stopSession() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }

  useEffect(() => {
    if (!active) return;
    if (timeLeft <= 0) {
      stopSession();
      onDone();
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [active, timeLeft]);

  useEffect(() => {
    return () => stopSession();
  }, []);

  if (!active) {
    return (
      <button
        onClick={startSession}
        className="w-full mt-4 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #6b21a8, #c084fc40)' }}
      >
        📷 Start edging sessie
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: '#0a0015' }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      <div className="relative z-10 flex flex-col items-center gap-6 p-8">
        <div
          className="text-8xl font-bold tabular-nums"
          style={{ color: timeLeft <= 10 ? '#f87171' : '#c084fc', textShadow: '0 0 30px currentColor' }}
        >
          {formatTime(timeLeft)}
        </div>
        <p className="text-white text-lg font-medium text-center" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
          💜 Edging sessie bezig...
        </p>
        <button
          onClick={() => { stopSession(); onDone(); }}
          className="px-6 py-2 rounded-xl text-sm text-gray-300 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          Stoppen
        </button>
      </div>
    </div>
  );
}

export default function ActionCard({ squareNumber, isMyTurn, onDone, playerName, powerSwitch, clothingCount = 1 }) {
  if (!squareNumber) return null;
  const square = SQUARES[squareNumber];
  if (!square) return null;

  const colors = SQUARE_COLORS[square.type];
  const icon = TYPE_ICONS[square.type];
  const isSnakeOrLadder = square.type === 'snake' || square.type === 'orange';
  const isEdging = square.type === 'purple' && square.duration;
  const isHotZone = squareNumber >= 60 && (square.type === 'red' || square.type === 'purple');
  const fullyUndressed = clothingCount <= 0;

  return (
    <div
      className="rounded-2xl p-5 animate-slide-up"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 0 20px ${colors.border}40`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: colors.text }}>
          {colors.label} — Vak {squareNumber}
        </span>
        {square.powerSwitch && (
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: '#d4af3720', color: '#d4af37', border: '1px solid #d4af3740' }}>
            ⚡ Power Switch
          </span>
        )}
      </div>

      {/* Action text */}
      <p className="text-white text-base leading-relaxed font-display">
        {square.text}
      </p>

      {/* Power switch info */}
      {square.powerSwitch && (
        <div className="mt-3 p-2 rounded-lg text-xs"
          style={{ background: '#d4af3715', color: '#d4af37', border: '1px solid #d4af3730' }}>
          ⚡ <strong>{playerName}</strong> is nu 3 beurten lang de baas!
        </div>
      )}

      {/* Hot zone banner */}
      {isHotZone && !isSnakeOrLadder && (
        <div
          className="mt-3 p-3 rounded-xl text-sm font-medium"
          style={{
            background: 'linear-gradient(135deg, #3b0000, #1f0a0a)',
            border: '1px solid #ef444460',
            color: '#fca5a5',
          }}
        >
          {fullyUndressed ? (
            <>
              🔥 <strong>Rode Zone</strong> — Je bent al volledig uit.{' '}
              {isMyTurn
                ? 'De ander geeft je nu 30 seconden instructies via chat of camera. Voer ze uit. 😈'
                : <span>Geef <strong>{playerName}</strong> 30 seconden instructies via chat of camera. 👑</span>}
            </>
          ) : (
            <>
              🔥 <strong>Rode Zone</strong> — Trek ook 1 kledingstuk extra uit{' '}
              {isMyTurn ? 'voordat je begint.' : `(${playerName} moet dit doen).`}
            </>
          )}
        </div>
      )}

      {/* Edging session (camera + mic + fullscreen + timer) */}
      {isEdging && isMyTurn && (
        <EdgeSession duration={square.duration} onDone={onDone} />
      )}

      {/* Confirm button for non-edging purple squares */}
      {isMyTurn && !isSnakeOrLadder && !isEdging && (
        <button
          onClick={onDone}
          className="w-full mt-4 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-98"
          style={{ background: `linear-gradient(135deg, ${colors.border}, ${colors.text}40)` }}
        >
          ✓ Opdracht voltooid
        </button>
      )}

      {isSnakeOrLadder && isMyTurn && (
        <button
          onClick={onDone}
          className="w-full mt-4 py-3 rounded-xl font-semibold text-white transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          Doorgaan →
        </button>
      )}

      {!isMyTurn && !isSnakeOrLadder && (
        <p className="mt-3 text-center text-gray-400 text-sm italic">
          Wacht terwijl {playerName} de opdracht uitvoert...
        </p>
      )}
    </div>
  );
}

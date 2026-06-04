import { useState } from 'react';

const FACES = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
};

export default function Dice({ value, rolling, onRoll, disabled }) {
  const displayValue = value || 1;
  const dots = FACES[displayValue] || FACES[1];

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`
          relative w-16 h-16 rounded-xl cursor-pointer select-none
          transition-transform duration-100 active:scale-95
          ${rolling ? 'animate-dice-spin' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 glow-rose'}
        `}
        style={{
          background: 'linear-gradient(135deg, #1a0a2e, #2d0a1f)',
          border: '2px solid #8b1a4a',
          boxShadow: disabled ? 'none' : '0 0 20px rgba(139,26,74,0.4)',
        }}
        onClick={disabled ? undefined : onRoll}
      >
        {dots.map(([x, y], i) => (
          <div
            key={i}
            className="absolute w-2.5 h-2.5 rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, #d4af37, #f0d060)',
              boxShadow: '0 0 6px rgba(212,175,55,0.6)',
            }}
          />
        ))}
      </div>

      {!disabled && (
        <button
          onClick={onRoll}
          disabled={disabled || rolling}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40"
          style={{
            background: 'linear-gradient(135deg, #8b1a4a, #c45a8a)',
            color: 'white',
          }}
        >
          {rolling ? 'Gooien...' : '🎲 Gooi!'}
        </button>
      )}
    </div>
  );
}

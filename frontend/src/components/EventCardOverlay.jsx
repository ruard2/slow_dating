import { EVENT_CARDS } from '../data/eventCards.js';

export default function EventCardOverlay({ cardIndex, onClose }) {
  if (cardIndex === null || cardIndex === undefined) return null;
  const card = EVENT_CARDS[cardIndex];
  if (!card) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 text-center animate-slide-up"
        style={{
          background: 'linear-gradient(135deg, #150a2a, #2d0a1f)',
          border: '1px solid #6b21a8',
          boxShadow: '0 0 40px rgba(107,33,168,0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-4">{card.emoji}</div>
        <div className="text-xs uppercase tracking-widest mb-2 font-medium" style={{
          color: card.type === 'samen' ? '#4ade80' : card.type === 'roleplay' ? '#f9a8d4' : card.type === 'spel' ? '#fbbf24' : '#c084fc'
        }}>
          {card.type === 'samen' ? '👫 Samen' : card.type === 'roleplay' ? '🎭 Roleplay' : card.type === 'spel' ? '🎲 Spel' : '🃏 Mystery Kaart'}
        </div>
        <h2 className="font-display text-2xl text-white font-bold mb-4">{card.title}</h2>
        <p className="text-gray-300 leading-relaxed text-sm mb-6">{card.description}</p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #6b21a8, #9333ea)' }}
        >
          Begrepen ✓
        </button>
      </div>
    </div>
  );
}

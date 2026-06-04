export default function WinnerScreen({ winnerName, myName, isWinner, onPlayAgain }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(12px)' }}
    >
      <div className="text-center max-w-sm w-full animate-slide-up space-y-6">
        <div className="text-7xl animate-bounce">{isWinner ? '🏆' : '💜'}</div>

        <div>
          <h1 className="font-display text-4xl font-bold text-gradient-gold mb-2">
            {isWinner ? 'Jij wint!' : `${winnerName} wint!`}
          </h1>
          <p className="text-gray-300 text-lg">
            {isWinner
              ? 'Je hebt vak 80 bereikt! 🎉'
              : `${winnerName} heeft vak 80 bereikt!`}
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, #1f1a05, #2d1a05)',
            border: '1px solid #d4af37',
            boxShadow: '0 0 30px rgba(212,175,55,0.3)',
          }}
        >
          <div className="text-3xl mb-3">🎬</div>
          <p className="text-gold font-display text-lg font-semibold mb-2">
            Speciale Beloning
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {isWinner
              ? 'Jij mag nu het speciale filmpje vragen van je partner. Vraag het via de chat of persoonlijk!'
              : `Je mag ${winnerName} om het speciale filmpje vragen als jij dat wil. Het is helemaal aan jou.`}
          </p>
        </div>

        <button
          onClick={onPlayAgain}
          className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #8b1a4a, #c45a8a)' }}
        >
          Opnieuw Spelen 🔄
        </button>
      </div>
    </div>
  );
}

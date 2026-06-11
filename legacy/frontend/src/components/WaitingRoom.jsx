export default function WaitingRoom({ roomId, playerName }) {
  function copyCode() {
    navigator.clipboard.writeText(roomId).catch(() => {});
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-night">
      <div className="glass rounded-2xl p-8 max-w-sm w-full text-center space-y-6">
        <div className="text-4xl animate-pulse">⏳</div>
        <div>
          <h2 className="font-display text-2xl text-gold mb-1">Kamer aangemaakt!</h2>
          <p className="text-gray-400 text-sm">Wacht op je partner...</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Deel deze code</p>
          <button
            onClick={copyCode}
            className="w-full py-4 rounded-xl font-mono text-3xl tracking-widest font-bold text-gold border border-gold/40 hover:border-gold hover:bg-gold/5 transition-all duration-200 animate-pulse-glow"
          >
            {roomId}
          </button>
          <p className="text-xs text-gray-500 mt-2">Klik om te kopiëren</p>
        </div>

        <div className="border-t border-white/10 pt-4">
          <p className="text-gray-300 text-sm">
            Hoi <span className="text-blush font-semibold">{playerName}</span> 👋
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Het spel start zodra je partner de code invoert
          </p>
        </div>
      </div>
    </div>
  );
}

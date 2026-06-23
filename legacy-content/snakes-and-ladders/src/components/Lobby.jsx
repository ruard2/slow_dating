import { useState } from 'react';

export default function Lobby({ onCreateRoom, onJoinRoom, error }) {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [tab, setTab] = useState('create'); // 'create' | 'join'

  function handleCreate(e) {
    e.preventDefault();
    if (name.trim()) onCreateRoom(name.trim());
  }

  function handleJoin(e) {
    e.preventDefault();
    if (name.trim() && roomCode.trim()) onJoinRoom(name.trim(), roomCode.trim().toUpperCase());
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-night relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #8b1a4a, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #6b21a8, transparent)' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🐍🪜</div>
          <h1 className="font-display text-4xl font-bold text-gradient-gold mb-2">
            Slangen & Ladders
          </h1>
          <p className="text-rose font-display italic text-lg">voor jou & mij</p>
        </div>

        {/* Tab switcher */}
        <div className="glass rounded-2xl p-1 flex mb-6">
          <button
            onClick={() => setTab('create')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 ${
              tab === 'create'
                ? 'bg-rose text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Nieuwe Kamer
          </button>
          <button
            onClick={() => setTab('join')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 ${
              tab === 'join'
                ? 'bg-rose text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Kamer Joinen
          </button>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-6">
          {tab === 'create' ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Jouw naam</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Bijv. Sophie..."
                  maxLength={20}
                  className="w-full px-4 py-3 rounded-xl bg-velvet border border-rose/30 text-white placeholder-gray-500 focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #8b1a4a, #c45a8a)' }}
              >
                Kamer Aanmaken ✨
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Jouw naam</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Bijv. Lena..."
                  maxLength={20}
                  className="w-full px-4 py-3 rounded-xl bg-velvet border border-rose/30 text-white placeholder-gray-500 focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Kamercodes</label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Bijv. A1B2C3"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-velvet border border-rose/30 text-white placeholder-gray-500 focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose transition-colors font-mono text-lg tracking-widest text-center"
                />
              </div>
              <button
                type="submit"
                disabled={!name.trim() || roomCode.length < 6}
                className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #6b21a8, #9333ea)' }}
              >
                Joinen 💜
              </button>
            </form>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-900/30 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 glass rounded-2xl p-4">
          <p className="text-xs text-gray-400 text-center mb-3 font-medium uppercase tracking-wider">Kleurlegenda</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { color: '#60a5fa', label: 'Blauw = Waarheid' },
              { color: '#f87171', label: 'Rood = Durven' },
              { color: '#c084fc', label: 'Paars = Edging' },
              { color: '#4ade80', label: 'Groen = Kleding' },
              { color: '#fb923c', label: 'Oranje = Ladder ↑' },
              { color: '#fbbf24', label: 'Goud = Finish' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-gray-300">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';

export default function ChatBar({ messages, onSend, myName }) {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (messages.length > 0) {
      setUnread((n) => n + 1);
    }
  }, [messages.length]);

  function handleSend(e) {
    e.preventDefault();
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => { setOpen((o) => !o); setUnread(0); }}
        className="fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'linear-gradient(135deg, #8b1a4a, #c45a8a)' }}
      >
        💬
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-night text-xs font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-20 right-4 z-40 w-72 rounded-2xl overflow-hidden"
          style={{ background: '#1a0a2e', border: '1px solid rgba(139,26,74,0.4)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
        >
          <div className="p-3 border-b border-rose/20 flex justify-between items-center">
            <span className="font-medium text-sm text-blush">Chat 💋</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white text-xs">✕</button>
          </div>
          <div className="h-48 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => {
              const isMe = m.sender === myName;
              return (
                <div key={i} className="text-sm">
                  <span className="font-semibold" style={{ color: isMe ? '#f9a8d4' : '#c084fc' }}>{m.sender}: </span>
                  <span className="text-gray-300">{m.text}</span>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
          <form onSubmit={handleSend} className="p-3 border-t border-rose/20 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Schrijf iets..."
              className="flex-1 px-3 py-2 rounded-xl bg-night border border-rose/20 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-rose"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl text-white text-sm"
              style={{ background: '#8b1a4a' }}
            >
              ↑
            </button>
          </form>
        </div>
      )}
    </>
  );
}

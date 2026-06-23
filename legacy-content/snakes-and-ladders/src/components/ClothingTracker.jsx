const CLOTHING_ITEMS = ['👔', '👗', '🩱', '🩲', '🧦'];

export default function ClothingTracker({ count, playerName, isMe }) {
  const items = CLOTHING_ITEMS.slice(0, 5);

  return (
    <div
      className={`glass rounded-xl p-3 text-center ${isMe ? 'border border-blush/30' : ''}`}
    >
      <p className="text-xs text-gray-400 mb-1.5 truncate">{playerName}</p>
      <div className="flex justify-center gap-1 flex-wrap">
        {items.map((item, i) => (
          <span
            key={i}
            className="text-lg transition-all duration-300"
            style={{ opacity: i < count ? 1 : 0.15, filter: i < count ? 'none' : 'grayscale(100%)' }}
          >
            {item}
          </span>
        ))}
      </div>
      <p className="text-xs mt-1" style={{ color: count === 0 ? '#c084fc' : '#9ca3af' }}>
        {count === 0 ? '✨ Naakt' : `${count} kledingstuk${count !== 1 ? 'ken' : ''}`}
      </p>
    </div>
  );
}

import { SQUARES, SQUARE_COLORS, POWER_SWITCH_SQUARES, buildBoardGrid } from '../data/boardData.js';

const boardImage = '/src/assets/board.png';

const GRID = buildBoardGrid();

// ─── Tune these values if tokens are slightly off-center on the squares ───
// The board image has a decorative frame + legend strip at the bottom.
// Percentages are relative to the full image size.
const GRID_OFFSET = {
  top:    3.8,   // % from top of image to top of first row
  left:   3.8,   // % from left of image to left of first column
  right:  3.8,   // % from right of image to right of last column
  bottom: 10.5,  // % from bottom of image to bottom of last row (includes legend)
};
// ─────────────────────────────────────────────────────────────────────────

function getTokenPos(squareNum) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 10; col++) {
      if (GRID[row][col] === squareNum) {
        const usableWidth  = 100 - GRID_OFFSET.left - GRID_OFFSET.right;
        const usableHeight = 100 - GRID_OFFSET.top  - GRID_OFFSET.bottom;
        const cellW = usableWidth  / 10;
        const cellH = usableHeight / 8;
        const x = GRID_OFFSET.left + col * cellW + cellW / 2;
        const y = GRID_OFFSET.top  + row * cellH + cellH / 2;
        return { x, y };
      }
    }
  }
  return null;
}

export default function Board({ positions, highlightedSquare }) {
  return (
    <div className="relative w-full select-none" style={{ userSelect: 'none' }}>
      {/* ── Board image ── */}
      <img
        src={boardImage}
        alt="Slangen & Ladders bord"
        className="w-full rounded-xl"
        style={{ display: 'block', imageRendering: 'crisp-edges' }}
        draggable={false}
      />

      {/* ── Highlight overlay for active square ── */}
      {highlightedSquare && (() => {
        const pos = getTokenPos(highlightedSquare);
        const square = SQUARES[highlightedSquare];
        const colors = square ? SQUARE_COLORS[square.type] : SQUARE_COLORS.blue;
        if (!pos) return null;
        const usableWidth  = 100 - GRID_OFFSET.left - GRID_OFFSET.right;
        const usableHeight = 100 - GRID_OFFSET.top  - GRID_OFFSET.bottom;
        const cellW = usableWidth  / 10;
        const cellH = usableHeight / 8;
        return (
          <div
            className="absolute pointer-events-none rounded-md animate-pulse"
            style={{
              left:   `${pos.x - cellW / 2}%`,
              top:    `${pos.y - cellH / 2}%`,
              width:  `${cellW}%`,
              height: `${cellH}%`,
              border: `2px solid ${colors.text}`,
              boxShadow: `0 0 12px ${colors.text}80, inset 0 0 8px ${colors.text}30`,
              background: `${colors.text}15`,
            }}
          />
        );
      })()}

      {/* ── Player tokens ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="token-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0.5" stdDeviation="0.8" floodColor="#000" floodOpacity="0.8" />
          </filter>
          <radialGradient id="p1-grad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#9d1755" />
          </radialGradient>
          <radialGradient id="p2-grad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#5b21b6" />
          </radialGradient>
        </defs>

        {positions.map((pos, i) => {
          if (!pos) return null;
          const p = getTokenPos(pos);
          if (!p) return null;

          // Offset the two tokens slightly so they don't overlap
          const usableWidth = 100 - GRID_OFFSET.left - GRID_OFFSET.right;
          const cellW = usableWidth / 10;
          const offset = i === 0 ? -cellW * 0.18 : cellW * 0.18;

          return (
            <g key={`player-${i}`} filter="url(#token-shadow)">
              {/* Outer ring (gold) */}
              <circle
                cx={p.x + offset}
                cy={p.y}
                r="2.2"
                fill="#d4af37"
              />
              {/* Coloured fill */}
              <circle
                cx={p.x + offset}
                cy={p.y}
                r="1.8"
                fill={`url(#p${i + 1}-grad)`}
              />
              {/* Player number */}
              <text
                x={p.x + offset}
                y={p.y + 0.65}
                textAnchor="middle"
                fontSize="2"
                fontWeight="bold"
                fill="white"
              >
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

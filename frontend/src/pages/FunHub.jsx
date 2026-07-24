import { Link } from 'react-router-dom';

const GAMES = [
  {
    to: '/fun/tic-tac-toe',
    title: 'Tic-Tac-Toe',
    description: 'Classic 3x3 — but the AI plays perfectly. Best you can do is a draw.',
    tag: 'vs unbeatable AI',
  },
  {
    to: '/fun/memory',
    title: 'Memory Match',
    description: 'Flip cards, find the pairs, beat your own move count.',
    tag: 'puzzle',
  },
];

function FunHub() {
  return (
    <div className="bg-[#0D1117] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-20">
        <p className="text-[#5CDBD3] font-mono text-sm mb-3">$ cd ./fun</p>
        <h1
          className="text-[#E6EDF3] text-3xl md:text-4xl font-bold mb-3"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          A Small Detour
        </h1>
        <p className="text-[#8B949E] mb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
          You found the fun page. A couple of small builds — no real purpose except to see
          if you can beat them.
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {GAMES.map((game) => (
            <Link
              key={game.to}
              to={game.to}
              className="group bg-[#161B22] border border-white/10 hover:border-[#5CDBD3]/40 rounded-xl p-6 transition-colors"
            >
              <span className="inline-block text-xs font-mono text-[#5CDBD3] border border-[#5CDBD3]/25 bg-[#5CDBD3]/5 px-2 py-1 rounded-full mb-3">
                {game.tag}
              </span>
              <h3
                className="text-[#E6EDF3] text-lg font-semibold mb-2 group-hover:text-[#5CDBD3] transition-colors"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {game.title}
              </h3>
              <p className="text-[#8B949E] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                {game.description}
              </p>
            </Link>
          ))}
        </div>

        <Link
          to="/"
          className="inline-block mt-10 text-[#8B949E] hover:text-[#5CDBD3] font-mono text-sm transition"
        >
          ← back to the actual portfolio
        </Link>
      </div>
    </div>
  );
}

export default FunHub;
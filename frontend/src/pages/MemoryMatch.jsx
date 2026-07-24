import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ICONS = ['⚛️', '🟢', '🍃', '📦', '🐙', '⌨️', '🔧', '☕'];

const shuffle = () => {
  const pairs = [...ICONS, ...ICONS];
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((icon, id) => ({ id, icon, flipped: false, matched: false }));
};

function MemoryMatch() {
  const [cards, setCards] = useState(shuffle);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState(null);
  const [locked, setLocked] = useState(false);

  const allMatched = cards.every((c) => c.matched);

  useEffect(() => {
    if (allMatched && moves > 0) {
      setBest((prev) => (prev === null ? moves : Math.min(prev, moves)));
    }
  }, [allMatched]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFlip = (id) => {
    if (locked) return;
    const card = cards.find((c) => c.id === id);
    if (card.flipped || card.matched) return;
    if (selected.length === 2) return;

    const newCards = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    setCards(newCards);
    const newSelected = [...selected, id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [firstId, secondId] = newSelected;
      const first = newCards.find((c) => c.id === firstId);
      const second = newCards.find((c) => c.id === secondId);

      if (first.icon === second.icon) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, matched: true } : c
            )
          );
          setSelected([]);
          setLocked(false);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, flipped: false } : c
            )
          );
          setSelected([]);
          setLocked(false);
        }, 700);
      }
    }
  };

  const reset = () => {
    setCards(shuffle());
    setSelected([]);
    setMoves(0);
    setLocked(false);
  };

  return (
    <div className="bg-[#0D1117] min-h-screen">
      <div className="max-w-lg mx-auto px-4 pt-10 pb-20 text-center">
        <p className="text-[#5CDBD3] font-mono text-sm mb-3">$ ./memory-match</p>
        <h1
          className="text-[#E6EDF3] text-3xl font-bold mb-2"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Memory Match
        </h1>
        <p className="text-[#8B949E] text-sm mb-6 font-mono">
          moves: {moves} {best !== null && <span className="text-[#7EE787]">· best: {best}</span>}
        </p>

        {allMatched && (
          <p className="text-[#7EE787] font-mono text-sm mb-4">
            solved in {moves} moves 🎉
          </p>
        )}

        <div className="grid grid-cols-4 gap-3 mb-8">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className={`aspect-square rounded-lg text-2xl md:text-3xl flex items-center justify-center border transition-all duration-200 ${
                card.flipped || card.matched
                  ? 'bg-[#161B22] border-[#5CDBD3]/40'
                  : 'bg-[#161B22] border-white/10 hover:border-white/20'
              } ${card.matched ? 'opacity-40' : ''}`}
            >
              {(card.flipped || card.matched) ? card.icon : ''}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="bg-[#5CDBD3] text-[#0D1117] font-semibold px-6 py-2.5 rounded-lg hover:bg-[#4ec4bc] transition"
          >
            {allMatched ? 'Play Again' : 'Restart'}
          </button>
          <Link to="/fun" className="text-[#8B949E] hover:text-[#5CDBD3] font-mono text-sm transition">
            ← back to /fun
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MemoryMatch;
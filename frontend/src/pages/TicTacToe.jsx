import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const checkWinner = (board) => {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every((cell) => cell)) return 'draw';
  return null;
};

// Minimax — the AI (O) plays perfectly. You (X) can win only if it slips up, which it won't.
const minimax = (board, isMaximizing) => {
  const winner = checkWinner(board);
  if (winner === 'O') return { score: 1 };
  if (winner === 'X') return { score: -1 };
  if (winner === 'draw') return { score: 0 };

  const moves = [];
  board.forEach((cell, i) => {
    if (!cell) {
      const newBoard = [...board];
      newBoard[i] = isMaximizing ? 'O' : 'X';
      const result = minimax(newBoard, !isMaximizing);
      moves.push({ index: i, score: result.score });
    }
  });

  return isMaximizing
    ? moves.reduce((best, m) => (m.score > best.score ? m : best))
    : moves.reduce((best, m) => (m.score < best.score ? m : best));
};

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X'); // human is always X, AI is always O
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ wins: 0, losses: 0, draws: 0 });

  const handleClick = (i) => {
    if (board[i] || winner || turn !== 'X') return;
    const newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);
    setTurn('O');
  };

  // AI's turn
  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinner(result);
      return;
    }
    if (turn === 'O') {
      const timeout = setTimeout(() => {
        const best = minimax(board, true);
        const newBoard = [...board];
        newBoard[best.index] = 'O';
        setBoard(newBoard);
        setTurn('X');
      }, 400); // small delay so it feels like it's "thinking"
      return () => clearTimeout(timeout);
    }
  }, [board, turn]);

  useEffect(() => {
    if (winner && winner !== 'draw') {
      setScores((s) => ({
        ...s,
        wins: winner === 'X' ? s.wins + 1 : s.wins,
        losses: winner === 'O' ? s.losses + 1 : s.losses,
      }));
    } else if (winner === 'draw') {
      setScores((s) => ({ ...s, draws: s.draws + 1 }));
    }
  }, [winner]);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setWinner(null);
  };

  const statusText = () => {
    if (winner === 'X') return 'You win?! Nice — that shouldn\'t happen.';
    if (winner === 'O') return 'AI wins. As expected.';
    if (winner === 'draw') return 'Draw — the best you can do against perfect play.';
    return turn === 'X' ? 'Your move' : 'AI is thinking...';
  };

  return (
    <div className="bg-[#0D1117] min-h-screen">
      <div className="max-w-md mx-auto px-4 pt-10 pb-20 text-center">
        <p className="text-[#5CDBD3] font-mono text-sm mb-3">$ ./tic-tac-toe --vs ai</p>
        <h1
          className="text-[#E6EDF3] text-3xl font-bold mb-2"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Tic-Tac-Toe
        </h1>
        <p className="text-[#8B949E] text-sm mb-8 font-mono">{statusText()}</p>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={!!cell || !!winner || turn !== 'X'}
              className="aspect-square bg-[#161B22] border border-white/10 rounded-lg text-4xl font-bold flex items-center justify-center hover:border-[#5CDBD3]/40 transition disabled:cursor-not-allowed"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span className={cell === 'X' ? 'text-[#5CDBD3]' : 'text-[#7EE787]'}>
                {cell}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 text-sm font-mono text-[#8B949E] mb-6">
          <span>wins: <span className="text-[#5CDBD3]">{scores.wins}</span></span>
          <span>losses: <span className="text-[#7EE787]">{scores.losses}</span></span>
          <span>draws: {scores.draws}</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="bg-[#5CDBD3] text-[#0D1117] font-semibold px-6 py-2.5 rounded-lg hover:bg-[#4ec4bc] transition"
          >
            Play Again
          </button>
          <Link to="/fun" className="text-[#8B949E] hover:text-[#5CDBD3] font-mono text-sm transition">
            ← back to /fun
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TicTacToe;
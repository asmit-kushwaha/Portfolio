import { useEffect, useState, useRef } from 'react';
import MatrixRain from './MatrixRain';
 
const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];
 
const JOKES = [
  'Why do programmers prefer dark mode? Because light attracts bugs.',
  'There are 10 types of people: those who understand binary, and those who don\'t.',
  '99 little bugs in the code, 99 little bugs... take one down, patch it around, 127 little bugs in the code.',
];
 
function HiddenThings() {
  const [open, setOpen] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [terminalLog, setTerminalLog] = useState([
    { type: 'output', text: 'type "help" to see what this does' },
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const konamiProgress = useRef(0);
 
  // Konami code — works globally, anywhere on the site
  useEffect(() => {
    const handleKeyDown = (e) => {
      const expected = KONAMI_SEQUENCE[konamiProgress.current];
      const pressed = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (pressed === expected) {
        konamiProgress.current += 1;
        if (konamiProgress.current === KONAMI_SEQUENCE.length) {
          setShowMatrix(true);
          konamiProgress.current = 0;
        }
      } else {
        konamiProgress.current = pressed === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
 
  // Console message for anyone who opens DevTools
  useEffect(() => {
    console.log(
      '%c> _',
      'color:#5CDBD3; font-size: 24px; font-family: monospace;'
    );
    console.log(
      '%cLooking around? Try the command palette (Cmd/Ctrl+K), or find the ✨ in the corner.',
      'color:#8B949E; font-family: monospace;'
    );
  }, []);
 
  const runCommand = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
 
    let response;
    switch (cmd) {
      case 'help':
        response = 'commands: whoami, skills, coffee, joke, sudo, matrix, clear';
        break;
      case 'whoami':
        response = 'a developer who spent probably too long building this panel';
        break;
      case 'skills':
        response = 'React, Node.js, Express, MongoDB — and apparently, easter eggs';
        break;
      case 'coffee':
        response = '☕ brewing... done. you\'re welcome';
        break;
      case 'joke':
        response = JOKES[Math.floor(Math.random() * JOKES.length)];
        break;
      case 'sudo':
        response = 'nice try. permission denied.';
        break;
      case 'matrix':
        setShowMatrix(true);
        response = 'entering the matrix...';
        break;
      case 'clear':
        setTerminalLog([]);
        setTerminalInput('');
        return;
      default:
        response = `command not found: ${cmd} — try "help"`;
    }
 
    setTerminalLog((log) => [
      ...log,
      { type: 'command', text: cmd },
      { type: 'output', text: response },
    ]);
    setTerminalInput('');
  };
 
  return (
    <>
      {/* Trigger button — bottom right, always present */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-[150] w-11 h-11 rounded-full bg-[#161B22] border border-white/10 hover:border-[#5CDBD3]/40 flex items-center justify-center text-lg transition"
        title="hidden things"
        aria-label="Toggle hidden things panel"
      >
        ✨
      </button>
 
      {/* Panel */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[150] cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-20 right-5 w-80 max-w-[calc(100vw-2.5rem)] bg-[#161B22] border border-white/10 rounded-xl shadow-2xl p-4 flex flex-col gap-4 cursor-default"
          >
          <div>
            <h4 className="text-[#E6EDF3] font-mono text-sm font-semibold mb-1">hidden things</h4>
            <p className="text-[#8B949E] text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
              This site has a few easter eggs. Some you can trigger here, others you'll have to find.
            </p>
          </div>
 
          {/* Mini terminal */}
          <div className="bg-[#0D1117] border border-white/10 rounded-lg p-3">
            <div className="max-h-32 overflow-y-auto mb-2 flex flex-col gap-1">
              {terminalLog.map((line, i) => (
                <p key={i} className="font-mono text-xs">
                  {line.type === 'command' ? (
                    <span className="text-[#5CDBD3]">$ {line.text}</span>
                  ) : (
                    <span className="text-[#8B949E]">{line.text}</span>
                  )}
                </p>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runCommand(terminalInput);
              }}
              className="flex items-center gap-1"
            >
              <span className="text-[#5CDBD3] font-mono text-xs">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="type a command"
                className="flex-1 bg-transparent text-[#E6EDF3] placeholder-[#4b5563] font-mono text-xs focus:outline-none"
              />
            </form>
          </div>
 
          {/* Hint list */}
          <ul className="text-xs text-[#8B949E] font-mono flex flex-col gap-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
            <li>🎮 Konami code: ↑ ↑ ↓ ↓ ← → ← → B A — works anywhere</li>
            <li>🖱️ Right-click my name in the Navbar</li>
            <li>⌨️ Press Cmd/Ctrl+K anywhere on the site</li>
            <li>🔍 Open DevTools console</li>
          </ul>
 
          <button
            onClick={() => setShowMatrix(true)}
            className="text-[#5CDBD3] hover:underline text-xs font-mono self-start"
          >
            or just open the matrix rain directly →
          </button>
          </div>
        </div>
      )}
 
      {showMatrix && <MatrixRain onClose={() => setShowMatrix(false)} />}
    </>
  );
}
 
export default HiddenThings;

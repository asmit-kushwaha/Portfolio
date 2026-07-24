import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [settings, setSettings] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data);
      } catch (err) {
        // Fails silently — palette still works, just without dynamic commands
      }
    };
    fetchSettings();
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  // Global keyboard listener: Cmd/Ctrl+K to open, Esc to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [close]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Build the command list — some are always available, some depend on settings
  const commands = [
    { id: 'home', label: 'cd ~', hint: 'go home', keywords: 'home root', action: () => navigate('/') },
    { id: 'about', label: 'cd about', hint: 'about me', keywords: 'about bio', action: () => navigate('/about') },
    { id: 'projects', label: 'cd projects', hint: 'see my work', keywords: 'projects work portfolio', action: () => navigate('/projects') },
    { id: 'now', label: 'cd now', hint: 'what I\'m up to', keywords: 'now current doing', action: () => navigate('/now') },
    { id: 'contact', label: 'cd contact', hint: 'get in touch', keywords: 'contact email message', action: () => navigate('/contact') },
    { id: 'fun', label: 'cd fun', hint: 'a little detour', keywords: 'fun game games play tic tac toe memory', action: () => navigate('/fun') },
  ];

  if (settings?.resumeUrl) {
    commands.push({
      id: 'resume',
      label: 'open resume.pdf',
      hint: 'opens in new tab',
      keywords: 'resume cv download',
      action: () => window.open(settings.resumeUrl, '_blank', 'noreferrer'),
    });
  }

  if (settings?.githubUsername) {
    commands.push({
      id: 'github',
      label: 'open github',
      hint: `github.com/${settings.githubUsername}`,
      keywords: 'github git code source',
      action: () => window.open(`https://github.com/${settings.githubUsername}`, '_blank', 'noreferrer'),
    });
  }

  const filtered = query.trim()
    ? commands.filter((c) =>
        (c.label + ' ' + c.keywords).toLowerCase().includes(query.trim().toLowerCase())
      )
    : commands;

  const runCommand = (cmd) => {
    if (!cmd) return;
    cmd.action();
    close();
  };

  const handleKeyDownInInput = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runCommand(filtered[activeIndex]);
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#161B22] border border-white/10 rounded-xl shadow-2xl overflow-hidden cursor-default"
      >
        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
          <span className="text-[#5CDBD3] font-mono">$</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDownInInput}
            placeholder="type a command..."
            className="flex-1 bg-transparent text-[#E6EDF3] placeholder-[#4b5563] font-mono text-sm focus:outline-none"
          />
          <span className="text-[#4b5563] text-xs font-mono border border-white/10 rounded px-1.5 py-0.5">
            esc
          </span>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <p className="text-[#4b5563] font-mono text-sm px-4 py-3">no matching command</p>
          )}
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              onClick={() => runCommand(cmd)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`w-full text-left px-4 py-2.5 flex items-center justify-between font-mono text-sm transition-colors ${
                i === activeIndex ? 'bg-[#5CDBD3]/10 text-[#5CDBD3]' : 'text-[#E6EDF3]'
              }`}
            >
              <span>{cmd.label}</span>
              <span className="text-[#4b5563] text-xs">{cmd.hint}</span>
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <div className="border-t border-white/10 px-4 py-2 flex items-center gap-4 text-[#4b5563] text-xs font-mono">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
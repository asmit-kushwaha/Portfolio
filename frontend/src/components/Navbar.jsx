import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import api from '../api/axios';

const LINKS = [
  { to: '/', label: 'home' },
  { to: '/about', label: 'about' },
  { to: '/projects', label: 'projects' },
  { to: '/now', label: 'now' },
  { to: '/contact', label: 'contact' },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [showFunLink, setShowFunLink] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setShowFunLink(res.data.showFunLink);
      } catch (err) {
        // Fails silently — the icon just won't show, nothing else breaks
      }
    };
    fetchSettings();
  }, []);

  const openCommandPalette = () => {
    // Dispatches the same keyboard event the palette already listens for —
    // avoids needing to lift state up just for this one button.
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  const handleNameRightClick = (e) => {
    e.preventDefault();
    const messages = [
      "that's not a context menu, that's a compliment",
      "nice try — there's nothing here, just vibes",
      "you found a secret! it's this message. that's it.",
    ];
    alert(messages[Math.floor(Math.random() * messages.length)]);
  };

  const linkClass = ({ isActive }) =>
    `font-mono text-sm transition ${
      isActive ? 'text-[#5CDBD3]' : 'text-[#8B949E] hover:text-[#E6EDF3]'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-[#0D1117]/90 backdrop-blur border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link
          to="/"
          onContextMenu={handleNameRightClick}
          className="font-mono text-[#E6EDF3] font-semibold text-base"
        >
          <span className="text-[#5CDBD3]">&gt;</span> asmit.dev
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          {showFunLink && (
            <Link
              to="/fun"
              className="text-[#4b5563] hover:text-[#7EE787] transition text-sm"
              title="a little detour"
            >
              🎮
            </Link>
          )}
          <button
            onClick={openCommandPalette}
            className="text-[#4b5563] hover:text-[#5CDBD3] transition font-mono text-sm border border-white/10 rounded px-2 py-1"
            title="command palette (Ctrl/Cmd+K)"
          >
            &gt;_
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#E6EDF3] font-mono text-sm"
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 px-4 py-4 flex flex-col gap-4 bg-[#0D1117]">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          {showFunLink && (
            <Link
              to="/fun"
              className="text-[#4b5563] hover:text-[#7EE787] transition text-sm"
              onClick={() => setOpen(false)}
            >
              🎮 fun
            </Link>
          )}
          <button
            onClick={() => {
              openCommandPalette();
              setOpen(false);
            }}
            className="text-left text-[#4b5563] hover:text-[#5CDBD3] transition font-mono text-sm"
          >
            &gt;_ command palette
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

// The lines "typed" into the terminal — each fully types before the next starts.
const TERMINAL_LINES = [
  { type: 'command', text: 'whoami' },
  { type: 'output', text: 'Full-stack developer building with the MERN stack' },
  { type: 'command', text: 'cat stack.json' },
  { type: 'output', text: '["React", "Node.js", "Express", "MongoDB"]' },
  { type: 'command', text: './status' },
  { type: 'output', text: 'Available for new projects', highlight: true },
];

function Terminal() {
  const [completedLines, setCompletedLines] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [done, setDone] = useState(false);
  const lineIndexRef = useRef(0);
  const charIndexRef = useRef(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Skip the animation — show everything immediately.
      setCompletedLines(TERMINAL_LINES);
      setDone(true);
      return;
    }

    let timeoutId;

    const typeNextChar = () => {
      const line = TERMINAL_LINES[lineIndexRef.current];
      if (!line) {
        setDone(true);
        return;
      }

      const speed = line.type === 'command' ? 45 : 12;

      if (charIndexRef.current <= line.text.length) {
        setCurrentText(line.text.slice(0, charIndexRef.current));
        charIndexRef.current += 1;
        timeoutId = setTimeout(typeNextChar, speed);
      } else {
        // Line finished — commit it, move to the next after a short pause.
        setCompletedLines((prev) => [...prev, line]);
        setCurrentText('');
        lineIndexRef.current += 1;
        charIndexRef.current = 0;
        timeoutId = setTimeout(typeNextChar, line.type === 'output' ? 400 : 150);
      }
    };

    timeoutId = setTimeout(typeNextChar, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  const currentLine = TERMINAL_LINES[lineIndexRef.current];

  return (
    <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 bg-[#161B22]">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#0D1117] border-b border-white/5">
        <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
        <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
        <span className="ml-3 text-xs text-[#8B949E] font-mono">developer@portfolio:~</span>
      </div>

      {/* Body */}
      <div className="p-5 font-mono text-sm leading-relaxed min-h-[220px]">
        {completedLines.map((line, i) => (
          <div key={i} className="mb-1">
            {line.type === 'command' ? (
              <span>
                <span className="text-[#5CDBD3]">$</span>{' '}
                <span className="text-[#E6EDF3]">{line.text}</span>
              </span>
            ) : (
              <span className={line.highlight ? 'text-[#7EE787]' : 'text-[#8B949E]'}>
                {line.text}
              </span>
            )}
          </div>
        ))}

        {!done && currentLine && (
          <div className="mb-1">
            {currentLine.type === 'command' ? (
              <span>
                <span className="text-[#5CDBD3]">$</span>{' '}
                <span className="text-[#E6EDF3]">{currentText}</span>
              </span>
            ) : (
              <span className={currentLine.highlight ? 'text-[#7EE787]' : 'text-[#8B949E]'}>
                {currentText}
              </span>
            )}
            <span className="inline-block w-2 h-4 bg-[#5CDBD3] ml-0.5 align-middle animate-pulse" />
          </div>
        )}

        {done && (
          <div>
            <span className="text-[#5CDBD3]">$</span>{' '}
            <span className="inline-block w-2 h-4 bg-[#5CDBD3] ml-0.5 align-middle animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}

const TECH_STACK = ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'JavaScript'];

function Home() {
  const [settings, setSettings] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data);
      } catch (err) {
        // If this fails, we just don't show the image — never breaks the page
        console.error('Could not load settings:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="bg-[#0D1117] min-h-screen">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left — headline */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7EE787] opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7EE787]"></span>
            </span>
            <span className="text-[#8B949E] text-sm font-mono">Available for new projects</span>
          </div>

          {settings?.showProfileImage && settings?.profileImage && (
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 rounded-full bg-[#5CDBD3] blur-xl opacity-20 scale-110"></div>
              <button
                onClick={() => setLightboxOpen(true)}
                className="relative p-1 rounded-full bg-gradient-to-br from-[#5CDBD3] to-[#7EE787] cursor-pointer transition-transform hover:scale-105"
                aria-label="View full photo"
              >
                <img
                  src={settings.profileImage}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-[#0D1117]"
                />
              </button>
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#7EE787] border-4 border-[#0D1117]"></span>
            </div>
          )}

          <p className="text-[#5CDBD3] font-mono text-sm mb-3">$ whoami</p>
          <h1
            className="text-[#E6EDF3] font-bold text-4xl md:text-5xl leading-tight mb-6"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Asmit Kushwaha
            <br />
            <span className="text-[#8B949E]">builds full-stack products.</span>
          </h1>

          <p className="text-[#8B949E] text-lg mb-8 max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
            I design and ship web applications end-to-end — React on the front,
            Node and MongoDB underneath, and everything in between.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/projects"
              className="bg-[#5CDBD3] text-[#0D1117] font-semibold px-6 py-3 rounded-lg hover:bg-[#4ec4bc] transition"
            >
              View my work
            </Link>
            <Link
              to="/contact"
              className="border border-white/15 text-[#E6EDF3] font-medium px-6 py-3 rounded-lg hover:bg-white/5 transition"
            >
              Get in touch
            </Link>
            {settings?.resumeUrl && (
              <a
                href={settings.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[#8B949E] hover:text-[#5CDBD3] font-mono text-sm px-2 py-3 transition"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                resume.pdf
              </a>
            )}
          </div>
        </div>

        {/* Right — terminal signature element */}
        <Terminal />
      </section>

      {/* Tech strip */}
      <section className="border-y border-white/5 bg-[#0D1117] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-[#8B949E] text-xs font-mono uppercase tracking-wider mb-4 text-center">
            Built with
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="font-mono text-sm text-[#8B949E] border border-white/10 rounded-full px-4 py-1.5 hover:border-[#5CDBD3]/40 hover:text-[#5CDBD3] transition"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-[#E6EDF3] text-2xl md:text-3xl font-semibold mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Have something to build?
        </h2>
        <p className="text-[#8B949E] mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
          Take a look at the projects, or send a message — I read every one.
        </p>
        <Link
          to="/projects"
          className="inline-block bg-[#5CDBD3] text-[#0D1117] font-semibold px-8 py-3 rounded-lg hover:bg-[#4ec4bc] transition"
        >
          See my projects →
        </Link>
      </section>

      {/* Lightbox — click the profile photo to open, click anywhere to close */}
      {lightboxOpen && settings?.profileImage && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center px-4 cursor-pointer animate-[fadeIn_0.15s_ease-out]"
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-[#8B949E] hover:text-[#E6EDF3] font-mono text-sm border border-white/15 rounded-lg px-3 py-1.5 hover:bg-white/5 transition"
            aria-label="Close"
          >
            ✕ close
          </button>
          <img
            src={settings.profileImage}
            alt="Profile — full size"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[80vh] rounded-2xl border-4 border-[#161B22] shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}

export default Home;
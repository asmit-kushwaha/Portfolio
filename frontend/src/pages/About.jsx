import { useEffect, useState } from 'react';
import api from '../api/axios';

const SKILLS = {
  frontend: ['React', 'JavaScript', 'Tailwind CSS', 'HTML/CSS'],
  backend: ['Node.js', 'Express', 'REST APIs', 'JWT Auth'],
  database: ['MongoDB', 'Mongoose'],
  tools: ['Git', 'Cloudinary', 'Postman', 'Vite'],
};

function About() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data);
      } catch (err) {
        console.error('Could not load settings:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="bg-[#0D1117] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-20">
        <p className="text-[#5CDBD3] font-mono text-sm mb-3">$ cat about.md</p>
        <h1
          className="text-[#E6EDF3] text-3xl md:text-4xl font-bold mb-10"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          About Me
        </h1>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Bio */}
          <div className="md:col-span-3">
            <p
              className="text-[#8B949E] text-lg leading-relaxed mb-4"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              I'm a full-stack developer who likes taking an idea from a blank
              file to something people can actually use — end to end, front
              and back. This portfolio itself is one example: built from
              scratch with a React frontend, an Express/MongoDB backend, real
              authentication, and a working admin dashboard behind it.
            </p>
            <p
              className="text-[#8B949E] text-lg leading-relaxed mb-4"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              I care about writing code that's easy to come back to later —
              clear structure, sensible naming, and enough comments to explain
              the "why," not just the "what."
            </p>
            <p
              className="text-[#8B949E] text-lg leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Right now I'm focused on deepening my MERN stack skills and
              shipping projects that are genuinely useful, not just
              portfolio filler.
            </p>
          </div>

          {/* Skills panel — static "code block" styled like the terminal on Home */}
          <div className="md:col-span-2">
            <div className="rounded-xl border border-white/10 bg-[#161B22] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0D1117] border-b border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                <span className="ml-2 text-xs text-[#8B949E] font-mono">skills.json</span>
              </div>
              <div className="p-5 font-mono text-sm leading-loose">
                {Object.entries(SKILLS).map(([category, items]) => (
                  <div key={category} className="mb-3 last:mb-0">
                    <span className="text-[#5CDBD3]">{category}</span>
                    <span className="text-[#8B949E]">: [</span>
                    <br />
                    {items.map((item, i) => (
                      <span key={item}>
                        <span className="text-[#E6EDF3] ml-4">"{item}"</span>
                        {i < items.length - 1 && <span className="text-[#8B949E]">,</span>}
                        <br />
                      </span>
                    ))}
                    <span className="text-[#8B949E]">]</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GitHub contribution graph — only shown if toggled on in Admin */}
        {settings?.showGithubGraph && settings?.githubUsername && (
          <div className="mt-12">
            <p className="text-[#5CDBD3] font-mono text-sm mb-3">$ git log --graph --all</p>
            <div className="rounded-xl border border-white/10 bg-[#161B22] p-5 overflow-x-auto">
              <img
                src={`https://ghchart.rshah.org/5CDBD3/${settings.githubUsername}`}
                alt={`${settings.githubUsername}'s GitHub contribution graph`}
                className="w-full min-w-[600px]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default About;
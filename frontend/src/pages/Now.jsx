import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Now() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data);
      } catch (err) {
        console.error('Could not load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const formattedDate = settings?.nowUpdatedAt
    ? new Date(settings.nowUpdatedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="bg-[#0D1117] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 pt-10 pb-20">
        <p className="text-[#5CDBD3] font-mono text-sm mb-3">$ cat now.md</p>
        <h1
          className="text-[#E6EDF3] text-3xl md:text-4xl font-bold mb-2"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          What I'm doing now
        </h1>
        <p className="text-[#8B949E] text-sm mb-10 font-mono">
          {formattedDate ? `last updated ${formattedDate}` : 'not updated yet'}
        </p>

        {!loading && (
          <div className="rounded-xl border border-white/10 bg-[#161B22] p-6">
            {settings?.nowText ? (
              <p
                className="text-[#E6EDF3] text-lg leading-relaxed whitespace-pre-line"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {settings.nowText}
              </p>
            ) : (
              <p className="text-[#4b5563] font-mono text-sm">
                nothing posted yet — check back soon.
              </p>
            )}
          </div>
        )}

        <p className="text-[#4b5563] text-xs font-mono mt-8">
          inspired by{' '}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noreferrer"
            className="text-[#8B949E] hover:text-[#5CDBD3] transition"
          >
            the /now page movement
          </a>
        </p>

        <Link
          to="/"
          className="inline-block mt-6 text-[#8B949E] hover:text-[#5CDBD3] font-mono text-sm transition"
        >
          ← back home
        </Link>
      </div>
    </div>
  );
}

export default Now;
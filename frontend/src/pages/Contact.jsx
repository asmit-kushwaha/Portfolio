import { useState } from 'react';
import api from '../api/axios';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(''); // '', 'sending', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      await api.post('/messages', form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Failed to send message');
    }
  };

  return (
    <div className="bg-[#0D1117] min-h-screen pt-6 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <p className="text-[#5CDBD3] font-mono text-sm mb-3 text-center">$ send message</p>
        <h2
          className="text-3xl md:text-4xl font-bold text-[#E6EDF3] text-center mb-3"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Let's build something together
        </h2>
        <p className="text-[#8B949E] text-center max-w-xl mx-auto mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
          Have a project in mind, a question, or just want to say hi? My inbox is always open.
        </p>

        <div className="grid md:grid-cols-5 gap-0 bg-[#161B22] border border-white/10 rounded-2xl overflow-hidden">
          {/* Left panel */}
          <div className="md:col-span-2 bg-[#0D1117] p-8 flex flex-col justify-between border-r border-white/5">
            <div>
              <h3 className="text-[#E6EDF3] text-lg font-semibold mb-4 font-mono">Contact Info</h3>
              <p className="text-[#8B949E] text-sm leading-relaxed mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                Fill out the form and I'll get back to you within a day or two.
                You'll also get an instant confirmation email.
              </p>

              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="bg-[#5CDBD3]/10 text-[#5CDBD3] p-2 rounded-lg">
                    <Mail size={18} />
                  </div>
                  <span className="text-sm text-[#8B949E] font-mono">contact2asmit@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#5CDBD3]/10 text-[#5CDBD3] p-2 rounded-lg">
                    <MapPin size={18} />
                  </div>
                  <span className="text-sm text-[#8B949E] font-mono">India · Open to remote</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-10">
              <a
                href="https://github.com/asmit-kushwaha"
                target="_blank"
                rel="noreferrer"
                className="bg-white/5 hover:bg-[#5CDBD3]/10 hover:text-[#5CDBD3] text-[#8B949E] transition p-2.5 rounded-lg"
                aria-label="GitHub"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.09-.744.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.305.763-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23A11.5 11.5 0 0112 5.803c1.02.005 2.047.138 3.005.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.604-.014 2.896-.014 3.29 0 .32.216.694.825.576C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/asmit-ksh"
                target="_blank"
                rel="noreferrer"
                className="bg-white/5 hover:bg-[#5CDBD3]/10 hover:text-[#5CDBD3] text-[#8B949E] transition p-2.5 rounded-lg"
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="md:col-span-3 p-8">
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <CheckCircle2 className="text-[#7EE787] mb-4" size={48} />
                <h3 className="text-xl font-semibold text-[#E6EDF3] mb-2 font-mono">Message sent!</h3>
                <p className="text-[#8B949E] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Thanks for reaching out — check your inbox for a confirmation.
                </p>
                <button
                  onClick={() => setStatus('')}
                  className="text-[#5CDBD3] hover:underline text-sm font-medium font-mono"
                >
                  send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {status === 'error' && (
                  <div className="flex items-center gap-2 bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-lg font-mono">
                    <AlertCircle size={16} />
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="text-sm font-mono text-[#8B949E] mb-1 block">name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0D1117] border border-white/10 text-[#E6EDF3] placeholder-[#4b5563] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#5CDBD3]/50 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="text-sm font-mono text-[#8B949E] mb-1 block">email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0D1117] border border-white/10 text-[#E6EDF3] placeholder-[#4b5563] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#5CDBD3]/50 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="text-sm font-mono text-[#8B949E] mb-1 block">message</label>
                  <textarea
                    name="message"
                    placeholder="Tell me a bit about what you have in mind..."
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0D1117] border border-white/10 text-[#E6EDF3] placeholder-[#4b5563] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#5CDBD3]/50 focus:border-transparent transition resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="flex items-center justify-center gap-2 bg-[#5CDBD3] text-[#0D1117] px-6 py-3 rounded-lg hover:bg-[#4ec4bc] transition disabled:opacity-50 font-semibold"
                >
                  {status === 'sending' ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
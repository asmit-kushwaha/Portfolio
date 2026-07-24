import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
 
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };
 
  return (
    <div className="bg-[#0D1117] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="text-[#5CDBD3] font-mono text-sm mb-3 text-center">$ login --admin</p>
        <h2
          className="text-2xl font-bold text-[#E6EDF3] text-center mb-8"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Admin Access
        </h2>
 
        <form
          onSubmit={handleSubmit}
          className="bg-[#161B22] border border-white/10 rounded-xl p-6 flex flex-col gap-4"
        >
          <div>
            <label className="text-sm font-mono text-[#8B949E] mb-1 block">email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0D1117] border border-white/10 text-[#E6EDF3] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#5CDBD3]/50 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="text-sm font-mono text-[#8B949E] mb-1 block">password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0D1117] border border-white/10 text-[#E6EDF3] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#5CDBD3]/50 focus:border-transparent transition"
            />
          </div>
          {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
          <button
            type="submit"
            className="bg-[#5CDBD3] text-[#0D1117] font-semibold px-6 py-3 rounded-lg hover:bg-[#4ec4bc] transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
 
export default Login;
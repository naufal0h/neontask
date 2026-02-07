import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Terminal } from 'lucide-react';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { email, password, handle };
      
      const { data } = await api.post(endpoint, payload);
      setAuth(data.user, data.token);
      navigate('/operations');
    } catch (err: any) {
      setError(err.response?.data?.error || 'SYSTEM ERROR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-8">
      <div className="w-full max-w-md border border-gray-800 rounded-lg p-8 bg-void-light">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <Shield className="w-8 h-8 text-neon-cyan" />
          <h2 className="text-2xl font-mono font-bold text-white">
            {isLogin ? 'AUTHENTICATION' : 'REGISTRATION'}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-red-500 text-red-500 font-mono text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-500 font-mono text-xs mb-1">HANDLE</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-void border border-gray-700 rounded p-3 text-white font-mono focus:border-neon-cyan focus:outline-none"
                placeholder="neon_hacker"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-gray-500 font-mono text-xs mb-1">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-void border border-gray-700 rounded p-3 text-white font-mono focus:border-neon-cyan focus:outline-none"
              placeholder="hacker@neontask.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-500 font-mono text-xs mb-1">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-void border border-gray-700 rounded p-3 text-white font-mono focus:border-neon-cyan focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan font-mono rounded hover:bg-neon-cyan/20 transition-all disabled:opacity-50"
          >
            {loading ? 'PROCESSING...' : isLogin ? 'LOGIN' : 'REGISTER'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-500 font-mono text-xs">
          {isLogin ? "Don't have access?" : "Already have access?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-neon-cyan hover:underline"
          >
            {isLogin ? 'REGISTER' : 'LOGIN'}
          </button>
        </p>
      </div>
    </div>
  );
};
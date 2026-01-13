import React, { useState } from 'react';
import { User, ArrowRight, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    // Simulate API call to backend
    setTimeout(() => {
      onLogin(username.trim().toLowerCase());
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-dark-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-brand-500/10 border border-brand-500/20 mb-6 text-brand-500">
            <User size={40} />
          </div>
          <h1 className="text-4xl font-bold text-white font-serif tracking-tight">SwipeTrack</h1>
          <p className="text-gray-500 mt-2">Personal Entertainment Journal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <input
              type="text"
              required
              placeholder="Enter username or email"
              className="w-full bg-dark-800 border border-dark-700 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder-gray-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>Continue <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 px-4">
          By continuing, you agree to our Terms of Service. Your data is synced automatically to your account.
        </p>
      </div>
    </div>
  );
};

export default Login;
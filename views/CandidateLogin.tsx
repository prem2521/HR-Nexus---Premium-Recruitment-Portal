
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../components/Layouts';
import { getCandidateByEmail } from '../db';
import { User } from '../types';
import { Mail, Lock, Loader2, Github, Facebook } from 'lucide-react';

const CandidateLogin: React.FC<{ setUser: (u: User) => void }> = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const candidate = getCandidateByEmail(email);
      if (candidate) {
        // In real app, we verify password hash
        setUser(candidate);
        localStorage.setItem('current_user', JSON.stringify(candidate));
        navigate('/candidate/dashboard');
      } else {
        setError('Invalid credentials or candidate not found.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout 
      infoTitle="What our jobseekers said." 
      infoText="Search and find your dream job is now easier than ever with HR Nexus. Just upload a CV and apply if you want to."
      testimonial={{
        name: "Alice Johnson",
        role: "UX Designer at Google",
        text: "HR Nexus completely changed my career path. The application process was seamless and professional."
      }}
    >
      <div className="text-center md:text-left mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-white/60">Please enter your account details</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-sm">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="email" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="block text-sm font-medium text-white/70">Password</label>
            <a href="#" className="text-xs text-indigo-300 hover:text-white transition-colors">Forgot Password?</a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="password" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input type="checkbox" className="rounded bg-white/5 border-white/10 text-indigo-600 focus:ring-indigo-500/50" id="remember" />
          <label htmlFor="remember" className="text-sm text-white/60">Keep me logged in</label>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-orange-400 hover:scale-[1.02] active:scale-[0.98] text-white font-semibold py-3 rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
        </button>
      </form>

      <div className="mt-8">
        <div className="relative flex items-center gap-4 mb-6">
          <div className="flex-grow h-[1px] bg-white/10"></div>
          <span className="text-xs text-white/30 uppercase tracking-widest">Or continue with</span>
          <div className="flex-grow h-[1px] bg-white/10"></div>
        </div>
        
        <div className="flex justify-center gap-4">
          <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          </button>
          <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all">
            <Github className="w-5 h-5 text-white" />
          </button>
          <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all">
            <Facebook className="w-5 h-5 text-blue-500" />
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-white/50 text-sm">
        Don't have an account? <Link to="/candidate/register" className="text-indigo-300 font-semibold hover:text-white transition-colors">Create account</Link>
      </p>
      
      <div className="mt-4 text-center">
        <Link to="/admin/login" className="text-xs text-white/30 hover:text-white transition-colors italic">Login as HR Admin instead</Link>
      </div>
    </AuthLayout>
  );
};

export default CandidateLogin;

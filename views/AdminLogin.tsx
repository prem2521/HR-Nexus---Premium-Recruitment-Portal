
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../components/Layouts';
import { getUsers, saveUser } from '../db';
import { User } from '../types';
import { Shield, Mail, Lock, Loader2, Sparkles } from 'lucide-react';

const AdminLogin: React.FC<{ setUser: (u: User) => void }> = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const user = getUsers().find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === 'HR_ADMIN');
      if (user) {
        setUser(user);
        localStorage.setItem('current_user', JSON.stringify(user));
        navigate('/admin/dashboard');
      } else {
        setError('Unauthorized access. Have you registered an admin account yet?');
      }
      setLoading(false);
    }, 800);
  };

  const handleQuickLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const demoAdmin: User = {
        id: 'demo-admin',
        name: 'Demo Admin',
        email: 'admin@technexus.com',
        role: 'HR_ADMIN',
        createdAt: Date.now()
      };
      
      // Ensure demo admin exists in "DB"
      const users = getUsers();
      if (!users.find(u => u.email === demoAdmin.email)) {
        saveUser(demoAdmin);
      }
      
      setUser(demoAdmin);
      localStorage.setItem('current_user', JSON.stringify(demoAdmin));
      navigate('/admin/dashboard');
      setLoading(false);
    }, 500);
  };

  return (
    <AuthLayout 
      infoTitle="Global Talent Acquisition." 
      infoText="Manage thousands of applications with our AI-driven recruitment dashboard. High precision, high efficiency."
      testimonial={{
        name: "Sarah Miller",
        role: "Chief People Officer",
        text: "The data visualization and real-time candidate tracking in HR Nexus have cut our hiring cycle in half."
      }}
    >
      <div className="mb-8">
        <div className="flex items-center gap-2 text-indigo-400 mb-2">
          <Shield className="w-5 h-5" />
          <span className="text-sm font-bold tracking-widest uppercase">HR Portal</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Recruiter Access</h1>
        <p className="text-white/60">Manage your organization's hiring pipeline</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">HR Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="email" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="hr@technexus.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Security Key</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="password" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <button 
            disabled={loading}
            className="w-full bg-white text-slate-900 font-bold py-3 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 hover:bg-indigo-50 active:scale-95"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
          </button>
          
          <button 
            type="button"
            onClick={handleQuickLogin}
            className="w-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold py-3 rounded-full transition-all flex items-center justify-center gap-2 hover:bg-indigo-500/30 hover:text-white"
          >
            <Sparkles className="w-4 h-4" /> Quick Demo Login
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-white/40 hover:text-white transition-colors">Candidate Login</Link>
          <div className="h-4 w-[1px] bg-white/10"></div>
          <Link to="/admin/register" className="text-sm text-indigo-400 font-semibold hover:text-white transition-colors">New Admin Account</Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default AdminLogin;


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../components/Layouts';
import { saveUser, saveCandidateProfile, getCandidateByEmail } from '../db';
import { CandidateProfile } from '../types';
import { User, Mail, Lock, Phone, Loader2 } from 'lucide-react';

const COUNTRIES = [
  { code: '+1', flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+91', flag: '🇮🇳' },
  { code: '+61', flag: '🇦🇺' },
  { code: '+81', flag: '🇯🇵' },
  { code: '+49', flag: '🇩🇪' },
];

const CandidateRegister: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', countryCode: '+91' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (getCandidateByEmail(form.email)) {
        setError('Email already exists.');
        setLoading(false);
        return;
      }

      const id = Math.random().toString(36).substr(2, 9);
      const newCandidate: CandidateProfile = {
        id,
        ...form,
        role: 'CANDIDATE',
        status: 'PENDING',
        createdAt: Date.now(),
        lastUpdated: Date.now()
      };

      saveUser(newCandidate);
      saveCandidateProfile(newCandidate);
      navigate('/');
      setLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout 
      infoTitle="Join the network." 
      infoText="Start your professional journey today. Thousands of top companies are waiting for your talent."
      testimonial={{
        name: "Mark Stevens",
        role: "Hiring Manager at Meta",
        text: "The quality of candidates coming through HR Nexus is exceptional. It's our primary source for talent."
      }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
        <p className="text-white/60">Join the elite network of tech professionals</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {error && <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-sm">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="email" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="johndoe@gmail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-1/3">
             <label className="block text-sm font-medium text-white/70 mb-1">Code</label>
             <select 
               className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
               value={form.countryCode}
               onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
             >
               {COUNTRIES.map(c => (
                 <option key={c.code} value={c.code} className="bg-slate-800">{c.flag} {c.code}</option>
               ))}
             </select>
          </div>
          <div className="w-2/3">
            <label className="block text-sm font-medium text-white/70 mb-1">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="tel" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                placeholder="123 456 7890"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="password" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] text-white font-semibold py-3 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
        </button>
      </form>

      <p className="mt-8 text-center text-white/50 text-sm">
        Already have an account? <Link to="/" className="text-indigo-300 font-semibold hover:text-white transition-colors">Sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default CandidateRegister;

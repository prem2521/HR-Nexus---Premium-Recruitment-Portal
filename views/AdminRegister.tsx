
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../components/Layouts';
import { saveUser, getUsers } from '../db';
import { User as UserType } from '../types';
import { Shield, Mail, Lock, User, Loader2, Info } from 'lucide-react';

const AdminRegister: React.FC<{ setUser?: (u: UserType) => void }> = ({ setUser }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', accessCode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (form.accessCode.toUpperCase() !== 'ADMIN_2024') {
      setError('Invalid master access code. Hint: ADMIN_2024');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const exists = getUsers().find(u => u.email === form.email);
      if (exists) {
        setError('Account already exists with this email.');
        setLoading(false);
        return;
      }

      const id = Math.random().toString(36).substr(2, 9);
      const newAdmin: UserType = {
        id,
        name: form.name,
        email: form.email,
        role: 'HR_ADMIN',
        createdAt: Date.now()
      };

      saveUser(newAdmin);
      
      // Auto-login after registration
      if (setUser) {
        setUser(newAdmin);
        localStorage.setItem('current_user', JSON.stringify(newAdmin));
        navigate('/admin/dashboard');
      } else {
        navigate('/admin/login');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout 
      infoTitle="Join the HR Elite." 
      infoText="Scale your organization's human capital with precision tools."
      testimonial={{
        name: "David Chen",
        role: "Global Head of Talent",
        text: "Registering new recruiters is seamless. The platform ensures only verified staff can access sensitive candidate data."
      }}
    >
      <div className="mb-8">
        <div className="flex items-center gap-2 text-indigo-400 mb-2">
          <Shield className="w-5 h-5" />
          <span className="text-sm font-bold tracking-widest uppercase">Admin Registration</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">New Admin Account</h1>
        <p className="text-white/60">Initialize your recruiter credentials</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-sm animate-bounce">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Official Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Corporate Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="email" required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="hr@technexus.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Master Access Code</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono"
              placeholder="ADMIN_XXXX"
              value={form.accessCode}
              onChange={(e) => setForm({ ...form, accessCode: e.target.value })}
            />
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-indigo-300/60 uppercase tracking-widest">
            <Info className="w-3 h-3" /> Master code for this demo: <span className="text-indigo-300 font-bold select-all">ADMIN_2024</span>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="password" required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Registration"}
        </button>
      </form>

      <p className="mt-8 text-center text-white/50 text-sm">
        Already have an admin account? <Link to="/admin/login" className="text-indigo-400 font-semibold hover:text-white transition-colors">Sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default AdminRegister;

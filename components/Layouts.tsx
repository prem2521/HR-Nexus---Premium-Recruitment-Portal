
import React, { useState, useEffect } from 'react';
import { User, LogOut, Clock, ShieldCheck, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AuthLayout: React.FC<{ children: React.ReactNode; infoTitle: string; infoText: string; testimonial: { name: string; role: string; text: string } }> = ({ children, infoTitle, infoText, testimonial }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl glass rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in duration-700">
        {/* Left Panel - Auth Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
           {children}
        </div>

        {/* Right Panel - Information */}
        <div className="w-full md:w-1/2 glass-dark p-8 md:p-16 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6 leading-tight">{infoTitle}</h2>
            <div className="glass p-6 rounded-2xl mb-12">
              <p className="text-lg italic text-white/80 mb-4">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-indigo-300">{testimonial.role}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-medium">{infoText}</h3>
              <div className="flex -space-x-3 overflow-hidden">
                {[1,2,3,4].map(i => (
                  <img key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-indigo-500" src={`https://picsum.photos/seed/${i+42}/100/100`} alt="" />
                ))}
                <div className="flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-indigo-500 bg-indigo-600 text-xs font-medium">
                  +12k
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 flex items-center gap-2 text-indigo-300 font-medium cursor-pointer hover:text-white transition-colors">
            <span>Get your dream job faster</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardLayout: React.FC<{ children: React.ReactNode; user: User }> = ({ children, user }) => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-transparent text-white p-4 md:p-8 font-sans">
      <nav className="glass rounded-2xl p-4 mb-8 flex justify-between items-center px-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500 rounded-lg shadow-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">HR NEXUS</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10">
            <Clock className="w-4 h-4 text-indigo-300" />
            <span className="text-sm font-medium tabular-nums">{time}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-[10px] uppercase tracking-widest text-indigo-300">{user.role.replace('_', ' ')}</p>
            </div>
            <img className="h-10 w-10 rounded-full border-2 border-indigo-500" src={`https://picsum.photos/seed/${user.id}/100/100`} alt="" />
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="animate-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>
    </div>
  );
};

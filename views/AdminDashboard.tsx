
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/Layouts';
import { User, CandidateProfile, CVMetadata } from '../types';
import { getCandidates, updateCandidateStatus, getCVs } from '../db';
import { composeInterviewEmail } from '../services/geminiService';
import { 
  Users, Search, Filter, Eye, CheckCircle, XCircle, Mail, 
  FileText, Download, Loader2, Sparkles, Send, X, Check
} from 'lucide-react';

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);
  const [showCV, setShowCV] = useState(false);
  const [cvContent, setCvContent] = useState<string | null>(null);
  const [isComposingEmail, setIsComposingEmail] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchCandidates();
    const interval = setInterval(fetchCandidates, 5000); // Real-time sync every 5s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchCandidates = () => {
    setCandidates(getCandidates());
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, status: 'VERIFIED' | 'REJECTED') => {
    updateCandidateStatus(id, status);
    fetchCandidates();
    setToast({ message: `Candidate marked as ${status.toLowerCase()}`, type: 'success' });
  };

  const handleViewCV = (candidate: CandidateProfile) => {
    const cvs = getCVs();
    const cv = cvs.find(v => v.candidateId === candidate.id);
    if (cv) {
      setCvContent(cv.content);
      setShowCV(true);
    } else {
      alert("No CV uploaded by this candidate.");
    }
  };

  const handleComposeWithAI = async (candidate: CandidateProfile) => {
    setIsGeneratingEmail(true);
    setIsComposingEmail(true);
    setSelectedCandidate(candidate);
    const content = await composeInterviewEmail(candidate.name, "Fullstack Developer");
    setEmailContent(content);
    setIsGeneratingEmail(false);
  };

  const handleSendEmail = async () => {
    if (!emailContent.trim()) {
      setToast({ message: "Email content cannot be empty", type: 'error' });
      return;
    }

    setIsSendingEmail(true);
    
    // Simulate API call to send email
    setTimeout(() => {
      setIsSendingEmail(false);
      setIsComposingEmail(false);
      setToast({ 
        message: `Interview invitation sent to ${selectedCandidate?.name}`, 
        type: 'success' 
      });
      // Optionally auto-verify candidate upon inviting
      if (selectedCandidate && selectedCandidate.status === 'PENDING') {
        updateCandidateStatus(selectedCandidate.id, 'VERIFIED');
        fetchCandidates();
      }
    }, 1500);
  };

  return (
    <DashboardLayout user={user}>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className={`glass px-6 py-3 rounded-2xl flex items-center gap-3 border shadow-2xl ${
            toast.type === 'success' ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'
          }`}>
            {toast.type === 'success' ? (
              <div className="bg-green-500 rounded-full p-1"><Check className="w-4 h-4 text-white" /></div>
            ) : (
              <div className="bg-red-500 rounded-full p-1"><X className="w-4 h-4 text-white" /></div>
            )}
            <span className="font-medium text-sm text-white">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            Recruitment Hub <Users className="text-indigo-400" />
          </h1>
          <p className="text-white/50">Tracking {candidates.length} active candidates in pipeline</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              className="w-full md:w-64 bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-white/5 border border-white/10 rounded-2xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-5 text-sm font-semibold uppercase tracking-wider text-white/70">Candidate</th>
                <th className="p-5 text-sm font-semibold uppercase tracking-wider text-white/70">Contact</th>
                <th className="p-5 text-sm font-semibold uppercase tracking-wider text-white/70">Status</th>
                <th className="p-5 text-sm font-semibold uppercase tracking-wider text-white/70">CV</th>
                <th className="p-5 text-sm font-semibold uppercase tracking-wider text-white/70 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCandidates.map(c => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <img className="h-10 w-10 rounded-xl border border-white/10" src={`https://picsum.photos/seed/${c.id}/100/100`} alt="" />
                      <div>
                        <p className="font-bold group-hover:text-indigo-400 transition-colors">{c.name}</p>
                        <p className="text-xs text-white/40">Joined {new Date(c.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="text-sm font-medium">{c.email}</p>
                    <p className="text-xs text-white/40">{c.countryCode} {c.phone}</p>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      c.status === 'VERIFIED' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 
                      c.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-5">
                    {c.cvUrl ? (
                      <button 
                        onClick={() => handleViewCV(c)}
                        className="p-2 bg-indigo-500/20 hover:bg-indigo-500/40 rounded-lg transition-all text-indigo-400 flex items-center gap-2 text-xs font-bold"
                      >
                        <FileText className="w-4 h-4" /> View PDF
                      </button>
                    ) : (
                      <span className="text-xs text-white/20 italic">No Upload</span>
                    )}
                  </td>
                  <td className="p-5 text-right space-x-2">
                    <button 
                      title="Invite for Interview"
                      onClick={() => handleComposeWithAI(c)}
                      className="p-2 bg-indigo-500/20 hover:bg-indigo-500 text-white rounded-lg transition-all group-hover:scale-110"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                    {c.status !== 'VERIFIED' && (
                      <button 
                        onClick={() => handleStatusChange(c.id, 'VERIFIED')}
                        className="p-2 bg-green-500/10 hover:bg-green-500 text-white rounded-lg transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {c.status !== 'REJECTED' && (
                      <button 
                        onClick={() => handleStatusChange(c.id, 'REJECTED')}
                        className="p-2 bg-red-500/10 hover:bg-red-500 text-white rounded-lg transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-white/30 italic">No candidates found matching criteria</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CV Viewer Modal */}
      {showCV && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-4xl h-[80vh] bg-slate-900 rounded-3xl overflow-hidden flex flex-col border border-white/20 shadow-2xl no-select">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-xl font-bold flex items-center gap-2"><FileText /> Secure Document Viewer</h3>
              <div className="flex gap-4">
                 <a href={cvContent!} download="resume.pdf" className="p-2 hover:bg-white/10 rounded-lg text-indigo-400">
                    <Download className="w-5 h-5" />
                 </a>
                 <button onClick={() => setShowCV(false)} className="p-2 hover:bg-white/10 rounded-lg"><X /></button>
              </div>
            </div>
            <div className="flex-grow bg-slate-800 p-8 overflow-auto flex justify-center">
               <div className="w-full max-w-3xl aspect-[1/1.4] bg-white text-slate-900 p-12 shadow-2xl relative">
                  {/* Visual Watermark */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.05] rotate-[-45deg] select-none text-4xl font-black text-black uppercase">
                     Confidential HR Nexus Review • HR Nexus • {user.name}
                  </div>
                  
                  <div className="mb-8 border-b-2 border-slate-200 pb-4">
                    <h1 className="text-3xl font-bold uppercase tracking-tighter">Professional Resume</h1>
                    <p className="text-slate-500">Security Encrypted Document View</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-indigo-600 mb-2">EXPERIENCE</h2>
                      <div className="border-l-4 border-slate-100 pl-4 space-y-4">
                        <div>
                          <p className="font-bold">Senior Software Engineer</p>
                          <p className="text-sm text-slate-500 italic">Big Tech Corp | 2020 - Present</p>
                          <p className="text-sm mt-1">Leading high-impact frontend architecture for cloud-native applications using React and Tailwind.</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-indigo-600 mb-2">SKILLS</h2>
                      <div className="flex flex-wrap gap-2">
                        {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL'].map(s => (
                          <span key={s} className="bg-slate-100 px-3 py-1 rounded text-xs font-semibold">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
               </div>
            </div>
            <div className="p-4 text-center text-xs text-white/30 italic">
              Security Notice: This document is served via encrypted tunnel. Screenshots and prints are logged.
            </div>
          </div>
        </div>
      )}

      {/* AI Email Composer Modal */}
      {isComposingEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in zoom-in duration-300">
          <div className="w-full max-w-2xl glass rounded-3xl overflow-hidden shadow-2xl border border-indigo-500/30">
            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 flex justify-between items-center">
               <h3 className="text-xl font-bold flex items-center gap-2"><Sparkles className="w-5 h-5" /> AI Interview Composer</h3>
               <button onClick={() => setIsComposingEmail(false)} className="p-2 hover:bg-white/20 rounded-lg"><X /></button>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-indigo-300">Drafting invitation for <span className="text-white font-bold">{selectedCandidate?.name}</span></p>
                <span className="text-[10px] text-white/30 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Flash 2.5 Preview</span>
              </div>
              
              <div className="relative mb-6">
                <textarea 
                  className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none font-mono"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  disabled={isGeneratingEmail || isSendingEmail}
                ></textarea>
                {isGeneratingEmail && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-2xl">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                      <p className="text-sm font-medium animate-pulse">Gemini AI is thinking...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <button 
                  onClick={() => handleComposeWithAI(selectedCandidate!)}
                  disabled={isGeneratingEmail || isSendingEmail}
                  className="flex items-center gap-2 text-sm text-indigo-400 hover:text-white transition-colors disabled:opacity-30"
                >
                  <Sparkles className="w-4 h-4" /> Regenerate with AI
                </button>
                <button 
                  onClick={handleSendEmail}
                  disabled={isGeneratingEmail || isSendingEmail || !emailContent}
                  className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 disabled:opacity-50 px-8 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Invite
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;

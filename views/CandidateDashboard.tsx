
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/Layouts';
import { User, CandidateProfile, CVMetadata } from '../types';
import { getCandidates, saveCandidateProfile, saveCV } from '../db';
// Added Briefcase to the imports
import { FileUp, FileText, CheckCircle, Clock, AlertCircle, Info, Briefcase } from 'lucide-react';

const CandidateDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const p = getCandidates().find(c => c.id === user.id);
    if (p) setProfile(p);
  }, [user]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setMessage('Only PDF files are allowed.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const cvMetadata: CVMetadata = {
        id: Math.random().toString(36).substr(2, 9),
        candidateId: user.id,
        fileName: file.name,
        uploadDate: Date.now(),
        content: content
      };

      saveCV(cvMetadata);
      const updatedProfile = { 
        ...profile!, 
        cvUrl: cvMetadata.id, 
        cvFileName: file.name, 
        lastUpdated: Date.now() 
      };
      saveCandidateProfile(updatedProfile);
      setProfile(updatedProfile);
      setMessage('CV Uploaded successfully!');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const getStatusIcon = () => {
    switch(profile?.status) {
      case 'VERIFIED': return <CheckCircle className="w-8 h-8 text-green-400" />;
      case 'REJECTED': return <AlertCircle className="w-8 h-8 text-red-400" />;
      default: return <Clock className="w-8 h-8 text-yellow-400" />;
    }
  };

  const getStatusText = () => {
    switch(profile?.status) {
      case 'VERIFIED': return 'Verified by HR';
      case 'REJECTED': return 'Rejected';
      default: return 'Pending Review';
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass p-8 rounded-3xl text-center">
             <div className="relative inline-block mb-4">
                <img className="h-24 w-24 rounded-3xl border-4 border-white/20 shadow-2xl mx-auto" src={`https://picsum.photos/seed/${user.id}/200/200`} alt="" />
                <div className="absolute -bottom-2 -right-2 p-1.5 bg-green-500 rounded-lg border-2 border-indigo-900">
                  <CheckCircle className="w-4 h-4" />
                </div>
             </div>
             <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
             <p className="text-white/50 text-sm mb-6 uppercase tracking-wider">{user.countryCode} {user.phone}</p>
             
             <div className="flex flex-col items-center p-6 bg-white/5 rounded-2xl border border-white/10">
                {getStatusIcon()}
                <p className="mt-2 font-semibold text-lg">{getStatusText()}</p>
                <p className="text-xs text-white/40 mt-1">Application submitted on {new Date(user.createdAt).toLocaleDateString()}</p>
             </div>
          </div>

          <div className="glass p-8 rounded-3xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-400" /> Tips for Success
            </h3>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                Keep your CV updated with your latest projects.
              </li>
              <li className="flex gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                Add a professional profile picture.
              </li>
              <li className="flex gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                Ensure your contact information is correct.
              </li>
            </ul>
          </div>
        </div>

        {/* CV Management */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-3xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Briefcase className="w-32 h-32" />
             </div>
             <h2 className="text-2xl font-bold mb-6">Manage Your Resume</h2>
             
             {profile?.cvUrl ? (
               <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-500/20 rounded-xl">
                      <FileText className="w-8 h-8 text-red-400" />
                    </div>
                    <div>
                      <p className="font-semibold">{profile.cvFileName}</p>
                      <p className="text-xs text-white/40">Uploaded on {new Date(profile.lastUpdated).toLocaleDateString()}</p>
                    </div>
                 </div>
                 <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-6 py-2 rounded-xl text-sm transition-all border border-white/10">
                   Update CV
                   <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                 </label>
               </div>
             ) : (
               <div className="border-2 border-dashed border-white/20 rounded-3xl p-12 text-center flex flex-col items-center">
                 <div className="p-4 bg-indigo-500/20 rounded-2xl mb-4">
                    <FileUp className="w-10 h-10 text-indigo-400" />
                 </div>
                 <h3 className="text-xl font-bold mb-2">Upload your first CV</h3>
                 <p className="text-white/40 mb-6 max-w-xs">Maximize your visibility by sharing your experience with our recruitment team.</p>
                 <label className="cursor-pointer bg-gradient-to-r from-indigo-500 to-indigo-600 hover:scale-105 px-8 py-3 rounded-full font-bold shadow-lg transition-all">
                   Select PDF File
                   <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                 </label>
               </div>
             )}

             {isUploading && <p className="mt-4 text-indigo-400 animate-pulse text-sm text-center">Encrypting and uploading your document...</p>}
             {message && <p className="mt-4 text-green-400 text-sm text-center">{message}</p>}
          </div>

          <div className="glass p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6">Job Recommendations</h2>
            <div className="space-y-4">
              {[
                { title: 'Senior Frontend Developer', company: 'TechNexus', location: 'Remote', salary: '$120k - $160k' },
                { title: 'UX/UI Architect', company: 'DesignCo', location: 'New York, NY', salary: '$110k - $140k' },
                { title: 'Software Engineer (React)', company: 'Globex', location: 'London, UK', salary: '£70k - £90k' }
              ].map((job, i) => (
                <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-300">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold group-hover:text-indigo-400 transition-colors">{job.title}</h4>
                      <p className="text-xs text-white/50">{job.company} • {job.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{job.salary}</p>
                    <button className="text-xs text-indigo-400 hover:underline">View details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CandidateDashboard;

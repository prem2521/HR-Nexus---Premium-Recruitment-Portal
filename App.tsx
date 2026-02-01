
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import CandidateLogin from './views/CandidateLogin';
import CandidateRegister from './views/CandidateRegister';
import CandidateDashboard from './views/CandidateDashboard';
import AdminLogin from './views/AdminLogin';
import AdminRegister from './views/AdminRegister';
import AdminDashboard from './views/AdminDashboard';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('current_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  // Updated ProtectedRoute type to handle children correctly in modern React/TS environments
  const ProtectedRoute = ({ children, role }: { children?: React.ReactNode; role: string }) => {
    if (!user) return <Navigate to="/" />;
    if (user.role !== role) return <Navigate to={user.role === 'HR_ADMIN' ? '/admin/dashboard' : '/candidate/dashboard'} />;
    return <>{children}</>;
  };

  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<CandidateLogin setUser={setUser} />} />
        <Route path="/candidate/register" element={<CandidateRegister />} />
        <Route path="/admin/login" element={<AdminLogin setUser={setUser} />} />
        <Route path="/admin/register" element={<AdminRegister setUser={setUser} />} />

        {/* Protected Candidate Routes */}
        <Route 
          path="/candidate/dashboard" 
          element={
            <ProtectedRoute role="CANDIDATE">
              <CandidateDashboard user={user!} />
            </ProtectedRoute>
          } 
        />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute role="HR_ADMIN">
              <AdminDashboard user={user!} />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;

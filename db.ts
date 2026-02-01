
import { User, CandidateProfile, CVMetadata, Role } from './types';

const USERS_KEY = 'hr_nexus_users';
const CANDIDATES_KEY = 'hr_nexus_candidates';
const CV_KEY = 'hr_nexus_cvs';

export const saveUser = (user: User) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCandidateProfile = (profile: CandidateProfile) => {
  const candidates = getCandidates();
  const index = candidates.findIndex(c => c.id === profile.id);
  if (index !== -1) {
    candidates[index] = profile;
  } else {
    candidates.push(profile);
  }
  localStorage.setItem(CANDIDATES_KEY, JSON.stringify(candidates));
};

export const getCandidates = (): CandidateProfile[] => {
  const data = localStorage.getItem(CANDIDATES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCV = (cv: CVMetadata) => {
  const cvs = getCVs();
  cvs.push(cv);
  localStorage.setItem(CV_KEY, JSON.stringify(cvs));
};

export const getCVs = (): CVMetadata[] => {
  const data = localStorage.getItem(CV_KEY);
  return data ? JSON.parse(data) : [];
};

export const getCandidateByEmail = (email: string) => {
  return getCandidates().find(c => c.email === email);
};

export const getUserById = (id: string) => {
  return getUsers().find(u => u.id === id);
};

export const updateCandidateStatus = (id: string, status: 'VERIFIED' | 'REJECTED') => {
  const candidates = getCandidates();
  const index = candidates.findIndex(c => c.id === id);
  if (index !== -1) {
    candidates[index].status = status;
    candidates[index].lastUpdated = Date.now();
    localStorage.setItem(CANDIDATES_KEY, JSON.stringify(candidates));
  }
};

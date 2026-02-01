
export type Role = 'CANDIDATE' | 'HR_ADMIN';

export type CandidateStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  countryCode?: string;
  createdAt: number;
}

export interface CandidateProfile extends User {
  status: CandidateStatus;
  cvUrl?: string;
  cvFileName?: string;
  lastUpdated: number;
}

export interface CVMetadata {
  id: string;
  candidateId: string;
  fileName: string;
  uploadDate: number;
  content: string; // Base64 content for simulation
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: number;
}

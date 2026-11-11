export interface Nominee {
  id: string;
  name: string;
  category: string;
  image: string;
  genre: string;
  hometown: string;
  bio: string;
  keyHits: string[];
  votes: number;
}

export interface ShareTasks {
  contact1: boolean;
  contact2: boolean;
  contact3: boolean;
  group1: boolean;
  group2: boolean;
}

export interface VoterSession {
  id: string;
  voterPhone?: string;
  clientIpHash: string;
  stage: 1 | 2 | 3 | 'completed';
  votedArtistIds: string[];
  sharesCompleted: ShareTasks;
  createdAt: string;
  lastActiveAt: string;
}

export interface VoteRecord {
  id: string;
  sessionId: string;
  artistId: string;
  artistName: string;
  stageNumber: 1 | 2 | 3;
  timestamp: string;
  clientIpHash: string;
}

export interface Settings {
  votingOpen: boolean;
  showLiveResults: boolean;
  ceremonyDate: string;
  adminPasscode: string;
  categoryName: string;
  editionYear: number;
  announcement?: string;
}

export interface AuditLogEntry {
  id: string;
  event: string;
  detail: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'alert';
}

export interface DatabaseSchema {
  nominees: Nominee[];
  voterSessions: Record<string, VoterSession>;
  votes: VoteRecord[];
  settings: Settings;
  auditLogs: AuditLogEntry[];
}

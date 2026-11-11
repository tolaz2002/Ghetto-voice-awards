import fs from 'fs';
import path from 'path';
import { DatabaseSchema, Nominee, VoterSession, VoteRecord, Settings, AuditLogEntry, ShareTasks } from './types';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'ghetto_voice_db.json');

const INITIAL_NOMINEES: Nominee[] = [
  {
    id: 'junior-spragga',
    name: 'JUNIOR SPRAGGA',
    category: 'BEST MALE ARTIST OF THE YEAR 2026',
    image: '/images/junior-spragga.jpg',
    genre: 'Zimdancehall / Urban Reggae',
    hometown: 'Mbare, Harare',
    bio: 'Pioneering heavy basslines, street anthems, and conscious dancehall lyricism straight from the heart of Mbare.',
    keyHits: ['Ghetto Youth Cry', 'Gore Rino', 'Street Cred', 'Moto Mumastreets'],
    votes: 4892,
  },
  {
    id: 'hulengende',
    name: 'HULENGENDE',
    category: 'BEST MALE ARTIST OF THE YEAR 2026',
    image: '/images/hulengende.jpg',
    genre: 'Afro-Urban / High Energy Vocalist',
    hometown: 'Chitungwiza',
    bio: 'Electrifying vocal powerhouse known for dynamic stage mastery and chart-topping street celebrations across Zimbabwe.',
    keyHits: ['Zvakaramba', 'Kana Ndinaye', 'Tipei Masimba', 'Chitown Anthem'],
    votes: 4621,
  },
  {
    id: 'sane-wav',
    name: 'SANE WAV',
    category: 'BEST MALE ARTIST OF THE YEAR 2026',
    image: '/images/sane-wav.jpg',
    genre: 'Zim Hip Hop / New Wave',
    hometown: 'Bulawayo & Harare',
    bio: 'Architect of the new wave Zimbabwean street sound, bridging authentic ghetto reality with futuristic hip-hop cadence.',
    keyHits: ['Wav Tape', 'Highfield Nights', 'No Cap', 'Ghetto Royalty'],
    votes: 4385,
  },
  {
    id: 'shona-prince',
    name: 'SHONA PRINCE',
    category: 'BEST MALE ARTIST OF THE YEAR 2026',
    image: '/images/shona-prince.jpg',
    genre: 'Contemporary Urban Afro-Soul',
    hometown: 'Glen View, Harare',
    bio: 'Charismatic storyteller weaving Shona cultural resonance, modern melodies, and unapologetic street pride into global hits.',
    keyHits: ['Mambokadzi', 'Kumusha', 'City Lights', 'Rudo Rwamastreets'],
    votes: 4190,
  },
  {
    id: 'madededo',
    name: 'MADEDEDO',
    category: 'BEST MALE ARTIST OF THE YEAR 2026',
    image: '/images/madededo.jpg',
    genre: 'Zimdancehall Fire Chanter',
    hometown: 'Dzivarasekwa, Harare',
    bio: 'Unstoppable lyrical machine known for rapid-fire rhymes, raw street energy, and infectious viral party anthems.',
    keyHits: ['Bhebhi Rangu', 'Mastreets', 'Ghetto Anthem', 'Kutsvaga Mari'],
    votes: 3944,
  },
  {
    id: 'suhn',
    name: 'SUHN',
    category: 'BEST MALE ARTIST OF THE YEAR 2026',
    image: '/images/suhn.jpg',
    genre: 'Afro-Fusion / Alternative Street Soul',
    hometown: 'Highfield, Harare',
    bio: 'Visionary artist blending soul-stirring live instrumentation with poetic commentary on youth struggle, hope, and victory.',
    keyHits: ['Nzwisiso', 'Roots & Culture', 'Chiedza', 'Tamba'],
    votes: 3718,
  },
];

const INITIAL_SETTINGS: Settings = {
  votingOpen: true,
  showLiveResults: true,
  ceremonyDate: '2026-12-19T19:00:00+02:00',
  adminPasscode: 'ghetto2026',
  categoryName: 'BEST MALE ARTIST OF THE YEAR 2026',
  editionYear: 2026,
  announcement: 'Voting for Best Male Artist of the Year 2026 is officially LIVE. Cast your 3 votes!',
};

function initDb(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.nominees && parsed.settings) {
        return parsed;
      }
    } catch {
      // Fallback if corrupted
    }
  }

  const initialDb: DatabaseSchema = {
    nominees: INITIAL_NOMINEES,
    voterSessions: {},
    votes: [],
    settings: INITIAL_SETTINGS,
    auditLogs: [
      {
        id: 'log-seed-1',
        event: 'AWARDS_INITIALIZED',
        detail: 'The Ghetto Voice Awards 2026 voting database seeded with 6 official nominees.',
        timestamp: new Date().toISOString(),
        severity: 'info',
      },
    ],
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write initial db file:', err);
  }

  return initialDb;
}

export function getDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading DB, returning fresh state:', err);
  }
  return initDb();
}

export function saveDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

export function getNominees(): Nominee[] {
  const db = getDb();
  return db.nominees;
}

export function getSettings(): Settings {
  const db = getDb();
  return db.settings;
}

export function updateSettings(partial: Partial<Settings>): Settings {
  const db = getDb();
  db.settings = { ...db.settings, ...partial };
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    event: 'SETTINGS_UPDATED',
    detail: `Settings changed: ${Object.keys(partial).join(', ')}`,
    timestamp: new Date().toISOString(),
    severity: 'info',
  });
  saveDb(db);
  return db.settings;
}

export function getVoterSession(sessionId: string): VoterSession | null {
  const db = getDb();
  return db.voterSessions[sessionId] || null;
}

export function createOrGetSession(sessionId: string, ipHash: string, phone?: string): VoterSession {
  const db = getDb();
  if (db.voterSessions[sessionId]) {
    const existing = db.voterSessions[sessionId];
    existing.lastActiveAt = new Date().toISOString();
    if (phone && !existing.voterPhone) {
      existing.voterPhone = phone;
    }
    saveDb(db);
    return existing;
  }

  const newSession: VoterSession = {
    id: sessionId,
    voterPhone: phone,
    clientIpHash: ipHash,
    stage: 1,
    votedArtistIds: [],
    sharesCompleted: {
      contact1: false,
      contact2: false,
      contact3: false,
      group1: false,
      group2: false,
    },
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  };

  db.voterSessions[sessionId] = newSession;
  saveDb(db);
  return newSession;
}

export function recordFirstVote(sessionId: string, artistId: string, ipHash: string): { success: boolean; message: string; session?: VoterSession } {
  const db = getDb();
  if (!db.settings.votingOpen) {
    return { success: false, message: 'Voting is currently closed by the awards committee.' };
  }

  const session = db.voterSessions[sessionId];
  if (!session) {
    return { success: false, message: 'Invalid voting session. Please refresh the page.' };
  }

  if (session.stage !== 1) {
    return { success: false, message: 'First vote has already been submitted for this session.' };
  }

  const nominee = db.nominees.find((n) => n.id === artistId);
  if (!nominee) {
    return { success: false, message: 'Selected nominee not found.' };
  }

  // Record vote
  nominee.votes += 1;
  session.votedArtistIds = [artistId];
  session.stage = 2; // Unlock WhatsApp stage
  session.lastActiveAt = new Date().toISOString();

  const voteRecord: VoteRecord = {
    id: `vote-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    sessionId,
    artistId,
    artistName: nominee.name,
    stageNumber: 1,
    timestamp: new Date().toISOString(),
    clientIpHash: ipHash,
  };
  db.votes.unshift(voteRecord);

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    event: 'FIRST_VOTE_CAST',
    detail: `Vote #1 recorded for ${nominee.name} (Session: ${sessionId.slice(0, 8)}...)`,
    timestamp: new Date().toISOString(),
    severity: 'info',
  });

  saveDb(db);
  return { success: true, message: 'Your first vote has been successfully submitted!', session };
}

export function recordShareTask(sessionId: string, taskKey: keyof ShareTasks): { success: boolean; allCompleted: boolean; session?: VoterSession } {
  const db = getDb();
  const session = db.voterSessions[sessionId];
  if (!session) {
    return { success: false, allCompleted: false };
  }

  if (!session.sharesCompleted) {
    session.sharesCompleted = {
      contact1: false,
      contact2: false,
      contact3: false,
      group1: false,
      group2: false,
    };
  }

  session.sharesCompleted[taskKey] = true;
  session.lastActiveAt = new Date().toISOString();

  const tasks = session.sharesCompleted;
  const completedCount = Object.values(tasks).filter(Boolean).length;
  const allCompleted = completedCount === 5;

  if (allCompleted && session.stage === 2) {
    session.stage = 3; // Unlocked final two votes
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      event: 'WHATSAPP_TASKS_COMPLETED',
      detail: `Session ${sessionId.slice(0, 8)}... completed all 5 WhatsApp shares and unlocked Stage 3.`,
      timestamp: new Date().toISOString(),
      severity: 'info',
    });
  }

  saveDb(db);
  return { success: true, allCompleted, session };
}

export function recordFinalVotes(sessionId: string, artistIds: string[], ipHash: string): { success: boolean; message: string; session?: VoterSession } {
  const db = getDb();
  if (!db.settings.votingOpen) {
    return { success: false, message: 'Voting is currently closed.' };
  }

  const session = db.voterSessions[sessionId];
  if (!session) {
    return { success: false, message: 'Invalid voting session.' };
  }

  if (session.stage !== 3) {
    return { success: false, message: 'You must complete the WhatsApp sharing requirements before unlocking final votes.' };
  }

  if (artistIds.length !== 2) {
    return { success: false, message: 'Please select exactly TWO different artists.' };
  }

  const [id1, id2] = artistIds;
  if (id1 === id2) {
    return { success: false, message: 'You cannot select the same artist twice.' };
  }

  if (session.votedArtistIds.includes(id1) || session.votedArtistIds.includes(id2)) {
    return { success: false, message: 'You have already voted for one of these artists in Stage 1.' };
  }

  const nominee1 = db.nominees.find((n) => n.id === id1);
  const nominee2 = db.nominees.find((n) => n.id === id2);

  if (!nominee1 || !nominee2) {
    return { success: false, message: 'One or more selected artists were not found.' };
  }

  nominee1.votes += 1;
  nominee2.votes += 1;

  session.votedArtistIds.push(id1, id2);
  session.stage = 'completed';
  session.lastActiveAt = new Date().toISOString();

  db.votes.unshift(
    {
      id: `vote-${Date.now()}-2`,
      sessionId,
      artistId: id1,
      artistName: nominee1.name,
      stageNumber: 2,
      timestamp: new Date().toISOString(),
      clientIpHash: ipHash,
    },
    {
      id: `vote-${Date.now()}-3`,
      sessionId,
      artistId: id2,
      artistName: nominee2.name,
      stageNumber: 3,
      timestamp: new Date().toISOString(),
      clientIpHash: ipHash,
    }
  );

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    event: 'FINAL_VOTES_CAST',
    detail: `Final votes cast for ${nominee1.name} and ${nominee2.name}. Session completed 3/3 votes.`,
    timestamp: new Date().toISOString(),
    severity: 'info',
  });

  saveDb(db);
  return { success: true, message: 'Thank you for supporting Zimbabwean music! All 3 votes recorded.', session };
}

export function getStats() {
  const db = getDb();
  const totalVotes = db.nominees.reduce((acc, curr) => acc + curr.votes, 0);
  const totalSessions = Object.keys(db.voterSessions).length;
  const completedSessions = Object.values(db.voterSessions).filter((s) => s.stage === 'completed').length;
  const stage2Sessions = Object.values(db.voterSessions).filter((s) => s.stage === 2).length;
  const stage3Sessions = Object.values(db.voterSessions).filter((s) => s.stage === 3).length;

  let totalShares = 0;
  Object.values(db.voterSessions).forEach((s) => {
    if (s.sharesCompleted) {
      totalShares += Object.values(s.sharesCompleted).filter(Boolean).length;
    }
  });

  // Calculate sorted rankings
  const rankings = [...db.nominees]
    .sort((a, b) => b.votes - a.votes)
    .map((nominee, index) => {
      const percentage = totalVotes > 0 ? ((nominee.votes / totalVotes) * 100).toFixed(1) : '0.0';
      return {
        ...nominee,
        rank: index + 1,
        percentage: parseFloat(percentage),
      };
    });

  return {
    totalVotes,
    totalSessions,
    completedSessions,
    stage2Sessions,
    stage3Sessions,
    totalShares,
    rankings,
    settings: db.settings,
    recentVotes: db.votes.slice(0, 30),
    auditLogs: db.auditLogs.slice(0, 40),
  };
}

export function updateNomineeData(id: string, updates: Partial<Nominee>): boolean {
  const db = getDb();
  const nominee = db.nominees.find((n) => n.id === id);
  if (!nominee) return false;
  Object.assign(nominee, updates);
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    event: 'NOMINEE_UPDATED',
    detail: `Nominee ${nominee.name} updated.`,
    timestamp: new Date().toISOString(),
    severity: 'info',
  });
  saveDb(db);
  return true;
}

export function resetDemo(): void {
  const db = initDb();
  db.nominees = INITIAL_NOMINEES.map((n) => ({ ...n }));
  db.voterSessions = {};
  db.votes = [];
  db.settings = { ...INITIAL_SETTINGS };
  db.auditLogs = [
    {
      id: `log-${Date.now()}`,
      event: 'SYSTEM_RESET',
      detail: 'System and voting numbers reset to official baseline configuration.',
      timestamp: new Date().toISOString(),
      severity: 'warning',
    },
  ];
  saveDb(db);
}

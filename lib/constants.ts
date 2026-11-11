import { Nominee } from './types';

export const OFFICIAL_NOMINEES: Nominee[] = [
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

export const INITIAL_RANKINGS = [...OFFICIAL_NOMINEES]
  .sort((a, b) => b.votes - a.votes)
  .map((nominee, index) => {
    const totalVotes = OFFICIAL_NOMINEES.reduce((acc, curr) => acc + curr.votes, 0);
    const percentage = totalVotes > 0 ? parseFloat(((nominee.votes / totalVotes) * 100).toFixed(1)) : 0;
    return {
      ...nominee,
      rank: index + 1,
      percentage,
    };
  });

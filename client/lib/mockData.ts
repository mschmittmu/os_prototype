export interface Episode {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  category: string;
  thumbnail?: string;
}

export interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    tier: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
  saved: boolean;
}

export interface CrewMessage {
  id: string;
  type: "message" | "achievement" | "challenge";
  author?: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  icon?: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Extreme";
  progress: number;
  participants: number;
  active: boolean;
}

export interface ExecutionChallenge {
  id: string;
  title: string;
  durationDays: number;
  xpReward: number;
  daysCompleted: number;
  totalDays: number;
  startDate: string;
  doneToday: boolean;
  status: "current" | "past";
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

export const executionChallenges: ExecutionChallenge[] = [
  {
    id: "ec1",
    title: "90-Minute Deep Work Immersion",
    durationDays: 3,
    xpReward: 600,
    daysCompleted: 1,
    totalDays: 3,
    startDate: "Jan. 8, 2026",
    doneToday: true,
    status: "current",
  },
  {
    id: "ec2",
    title: "The 3-Day Iron Will Workout",
    durationDays: 3,
    xpReward: 600,
    daysCompleted: 2,
    totalDays: 3,
    startDate: "Jan. 7, 2026",
    doneToday: true,
    status: "current",
  },
  {
    id: "ec3",
    title: "The 90-Minute Deep Work Blitz",
    durationDays: 3,
    xpReward: 600,
    daysCompleted: 3,
    totalDays: 3,
    startDate: "Jan. 4, 2026",
    doneToday: false,
    status: "past",
  },
  {
    id: "ec4",
    title: "7-Day Cold Shower Challenge",
    durationDays: 7,
    xpReward: 1000,
    daysCompleted: 7,
    totalDays: 7,
    startDate: "Dec. 28, 2025",
    doneToday: false,
    status: "past",
  },
];

export const journalEntries: JournalEntry[] = [
  {
    id: "j1",
    date: "2026-01-08",
    content: `Big move made yesterday. We hired the new agency for shoperator. I have to fire my old team now.

They just weren't moving fast enough with enough skills to handle what needs to be done.

My next plan is to ensure this new team has the standard from the start. Clear road map.

Fix bugs
New features
Build the best damn image generation tool on the planet

Point and click acceleration for the clients.`,
  },
  {
    id: "j2",
    date: "2026-01-07",
    content: `Focus today was on eliminating distractions. Turned off all notifications except for essential apps.

The morning routine is locked in. 4:30 AM wake up, cold shower, workout, then deep work block before anyone else is awake.

This is where the magic happens. The early hours belong to me.`,
  },
  {
    id: "j3",
    date: "2026-01-06",
    content: `Reflection day. Looking back at Q4 performance and setting intentions for Q1.

Key wins from last quarter:
- Launched two new products
- Revenue up 34%
- Built the team to 12 people

Areas for improvement:
- Better delegation
- More time with family
- Sleep consistency`,
  },
];

export const episodes: Episode[] = [
  {
    id: "1",
    title: "The Cost of Discipline",
    description: "Why discipline is the bridge between goals and accomplishment. Learn the true cost of staying committed.",
    duration: "45:23",
    progress: 75,
    category: "Operator Standard",
  },
  {
    id: "2",
    title: "Morning Routines That Win",
    description: "How the first hour of your day determines the other 23. Build an unshakeable morning routine.",
    duration: "38:15",
    progress: 0,
    category: "Operator Standard",
  },
  {
    id: "3",
    title: "Eliminate Weakness",
    description: "Identifying and ruthlessly eliminating the weak points in your life that hold you back.",
    duration: "52:08",
    progress: 30,
    category: "MFCEO Project",
  },
  {
    id: "4",
    title: "The Brotherhood Code",
    description: "Why surrounding yourself with winners is non-negotiable for your success.",
    duration: "41:45",
    progress: 0,
    category: "MFCEO Project",
  },
  {
    id: "5",
    title: "Physical Excellence",
    description: "Your body is your first business. Train it like your life depends on it.",
    duration: "28:30",
    progress: 0,
    category: "Shorts",
  },
];

export interface Announcement {
  id: string;
  author: {
    name: string;
    avatar?: string;
    tier: string;
    verified: boolean;
  };
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
  saved: boolean;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    tier: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
}

export const announcements: Announcement[] = [
  {
    id: "a1",
    author: { name: "Andy Frisella", tier: "Creator", verified: true },
    content: "Listen up. The reason you're not where you want to be isn't because of circumstances. It's because you haven't decided to become unstoppable. Make that decision TODAY. The Power List isn't just a productivity tool - it's a commitment device. 5 tasks. Every. Single. Day. Win the day or admit defeat.",
    likes: 4523,
    comments: 892,
    timestamp: "3h ago",
    liked: false,
    saved: false,
  },
  {
    id: "a2",
    author: { name: "Andy Frisella", tier: "Creator", verified: true },
    content: "New challenge dropping next week: LIVE HARD. This is for those of you who have completed 75 Hard and want to take it to the next level. Prepare yourselves mentally. This will separate the operators from the pretenders.",
    likes: 3891,
    comments: 567,
    timestamp: "1d ago",
    liked: false,
    saved: false,
  },
  {
    id: "a3",
    author: { name: "Andy Frisella", tier: "Creator", verified: true },
    content: "Your comfort zone is a prison. Every time you choose comfort over growth, you're building the walls higher. Break out. The Operator Standard exists because average is unacceptable. You didn't download this app to be average.",
    likes: 5234,
    comments: 1023,
    timestamp: "2d ago",
    liked: false,
    saved: false,
  },
  {
    id: "a4",
    author: { name: "Andy Frisella", tier: "Creator", verified: true },
    content: "Shoutout to everyone who has maintained a streak of 30+ days on the Power List. You are proving that discipline beats motivation every single time. Keep executing. The standard owns you now - and that's exactly where you want to be.",
    likes: 6712,
    comments: 1456,
    timestamp: "3d ago",
    liked: false,
    saved: false,
  },
];

export const sampleComments: Record<string, Comment[]> = {
  "1": [
    { id: "c1", author: { name: "Jake Thornton", tier: "Operator" }, content: "Absolute beast mode. Keep crushing it!", timestamp: "1h ago", likes: 12, liked: false },
    { id: "c2", author: { name: "Chris Walsh", tier: "Elite" }, content: "Day 45 is where the real transformation begins. Stay hard.", timestamp: "2h ago", likes: 8, liked: false },
  ],
  "2": [
    { id: "c3", author: { name: "Marcus Steel", tier: "Founder" }, content: "That's what I'm talking about! Proof that the grind works.", timestamp: "3h ago", likes: 24, liked: false },
    { id: "c4", author: { name: "David Carter", tier: "Member" }, content: "Inspiration for all of us. Congrats on the deal!", timestamp: "4h ago", likes: 15, liked: false },
  ],
  "a1": [
    { id: "c5", author: { name: "Marcus Steel", tier: "Founder" }, content: "This is why we're here. The Power List changed my life.", timestamp: "2h ago", likes: 89, liked: false },
    { id: "c6", author: { name: "Jake Thornton", tier: "Operator" }, content: "Day 127 of winning the day. No looking back.", timestamp: "2h ago", likes: 67, liked: false },
    { id: "c7", author: { name: "Chris Walsh", tier: "Elite" }, content: "The decision IS the turning point. Facts.", timestamp: "3h ago", likes: 45, liked: false },
  ],
};

export const posts: Post[] = [
  {
    id: "1",
    author: { name: "Marcus Steel", tier: "Founder" },
    content: "Day 45 of the 75 Hard challenge. The physical transformation is secondary to the mental fortitude being built. Stay hard.",
    likes: 234,
    comments: 45,
    timestamp: "2h ago",
    liked: false,
    saved: false,
  },
  {
    id: "2",
    author: { name: "Jake Thornton", tier: "Operator" },
    content: "Just closed my biggest deal ever. 6 months of grinding, early mornings, and zero excuses. The standard owns you now.",
    likes: 567,
    comments: 89,
    timestamp: "4h ago",
    liked: true,
    saved: false,
  },
  {
    id: "3",
    author: { name: "Chris Walsh", tier: "Elite" },
    content: "Reminder: Your competition is not sleeping. Neither should your work ethic. Execute or be executed.",
    likes: 892,
    comments: 124,
    timestamp: "6h ago",
    liked: false,
    saved: true,
  },
  {
    id: "4",
    author: { name: "David Carter", tier: "Member" },
    content: "First week with the Power List. Completed 5/5 every day. This accountability system is game-changing. Thank you operators.",
    likes: 145,
    comments: 32,
    timestamp: "8h ago",
    liked: false,
    saved: false,
  },
];

export const crewMessages: CrewMessage[] = [
  {
    id: "1",
    type: "achievement",
    content: "Marcus Steel completed the 75 Hard Challenge",
    timestamp: "10 min ago",
    icon: "award",
  },
  {
    id: "2",
    type: "message",
    author: { name: "Jake Thornton" },
    content: "Anyone else crushing their morning routine? 4:30 AM club checking in.",
    timestamp: "15 min ago",
  },
  {
    id: "3",
    type: "message",
    author: { name: "Chris Walsh" },
    content: "Just hit a new PR on deadlifts. 505 lbs. Physical excellence is non-negotiable.",
    timestamp: "25 min ago",
  },
  {
    id: "4",
    type: "challenge",
    content: "New Challenge Started: 30-Day Cold Shower Challenge",
    timestamp: "1h ago",
    icon: "zap",
  },
  {
    id: "5",
    type: "message",
    author: { name: "Marcus Steel" },
    content: "Remember brothers - the standard doesn't care about your excuses. Execute.",
    timestamp: "2h ago",
  },
];

export const challenges: Challenge[] = [
  {
    id: "1",
    name: "75 Hard",
    description: "75 days of no cheat meals, two 45-min workouts, 1 gallon of water, 10 pages of reading, and a progress photo daily.",
    duration: "75 Days",
    difficulty: "Extreme",
    progress: 60,
    participants: 1247,
    active: true,
  },
  {
    id: "2",
    name: "30-Day Cold Shower",
    description: "End every shower with 2 minutes of cold water. Build mental toughness through discomfort.",
    duration: "30 Days",
    difficulty: "Medium",
    progress: 0,
    participants: 892,
    active: false,
  },
  {
    id: "3",
    name: "100 Burpees Daily",
    description: "Complete 100 burpees every single day for 30 days. No excuses, no modifications.",
    duration: "30 Days",
    difficulty: "Hard",
    progress: 0,
    participants: 456,
    active: false,
  },
  {
    id: "4",
    name: "Digital Detox Weekend",
    description: "No social media, no phone (except calls) from Friday 6PM to Monday 6AM.",
    duration: "Weekend",
    difficulty: "Easy",
    progress: 0,
    participants: 2341,
    active: false,
  },
];

export interface OperatorAttribute {
  name: string;
  shortName: string;
  score: number;
  trend: string;
}

export interface HUDData {
  lifeScore: {
    current: number;
    previous: number;
    trend: string;
    trendDirection: "up" | "down" | "neutral";
  };
  vitalStats: {
    streak: number;
    winRate: number;
    winRatePeriod: string;
    totalDays: number;
  };
  arcaneDirective: {
    message: string;
    focusArea: string;
    severity: "critical" | "warning" | "observation";
  };
  attributes: OperatorAttribute[];
}

export const hudData: HUDData = {
  lifeScore: {
    current: 73,
    previous: 71,
    trend: "+2",
    trendDirection: "up",
  },
  vitalStats: {
    streak: 47,
    winRate: 78,
    winRatePeriod: "30 days",
    totalDays: 156,
  },
  arcaneDirective: {
    message: "Your discipline is strong, but your relationships are deteriorating. 3 weeks without a single relationship task.",
    focusArea: "RELATIONSHIPS",
    severity: "critical",
  },
  attributes: [
    { name: "DISCIPLINE", shortName: "DIS", score: 82, trend: "+3" },
    { name: "PHYSICAL", shortName: "PHY", score: 71, trend: "+1" },
    { name: "WORK EXECUTION", shortName: "WRK", score: 65, trend: "-2" },
    { name: "CONSISTENCY", shortName: "CON", score: 54, trend: "+5" },
    { name: "MENTAL CONTROL", shortName: "MNT", score: 48, trend: "0" },
    { name: "FINANCIAL", shortName: "FIN", score: 45, trend: "-4" },
    { name: "RECOVERY", shortName: "REC", score: 38, trend: "+2" },
    { name: "RELATIONSHIPS", shortName: "REL", score: 29, trend: "-8" },
  ],
};

export const arcaneDirectives = [
  "Your discipline is strong, but your relationships are deteriorating. 3 weeks without a single relationship task.",
  "You win most days but collapse every weekend. Your consistency score proves it.",
  "Your problem isn't losing days. It's how long it takes you to recover. Average: 6 days.",
  "Financial tasks keep getting skipped. Your income goals require execution, not intention.",
  "Strong week. But don't confuse momentum with transformation. Stay locked in.",
  "Recovery is your weakness. After losses, you spiral instead of execute.",
];

export const coreValues = [
  {
    id: "1",
    title: "DISCIPLINE OVER EMOTION",
    description: "Your feelings are liars. Discipline is the path. Execute when you don't feel like it, especially then.",
  },
  {
    id: "2",
    title: "EXTREME ACCOUNTABILITY",
    description: "Everything in your life is your responsibility. No excuses. No blame. Own it all.",
  },
  {
    id: "3",
    title: "TRUTH FIRST ALWAYS",
    description: "Lies are weakness. Face the brutal facts. Only truth leads to growth.",
  },
  {
    id: "4",
    title: "PHYSICAL EXCELLENCE",
    description: "Your body is your first business. Train it relentlessly. A weak body houses a weak mind.",
  },
  {
    id: "5",
    title: "MISSION OVER SELF",
    description: "The mission is bigger than you. Sacrifice comfort for purpose. Leave something worthy.",
  },
  {
    id: "6",
    title: "STRENGTH THROUGH PAIN",
    description: "Discomfort is the currency of growth. Embrace suffering. It forges operators.",
  },
  {
    id: "7",
    title: "BUILD WHAT LASTS",
    description: "Short-term thinking is death. Build empires. Create legacy. Think in decades.",
  },
  {
    id: "8",
    title: "BROTHERHOOD IS A WEAPON",
    description: "Surround yourself with warriors. Iron sharpens iron. Your crew determines your life.",
  },
  {
    id: "9",
    title: "ZERO REGRESSION",
    description: "Never go backwards. Every day, every decision - forward or nothing. There is no neutral.",
  },
  {
    id: "10",
    title: "THE STANDARD OWNS YOU NOW",
    description: "You don't set the standard. The standard sets you. Live up to it or be consumed by mediocrity.",
  },
];

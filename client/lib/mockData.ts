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
    saved: true,
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
    saved: true,
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
    saved: true,
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

export interface Strike {
  id: string;
  reason: string;
  severity: string;
  strikeValue: number;
  date: string;
  status: "active" | "cleared";
  clearedDate?: string;
  clearMethod?: string;
}

export const mockStrikes: Strike[] = [
  {
    id: "s1",
    reason: "daily_loss",
    severity: "Standard",
    strikeValue: 1,
    date: "Feb 19, 2026",
    status: "active",
  },
  {
    id: "s2",
    reason: "reflection_skipped",
    severity: "Standard",
    strikeValue: 1,
    date: "Feb 18, 2026",
    status: "active",
  },
  {
    id: "s3",
    reason: "pattern_failure",
    severity: "Pattern",
    strikeValue: 2,
    date: "Feb 16, 2026",
    status: "cleared",
    clearedDate: "Feb 17, 2026",
    clearMethod: "Recovery protocol",
  },
  {
    id: "s4",
    reason: "daily_loss",
    severity: "Standard",
    strikeValue: 1,
    date: "Feb 12, 2026",
    status: "cleared",
    clearedDate: "Feb 13, 2026",
    clearMethod: "Day won",
  },
  {
    id: "s5",
    reason: "critical_task_missed",
    severity: "Elevated",
    strikeValue: 1,
    date: "Feb 10, 2026",
    status: "cleared",
    clearedDate: "Feb 11, 2026",
    clearMethod: "Recovery protocol",
  },
  {
    id: "s6",
    reason: "streak_broken",
    severity: "Behavioral",
    strikeValue: 2,
    date: "Feb 5, 2026",
    status: "cleared",
    clearedDate: "Feb 8, 2026",
    clearMethod: "Day won",
  },
];

// Social gating mock state
// Toggle these values to test different gate screens:
// - Set isNewUser: true and streak < 3 for "EARN YOUR ACCESS" screen
// - Set daysSinceActivity: 3+ for "YOU'VE GONE SILENT" screen
// - Set isBuyInMode: true and morningBriefViewed: false for "BRIEF REQUIRED" screen
// - Set 6+ active strikes for "ACCESS REVOKED" screen
export const gatingState = {
  isNewUser: false,
  daysSinceActivity: 0,
  isBuyInMode: false,
  daysInApp: 45,
  morningBriefViewed: true,
};


export const lifeScoreHistory: number[] = [68, 69, 71, 70, 72, 71, 73];

export const domainInsights: {
  domain: string;
  icon: string;
  text: string;
}[] = [
  {
    domain: "RELATIONSHIPS",
    icon: "heart",
    text: "Your weakest domain at 29. Zero relationship tasks logged in 10 days.",
  },
  {
    domain: "RECOVERY",
    icon: "refresh-cw",
    text: "Declining. Average 6 days to bounce back from losses.",
  },
  {
    domain: "DISCIPLINE",
    icon: "shield",
    text: "Your strongest attribute. Maintain the standard.",
  },
];

export const scoreBreakdown = {
  weightedAvg: 54,
  consistencyBonus: 12,
  trendBonus: 10,
  weaknessPenalty: 3,
  penaltyDomain: "RELATIONSHIPS",
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

// ===== INTEREST GROUPS (Forum System) =====

export interface ForumGroup {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  memberCount: number;
  threadCount: number;
  postCount: number;
  lastActivity: string;
  lastPostBy: string;
  lastThreadTitle: string;
  isOfficial: boolean;
  createdBy: string;
  category: "lifestyle" | "business" | "fitness" | "mindset" | "skills" | "other";
}

export interface ForumThread {
  id: string;
  groupId: string;
  title: string;
  author: {
    name: string;
    tier: string;
    postCount: number;
    joinDate: string;
  };
  createdAt: string;
  replyCount: number;
  viewCount: number;
  lastReplyBy: string;
  lastReplyAt: string;
  isPinned: boolean;
  isLocked: boolean;
  hasNewPosts: boolean;
  preview: string;
}

export interface ForumPost {
  id: string;
  threadId: string;
  author: {
    name: string;
    tier: string;
    postCount: number;
    joinDate: string;
    streak: number;
  };
  content: string;
  createdAt: string;
  isOP: boolean;
  likes: number;
  liked: boolean;
  quoteOf?: string;
  quotedAuthor?: string;
  quotedContent?: string;
  replyToId?: string;
  replyToAuthor?: string;
}

export const forumGroups: ForumGroup[] = [
  {
    id: "grp_1",
    name: "75 HARD Veterans",
    description: "For those who have completed 75 Hard. Share strategies, post-program maintenance, and what you learned about yourself.",
    icon: "shield",
    color: "#E31837",
    memberCount: 12847,
    threadCount: 342,
    postCount: 8921,
    lastActivity: "2m ago",
    lastPostBy: "IronMike",
    lastThreadTitle: "Day 75 done. Here's what nobody tells you.",
    isOfficial: true,
    createdBy: "Admin",
    category: "fitness",
  },
  {
    id: "grp_2",
    name: "Entrepreneurs & Builders",
    description: "Business owners, side hustlers, and people building something. No theory \u2014 execution only. Share wins, ask for help, post proof.",
    icon: "briefcase",
    color: "#2563EB",
    memberCount: 9234,
    threadCount: 567,
    postCount: 15432,
    lastActivity: "5m ago",
    lastPostBy: "BuilderDave",
    lastThreadTitle: "Hit $10k/mo. Took 14 months. Here's every step.",
    isOfficial: true,
    createdBy: "Admin",
    category: "business",
  },
  {
    id: "grp_3",
    name: "Fatherhood",
    description: "Being the man your kids need you to be. Real talk about raising children with standards, discipline, and love.",
    icon: "heart",
    color: "#059669",
    memberCount: 6891,
    threadCount: 213,
    postCount: 4567,
    lastActivity: "12m ago",
    lastPostBy: "DadStrength",
    lastThreadTitle: "My son asked why I wake up at 4am. Here's what I told him.",
    isOfficial: true,
    createdBy: "Admin",
    category: "lifestyle",
  },
  {
    id: "grp_4",
    name: "Reading & Self Education",
    description: "Book recommendations, reading challenges, and applying what you learn. If you're not growing, you're dying.",
    icon: "book-open",
    color: "#7C3AED",
    memberCount: 5123,
    threadCount: 189,
    postCount: 3211,
    lastActivity: "23m ago",
    lastPostBy: "PageTurner",
    lastThreadTitle: "The book that changed how I think about discipline",
    isOfficial: true,
    createdBy: "Admin",
    category: "mindset",
  },
  {
    id: "grp_5",
    name: "Sobriety & Recovery",
    description: "For operators fighting addiction. No judgment. Just accountability, proof, and people who understand the fight.",
    icon: "anchor",
    color: "#0891B2",
    memberCount: 3456,
    threadCount: 98,
    postCount: 2134,
    lastActivity: "34m ago",
    lastPostBy: "CleanSlate",
    lastThreadTitle: "1 year sober today. This app helped.",
    isOfficial: true,
    createdBy: "Admin",
    category: "lifestyle",
  },
  {
    id: "grp_6",
    name: "Real Estate Operators",
    description: "Buying, selling, investing, developing. Share deals, strategies, market analysis. Proof required for claims.",
    icon: "home",
    color: "#D97706",
    memberCount: 4210,
    threadCount: 278,
    postCount: 6543,
    lastActivity: "1h ago",
    lastPostBy: "PropertyKing",
    lastThreadTitle: "Closed on property #4. Here's my system.",
    isOfficial: false,
    createdBy: "PropertyKing",
    category: "business",
  },
  {
    id: "grp_7",
    name: "Early Morning Crew",
    description: "If you're not up before the sun, you're already behind. 4AM-5AM operators check in here.",
    icon: "sunrise",
    color: "#F59E0B",
    memberCount: 8932,
    threadCount: 156,
    postCount: 12876,
    lastActivity: "8m ago",
    lastPostBy: "DawnPatrol",
    lastThreadTitle: "4:15 AM. Coffee made. Tasks set. Let's go.",
    isOfficial: false,
    createdBy: "DawnPatrol",
    category: "lifestyle",
  },
  {
    id: "grp_8",
    name: "Sales Professionals",
    description: "Cold calls, closing techniques, pipeline management. This is where closers sharpen the blade.",
    icon: "phone-call",
    color: "#DC2626",
    memberCount: 3789,
    threadCount: 145,
    postCount: 3890,
    lastActivity: "45m ago",
    lastPostBy: "CloserMike",
    lastThreadTitle: "100 cold calls a day for 30 days. Results inside.",
    isOfficial: false,
    createdBy: "CloserMike",
    category: "skills",
  },
];

export const forumThreads: ForumThread[] = [
  {
    id: "thr_1",
    groupId: "grp_1",
    title: "RULES: Read before posting. No excuses. No shortcuts.",
    author: { name: "Admin", tier: "Founder", postCount: 1247, joinDate: "Nov 2024" },
    createdAt: "Nov 15, 2024",
    replyCount: 0,
    viewCount: 12453,
    lastReplyBy: "-",
    lastReplyAt: "-",
    isPinned: true,
    isLocked: true,
    hasNewPosts: false,
    preview: "This is a group for operators who have COMPLETED 75 Hard. If you haven't finished, go finish it first...",
  },
  {
    id: "thr_2",
    groupId: "grp_1",
    title: "Day 75 done. Here's what nobody tells you.",
    author: { name: "IronMike", tier: "Operator", postCount: 89, joinDate: "Dec 2024" },
    createdAt: "2h ago",
    replyCount: 34,
    viewCount: 1289,
    lastReplyBy: "SteelWill",
    lastReplyAt: "2m ago",
    isPinned: false,
    isLocked: false,
    hasNewPosts: true,
    preview: "Just finished day 75. Everyone talks about the physical changes. Nobody talks about the mental shift that happens around day 50...",
  },
  {
    id: "thr_3",
    groupId: "grp_1",
    title: "Cold showers stopped being hard at day 23. Worried I'm getting soft.",
    author: { name: "FrostBite", tier: "Operator", postCount: 156, joinDate: "Jan 2025" },
    createdAt: "5h ago",
    replyCount: 21,
    viewCount: 876,
    lastReplyBy: "IceVeins",
    lastReplyAt: "15m ago",
    isPinned: false,
    isLocked: false,
    hasNewPosts: true,
    preview: "Week 1 they were brutal. Week 2 I was dreading them. Now? I look forward to them. Does that mean I need to find something harder?",
  },
  {
    id: "thr_4",
    groupId: "grp_1",
    title: "What outdoor workout do you do when it's -10\u00B0F?",
    author: { name: "NorthernGrit", tier: "Standard", postCount: 23, joinDate: "Feb 2025" },
    createdAt: "8h ago",
    replyCount: 45,
    viewCount: 2134,
    lastReplyBy: "ArcticOp",
    lastReplyAt: "32m ago",
    isPinned: false,
    isLocked: false,
    hasNewPosts: true,
    preview: "Minnesota operator here. It's -10 this week and the outdoor workout rule doesn't care. What are you all doing when it's this cold?",
  },
  {
    id: "thr_5",
    groupId: "grp_1",
    title: "Failed on day 63. Starting over tomorrow.",
    author: { name: "BackAgain", tier: "Standard", postCount: 12, joinDate: "Jan 2025" },
    createdAt: "1d ago",
    replyCount: 67,
    viewCount: 3456,
    lastReplyBy: "NeverQuit",
    lastReplyAt: "1h ago",
    isPinned: false,
    isLocked: false,
    hasNewPosts: false,
    preview: "Missed my second workout. No excuse. I was tired and I chose comfort. Day 1 again tomorrow. Just needed to say it out loud.",
  },
  {
    id: "thr_6",
    groupId: "grp_1",
    title: "Progress pics: Day 1 vs Day 75 (warning: shirtless dude)",
    author: { name: "TransformOp", tier: "Operator", postCount: 67, joinDate: "Dec 2024" },
    createdAt: "2d ago",
    replyCount: 89,
    viewCount: 5678,
    lastReplyBy: "FitDad",
    lastReplyAt: "3h ago",
    isPinned: false,
    isLocked: false,
    hasNewPosts: false,
    preview: "Posting this because I promised myself I would. 31 lbs down. But the real transformation isn't visible. It's the 4am alarm that I no longer hate.",
  },
  {
    id: "thr_7",
    groupId: "grp_2",
    title: "How to post: Include numbers. Include proof. No vague wins.",
    author: { name: "Admin", tier: "Founder", postCount: 1247, joinDate: "Nov 2024" },
    createdAt: "Nov 15, 2024",
    replyCount: 0,
    viewCount: 9876,
    lastReplyBy: "-",
    lastReplyAt: "-",
    isPinned: true,
    isLocked: true,
    hasNewPosts: false,
    preview: "This board is for real operators building real businesses. When you post a win, include numbers...",
  },
  {
    id: "thr_8",
    groupId: "grp_2",
    title: "Hit $10k/mo. Took 14 months. Here's every step.",
    author: { name: "BuilderDave", tier: "Operator", postCount: 234, joinDate: "Dec 2024" },
    createdAt: "5m ago",
    replyCount: 12,
    viewCount: 456,
    lastReplyBy: "HustleHard",
    lastReplyAt: "5m ago",
    isPinned: false,
    isLocked: false,
    hasNewPosts: true,
    preview: "Month 1-3: Built the product. Nobody cared. Month 4-6: Started cold outreach. 500 emails. 3 clients. Month 7-9: Refined the offer...",
  },
  {
    id: "thr_9",
    groupId: "grp_2",
    title: "Quitting my 9-5 in 90 days. Here's my exit plan.",
    author: { name: "ExitPlan", tier: "Standard", postCount: 45, joinDate: "Jan 2025" },
    createdAt: "3h ago",
    replyCount: 28,
    viewCount: 1234,
    lastReplyBy: "BeenThere",
    lastReplyAt: "22m ago",
    isPinned: false,
    isLocked: false,
    hasNewPosts: true,
    preview: "I've got 6 months of expenses saved. Side business doing $3k/mo. Need to hit $7k before I pull the trigger. Here's the plan...",
  },
  {
    id: "thr_10",
    groupId: "grp_3",
    title: "My son asked why I wake up at 4am. Here's what I told him.",
    author: { name: "DadStrength", tier: "Operator", postCount: 178, joinDate: "Dec 2024" },
    createdAt: "12m ago",
    replyCount: 42,
    viewCount: 3421,
    lastReplyBy: "FatherFirst",
    lastReplyAt: "12m ago",
    isPinned: false,
    isLocked: false,
    hasNewPosts: true,
    preview: "He's 7. He walked into the garage at 4:30am while I was doing burpees. He just stood there watching. Then he asked...",
  },
  {
    id: "thr_11",
    groupId: "grp_4",
    title: "The book that changed how I think about discipline",
    author: { name: "PageTurner", tier: "Operator", postCount: 201, joinDate: "Nov 2024" },
    createdAt: "23m ago",
    replyCount: 31,
    viewCount: 2567,
    lastReplyBy: "ReadOrDie",
    lastReplyAt: "23m ago",
    isPinned: false,
    isLocked: false,
    hasNewPosts: true,
    preview: "Can't Hurt Me by David Goggins. I know, everyone's read it. But I want to talk about what happened when I actually APPLIED Chapter 4...",
  },
  {
    id: "thr_12",
    groupId: "grp_5",
    title: "1 year sober today. This app helped.",
    author: { name: "CleanSlate", tier: "Operator", postCount: 134, joinDate: "Dec 2024" },
    createdAt: "34m ago",
    replyCount: 56,
    viewCount: 4312,
    lastReplyBy: "StayStrong",
    lastReplyAt: "34m ago",
    isPinned: false,
    isLocked: false,
    hasNewPosts: true,
    preview: "365 days. No alcohol. No excuses. The Power List kept me accountable when my willpower couldn't. Here's my story...",
  },
  {
    id: "thr_13",
    groupId: "grp_6",
    title: "Closed on property #4. Here's my system.",
    author: { name: "PropertyKing", tier: "Operator", postCount: 312, joinDate: "Nov 2024" },
    createdAt: "1h ago",
    replyCount: 19,
    viewCount: 1876,
    lastReplyBy: "DealHunter",
    lastReplyAt: "1h ago",
    isPinned: false,
    isLocked: false,
    hasNewPosts: true,
    preview: "4th rental property closed this week. Cash flowing $1,200/mo total across all 4. Here's exactly how I analyze deals...",
  },
  {
    id: "thr_14",
    groupId: "grp_7",
    title: "4:15 AM. Coffee made. Tasks set. Let's go.",
    author: { name: "DawnPatrol", tier: "Operator", postCount: 445, joinDate: "Nov 2024" },
    createdAt: "8m ago",
    replyCount: 67,
    viewCount: 5432,
    lastReplyBy: "FirstLight",
    lastReplyAt: "8m ago",
    isPinned: false,
    isLocked: false,
    hasNewPosts: true,
    preview: "Day 312 of waking up before the sun. The world is quiet. The coffee is hot. The Power List is ready. This is where operators are made.",
  },
  {
    id: "thr_15",
    groupId: "grp_8",
    title: "100 cold calls a day for 30 days. Results inside.",
    author: { name: "CloserMike", tier: "Operator", postCount: 267, joinDate: "Dec 2024" },
    createdAt: "45m ago",
    replyCount: 38,
    viewCount: 3210,
    lastReplyBy: "DialTone",
    lastReplyAt: "45m ago",
    isPinned: false,
    isLocked: false,
    hasNewPosts: true,
    preview: "3,000 dials. 487 conversations. 23 meetings booked. 9 closed deals. $47,000 in new revenue. Here's everything I learned...",
  },
];

export const forumPosts: ForumPost[] = [
  {
    id: "fp_1",
    threadId: "thr_2",
    author: { name: "IronMike", tier: "Operator", postCount: 89, joinDate: "Dec 2024", streak: 75 },
    content: "Just finished day 75. Everyone talks about the physical changes. Nobody talks about the mental shift that happens around day 50.\n\nAround day 50 I stopped negotiating with myself. The alarm went off, I got up. No internal debate. No \"5 more minutes.\" The discipline became automatic.\n\nThat's the real transformation. Not the body. The death of the negotiation.\n\nHere's what else nobody tells you:\n\n1. Your tolerance for excuses from other people drops to zero\n2. You start seeing EVERYTHING as a discipline test\n3. The diet is the hardest part, not the workouts\n4. Reading 10 pages sounds easy until day 47 when you're exhausted\n5. The outdoor workout in rain/snow builds more character than any gym session\n\nTo anyone on day 10 thinking about quitting: you haven't even started the real work yet. Keep going.",
    createdAt: "2h ago",
    isOP: true,
    likes: 234,
    liked: false,
  },
  {
    id: "fp_2",
    threadId: "thr_2",
    author: { name: "SteelWill", tier: "Operator", postCount: 312, joinDate: "Nov 2024", streak: 143 },
    content: "The \"death of the negotiation\" \u2014 that's the best way I've ever heard it described.\n\nI'm on day 143 now (did 75 Hard, now Live Hard). The negotiation thing is real. My brain doesn't even try anymore. It knows the answer is always going to be \"do it anyway.\"\n\nCongratulations brother. The person who started on day 1 is not the person who finished on day 75.",
    createdAt: "1h ago",
    isOP: false,
    likes: 89,
    liked: false,
  },
  {
    id: "fp_3",
    threadId: "thr_2",
    author: { name: "GrindDaily", tier: "Standard", postCount: 34, joinDate: "Jan 2025", streak: 23 },
    content: "I'm on day 23 and the negotiation is still LOUD. Every morning my brain tries to talk me out of the 5am workout.\n\nHearing that it dies around day 50 gives me something to push toward. Thanks for posting this.",
    createdAt: "45m ago",
    isOP: false,
    likes: 45,
    liked: true,
  },
  {
    id: "fp_4",
    threadId: "thr_2",
    author: { name: "IronMike", tier: "Operator", postCount: 89, joinDate: "Dec 2024", streak: 75 },
    content: "Keep going. Day 23 was one of my hardest. Around week 3-4 the novelty wears off but the habit hasn't formed yet. You're in the valley. The only way out is through.",
    createdAt: "30m ago",
    isOP: false,
    likes: 67,
    liked: false,
    quoteOf: "fp_3",
    quotedAuthor: "GrindDaily",
    quotedContent: "I'm on day 23 and the negotiation is still LOUD...",
  },
  {
    id: "fp_5",
    threadId: "thr_2",
    author: { name: "FrostBite", tier: "Operator", postCount: 156, joinDate: "Jan 2025", streak: 82 },
    content: "Point #5 is underrated. I did 75 Hard through a Minnesota winter. -15\u00B0F runs. There's something about forcing yourself outside when every cell in your body says no.\n\nThe gym is easy. The outdoor workout in bad weather is where operators are forged.",
    createdAt: "15m ago",
    isOP: false,
    likes: 112,
    liked: false,
  },
  {
    id: "fp_6",
    threadId: "thr_2",
    author: { name: "NoExcuses", tier: "Standard", postCount: 8, joinDate: "Feb 2025", streak: 8 },
    content: "Day 8. Reading this thread instead of sleeping. Tomorrow's workout is at 4:30am.\n\nSaved this post. Going to read it again on day 50 to see if you're right about the negotiation dying.\n\nLet's go.",
    createdAt: "2m ago",
    isOP: false,
    likes: 23,
    liked: false,
  },
  {
    id: "fp_7",
    threadId: "thr_8",
    author: { name: "BuilderDave", tier: "Operator", postCount: 234, joinDate: "Dec 2024", streak: 120 },
    content: "Month 1-3: Built the product. Nobody cared. I was solving a problem nobody had.\n\nMonth 4-6: Pivoted. Started cold outreach. 500 emails. 3 clients at $500/mo. That first $1,500 felt like a million.\n\nMonth 7-9: Refined the offer. Raised prices to $1,200/mo. Lost 1 client, gained 4. Revenue hit $6k/mo.\n\nMonth 10-12: Hired a VA for $800/mo. Started content marketing. Inbound leads started flowing.\n\nMonth 13-14: Hit $10k/mo. 8 clients at $1,200 average.\n\nThe key? I treated it like a Power List task. Every single day: 10 outreach emails, 1 piece of content, 1 follow-up call. Non-negotiable.\n\nThe business didn't take off because I had a great idea. It took off because I refused to stop.",
    createdAt: "5m ago",
    isOP: true,
    likes: 345,
    liked: false,
  },
  {
    id: "fp_8",
    threadId: "thr_8",
    author: { name: "HustleHard", tier: "Standard", postCount: 67, joinDate: "Jan 2025", streak: 40 },
    content: "The cold outreach numbers are inspiring. 500 emails for 3 clients sounds brutal but that's a 0.6% conversion rate which is actually solid for cold email.\n\nWhat was your email template like? Did you personalize each one or use a sequence?",
    createdAt: "3m ago",
    isOP: false,
    likes: 28,
    liked: false,
    replyToId: "fp_7",
    replyToAuthor: "BuilderDave",
  },
  {
    id: "fp_9",
    threadId: "thr_9",
    author: { name: "ExitPlan", tier: "Standard", postCount: 45, joinDate: "Jan 2025", streak: 35 },
    content: "I've got 6 months of expenses saved. Side business doing $3k/mo. Need to hit $7k before I pull the trigger. Here's the plan:\n\n1. Keep the 9-5 for exactly 90 more days\n2. Wake up at 4am, work on the business until 7:30am\n3. Lunch breaks = client calls\n4. Evenings = content creation\n5. Weekends = full business mode\n\nI'm not quitting because I hate my job. I'm quitting because I've outgrown it. The business needs me full-time to break through $7k.\n\nAnyone else planning an exit? What's your number?",
    createdAt: "3h ago",
    isOP: true,
    likes: 156,
    liked: false,
  },
  {
    id: "fp_9b",
    threadId: "thr_9",
    author: { name: "BeenThere", tier: "Operator", postCount: 189, joinDate: "Dec 2024", streak: 95 },
    content: "Did this exact thing 8 months ago. My number was $5k/mo. Best decision I ever made.\n\nOne piece of advice: your expenses will go up when you quit. Health insurance, taxes, software you didn't realize your company was paying for. Add 30% to whatever number you think you need.",
    createdAt: "2h ago",
    isOP: false,
    likes: 89,
    liked: false,
    replyToId: "fp_9",
    replyToAuthor: "ExitPlan",
  },
  {
    id: "fp_10",
    threadId: "thr_10",
    author: { name: "DadStrength", tier: "Operator", postCount: 178, joinDate: "Dec 2024", streak: 210 },
    content: "He's 7. He walked into the garage at 4:30am while I was doing burpees. He just stood there watching.\n\nThen he asked: \"Dad, why do you wake up when it's still dark?\"\n\nI stopped. Got down on one knee. Looked him in the eyes.\n\n\"Because the man you need me to be doesn't get built by sleeping in. I wake up early so I can be strong enough to protect you, smart enough to teach you, and disciplined enough to show you what a real man looks like.\"\n\nHe thought about it for a second. Then he said: \"Can I do burpees with you?\"\n\nWe did 10 together. He counted every one. That might be the best workout I've ever had.",
    createdAt: "12m ago",
    isOP: true,
    likes: 312,
    liked: false,
  },
  {
    id: "fp_11",
    threadId: "thr_10",
    author: { name: "FatherFirst", tier: "Operator", postCount: 89, joinDate: "Jan 2025", streak: 45 },
    content: "This hit different. My daughter is 5 and she's starting to notice the same things. Kids are watching everything we do.\n\nYou're not just building yourself. You're building the blueprint they'll follow.",
    createdAt: "8m ago",
    isOP: false,
    likes: 67,
    liked: false,
    replyToId: "fp_10",
    replyToAuthor: "DadStrength",
  },
  {
    id: "fp_12",
    threadId: "thr_10",
    author: { name: "DadStrength", tier: "Operator", postCount: 178, joinDate: "Dec 2024", streak: 210 },
    content: "Exactly. They don't listen to what we say. They watch what we do. Every single day.",
    createdAt: "5m ago",
    isOP: false,
    likes: 34,
    liked: false,
    replyToId: "fp_11",
    replyToAuthor: "FatherFirst",
  },
  {
    id: "fp_20",
    threadId: "thr_11",
    author: { name: "PageTurner", tier: "Operator", postCount: 201, joinDate: "Nov 2024", streak: 180 },
    content: "Can't Hurt Me by David Goggins. I know, everyone's read it. But I want to talk about what happened when I actually APPLIED Chapter 4.\n\nThe accountability mirror. I wrote every insecurity, every excuse, every lie I tell myself on Post-it notes and stuck them on my bathroom mirror.\n\nEvery morning I had to look at myself and read them out loud.\n\nWeek 1: Uncomfortable.\nWeek 2: Angry at myself.\nWeek 3: Started crossing them off.\nWeek 4: The mirror was almost clean.\n\nThe book isn't special. What you DO with the book is special. Most people read it, feel motivated for 48 hours, then go back to the couch.\n\nWhat book changed YOUR behavior, not just your feelings?",
    createdAt: "23m ago",
    isOP: true,
    likes: 189,
    liked: false,
  },
  {
    id: "fp_21",
    threadId: "thr_11",
    author: { name: "ReadOrDie", tier: "Standard", postCount: 56, joinDate: "Jan 2025", streak: 30 },
    content: "Atomic Habits by James Clear. Not because it's groundbreaking theory but because I actually built the habit tracking system he describes. My Power List completion went from 60% to 94% in one month.",
    createdAt: "18m ago",
    isOP: false,
    likes: 45,
    liked: false,
    replyToId: "fp_20",
    replyToAuthor: "PageTurner",
  },
  {
    id: "fp_22",
    threadId: "thr_11",
    author: { name: "PageTurner", tier: "Operator", postCount: 201, joinDate: "Nov 2024", streak: 180 },
    content: "Atomic Habits is solid. The 1% better every day math is motivating. But the real gem is the identity chapter. Don't try to change what you do. Change who you believe you are.",
    createdAt: "14m ago",
    isOP: false,
    likes: 28,
    liked: false,
    replyToId: "fp_21",
    replyToAuthor: "ReadOrDie",
  },
  {
    id: "fp_30",
    threadId: "thr_12",
    author: { name: "CleanSlate", tier: "Operator", postCount: 134, joinDate: "Dec 2024", streak: 365 },
    content: "365 days. No alcohol. No excuses.\n\nThe Power List kept me accountable when my willpower couldn't. Every single day for a year, \"No alcohol\" was task #1.\n\nHere's what happened:\n- Month 1: White-knuckling it. Every social event was a war.\n- Month 3: Started sleeping better than I have in 10 years.\n- Month 6: Lost 30 lbs without changing my diet.\n- Month 9: My relationships started healing. People trust me again.\n- Month 12: I don't miss it. Not even a little.\n\nThe hardest part wasn't saying no to the drink. It was saying no to the version of myself that convinced me I \"deserved\" it.\n\nTo anyone on day 1: it gets easier. But more importantly, YOU get stronger.",
    createdAt: "34m ago",
    isOP: true,
    likes: 456,
    liked: false,
  },
  {
    id: "fp_31",
    threadId: "thr_12",
    author: { name: "StayStrong", tier: "Standard", postCount: 23, joinDate: "Feb 2025", streak: 14 },
    content: "Day 14 here. The social events are the hardest part. Everyone asking why you're not drinking. The pressure is real.\n\nThis post gives me hope. Thank you for sharing.",
    createdAt: "20m ago",
    isOP: false,
    likes: 89,
    liked: false,
    replyToId: "fp_30",
    replyToAuthor: "CleanSlate",
  },
  {
    id: "fp_32",
    threadId: "thr_12",
    author: { name: "CleanSlate", tier: "Operator", postCount: 134, joinDate: "Dec 2024", streak: 365 },
    content: "Day 14 is huge. Most people don't make it past day 10. You're already ahead of 90% of the people who try.\n\nFor the social events: get comfortable saying \"I don't drink\" instead of \"I'm not drinking tonight.\" One is an identity. The other is a decision that can be reversed.",
    createdAt: "15m ago",
    isOP: false,
    likes: 123,
    liked: false,
    replyToId: "fp_31",
    replyToAuthor: "StayStrong",
  },
  {
    id: "fp_40",
    threadId: "thr_13",
    author: { name: "PropertyKing", tier: "Operator", postCount: 312, joinDate: "Nov 2024", streak: 200 },
    content: "4th rental property closed this week. Cash flowing $1,200/mo total across all 4. Here's exactly how I analyze deals:\n\n1. The 1% Rule: Monthly rent should be at least 1% of purchase price\n2. Cash-on-cash return must be 8% or higher\n3. I only buy in areas with population growth\n4. Never buy the nicest house on the block\n5. Always budget 10% for vacancy and 10% for maintenance\n\nStarted with $40k saved. House hacked my first property. Used equity from #1 to buy #2. Rinse and repeat.\n\nThe Power List helped me stay consistent with deal analysis. 2 hours every morning before my day job. No exceptions.",
    createdAt: "1h ago",
    isOP: true,
    likes: 198,
    liked: false,
  },
  {
    id: "fp_41",
    threadId: "thr_13",
    author: { name: "DealHunter", tier: "Standard", postCount: 34, joinDate: "Jan 2025", streak: 22 },
    content: "The 1% rule is solid but hard to find in today's market. What markets are you buying in? I'm analyzing deals in the Midwest but everything seems overpriced.",
    createdAt: "45m ago",
    isOP: false,
    likes: 21,
    liked: false,
    replyToId: "fp_40",
    replyToAuthor: "PropertyKing",
  },
  {
    id: "fp_50",
    threadId: "thr_14",
    author: { name: "DawnPatrol", tier: "Operator", postCount: 445, joinDate: "Nov 2024", streak: 312 },
    content: "Day 312 of waking up before the sun. The world is quiet. The coffee is hot. The Power List is ready.\n\nThis is where operators are made. Not in the gym. Not at the office. In the silence of 4am when nobody is watching and nobody is going to praise you for it.\n\nCheck in below. What time did you wake up today? What's the first thing you attacked?",
    createdAt: "8m ago",
    isOP: true,
    likes: 267,
    liked: false,
  },
  {
    id: "fp_51",
    threadId: "thr_14",
    author: { name: "FirstLight", tier: "Operator", postCount: 156, joinDate: "Dec 2024", streak: 90 },
    content: "4:00 AM. Cold shower first. Then 30 minutes of reading before the workout.\n\nThe silence at 4am is addictive. Once you experience it, sleeping until 7 feels like you've wasted half the day.",
    createdAt: "5m ago",
    isOP: false,
    likes: 78,
    liked: false,
    replyToId: "fp_50",
    replyToAuthor: "DawnPatrol",
  },
  {
    id: "fp_52",
    threadId: "thr_14",
    author: { name: "DawnPatrol", tier: "Operator", postCount: 445, joinDate: "Nov 2024", streak: 312 },
    content: "Cold shower before coffee is elite level. That's discipline on top of discipline. Respect.",
    createdAt: "3m ago",
    isOP: false,
    likes: 45,
    liked: false,
    replyToId: "fp_51",
    replyToAuthor: "FirstLight",
  },
  {
    id: "fp_60",
    threadId: "thr_15",
    author: { name: "CloserMike", tier: "Operator", postCount: 267, joinDate: "Dec 2024", streak: 150 },
    content: "3,000 dials. 487 conversations. 23 meetings booked. 9 closed deals. $47,000 in new revenue.\n\n30 days. 100 cold calls per day. Here's everything I learned:\n\n1. The first 20 calls every day are the hardest. After that, you're in the zone.\n2. Rejection stops hurting around call 500.\n3. Your script matters less than your energy.\n4. Follow up is where 80% of the money is.\n5. Record yourself. You sound worse than you think. Then fix it.\n\nThe Power List made this possible. \"Make 100 cold calls\" was task #2 every single day. Non-negotiable.\n\nWho else is grinding the phones? Drop your numbers below.",
    createdAt: "45m ago",
    isOP: true,
    likes: 234,
    liked: false,
  },
  {
    id: "fp_61",
    threadId: "thr_15",
    author: { name: "DialTone", tier: "Standard", postCount: 45, joinDate: "Jan 2025", streak: 30 },
    content: "I'm at 50 calls a day right now. The rejection around call 500 thing is real. I'm at about 400 total and I can feel the shift happening. Each no bothers me less.\n\nWhat CRM are you using to track all this?",
    createdAt: "30m ago",
    isOP: false,
    likes: 34,
    liked: false,
    replyToId: "fp_60",
    replyToAuthor: "CloserMike",
  },
  {
    id: "fp_62",
    threadId: "thr_15",
    author: { name: "CloserMike", tier: "Operator", postCount: 267, joinDate: "Dec 2024", streak: 150 },
    content: "HubSpot free tier. Don't overthink the CRM. Any system you'll actually use is the right system. I know guys spending $200/mo on fancy tools who make 10 calls a day. The tool isn't the bottleneck. You are.",
    createdAt: "20m ago",
    isOP: false,
    likes: 56,
    liked: false,
    replyToId: "fp_61",
    replyToAuthor: "DialTone",
  },
];

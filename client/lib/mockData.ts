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

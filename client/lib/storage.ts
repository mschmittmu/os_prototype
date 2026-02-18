import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  TASKS: "@operator_tasks",
  USER: "@operator_user",
  STREAK: "@operator_streak",
  LAST_COMPLETED_DATE: "@operator_last_completed",
  BIOMETRIC_ENABLED: "@operator_biometric_enabled",
  OPERATOR_MODE_CONFIG: "@operator_mode_config",
  OPERATOR_MODE_SESSION: "@operator_mode_session",
  OPERATOR_MODE_HISTORY: "@operator_mode_history",
  ONBOARDING: "@operator_onboarding",
  IDENTITY_CLAIMS: "@operator_identity_claims",
  MORNING_BRIEF: "@operator_morning_brief",
  PROOF_VAULT: "@operator_proof_vault",
  PROOF_TRIGGERS_FIRED: "@operator_proof_triggers",
};

export interface IdentityClaims {
  coreIdentity: string;
  priorityDomain: string;
  avoidancePatterns: string[];
  behavioralStandard: string;
  createdAt: string;
}

export interface OnboardingState {
  isComplete: boolean;
  completedAt: string | null;
  userName: string;
}

export async function getOnboardingState(): Promise<OnboardingState | null> {
  try {
    const data = await AsyncStorage.getItem(KEYS.ONBOARDING);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error("Error getting onboarding state:", error);
    return null;
  }
}

export async function saveOnboardingState(state: OnboardingState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.ONBOARDING, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving onboarding state:", error);
  }
}

export async function getIdentityClaims(): Promise<IdentityClaims | null> {
  try {
    const data = await AsyncStorage.getItem(KEYS.IDENTITY_CLAIMS);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error("Error getting identity claims:", error);
    return null;
  }
}

export async function saveIdentityClaims(claims: IdentityClaims): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.IDENTITY_CLAIMS, JSON.stringify(claims));
  } catch (error) {
    console.error("Error saving identity claims:", error);
  }
}

export interface MorningBriefState {
  lastShownDate: string;
  dismissed: boolean;
}

export async function getMorningBriefState(): Promise<MorningBriefState | null> {
  try {
    const data = await AsyncStorage.getItem(KEYS.MORNING_BRIEF);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error("Error getting morning brief state:", error);
    return null;
  }
}

export async function saveMorningBriefState(state: MorningBriefState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.MORNING_BRIEF, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving morning brief state:", error);
  }
}

export interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  createdAt: string;
  goalId?: string;
  reminderTime?: string;
  recurring?: boolean;
}

export interface UserData {
  name: string;
  tier: string;
  xp: number;
  memberSince: string;
  avatar?: string;
}

export interface StreakData {
  current: number;
  best: number;
  totalDaysWon: number;
  totalDaysLost: number;
}

export const defaultUser: UserData = {
  name: "Operator",
  tier: "Operator",
  xp: 2450,
  memberSince: "2024-01-15",
};

export const defaultStreak: StreakData = {
  current: 7,
  best: 14,
  totalDaysWon: 45,
  totalDaysLost: 8,
};

export const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Morning workout - 30 min cardio",
    category: "Health",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Review business metrics",
    category: "Business",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Read 30 pages",
    category: "Self Development",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Family dinner - no phones",
    category: "Family",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Plan tomorrow's priorities",
    category: "Business",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export async function getTasks(): Promise<Task[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.TASKS);
    if (data) {
      const tasks = JSON.parse(data);
      if (tasks.length === 5 && tasks.every((t: Task) => defaultTasks.some(d => d.id === t.id))) {
        return tasks;
      }
    }
    await saveTasks(defaultTasks);
    return defaultTasks;
  } catch (error) {
    console.error("Error getting tasks:", error);
    return defaultTasks;
  }
}

export async function resetTasks(): Promise<Task[]> {
  await saveTasks(defaultTasks);
  return defaultTasks;
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
}

export async function getUser(): Promise<UserData> {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER);
    if (data) {
      return JSON.parse(data);
    }
    await saveUser(defaultUser);
    return defaultUser;
  } catch (error) {
    console.error("Error getting user:", error);
    return defaultUser;
  }
}

export async function saveUser(user: UserData): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user:", error);
  }
}

export async function getStreak(): Promise<StreakData> {
  try {
    const data = await AsyncStorage.getItem(KEYS.STREAK);
    if (data) {
      return JSON.parse(data);
    }
    await saveStreak(defaultStreak);
    return defaultStreak;
  } catch (error) {
    console.error("Error getting streak:", error);
    return defaultStreak;
  }
}

export async function saveStreak(streak: StreakData): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.STREAK, JSON.stringify(streak));
  } catch (error) {
    console.error("Error saving streak:", error);
  }
}

export async function checkAndUpdateStreak(allTasksComplete: boolean): Promise<StreakData> {
  const streak = await getStreak();
  const lastCompletedDate = await AsyncStorage.getItem(KEYS.LAST_COMPLETED_DATE);
  const today = new Date().toDateString();
  
  if (lastCompletedDate === today) {
    return streak;
  }
  
  if (allTasksComplete) {
    streak.current += 1;
    streak.totalDaysWon += 1;
    if (streak.current > streak.best) {
      streak.best = streak.current;
    }
    await AsyncStorage.setItem(KEYS.LAST_COMPLETED_DATE, today);
  }
  
  await saveStreak(streak);
  return streak;
}

export async function addXP(amount: number): Promise<number> {
  const user = await getUser();
  user.xp += amount;
  await saveUser(user);
  return user.xp;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export async function getBiometricEnabled(): Promise<boolean> {
  try {
    const data = await AsyncStorage.getItem(KEYS.BIOMETRIC_ENABLED);
    return data === "true";
  } catch (error) {
    console.error("Error getting biometric setting:", error);
    return false;
  }
}

export async function setBiometricEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.BIOMETRIC_ENABLED, enabled ? "true" : "false");
  } catch (error) {
    console.error("Error saving biometric setting:", error);
  }
}

export interface OperatorModeSettings {
  grayscaleMode: boolean;
  hideDistractingApps: boolean;
  simplifiedLockScreen: boolean;
  blockNonEssentialNotifications: boolean;
  allowFavoritesCalls: boolean;
  allowCriticalApps: boolean;
  autoReplyTexts: boolean;
  autoReplyMessage: string;
  autoReplyMissedCalls: boolean;
  startFocusPlaylist: boolean;
  triggerSmartHome: boolean;
  startTimer: boolean;
  defaultDurationMinutes: number;
  burnStrikeOnExit: boolean;
  notifyCrewOnExit: boolean;
  breakStreakOnExit: boolean;
  cooldownHours: number;
  requireCrewApprovalToExit: boolean;
}

export interface OperatorModeProtocol {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  settings: OperatorModeSettings;
  isCustom: boolean;
}

export interface OperatorModeSession {
  isActive: boolean;
  protocolId: string;
  protocolName: string;
  startTime: string;
  durationMinutes: number;
  tasksCompletedAtStart: number;
}

export interface OperatorModeHistoryEntry {
  id: string;
  protocolName: string;
  date: string;
  durationMinutes: number;
  actualDurationMinutes: number;
  tasksCompleted: number;
  totalTasks: number;
  completedSuccessfully: boolean;
  exitedEarly: boolean;
}

export const defaultOperatorSettings: OperatorModeSettings = {
  grayscaleMode: true,
  hideDistractingApps: true,
  simplifiedLockScreen: false,
  blockNonEssentialNotifications: true,
  allowFavoritesCalls: true,
  allowCriticalApps: false,
  autoReplyTexts: true,
  autoReplyMessage: "I'm in Operator Mode. I'll respond when I'm done executing.",
  autoReplyMissedCalls: false,
  startFocusPlaylist: false,
  triggerSmartHome: false,
  startTimer: true,
  defaultDurationMinutes: 90,
  burnStrikeOnExit: true,
  notifyCrewOnExit: true,
  breakStreakOnExit: false,
  cooldownHours: 2,
  requireCrewApprovalToExit: false,
};

export const defaultProtocols: OperatorModeProtocol[] = [
  {
    id: "standard",
    name: "STANDARD",
    description: "Grayscale, notification blocking",
    durationMinutes: 0,
    settings: { ...defaultOperatorSettings },
    isCustom: false,
  },
  {
    id: "deep-work",
    name: "DEEP WORK",
    description: "Strictest settings, Crew approval to exit",
    durationMinutes: 0,
    settings: {
      ...defaultOperatorSettings,
      requireCrewApprovalToExit: true,
      breakStreakOnExit: true,
    },
    isCustom: false,
  },
  {
    id: "fitness",
    name: "FITNESS",
    description: "Only health apps accessible",
    durationMinutes: 0,
    settings: {
      ...defaultOperatorSettings,
      grayscaleMode: false,
      allowCriticalApps: true,
    },
    isCustom: false,
  },
  {
    id: "family",
    name: "FAMILY",
    description: "Work apps blocked, family contacts only",
    durationMinutes: 0,
    settings: {
      ...defaultOperatorSettings,
      grayscaleMode: false,
      hideDistractingApps: true,
      allowFavoritesCalls: true,
    },
    isCustom: false,
  },
  {
    id: "nuclear",
    name: "NUCLEAR",
    description: "Phone locked entirely, emergency calls only",
    durationMinutes: 0,
    settings: {
      ...defaultOperatorSettings,
      grayscaleMode: true,
      hideDistractingApps: true,
      blockNonEssentialNotifications: true,
      allowFavoritesCalls: false,
      allowCriticalApps: false,
      requireCrewApprovalToExit: true,
      breakStreakOnExit: true,
    },
    isCustom: false,
  },
];

export interface OperatorModeConfig {
  isSetupComplete: boolean;
  selectedProtocolId: string;
  customSettings: OperatorModeSettings;
  protocols: OperatorModeProtocol[];
}

export const defaultOperatorModeConfig: OperatorModeConfig = {
  isSetupComplete: false,
  selectedProtocolId: "standard",
  customSettings: { ...defaultOperatorSettings },
  protocols: [...defaultProtocols],
};

export async function getOperatorModeConfig(): Promise<OperatorModeConfig> {
  try {
    const data = await AsyncStorage.getItem(KEYS.OPERATOR_MODE_CONFIG);
    if (data) {
      return JSON.parse(data);
    }
    return defaultOperatorModeConfig;
  } catch (error) {
    console.error("Error getting operator mode config:", error);
    return defaultOperatorModeConfig;
  }
}

export async function saveOperatorModeConfig(config: OperatorModeConfig): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.OPERATOR_MODE_CONFIG, JSON.stringify(config));
  } catch (error) {
    console.error("Error saving operator mode config:", error);
  }
}

export async function getOperatorModeSession(): Promise<OperatorModeSession | null> {
  try {
    const data = await AsyncStorage.getItem(KEYS.OPERATOR_MODE_SESSION);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error("Error getting operator mode session:", error);
    return null;
  }
}

export async function saveOperatorModeSession(session: OperatorModeSession | null): Promise<void> {
  try {
    if (session) {
      await AsyncStorage.setItem(KEYS.OPERATOR_MODE_SESSION, JSON.stringify(session));
    } else {
      await AsyncStorage.removeItem(KEYS.OPERATOR_MODE_SESSION);
    }
  } catch (error) {
    console.error("Error saving operator mode session:", error);
  }
}

export async function getOperatorModeHistory(): Promise<OperatorModeHistoryEntry[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.OPERATOR_MODE_HISTORY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Error getting operator mode history:", error);
    return [];
  }
}

export async function addOperatorModeHistoryEntry(entry: OperatorModeHistoryEntry): Promise<void> {
  try {
    const history = await getOperatorModeHistory();
    history.unshift(entry);
    const trimmedHistory = history.slice(0, 50);
    await AsyncStorage.setItem(KEYS.OPERATOR_MODE_HISTORY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error("Error adding operator mode history entry:", error);
  }
}

export interface ProofEntry {
  id: string;
  triggerId: string;
  triggerType: "streak_milestone" | "win_rate_threshold" | "recovery_win" | "first_week";
  triggerLabel: string;
  format: "voice" | "text";
  content: string;
  audioUri?: string;
  streakAtCapture: number;
  lifeScoreAtCapture: number;
  capturedAt: string;
  visibility: "private";
}

export interface ProofTriggerRecord {
  triggerId: string;
  firedAt: string;
}

export async function getProofVault(): Promise<ProofEntry[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.PROOF_VAULT);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Error getting proof vault:", error);
    return [];
  }
}

export async function addProofEntry(entry: ProofEntry): Promise<void> {
  try {
    const vault = await getProofVault();
    vault.unshift(entry);
    await AsyncStorage.setItem(KEYS.PROOF_VAULT, JSON.stringify(vault));
  } catch (error) {
    console.error("Error adding proof entry:", error);
  }
}

export async function getProofTriggersFired(): Promise<ProofTriggerRecord[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.PROOF_TRIGGERS_FIRED);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Error getting proof triggers:", error);
    return [];
  }
}

export async function addProofTriggerFired(trigger: ProofTriggerRecord): Promise<void> {
  try {
    const triggers = await getProofTriggersFired();
    triggers.push(trigger);
    await AsyncStorage.setItem(KEYS.PROOF_TRIGGERS_FIRED, JSON.stringify(triggers));
  } catch (error) {
    console.error("Error adding proof trigger:", error);
  }
}

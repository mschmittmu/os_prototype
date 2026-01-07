import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  TASKS: "@operator_tasks",
  USER: "@operator_user",
  STREAK: "@operator_streak",
  LAST_COMPLETED_DATE: "@operator_last_completed",
  BIOMETRIC_ENABLED: "@operator_biometric_enabled",
};

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
      return JSON.parse(data);
    }
    await saveTasks(defaultTasks);
    return defaultTasks;
  } catch (error) {
    console.error("Error getting tasks:", error);
    return defaultTasks;
  }
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

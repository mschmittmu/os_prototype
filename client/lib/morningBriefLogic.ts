import { IdentityClaims, Task, StreakData } from "@/lib/storage";

export type Severity = "critical" | "warning" | "observation";

export interface PatternCallOut {
  message: string;
  severity: Severity;
}

export interface Directive {
  message: string;
}

export interface YesterdayResult {
  outcome: "win" | "loss" | "no_data";
  streakCount: number;
  totalLosses: number;
  streakBrokenAt?: number;
  date: string;
}

const DOMAIN_TO_CATEGORY: Record<string, string[]> = {
  PHYSICAL: ["Health", "Physical", "Fitness", "Workout", "Health & Fitness"],
  WORK: ["Business", "Work", "Career", "Business & Career"],
  MENTAL: ["Mental", "Mindset", "Self Development", "Reading"],
  FINANCIAL: ["Financial", "Finance", "Money"],
  RELATIONSHIPS: ["Family", "Relationships", "Social", "Family & Relationships"],
  DISCIPLINE: ["Discipline", "Consistency", "Habits"],
};

function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

export function getYesterdayResult(
  tasks: Task[],
  streak: StreakData
): YesterdayResult {
  const yesterdayDate = getYesterdayDateString();

  const yesterdayTasks = tasks.filter((t) => {
    const taskDate = t.createdAt.split("T")[0];
    return taskDate === yesterdayDate;
  });

  if (yesterdayTasks.length === 0) {
    const allCompleted = tasks.length === 5 && tasks.every((t) => t.completed);
    if (allCompleted) {
      return {
        outcome: "win",
        streakCount: streak.current,
        totalLosses: streak.totalDaysLost,
        date: yesterdayDate,
      };
    }
    if (tasks.length === 5 && tasks.some((t) => t.completed)) {
      return {
        outcome: "loss",
        streakCount: 0,
        totalLosses: streak.totalDaysLost,
        streakBrokenAt: streak.best > streak.current ? streak.best : streak.current,
        date: yesterdayDate,
      };
    }
    return {
      outcome: "no_data",
      streakCount: 0,
      totalLosses: streak.totalDaysLost,
      date: yesterdayDate,
    };
  }

  const allCompleted =
    yesterdayTasks.length === 5 && yesterdayTasks.every((t) => t.completed);

  if (allCompleted) {
    return {
      outcome: "win",
      streakCount: streak.current,
      totalLosses: streak.totalDaysLost,
      date: yesterdayDate,
    };
  }

  return {
    outcome: "loss",
    streakCount: 0,
    totalLosses: streak.totalDaysLost,
    streakBrokenAt: streak.best > streak.current ? streak.best : streak.current,
    date: yesterdayDate,
  };
}

export function getPatternCallOut(
  claims: IdentityClaims | null,
  tasks: Task[],
  streak: StreakData
): PatternCallOut {
  const totalDays = streak.totalDaysWon + streak.totalDaysLost;
  const lossRate = totalDays > 0 ? streak.totalDaysLost / totalDays : 0;

  if (lossRate > 0.2 && totalDays >= 5) {
    const winRate = Math.round((1 - lossRate) * 100);
    return {
      message: `Your win rate is ${winRate}%. That's not discipline. That's inconsistency.`,
      severity: "critical",
    };
  }

  if (claims?.priorityDomain) {
    const domainCategories =
      DOMAIN_TO_CATEGORY[claims.priorityDomain] || [];
    const hasDomainTask = tasks.some((t) =>
      domainCategories.some(
        (cat) => t.category.toLowerCase().includes(cat.toLowerCase())
      )
    );
    if (!hasDomainTask && domainCategories.length > 0) {
      return {
        message: `You claim ${claims.priorityDomain} is your focus. Time to see you implement daily with your task list.`,
        severity: "warning",
      };
    }
  }

  if (claims?.avoidancePatterns && claims.avoidancePatterns.length > 0) {
    const pattern =
      claims.avoidancePatterns[
        Math.floor(Math.random() * claims.avoidancePatterns.length)
      ];
    return {
      message: `You admitted you avoid "${pattern}." Are you avoiding it right now?`,
      severity: "warning",
    };
  }

  return {
    message:
      "Strong execution lately. Don't confuse momentum with transformation.",
    severity: "observation",
  };
}

export function getDirective(
  pattern: PatternCallOut,
  yesterdayResult: YesterdayResult,
  claims: IdentityClaims | null
): Directive {
  if (yesterdayResult.outcome === "loss") {
    return { message: "WIN TODAY. NOTHING ELSE MATTERS." };
  }

  if (
    pattern.severity === "warning" &&
    claims?.priorityDomain &&
    pattern.message.includes(claims.priorityDomain)
  ) {
    return {
      message: `ADD ONE ${claims.priorityDomain.toUpperCase()} TASK TO TODAY'S LIST.`,
    };
  }

  if (
    pattern.severity === "warning" &&
    claims?.avoidancePatterns &&
    pattern.message.includes("avoid")
  ) {
    return { message: "DO THE THING YOU'RE AVOIDING FIRST." };
  }

  if (pattern.severity === "critical") {
    return { message: "STOP MAKING EXCUSES. START EXECUTING." };
  }

  return { message: "EXECUTE. NO NEGOTIATION." };
}

export function isFirstTimeUser(tasks: Task[], streak: StreakData): boolean {
  const hasNoHistory = streak.totalDaysWon === 0 && streak.totalDaysLost === 0;
  const hasNoTasks = tasks.length === 0;
  return hasNoHistory && hasNoTasks;
}

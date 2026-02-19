import { Task } from "@/lib/storage";

export function calculateDayResult(tasks: Task[]): {
  outcome: "win" | "loss";
  completed: number;
  total: number;
  completionPct: number;
} {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const outcome = completed === total && total > 0 ? "win" : "loss";
  return { outcome, completed, total, completionPct };
}

export function calculateStreakImpact(
  currentStreak: number,
  outcome: "win" | "loss"
): { before: number; after: number; direction: "up" | "broken" } {
  if (outcome === "win") {
    return { before: currentStreak, after: currentStreak + 1, direction: "up" };
  }
  return { before: currentStreak, after: 0, direction: "broken" };
}

export function calculateLifeScorePreview(
  currentScore: number,
  outcome: "win" | "loss",
  completionPct: number
): { delta: number; projected: number } {
  let delta: number;
  if (outcome === "win") {
    delta = 1;
  } else if (completionPct >= 80) {
    delta = 0;
  } else if (completionPct >= 60) {
    delta = -1;
  } else {
    delta = -2;
  }
  const projected = Math.max(0, Math.min(100, currentScore + delta));
  return { delta, projected };
}

export function getMissReasonOptions(): string[] {
  return [
    "Time management",
    "Energy",
    "Avoidance",
    "External factor",
    "Forgot",
    "Deprioritized",
  ];
}

export function getReflectionPrompt(dayOfWeek: number): string {
  const prompts = [
    "What would you do differently today?",
    "What was the hardest moment today and how did you handle it?",
    "What pattern do you keep repeating that needs to stop?",
    "What did you execute on today that you can build on tomorrow?",
    "Where did you compromise your standard today?",
    "What truth are you avoiding that would change everything?",
    "Looking at this week, what needs to change on Monday?",
  ];
  return prompts[dayOfWeek] || prompts[0];
}

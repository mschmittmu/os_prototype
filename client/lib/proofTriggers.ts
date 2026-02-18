import { getStreak, getProofTriggersFired } from "@/lib/storage";

export interface ProofTriggerResult {
  shouldTrigger: boolean;
  triggerId: string;
  triggerType: "streak_milestone" | "win_rate_threshold" | "recovery_win" | "first_week";
  triggerLabel: string;
  message: string;
}

const STREAK_MILESTONES: { days: number; label: string; message: string }[] = [
  { days: 7, label: "7-Day Streak", message: "7 DAYS. YOU SHOWED UP." },
  { days: 14, label: "14-Day Streak", message: "14 DAYS. PATTERN ESTABLISHED." },
  { days: 30, label: "30-Day Streak", message: "30 DAYS. THIS IS WHO YOU ARE NOW." },
  { days: 75, label: "75-Day Streak", message: "75 DAYS. MOST PEOPLE QUIT AT 3." },
  { days: 100, label: "100-Day Streak", message: "100 DAYS. LEGENDARY." },
];

export async function checkProofTriggers(): Promise<ProofTriggerResult | null> {
  try {
    const [streak, firedTriggers] = await Promise.all([
      getStreak(),
      getProofTriggersFired(),
    ]);

    const firedIds = new Set(firedTriggers.map((t) => t.triggerId));

    for (const milestone of STREAK_MILESTONES) {
      const triggerId = `streak_${milestone.days}`;
      if (streak.current >= milestone.days && !firedIds.has(triggerId)) {
        return {
          shouldTrigger: true,
          triggerId,
          triggerType: "streak_milestone",
          triggerLabel: milestone.label,
          message: milestone.message,
        };
      }
    }

    const totalDays = streak.totalDaysWon + streak.totalDaysLost;
    if (totalDays >= 5) {
      const winRate = (streak.totalDaysWon / totalDays) * 100;
      if (winRate >= 80 && !firedIds.has("win_rate_80")) {
        return {
          shouldTrigger: true,
          triggerId: "win_rate_80",
          triggerType: "win_rate_threshold",
          triggerLabel: "80% Win Rate",
          message: "80% WIN RATE. CONSISTENCY IS YOUR WEAPON.",
        };
      }
    }

    if (
      streak.current === 1 &&
      streak.totalDaysLost >= 3 &&
      !firedIds.has("recovery_win")
    ) {
      return {
        shouldTrigger: true,
        triggerId: "recovery_win",
        triggerType: "recovery_win",
        triggerLabel: "Recovery Win",
        message: "YOU FELL. YOU GOT BACK UP. THAT'S THE STANDARD.",
      };
    }

    if (totalDays >= 7 && !firedIds.has("first_week")) {
      return {
        shouldTrigger: true,
        triggerId: "first_week",
        triggerType: "first_week",
        triggerLabel: "First Week Complete",
        message: "FIRST WEEK COMPLETE. THE FOUNDATION IS SET.",
      };
    }

    return null;
  } catch (error) {
    console.error("Error checking proof triggers:", error);
    return null;
  }
}

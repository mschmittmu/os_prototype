export interface StrikeRule {
  trigger: string;
  severity: string;
  strikeValue: number;
}

export const STRIKE_RULES: StrikeRule[] = [
  { trigger: "daily_loss", severity: "Standard", strikeValue: 1 },
  { trigger: "critical_task_missed", severity: "Elevated", strikeValue: 1 },
  { trigger: "pattern_failure", severity: "Pattern", strikeValue: 2 },
  { trigger: "reflection_skipped", severity: "Standard", strikeValue: 1 },
  { trigger: "operator_mode_exit", severity: "Elevated", strikeValue: 1 },
  { trigger: "streak_broken", severity: "Behavioral", strikeValue: 2 },
];

export type EscalationTier = "green" | "yellow" | "orange" | "red";

export function calculateEscalationTier(activeStrikes: number): EscalationTier {
  if (activeStrikes <= 1) return "green";
  if (activeStrikes <= 3) return "yellow";
  if (activeStrikes <= 5) return "orange";
  return "red";
}

export interface TierConfig {
  color: string;
  label: string;
  description: string;
  restrictions: string[];
}

export function getTierConfig(tier: EscalationTier): TierConfig {
  switch (tier) {
    case "green":
      return {
        color: "#10B981",
        label: "GREEN",
        description: "Normal operation",
        restrictions: [],
      };
    case "yellow":
      return {
        color: "#F59E0B",
        label: "YELLOW",
        description: "Elevated pressure",
        restrictions: ["Increased accountability reminders"],
      };
    case "orange":
      return {
        color: "#F97316",
        label: "ORANGE",
        description: "Restricted mode",
        restrictions: ["Social feed restricted", "Recovery protocol required"],
      };
    case "red":
      return {
        color: "#EF4444",
        label: "RED",
        description: "Critical intervention",
        restrictions: [
          "Social feed locked",
          "Recovery protocol mandatory",
          "All non-essential features restricted",
        ],
      };
  }
}

export function getStrikeReasonDisplay(reason: string): {
  icon: string;
  label: string;
} {
  switch (reason) {
    case "daily_loss":
      return { icon: "x-circle", label: "Daily loss" };
    case "critical_task_missed":
      return { icon: "alert-triangle", label: "Critical task missed" };
    case "pattern_failure":
      return { icon: "repeat", label: "Pattern failure" };
    case "reflection_skipped":
      return { icon: "edit-3", label: "Reflection skipped" };
    case "operator_mode_exit":
      return { icon: "log-out", label: "Operator Mode exit" };
    case "streak_broken":
      return { icon: "zap-off", label: "Streak broken" };
    default:
      return { icon: "alert-circle", label: reason };
  }
}

import { EscalationTier } from "@/lib/strikeLogic";

export interface GateResult {
  gated: boolean;
  reason:
    | "none"
    | "strike_lock"
    | "buyin_brief"
    | "new_user"
    | "inactive";
  data: Record<string, any>;
}

export function checkSocialGate(
  streak: number,
  daysInactive: number,
  strikeTier: EscalationTier,
  briefViewedToday: boolean,
  daysInApp: number
): GateResult {
  if (strikeTier === "red") {
    return {
      gated: true,
      reason: "strike_lock",
      data: { tier: strikeTier },
    };
  }

  if (daysInApp <= 14 && !briefViewedToday) {
    return {
      gated: true,
      reason: "buyin_brief",
      data: { daysInApp },
    };
  }

  if (streak < 3 && daysInApp <= 14) {
    return {
      gated: true,
      reason: "new_user",
      data: { streak, required: 3 },
    };
  }

  if (daysInactive >= 3) {
    return {
      gated: true,
      reason: "inactive",
      data: { daysInactive },
    };
  }

  return { gated: false, reason: "none", data: {} };
}

export function checkCrewPostGate(streak: number): boolean {
  return streak <= 0;
}

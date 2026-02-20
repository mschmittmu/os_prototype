import { IdentityClaims } from "@/lib/storage";

export interface ContradictionRule {
  claimPattern: string;
  triggerCondition: string;
  outputTemplate: string;
  domain: string;
}

export interface Contradiction {
  id: string;
  claim: string;
  evidence: string;
  domain: string;
  domainScore: number;
  dateDetected: string;
  severity: "critical" | "warning";
}

export const CONTRADICTION_RULES: ContradictionRule[] = [
  {
    claimPattern: "disciplined",
    triggerCondition: "4+ losses in 7 days",
    outputTemplate: "4 losses in 7 days",
    domain: "DISCIPLINE",
  },
  {
    claimPattern: "family",
    triggerCondition: "Zero relationship tasks in 10 days",
    outputTemplate: "Zero relationship tasks in 10 days",
    domain: "RELATIONSHIPS",
  },
  {
    claimPattern: "financial",
    triggerCondition: "Financial tasks avoided 6+ times",
    outputTemplate: "Financial tasks avoided 6 times this month",
    domain: "FINANCIAL",
  },
  {
    claimPattern: "physical",
    triggerCondition: "No physical tasks in 5+ days",
    outputTemplate: "No physical tasks in 5 days",
    domain: "PHYSICAL",
  },
  {
    claimPattern: "consistent",
    triggerCondition: "Win rate below 60%",
    outputTemplate: "Win rate is below 60%",
    domain: "CONSISTENCY",
  },
  {
    claimPattern: "mental",
    triggerCondition: "No mental/reading tasks in 7 days",
    outputTemplate: "No mindset or reading tasks in 7 days",
    domain: "MENTAL CONTROL",
  },
];

export function detectContradictions(
  claims: IdentityClaims | null,
  behaviorData: {
    lossesLast7Days?: number;
    relationshipTasksLast10Days?: number;
    financialTasksSkipped?: number;
    physicalTaskGapDays?: number;
    winRate?: number;
    mentalTaskGapDays?: number;
    domainScores?: Record<string, number>;
  }
): Contradiction[] {
  if (!claims) return [];

  const contradictions: Contradiction[] = [];
  const allClaims = [
    claims.coreIdentity || "",
    claims.priorityDomain || "",
    claims.behavioralStandard || "",
    ...(claims.avoidancePatterns || []),
  ]
    .join(" ")
    .toLowerCase();

  const domainScores = behaviorData.domainScores || {};
  const today = new Date().toISOString().split("T")[0];

  for (const rule of CONTRADICTION_RULES) {
    if (!allClaims.includes(rule.claimPattern.toLowerCase())) continue;

    let triggered = false;

    switch (rule.domain) {
      case "DISCIPLINE":
        triggered = (behaviorData.lossesLast7Days || 0) >= 4;
        break;
      case "RELATIONSHIPS":
        triggered = (behaviorData.relationshipTasksLast10Days || 0) === 0;
        break;
      case "FINANCIAL":
        triggered = (behaviorData.financialTasksSkipped || 0) >= 6;
        break;
      case "PHYSICAL":
        triggered = (behaviorData.physicalTaskGapDays || 0) >= 5;
        break;
      case "CONSISTENCY":
        triggered = (behaviorData.winRate || 100) < 60;
        break;
      case "MENTAL CONTROL":
        triggered = (behaviorData.mentalTaskGapDays || 0) >= 7;
        break;
    }

    if (triggered) {
      const claimText = getClaimText(claims, rule.claimPattern);
      contradictions.push({
        id: `contradiction_${rule.domain}_${Date.now()}`,
        claim: claimText,
        evidence: rule.outputTemplate,
        domain: rule.domain,
        domainScore: domainScores[rule.domain] || 0,
        dateDetected: today,
        severity: (domainScores[rule.domain] || 50) < 40 ? "critical" : "warning",
      });
    }
  }

  return contradictions;
}

function getClaimText(claims: IdentityClaims, pattern: string): string {
  const p = pattern.toLowerCase();
  if (claims.coreIdentity?.toLowerCase().includes(p)) {
    return claims.coreIdentity;
  }
  if (claims.priorityDomain?.toLowerCase().includes(p)) {
    return `${claims.priorityDomain} is my priority`;
  }
  if (claims.behavioralStandard?.toLowerCase().includes(p)) {
    return claims.behavioralStandard;
  }
  const match = (claims.avoidancePatterns || []).find((a) =>
    a.toLowerCase().includes(p)
  );
  if (match) return `I'm working on: ${match}`;
  return `I'm becoming ${pattern}`;
}

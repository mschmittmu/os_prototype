import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Contradiction } from "@/lib/contradictionLogic";

interface Props {
  contradiction: Contradiction;
  compact?: boolean;
}

export function IdentityContradictionCard({ contradiction, compact }: Props) {
  const { theme } = useTheme();

  const borderColor =
    contradiction.severity === "critical" ? theme.error : theme.warning;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundSecondary,
          borderLeftColor: borderColor,
        },
      ]}
    >
      <View style={styles.header}>
        <Feather name="alert-octagon" size={14} color={borderColor} />
        <ThemedText style={[styles.label, { color: borderColor }]}>
          IDENTITY CONTRADICTION
        </ThemedText>
      </View>

      <View style={styles.claimRow}>
        <ThemedText type="small" secondary style={styles.claimLabel}>
          You said:
        </ThemedText>
        <ThemedText type="body" style={[styles.claimText, { color: theme.text }]}>
          "{contradiction.claim}"
        </ThemedText>
      </View>

      <View style={styles.evidenceRow}>
        <ThemedText type="small" secondary style={styles.claimLabel}>
          Reality:
        </ThemedText>
        <ThemedText
          type="body"
          style={[styles.evidenceText, { color: borderColor }]}
        >
          {contradiction.evidence}
        </ThemedText>
      </View>

      {!compact ? (
        <View style={styles.footer}>
          <View style={styles.domainBadge}>
            <Feather name="target" size={12} color={theme.textSecondary} />
            <ThemedText type="caption" secondary>
              {contradiction.domain}
            </ThemedText>
          </View>
          {contradiction.domainScore > 0 ? (
            <ThemedText type="caption" style={{ color: borderColor }}>
              Score: {contradiction.domainScore}
            </ThemedText>
          ) : null}
          <ThemedText type="caption" secondary>
            {contradiction.dateDetected}
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 3,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  claimRow: {
    marginBottom: Spacing.sm,
  },
  claimLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  claimText: {
    fontStyle: "italic",
  },
  evidenceRow: {
    marginBottom: Spacing.md,
  },
  evidenceText: {
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(128,128,128,0.2)",
  },
  domainBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});

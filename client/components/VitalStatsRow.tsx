import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";

interface VitalStatsRowProps {
  streak: number;
  winRate: number;
  winRatePeriod: string;
  totalDays: number;
}

export function VitalStatsRow({
  streak,
  winRate,
  winRatePeriod,
  totalDays,
}: VitalStatsRowProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.statCard, { backgroundColor: theme.backgroundSecondary }]}>
        <Feather name="zap" size={18} color={theme.accent} style={styles.icon} />
        <ThemedText style={styles.statNumber}>{streak}</ThemedText>
        <ThemedText type="caption" secondary style={styles.statLabel}>
          STREAK
        </ThemedText>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.backgroundTertiary }]} />

      <View style={[styles.statCard, { backgroundColor: theme.backgroundSecondary }]}>
        <Feather name="trending-up" size={18} color={theme.success} style={styles.icon} />
        <ThemedText style={styles.statNumber}>{winRate}%</ThemedText>
        <ThemedText type="caption" secondary style={styles.statLabel}>
          WIN RATE
        </ThemedText>
        <ThemedText type="caption" secondary style={styles.periodLabel}>
          ({winRatePeriod})
        </ThemedText>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.backgroundTertiary }]} />

      <View style={[styles.statCard, { backgroundColor: theme.backgroundSecondary }]}>
        <Feather name="calendar" size={18} color={theme.navy} style={styles.icon} />
        <ThemedText style={styles.statNumber}>{totalDays}</ThemedText>
        <ThemedText type="caption" secondary style={styles.statLabel}>
          TOTAL DAYS
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  divider: {
    width: 1,
    alignSelf: "stretch",
  },
  icon: {
    marginBottom: Spacing.sm,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
  },
  statLabel: {
    marginTop: Spacing.xs,
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "center",
  },
  periodLabel: {
    fontSize: 10,
    marginTop: 2,
  },
});

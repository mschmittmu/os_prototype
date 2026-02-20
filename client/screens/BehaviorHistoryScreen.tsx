import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  behaviorHistory,
  BehaviorEvent,
  hudData,
} from "@/lib/mockData";

type FilterType = "all" | "win" | "loss" | "strike" | "streak_milestone" | "proof" | "contradiction";

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "win", label: "Wins" },
  { key: "loss", label: "Losses" },
  { key: "strike", label: "Strikes" },
  { key: "streak_milestone", label: "Milestones" },
  { key: "proof", label: "Proof" },
  { key: "contradiction", label: "Contradictions" },
];

const DOT_COLORS: Record<string, string> = {
  win: "#10B981",
  loss: "#EF4444",
  strike: "#F97316",
  strike_cleared: "#3B82F6",
  streak_milestone: "#F59E0B",
  proof: "#8B5CF6",
  contradiction: "#F97316",
};

const DOT_ICONS: Record<string, string> = {
  win: "check-circle",
  loss: "x-circle",
  strike: "alert-triangle",
  strike_cleared: "check-square",
  streak_milestone: "award",
  proof: "camera",
  contradiction: "alert-octagon",
};

function formatCompactDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function BehaviorHistoryScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const totalDays = hudData.vitalStats.totalDays;

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return behaviorHistory;
    if (activeFilter === "strike") {
      return behaviorHistory.filter(
        (e) => e.type === "strike" || e.type === "strike_cleared"
      );
    }
    return behaviorHistory.filter((e) => e.type === activeFilter);
  }, [activeFilter]);

  const totalWins = behaviorHistory.filter((e) => e.type === "win").length;
  const totalLosses = behaviorHistory.filter((e) => e.type === "loss").length;
  const winRate =
    totalWins + totalLosses > 0
      ? Math.round((totalWins / (totalWins + totalLosses)) * 100)
      : 0;
  const longestStreak = Math.max(
    ...behaviorHistory
      .filter((e) => e.streakCount !== undefined)
      .map((e) => e.streakCount!),
    0
  );
  const totalStrikes = behaviorHistory.filter((e) => e.type === "strike").length;

  const renderEvent = ({ item, index }: { item: BehaviorEvent; index: number }) => {
    const dotColor = DOT_COLORS[item.type] || theme.textSecondary;
    const iconName = DOT_ICONS[item.type] || "circle";
    const isLast = index === filteredEvents.length - 1;

    return (
      <View style={styles.timelineRow}>
        <View style={styles.dateColumn}>
          <ThemedText type="caption" secondary style={styles.dateText}>
            {formatCompactDate(item.date)}
          </ThemedText>
        </View>

        <View style={styles.lineColumn}>
          <View style={[styles.dot, { backgroundColor: dotColor }]}>
            <Feather name={iconName as any} size={10} color="#FFFFFF" />
          </View>
          {!isLast ? (
            <View
              style={[styles.verticalLine, { backgroundColor: theme.border }]}
            />
          ) : null}
        </View>

        <View
          style={[
            styles.eventCard,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.eventHeader}>
            <ThemedText
              type="small"
              style={[styles.eventTitle, { color: dotColor }]}
            >
              {item.title}
            </ThemedText>
            {item.streakCount !== undefined && item.streakCount > 0 ? (
              <View style={styles.streakBadge}>
                <Feather name="zap" size={10} color={theme.warning} />
                <ThemedText type="caption" style={{ color: theme.warning }}>
                  {item.streakCount}
                </ThemedText>
              </View>
            ) : null}
          </View>
          <ThemedText type="body" style={{ color: theme.text }}>
            {item.subtitle}
          </ThemedText>
          {item.type === "contradiction" ? (
            <View style={styles.contradictionDetail}>
              <ThemedText type="caption" secondary>
                Claim: "{item.contradictionClaim}"
              </ThemedText>
              <ThemedText
                type="caption"
                style={{ color: DOT_COLORS.contradiction }}
              >
                Reality: {item.contradictionEvidence}
              </ThemedText>
            </View>
          ) : null}
          {item.type === "streak_milestone" && item.milestoneTag ? (
            <View
              style={[
                styles.milestoneBadge,
                { backgroundColor: DOT_COLORS.streak_milestone + "20" },
              ]}
            >
              <Feather name="award" size={12} color={DOT_COLORS.streak_milestone} />
              <ThemedText
                type="caption"
                style={{ color: DOT_COLORS.streak_milestone }}
              >
                {item.milestoneTag}
              </ThemedText>
            </View>
          ) : null}
          {item.type === "proof" && item.milestoneTag ? (
            <View
              style={[
                styles.milestoneBadge,
                { backgroundColor: DOT_COLORS.proof + "20" },
              ]}
            >
              <Feather name="camera" size={12} color={DOT_COLORS.proof} />
              <ThemedText
                type="caption"
                style={{ color: DOT_COLORS.proof }}
              >
                {item.milestoneTag}
              </ThemedText>
            </View>
          ) : null}
          {item.lifeScoreAtTime ? (
            <ThemedText type="caption" secondary style={{ marginTop: 4 }}>
              Life Score: {item.lifeScoreAtTime}
            </ThemedText>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <ThemedText type="h2" style={{ textAlign: "center" }}>
          BEHAVIOR RECORD
        </ThemedText>
        <ThemedText
          type="small"
          secondary
          style={{ textAlign: "center", marginTop: Spacing.xs }}
        >
          Your history never resets.
        </ThemedText>
        <View
          style={[
            styles.daysTracked,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <ThemedText type="statSmall" style={{ color: theme.accent }}>
            {totalDays}
          </ThemedText>
          <ThemedText type="caption" secondary>
            DAYS ON RECORD
          </ThemedText>
        </View>
      </Animated.View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScrollView}
      >
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <Pressable
              key={f.key}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive
                    ? theme.accent
                    : theme.backgroundSecondary,
                  borderColor: isActive ? theme.accent : theme.border,
                },
              ]}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setActiveFilter(f.key);
              }}
            >
              <ThemedText
                type="caption"
                style={{
                  color: isActive ? "#FFFFFF" : theme.textSecondary,
                  fontWeight: isActive ? "700" : "500",
                }}
              >
                {f.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={filteredEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + Spacing["3xl"] },
        ]}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <Animated.View
            entering={FadeInDown.duration(400).delay(200)}
            style={[
              styles.summaryCard,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            <ThemedText
              type="caption"
              secondary
              style={[styles.summaryTitle, { letterSpacing: 1.5 }]}
            >
              SUMMARY
            </ThemedText>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <ThemedText
                  type="statSmall"
                  style={{ color: DOT_COLORS.win }}
                >
                  {totalWins}
                </ThemedText>
                <ThemedText type="caption" secondary>
                  Wins
                </ThemedText>
              </View>
              <View style={styles.summaryItem}>
                <ThemedText
                  type="statSmall"
                  style={{ color: DOT_COLORS.loss }}
                >
                  {totalLosses}
                </ThemedText>
                <ThemedText type="caption" secondary>
                  Losses
                </ThemedText>
              </View>
              <View style={styles.summaryItem}>
                <ThemedText type="statSmall" style={{ color: theme.accent }}>
                  {winRate}%
                </ThemedText>
                <ThemedText type="caption" secondary>
                  Win Rate
                </ThemedText>
              </View>
            </View>
            <View
              style={[styles.divider, { backgroundColor: theme.border }]}
            />
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <ThemedText
                  type="statSmall"
                  style={{ color: DOT_COLORS.streak_milestone }}
                >
                  {longestStreak}
                </ThemedText>
                <ThemedText type="caption" secondary>
                  Best Streak
                </ThemedText>
              </View>
              <View style={styles.summaryItem}>
                <ThemedText
                  type="statSmall"
                  style={{ color: DOT_COLORS.strike }}
                >
                  {totalStrikes}
                </ThemedText>
                <ThemedText type="caption" secondary>
                  Strikes
                </ThemedText>
              </View>
              <View style={styles.summaryItem}>
                <ThemedText type="statSmall" style={{ color: theme.accent }}>
                  {hudData.lifeScore.current}
                </ThemedText>
                <ThemedText type="caption" secondary>
                  Life Score
                </ThemedText>
              </View>
            </View>
          </Animated.View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  daysTracked: {
    alignSelf: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  filterScrollView: {
    flexGrow: 0,
    marginBottom: Spacing.md,
  },
  filterRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  timelineRow: {
    flexDirection: "row",
    minHeight: 72,
  },
  dateColumn: {
    width: 50,
    paddingTop: Spacing.md,
    alignItems: "flex-end",
    paddingRight: Spacing.sm,
  },
  dateText: {
    fontSize: 11,
    fontWeight: "600",
  },
  lineColumn: {
    width: 28,
    alignItems: "center",
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.md,
    zIndex: 1,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    marginTop: -2,
  },
  eventCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  eventTitle: {
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontSize: 12,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  contradictionDetail: {
    marginTop: Spacing.sm,
    gap: 2,
  },
  milestoneBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    marginTop: Spacing.sm,
  },
  summaryCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.xl,
    marginTop: Spacing.xl,
  },
  summaryTitle: {
    textAlign: "center",
    marginBottom: Spacing.lg,
    fontWeight: "700",
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
    gap: 4,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
});

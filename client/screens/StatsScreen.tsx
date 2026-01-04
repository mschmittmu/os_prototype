import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, Pressable, Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Svg, { Rect, Circle as SvgCircle } from "react-native-svg";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { StreakBadge } from "@/components/StreakBadge";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { getStreak, getUser, StreakData, UserData } from "@/lib/storage";

const { width } = Dimensions.get("window");
const CHART_WIDTH = width - Spacing.lg * 2 - Spacing.xl * 2;

const PERIODS = ["Week", "Month", "All Time"];

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState("Week");
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const [streakData, userData] = await Promise.all([
          getStreak(),
          getUser(),
        ]);
        setStreak(streakData);
        setUser(userData);
      };
      loadData();
    }, [])
  );

  const daysWon = streak?.totalDaysWon || 0;
  const daysLost = streak?.totalDaysLost || 0;
  const totalDays = daysWon + daysLost;
  const completionRate = totalDays > 0 ? Math.round((daysWon / totalDays) * 100) : 0;

  const weekData = [
    { day: "Mon", won: true },
    { day: "Tue", won: true },
    { day: "Wed", won: true },
    { day: "Thu", won: false },
    { day: "Fri", won: true },
    { day: "Sat", won: true },
    { day: "Sun", won: false },
  ];

  const categoryData = [
    { name: "Business", percentage: 35, color: "#3B82F6" },
    { name: "Health", percentage: 28, color: "#10B981" },
    { name: "Family", percentage: 18, color: "#F59E0B" },
    { name: "Self Dev", percentage: 19, color: "#8B5CF6" },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + Spacing.xl },
      ]}
    >
      <View style={styles.periodSelector}>
        {PERIODS.map((period) => (
          <Pressable
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <ThemedText
              type="small"
              style={[
                styles.periodText,
                selectedPeriod === period && styles.periodTextActive,
              ]}
            >
              {period}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <View style={styles.streakRow}>
        <Card elevation={1} style={styles.streakCard}>
          <ThemedText type="caption" secondary>
            CURRENT STREAK
          </ThemedText>
          <View style={styles.streakValue}>
            <Feather name="zap" size={24} color={Colors.dark.warning} />
            <ThemedText type="stat">{streak?.current || 0}</ThemedText>
          </View>
          <ThemedText type="small" secondary>
            days
          </ThemedText>
        </Card>
        <Card elevation={1} style={styles.streakCard}>
          <ThemedText type="caption" secondary>
            BEST STREAK
          </ThemedText>
          <View style={styles.streakValue}>
            <Feather name="award" size={24} color={Colors.dark.accent} />
            <ThemedText type="stat">{streak?.best || 0}</ThemedText>
          </View>
          <ThemedText type="small" secondary>
            days
          </ThemedText>
        </Card>
      </View>

      <Card elevation={1} style={styles.chartCard}>
        <ThemedText type="h4" style={styles.cardTitle}>
          DAYS WON VS LOST
        </ThemedText>
        <View style={styles.barChart}>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                styles.barWon,
                { height: `${totalDays > 0 ? (daysWon / totalDays) * 100 : 50}%` },
              ]}
            />
            <ThemedText type="statSmall" style={styles.barValue}>
              {daysWon}
            </ThemedText>
            <ThemedText type="caption" secondary>
              Won
            </ThemedText>
          </View>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                styles.barLost,
                { height: `${totalDays > 0 ? (daysLost / totalDays) * 100 : 50}%` },
              ]}
            />
            <ThemedText type="statSmall" style={styles.barValue}>
              {daysLost}
            </ThemedText>
            <ThemedText type="caption" secondary>
              Lost
            </ThemedText>
          </View>
        </View>
      </Card>

      <Card elevation={1} style={styles.chartCard}>
        <ThemedText type="h4" style={styles.cardTitle}>
          COMPLETION RATE
        </ThemedText>
        <View style={styles.completionContainer}>
          <View style={styles.completionRing}>
            <Svg width={120} height={120}>
              <SvgCircle
                cx={60}
                cy={60}
                r={50}
                stroke={Colors.dark.backgroundSecondary}
                strokeWidth={10}
                fill="none"
              />
              <SvgCircle
                cx={60}
                cy={60}
                r={50}
                stroke={Colors.dark.success}
                strokeWidth={10}
                fill="none"
                strokeDasharray={`${(completionRate / 100) * 314} 314`}
                strokeLinecap="round"
                rotation="-90"
                origin="60, 60"
              />
            </Svg>
            <View style={styles.completionLabel}>
              <ThemedText type="stat">{completionRate}%</ThemedText>
            </View>
          </View>
          <ThemedText type="body" secondary style={styles.completionText}>
            Task completion rate
          </ThemedText>
        </View>
      </Card>

      <Card elevation={1} style={styles.chartCard}>
        <ThemedText type="h4" style={styles.cardTitle}>
          THIS WEEK
        </ThemedText>
        <View style={styles.weekChart}>
          {weekData.map((day, index) => (
            <View key={index} style={styles.dayColumn}>
              <View
                style={[
                  styles.dayDot,
                  day.won ? styles.dayDotWon : styles.dayDotLost,
                ]}
              >
                <Feather
                  name={day.won ? "check" : "x"}
                  size={14}
                  color={Colors.dark.backgroundRoot}
                />
              </View>
              <ThemedText type="caption" secondary>
                {day.day}
              </ThemedText>
            </View>
          ))}
        </View>
      </Card>

      <Card elevation={1} style={styles.chartCard}>
        <ThemedText type="h4" style={styles.cardTitle}>
          CATEGORY BREAKDOWN
        </ThemedText>
        <View style={styles.categoryList}>
          {categoryData.map((cat) => (
            <View key={cat.name} style={styles.categoryRow}>
              <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
              <ThemedText type="body" style={styles.categoryName}>
                {cat.name}
              </ThemedText>
              <View style={styles.categoryBarContainer}>
                <View
                  style={[
                    styles.categoryBar,
                    { width: `${cat.percentage}%`, backgroundColor: cat.color },
                  ]}
                />
              </View>
              <ThemedText type="bodyBold" style={{ color: cat.color }}>
                {cat.percentage}%
              </ThemedText>
            </View>
          ))}
        </View>
      </Card>

      <Card elevation={1} style={styles.insightsCard}>
        <View style={styles.insightsHeader}>
          <Feather name="cpu" size={20} color={Colors.dark.accent} />
          <ThemedText type="h4">AI INSIGHTS</ThemedText>
        </View>
        <ThemedText type="body" style={styles.insightText}>
          Your consistency has improved by 15% this week. You're strongest with Business tasks in the morning. Consider scheduling Health tasks earlier - your completion rate drops 40% for afternoon health tasks.
        </ThemedText>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
  },
  contentContainer: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
  },
  periodButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: "center",
    borderRadius: BorderRadius.md,
  },
  periodButtonActive: {
    backgroundColor: Colors.dark.accent,
  },
  periodText: {
    color: Colors.dark.textSecondary,
  },
  periodTextActive: {
    color: Colors.dark.text,
    fontWeight: "600",
  },
  streakRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  streakCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  streakValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginVertical: Spacing.sm,
  },
  chartCard: {
    paddingVertical: Spacing.xl,
  },
  cardTitle: {
    marginBottom: Spacing.lg,
  },
  barChart: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing["4xl"],
    height: 150,
    alignItems: "flex-end",
  },
  barContainer: {
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  bar: {
    width: 60,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  barWon: {
    backgroundColor: Colors.dark.success,
  },
  barLost: {
    backgroundColor: Colors.dark.error,
  },
  barValue: {
    marginBottom: Spacing.xs,
  },
  completionContainer: {
    alignItems: "center",
    gap: Spacing.md,
  },
  completionRing: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  completionLabel: {
    position: "absolute",
  },
  completionText: {
    textAlign: "center",
  },
  weekChart: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayColumn: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  dayDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  dayDotWon: {
    backgroundColor: Colors.dark.success,
  },
  dayDotLost: {
    backgroundColor: Colors.dark.error,
  },
  categoryList: {
    gap: Spacing.md,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    width: 80,
  },
  categoryBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  categoryBar: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
  insightsCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.dark.accent,
  },
  insightsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  insightText: {
    lineHeight: 24,
  },
});

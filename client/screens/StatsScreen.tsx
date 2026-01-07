import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, Pressable, Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Svg, { Circle as SvgCircle } from "react-native-svg";
import Animated, { FadeInUp } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { BentoGrid, BentoItem } from "@/components/BentoGrid";
import { KineticText, RotatingWords } from "@/components/KineticText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getStreak, getUser, StreakData, UserData } from "@/lib/storage";

const { width } = Dimensions.get("window");

const PERIODS = ["Week", "Month", "All Time"];

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
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

  const bentoItems = [
    {
      icon: "zap" as const,
      label: "Current Streak",
      value: streak?.current || 0,
      subtitle: "days",
      color: theme.warning,
      size: "small" as const,
    },
    {
      icon: "award" as const,
      label: "Best Streak",
      value: streak?.best || 0,
      subtitle: "days",
      color: theme.accent,
      size: "small" as const,
    },
    {
      icon: "check-circle" as const,
      label: "Days Won",
      value: daysWon,
      color: theme.success,
      size: "small" as const,
    },
    {
      icon: "x-circle" as const,
      label: "Days Lost",
      value: daysLost,
      color: theme.error,
      size: "small" as const,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + Spacing.xl },
      ]}
    >
      <View style={styles.header}>
        <KineticText
          text="YOUR STATS"
          type="bounce"
          textType="h2"
          staggerDelay={30}
        />
        <View style={styles.motivationalRow}>
          <ThemedText type="body" secondary>
            You are{" "}
          </ThemedText>
          <RotatingWords
            words={["unstoppable", "disciplined", "winning", "improving"]}
            textType="bodyBold"
            color={theme.accent}
            interval={2500}
          />
        </View>
      </View>

      <View style={styles.periodSelector}>
        {PERIODS.map((period) => (
          <Pressable
            key={period}
            style={[
              styles.periodButton,
              {
                backgroundColor:
                  selectedPeriod === period
                    ? theme.accent
                    : theme.backgroundSecondary,
              },
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <ThemedText
              type="small"
              style={{
                color: selectedPeriod === period ? "#FFFFFF" : theme.textSecondary,
                fontWeight: selectedPeriod === period ? "600" : "400",
              }}
            >
              {period}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <BentoGrid items={bentoItems} />

      <Animated.View entering={FadeInUp.duration(400).delay(400)}>
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
                  stroke={theme.backgroundSecondary}
                  strokeWidth={10}
                  fill="none"
                />
                <SvgCircle
                  cx={60}
                  cy={60}
                  r={50}
                  stroke={theme.success}
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
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(500)}>
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
                    {
                      backgroundColor: day.won ? theme.success : theme.error,
                    },
                  ]}
                >
                  <Feather
                    name={day.won ? "check" : "x"}
                    size={14}
                    color={theme.backgroundRoot}
                  />
                </View>
                <ThemedText type="caption" secondary>
                  {day.day}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(600)}>
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
                <View
                  style={[
                    styles.categoryBarContainer,
                    { backgroundColor: theme.backgroundSecondary },
                  ]}
                >
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
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(700)}>
        <Card
          elevation={1}
          style={StyleSheet.flatten([styles.insightsCard, { borderLeftColor: theme.accent }])}
        >
          <View style={styles.insightsHeader}>
            <Feather name="cpu" size={20} color={theme.accent} />
            <ThemedText type="h4">AI INSIGHTS</ThemedText>
          </View>
          <ThemedText type="body" style={styles.insightText}>
            Your consistency has improved by 15% this week. You're strongest with Business tasks in the morning. Consider scheduling Health tasks earlier - your completion rate drops 40% for afternoon health tasks.
          </ThemedText>
        </Card>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  motivationalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  periodSelector: {
    flexDirection: "row",
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
    gap: Spacing.xs,
  },
  periodButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: "center",
    borderRadius: BorderRadius.md,
  },
  chartCard: {
    paddingVertical: Spacing.xl,
  },
  cardTitle: {
    marginBottom: Spacing.lg,
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
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  categoryBar: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
  insightsCard: {
    borderLeftWidth: 4,
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

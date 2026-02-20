import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  getIdentityClaims,
  getTasks,
  getStreak,
  saveMorningBriefState,
  IdentityClaims,
  Task,
  StreakData,
  defaultStreak,
} from "@/lib/storage";
import {
  getYesterdayResult,
  getPatternCallOut,
  getDirective,
  isFirstTimeUser,
  getFormattedBriefDate,
  YesterdayResult,
  PatternCallOut,
  Directive,
} from "@/lib/morningBriefLogic";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const CATEGORY_ICONS: Record<string, string> = {
  Health: "heart",
  Business: "briefcase",
  "Self Development": "book-open",
  Family: "users",
  Financial: "dollar-sign",
  Physical: "activity",
  Mental: "book",
  Work: "monitor",
  default: "check-square",
};

function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
}

export default function MorningBriefScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [claims, setClaims] = useState<IdentityClaims | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState<StreakData>(defaultStreak);
  const [yesterdayResult, setYesterdayResult] =
    useState<YesterdayResult | null>(null);
  const [pattern, setPattern] = useState<PatternCallOut | null>(null);
  const [directive, setDirective] = useState<Directive | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [loadedClaims, loadedTasks, loadedStreak] = await Promise.all([
        getIdentityClaims(),
        getTasks(),
        getStreak(),
      ]);
      setClaims(loadedClaims);
      setTasks(loadedTasks);
      setStreak(loadedStreak);

      if (isFirstTimeUser(loadedTasks, loadedStreak)) {
        setIsFirstTime(true);
        setIsReady(true);
        return;
      }

      const result = getYesterdayResult(loadedTasks, loadedStreak);
      setYesterdayResult(result);

      const pat = getPatternCallOut(loadedClaims, loadedTasks, loadedStreak);
      setPattern(pat);

      const dir = getDirective(pat, result, loadedClaims);
      setDirective(dir);

      setIsReady(true);
    };
    loadData();
  }, []);

  const handleDismiss = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    const today = new Date().toISOString().split("T")[0];
    await saveMorningBriefState({ lastShownDate: today, dismissed: true });
    navigation.reset({ index: 0, routes: [{ name: "Main" }] });
  };

  const handleNavigateToTasks = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    handleDismiss();
  };

  if (!isReady) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      />
    );
  }

  const showYesterdayResult =
    !isFirstTime && yesterdayResult && yesterdayResult.outcome !== "no_data";
  const showPattern = !isFirstTime && pattern;
  const briefDate = getFormattedBriefDate();
  const todayTasks = tasks.slice(0, 5);
  const hasTasks = todayTasks.length > 0;

  let sectionNumber = 1;

  if (isFirstTime) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + Spacing.xl,
              paddingBottom: insets.bottom + Spacing["3xl"],
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn.duration(600)}>
            <ThemedText style={[styles.briefTitle, { color: theme.text }]}>
              MORNING BRIEF
            </ThemedText>
            <ThemedText
              style={[styles.briefDate, { color: theme.textSecondary }]}
            >
              {briefDate}
            </ThemedText>
            <View
              style={[styles.headerDivider, { backgroundColor: theme.accent }]}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <ThemedText
              style={[styles.sectionLabel, { color: theme.accent }]}
            >
              01 // IDENTITY
            </ThemedText>
            <View
              style={[
                styles.identityCard,
                {
                  borderLeftColor: theme.accent,
                  backgroundColor: theme.backgroundSecondary,
                },
              ]}
            >
              <ThemedText
                style={[styles.identityQuote, { color: theme.text }]}
              >
                "{claims?.coreIdentity || "AN OPERATOR"}"
              </ThemedText>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(500)}>
            <ThemedText
              style={[styles.sectionLabel, { color: theme.accent }]}
            >
              02 // HOW THIS WORKS
            </ThemedText>
            <View
              style={[
                styles.howItWorksCard,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: theme.border,
                },
              ]}
            >
              {[
                { icon: "check-square", text: "Set 5 critical tasks for today" },
                { icon: "target", text: "Complete all 5. No negotiation." },
                { icon: "trending-up", text: "Win the day. Build your streak." },
              ].map((item, index) => (
                <View key={index} style={styles.howItWorksRow}>
                  <View
                    style={[
                      styles.howItWorksIcon,
                      { backgroundColor: theme.accent + "20" },
                    ]}
                  >
                    <Feather
                      name={item.icon as any}
                      size={16}
                      color={theme.accent}
                    />
                  </View>
                  <ThemedText style={[styles.howItWorksText, { color: theme.text }]}>
                    {item.text}
                  </ThemedText>
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(500)}>
            <ThemedText
              style={[styles.sectionLabel, { color: theme.accent }]}
            >
              03 // DIRECTIVE
            </ThemedText>
            <ThemedText
              style={[styles.directiveText, { color: theme.accent }]}
            >
              SET YOUR FIRST POWER LIST.
            </ThemedText>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).duration(500)}
            style={styles.dismissContainer}
          >
            <Pressable
              style={[styles.dismissButton, { backgroundColor: theme.accent }]}
              onPress={handleNavigateToTasks}
            >
              <ThemedText style={styles.dismissButtonText}>
                ACKNOWLEDGED
              </ThemedText>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing["3xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(600)}>
          <ThemedText style={[styles.briefTitle, { color: theme.text }]}>
            MORNING BRIEF
          </ThemedText>
          <ThemedText
            style={[styles.briefDate, { color: theme.textSecondary }]}
          >
            {briefDate}
          </ThemedText>
          <View
            style={[styles.headerDivider, { backgroundColor: theme.accent }]}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <ThemedText style={[styles.sectionLabel, { color: theme.accent }]}>
            {String(sectionNumber++).padStart(2, "0")} // IDENTITY
          </ThemedText>
          <View
            style={[
              styles.identityCard,
              {
                borderLeftColor: theme.accent,
                backgroundColor: theme.backgroundSecondary,
              },
            ]}
          >
            <ThemedText style={[styles.identityQuote, { color: theme.text }]}>
              "{claims?.coreIdentity || "AN OPERATOR"}"
            </ThemedText>
          </View>
        </Animated.View>

        {showYesterdayResult ? (
          <Animated.View entering={FadeInDown.delay(200).duration(500)}>
            <ThemedText
              style={[styles.sectionLabel, { color: theme.accent }]}
            >
              {String(sectionNumber++).padStart(2, "0")} // YESTERDAY
            </ThemedText>
            <View
              style={[
                styles.resultCard,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor:
                    yesterdayResult!.outcome === "win"
                      ? theme.success
                      : theme.error,
                  borderWidth: 1,
                },
              ]}
            >
              <View style={styles.resultRow}>
                <View
                  style={[
                    styles.resultBadge,
                    {
                      backgroundColor:
                        yesterdayResult!.outcome === "win"
                          ? theme.success + "20"
                          : theme.error + "20",
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.resultBadgeText,
                      {
                        color:
                          yesterdayResult!.outcome === "win"
                            ? theme.success
                            : theme.error,
                      },
                    ]}
                  >
                    {yesterdayResult!.outcome === "win" ? "WIN" : "LOSS"}
                  </ThemedText>
                </View>
                <ThemedText
                  style={[styles.resultStats, { color: theme.text }]}
                >
                  {yesterdayResult!.outcome === "win"
                    ? `5/5 COMPLETED. STREAK: ${yesterdayResult!.streakCount} DAYS.`
                    : `${yesterdayResult!.streakBrokenAt ? `STREAK BROKEN AT ${yesterdayResult!.streakBrokenAt} DAYS.` : `${yesterdayResult!.totalLosses} TOTAL LOSSES.`}`}
                </ThemedText>
              </View>
            </View>
          </Animated.View>
        ) : null}

        {showPattern ? (
          <Animated.View
            entering={FadeInDown.delay(showYesterdayResult ? 300 : 200).duration(
              500
            )}
          >
            <ThemedText
              style={[styles.sectionLabel, { color: theme.accent }]}
            >
              {String(sectionNumber++).padStart(2, "0")} // PATTERN DETECTED
            </ThemedText>
            <View
              style={[
                styles.patternCard,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderLeftColor:
                    pattern!.severity === "critical"
                      ? theme.error
                      : pattern!.severity === "warning"
                        ? theme.warning
                        : theme.textSecondary,
                },
              ]}
            >
              <View style={styles.patternHeader}>
                <Feather
                  name="alert-triangle"
                  size={14}
                  color={
                    pattern!.severity === "critical"
                      ? theme.error
                      : pattern!.severity === "warning"
                        ? theme.warning
                        : theme.textSecondary
                  }
                />
                <ThemedText
                  style={[
                    styles.severityText,
                    {
                      color:
                        pattern!.severity === "critical"
                          ? theme.error
                          : pattern!.severity === "warning"
                            ? theme.warning
                            : theme.textSecondary,
                    },
                  ]}
                >
                  {pattern!.severity === "critical"
                    ? "CRITICAL"
                    : pattern!.severity === "warning"
                      ? "WARNING"
                      : "OBSERVATION"}
                </ThemedText>
              </View>
              <ThemedText
                style={[styles.patternMessage, { color: theme.text }]}
              >
                {pattern!.message}
              </ThemedText>
            </View>
          </Animated.View>
        ) : null}

        <Animated.View
          entering={FadeInDown.delay(
            showYesterdayResult && showPattern
              ? 400
              : showYesterdayResult || showPattern
                ? 300
                : 200
          ).duration(500)}
        >
          <ThemedText style={[styles.sectionLabel, { color: theme.accent }]}>
            {String(sectionNumber++).padStart(2, "0")} // TODAY'S POWER LIST
          </ThemedText>
          {hasTasks ? (
            <View
              style={[
                styles.taskListCard,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: theme.border,
                },
              ]}
            >
              {todayTasks.map((task, index) => (
                <View
                  key={task.id}
                  style={[
                    styles.taskRow,
                    index < todayTasks.length - 1
                      ? {
                          borderBottomWidth: 1,
                          borderBottomColor: theme.border,
                        }
                      : null,
                  ]}
                >
                  <ThemedText
                    style={[styles.taskNumber, { color: theme.textSecondary }]}
                  >
                    {index + 1}.
                  </ThemedText>
                  <ThemedText
                    style={[styles.taskTitle, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {task.title}
                  </ThemedText>
                  <View
                    style={[
                      styles.taskCategoryTag,
                      { backgroundColor: theme.accent + "15" },
                    ]}
                  >
                    <Feather
                      name={getCategoryIcon(task.category) as any}
                      size={10}
                      color={theme.accent}
                    />
                    <ThemedText
                      style={[styles.taskCategoryText, { color: theme.accent }]}
                    >
                      {task.category}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View
              style={[
                styles.noTasksCard,
                {
                  backgroundColor: theme.warning + "15",
                  borderColor: theme.warning + "40",
                },
              ]}
            >
              <Feather name="alert-circle" size={18} color={theme.warning} />
              <ThemedText
                style={[styles.noTasksText, { color: theme.warning }]}
              >
                NO TASKS SET. GO TO EXECUTION TAB.
              </ThemedText>
              <Pressable
                style={[
                  styles.setTasksButton,
                  { backgroundColor: theme.accent },
                ]}
                onPress={handleNavigateToTasks}
              >
                <ThemedText style={styles.setTasksButtonText}>
                  SET TASKS NOW
                </ThemedText>
              </Pressable>
            </View>
          )}
        </Animated.View>

        {directive ? (
          <Animated.View
            entering={FadeInDown.delay(
              showYesterdayResult && showPattern
                ? 500
                : showYesterdayResult || showPattern
                  ? 400
                  : 300
            ).duration(500)}
          >
            <ThemedText
              style={[styles.sectionLabel, { color: theme.accent }]}
            >
              {String(sectionNumber).padStart(2, "0")} // DIRECTIVE
            </ThemedText>
            <ThemedText
              style={[styles.directiveText, { color: theme.accent }]}
            >
              {directive.message}
            </ThemedText>
          </Animated.View>
        ) : null}

        <Animated.View
          entering={FadeInDown.delay(
            showYesterdayResult && showPattern
              ? 600
              : showYesterdayResult || showPattern
                ? 500
                : 400
          ).duration(500)}
          style={styles.dismissContainer}
        >
          <Pressable
            style={[styles.dismissButton, { backgroundColor: theme.accent }]}
            onPress={handleDismiss}
          >
            <ThemedText style={styles.dismissButtonText}>
              ACKNOWLEDGED
            </ThemedText>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  briefTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 3,
    textAlign: "center",
    textTransform: "uppercase",
  },
  briefDate: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 2,
    textAlign: "center",
    marginTop: Spacing.sm,
    textTransform: "uppercase",
  },
  headerDivider: {
    height: 1,
    marginTop: Spacing.xl,
    marginBottom: Spacing["2xl"],
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  identityCard: {
    borderLeftWidth: 3,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  identityQuote: {
    fontSize: 18,
    fontWeight: "600",
    fontStyle: "italic",
    lineHeight: 26,
  },
  resultCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  resultBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  resultBadgeText: {
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
  },
  resultStats: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    flex: 1,
  },
  patternCard: {
    borderLeftWidth: 3,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
  },
  patternHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  severityText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  patternMessage: {
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 22,
  },
  taskListCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  taskNumber: {
    fontSize: 13,
    fontWeight: "700",
    width: 22,
  },
  taskTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  taskCategoryTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.sm,
  },
  taskCategoryText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  noTasksCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.md,
  },
  noTasksText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
    textAlign: "center",
  },
  setTasksButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  setTasksButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  directiveText: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 1,
    lineHeight: 32,
    textTransform: "uppercase",
    paddingVertical: Spacing.lg,
  },
  dismissContainer: {
    marginTop: Spacing["3xl"],
    paddingHorizontal: Spacing.sm,
  },
  dismissButton: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  dismissButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  howItWorksCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  howItWorksRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  howItWorksIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  howItWorksText: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
});

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import {
  getTasks,
  getStreak,
  Task,
  saveNightReflection,
} from "@/lib/storage";
import { hudData } from "@/lib/mockData";
import {
  calculateDayResult,
  calculateStreakImpact,
  calculateLifeScorePreview,
  getMissReasonOptions,
  getReflectionPrompt,
} from "@/lib/nightReflectionLogic";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CATEGORY_COLORS: Record<string, string> = {
  Health: "#10B981",
  Business: "#3B82F6",
  "Self Development": "#8B5CF6",
  Family: "#F59E0B",
  Finance: "#06B6D4",
  Mindset: "#EC4899",
};

const MAX_REFLECTION_CHARS = 500;

export default function NightReflectionScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [missReasons, setMissReasons] = useState<Record<string, string>>({});
  const [reflectionText, setReflectionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const now = new Date();
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const monthDay = now.toLocaleDateString("en-US", { month: "long", day: "numeric" }).toUpperCase();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  useEffect(() => {
    const load = async () => {
      const [tasksData, streakData] = await Promise.all([
        getTasks(),
        getStreak(),
      ]);
      setTasks(tasksData);
      setCurrentStreak(streakData.current);
    };
    load();
  }, []);

  const result = calculateDayResult(tasks);
  const streakImpact = calculateStreakImpact(currentStreak, result.outcome);
  const lifeScorePreview = calculateLifeScorePreview(
    hudData.lifeScore.current,
    result.outcome,
    result.completionPct
  );

  const missedTasks = tasks.filter((t) => !t.completed);
  const missReasonOptions = getMissReasonOptions();
  const reflectionPrompt = getReflectionPrompt(now.getDay());

  const allMissReasonsSelected =
    missedTasks.length === 0 ||
    missedTasks.every((t) => missReasons[t.id]);

  const canSubmit = allMissReasonsSelected && !isSubmitting;

  const handleSelectReason = (taskId: string, reason: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMissReasons((prev) => ({
      ...prev,
      [taskId]: prev[taskId] === reason ? "" : reason,
    }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    const today = now.toISOString().split("T")[0];
    const missReasonsArr = Object.entries(missReasons)
      .filter(([, reason]) => reason)
      .map(([taskId, reason]) => ({ taskId, reason }));

    await saveNightReflection({
      date: today,
      outcome: result.outcome,
      completed: result.completed,
      total: result.total,
      missReasons: missReasonsArr,
      reflectionText,
      completedAt: new Date().toISOString(),
    });

    navigation.goBack();
  };

  const completedColor = "#10B981";
  const missedColor = "#EF4444";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Spacing.xl, paddingBottom: insets.bottom + Spacing["4xl"] },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Animated.View
        style={styles.headerBlock}
        entering={FadeInDown.duration(400)}
      >
        <ThemedText type="h2" style={styles.headerTitle}>
          DAILY DEBRIEF
        </ThemedText>
        <ThemedText type="bodyBold" secondary>
          {dayName}, {monthDay}
        </ThemedText>
        <View style={styles.timeRow}>
          <Feather name="clock" size={14} color={theme.textSecondary} />
          <ThemedText type="small" secondary>
            {timeStr}
          </ThemedText>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(400).delay(100)}
        style={[styles.section, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}
      >
        <ThemedText type="bodyBold" style={styles.sectionHeader}>
          TASK EXECUTION
        </ThemedText>

        {tasks.map((task) => (
          <View
            key={task.id}
            style={[styles.taskRow, { borderBottomColor: theme.border }]}
          >
            <View style={styles.taskInfo}>
              <ThemedText type="body" numberOfLines={2} style={{ flex: 1 }}>
                {task.title}
              </ThemedText>
              <View
                style={[
                  styles.statusIcon,
                  { backgroundColor: task.completed ? completedColor : missedColor },
                ]}
              >
                <Feather
                  name={task.completed ? "check" : "x"}
                  size={14}
                  color="#FFF"
                />
              </View>
            </View>
            <View
              style={[
                styles.categoryPill,
                { backgroundColor: (CATEGORY_COLORS[task.category] || theme.textSecondary) + "20" },
              ]}
            >
              <ThemedText
                type="caption"
                style={{ color: CATEGORY_COLORS[task.category] || theme.textSecondary }}
              >
                {task.category}
              </ThemedText>
            </View>
          </View>
        ))}

        <View style={styles.summaryRow}>
          <ThemedText type="bodyBold">
            {result.completed} OF {result.total} COMPLETED
          </ThemedText>
        </View>
        <View style={styles.progressBarOuter}>
          <View
            style={[
              styles.progressBarInner,
              {
                width: `${result.completionPct}%`,
                backgroundColor:
                  result.completionPct === 100
                    ? completedColor
                    : result.completionPct >= 80
                      ? "#F59E0B"
                      : missedColor,
              },
            ]}
          />
        </View>
      </Animated.View>

      {missedTasks.length > 0 ? (
        <Animated.View
          entering={FadeInDown.duration(400).delay(200)}
          style={[styles.section, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}
        >
          <ThemedText type="bodyBold" style={styles.sectionHeader}>
            WHAT CAUSED THE MISS?
          </ThemedText>

          {missedTasks.map((task) => (
            <View key={task.id} style={styles.missBlock}>
              <ThemedText type="small" style={{ marginBottom: Spacing.sm }}>
                {task.title}
              </ThemedText>
              <View style={styles.chipRow}>
                {missReasonOptions.map((reason) => {
                  const selected = missReasons[task.id] === reason;
                  return (
                    <Pressable
                      key={reason}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: selected
                            ? theme.accent
                            : theme.backgroundTertiary,
                          borderColor: selected ? theme.accent : theme.border,
                        },
                      ]}
                      onPress={() => handleSelectReason(task.id, reason)}
                    >
                      <ThemedText
                        type="caption"
                        style={{
                          color: selected ? "#FFF" : theme.text,
                          fontWeight: selected ? "600" : "400",
                        }}
                      >
                        {reason}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </Animated.View>
      ) : null}

      <Animated.View
        entering={FadeInDown.duration(400).delay(missedTasks.length > 0 ? 300 : 200)}
        style={[styles.section, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}
      >
        <ThemedText type="bodyBold" style={styles.sectionHeader}>
          OPERATOR REFLECTION
        </ThemedText>
        <ThemedText type="small" secondary style={{ marginBottom: Spacing.md }}>
          {reflectionPrompt}
        </ThemedText>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: theme.backgroundRoot,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder="Optional reflection..."
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={4}
          maxLength={MAX_REFLECTION_CHARS}
          value={reflectionText}
          onChangeText={setReflectionText}
          textAlignVertical="top"
        />
        <ThemedText
          type="caption"
          secondary
          style={styles.charCounter}
        >
          {reflectionText.length}/{MAX_REFLECTION_CHARS}
        </ThemedText>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(400).delay(missedTasks.length > 0 ? 400 : 300)}
        style={[styles.resultSection]}
      >
        <View style={[styles.resultCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
          <View
            style={[
              styles.resultIconCircle,
              { backgroundColor: result.outcome === "win" ? completedColor + "20" : missedColor + "20" },
            ]}
          >
            <Feather
              name={result.outcome === "win" ? "shield" : "shield-off"}
              size={40}
              color={result.outcome === "win" ? completedColor : missedColor}
            />
          </View>
          <ThemedText
            type="h1"
            style={{
              color: result.outcome === "win" ? completedColor : missedColor,
              letterSpacing: 4,
              marginTop: Spacing.md,
            }}
          >
            {result.outcome === "win" ? "WIN" : "LOSS"}
          </ThemedText>

          <View style={styles.impactRow}>
            <Feather
              name="trending-up"
              size={16}
              color={streakImpact.direction === "up" ? completedColor : missedColor}
            />
            <ThemedText
              type="bodyBold"
              style={{
                color: streakImpact.direction === "up" ? completedColor : missedColor,
                fontFamily: Platform.select({ ios: "ui-monospace", default: "monospace" }),
              }}
            >
              {streakImpact.direction === "up"
                ? `STREAK: ${streakImpact.before} \u2192 ${streakImpact.after}`
                : `STREAK BROKEN: ${streakImpact.before} \u2192 ${streakImpact.after}`}
            </ThemedText>
          </View>

          <View style={styles.impactRow}>
            <Feather
              name="activity"
              size={16}
              color={lifeScorePreview.delta >= 0 ? completedColor : missedColor}
            />
            <ThemedText
              type="bodyBold"
              style={{
                color: lifeScorePreview.delta >= 0 ? completedColor : missedColor,
                fontFamily: Platform.select({ ios: "ui-monospace", default: "monospace" }),
              }}
            >
              LIFE SCORE IMPACT: {lifeScorePreview.delta >= 0 ? "+" : ""}{lifeScorePreview.delta} projected
            </ThemedText>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(400).delay(missedTasks.length > 0 ? 500 : 400)}
      >
        <Pressable
          style={[
            styles.submitButton,
            {
              backgroundColor: canSubmit ? theme.accent : theme.backgroundTertiary,
              opacity: canSubmit ? 1 : 0.6,
            },
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <Feather name="lock" size={20} color="#FFF" />
          <ThemedText type="bodyBold" style={{ color: "#FFF", letterSpacing: 2 }}>
            LOCK IN RESULTS
          </ThemedText>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  headerBlock: {
    alignItems: "center",
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  headerTitle: {
    letterSpacing: 3,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  section: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
  },
  sectionHeader: {
    letterSpacing: 2,
    marginBottom: Spacing.lg,
  },
  taskRow: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.xs,
  },
  taskInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  statusIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryPill: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
  },
  summaryRow: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  progressBarOuter: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(128,128,128,0.2)",
    overflow: "hidden",
  },
  progressBarInner: {
    height: 8,
    borderRadius: 4,
  },
  missBlock: {
    marginBottom: Spacing.lg,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    minHeight: 100,
    fontSize: 16,
  },
  charCounter: {
    textAlign: "right",
    marginTop: Spacing.xs,
  },
  resultSection: {
    marginBottom: Spacing.lg,
  },
  resultCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    gap: Spacing.md,
  },
  resultIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  impactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    height: 56,
    borderRadius: BorderRadius.xl,
  },
});

import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, Pressable, AppState, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  OperatorModeSession,
  getOperatorModeSession,
  saveOperatorModeSession,
  getTasks,
  saveTasks,
  Task,
  addOperatorModeHistoryEntry,
  generateId,
} from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const CATEGORY_COLORS: Record<string, string> = {
  health: "#10B981",
  business: "#3B82F6",
  "self development": "#8B5CF6",
  family: "#F97316",
  relationships: "#EC4899",
  spiritual: "#06B6D4",
  other: "#6B7280",
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MOTIVATIONAL_QUOTES = [
  "Stay focused. Execute. The standard owns you now.",
  "No negotiation. No excuses. Execute.",
  "You designed this when you were strong. Now execute.",
  "The pain of discipline is less than the pain of regret.",
  "Operators don't quit. They finish the mission.",
];

export default function OperatorModeActiveScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [session, setSession] = useState<OperatorModeSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [quote] = useState(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pulseOpacity = useSharedValue(0.5);

  useEffect(() => {
    loadSession();
    loadTasks();
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        loadSession();
        loadTasks();
      }
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (session) {
      const startTime = new Date(session.startTime).getTime();
      const endTime = startTime + session.durationMinutes * 60 * 1000;
      
      const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        setTimeRemaining(remaining);
        
        if (remaining <= 0 && session.durationMinutes > 0) {
          handleMissionComplete(false);
        }
      };

      updateTimer();
      intervalRef.current = setInterval(updateTimer, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [session]);

  const loadSession = async () => {
    const sess = await getOperatorModeSession();
    if (!sess || !sess.isActive) {
      navigation.replace("Main");
      return;
    }
    setSession(sess);
  };

  const loadTasks = async () => {
    const t = await getTasks();
    setTasks(t);
  };

  const handleToggleTask = async (taskId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const getCategoryColor = (category: string) => {
    return CATEGORY_COLORS[category.toLowerCase()] || CATEGORY_COLORS.other;
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    if (!session || session.durationMinutes === 0) return 0;
    const startTime = new Date(session.startTime).getTime();
    const totalDuration = session.durationMinutes * 60 * 1000;
    const elapsed = Date.now() - startTime;
    return Math.min(100, (elapsed / totalDuration) * 100);
  };

  const handleMissionComplete = useCallback(async (exitedEarly: boolean) => {
    if (!session) return;
    Haptics.notificationAsync(
      exitedEarly
        ? Haptics.NotificationFeedbackType.Warning
        : Haptics.NotificationFeedbackType.Success
    );

    const startTime = new Date(session.startTime).getTime();
    const actualDuration = Math.floor((Date.now() - startTime) / 60000);
    const currentTasks = await getTasks();
    const completedNow = currentTasks.filter((t) => t.completed).length;

    await addOperatorModeHistoryEntry({
      id: generateId(),
      protocolName: session.protocolName,
      date: new Date().toISOString(),
      durationMinutes: session.durationMinutes,
      actualDurationMinutes: actualDuration,
      tasksCompleted: completedNow,
      totalTasks: currentTasks.length,
      completedSuccessfully: !exitedEarly,
      exitedEarly,
    });

    await saveOperatorModeSession(null);

    navigation.replace("OperatorModeComplete", {
      exitedEarly,
      duration: actualDuration,
      tasksCompleted: completedNow,
      totalTasks: currentTasks.length,
      protocolName: session.protocolName,
    });
  }, [session, navigation]);

  const handleExitEarly = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setShowExitConfirm(true);
  };

  const handleConfirmExit = () => {
    handleMissionComplete(true);
  };

  const handleStay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowExitConfirm(false);
  };

  const completedTasks = tasks.filter((t) => t.completed).length;
  const progress = getProgress();

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  if (!session) {
    return (
      <View style={[styles.container, { backgroundColor: "#0A0A0A" }]}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: "#0A0A0A" }]}>
      <View style={[styles.content, { paddingTop: insets.top + Spacing.xl }]}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
          <View style={styles.modeIndicator}>
            <Feather name="shield" size={20} color="#DC2626" />
            <ThemedText type="bodyBold" style={styles.modeText}>
              OPERATOR MODE
            </ThemedText>
            <Feather name="shield" size={20} color="#DC2626" />
          </View>
          <ThemedText type="h2" style={styles.activeText}>
            ACTIVE
          </ThemedText>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400).delay(100)}
          style={styles.timerContainer}
        >
          <Animated.View style={[styles.timerGlow, pulseStyle]} />
          <View style={styles.timerInner}>
            <ThemedText type="stat" style={styles.timerText}>
              {session.durationMinutes > 0 ? formatTime(timeRemaining) : "--:--"}
            </ThemedText>
            {session.durationMinutes > 0 && (
              <ThemedText type="caption" style={styles.timerLabel}>
                remaining
              </ThemedText>
            )}
          </View>
        </Animated.View>

        {session.durationMinutes > 0 && (
          <Animated.View
            entering={FadeInDown.duration(400).delay(200)}
            style={styles.progressContainer}
          >
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <ThemedText type="caption" style={styles.progressText}>
              Progress: {Math.round(progress)}% complete
            </ThemedText>
          </Animated.View>
        )}

        <Animated.View
          entering={FadeInDown.duration(400).delay(300)}
          style={styles.divider}
        />

        <Animated.View
          entering={FadeInDown.duration(400).delay(400)}
          style={styles.tasksSection}
        >
          <ThemedText type="body" style={styles.tasksHeader}>
            Power List: {completedTasks}/{tasks.length} complete
          </ThemedText>
          <ScrollView 
            style={styles.tasksList} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.tasksListContent}
          >
            {tasks.map((task) => (
              <Pressable
                key={task.id}
                style={styles.taskCard}
                onPress={() => handleToggleTask(task.id)}
              >
                <View
                  style={[
                    styles.taskCheckbox,
                    task.completed && styles.taskCheckboxCompleted,
                  ]}
                >
                  {task.completed && (
                    <Feather name="check" size={14} color="#FFFFFF" />
                  )}
                </View>
                <View style={styles.taskContent}>
                  <ThemedText
                    type="body"
                    style={[
                      styles.taskText,
                      task.completed && styles.taskTextCompleted,
                    ]}
                  >
                    {task.title}
                  </ThemedText>
                  <View style={styles.categoryBadge}>
                    <View
                      style={[
                        styles.categoryDot,
                        { backgroundColor: getCategoryColor(task.category) },
                      ]}
                    />
                    <ThemedText
                      type="caption"
                      style={[
                        styles.categoryText,
                        { color: getCategoryColor(task.category) },
                      ]}
                    >
                      {task.category.toUpperCase()}
                    </ThemedText>
                  </View>
                </View>
                <Feather name="chevron-right" size={18} color="#6B7280" />
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400).delay(500)}
          style={styles.divider}
        />

        <Animated.View
          entering={FadeInDown.duration(400).delay(600)}
          style={styles.quoteContainer}
        >
          <ThemedText type="small" style={styles.quoteText}>
            "{quote}"
          </ThemedText>
        </Animated.View>
      </View>

      <Pressable
        onPress={handleExitEarly}
        style={[styles.exitButton, { bottom: insets.bottom + Spacing.xl }]}
      >
        <ThemedText type="caption" style={styles.exitButtonText}>
          EXIT EARLY
        </ThemedText>
      </Pressable>

      {showExitConfirm && (
        <View style={styles.overlay}>
          <Animated.View
            entering={FadeIn.duration(200)}
            style={[styles.confirmModal, { backgroundColor: "#1A1A1A" }]}
          >
            <Feather name="alert-triangle" size={40} color="#F59E0B" />
            <ThemedText type="h3" style={styles.confirmTitle}>
              EXIT OPERATOR MODE?
            </ThemedText>
            <View style={styles.confirmStats}>
              <ThemedText type="body" style={styles.confirmStatText}>
                Time remaining: {formatTime(timeRemaining)}
              </ThemedText>
              <ThemedText type="body" style={styles.confirmStatText}>
                Power List: {completedTasks}/{tasks.length} complete
              </ThemedText>
            </View>
            <View style={styles.consequencesBox}>
              <ThemedText type="caption" style={styles.consequencesTitle}>
                EXITING EARLY WILL:
              </ThemedText>
              <ThemedText type="small" style={styles.consequenceItem}>
                • Notify your Crew
              </ThemedText>
              <ThemedText type="small" style={styles.consequenceItem}>
                • Burn 1 Strike
              </ThemedText>
              <ThemedText type="small" style={styles.consequenceItem}>
                • Start 2-hour cooldown
              </ThemedText>
            </View>
            <View style={styles.confirmQuote}>
              <ThemedText type="caption" style={styles.confirmQuoteText}>
                "You set these rules yourself.{"\n"}
                The pain of discipline is less than the pain of regret."
              </ThemedText>
            </View>
            <View style={styles.confirmButtons}>
              <Pressable
                onPress={handleStay}
                style={[styles.stayButton, { backgroundColor: "#10B981" }]}
              >
                <ThemedText type="bodyBold" style={{ color: "#FFFFFF" }}>
                  STAY
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={handleConfirmExit}
                style={[styles.exitConfirmButton, { backgroundColor: "#DC2626" }]}
              >
                <ThemedText type="bodyBold" style={{ color: "#FFFFFF" }}>
                  EXIT ANYWAY
                </ThemedText>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  modeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  modeText: {
    color: "#DC2626",
    letterSpacing: 2,
  },
  activeText: {
    color: "#FFFFFF",
    letterSpacing: 4,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
    position: "relative",
  },
  timerGlow: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#DC2626",
  },
  timerInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A0A0A",
  },
  timerText: {
    color: "#FFFFFF",
    fontSize: 36,
  },
  timerLabel: {
    color: "#9CA3AF",
    marginTop: Spacing.xs,
  },
  progressContainer: {
    marginBottom: Spacing["2xl"],
  },
  progressBar: {
    height: 8,
    backgroundColor: "#374151",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#DC2626",
    borderRadius: 4,
  },
  progressText: {
    color: "#9CA3AF",
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#374151",
    marginVertical: Spacing.xl,
  },
  tasksSection: {
    flex: 1,
    marginBottom: Spacing.lg,
  },
  tasksHeader: {
    color: "#FFFFFF",
    marginBottom: Spacing.md,
  },
  tasksList: {
    flex: 1,
  },
  tasksListContent: {
    gap: Spacing.sm,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#6B7280",
    alignItems: "center",
    justifyContent: "center",
  },
  taskCheckboxCompleted: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  taskContent: {
    flex: 1,
    gap: 2,
  },
  taskText: {
    color: "#FFFFFF",
  },
  taskTextCompleted: {
    color: "#6B7280",
    textDecorationLine: "line-through",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  quoteContainer: {
    paddingVertical: Spacing.lg,
  },
  quoteText: {
    color: "#9CA3AF",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 22,
  },
  exitButton: {
    position: "absolute",
    alignSelf: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  exitButtonText: {
    color: "#6B7280",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  confirmModal: {
    width: "100%",
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.xl,
    alignItems: "center",
  },
  confirmTitle: {
    color: "#FFFFFF",
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  confirmStats: {
    marginBottom: Spacing.xl,
  },
  confirmStatText: {
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  consequencesBox: {
    width: "100%",
    padding: Spacing.lg,
    backgroundColor: "#262626",
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  consequencesTitle: {
    color: "#F59E0B",
    marginBottom: Spacing.sm,
    letterSpacing: 1,
  },
  consequenceItem: {
    color: "#9CA3AF",
    marginBottom: Spacing.xs,
  },
  confirmQuote: {
    marginBottom: Spacing.xl,
  },
  confirmQuoteText: {
    color: "#6B7280",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 20,
  },
  confirmButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    width: "100%",
  },
  stayButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  exitConfirmButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
});

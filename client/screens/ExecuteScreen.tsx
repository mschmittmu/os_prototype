import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { TaskCard } from "@/components/TaskCard";
import { FAB } from "@/components/FAB";
import { DayWonCelebration } from "@/components/DayWonCelebration";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import {
  getTasks,
  saveTasks,
  getStreak,
  checkAndUpdateStreak,
  addXP,
  Task,
  StreakData,
} from "@/lib/storage";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function ExecuteScreen() {
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState<StreakData>({ current: 0, best: 0, totalDaysWon: 0, totalDaysLost: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const loadData = useCallback(async () => {
    const [tasksData, streakData] = await Promise.all([
      getTasks(),
      getStreak(),
    ]);
    setTasks(tasksData);
    setStreak(streakData);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleToggleTask = async (id: string) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);

    const task = tasks.find((t) => t.id === id);
    if (task && !task.completed) {
      const xp = 50;
      await addXP(xp);
      setXpEarned((prev) => prev + xp);
    }

    const allComplete = updatedTasks.every((t) => t.completed);
    if (allComplete && updatedTasks.length >= 5) {
      const newStreak = await checkAndUpdateStreak(true);
      setStreak(newStreak);
      setShowCelebration(true);
    }
  };

  const handleEditTask = (id: string) => {
    navigation.navigate("TaskCreate", { taskId: id });
  };

  const handleDismissCelebration = () => {
    setShowCelebration(false);
    setXpEarned(0);
  };

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = Math.max(tasks.length, 1);
  const progress = (completedTasks / totalTasks) * 100;

  const getWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay();
    return DAYS.map((day, index) => ({
      label: day,
      status: index < currentDay ? "won" : index === currentDay ? "current" : "future",
    }));
  };

  const weekDays = getWeekDays();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: headerHeight + Spacing.xl, paddingBottom: tabBarHeight + Spacing["4xl"] },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.dark.accent}
          />
        }
      >
        <View style={styles.weekStrip}>
          {weekDays.map((day, index) => (
            <View
              key={index}
              style={[
                styles.dayCircle,
                day.status === "won" && styles.dayWon,
                day.status === "current" && styles.dayCurrent,
              ]}
            >
              <ThemedText
                type="caption"
                style={[
                  styles.dayLabel,
                  day.status === "won" && styles.dayLabelWon,
                ]}
              >
                {day.label}
              </ThemedText>
            </View>
          ))}
          <Pressable
            style={styles.statsButton}
            onPress={() => navigation.navigate("Stats")}
          >
            <Feather name="bar-chart-2" size={20} color={Colors.dark.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <ThemedText type="h4">POWER LIST</ThemedText>
            <ThemedText type="bodyBold" style={styles.progressText}>
              {completedTasks}/{tasks.length} COMPLETE
            </ThemedText>
          </View>
          <View style={styles.progressBar}>
            <Animated.View
              style={[styles.progressFill, { width: `${progress}%` }]}
              entering={FadeIn}
            />
          </View>
        </View>

        <View style={styles.taskList}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              category={task.category}
              completed={task.completed}
              onToggle={handleToggleTask}
              onEdit={handleEditTask}
            />
          ))}
        </View>

        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="check-square" size={48} color={Colors.dark.textSecondary} />
            <ThemedText type="body" secondary style={styles.emptyText}>
              No tasks yet. Add your first task to start winning.
            </ThemedText>
          </View>
        ) : null}
      </ScrollView>

      <FAB
        icon="plus"
        onPress={() => navigation.navigate("TaskCreate")}
        style={{ bottom: tabBarHeight + Spacing.xl, right: Spacing.lg }}
      />

      {showCelebration ? (
        <DayWonCelebration
          streak={streak.current}
          xpEarned={xpEarned > 0 ? xpEarned : 250}
          onDismiss={handleDismissCelebration}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  weekStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.sm,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.dark.backgroundDefault,
    justifyContent: "center",
    alignItems: "center",
  },
  dayWon: {
    backgroundColor: Colors.dark.success,
  },
  dayCurrent: {
    backgroundColor: Colors.dark.accent,
  },
  dayLabel: {
    color: Colors.dark.textSecondary,
    fontWeight: "600",
  },
  dayLabelWon: {
    color: Colors.dark.backgroundRoot,
  },
  statsButton: {
    padding: Spacing.sm,
  },
  progressContainer: {
    marginBottom: Spacing.xl,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  progressText: {
    color: Colors.dark.accent,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.dark.accent,
    borderRadius: BorderRadius.full,
  },
  taskList: {
    gap: Spacing.sm,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing["4xl"],
    gap: Spacing.lg,
  },
  emptyText: {
    textAlign: "center",
  },
});

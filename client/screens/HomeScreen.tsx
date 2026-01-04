import React, { useEffect, useState, useCallback } from "react";
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
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { ProgressRing } from "@/components/ProgressRing";
import { StreakBadge } from "@/components/StreakBadge";
import { EpisodeCard } from "@/components/EpisodeCard";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import {
  getTasks,
  getStreak,
  getUser,
  Task,
  StreakData,
  UserData,
} from "@/lib/storage";
import { episodes, challenges } from "@/lib/mockData";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState<StreakData>({ current: 0, best: 0, totalDaysWon: 0, totalDaysLost: 0 });
  const [user, setUser] = useState<UserData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [tasksData, streakData, userData] = await Promise.all([
      getTasks(),
      getStreak(),
      getUser(),
    ]);
    setTasks(tasksData);
    setStreak(streakData);
    setUser(userData);
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

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = Math.max(tasks.length, 5);
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;
  const allComplete = completedTasks === totalTasks && totalTasks > 0;

  const getTimeRemaining = () => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const diff = endOfDay.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const continueWatching = episodes.filter((e) => e.progress > 0);
  const activeChallenge = challenges.find((c) => c.active);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: headerHeight + Spacing.xl, paddingBottom: tabBarHeight + Spacing.xl },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.dark.accent}
        />
      }
    >
      <View style={styles.header}>
        <View>
          <ThemedText type="body" secondary>
            {getGreeting()},
          </ThemedText>
          <ThemedText type="h2">{user?.name || "Operator"}</ThemedText>
        </View>
        <StreakBadge streak={streak.current} size="medium" />
      </View>

      <Card
        elevation={1}
        style={styles.powerListCard}
        onPress={() => navigation.getParent()?.navigate("ExecuteTab")}
      >
        <View style={styles.powerListHeader}>
          <ThemedText type="h3">TODAY'S POWER LIST</ThemedText>
          {!allComplete ? (
            <View style={styles.urgency}>
              <Feather name="clock" size={14} color={Colors.dark.warning} />
              <ThemedText type="caption" style={styles.urgencyText}>
                {getTimeRemaining()} left
              </ThemedText>
            </View>
          ) : null}
        </View>
        <View style={styles.powerListContent}>
          <ProgressRing
            progress={progress}
            size={100}
            strokeWidth={8}
            showLabel={false}
          />
          <View style={styles.powerListStats}>
            {allComplete ? (
              <>
                <ThemedText type="h2" style={styles.dayWonText}>
                  DAY WON
                </ThemedText>
                <ThemedText type="small" secondary>
                  All tasks complete
                </ThemedText>
              </>
            ) : (
              <>
                <ThemedText type="stat">{completedTasks}/{totalTasks}</ThemedText>
                <ThemedText type="small" secondary>
                  tasks complete
                </ThemedText>
              </>
            )}
          </View>
        </View>
      </Card>

      {activeChallenge ? (
        <Card elevation={1} style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <ThemedText type="h4">{activeChallenge.name}</ThemedText>
            <View style={[styles.difficultyBadge, { backgroundColor: Colors.dark.accent }]}>
              <ThemedText type="caption" style={styles.difficultyText}>
                {activeChallenge.difficulty}
              </ThemedText>
            </View>
          </View>
          <View style={styles.challengeProgress}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${activeChallenge.progress}%` },
                ]}
              />
            </View>
            <ThemedText type="small" secondary>
              Day {Math.round(activeChallenge.progress * 0.75)} of 75
            </ThemedText>
          </View>
        </Card>
      ) : null}

      <View style={styles.xpRow}>
        <View style={styles.xpCard}>
          <ThemedText type="statSmall" style={styles.xpValue}>
            {user?.xp || 0}
          </ThemedText>
          <ThemedText type="caption" secondary>
            Total XP
          </ThemedText>
        </View>
        <View style={styles.xpCard}>
          <ThemedText type="statSmall" style={styles.xpValue}>
            {streak.totalDaysWon}
          </ThemedText>
          <ThemedText type="caption" secondary>
            Days Won
          </ThemedText>
        </View>
        <View style={styles.xpCard}>
          <ThemedText type="statSmall" style={styles.xpValue}>
            #{Math.floor(Math.random() * 100) + 1}
          </ThemedText>
          <ThemedText type="caption" secondary>
            Rank
          </ThemedText>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Pressable
          style={styles.quickAction}
          onPress={() => navigation.navigate("TaskCreate")}
        >
          <Feather name="plus-circle" size={24} color={Colors.dark.accent} />
          <ThemedText type="small">Create Task</ThemedText>
        </Pressable>
        <Pressable
          style={styles.quickAction}
          onPress={() => navigation.navigate("CoreValues")}
        >
          <Feather name="target" size={24} color={Colors.dark.accent} />
          <ThemedText type="small">Core Values</ThemedText>
        </Pressable>
        <Pressable
          style={styles.quickAction}
          onPress={() => navigation.navigate("Stats")}
        >
          <Feather name="bar-chart-2" size={24} color={Colors.dark.accent} />
          <ThemedText type="small">Stats</ThemedText>
        </Pressable>
      </View>

      {continueWatching.length > 0 ? (
        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            CONTINUE WATCHING
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.episodesContainer}
          >
            {continueWatching.map((episode) => (
              <EpisodeCard
                key={episode.id}
                id={episode.id}
                title={episode.title}
                description={episode.description}
                duration={episode.duration}
                progress={episode.progress}
                horizontal
                onPress={() => {}}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  powerListCard: {
    marginBottom: Spacing.lg,
  },
  powerListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  urgency: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  urgencyText: {
    color: Colors.dark.warning,
  },
  powerListContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xl,
  },
  powerListStats: {
    flex: 1,
  },
  dayWonText: {
    color: Colors.dark.success,
  },
  challengeCard: {
    marginBottom: Spacing.lg,
  },
  challengeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  difficultyText: {
    color: Colors.dark.text,
    fontWeight: "600",
  },
  challengeProgress: {
    gap: Spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.dark.accent,
    borderRadius: BorderRadius.full,
  },
  xpRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  xpCard: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundDefault,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  xpValue: {
    color: Colors.dark.accent,
    marginBottom: Spacing.xs,
  },
  quickActions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  quickAction: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundDefault,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    gap: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  episodesContainer: {
    paddingRight: Spacing.lg,
  },
});

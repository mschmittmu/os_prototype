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
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";

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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function QuickActionButton({
  icon,
  label,
  onPress,
  delay = 0,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  delay?: number;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      style={[styles.quickAction, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <View style={styles.quickActionIcon}>
        <Feather name={icon} size={20} color={Colors.light.accent} />
      </View>
      <ThemedText type="small">{label}</ThemedText>
    </AnimatedPressable>
  );
}

function StatCard({
  value,
  label,
  accent = false,
}: {
  value: string | number;
  label: string;
  accent?: boolean;
}) {
  return (
    <View style={styles.statCard}>
      <ThemedText
        type="statSmall"
        style={[styles.statValue, accent && { color: Colors.light.accent }]}
      >
        {value}
      </ThemedText>
      <ThemedText type="caption" secondary>
        {label}
      </ThemedText>
    </View>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState<StreakData>({
    current: 0,
    best: 0,
    totalDaysWon: 0,
    totalDaysLost: 0,
  });
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = Math.max(tasks.length, 5);
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;
  const allComplete = completedTasks === totalTasks && totalTasks > 0;

  const continueWatching = episodes.filter((e) => e.progress > 0);
  const activeChallenge = challenges.find((c) => c.active);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
        },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.light.accent}
        />
      }
    >
      <Animated.View entering={FadeInDown.duration(400).delay(0)}>
        <Card
          elevation={1}
          style={styles.todayCard}
          onPress={() => navigation.getParent()?.navigate("ExecuteTab")}
        >
          <View style={styles.todayHeader}>
            <ThemedText type="h2">TODAY'S TASKS</ThemedText>
            <View style={styles.viewButton}>
              <ThemedText type="small">View Task List</ThemedText>
            </View>
          </View>
          {allComplete ? (
            <View style={styles.dayWonContainer}>
              <ThemedText type="h3" style={styles.dayWonText}>
                YOU'VE WON THE DAY AND
              </ThemedText>
              <ThemedText type="h3" style={styles.dayWonText}>
                COMPLETED ALL YOUR TASKS.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.powerListContent}>
              <ProgressRing
                progress={progress}
                size={80}
                strokeWidth={6}
                showLabel={false}
              />
              <View style={styles.powerListStats}>
                <ThemedText type="stat">
                  {completedTasks}/{totalTasks}
                </ThemedText>
                <ThemedText type="small" secondary>
                  tasks complete
                </ThemedText>
              </View>
            </View>
          )}
        </Card>
      </Animated.View>

      {activeChallenge ? (
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h2">CURRENT CHALLENGES</ThemedText>
            <Pressable
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <View style={styles.viewLink}>
                <ThemedText type="small" secondary>
                  View Challenges
                </ThemedText>
                <Feather
                  name="arrow-right"
                  size={14}
                  color={Colors.light.textSecondary}
                />
              </View>
            </Pressable>
          </View>
          <Card elevation={1} style={styles.challengeCard}>
            <View style={styles.challengeRow}>
              <View style={styles.challengeInfo}>
                <ThemedText type="h4">{activeChallenge.name}</ThemedText>
                <ThemedText type="small" secondary>
                  {Math.round(activeChallenge.progress * 0.03)}/3 days completed
                </ThemedText>
              </View>
              <View style={styles.checkCircle}>
                <Feather name="check" size={18} color={Colors.light.text} />
              </View>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${activeChallenge.progress}%` },
                ]}
              />
            </View>
          </Card>
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeInDown.duration(400).delay(200)}>
        <View style={styles.sectionHeader}>
          <ThemedText type="h2">XP PROGRESS</ThemedText>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate("Stats");
            }}
          >
            <View style={styles.viewLink}>
              <ThemedText type="small" secondary>
                View Leaderboards
              </ThemedText>
              <Feather
                name="arrow-right"
                size={14}
                color={Colors.light.textSecondary}
              />
            </View>
          </Pressable>
        </View>
        <View style={styles.statsRow}>
          <Card elevation={1} style={styles.statCardWrapper}>
            <ThemedText type="h3" style={styles.statValueLarge}>
              +{user?.xp || 7560} XP
            </ThemedText>
            <ThemedText type="small" secondary>
              This Month
            </ThemedText>
          </Card>
          <Card elevation={1} style={styles.statCardWrapper}>
            <ThemedText type="h3" style={styles.statValueLarge}>
              #{Math.floor(Math.random() * 5) + 1}
            </ThemedText>
            <ThemedText type="small" secondary>
              Position In Iron Tier
            </ThemedText>
          </Card>
        </View>
      </Animated.View>

      {continueWatching.length > 0 ? (
        <Animated.View entering={FadeInDown.duration(400).delay(300)}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h2">CONTINUE WATCHING</ThemedText>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.getParent()?.navigate("MediaTab");
              }}
            >
              <View style={styles.viewLink}>
                <ThemedText type="small" secondary>
                  View All Episodes
                </ThemedText>
                <Feather
                  name="arrow-right"
                  size={14}
                  color={Colors.light.textSecondary}
                />
              </View>
            </Pressable>
          </View>
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
        </Animated.View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundRoot,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  todayCard: {
    marginBottom: Spacing.xl,
  },
  todayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  viewButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  dayWonContainer: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  dayWonText: {
    color: Colors.light.textSecondary,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  powerListContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xl,
  },
  powerListStats: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  viewLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  challengeCard: {
    marginBottom: Spacing.lg,
  },
  challengeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  challengeInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.light.backgroundTertiary,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.light.accent,
    borderRadius: BorderRadius.full,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCardWrapper: {
    flex: 1,
    alignItems: "flex-start",
  },
  statValueLarge: {
    marginBottom: Spacing.xs,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.backgroundDefault,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statValue: {
    marginBottom: Spacing.xs,
  },
  quickActions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  quickAction: {
    flex: 1,
    backgroundColor: Colors.light.backgroundDefault,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  episodesContainer: {
    paddingRight: Spacing.lg,
    gap: Spacing.md,
  },
});

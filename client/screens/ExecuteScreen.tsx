import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  TextInput,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TaskCard } from "@/components/TaskCard";
import { FAB } from "@/components/FAB";
import { DayWonCelebration } from "@/components/DayWonCelebration";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
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
import {
  executionChallenges,
  journalEntries,
  ExecutionChallenge,
  JournalEntry,
} from "@/lib/mockData";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type TabType = "Tasks" | "Challenges" | "Journal";

const CATEGORY_ICONS: Record<string, string> = {
  "Family & Relationships": "users",
  "Health & Fitness": "heart",
  "Self Development": "book",
  "Business & Career": "briefcase",
  default: "check-square",
};

export default function ExecuteScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  
  const [activeTab, setActiveTab] = useState<TabType>("Tasks");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState<StreakData>({
    current: 0,
    best: 0,
    totalDaysWon: 0,
    totalDaysLost: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [journalText, setJournalText] = useState("");

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleToggleTask = async (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newStreak = await checkAndUpdateStreak(true);
      setStreak(newStreak);
      setShowCelebration(true);
    }
  };

  const handleEditTask = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("TaskCreate", { taskId: id });
  };

  const handleDismissCelebration = () => {
    setShowCelebration(false);
    setXpEarned(0);
  };

  const handleTabChange = (tab: TabType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  const getWeekDays = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) - 1);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      days.push({
        date,
        dayNum: date.getDate(),
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
        isToday,
        isSelected,
      });
    }
    return days;
  };

  const weekDays = getWeekDays();
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const currentChallenges = executionChallenges.filter((c) => c.status === "current");
  const pastChallenges = executionChallenges.filter((c) => c.status === "past");

  const formatDateHeader = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).toUpperCase();
  };

  const getMonthYear = () => {
    return selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getJournalForDate = (date: Date): JournalEntry | undefined => {
    const dateStr = date.toISOString().split("T")[0];
    return journalEntries.find((j) => j.date === dateStr);
  };

  const currentJournal = getJournalForDate(selectedDate);

  const renderTabBar = () => (
    <View style={[styles.tabBar, { backgroundColor: theme.backgroundSecondary }]}>
      {(["Tasks", "Challenges", "Journal"] as TabType[]).map((tab) => (
        <Pressable
          key={tab}
          style={[
            styles.tab,
            activeTab === tab && { backgroundColor: theme.text },
          ]}
          onPress={() => handleTabChange(tab)}
        >
          <ThemedText
            type="bodyBold"
            style={[
              styles.tabText,
              { color: activeTab === tab ? theme.backgroundRoot : theme.textSecondary },
            ]}
          >
            {tab}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );

  const renderDateStrip = () => (
    <View style={styles.dateStripContainer}>
      <Pressable style={[styles.monthSelector, { borderColor: theme.border }]}>
        <ThemedText type="body">{getMonthYear()}</ThemedText>
        <Feather name="chevron-down" size={16} color={theme.textSecondary} />
      </Pressable>
      {activeTab === "Tasks" && (
        <Pressable
          style={[styles.statsButton, { borderColor: theme.border }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate("Stats");
          }}
        >
          <Feather name="bar-chart-2" size={16} color={theme.textSecondary} />
          <ThemedText type="caption" style={{ marginLeft: Spacing.xs }}>
            Stats
          </ThemedText>
        </Pressable>
      )}
    </View>
  );

  const renderWeekStrip = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.weekStrip}
      contentContainerStyle={styles.weekStripContent}
    >
      {weekDays.map((day, index) => (
        <Pressable
          key={index}
          style={[
            styles.dayColumn,
            day.isSelected && { backgroundColor: theme.text, borderRadius: BorderRadius.lg },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSelectedDate(day.date);
          }}
        >
          <ThemedText
            type="caption"
            style={[
              styles.dayName,
              { color: day.isSelected ? theme.backgroundRoot : theme.textSecondary },
            ]}
          >
            {day.dayName}
          </ThemedText>
          <ThemedText
            type="h4"
            style={[
              styles.dayNum,
              { color: day.isSelected ? theme.backgroundRoot : theme.text },
            ]}
          >
            {day.dayNum}
          </ThemedText>
          {day.isToday && !day.isSelected && (
            <View style={[styles.todayDot, { backgroundColor: theme.success }]} />
          )}
        </Pressable>
      ))}
    </ScrollView>
  );

  const renderTasksTab = () => (
    <>
      {renderDateStrip()}
      {renderWeekStrip()}
      
      <View style={styles.taskList}>
        {tasks.map((task, index) => (
          <Animated.View
            key={task.id}
            entering={FadeInDown.duration(400).delay(100 + index * 50)}
          >
            <TaskCard
              id={task.id}
              title={task.title}
              category={task.category}
              completed={task.completed}
              onToggle={handleToggleTask}
              onEdit={handleEditTask}
            />
          </Animated.View>
        ))}
      </View>

      {tasks.length === 0 && (
        <Animated.View
          style={styles.emptyState}
          entering={FadeInDown.duration(400).delay(200)}
        >
          <View style={[styles.emptyIcon, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name="check-square" size={40} color={theme.textSecondary} />
          </View>
          <ThemedText type="h4" style={styles.emptyTitle}>
            No tasks yet
          </ThemedText>
          <ThemedText type="body" secondary style={styles.emptyText}>
            Add your first task to start winning the day.
          </ThemedText>
        </Animated.View>
      )}
    </>
  );

  const renderChallengeCard = (challenge: ExecutionChallenge) => {
    const progressPercent = (challenge.daysCompleted / challenge.totalDays) * 100;
    
    return (
      <Animated.View
        key={challenge.id}
        style={[styles.challengeCard, { backgroundColor: theme.backgroundSecondary }]}
        entering={FadeInDown.duration(400)}
      >
        <View style={styles.challengeHeader}>
          <ThemedText type="h4" style={styles.challengeTitle}>
            {challenge.title}
          </ThemedText>
          <View style={[styles.xpBadge, { backgroundColor: theme.accent }]}>
            <ThemedText type="caption" style={{ color: "#FFFFFF", fontWeight: "700" }}>
              +{challenge.xpReward} XP
            </ThemedText>
          </View>
        </View>
        
        <View style={[styles.durationBadge, { backgroundColor: theme.backgroundTertiary }]}>
          <ThemedText type="caption" style={{ color: theme.text }}>
            {challenge.durationDays} Days
          </ThemedText>
        </View>
        
        <View style={styles.challengeProgress}>
          <View style={styles.progressInfo}>
            <ThemedText type="caption" secondary>
              {challenge.daysCompleted}/{challenge.totalDays} days completed
            </ThemedText>
            {challenge.doneToday && (
              <View style={styles.doneTodayBadge}>
                <Feather name="check" size={12} color={theme.text} />
                <ThemedText type="caption" style={{ marginLeft: 4 }}>
                  Done Today
                </ThemedText>
              </View>
            )}
          </View>
          <View style={[styles.progressBar, { backgroundColor: theme.backgroundTertiary }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercent}%`, backgroundColor: theme.accent },
              ]}
            />
          </View>
          <ThemedText type="caption" secondary style={{ marginTop: Spacing.xs }}>
            Started on {challenge.startDate}
          </ThemedText>
        </View>
      </Animated.View>
    );
  };

  const renderChallengesTab = () => (
    <>
      <ThemedText type="h4" style={styles.sectionHeader}>
        CURRENT CHALLENGES
      </ThemedText>
      {currentChallenges.map(renderChallengeCard)}
      
      {pastChallenges.length > 0 && (
        <>
          <ThemedText type="h4" style={[styles.sectionHeader, { marginTop: Spacing.xl }]}>
            PAST CHALLENGES
          </ThemedText>
          {pastChallenges.map(renderChallengeCard)}
        </>
      )}
    </>
  );

  const handleSaveJournal = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const renderJournalTab = () => (
    <>
      {renderDateStrip()}
      {renderWeekStrip()}
      
      <ThemedText type="h4" style={styles.journalDateHeader}>
        {formatDateHeader(selectedDate)}
      </ThemedText>
      
      {currentJournal ? (
        <Animated.View entering={FadeIn.duration(300)}>
          <ThemedText type="body" style={styles.journalContent}>
            {currentJournal.content}
          </ThemedText>
        </Animated.View>
      ) : (
        <>
          <TextInput
            style={[
              styles.journalInput,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder="Write your thoughts for today..."
            placeholderTextColor={theme.textSecondary}
            multiline
            value={journalText}
            onChangeText={setJournalText}
            textAlignVertical="top"
          />
          <Pressable
            style={[
              styles.saveButton,
              { backgroundColor: theme.accent },
              !journalText.trim() && { opacity: 0.5 },
            ]}
            onPress={handleSaveJournal}
            disabled={!journalText.trim()}
          >
            <Feather name="save" size={18} color="#FFFFFF" />
            <ThemedText type="bodyBold" style={{ color: "#FFFFFF", marginLeft: Spacing.sm }}>
              Save Journal
            </ThemedText>
          </Pressable>
        </>
      )}
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: headerHeight + Spacing.md,
            paddingBottom: tabBarHeight + Spacing["4xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent}
          />
        }
      >
        {renderTabBar()}
        
        {activeTab === "Tasks" && renderTasksTab()}
        {activeTab === "Challenges" && renderChallengesTab()}
        {activeTab === "Journal" && renderJournalTab()}
      </ScrollView>

      {activeTab === "Challenges" && (
        <FAB
          icon="plus"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.navigate("ChallengeCreate");
          }}
          style={{ bottom: tabBarHeight + Spacing.xl, right: Spacing.lg }}
        />
      )}

      {showCelebration && (
        <DayWonCelebration
          streak={streak.current}
          xpEarned={xpEarned > 0 ? xpEarned : 250}
          onDismiss={handleDismissCelebration}
        />
      )}
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
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  tabBar: {
    flexDirection: "row",
    borderRadius: BorderRadius.full,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    borderRadius: BorderRadius.full,
  },
  tabText: {
    fontSize: 14,
  },
  dateStripContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  statsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  weekStrip: {
    marginBottom: Spacing.lg,
  },
  weekStripContent: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  dayColumn: {
    width: 48,
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  dayName: {
    fontSize: 11,
    marginBottom: 4,
  },
  dayNum: {
    fontSize: 18,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  taskList: {
    gap: Spacing.sm,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing["4xl"],
    gap: Spacing.md,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    maxWidth: 280,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
    letterSpacing: 1,
  },
  challengeCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  challengeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  challengeTitle: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  xpBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  durationBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  challengeProgress: {
    gap: Spacing.xs,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  doneTodayBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    height: 6,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
    marginTop: Spacing.xs,
  },
  progressFill: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
  journalDateHeader: {
    textAlign: "center",
    marginBottom: Spacing.lg,
    letterSpacing: 1,
  },
  journalContent: {
    lineHeight: 24,
  },
  journalInput: {
    minHeight: 200,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.lg,
  },
});

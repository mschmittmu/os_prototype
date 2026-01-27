import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { LifeScoreRing } from "@/components/LifeScoreRing";
import { VitalStatsRow } from "@/components/VitalStatsRow";
import { ArcaneDirective } from "@/components/ArcaneDirective";
import { OperatorAttributes } from "@/components/OperatorAttributes";
import { TodaysTasksSummary } from "@/components/TodaysTasksSummary";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import {
  getTasks,
  getStreak,
  Task,
  StreakData,
} from "@/lib/storage";
import { hudData } from "@/lib/mockData";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState<StreakData>({
    current: 0,
    best: 0,
    totalDaysWon: 0,
    totalDaysLost: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

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

  const handleViewTasks = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.getParent()?.navigate("ExecuteTab");
  };

  const handleFocusNow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.getParent()?.navigate("ExecuteTab");
  };

  const vitalStats = {
    streak: streak.current || hudData.vitalStats.streak,
    winRate: streak.totalDaysWon > 0 
      ? Math.round((streak.totalDaysWon / (streak.totalDaysWon + streak.totalDaysLost)) * 100)
      : hudData.vitalStats.winRate,
    winRatePeriod: hudData.vitalStats.winRatePeriod,
    totalDays: streak.totalDaysWon + streak.totalDaysLost || hudData.vitalStats.totalDays,
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: headerHeight + Spacing.xs,
          paddingBottom: tabBarHeight + Spacing.xl,
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
      <Animated.View entering={FadeInDown.duration(400).delay(0)}>
        <LifeScoreRing
          score={hudData.lifeScore.current}
          trend={hudData.lifeScore.trend}
          trendDirection={hudData.lifeScore.trendDirection}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(100)}>
        <VitalStatsRow
          streak={vitalStats.streak}
          winRate={vitalStats.winRate}
          winRatePeriod={vitalStats.winRatePeriod}
          totalDays={vitalStats.totalDays}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.section}>
        <ArcaneDirective
          message={hudData.arcaneDirective.message}
          focusArea={hudData.arcaneDirective.focusArea}
          severity={hudData.arcaneDirective.severity}
          onFocusPress={handleFocusNow}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.section}>
        <OperatorAttributes attributes={hudData.attributes} />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(400)} style={styles.section}>
        <TodaysTasksSummary
          tasks={tasks}
          onViewAll={handleViewTasks}
        />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginTop: Spacing.lg,
  },
});

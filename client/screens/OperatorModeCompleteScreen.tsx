import React, { useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { getStreak } from "@/lib/storage";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteParams = RouteProp<RootStackParamList, "OperatorModeComplete">;

export default function OperatorModeCompleteScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParams>();
  const insets = useSafeAreaInsets();
  const { exitedEarly, duration, tasksCompleted, totalTasks, protocolName } = route.params;

  const badgeScale = useSharedValue(0);
  const [streak, setStreak] = React.useState(0);

  useEffect(() => {
    loadStreak();
    if (!exitedEarly) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    badgeScale.value = withDelay(
      300,
      withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 12 })
      )
    );
  }, []);

  const loadStreak = async () => {
    const s = await getStreak();
    setStreak(s.current);
  };

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (remainingMins === 0) return `${hours}h`;
    return `${hours}h ${remainingMins}m`;
  };

  const handleViewResults = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.replace("Main");
  };

  const handleShareToCrew = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.replace("Main");
  };

  return (
    <View style={[styles.container, { backgroundColor: exitedEarly ? "#1A1A1A" : "#0A0A0A" }]}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + Spacing["4xl"], paddingBottom: insets.bottom + Spacing.xl },
        ]}
      >
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <ThemedText type="h2" style={[styles.title, { color: exitedEarly ? "#F59E0B" : "#10B981" }]}>
            {exitedEarly ? "SESSION ENDED" : "MISSION COMPLETE"}
          </ThemedText>
        </Animated.View>

        <Animated.View style={[styles.badgeContainer, badgeStyle]}>
          <View
            style={[
              styles.badge,
              { backgroundColor: exitedEarly ? "#292524" : "#064E3B" },
            ]}
          >
            {exitedEarly ? (
              <Feather name="alert-circle" size={64} color="#F59E0B" />
            ) : (
              <Feather name="award" size={64} color="#10B981" />
            )}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400).delay(400)}
          style={styles.statsContainer}
        >
          <View style={styles.statRow}>
            <ThemedText type="body" style={styles.statLabel}>
              Protocol
            </ThemedText>
            <ThemedText type="bodyBold" style={styles.statValue}>
              {protocolName}
            </ThemedText>
          </View>
          <View style={styles.statRow}>
            <ThemedText type="body" style={styles.statLabel}>
              Duration
            </ThemedText>
            <ThemedText type="bodyBold" style={styles.statValue}>
              {formatDuration(duration)}
            </ThemedText>
          </View>
          <View style={styles.statRow}>
            <ThemedText type="body" style={styles.statLabel}>
              Tasks Completed
            </ThemedText>
            <ThemedText type="bodyBold" style={styles.statValue}>
              {tasksCompleted}/{totalTasks}
            </ThemedText>
          </View>
          {!exitedEarly && (
            <View style={styles.statRow}>
              <ThemedText type="body" style={styles.statLabel}>
                Streak
              </ThemedText>
              <ThemedText type="bodyBold" style={[styles.statValue, { color: "#10B981" }]}>
                Day {streak}
              </ThemedText>
            </View>
          )}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400).delay(500)}
          style={styles.quoteContainer}
        >
          <ThemedText type="body" style={styles.quoteText}>
            {exitedEarly
              ? '"Learn from this. Tomorrow, you go the distance."'
              : '"You stayed the course. That\'s what operators do."'}
          </ThemedText>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400).delay(600)}
          style={styles.buttonsContainer}
        >
          <Pressable
            onPress={handleViewResults}
            style={[
              styles.primaryButton,
              { backgroundColor: exitedEarly ? theme.accent : "#10B981" },
            ]}
          >
            <ThemedText type="bodyBold" style={styles.buttonText}>
              VIEW RESULTS
            </ThemedText>
          </Pressable>
          {!exitedEarly && (
            <Pressable onPress={handleShareToCrew} style={styles.secondaryButton}>
              <Feather name="share-2" size={18} color={theme.textSecondary} />
              <ThemedText type="body" secondary>
                Share to Crew
              </ThemedText>
            </Pressable>
          )}
        </Animated.View>
      </View>
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
    alignItems: "center",
  },
  header: {
    marginBottom: Spacing["3xl"],
  },
  title: {
    textAlign: "center",
    letterSpacing: 2,
  },
  badgeContainer: {
    marginBottom: Spacing["3xl"],
  },
  badge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    width: "100%",
    backgroundColor: "#1F2937",
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing["2xl"],
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  statLabel: {
    color: "#9CA3AF",
  },
  statValue: {
    color: "#FFFFFF",
  },
  quoteContainer: {
    marginBottom: Spacing["3xl"],
    paddingHorizontal: Spacing.lg,
  },
  quoteText: {
    color: "#9CA3AF",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 24,
  },
  buttonsContainer: {
    width: "100%",
    gap: Spacing.lg,
    marginTop: "auto",
  },
  primaryButton: {
    width: "100%",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
});

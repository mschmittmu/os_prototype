import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";

interface LifeScoreRingProps {
  score: number;
  trend: string;
  trendDirection: "up" | "down" | "neutral";
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#F59E0B";
  if (score >= 40) return "#F97316";
  return "#EF4444";
};

export function LifeScoreRing({
  score,
  trend,
  trendDirection,
}: LifeScoreRingProps) {
  const { theme } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(score / 100, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [score]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const scoreColor = getScoreColor(score);
  const trendColor =
    trendDirection === "up"
      ? "#10B981"
      : trendDirection === "down"
      ? "#EF4444"
      : theme.textSecondary;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}>
      <View style={styles.topRow}>
        <View style={styles.labelRow}>
          <ThemedText type="caption" style={styles.label}>
            LIFE SCORE
          </ThemedText>
          <View style={styles.trendBadge}>
            <Feather
              name={trendDirection === "up" ? "trending-up" : trendDirection === "down" ? "trending-down" : "minus"}
              size={12}
              color={trendColor}
            />
            <ThemedText type="small" style={{ color: trendColor }}>
              {trend}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={[styles.scoreNumber, { color: scoreColor }]}>
          {score}
        </ThemedText>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: theme.backgroundTertiary }]}>
        <Animated.View
          style={[
            styles.progressFill,
            { backgroundColor: scoreColor },
            progressStyle,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  label: {
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 36,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
});

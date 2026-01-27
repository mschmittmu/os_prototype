import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  useAnimatedStyle,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface LifeScoreRingProps {
  score: number;
  trend: string;
  trendDirection: "up" | "down" | "neutral";
  size?: number;
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
  size = 120,
}: LifeScoreRingProps) {
  const { theme } = useTheme();
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const progress = useSharedValue(0);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    progress.value = withTiming(score / 100, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [score]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const scoreColor = getScoreColor(score);
  const trendColor =
    trendDirection === "up"
      ? "#10B981"
      : trendDirection === "down"
      ? "#EF4444"
      : theme.textSecondary;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.glow,
          {
            width: size + 30,
            height: size + 30,
            borderRadius: (size + 30) / 2,
            backgroundColor: scoreColor,
          },
          glowStyle,
        ]}
      />
      <View style={[styles.ringContainer, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={scoreColor} />
              <Stop offset="100%" stopColor={scoreColor} stopOpacity={0.7} />
            </LinearGradient>
          </Defs>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.backgroundTertiary}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.scoreContainer}>
          <ThemedText style={[styles.scoreNumber, { color: theme.text }]}>
            {score}
          </ThemedText>
        </View>
      </View>
      <ThemedText type="caption" style={styles.label}>
        LIFE SCORE
      </ThemedText>
      <View style={styles.trendContainer}>
        <Feather
          name={trendDirection === "up" ? "arrow-up" : trendDirection === "down" ? "arrow-down" : "minus"}
          size={14}
          color={trendColor}
        />
        <ThemedText type="small" style={{ color: trendColor }}>
          {trend} from last week
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  glow: {
    position: "absolute",
    top: Spacing.md - 15,
  },
  ringContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1,
  },
  label: {
    marginTop: Spacing.sm,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontSize: 11,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
});

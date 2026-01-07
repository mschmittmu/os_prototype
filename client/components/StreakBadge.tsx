import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface StreakBadgeProps {
  streak: number;
  size?: "small" | "medium" | "large";
}

export function StreakBadge({ streak, size = "medium" }: StreakBadgeProps) {
  const { theme } = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    if (streak >= 7) {
      return {
        transform: [
          {
            scale: withRepeat(
              withSequence(
                withTiming(1.15, {
                  duration: 600,
                  easing: Easing.inOut(Easing.ease),
                }),
                withTiming(1, {
                  duration: 600,
                  easing: Easing.inOut(Easing.ease),
                })
              ),
              -1,
              true
            ),
          },
        ],
      };
    }
    return { transform: [{ scale: 1 }] };
  });

  const sizeStyles = {
    small: { iconSize: 14, fontSize: 12, padding: Spacing.xs },
    medium: { iconSize: 16, fontSize: 14, padding: Spacing.sm },
    large: { iconSize: 20, fontSize: 18, padding: Spacing.md },
  };

  const { iconSize, fontSize, padding } = sizeStyles[size];

  const getFlameColor = () => {
    if (streak >= 30) return "#FF4500";
    if (streak >= 14) return "#FF6B35";
    if (streak >= 7) return "#FF8C00";
    return theme.warning;
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: padding * 1.5,
          paddingVertical: padding,
          backgroundColor: theme.backgroundSecondary,
        },
      ]}
    >
      <Animated.View style={animatedStyle}>
        <Feather name="zap" size={iconSize} color={getFlameColor()} />
      </Animated.View>
      <ThemedText
        type={size === "large" ? "statSmall" : "bodyBold"}
        style={[styles.text, { fontSize }]}
      >
        {streak} Day Streak
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  text: {},
});

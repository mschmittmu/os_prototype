import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface AnimatedBadgeProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  unlocked?: boolean;
  animate?: boolean;
  size?: "small" | "medium" | "large";
  color?: string;
}

export function AnimatedBadge({
  icon,
  label,
  unlocked = true,
  animate = false,
  size = "medium",
  color,
}: AnimatedBadgeProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(animate ? 0 : 1);
  const rotate = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const shimmerPosition = useSharedValue(-1);

  const badgeColor = color || theme.accent;

  const sizeConfig = {
    small: { container: 48, icon: 20, fontSize: 10 },
    medium: { container: 64, icon: 28, fontSize: 12 },
    large: { container: 80, icon: 36, fontSize: 14 },
  };

  const config = sizeConfig[size];

  useEffect(() => {
    if (animate && unlocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      scale.value = withSequence(
        withSpring(1.3, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 12, stiffness: 150 })
      );
      
      rotate.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 100 }),
        withTiming(-5, { duration: 75 }),
        withTiming(0, { duration: 75 })
      );
      
      glowOpacity.value = withSequence(
        withTiming(0.8, { duration: 200 }),
        withDelay(500, withTiming(0, { duration: 300 }))
      );
      
      shimmerPosition.value = withDelay(
        300,
        withTiming(2, { duration: 600, easing: Easing.inOut(Easing.ease) })
      );
    }
  }, [animate, unlocked]);

  useEffect(() => {
    if (unlocked && !animate) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 1500 }),
          withTiming(0, { duration: 1500 })
        ),
        -1,
        true
      );
    }
  }, [unlocked, animate]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: 1.2 }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerPosition.value * config.container }],
    opacity: shimmerPosition.value > 0 && shimmerPosition.value < 1 ? 0.6 : 0,
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.container, containerStyle]}>
        <Animated.View
          style={[
            styles.glow,
            {
              width: config.container,
              height: config.container,
              borderRadius: config.container / 2,
              backgroundColor: badgeColor,
            },
            glowStyle,
          ]}
        />
        <View
          style={[
            styles.badge,
            {
              width: config.container,
              height: config.container,
              borderRadius: config.container / 2,
              backgroundColor: unlocked ? badgeColor : theme.backgroundTertiary,
            },
          ]}
        >
          <Feather
            name={icon}
            size={config.icon}
            color={unlocked ? "#FFFFFF" : theme.textSecondary}
          />
          <Animated.View
            style={[
              styles.shimmer,
              {
                height: config.container,
              },
              shimmerStyle,
            ]}
          />
        </View>
      </Animated.View>
      <ThemedText
        type="caption"
        style={[
          styles.label,
          { fontSize: config.fontSize },
          !unlocked && { color: theme.textSecondary },
        ]}
      >
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  container: {
    position: "relative",
  },
  glow: {
    position: "absolute",
  },
  badge: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  shimmer: {
    position: "absolute",
    width: 20,
    backgroundColor: "rgba(255,255,255,0.4)",
    transform: [{ skewX: "-20deg" }],
  },
  label: {
    textAlign: "center",
    fontWeight: "600",
  },
});

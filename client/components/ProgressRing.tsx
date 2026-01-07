import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const springConfig: WithSpringConfig = {
  damping: 20,
  mass: 1,
  stiffness: 100,
};

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  label,
}: ProgressRingProps) {
  const { theme } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: withSpring(
      circumference * (1 - clampedProgress),
      springConfig
    ),
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.backgroundTertiary}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.accent}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {showLabel ? (
        <View style={styles.labelContainer}>
          <ThemedText type="stat">
            {Math.round(clampedProgress * 100)}%
          </ThemedText>
          {label ? (
            <ThemedText type="caption" secondary>
              {label}
            </ThemedText>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    position: "absolute",
  },
  labelContainer: {
    alignItems: "center",
  },
});

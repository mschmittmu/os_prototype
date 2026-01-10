import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface OperatorModeButtonProps {
  onPress: () => void;
  isActive?: boolean;
  compact?: boolean;
}

export function OperatorModeButton({ onPress, isActive, compact }: OperatorModeButtonProps) {
  const { theme } = useTheme();
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (!isActive) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress();
  };

  if (compact) {
    return (
      <Pressable onPress={handlePress} style={styles.compactButton}>
        <Animated.View style={animatedStyle}>
          <View style={[styles.compactInner, { backgroundColor: isActive ? theme.success : theme.accent }]}>
            <Feather name="shield" size={20} color="#FFFFFF" />
          </View>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Animated.View
          style={[
            styles.glow,
            { backgroundColor: isActive ? theme.success : theme.accent },
            glowStyle,
          ]}
        />
        <View
          style={[
            styles.button,
            {
              backgroundColor: isActive ? theme.success : theme.accent,
              borderColor: isActive ? theme.success : "#FF0000",
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Feather name="shield" size={28} color="#FFFFFF" />
            {isActive && (
              <View style={styles.activeDot} />
            )}
          </View>
          <ThemedText type="bodyBold" style={styles.buttonText}>
            {isActive ? "ACTIVE" : "OPERATOR MODE"}
          </ThemedText>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: "120%",
    height: "120%",
    borderRadius: BorderRadius.xl,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    gap: Spacing.sm,
  },
  iconContainer: {
    position: "relative",
  },
  activeDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  buttonText: {
    color: "#FFFFFF",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  compactButton: {
    padding: Spacing.xs,
  },
  compactInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  withRepeat,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { Confetti } from "@/components/Confetti";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

const { width, height } = Dimensions.get("window");

interface DayWonCelebrationProps {
  streak: number;
  xpEarned: number;
  onDismiss: () => void;
}

export function DayWonCelebration({
  streak,
  xpEarned,
  onDismiss,
}: DayWonCelebrationProps) {
  const { theme } = useTheme();
  const [showConfetti, setShowConfetti] = useState(false);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const streakScale = useSharedValue(0);
  const xpTranslateY = useSharedValue(50);
  const xpOpacity = useSharedValue(0);
  const iconRotate = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const shimmerX = useSharedValue(-100);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });

    iconRotate.value = withSequence(
      withTiming(-15, { duration: 100 }),
      withTiming(15, { duration: 150 }),
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );

    streakScale.value = withDelay(
      300,
      withSequence(
        withSpring(1.3, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 12, stiffness: 150 })
      )
    );

    xpOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));
    xpTranslateY.value = withDelay(500, withSpring(0, { damping: 15 }));

    pulseScale.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(1.05, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    shimmerX.value = withDelay(
      600,
      withTiming(width, { duration: 800, easing: Easing.inOut(Easing.ease) })
    );

    setTimeout(() => setShowConfetti(true), 200);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotate.value}deg` }],
  }));

  const streakStyle = useAnimatedStyle(() => ({
    transform: [{ scale: streakScale.value }],
  }));

  const xpStyle = useAnimatedStyle(() => ({
    opacity: xpOpacity.value,
    transform: [{ translateY: xpTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowConfetti(false);
    opacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(onDismiss)();
      }
    });
    scale.value = withTiming(0.8, { duration: 200 });
  };

  return (
    <Animated.View style={[styles.overlay, containerStyle]}>
      <Confetti
        active={showConfetti}
        count={60}
        origin={{ x: width / 2, y: height / 3 }}
      />
      <Pressable style={styles.backdrop} onPress={handleDismiss} />
      <Animated.View
        style={[
          styles.card,
          cardStyle,
          { backgroundColor: theme.backgroundRoot },
        ]}
      >
        <Animated.View style={[styles.shimmer, shimmerStyle]} />
        
        <View style={styles.iconContainer}>
          <Animated.View
            style={[
              styles.iconCircle,
              { backgroundColor: theme.backgroundSecondary },
              iconStyle,
            ]}
          >
            <Feather name="award" size={48} color={theme.accent} />
          </Animated.View>
        </View>

        <ThemedText type="h1" style={[styles.title, { color: theme.accent }]}>
          DAY WON
        </ThemedText>

        <Animated.View style={[styles.streakContainer, streakStyle]}>
          <Feather name="zap" size={28} color={theme.warning} />
          <ThemedText type="stat" style={styles.streakText}>
            {streak}
          </ThemedText>
          <ThemedText type="body" secondary>
            DAY STREAK
          </ThemedText>
        </Animated.View>

        <Animated.View
          style={[
            styles.xpContainer,
            xpStyle,
            { backgroundColor: theme.success },
          ]}
        >
          <ThemedText type="h3" style={styles.xpText}>
            +{xpEarned} XP
          </ThemedText>
        </Animated.View>

        <ThemedText type="body" secondary style={styles.tagline}>
          Now go win another.
        </ThemedText>

        <Animated.View style={buttonStyle}>
          <Pressable
            style={[styles.dismissButton, { backgroundColor: theme.accent }]}
            onPress={handleDismiss}
          >
            <ThemedText type="bodyBold" style={styles.dismissText}>
              CONTINUE
            </ThemedText>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  card: {
    borderRadius: BorderRadius["2xl"],
    padding: Spacing["3xl"],
    alignItems: "center",
    width: width - Spacing["3xl"] * 2,
    maxWidth: 360,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
    overflow: "hidden",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 60,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    transform: [{ skewX: "-20deg" }],
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  streakText: {
    fontSize: 48,
  },
  xpContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.xl,
  },
  xpText: {
    color: "#FFFFFF",
  },
  tagline: {
    fontStyle: "italic",
    marginBottom: Spacing.xl,
  },
  dismissButton: {
    paddingHorizontal: Spacing["3xl"],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  dismissText: {
    color: "#FFFFFF",
  },
});

import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

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
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const streakScale = useSharedValue(0);
  const xpTranslateY = useSharedValue(50);
  const xpOpacity = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
    
    streakScale.value = withDelay(
      300,
      withSequence(
        withSpring(1.2, { damping: 10 }),
        withSpring(1, { damping: 15 })
      )
    );
    
    xpOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));
    xpTranslateY.value = withDelay(
      500,
      withSpring(0, { damping: 15 })
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const streakStyle = useAnimatedStyle(() => ({
    transform: [{ scale: streakScale.value }],
  }));

  const xpStyle = useAnimatedStyle(() => ({
    opacity: xpOpacity.value,
    transform: [{ translateY: xpTranslateY.value }],
  }));

  const handleDismiss = () => {
    opacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(onDismiss)();
      }
    });
    scale.value = withTiming(0.8, { duration: 200 });
  };

  return (
    <Animated.View style={[styles.overlay, containerStyle]}>
      <Pressable style={styles.backdrop} onPress={handleDismiss} />
      <Animated.View style={[styles.card, cardStyle]}>
        <View style={styles.iconContainer}>
          <Feather name="award" size={64} color={Colors.dark.accent} />
        </View>
        
        <ThemedText type="h1" style={styles.title}>
          YOU WON THE DAY
        </ThemedText>
        
        <Animated.View style={[styles.streakContainer, streakStyle]}>
          <Feather name="zap" size={32} color={Colors.dark.warning} />
          <ThemedText type="stat" style={styles.streakText}>
            {streak}
          </ThemedText>
          <ThemedText type="body" secondary>
            DAY STREAK
          </ThemedText>
        </Animated.View>
        
        <Animated.View style={[styles.xpContainer, xpStyle]}>
          <ThemedText type="h3" style={styles.xpText}>
            +{xpEarned} XP
          </ThemedText>
        </Animated.View>
        
        <ThemedText type="body" secondary style={styles.tagline}>
          Now go win another.
        </ThemedText>
        
        <Pressable style={styles.dismissButton} onPress={handleDismiss}>
          <ThemedText type="bodyBold" style={styles.dismissText}>
            CONTINUE
          </ThemedText>
        </Pressable>
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
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  card: {
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius["2xl"],
    padding: Spacing["3xl"],
    alignItems: "center",
    width: width - Spacing["3xl"] * 2,
    maxWidth: 360,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  title: {
    textAlign: "center",
    color: Colors.dark.accent,
    marginBottom: Spacing.xl,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  streakText: {
    color: Colors.dark.text,
    fontSize: 48,
  },
  xpContainer: {
    backgroundColor: Colors.dark.success,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.xl,
  },
  xpText: {
    color: Colors.dark.backgroundRoot,
  },
  tagline: {
    fontStyle: "italic",
    marginBottom: Spacing.xl,
  },
  dismissButton: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: Spacing["3xl"],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  dismissText: {
    color: Colors.dark.text,
  },
});

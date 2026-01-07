import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";

interface XPGainProps {
  amount: number;
  x: number;
  y: number;
  onComplete?: () => void;
}

export function XPGain({ amount, x, y, onComplete }: XPGainProps) {
  const { theme } = useTheme();
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 150 }),
      withDelay(600, withTiming(0, { duration: 300 }))
    );
    
    translateY.value = withTiming(-80, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
    
    scale.value = withSequence(
      withTiming(1.2, { duration: 150, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 100 })
    );

    if (onComplete) {
      setTimeout(() => {
        runOnJS(onComplete)();
      }, 1100);
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, { left: x, top: y }, animatedStyle]}>
      <ThemedText type="bodyBold" style={[styles.text, { color: theme.success }]}>
        +{amount} XP
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1000,
  },
  text: {
    fontSize: 18,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

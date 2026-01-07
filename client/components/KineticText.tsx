import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

interface KineticTextProps {
  text: string;
  type?: "wave" | "bounce" | "fade" | "scale" | "typewriter";
  textType?: "h1" | "h2" | "h3" | "h4" | "body" | "bodyBold";
  color?: string;
  delay?: number;
  loop?: boolean;
  staggerDelay?: number;
}

interface AnimatedLetterProps {
  letter: string;
  index: number;
  type: "wave" | "bounce" | "fade" | "scale" | "typewriter";
  color?: string;
  textType: "h1" | "h2" | "h3" | "h4" | "body" | "bodyBold";
  delay: number;
  loop: boolean;
  staggerDelay: number;
}

function AnimatedLetter({
  letter,
  index,
  type,
  color,
  textType,
  delay,
  loop,
  staggerDelay,
}: AnimatedLetterProps) {
  const { theme } = useTheme();
  const translateY = useSharedValue(0);
  const scale = useSharedValue(type === "scale" || type === "typewriter" ? 0 : 1);
  const opacity = useSharedValue(type === "fade" || type === "typewriter" ? 0 : 1);

  const letterColor = color || theme.text;
  const letterDelay = delay + index * staggerDelay;

  useEffect(() => {
    switch (type) {
      case "wave":
        const waveAnimation = withSequence(
          withTiming(-8, { duration: 200, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 200, easing: Easing.in(Easing.quad) })
        );
        translateY.value = withDelay(
          letterDelay,
          loop ? withRepeat(waveAnimation, -1, false) : waveAnimation
        );
        break;

      case "bounce":
        scale.value = withDelay(
          letterDelay,
          withSequence(
            withSpring(1.3, { damping: 8, stiffness: 200 }),
            withSpring(1, { damping: 12, stiffness: 150 })
          )
        );
        break;

      case "fade":
        opacity.value = withDelay(
          letterDelay,
          withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) })
        );
        break;

      case "scale":
        scale.value = withDelay(
          letterDelay,
          withSequence(
            withSpring(1.2, { damping: 10, stiffness: 200 }),
            withSpring(1, { damping: 15, stiffness: 150 })
          )
        );
        break;

      case "typewriter":
        opacity.value = withDelay(
          letterDelay,
          withTiming(1, { duration: 50 })
        );
        scale.value = withDelay(
          letterDelay,
          withSequence(
            withTiming(1.1, { duration: 50 }),
            withTiming(1, { duration: 100 })
          )
        );
        break;
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
    <Animated.View style={animatedStyle}>
      <ThemedText type={textType} style={{ color: letterColor }}>
        {letter === " " ? "\u00A0" : letter}
      </ThemedText>
    </Animated.View>
  );
}

export function KineticText({
  text,
  type = "wave",
  textType = "h2",
  color,
  delay = 0,
  loop = false,
  staggerDelay = 50,
}: KineticTextProps) {
  const letters = text.split("");

  return (
    <View style={styles.container}>
      {letters.map((letter, index) => (
        <AnimatedLetter
          key={`${letter}-${index}`}
          letter={letter}
          index={index}
          type={type}
          color={color}
          textType={textType}
          delay={delay}
          loop={loop}
          staggerDelay={staggerDelay}
        />
      ))}
    </View>
  );
}

interface AnimatedWordProps {
  words: string[];
  interval?: number;
  textType?: "h1" | "h2" | "h3" | "h4" | "body" | "bodyBold";
  color?: string;
}

export function RotatingWords({
  words,
  interval = 3000,
  textType = "h2",
  color,
}: AnimatedWordProps) {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  const wordColor = color || theme.accent;

  useEffect(() => {
    const timer = setInterval(() => {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(-20, { duration: 200 });

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        translateY.value = 20;
        opacity.value = withTiming(1, { duration: 200 });
        translateY.value = withSpring(0, { damping: 15 });
      }, 200);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.rotatingContainer}>
      <Animated.View style={animatedStyle}>
        <ThemedText type={textType} style={{ color: wordColor }}>
          {words[currentIndex]}
        </ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  rotatingContainer: {
    overflow: "hidden",
  },
});

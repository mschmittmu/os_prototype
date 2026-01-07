import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Platform, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface VoiceInputButtonProps {
  onTranscription?: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInputButton({
  onTranscription,
  disabled = false,
}: VoiceInputButtonProps) {
  const { theme } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 800, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.in(Easing.ease) })
        ),
        -1,
        true
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 800 }),
          withTiming(0, { duration: 800 })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(pulseScale);
      cancelAnimation(pulseOpacity);
      pulseScale.value = withTiming(1, { duration: 200 });
      pulseOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isRecording]);

  const handlePress = () => {
    if (Platform.OS === "web") {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (isRecording) {
      iconScale.value = withSpring(1, { damping: 12 });
      setIsRecording(false);
      Alert.alert(
        "Voice Input",
        "Voice transcription requires a backend service integration. This feature preview shows the UI and recording experience.",
        [{ text: "Got it" }]
      );
    } else {
      iconScale.value = withSpring(0.9, { damping: 15 });
      setIsRecording(true);
      
      setTimeout(() => {
        if (isRecording) {
          setIsRecording(false);
          iconScale.value = withSpring(1, { damping: 12 });
        }
      }, 5000);
    }
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const isWebPlatform = Platform.OS === "web";

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePress}
        disabled={disabled || isWebPlatform}
        style={[
          styles.button,
          {
            backgroundColor: isRecording ? theme.accent : theme.backgroundSecondary,
            opacity: disabled || isWebPlatform ? 0.5 : 1,
          },
        ]}
      >
        <Animated.View style={[styles.pulse, { backgroundColor: theme.accent }, pulseStyle]} />
        <Animated.View style={iconAnimatedStyle}>
          <Feather
            name="mic"
            size={24}
            color={isRecording ? "#FFFFFF" : theme.text}
          />
        </Animated.View>
      </Pressable>
      <ThemedText type="caption" secondary style={styles.label}>
        {isWebPlatform
          ? "Use Expo Go"
          : isRecording
          ? "Recording..."
          : "Voice input"}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  pulse: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  label: {
    textAlign: "center",
    fontSize: 10,
  },
});

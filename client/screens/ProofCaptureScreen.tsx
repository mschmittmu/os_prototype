import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Audio } from "expo-av";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import {
  addProofEntry,
  addProofTriggerFired,
  getStreak,
  ProofEntry,
} from "@/lib/storage";
import { hudData } from "@/lib/mockData";

type Props = NativeStackScreenProps<RootStackParamList, "ProofCapture">;

const TRIGGER_ICONS: Record<string, string> = {
  streak_milestone: "award",
  win_rate_threshold: "trending-up",
  recovery_win: "refresh-cw",
  first_week: "flag",
};

export default function ProofCaptureScreen({ route, navigation }: Props) {
  const { triggerId, triggerType, triggerLabel, message } = route.params;
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [hasRecording, setHasRecording] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      pulseScale.value = withRepeat(
        withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 300 });
    }
  }, [isRecording]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        setShowTextInput(true);
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch (error) {
      console.error("Failed to start recording:", error);
      setShowTextInput(true);
    }
  };

  const stopRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        recordingRef.current = null;
        if (uri) {
          setAudioUri(uri);
          setHasRecording(true);
        }
      }
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
      setIsRecording(false);
    }
  };

  const handleRecordPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSave = async () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    const streak = await getStreak();
    const entry: ProofEntry = {
      id: `proof_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      triggerId,
      triggerType: triggerType as ProofEntry["triggerType"],
      triggerLabel,
      format: hasRecording ? "voice" : "text",
      content: hasRecording ? `Voice memo (${formatDuration(recordingDuration)})` : textContent,
      audioUri: audioUri || undefined,
      streakAtCapture: streak.current,
      lifeScoreAtCapture: hudData.lifeScore.current,
      capturedAt: new Date().toISOString(),
      visibility: "private",
    };
    await addProofEntry(entry);
    await addProofTriggerFired({ triggerId, firedAt: new Date().toISOString() });
    navigation.goBack();
  };

  const handleSkip = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await addProofTriggerFired({ triggerId, firedAt: new Date().toISOString() });
    navigation.goBack();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const canSave = hasRecording || (showTextInput && textContent.trim().length > 0);
  const iconName = TRIGGER_ICONS[triggerType] || "award";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: "#0A0A0A",
          paddingTop: insets.top + Spacing["2xl"],
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
        <View style={[styles.milestoneBadge, { backgroundColor: "rgba(227, 24, 55, 0.15)" }]}>
          <Feather name={iconName as any} size={32} color={theme.accent} />
        </View>
        <ThemedText style={[styles.milestoneMessage, { color: "#FFFFFF" }]}>
          {message}
        </ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.captureSection}>
        <ThemedText style={[styles.captureTitle, { color: theme.textSecondary }]}>
          CAPTURE THIS MOMENT
        </ThemedText>
        <ThemedText style={[styles.captureSubtitle, { color: "rgba(255,255,255,0.5)" }]}>
          Record what you're feeling right now. No editing. No filter. Just truth.
        </ThemedText>

        {!showTextInput ? (
          <View style={styles.voiceSection}>
            <Animated.View style={pulseStyle}>
              <Pressable
                style={[
                  styles.recordButton,
                  {
                    backgroundColor: isRecording ? "#DC2626" : theme.accent,
                    borderColor: isRecording ? "rgba(220, 38, 38, 0.3)" : "rgba(227, 24, 55, 0.3)",
                  },
                ]}
                onPress={handleRecordPress}
              >
                <Feather
                  name={isRecording ? "square" : "mic"}
                  size={32}
                  color="#FFFFFF"
                />
              </Pressable>
            </Animated.View>

            {isRecording ? (
              <ThemedText style={[styles.timerText, { color: "#DC2626" }]}>
                {formatDuration(recordingDuration)}
              </ThemedText>
            ) : hasRecording ? (
              <ThemedText style={[styles.timerText, { color: theme.success }]}>
                Recorded {formatDuration(recordingDuration)}
              </ThemedText>
            ) : (
              <ThemedText style={[styles.tapToRecord, { color: theme.textSecondary }]}>
                TAP TO RECORD
              </ThemedText>
            )}

            <Pressable onPress={() => setShowTextInput(true)}>
              <ThemedText style={[styles.textFallback, { color: theme.textSecondary }]}>
                Or type instead
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(300)} style={styles.textSection}>
            <TextInput
              style={[
                styles.textInput,
                {
                  color: "#FFFFFF",
                  borderColor: theme.border,
                  backgroundColor: "rgba(255,255,255,0.05)",
                },
              ]}
              placeholder="What does this moment mean to you?"
              placeholderTextColor="rgba(255,255,255,0.3)"
              multiline
              value={textContent}
              onChangeText={setTextContent}
              autoFocus
            />
            {!hasRecording && (
              <Pressable onPress={() => setShowTextInput(false)}>
                <ThemedText style={[styles.textFallback, { color: theme.textSecondary }]}>
                  Or record voice instead
                </ThemedText>
              </Pressable>
            )}
          </Animated.View>
        )}
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.footer}>
        <Pressable
          style={[
            styles.saveButton,
            {
              backgroundColor: canSave ? theme.accent : "rgba(255,255,255,0.1)",
            },
          ]}
          onPress={handleSave}
          disabled={!canSave}
        >
          <ThemedText
            style={[
              styles.saveButtonText,
              { color: canSave ? "#FFFFFF" : "rgba(255,255,255,0.3)" },
            ]}
          >
            SAVE TO VAULT
          </ThemedText>
        </Pressable>

        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <ThemedText style={[styles.skipText, { color: theme.textSecondary }]}>
            SKIP
          </ThemedText>
        </Pressable>

        <ThemedText style={[styles.privateNote, { color: "rgba(255,255,255,0.25)" }]}>
          This is private. Only you can see it.
        </ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing["2xl"],
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  milestoneBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  milestoneMessage: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 1,
    lineHeight: 36,
    textTransform: "uppercase",
  },
  captureSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  captureTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 3,
    marginBottom: Spacing.md,
    textTransform: "uppercase",
  },
  captureSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: Spacing["3xl"],
    maxWidth: 300,
  },
  voiceSection: {
    alignItems: "center",
    gap: Spacing.xl,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
  },
  timerText: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "ui-monospace", default: "monospace" }),
  },
  tapToRecord: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
  },
  textFallback: {
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
    marginTop: Spacing.md,
  },
  textSection: {
    width: "100%",
    alignItems: "center",
  },
  textInput: {
    width: "100%",
    minHeight: 120,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    fontSize: 16,
    textAlignVertical: "top",
    lineHeight: 24,
  },
  footer: {
    alignItems: "center",
    gap: Spacing.lg,
  },
  saveButton: {
    width: "100%",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
  },
  skipButton: {
    paddingVertical: Spacing.sm,
  },
  skipText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
  },
  privateNote: {
    fontSize: 12,
    fontStyle: "italic",
  },
});

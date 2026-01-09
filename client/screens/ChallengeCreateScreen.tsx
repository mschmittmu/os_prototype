import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

const DURATION_OPTIONS = [
  { label: "3 Days", value: 3 },
  { label: "7 Days", value: 7 },
  { label: "14 Days", value: 14 },
  { label: "21 Days", value: 21 },
  { label: "30 Days", value: 30 },
  { label: "75 Days", value: 75 },
];

const CHALLENGE_TEMPLATES = [
  { title: "Deep Work Immersion", duration: 3 },
  { title: "Iron Will Workout", duration: 3 },
  { title: "Cold Shower Challenge", duration: 7 },
  { title: "No Social Media", duration: 14 },
  { title: "100 Pushups Daily", duration: 30 },
  { title: "75 Hard", duration: 75 },
];

export default function ChallengeCreateScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(3);

  const handleCreate = () => {
    if (!title.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.goBack();
  };

  const handleSelectTemplate = (template: { title: string; duration: number }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTitle(template.title);
    setSelectedDuration(template.duration);
  };

  const calculateXP = (days: number) => {
    if (days <= 3) return 600;
    if (days <= 7) return 1000;
    if (days <= 14) return 1500;
    if (days <= 21) return 2000;
    if (days <= 30) return 3000;
    return 5000;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + Spacing["4xl"] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            CHALLENGE NAME
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder="Enter challenge name..."
            placeholderTextColor={theme.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            DURATION
          </ThemedText>
          <View style={styles.durationGrid}>
            {DURATION_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.durationOption,
                  { backgroundColor: theme.backgroundSecondary },
                  selectedDuration === option.value && {
                    backgroundColor: theme.accent,
                    borderColor: theme.accent,
                  },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedDuration(option.value);
                }}
              >
                <ThemedText
                  type="bodyBold"
                  style={[
                    styles.durationText,
                    { color: selectedDuration === option.value ? "#FFFFFF" : theme.text },
                  ]}
                >
                  {option.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <View style={[styles.xpPreview, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText type="body" secondary>
              Completion Reward
            </ThemedText>
            <View style={[styles.xpBadge, { backgroundColor: theme.accent }]}>
              <ThemedText type="h4" style={{ color: "#FFFFFF" }}>
                +{calculateXP(selectedDuration)} XP
              </ThemedText>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(300)}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            QUICK START TEMPLATES
          </ThemedText>
          <View style={styles.templatesContainer}>
            {CHALLENGE_TEMPLATES.map((template, index) => (
              <Pressable
                key={index}
                style={[
                  styles.templateCard,
                  { backgroundColor: theme.backgroundSecondary },
                  title === template.title && { borderColor: theme.accent, borderWidth: 2 },
                ]}
                onPress={() => handleSelectTemplate(template)}
              >
                <ThemedText type="bodyBold">{template.title}</ThemedText>
                <ThemedText type="caption" secondary>
                  {template.duration} Days
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.backgroundRoot,
            paddingBottom: insets.bottom + Spacing.md,
            borderTopColor: theme.border,
          },
        ]}
      >
        <Pressable
          style={[
            styles.createButton,
            { backgroundColor: theme.accent },
            !title.trim() && { opacity: 0.5 },
          ]}
          onPress={handleCreate}
          disabled={!title.trim()}
        >
          <Feather name="play" size={20} color="#FFFFFF" />
          <ThemedText type="bodyBold" style={{ color: "#FFFFFF", marginLeft: Spacing.sm }}>
            Start Challenge
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    fontSize: 16,
  },
  durationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  durationOption: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
  },
  durationText: {
    textAlign: "center",
  },
  xpPreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  xpBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  templatesContainer: {
    gap: Spacing.sm,
  },
  templateCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
});

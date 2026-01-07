import React from "react";
import { View, StyleSheet, Pressable, ScrollView, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, ThemeMode } from "@/constants/theme";

const THEME_OPTIONS: { label: string; value: ThemeMode; icon: string }[] = [
  { label: "Light", value: "light", icon: "sun" },
  { label: "Dark", value: "dark", icon: "moon" },
  { label: "System", value: "system", icon: "smartphone" },
];

export default function SettingsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme, themeMode, setThemeMode, isDark } = useTheme();

  const handleThemeSelect = (mode: ThemeMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setThemeMode(mode);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(400)}>
        <ThemedText type="caption" secondary style={styles.sectionTitle}>
          APPEARANCE
        </ThemedText>
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: theme.backgroundRoot,
              borderColor: theme.border,
            },
          ]}
        >
          <ThemedText type="bodyBold" style={styles.optionLabel}>
            Theme
          </ThemedText>
          <View style={styles.themeOptions}>
            {THEME_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.themeOption,
                  {
                    backgroundColor:
                      themeMode === option.value
                        ? theme.accent
                        : theme.backgroundSecondary,
                  },
                ]}
                onPress={() => handleThemeSelect(option.value)}
              >
                <Feather
                  name={option.icon as any}
                  size={18}
                  color={
                    themeMode === option.value ? "#FFFFFF" : theme.textSecondary
                  }
                />
                <ThemedText
                  type="small"
                  style={{
                    color:
                      themeMode === option.value ? "#FFFFFF" : theme.text,
                  }}
                >
                  {option.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(100)}>
        <ThemedText type="caption" secondary style={styles.sectionTitle}>
          ACCESSIBILITY
        </ThemedText>
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: theme.backgroundRoot,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.settingsRow}>
            <View style={styles.settingsRowContent}>
              <View
                style={[
                  styles.settingsIcon,
                  { backgroundColor: theme.backgroundSecondary },
                ]}
              >
                <Feather name="type" size={18} color={theme.textSecondary} />
              </View>
              <ThemedText type="body">Large Text</ThemedText>
            </View>
            <Switch
              value={false}
              onValueChange={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
              trackColor={{
                false: theme.backgroundTertiary,
                true: theme.accent,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View
            style={[styles.settingsDivider, { backgroundColor: theme.border }]}
          />
          <View style={styles.settingsRow}>
            <View style={styles.settingsRowContent}>
              <View
                style={[
                  styles.settingsIcon,
                  { backgroundColor: theme.backgroundSecondary },
                ]}
              >
                <Feather name="eye" size={18} color={theme.textSecondary} />
              </View>
              <ThemedText type="body">High Contrast</ThemedText>
            </View>
            <Switch
              value={false}
              onValueChange={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
              trackColor={{
                false: theme.backgroundTertiary,
                true: theme.accent,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View
            style={[styles.settingsDivider, { backgroundColor: theme.border }]}
          />
          <View style={styles.settingsRow}>
            <View style={styles.settingsRowContent}>
              <View
                style={[
                  styles.settingsIcon,
                  { backgroundColor: theme.backgroundSecondary },
                ]}
              >
                <Feather name="zap" size={18} color={theme.textSecondary} />
              </View>
              <ThemedText type="body">Reduce Motion</ThemedText>
            </View>
            <Switch
              value={false}
              onValueChange={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
              trackColor={{
                false: theme.backgroundTertiary,
                true: theme.accent,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(200)}>
        <ThemedText type="caption" secondary style={styles.sectionTitle}>
          NOTIFICATIONS
        </ThemedText>
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: theme.backgroundRoot,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.settingsRow}>
            <View style={styles.settingsRowContent}>
              <View
                style={[
                  styles.settingsIcon,
                  { backgroundColor: theme.backgroundSecondary },
                ]}
              >
                <Feather name="bell" size={18} color={theme.textSecondary} />
              </View>
              <ThemedText type="body">Push Notifications</ThemedText>
            </View>
            <Switch
              value={true}
              onValueChange={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
              trackColor={{
                false: theme.backgroundTertiary,
                true: theme.accent,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View
            style={[styles.settingsDivider, { backgroundColor: theme.border }]}
          />
          <View style={styles.settingsRow}>
            <View style={styles.settingsRowContent}>
              <View
                style={[
                  styles.settingsIcon,
                  { backgroundColor: theme.backgroundSecondary },
                ]}
              >
                <Feather name="volume-2" size={18} color={theme.textSecondary} />
              </View>
              <ThemedText type="body">Sound Effects</ThemedText>
            </View>
            <Switch
              value={true}
              onValueChange={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
              trackColor={{
                false: theme.backgroundTertiary,
                true: theme.accent,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </Animated.View>

      <ThemedText type="caption" secondary style={styles.version}>
        The Operator Standard v1.0.0
      </ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
    marginTop: Spacing.lg,
  },
  settingsCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  optionLabel: {
    marginBottom: Spacing.md,
  },
  themeOptions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  themeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  settingsRowContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  settingsIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsDivider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  version: {
    textAlign: "center",
    marginTop: Spacing["3xl"],
  },
});

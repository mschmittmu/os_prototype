import React, { useState, useCallback } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { StreakBadge } from "@/components/StreakBadge";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { getUser, getStreak, UserData, StreakData } from "@/lib/storage";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SETTINGS_SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: "user", label: "Edit Profile" },
      { icon: "bell", label: "Notifications" },
      { icon: "lock", label: "Privacy" },
    ],
  },
  {
    title: "App",
    items: [
      { icon: "moon", label: "Appearance" },
      { icon: "globe", label: "Language" },
      { icon: "download", label: "Downloads" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: "help-circle", label: "Help Center" },
      { icon: "message-square", label: "Contact Us" },
      { icon: "file-text", label: "Terms of Service" },
    ],
  },
];

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<UserData | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const [userData, streakData] = await Promise.all([
          getUser(),
          getStreak(),
        ]);
        setUser(userData);
        setStreak(streakData);
      };
      loadData();
    }, [])
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleItemPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={styles.profileHeader}
        entering={FadeInDown.duration(400)}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <ThemedText type="h1" style={styles.avatarText}>
              {user?.name.charAt(0).toUpperCase() || "O"}
            </ThemedText>
          </View>
          <View style={styles.tierBadge}>
            <ThemedText type="caption" style={styles.tierText}>
              {user?.tier || "Operator"}
            </ThemedText>
          </View>
        </View>
        <ThemedText type="h2" style={styles.name}>
          {user?.name || "Operator"}
        </ThemedText>
        <ThemedText type="small" secondary>
          Member since {user ? formatDate(user.memberSince) : "---"}
        </ThemedText>
        <StreakBadge streak={streak?.current || 0} size="large" />
      </Animated.View>

      <Animated.View
        style={styles.statsRow}
        entering={FadeInDown.duration(400).delay(100)}
      >
        <View style={styles.statCard}>
          <ThemedText type="statSmall" style={styles.statValue}>
            {user?.xp.toLocaleString() || 0}
          </ThemedText>
          <ThemedText type="caption" secondary>
            Total XP
          </ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText type="statSmall" style={styles.statValue}>
            {streak?.totalDaysWon || 0}
          </ThemedText>
          <ThemedText type="caption" secondary>
            Days Won
          </ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText type="statSmall" style={styles.statValue}>
            {streak?.best || 0}
          </ThemedText>
          <ThemedText type="caption" secondary>
            Best Streak
          </ThemedText>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(200)}>
        <Pressable style={styles.subscriptionCard} onPress={handleItemPress}>
          <View style={styles.subscriptionIcon}>
            <Feather name="zap" size={24} color={Colors.light.warning} />
          </View>
          <View style={styles.subscriptionContent}>
            <ThemedText type="bodyBold">Operator Pro</ThemedText>
            <ThemedText type="small" secondary>
              Active subscription
            </ThemedText>
          </View>
          <Feather
            name="chevron-right"
            size={20}
            color={Colors.light.textSecondary}
          />
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(250)}>
        <Pressable
          style={styles.valuesButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate("CoreValues");
          }}
        >
          <View style={styles.valuesIcon}>
            <Feather name="book-open" size={20} color={Colors.light.accent} />
          </View>
          <ThemedText type="bodyBold" style={styles.valuesLabel}>
            Core Values
          </ThemedText>
          <Feather
            name="chevron-right"
            size={20}
            color={Colors.light.textSecondary}
          />
        </Pressable>
      </Animated.View>

      {SETTINGS_SECTIONS.map((section, sectionIndex) => (
        <Animated.View
          key={section.title}
          style={styles.settingsSection}
          entering={FadeInDown.duration(400).delay(300 + sectionIndex * 50)}
        >
          <ThemedText type="caption" secondary style={styles.sectionTitle}>
            {section.title.toUpperCase()}
          </ThemedText>
          <View style={styles.settingsCard}>
            {section.items.map((item, index) => (
              <Pressable
                key={item.label}
                style={[
                  styles.settingsItem,
                  index < section.items.length - 1 && styles.settingsItemBorder,
                ]}
                onPress={handleItemPress}
              >
                <View style={styles.settingsIconContainer}>
                  <Feather
                    name={item.icon as any}
                    size={18}
                    color={Colors.light.textSecondary}
                  />
                </View>
                <ThemedText type="body" style={styles.settingsLabel}>
                  {item.label}
                </ThemedText>
                <Feather
                  name="chevron-right"
                  size={18}
                  color={Colors.light.textSecondary}
                />
              </Pressable>
            ))}
          </View>
        </Animated.View>
      ))}

      <ThemedText type="caption" secondary style={styles.version}>
        The Operator Standard v1.0.0
      </ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundRoot,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.light.accent,
  },
  avatarText: {
    color: Colors.light.accent,
  },
  tierBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  tierText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  name: {
    marginTop: Spacing.sm,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.backgroundRoot,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statValue: {
    color: Colors.light.accent,
    marginBottom: Spacing.xs,
  },
  subscriptionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundRoot,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  subscriptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  subscriptionContent: {
    flex: 1,
  },
  valuesButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundRoot,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  valuesIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  valuesLabel: {
    flex: 1,
  },
  settingsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  settingsCard: {
    backgroundColor: Colors.light.backgroundRoot,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingsIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsLabel: {
    flex: 1,
  },
  version: {
    textAlign: "center",
    marginVertical: Spacing.xl,
  },
});

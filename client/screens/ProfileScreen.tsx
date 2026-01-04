import React, { useState, useCallback } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
      ]}
    >
      <View style={styles.profileHeader}>
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
      </View>

      <View style={styles.statsRow}>
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
      </View>

      <Pressable
        style={styles.subscriptionCard}
        onPress={() => {}}
      >
        <View style={styles.subscriptionIcon}>
          <Feather name="zap" size={24} color={Colors.dark.warning} />
        </View>
        <View style={styles.subscriptionContent}>
          <ThemedText type="bodyBold">Operator Pro</ThemedText>
          <ThemedText type="small" secondary>
            Active subscription
          </ThemedText>
        </View>
        <Feather name="chevron-right" size={20} color={Colors.dark.textSecondary} />
      </Pressable>

      <Pressable
        style={styles.valuesButton}
        onPress={() => navigation.navigate("CoreValues")}
      >
        <View style={styles.valuesIcon}>
          <Feather name="book-open" size={20} color={Colors.dark.accent} />
        </View>
        <ThemedText type="bodyBold">Core Values</ThemedText>
        <Feather name="chevron-right" size={20} color={Colors.dark.textSecondary} />
      </Pressable>

      {SETTINGS_SECTIONS.map((section) => (
        <View key={section.title} style={styles.settingsSection}>
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
              >
                <Feather
                  name={item.icon as any}
                  size={20}
                  color={Colors.dark.textSecondary}
                />
                <ThemedText type="body" style={styles.settingsLabel}>
                  {item.label}
                </ThemedText>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={Colors.dark.textSecondary}
                />
              </Pressable>
            ))}
          </View>
        </View>
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
    backgroundColor: Colors.dark.backgroundRoot,
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
    backgroundColor: Colors.dark.backgroundDefault,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.dark.accent,
  },
  avatarText: {
    color: Colors.dark.accent,
  },
  tierBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  tierText: {
    color: Colors.dark.text,
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
    backgroundColor: Colors.dark.backgroundDefault,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  statValue: {
    color: Colors.dark.accent,
    marginBottom: Spacing.xs,
  },
  subscriptionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.backgroundDefault,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  subscriptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  subscriptionContent: {
    flex: 1,
  },
  valuesButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.backgroundDefault,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  valuesIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  settingsCard: {
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  settingsLabel: {
    flex: 1,
  },
  version: {
    textAlign: "center",
    marginVertical: Spacing.xl,
  },
});

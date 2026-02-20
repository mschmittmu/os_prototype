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
import { StrikeBadge } from "@/components/StrikeBadge";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { getUser, getStreak, getStrikes, UserData, StreakData, Strike } from "@/lib/storage";

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
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<UserData | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [activeStrikeCount, setActiveStrikeCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const [userData, streakData, strikesData] = await Promise.all([
          getUser(),
          getStreak(),
          getStrikes(),
        ]);
        setUser(userData);
        setStreak(streakData);
        const active = strikesData
          .filter((s: Strike) => s.status === "active")
          .reduce((sum: number, s: Strike) => sum + s.strikeValue, 0);
        setActiveStrikeCount(active);
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
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
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
          <View style={[styles.avatar, { backgroundColor: theme.backgroundSecondary, borderColor: theme.accent }]}>
            <ThemedText type="h1" style={{ color: theme.accent }}>
              {user?.name.charAt(0).toUpperCase() || "O"}
            </ThemedText>
          </View>
          <View style={[styles.tierBadge, { backgroundColor: theme.accent }]}>
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
        <View style={styles.badgeRow}>
          <StreakBadge streak={streak?.current || 0} size="large" />
          <StrikeBadge activeStrikes={activeStrikeCount} showLabel />
        </View>
      </Animated.View>

      <Animated.View
        style={styles.statsRow}
        entering={FadeInDown.duration(400).delay(100)}
      >
        <View style={[styles.statCard, { backgroundColor: theme.backgroundRoot, borderColor: theme.border }]}>
          <ThemedText type="statSmall" style={{ color: theme.accent, marginBottom: Spacing.xs }}>
            {user?.xp.toLocaleString() || 0}
          </ThemedText>
          <ThemedText type="caption" secondary>
            Total XP
          </ThemedText>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.backgroundRoot, borderColor: theme.border }]}>
          <ThemedText type="statSmall" style={{ color: theme.accent, marginBottom: Spacing.xs }}>
            {streak?.totalDaysWon || 0}
          </ThemedText>
          <ThemedText type="caption" secondary>
            Days Won
          </ThemedText>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.backgroundRoot, borderColor: theme.border }]}>
          <ThemedText type="statSmall" style={{ color: theme.accent, marginBottom: Spacing.xs }}>
            {streak?.best || 0}
          </ThemedText>
          <ThemedText type="caption" secondary>
            Best Streak
          </ThemedText>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(200)}>
        <Pressable style={[styles.subscriptionCard, { backgroundColor: theme.backgroundRoot, borderColor: theme.border }]} onPress={handleItemPress}>
          <View style={[styles.subscriptionIcon, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name="zap" size={24} color={theme.warning} />
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
            color={theme.textSecondary}
          />
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(250)}>
        <Pressable
          style={[styles.valuesButton, { backgroundColor: theme.backgroundRoot, borderColor: theme.border }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate("ProofVault");
          }}
        >
          <View style={[styles.valuesIcon, { backgroundColor: "rgba(227, 24, 55, 0.12)" }]}>
            <Feather name="lock" size={20} color={theme.accent} />
          </View>
          <ThemedText type="bodyBold" style={styles.valuesLabel}>
            Proof Vault
          </ThemedText>
          <Feather
            name="chevron-right"
            size={20}
            color={theme.textSecondary}
          />
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(300)}>
        <Pressable
          style={[styles.valuesButton, { backgroundColor: theme.backgroundRoot, borderColor: theme.border }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate("CoreValues");
          }}
        >
          <View style={[styles.valuesIcon, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name="book-open" size={20} color={theme.accent} />
          </View>
          <ThemedText type="bodyBold" style={styles.valuesLabel}>
            Core Values
          </ThemedText>
          <Feather
            name="chevron-right"
            size={20}
            color={theme.textSecondary}
          />
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(350)}>
        <Pressable
          style={[styles.valuesButton, { backgroundColor: theme.backgroundRoot, borderColor: theme.border }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate("SavedPosts");
          }}
        >
          <View style={[styles.valuesIcon, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name="bookmark" size={20} color={theme.accent} />
          </View>
          <ThemedText type="bodyBold" style={styles.valuesLabel}>
            Saved Posts
          </ThemedText>
          <Feather
            name="chevron-right"
            size={20}
            color={theme.textSecondary}
          />
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(370)}>
        <Pressable
          style={[styles.valuesButton, { backgroundColor: theme.backgroundRoot, borderColor: theme.border }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate("BehaviorHistory");
          }}
        >
          <View style={[styles.valuesIcon, { backgroundColor: theme.navy + "15" }]}>
            <Feather name="clock" size={20} color={theme.navy} />
          </View>
          <ThemedText type="bodyBold" style={styles.valuesLabel}>
            Behavior History
          </ThemedText>
          <Feather
            name="chevron-right"
            size={20}
            color={theme.textSecondary}
          />
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(390)}>
        <Pressable
          style={[styles.valuesButton, { backgroundColor: theme.backgroundRoot, borderColor: theme.border }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate("StrikeHistory");
          }}
        >
          <View style={[styles.valuesIcon, { backgroundColor: theme.error + "15" }]}>
            <Feather name="shield-off" size={20} color={theme.error} />
          </View>
          <ThemedText type="bodyBold" style={styles.valuesLabel}>
            Strike History
          </ThemedText>
          <StrikeBadge activeStrikes={activeStrikeCount} />
          <Feather
            name="chevron-right"
            size={20}
            color={theme.textSecondary}
          />
        </Pressable>
      </Animated.View>

      {SETTINGS_SECTIONS.map((section, sectionIndex) => (
        <Animated.View
          key={section.title}
          style={styles.settingsSection}
          entering={FadeInDown.duration(400).delay(400 + sectionIndex * 50)}
        >
          <ThemedText type="caption" secondary style={styles.sectionTitle}>
            {section.title.toUpperCase()}
          </ThemedText>
          <View style={[styles.settingsCard, { backgroundColor: theme.backgroundRoot, borderColor: theme.border }]}>
            {section.items.map((item, index) => (
              <Pressable
                key={item.label}
                style={[
                  styles.settingsItem,
                  index < section.items.length - 1 && [styles.settingsItemBorder, { borderBottomColor: theme.border }],
                ]}
                onPress={handleItemPress}
              >
                <View style={[styles.settingsIconContainer, { backgroundColor: theme.backgroundSecondary }]}>
                  <Feather
                    name={item.icon as any}
                    size={18}
                    color={theme.textSecondary}
                  />
                </View>
                <ThemedText type="body" style={styles.settingsLabel}>
                  {item.label}
                </ThemedText>
                <Feather
                  name="chevron-right"
                  size={18}
                  color={theme.textSecondary}
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
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
  },
  tierBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
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
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    borderWidth: 1,
  },
  subscriptionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
  },
  subscriptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  subscriptionContent: {
    flex: 1,
  },
  valuesButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
    borderWidth: 1,
  },
  valuesIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
  },
  settingsIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
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

import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { GateResult, checkSocialGate } from "@/lib/gatingLogic";
import { EscalationTier, calculateEscalationTier } from "@/lib/strikeLogic";
import {
  getStreak,
  getStrikes,
  getDaysInApp,
  getDaysSinceLastActivity,
  isMorningBriefViewedToday,
  Strike,
} from "@/lib/storage";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SocialGateProps {
  children: React.ReactNode;
}

export function SocialGate({ children }: SocialGateProps) {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [gateResult, setGateResult] = useState<GateResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkGate = async () => {
      const [streakData, strikesData, daysInApp, daysInactive, briefViewed] =
        await Promise.all([
          getStreak(),
          getStrikes(),
          getDaysInApp(),
          getDaysSinceLastActivity(),
          isMorningBriefViewedToday(),
        ]);

      const activeStrikeValue = strikesData
        .filter((s: Strike) => s.status === "active")
        .reduce((sum: number, s: Strike) => sum + s.strikeValue, 0);
      const tier = calculateEscalationTier(activeStrikeValue);

      const result = checkSocialGate(
        streakData.current,
        daysInactive,
        tier,
        briefViewed,
        daysInApp
      );
      setGateResult(result);
      setLoading(false);
    };
    checkGate();
  }, []);

  if (loading) return null;
  if (!gateResult || !gateResult.gated) return <>{children}</>;

  if (gateResult.reason === "strike_lock") {
    return (
      <View style={[styles.lockContainer, { backgroundColor: theme.backgroundRoot }]}>
        <Animated.View style={styles.lockContent} entering={FadeInDown.duration(500)}>
          <View style={[styles.iconCircle, { backgroundColor: "#EF444420" }]}>
            <Feather name="shield-off" size={48} color="#EF4444" />
          </View>
          <ThemedText type="h2" style={styles.lockTitle}>
            ACCESS REVOKED
          </ThemedText>
          <ThemedText type="body" secondary style={styles.lockMessage}>
            6+ active strikes. Complete recovery protocol to restore community access.
          </ThemedText>
          <View style={[styles.counterBox, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText type="caption" secondary>
              ACTIVE STRIKES
            </ThemedText>
            <ThemedText type="h2" style={{ color: "#EF4444" }}>
              {gateResult.data.tier?.toUpperCase()} TIER
            </ThemedText>
          </View>
          <Pressable
            style={[styles.actionButton, { backgroundColor: "#EF4444" }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate("StrikeHistory");
            }}
          >
            <ThemedText type="bodyBold" style={styles.buttonText}>
              VIEW RECOVERY PLAN
            </ThemedText>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  if (gateResult.reason === "buyin_brief") {
    return (
      <View style={[styles.lockContainer, { backgroundColor: theme.backgroundRoot }]}>
        <Animated.View style={styles.lockContent} entering={FadeInDown.duration(500)}>
          <View style={[styles.iconCircle, { backgroundColor: theme.warning + "20" }]}>
            <Feather name="file-text" size={48} color={theme.warning} />
          </View>
          <ThemedText type="h2" style={styles.lockTitle}>
            BRIEF REQUIRED
          </ThemedText>
          <ThemedText type="body" secondary style={styles.lockMessage}>
            Complete your Morning Brief to access the feed today.
          </ThemedText>
          <Pressable
            style={[styles.actionButton, { backgroundColor: theme.warning }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate("MorningBrief");
            }}
          >
            <ThemedText type="bodyBold" style={styles.buttonText}>
              VIEW MORNING BRIEF
            </ThemedText>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  if (gateResult.reason === "new_user") {
    const streak = gateResult.data.streak || 0;
    const required = gateResult.data.required || 3;
    return (
      <View style={[styles.lockContainer, { backgroundColor: theme.backgroundRoot }]}>
        <Animated.View style={styles.lockContent} entering={FadeInDown.duration(500)}>
          <View style={[styles.iconCircle, { backgroundColor: theme.accent + "20" }]}>
            <Feather name="lock" size={48} color={theme.accent} />
          </View>
          <ThemedText type="h2" style={styles.lockTitle}>
            EARN YOUR ACCESS
          </ThemedText>
          <ThemedText type="body" secondary style={styles.lockMessage}>
            Complete {required} consecutive wins to unlock the community feed.
          </ThemedText>
          <View style={styles.progressRow}>
            {Array.from({ length: required }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor:
                      i < streak ? theme.success : theme.backgroundTertiary,
                    borderColor:
                      i < streak ? theme.success : theme.border,
                  },
                ]}
              >
                {i < streak ? (
                  <Feather name="check" size={14} color="#FFFFFF" />
                ) : null}
              </View>
            ))}
          </View>
          <ThemedText type="caption" secondary style={styles.streakLabel}>
            Current streak: {streak}/{required}
          </ThemedText>
          <Pressable
            style={[styles.actionButton, { backgroundColor: theme.accent }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate("Main", { screen: "Execution" } as any);
            }}
          >
            <ThemedText type="bodyBold" style={styles.buttonText}>
              GO TO POWER LIST
            </ThemedText>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  if (gateResult.reason === "inactive") {
    const daysInactive = gateResult.data.daysInactive || 0;
    return (
      <View style={[styles.lockContainer, { backgroundColor: theme.backgroundRoot }]}>
        <Animated.View style={styles.lockContent} entering={FadeInDown.duration(500)}>
          <View style={[styles.iconCircle, { backgroundColor: theme.textSecondary + "20" }]}>
            <Feather name="moon" size={48} color={theme.textSecondary} />
          </View>
          <ThemedText type="h2" style={styles.lockTitle}>
            YOU'VE GONE SILENT
          </ThemedText>
          <ThemedText type="body" secondary style={styles.lockMessage}>
            No activity logged for {daysInactive} days. Log a day to restore access.
          </ThemedText>
          <View style={[styles.counterBox, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText type="caption" secondary>
              DAYS INACTIVE
            </ThemedText>
            <ThemedText type="h2" style={{ color: theme.textSecondary }}>
              {daysInactive}
            </ThemedText>
          </View>
          <Pressable
            style={[styles.actionButton, { backgroundColor: theme.accent }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate("Main", { screen: "Execution" } as any);
            }}
          >
            <ThemedText type="bodyBold" style={styles.buttonText}>
              COMPLETE TODAY'S LIST
            </ThemedText>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  lockContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
  },
  lockContent: {
    alignItems: "center",
    maxWidth: 320,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  lockTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  lockMessage: {
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  counterBox: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing["2xl"],
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    marginBottom: Spacing.xl,
    minWidth: 160,
  },
  progressRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  streakLabel: {
    marginBottom: Spacing.xl,
  },
  actionButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing["2xl"],
    borderRadius: BorderRadius.lg,
    minWidth: 220,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    letterSpacing: 1,
  },
});

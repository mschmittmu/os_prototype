import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getStrikes, clearStrike, Strike } from "@/lib/storage";
import {
  calculateEscalationTier,
  getTierConfig,
  getStrikeReasonDisplay,
  EscalationTier,
} from "@/lib/strikeLogic";

const TIER_THRESHOLDS: { tier: EscalationTier; range: string }[] = [
  { tier: "green", range: "0-1" },
  { tier: "yellow", range: "2-3" },
  { tier: "orange", range: "4-5" },
  { tier: "red", range: "6+" },
];

export default function StrikeHistoryScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [strikes, setStrikes] = useState<Strike[]>([]);

  const loadStrikes = useCallback(async () => {
    const data = await getStrikes();
    setStrikes(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStrikes();
    }, [loadStrikes])
  );

  const activeStrikes = strikes.filter((s) => s.status === "active");
  const historicalStrikes = strikes.filter((s) => s.status === "cleared");
  const activeCount = activeStrikes.reduce((sum, s) => sum + s.strikeValue, 0);
  const tier = calculateEscalationTier(activeCount);
  const tierConfig = getTierConfig(tier);

  const handleClear = async (strikeId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await clearStrike(strikeId);
    await loadStrikes();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: Spacing.xl, paddingBottom: insets.bottom + Spacing["3xl"] },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={[styles.statusHeader, { backgroundColor: theme.backgroundSecondary }]}
      >
        <ThemedText style={[styles.activeCount, { color: tierConfig.color }]}>
          {activeCount}
        </ThemedText>
        <ThemedText type="small" secondary>
          Active Strikes
        </ThemedText>
        <View style={[styles.tierPill, { backgroundColor: tierConfig.color + "20" }]}>
          <ThemedText style={[styles.tierLabel, { color: tierConfig.color }]}>
            {tierConfig.label}
          </ThemedText>
        </View>
        <ThemedText type="small" secondary style={styles.tierDesc}>
          {tierConfig.description}
        </ThemedText>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(400).delay(100)}
        style={styles.sectionSpacing}
      >
        <ThemedText type="caption" secondary style={styles.sectionTitle}>
          ESCALATION TIERS
        </ThemedText>
        <View style={[styles.tierBar, { backgroundColor: theme.backgroundSecondary }]}>
          {TIER_THRESHOLDS.map((t) => {
            const cfg = getTierConfig(t.tier);
            const isActive = t.tier === tier;
            return (
              <View
                key={t.tier}
                style={[
                  styles.tierSegment,
                  {
                    backgroundColor: isActive ? cfg.color : cfg.color + "15",
                    borderColor: isActive ? cfg.color : "transparent",
                    borderWidth: isActive ? 2 : 0,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.tierSegLabel,
                    { color: isActive ? "#FFFFFF" : cfg.color },
                  ]}
                >
                  {cfg.label}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.tierSegRange,
                    { color: isActive ? "rgba(255,255,255,0.7)" : theme.textSecondary },
                  ]}
                >
                  {t.range}
                </ThemedText>
              </View>
            );
          })}
        </View>
      </Animated.View>

      {activeStrikes.length > 0 ? (
        <Animated.View
          entering={FadeInDown.duration(400).delay(200)}
          style={styles.sectionSpacing}
        >
          <ThemedText type="caption" secondary style={styles.sectionTitle}>
            ACTIVE STRIKES
          </ThemedText>
          {activeStrikes.map((strike) => {
            const display = getStrikeReasonDisplay(strike.reason);
            return (
              <View
                key={strike.id}
                style={[
                  styles.strikeCard,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={styles.strikeRow}>
                  <View style={[styles.strikeIcon, { backgroundColor: theme.error + "15" }]}>
                    <Feather name={display.icon as any} size={16} color={theme.error} />
                  </View>
                  <View style={styles.strikeInfo}>
                    <ThemedText type="bodyBold">{display.label}</ThemedText>
                    <View style={styles.strikeMeta}>
                      <View style={[styles.severityBadge, { backgroundColor: theme.backgroundTertiary }]}>
                        <ThemedText type="caption" secondary>
                          {strike.severity}
                        </ThemedText>
                      </View>
                      <ThemedText type="small" secondary>
                        {strike.date}
                      </ThemedText>
                    </View>
                  </View>
                  <Pressable
                    style={[styles.clearBtn, { backgroundColor: theme.success + "15" }]}
                    onPress={() => handleClear(strike.id)}
                  >
                    <ThemedText style={[styles.clearText, { color: theme.success }]}>
                      CLEAR
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </Animated.View>
      ) : null}

      <Animated.View
        entering={FadeInDown.duration(400).delay(300)}
        style={styles.sectionSpacing}
      >
        <View style={styles.historyHeader}>
          <ThemedText type="caption" secondary style={styles.sectionTitle}>
            STRIKE HISTORY
          </ThemedText>
          <ThemedText type="small" secondary>
            Total strikes all time: {strikes.length}
          </ThemedText>
        </View>
        {historicalStrikes.length > 0 ? (
          historicalStrikes.map((strike) => {
            const display = getStrikeReasonDisplay(strike.reason);
            return (
              <View
                key={strike.id}
                style={[
                  styles.historyCard,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={styles.strikeRow}>
                  <View style={[styles.strikeIcon, { backgroundColor: theme.backgroundTertiary }]}>
                    <Feather name={display.icon as any} size={14} color={theme.textSecondary} />
                  </View>
                  <View style={styles.strikeInfo}>
                    <ThemedText type="body">{display.label}</ThemedText>
                    <View style={styles.strikeMeta}>
                      <ThemedText type="small" secondary>
                        {strike.severity}
                      </ThemedText>
                      <ThemedText type="small" secondary>
                        {strike.date}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.clearedInfo}>
                    <ThemedText type="small" style={{ color: theme.success }}>
                      Cleared
                    </ThemedText>
                    <ThemedText type="caption" secondary>
                      {strike.clearMethod || "Recovery"}
                    </ThemedText>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={[styles.emptyCard, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText type="small" secondary>
              No cleared strikes yet.
            </ThemedText>
          </View>
        )}
      </Animated.View>
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
  statusHeader: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: "center",
  },
  activeCount: {
    fontSize: 64,
    fontWeight: "900",
    lineHeight: 70,
  },
  tierPill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
  },
  tierLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },
  tierDesc: {
    marginTop: Spacing.xs,
  },
  sectionSpacing: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
    letterSpacing: 1.5,
  },
  tierBar: {
    flexDirection: "row",
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    gap: 2,
    padding: 2,
  },
  tierSegment: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  tierSegLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  tierSegRange: {
    fontSize: 9,
    fontWeight: "600",
    marginTop: 2,
  },
  strikeCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  strikeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  strikeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  strikeInfo: {
    flex: 1,
  },
  strikeMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: 2,
  },
  severityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  clearBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  clearText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  historyCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  clearedInfo: {
    alignItems: "flex-end",
  },
  emptyCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
  },
});

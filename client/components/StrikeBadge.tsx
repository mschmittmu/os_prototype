import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  calculateEscalationTier,
  getTierConfig,
} from "@/lib/strikeLogic";

interface StrikeBadgeProps {
  activeStrikes: number;
  showLabel?: boolean;
}

export function StrikeBadge({ activeStrikes, showLabel }: StrikeBadgeProps) {
  const tier = calculateEscalationTier(activeStrikes);
  const config = getTierConfig(tier);

  if (activeStrikes === 0 && !showLabel) return null;

  return (
    <View style={[styles.container, { backgroundColor: config.color + "20" }]}>
      <Feather name="shield" size={14} color={config.color} />
      <ThemedText style={[styles.count, { color: config.color }]}>
        {activeStrikes}
      </ThemedText>
      {showLabel ? (
        <ThemedText style={[styles.label, { color: config.color }]}>
          {config.label}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  count: {
    fontSize: 13,
    fontWeight: "800",
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
});

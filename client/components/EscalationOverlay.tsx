import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Spacing, BorderRadius } from "@/constants/theme";
import { EscalationTier, getTierConfig } from "@/lib/strikeLogic";

interface EscalationOverlayProps {
  tier: EscalationTier;
}

export function EscalationOverlay({ tier }: EscalationOverlayProps) {
  if (tier !== "orange" && tier !== "red") return null;

  const config = getTierConfig(tier);

  if (tier === "red") {
    return (
      <View style={styles.fullLock}>
        <View style={[styles.lockIconWrap, { backgroundColor: config.color + "20" }]}>
          <Feather name="lock" size={48} color={config.color} />
        </View>
        <ThemedText style={[styles.lockTitle, { color: config.color }]}>
          CRITICAL INTERVENTION
        </ThemedText>
        <ThemedText style={styles.lockBody}>
          Feed locked. Recovery required.
        </ThemedText>
        <View style={[styles.actionCard, { borderColor: config.color + "40" }]}>
          <Feather name="arrow-right" size={16} color={config.color} />
          <ThemedText style={styles.actionText}>
            Complete all daily tasks and Night Reflection to begin strike recovery.
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.restrictedOverlay} pointerEvents="none">
      <View style={[styles.restrictedBanner, { backgroundColor: config.color + "E6" }]}>
        <Feather name="alert-triangle" size={18} color="#FFFFFF" />
        <View style={styles.restrictedTextWrap}>
          <ThemedText style={styles.restrictedTitle}>
            RESTRICTED MODE
          </ThemedText>
          <ThemedText style={styles.restrictedSub}>
            Complete recovery protocol to restore access
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullLock: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing["3xl"],
    zIndex: 100,
  },
  lockIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  lockTitle: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 3,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  lockBody: {
    fontSize: 15,
    fontWeight: "500",
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: Spacing["2xl"],
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  actionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: "#D1D5DB",
  },
  restrictedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  restrictedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  restrictedTextWrap: {
    flex: 1,
  },
  restrictedTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  restrictedSub: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
});

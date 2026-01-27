import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface ArcaneDirectiveProps {
  message: string;
  focusArea: string;
  severity: "critical" | "warning" | "observation";
}

export function ArcaneDirective({
  message,
  focusArea,
  severity,
}: ArcaneDirectiveProps) {
  const { theme } = useTheme();

  const severityColor =
    severity === "critical"
      ? "#EF4444"
      : severity === "warning"
      ? "#F59E0B"
      : theme.accent;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundSecondary,
          borderLeftColor: severityColor,
        },
      ]}
    >
      <View style={styles.header}>
        <Feather name="zap" size={16} color={theme.accent} />
        <ThemedText type="caption" style={styles.headerText}>
          ARCANE ASSESSMENT
        </ThemedText>
      </View>
      <ThemedText type="body" style={styles.message}>
        "{message}"
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  headerText: {
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  message: {
    fontStyle: "italic",
    lineHeight: 24,
  },
});

import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface ArcaneDirectiveProps {
  message: string;
  focusArea: string;
  severity: "critical" | "warning" | "observation";
  onFocusPress?: () => void;
}

export function ArcaneDirective({
  message,
  focusArea,
  severity,
  onFocusPress,
}: ArcaneDirectiveProps) {
  const { theme } = useTheme();

  const severityColor =
    severity === "critical"
      ? "#EF4444"
      : severity === "warning"
      ? "#F59E0B"
      : theme.accent;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onFocusPress?.();
  };

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
      {onFocusPress && (
        <Pressable onPress={handlePress} style={styles.focusButton}>
          <ThemedText type="small" style={{ color: theme.accent }}>
            FOCUS NOW
          </ThemedText>
          <Feather name="arrow-right" size={14} color={theme.accent} />
        </Pressable>
      )}
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
  focusButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
});

import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { OperatorAttribute } from "@/lib/mockData";

interface OperatorAttributesProps {
  attributes: OperatorAttribute[];
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#F59E0B";
  if (score >= 40) return "#F97316";
  return "#EF4444";
};

function AttributeRow({
  attribute,
  index,
}: {
  attribute: OperatorAttribute;
  index: number;
}) {
  const { theme } = useTheme();
  const scoreColor = getScoreColor(attribute.score);
  const trendValue = parseInt(attribute.trend, 10);
  const trendColor =
    trendValue > 0
      ? "#10B981"
      : trendValue < 0
      ? "#EF4444"
      : theme.textSecondary;

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 50)}
      style={styles.attributeRow}
    >
      <View style={styles.attributeHeader}>
        <ThemedText type="small" style={styles.attributeName}>
          {attribute.name}
        </ThemedText>
        <View style={styles.scoreContainer}>
          <ThemedText style={[styles.scoreNumber, { color: scoreColor }]}>
            {attribute.score}
          </ThemedText>
          {trendValue !== 0 && (
            <ThemedText type="caption" style={{ color: trendColor }}>
              {attribute.trend}
            </ThemedText>
          )}
        </View>
      </View>
      <View style={[styles.progressBar, { backgroundColor: theme.backgroundTertiary }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${attribute.score}%`,
              backgroundColor: scoreColor,
            },
          ]}
        />
      </View>
    </Animated.View>
  );
}

export function OperatorAttributes({ attributes }: OperatorAttributesProps) {
  const { theme } = useTheme();

  const sortedAttributes = [...attributes].sort((a, b) => b.score - a.score);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}>
      <ThemedText type="h4" style={styles.header}>
        OPERATOR ATTRIBUTES
      </ThemedText>
      {sortedAttributes.map((attr, index) => (
        <AttributeRow key={attr.name} attribute={attr} index={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  header: {
    letterSpacing: 2,
    marginBottom: Spacing.lg,
  },
  attributeRow: {
    marginBottom: Spacing.lg,
  },
  attributeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  attributeName: {
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  scoreNumber: {
    fontSize: 18,
    fontWeight: "700",
  },
  progressBar: {
    height: 8,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
});

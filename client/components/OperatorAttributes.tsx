import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";
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

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function AttributeGauge({
  attribute,
  index,
}: {
  attribute: OperatorAttribute;
  index: number;
}) {
  const { theme } = useTheme();
  
  const size = 70;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 26;
  const strokeWidth = 5;
  const startAngle = -135;
  const endAngle = 135;
  const angleRange = endAngle - startAngle;
  
  const targetAngle = startAngle + (attribute.score / 100) * angleRange;
  const needleEnd = polarToCartesian(cx, cy, radius - strokeWidth - 2, targetAngle);

  const scoreColor = getScoreColor(attribute.score);
  const trendValue = parseInt(attribute.trend, 10);
  const trendColor =
    trendValue > 0 ? "#10B981" : trendValue < 0 ? "#EF4444" : theme.textSecondary;

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 50)}
      style={[styles.attributeRow, { backgroundColor: theme.backgroundTertiary }]}
    >
      <View style={styles.gaugeWrapper}>
        <Svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.7}`}>
          <Path
            d={describeArc(cx, cy, radius, startAngle, endAngle)}
            stroke={theme.backgroundSecondary}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          
          <Path
            d={describeArc(cx, cy, radius, startAngle, startAngle + (attribute.score / 100) * angleRange)}
            stroke={scoreColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          
          <Line
            x1={cx}
            y1={cy}
            x2={needleEnd.x}
            y2={needleEnd.y}
            stroke={scoreColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <Circle cx={cx} cy={cy} r={3} fill={scoreColor} />
        </Svg>
      </View>
      
      <View style={styles.textContainer}>
        <ThemedText type="small" style={styles.attributeName} numberOfLines={1}>
          {attribute.name}
        </ThemedText>
        <View style={styles.scoreRow}>
          <ThemedText style={[styles.scoreNumber, { color: scoreColor }]}>
            {attribute.score}
          </ThemedText>
          {trendValue !== 0 && (
            <ThemedText type="small" style={{ color: trendColor }}>
              {attribute.trend}
            </ThemedText>
          )}
        </View>
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
      <View style={styles.attributeGrid}>
        {sortedAttributes.map((attr, index) => (
          <AttributeGauge key={attr.name} attribute={attr} index={index} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  header: {
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  attributeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  attributeRow: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  gaugeWrapper: {
    marginRight: Spacing.xs,
  },
  textContainer: {
    flex: 1,
  },
  attributeName: {
    letterSpacing: 0.3,
    textTransform: "uppercase",
    fontWeight: "600",
    fontSize: 8,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  scoreNumber: {
    fontSize: 22,
    fontWeight: "700",
  },
});

import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";

interface LifeScoreRingProps {
  score: number;
  trend: string;
  trendDirection: "up" | "down" | "neutral";
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

export function LifeScoreRing({
  score,
  trend,
  trendDirection,
}: LifeScoreRingProps) {
  const { theme } = useTheme();
  
  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 45;
  const strokeWidth = 8;
  const startAngle = -135;
  const endAngle = 135;
  const angleRange = endAngle - startAngle;
  
  const targetAngle = startAngle + (score / 100) * angleRange;
  const needleEnd = polarToCartesian(cx, cy, radius - strokeWidth - 3, targetAngle);

  const scoreColor = getScoreColor(score);
  const trendColor =
    trendDirection === "up"
      ? "#10B981"
      : trendDirection === "down"
      ? "#EF4444"
      : theme.textSecondary;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}>
      <View style={styles.gaugeWrapper}>
        <Svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size * 0.75}`}>
          <Path
            d={describeArc(cx, cy, radius, startAngle, endAngle)}
            stroke={theme.backgroundTertiary}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          
          <Path
            d={describeArc(cx, cy, radius, startAngle, startAngle + (score / 100) * angleRange)}
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
            strokeWidth={3}
            strokeLinecap="round"
          />
          <Circle cx={cx} cy={cy} r={5} fill={scoreColor} />
        </Svg>
      </View>
      
      <View style={styles.textContainer}>
        <ThemedText type="caption" style={styles.label}>
          LIFE SCORE
        </ThemedText>
        <ThemedText style={[styles.scoreNumber, { color: scoreColor }]}>
          {score}
        </ThemedText>
        <View style={styles.trendRow}>
          <Feather
            name={trendDirection === "up" ? "trending-up" : trendDirection === "down" ? "trending-down" : "minus"}
            size={16}
            color={trendColor}
          />
          <ThemedText type="body" style={{ color: trendColor }}>
            {trend} this week
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  gaugeWrapper: {
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 4,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: "800",
    lineHeight: 52,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: 4,
  },
});

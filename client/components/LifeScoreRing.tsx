import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Circle, G, Line, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";

const AnimatedG = Animated.createAnimatedComponent(G);

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
  const needleRotation = useSharedValue(-135);
  
  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 45;
  const strokeWidth = 8;
  const startAngle = -135;
  const endAngle = 135;
  const angleRange = endAngle - startAngle;

  useEffect(() => {
    const targetAngle = startAngle + (score / 100) * angleRange;
    needleRotation.value = withTiming(targetAngle, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });
  }, [score]);

  const animatedNeedleProps = useAnimatedProps(() => ({
    transform: [{ rotate: `${needleRotation.value}deg` }],
  }));

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
          <Defs>
            <LinearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#EF4444" />
              <Stop offset="40%" stopColor="#F59E0B" />
              <Stop offset="70%" stopColor="#10B981" />
              <Stop offset="100%" stopColor="#10B981" />
            </LinearGradient>
          </Defs>
          
          <Path
            d={describeArc(cx, cy, radius, startAngle, endAngle)}
            stroke={theme.backgroundTertiary}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          
          <Path
            d={describeArc(cx, cy, radius, startAngle, startAngle + (score / 100) * angleRange)}
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          
          <AnimatedG origin={`${cx}, ${cy}`} animatedProps={animatedNeedleProps}>
            <Line
              x1={cx}
              y1={cy}
              x2={cx}
              y2={cy - radius + strokeWidth + 5}
              stroke={scoreColor}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <Circle cx={cx} cy={cy} r={5} fill={scoreColor} />
          </AnimatedG>
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

import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Circle, G, Line, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  FadeInDown,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { OperatorAttribute } from "@/lib/mockData";

const AnimatedG = Animated.createAnimatedComponent(G);

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

function MiniGauge({
  attribute,
  index,
}: {
  attribute: OperatorAttribute;
  index: number;
}) {
  const { theme } = useTheme();
  const needleRotation = useSharedValue(-135);
  
  const size = 80;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 30;
  const strokeWidth = 5;
  const startAngle = -135;
  const endAngle = 135;
  const angleRange = endAngle - startAngle;

  useEffect(() => {
    const targetAngle = startAngle + (attribute.score / 100) * angleRange;
    needleRotation.value = withTiming(targetAngle, {
      duration: 1200 + index * 100,
      easing: Easing.out(Easing.cubic),
    });
  }, [attribute.score, index]);

  const animatedNeedleProps = useAnimatedProps(() => ({
    transform: [{ rotate: `${needleRotation.value}deg` }],
  }));

  const scoreColor = getScoreColor(attribute.score);
  const trendValue = parseInt(attribute.trend, 10);
  const trendColor =
    trendValue > 0 ? "#10B981" : trendValue < 0 ? "#EF4444" : theme.textSecondary;

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 50)}
      style={[styles.gaugeCard, { backgroundColor: theme.backgroundTertiary }]}
    >
      <Svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.65}`}>
        <Defs>
          <LinearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#EF4444" />
            <Stop offset="40%" stopColor="#F59E0B" />
            <Stop offset="70%" stopColor="#10B981" />
            <Stop offset="100%" stopColor="#10B981" />
          </LinearGradient>
        </Defs>
        
        <Path
          d={describeArc(cx, cy, radius, startAngle, endAngle)}
          stroke={theme.backgroundSecondary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        
        <Path
          d={describeArc(cx, cy, radius, startAngle, startAngle + (attribute.score / 100) * angleRange)}
          stroke={`url(#gradient-${index})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        
        <AnimatedG origin={`${cx}, ${cy}`} animatedProps={animatedNeedleProps}>
          <Line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - radius + strokeWidth + 2}
            stroke={scoreColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <Circle cx={cx} cy={cy} r={3} fill={scoreColor} />
        </AnimatedG>
      </Svg>
      
      <View style={styles.gaugeInfo}>
        <ThemedText style={[styles.scoreNumber, { color: scoreColor }]}>
          {attribute.score}
        </ThemedText>
        {trendValue !== 0 && (
          <ThemedText type="caption" style={{ color: trendColor, fontSize: 10 }}>
            {attribute.trend}
          </ThemedText>
        )}
      </View>
      
      <ThemedText type="caption" style={[styles.attributeName, { color: theme.textSecondary }]}>
        {attribute.name}
      </ThemedText>
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
      <View style={styles.gaugeGrid}>
        {sortedAttributes.map((attr, index) => (
          <MiniGauge key={attr.name} attribute={attr} index={index} />
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
  gaugeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  gaugeCard: {
    width: "48%",
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: "center",
  },
  gaugeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  scoreNumber: {
    fontSize: 18,
    fontWeight: "700",
  },
  attributeName: {
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 2,
  },
});

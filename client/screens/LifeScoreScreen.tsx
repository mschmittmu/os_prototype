import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Svg, { Path, Circle, Line } from "react-native-svg";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import {
  hudData,
  lifeScoreHistory,
  domainInsights,
  scoreBreakdown,
} from "@/lib/mockData";

const getScoreColor = (score: number) => {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#F59E0B";
  if (score >= 40) return "#F97316";
  return "#EF4444";
};

const getScoreTier = (score: number) => {
  if (score >= 80) return "DOMINANT";
  if (score >= 60) return "ADVANCING";
  if (score >= 40) return "STRUGGLING";
  return "CRITICAL";
};

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export default function LifeScoreScreen() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const score = hudData.lifeScore.current;
  const scoreColor = getScoreColor(score);
  const tier = getScoreTier(score);

  const sortedAttributes = [...hudData.attributes].sort(
    (a, b) => a.score - b.score
  );
  const weakestDomain = sortedAttributes[0];

  const gaugeSize = 180;
  const gaugeCx = gaugeSize / 2;
  const gaugeCy = gaugeSize / 2;
  const gaugeRadius = 70;
  const gaugeStroke = 12;
  const startAngle = -135;
  const endAngle = 135;
  const angleRange = endAngle - startAngle;
  const targetAngle = startAngle + (score / 100) * angleRange;
  const needleEnd = polarToCartesian(
    gaugeCx,
    gaugeCy,
    gaugeRadius - gaugeStroke - 4,
    targetAngle
  );

  const chartWidth = 320;
  const chartHeight = 120;
  const chartPadding = 24;
  const dataPoints = lifeScoreHistory;
  const minScore = Math.min(...dataPoints) - 5;
  const maxScore = Math.max(...dataPoints) + 5;
  const xStep = (chartWidth - chartPadding * 2) / (dataPoints.length - 1);

  const getChartY = (val: number) => {
    const ratio = (val - minScore) / (maxScore - minScore);
    return chartHeight - chartPadding - ratio * (chartHeight - chartPadding * 2);
  };

  const linePath = dataPoints
    .map((val, i) => {
      const x = chartPadding + i * xStep;
      const y = getChartY(val);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: Spacing.xl,
          paddingBottom: insets.bottom + Spacing["3xl"],
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={[
          styles.scoreHeader,
          { backgroundColor: theme.backgroundSecondary },
        ]}
      >
        <View style={styles.gaugeContainer}>
          <Svg
            width={gaugeSize}
            height={gaugeSize * 0.65}
            viewBox={`0 0 ${gaugeSize} ${gaugeSize * 0.7}`}
          >
            <Path
              d={describeArc(
                gaugeCx,
                gaugeCy,
                gaugeRadius,
                startAngle,
                endAngle
              )}
              stroke={theme.backgroundTertiary}
              strokeWidth={gaugeStroke}
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d={describeArc(
                gaugeCx,
                gaugeCy,
                gaugeRadius,
                startAngle,
                startAngle + (score / 100) * angleRange
              )}
              stroke={scoreColor}
              strokeWidth={gaugeStroke}
              fill="none"
              strokeLinecap="round"
            />
            <Line
              x1={gaugeCx}
              y1={gaugeCy}
              x2={needleEnd.x}
              y2={needleEnd.y}
              stroke={scoreColor}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <Circle cx={gaugeCx} cy={gaugeCy} r={6} fill={scoreColor} />
          </Svg>
        </View>

        <ThemedText style={[styles.bigScore, { color: scoreColor }]}>
          {score}
        </ThemedText>
        <ThemedText
          style={[styles.trendText, { color: theme.textSecondary }]}
        >
          +2 this week  /  +8 this month
        </ThemedText>
        <View
          style={[styles.tierBadge, { backgroundColor: scoreColor + "20" }]}
        >
          <ThemedText style={[styles.tierText, { color: scoreColor }]}>
            {tier}
          </ThemedText>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(400).delay(100)}
        style={styles.sectionSpacing}
      >
        <ThemedText
          type="caption"
          secondary
          style={styles.sectionTitle}
        >
          COMPOSITE BREAKDOWN
        </ThemedText>
        <View
          style={[
            styles.breakdownCard,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabel}>
              <View
                style={[
                  styles.breakdownDot,
                  { backgroundColor: theme.accent },
                ]}
              />
              <ThemedText type="body">Weighted Domain Avg</ThemedText>
            </View>
            <View style={styles.breakdownValues}>
              <ThemedText type="bodyBold">
                {scoreBreakdown.weightedAvg}
              </ThemedText>
              <ThemedText
                type="small"
                secondary
                style={styles.breakdownWeight}
              >
                70%
              </ThemedText>
            </View>
          </View>
          <View
            style={[styles.divider, { backgroundColor: theme.border }]}
          />
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabel}>
              <View
                style={[
                  styles.breakdownDot,
                  { backgroundColor: theme.success },
                ]}
              />
              <ThemedText type="body">Consistency Bonus</ThemedText>
            </View>
            <View style={styles.breakdownValues}>
              <ThemedText
                type="bodyBold"
                style={{ color: theme.success }}
              >
                +{scoreBreakdown.consistencyBonus}
              </ThemedText>
              <ThemedText
                type="small"
                secondary
                style={styles.breakdownWeight}
              >
                15%
              </ThemedText>
            </View>
          </View>
          <View
            style={[styles.divider, { backgroundColor: theme.border }]}
          />
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabel}>
              <View
                style={[
                  styles.breakdownDot,
                  { backgroundColor: "#3B82F6" },
                ]}
              />
              <ThemedText type="body">Trend Bonus</ThemedText>
            </View>
            <View style={styles.breakdownValues}>
              <ThemedText type="bodyBold" style={{ color: "#3B82F6" }}>
                +{scoreBreakdown.trendBonus}
              </ThemedText>
              <ThemedText
                type="small"
                secondary
                style={styles.breakdownWeight}
              >
                15%
              </ThemedText>
            </View>
          </View>
          <View
            style={[styles.divider, { backgroundColor: theme.border }]}
          />
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabel}>
              <View
                style={[
                  styles.breakdownDot,
                  { backgroundColor: theme.error },
                ]}
              />
              <ThemedText type="body">Weakness Penalty</ThemedText>
            </View>
            <View style={styles.breakdownValues}>
              <ThemedText type="bodyBold" style={{ color: theme.error }}>
                -{scoreBreakdown.weaknessPenalty}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.error }}>
                {scoreBreakdown.penaltyDomain}
              </ThemedText>
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(400).delay(200)}
        style={styles.sectionSpacing}
      >
        <ThemedText
          type="caption"
          secondary
          style={styles.sectionTitle}
        >
          DOMAIN SCORES
        </ThemedText>
        <View style={styles.domainGrid}>
          {sortedAttributes.map((attr, index) => {
            const isWeakest = index === 0;
            const attrColor = getScoreColor(attr.score);
            const trendVal = parseInt(attr.trend);
            const trendUp = trendVal > 0;
            const trendDown = trendVal < 0;

            return (
              <View
                key={attr.name}
                style={[
                  styles.domainCard,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    borderColor: isWeakest
                      ? theme.error
                      : theme.border,
                    borderWidth: isWeakest ? 2 : 1,
                  },
                ]}
              >
                {isWeakest ? (
                  <View
                    style={[
                      styles.weakestBadge,
                      { backgroundColor: theme.error + "20" },
                    ]}
                  >
                    <ThemedText
                      style={[styles.weakestText, { color: theme.error }]}
                    >
                      WEAKEST LINK
                    </ThemedText>
                  </View>
                ) : null}
                <ThemedText
                  type="small"
                  secondary
                  style={styles.domainName}
                >
                  {attr.name}
                </ThemedText>
                <View style={styles.domainScoreRow}>
                  <ThemedText
                    style={[styles.domainScore, { color: attrColor }]}
                  >
                    {attr.score}
                  </ThemedText>
                  <View style={styles.domainTrend}>
                    <Feather
                      name={
                        trendUp
                          ? "arrow-up"
                          : trendDown
                            ? "arrow-down"
                            : "minus"
                      }
                      size={12}
                      color={
                        trendUp
                          ? theme.success
                          : trendDown
                            ? theme.error
                            : theme.textSecondary
                      }
                    />
                    <ThemedText
                      type="small"
                      style={{
                        color: trendUp
                          ? theme.success
                          : trendDown
                            ? theme.error
                            : theme.textSecondary,
                      }}
                    >
                      {attr.trend}
                    </ThemedText>
                  </View>
                </View>
                <View
                  style={[
                    styles.progressBarBg,
                    { backgroundColor: theme.backgroundTertiary },
                  ]}
                >
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        backgroundColor: attrColor,
                        width: `${attr.score}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(400).delay(300)}
        style={styles.sectionSpacing}
      >
        <ThemedText
          type="caption"
          secondary
          style={styles.sectionTitle}
        >
          7-DAY TREND
        </ThemedText>
        <View
          style={[
            styles.chartCard,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <Svg width={chartWidth} height={chartHeight}>
            <Path
              d={linePath}
              stroke={theme.accent}
              strokeWidth={2}
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {dataPoints.map((val, i) => (
              <Circle
                key={i}
                cx={chartPadding + i * xStep}
                cy={getChartY(val)}
                r={4}
                fill={theme.accent}
                stroke={theme.backgroundSecondary}
                strokeWidth={2}
              />
            ))}
          </Svg>
          <View
            style={[
              styles.chartLabels,
              { paddingHorizontal: chartPadding },
            ]}
          >
            {DAY_LABELS.map((label, i) => (
              <ThemedText key={i} type="small" secondary>
                {label}
              </ThemedText>
            ))}
          </View>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(400).delay(400)}
        style={styles.sectionSpacing}
      >
        <ThemedText
          type="caption"
          secondary
          style={styles.sectionTitle}
        >
          ARCANE ANALYSIS
        </ThemedText>
        {domainInsights.map((insight, index) => (
          <View
            key={index}
            style={[
              styles.insightCard,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
              index > 0 ? { marginTop: Spacing.sm } : null,
            ]}
          >
            <View
              style={[
                styles.insightIcon,
                { backgroundColor: theme.accent + "15" },
              ]}
            >
              <Feather
                name={insight.icon as any}
                size={16}
                color={theme.accent}
              />
            </View>
            <View style={styles.insightContent}>
              <ThemedText type="small" style={{ color: theme.accent }}>
                {insight.domain}
              </ThemedText>
              <ThemedText type="body" style={{ marginTop: 2 }}>
                {insight.text}
              </ThemedText>
            </View>
          </View>
        ))}
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(400).delay(500)}
        style={styles.sectionSpacing}
      >
        <Pressable
          style={styles.historyLink}
          onPress={() => {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            navigation.navigate("BehaviorHistory");
          }}
        >
          <ThemedText
            type="body"
            style={{ color: theme.textSecondary }}
          >
            VIEW FULL BEHAVIOR HISTORY
          </ThemedText>
          <Feather
            name="arrow-right"
            size={16}
            color={theme.textSecondary}
          />
        </Pressable>
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
  scoreHeader: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: "center",
  },
  gaugeContainer: {
    alignItems: "center",
  },
  bigScore: {
    fontSize: 72,
    fontWeight: "900",
    lineHeight: 78,
    marginTop: -Spacing.sm,
  },
  trendText: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: Spacing.xs,
    letterSpacing: 0.5,
  },
  tierBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
  },
  tierText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  sectionSpacing: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
    letterSpacing: 1.5,
  },
  breakdownCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  breakdownLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownValues: {
    alignItems: "flex-end",
  },
  breakdownWeight: {
    marginTop: 2,
  },
  divider: {
    height: 1,
  },
  domainGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  domainCard: {
    width: "48.5%",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  weakestBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    marginBottom: Spacing.xs,
  },
  weakestText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  domainName: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  domainScoreRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: Spacing.xs,
  },
  domainScore: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 36,
  },
  domainTrend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 4,
  },
  progressBarBg: {
    height: 4,
    borderRadius: 2,
    marginTop: Spacing.sm,
  },
  progressBarFill: {
    height: 4,
    borderRadius: 2,
  },
  chartCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: "center",
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: Spacing.sm,
  },
  insightCard: {
    flexDirection: "row",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  insightContent: {
    flex: 1,
  },
  historyLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
});

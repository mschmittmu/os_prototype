import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  getIdentityClaims,
  getTasks,
  getStreak,
  saveMorningBriefState,
  IdentityClaims,
  Task,
  StreakData,
  defaultStreak,
} from "@/lib/storage";
import {
  getYesterdayResult,
  getPatternCallOut,
  getDirective,
  isFirstTimeUser,
  YesterdayResult,
  PatternCallOut,
  Directive,
} from "@/lib/morningBriefLogic";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const AUTO_ADVANCE_MS = 3000;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CATEGORY_ICONS: Record<string, string> = {
  Health: "heart",
  Business: "briefcase",
  "Self Development": "book-open",
  Family: "users",
  Financial: "dollar-sign",
  Physical: "activity",
  Mental: "brain",
  Work: "monitor",
  default: "check-square",
};

function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
}

export default function MorningBriefScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [currentComponent, setCurrentComponent] = useState(0);
  const [claims, setClaims] = useState<IdentityClaims | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState<StreakData>(defaultStreak);
  const [yesterdayResult, setYesterdayResult] = useState<YesterdayResult | null>(null);
  const [pattern, setPattern] = useState<PatternCallOut | null>(null);
  const [directive, setDirective] = useState<Directive | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const TOTAL_COMPONENTS = isFirstTime ? 4 : (yesterdayResult && yesterdayResult.outcome !== "no_data" ? 5 : 4);

  useEffect(() => {
    const loadData = async () => {
      const [loadedClaims, loadedTasks, loadedStreak] = await Promise.all([
        getIdentityClaims(),
        getTasks(),
        getStreak(),
      ]);
      setClaims(loadedClaims);
      setTasks(loadedTasks);
      setStreak(loadedStreak);

      if (isFirstTimeUser(loadedTasks, loadedStreak)) {
        setIsFirstTime(true);
        setIsReady(true);
        return;
      }

      const result = getYesterdayResult(loadedTasks, loadedStreak);
      setYesterdayResult(result);

      const pat = getPatternCallOut(loadedClaims, loadedTasks, loadedStreak);
      setPattern(pat);

      const dir = getDirective(pat, result, loadedClaims);
      setDirective(dir);

      setIsReady(true);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (currentComponent === 0 && isReady) {
      autoAdvanceTimer.current = setTimeout(() => {
        advance();
      }, AUTO_ADVANCE_MS);
    }
    return () => {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }
    };
  }, [currentComponent, isReady]);

  const advance = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
    }
    if (currentComponent < TOTAL_COMPONENTS - 1) {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setCurrentComponent((prev) => prev + 1);
    }
  }, [currentComponent]);

  const handleDismiss = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    const today = new Date().toISOString().split("T")[0];
    await saveMorningBriefState({ lastShownDate: today, dismissed: true });
    navigation.reset({ index: 0, routes: [{ name: "Main" }] });
  };

  const handleNavigateToTasks = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    handleDismiss();
  };

  if (!isReady) {
    return (
      <View style={[styles.container, { backgroundColor: "#0A0A0A" }]} />
    );
  }

  const renderProgressDots = () => (
    <View style={styles.dotsContainer}>
      {Array.from({ length: TOTAL_COMPONENTS }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor:
                i === currentComponent ? theme.accent : "rgba(255,255,255,0.25)",
            },
          ]}
        />
      ))}
    </View>
  );

  const renderFirstTimeWelcome = () => (
    <Pressable style={styles.fullScreenComponent} onPress={advance}>
      <Animated.View entering={FadeIn.duration(800)} style={styles.centerContent}>
        <ThemedText
          style={[styles.sectionLabel, { color: theme.textSecondary }]}
        >
          DAY ONE
        </ThemedText>
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <ThemedText style={[styles.welcomeText, { color: "#FFFFFF" }]}>
            Today is the first day you operate at a higher standard.
          </ThemedText>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(600).duration(600)}>
          <ThemedText
            style={[styles.welcomeSubtext, { color: theme.textSecondary }]}
          >
            No history. No excuses. Just execution.
          </ThemedText>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );

  const renderFirstTimeSetup = () => (
    <Pressable style={styles.fullScreenComponent} onPress={advance}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.centerContent}>
        <ThemedText
          style={[styles.sectionLabel, { color: theme.textSecondary }]}
        >
          HOW THIS WORKS
        </ThemedText>
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.setupList}
        >
          {[
            { icon: "check-square", text: "Set 5 critical tasks for today" },
            { icon: "target", text: "Complete all 5. No negotiation." },
            { icon: "trending-up", text: "Win the day. Build your streak." },
          ].map((item, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(400 + index * 200).duration(400)}
              style={styles.setupRow}
            >
              <View
                style={[
                  styles.setupIconWrap,
                  { backgroundColor: "rgba(227, 24, 55, 0.15)" },
                ]}
              >
                <Feather name={item.icon as any} size={18} color={theme.accent} />
              </View>
              <ThemedText style={[styles.setupText, { color: "#FFFFFF" }]}>
                {item.text}
              </ThemedText>
            </Animated.View>
          ))}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );

  const renderFirstTimeDirective = () => (
    <View style={styles.fullScreenComponent}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.centerContent}>
        <ThemedText
          style={[styles.sectionLabel, { color: theme.textSecondary }]}
        >
          DIRECTIVE
        </ThemedText>
        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <ThemedText style={[styles.directiveText, { color: theme.accent }]}>
            SET YOUR FIRST{"\n"}POWER LIST.
          </ThemedText>
        </Animated.View>
        <Animated.View
          entering={FadeInUp.delay(800).duration(500)}
          style={{ width: "100%", paddingHorizontal: Spacing["2xl"] }}
        >
          <Pressable
            style={[styles.beginButton, { backgroundColor: theme.accent }]}
            onPress={handleDismiss}
          >
            <ThemedText style={styles.beginButtonText}>
              LET'S GO
            </ThemedText>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );

  const renderIdentityAnchor = () => (
    <Pressable style={styles.fullScreenComponent} onPress={advance}>
      <Animated.View entering={FadeIn.duration(800)} style={styles.centerContent}>
        <ThemedText
          style={[styles.identityLabel, { color: theme.textSecondary }]}
        >
          {isFirstTime ? "YOUR DECLARATION" : "ARCANE ASSESSMENT"}
        </ThemedText>
        <ThemedText style={[styles.identityText, { color: "#FFFFFF" }]}>
          {isFirstTime ? "You declared yourself" : "You claimed to be"}
        </ThemedText>
        <ThemedText style={[styles.identityHighlight, { color: theme.accent }]}>
          {claims?.coreIdentity || "AN OPERATOR"}
        </ThemedText>
        <Animated.View entering={FadeInUp.delay(600).duration(600)}>
          <ThemedText
            style={[styles.identitySubtitle, { color: theme.textSecondary }]}
          >
            {isFirstTime ? "Now let's build the proof." : "Prove it today."}
          </ThemedText>
        </Animated.View>
        <Animated.View
          entering={FadeInUp.delay(1200).duration(400)}
          style={styles.tapHint}
        >
          <ThemedText
            style={[styles.tapHintText, { color: "rgba(255,255,255,0.3)" }]}
          >
            TAP TO CONTINUE
          </ThemedText>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );

  const renderYesterdayResult = () => {
    if (!yesterdayResult) return null;
    const isWin = yesterdayResult.outcome === "win";
    const isNoData = yesterdayResult.outcome === "no_data";
    const accentColor = isWin
      ? theme.success
      : isNoData
        ? theme.warning
        : theme.accent;
    const letter = isWin ? "W" : isNoData ? "?" : "L";
    const subtitle = isWin
      ? `Day ${yesterdayResult.streakCount} of your streak`
      : isNoData
        ? "NO DATA LOGGED"
        : yesterdayResult.streakBrokenAt
          ? `Streak broken at ${yesterdayResult.streakBrokenAt} days`
          : `Day lost. ${yesterdayResult.totalLosses} total losses.`;

    return (
      <Pressable style={styles.fullScreenComponent} onPress={advance}>
        <Animated.View entering={FadeIn.duration(600)} style={styles.centerContent}>
          <ThemedText
            style={[styles.sectionLabel, { color: theme.textSecondary }]}
          >
            YESTERDAY'S RESULT
          </ThemedText>
          <ThemedText style={[styles.resultLetter, { color: accentColor }]}>
            {letter}
          </ThemedText>
          <ThemedText style={[styles.resultDate, { color: "rgba(255,255,255,0.5)" }]}>
            {formatDate(yesterdayResult.date)}
          </ThemedText>
          <Animated.View entering={FadeInDown.delay(400).duration(500)}>
            <ThemedText style={[styles.resultSubtitle, { color: accentColor }]}>
              {subtitle}
            </ThemedText>
          </Animated.View>
        </Animated.View>
      </Pressable>
    );
  };

  const renderPatternCallOut = () => {
    if (!pattern) return null;
    const borderColor =
      pattern.severity === "critical"
        ? theme.accent
        : pattern.severity === "warning"
          ? theme.warning
          : "rgba(255,255,255,0.3)";
    const severityLabel =
      pattern.severity === "critical"
        ? "CRITICAL"
        : pattern.severity === "warning"
          ? "WARNING"
          : "OBSERVATION";

    return (
      <Pressable style={styles.fullScreenComponent} onPress={advance}>
        <Animated.View entering={FadeIn.duration(600)} style={styles.centerContent}>
          <ThemedText
            style={[styles.sectionLabel, { color: theme.textSecondary }]}
          >
            PATTERN DETECTED
          </ThemedText>
          <Animated.View
            entering={FadeInDown.delay(300).duration(600)}
            style={[styles.patternCard, { borderLeftColor: borderColor }]}
          >
            <ThemedText style={[styles.severityBadge, { color: borderColor }]}>
              {severityLabel}
            </ThemedText>
            <ThemedText style={[styles.patternMessage, { color: "#FFFFFF" }]}>
              {pattern.message}
            </ThemedText>
          </Animated.View>
        </Animated.View>
      </Pressable>
    );
  };

  const renderTasksPreview = () => {
    const hasTasks = tasks.length > 0;
    const todayTasks = tasks.slice(0, 5);

    return (
      <Pressable style={styles.fullScreenComponent} onPress={advance}>
        <Animated.View entering={FadeIn.duration(600)} style={styles.centerContent}>
          <ThemedText
            style={[styles.sectionLabel, { color: theme.textSecondary }]}
          >
            TODAY'S POWER LIST
          </ThemedText>
          {hasTasks ? (
            <Animated.View
              entering={FadeInDown.delay(200).duration(500)}
              style={styles.taskList}
            >
              {todayTasks.map((task, index) => (
                <Animated.View
                  key={task.id}
                  entering={FadeInDown.delay(300 + index * 100).duration(400)}
                  style={[
                    styles.taskRow,
                    {
                      borderBottomColor: "rgba(255,255,255,0.08)",
                      borderBottomWidth: index < todayTasks.length - 1 ? 1 : 0,
                    },
                  ]}
                >
                  <View style={styles.taskIconWrap}>
                    <Feather
                      name={getCategoryIcon(task.category) as any}
                      size={14}
                      color={theme.textSecondary}
                    />
                  </View>
                  <ThemedText
                    style={[styles.taskTitle, { color: "rgba(255,255,255,0.85)" }]}
                    numberOfLines={1}
                  >
                    {task.title}
                  </ThemedText>
                  <ThemedText
                    style={[styles.taskCategory, { color: theme.textSecondary }]}
                  >
                    {task.category}
                  </ThemedText>
                </Animated.View>
              ))}
            </Animated.View>
          ) : (
            <Animated.View
              entering={FadeInDown.delay(300).duration(500)}
              style={styles.noTasksContainer}
            >
              <ThemedText style={[styles.noTasksText, { color: theme.warning }]}>
                NO TASKS SET. YOUR DAY HAS NO STRUCTURE.
              </ThemedText>
              <Pressable
                style={[styles.setTasksButton, { backgroundColor: theme.accent }]}
                onPress={handleNavigateToTasks}
              >
                <ThemedText style={[styles.setTasksButtonText, { color: "#FFFFFF" }]}>
                  SET TASKS NOW
                </ThemedText>
              </Pressable>
            </Animated.View>
          )}
        </Animated.View>
      </Pressable>
    );
  };

  const renderDirective = () => {
    if (!directive) return null;
    return (
      <View style={styles.fullScreenComponent}>
        <Animated.View entering={FadeIn.duration(600)} style={styles.centerContent}>
          <ThemedText
            style={[styles.sectionLabel, { color: theme.textSecondary }]}
          >
            DIRECTIVE
          </ThemedText>
          <Animated.View entering={FadeInDown.delay(300).duration(600)}>
            <ThemedText style={[styles.directiveText, { color: theme.accent }]}>
              {directive.message}
            </ThemedText>
          </Animated.View>
          <Animated.View
            entering={FadeInUp.delay(800).duration(500)}
            style={{ width: "100%", paddingHorizontal: Spacing["2xl"] }}
          >
            <Pressable
              style={[styles.beginButton, { backgroundColor: theme.accent }]}
              onPress={handleDismiss}
            >
              <ThemedText style={styles.beginButtonText}>
                BEGIN YOUR DAY
              </ThemedText>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    );
  };

  const showYesterdayResult = yesterdayResult && yesterdayResult.outcome !== "no_data";

  const components = isFirstTime
    ? [
        renderIdentityAnchor,
        renderFirstTimeWelcome,
        renderFirstTimeSetup,
        renderFirstTimeDirective,
      ]
    : [
        renderIdentityAnchor,
        ...(showYesterdayResult ? [renderYesterdayResult] : []),
        renderPatternCallOut,
        renderTasksPreview,
        renderDirective,
      ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: "#0A0A0A",
          paddingTop: insets.top + Spacing.lg,
          paddingBottom: insets.bottom + Spacing.lg,
        },
      ]}
    >
      {components[currentComponent]()}
      {renderProgressDots()}
    </View>
  );
}

function formatDate(dateString: string): string {
  try {
    const parts = dateString.split("-");
    const date = new Date(
      parseInt(parts[0]),
      parseInt(parts[1]) - 1,
      parseInt(parts[2])
    );
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenComponent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["3xl"],
    width: "100%",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingBottom: Spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  identityLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 3,
    marginBottom: Spacing["3xl"],
    textTransform: "uppercase",
  },
  identityText: {
    fontSize: 28,
    fontWeight: "300",
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  identityHighlight: {
    fontSize: 42,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: Spacing["2xl"],
  },
  identitySubtitle: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    fontStyle: "italic",
  },
  tapHint: {
    position: "absolute",
    bottom: -80,
  },
  tapHintText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 3,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 3,
    marginBottom: Spacing["3xl"],
    textTransform: "uppercase",
  },
  resultLetter: {
    fontSize: 120,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 130,
  },
  resultDate: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  resultSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  patternCard: {
    borderLeftWidth: 4,
    paddingLeft: Spacing.xl,
    paddingVertical: Spacing.xl,
    maxWidth: SCREEN_WIDTH - 80,
  },
  severityBadge: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: Spacing.md,
    textTransform: "uppercase",
  },
  patternMessage: {
    fontSize: 20,
    fontWeight: "500",
    lineHeight: 30,
  },
  taskList: {
    width: "100%",
    maxWidth: SCREEN_WIDTH - 60,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  taskIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  taskTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  taskCategory: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginLeft: Spacing.sm,
  },
  noTasksContainer: {
    alignItems: "center",
    gap: Spacing.xl,
  },
  noTasksText: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 1,
  },
  setTasksButton: {
    paddingHorizontal: Spacing["3xl"],
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  setTasksButtonText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  directiveText: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 1,
    lineHeight: 38,
    marginBottom: Spacing["4xl"],
    textTransform: "uppercase",
  },
  beginButton: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  beginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 36,
    marginBottom: Spacing.xl,
  },
  welcomeSubtext: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    fontStyle: "italic",
  },
  setupList: {
    width: "100%",
    gap: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  setupRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  setupIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  setupText: {
    fontSize: 17,
    fontWeight: "600",
    flex: 1,
    lineHeight: 24,
  },
});

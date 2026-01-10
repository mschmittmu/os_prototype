import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  OperatorModeConfig,
  OperatorModeProtocol,
  getOperatorModeConfig,
  saveOperatorModeSession,
  getTasks,
} from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function OperatorModeActivationScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [config, setConfig] = useState<OperatorModeConfig | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<OperatorModeProtocol | null>(null);
  const [showProtocolPicker, setShowProtocolPicker] = useState(false);

  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.4);

  useEffect(() => {
    loadConfig();
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const loadConfig = async () => {
    const cfg = await getOperatorModeConfig();
    setConfig(cfg);
    const protocol = cfg.protocols.find((p) => p.id === cfg.selectedProtocolId);
    setSelectedProtocol(protocol || cfg.protocols[0]);
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handleActivate = async () => {
    if (!selectedProtocol) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const tasks = await getTasks();
    const completedTasks = tasks.filter((t) => t.completed).length;
    await saveOperatorModeSession({
      isActive: true,
      protocolId: selectedProtocol.id,
      protocolName: selectedProtocol.name,
      startTime: new Date().toISOString(),
      durationMinutes: selectedProtocol.durationMinutes,
      tasksCompletedAtStart: completedTasks,
    });
    navigation.replace("OperatorModeActive");
  };

  const handleChangeProtocol = (protocol: OperatorModeProtocol) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedProtocol(protocol);
    setShowProtocolPicker(false);
  };

  const getActiveFeatures = () => {
    if (!selectedProtocol) return [];
    const features = [];
    if (selectedProtocol.settings.grayscaleMode) features.push("Enable grayscale");
    if (selectedProtocol.settings.blockNonEssentialNotifications) features.push("Block notifications");
    if (selectedProtocol.settings.autoReplyTexts) features.push("Auto-reply to messages");
    if (selectedProtocol.settings.hideDistractingApps) features.push("Hide distracting apps");
    return features;
  };

  if (!config || !selectedProtocol) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing["3xl"], paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(400)} style={styles.iconContainer}>
          <Animated.View
            style={[styles.iconGlow, { backgroundColor: theme.accent }, glowAnimatedStyle]}
          />
          <View style={[styles.iconWrapper, { backgroundColor: theme.accent }]}>
            <Feather name="shield" size={56} color="#FFFFFF" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <ThemedText type="h2" style={styles.title}>
            ACTIVATE OPERATOR MODE
          </ThemedText>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400).delay(200)}
          style={[styles.protocolCard, { backgroundColor: theme.backgroundSecondary }]}
        >
          <View style={styles.protocolRow}>
            <ThemedText type="caption" secondary>
              PROTOCOL
            </ThemedText>
            <ThemedText type="h4">{selectedProtocol.name}</ThemedText>
          </View>
          {selectedProtocol.durationMinutes > 0 && (
            <View style={styles.protocolRow}>
              <ThemedText type="caption" secondary>
                DURATION
              </ThemedText>
              <ThemedText type="h4">{selectedProtocol.durationMinutes} minutes</ThemedText>
            </View>
          )}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400).delay(300)}
          style={[styles.featuresCard, { backgroundColor: theme.backgroundSecondary }]}
        >
          <ThemedText type="caption" secondary style={styles.featuresTitle}>
            THIS WILL:
          </ThemedText>
          {getActiveFeatures().map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Feather name="check" size={16} color={theme.accent} />
              <ThemedText type="body">{feature}</ThemedText>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(400)}>
          <Pressable onPress={handleActivate}>
            <Animated.View style={[styles.activateButtonContainer, buttonAnimatedStyle]}>
              <Animated.View
                style={[styles.buttonGlow, { backgroundColor: theme.accent }, glowAnimatedStyle]}
              />
              <View style={[styles.activateButton, { backgroundColor: theme.accent }]}>
                <Feather name="zap" size={24} color="#FFFFFF" />
                <ThemedText type="h3" style={styles.activateButtonText}>
                  GO TO WAR
                </ThemedText>
              </View>
            </Animated.View>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(500)}>
          <Pressable
            onPress={() => setShowProtocolPicker(!showProtocolPicker)}
            style={styles.changeProtocolButton}
          >
            <ThemedText type="body" secondary>
              Change Protocol
            </ThemedText>
            <Feather
              name={showProtocolPicker ? "chevron-up" : "chevron-down"}
              size={16}
              color={theme.textSecondary}
            />
          </Pressable>
        </Animated.View>

        {showProtocolPicker && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.protocolPicker}>
            {config.protocols.map((protocol) => (
              <Pressable
                key={protocol.id}
                onPress={() => handleChangeProtocol(protocol)}
                style={[
                  styles.protocolOption,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    borderColor:
                      selectedProtocol.id === protocol.id ? theme.accent : "transparent",
                  },
                ]}
              >
                <View style={styles.protocolOptionContent}>
                  <ThemedText type="bodyBold">{protocol.name}</ThemedText>
                  <ThemedText type="caption" secondary>
                    {protocol.description}
                  </ThemedText>
                </View>
                {selectedProtocol.id === protocol.id && (
                  <Feather name="check-circle" size={20} color={theme.accent} />
                )}
              </Pressable>
            ))}
          </Animated.View>
        )}
      </ScrollView>

      <Pressable
        onPress={() => navigation.goBack()}
        style={[styles.closeButton, { top: insets.top + Spacing.md }]}
      >
        <Feather name="x" size={24} color={theme.text} />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing["2xl"],
    position: "relative",
  },
  iconGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    top: -10,
    left: -10,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing["2xl"],
  },
  protocolCard: {
    width: "100%",
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  protocolRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  featuresCard: {
    width: "100%",
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing["2xl"],
  },
  featuresTitle: {
    marginBottom: Spacing.md,
    letterSpacing: 1,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  activateButtonContainer: {
    position: "relative",
    marginBottom: Spacing.lg,
  },
  buttonGlow: {
    position: "absolute",
    width: "110%",
    height: "120%",
    borderRadius: BorderRadius.lg,
    top: -6,
    left: "-5%",
  },
  activateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing["4xl"],
    borderRadius: BorderRadius.lg,
  },
  activateButtonText: {
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  changeProtocolButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    padding: Spacing.md,
  },
  protocolPicker: {
    width: "100%",
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  protocolOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
  },
  protocolOptionContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  closeButton: {
    position: "absolute",
    right: Spacing.xl,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

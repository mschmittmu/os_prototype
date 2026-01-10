import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Switch,
  TextInput,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  OperatorModeSettings,
  OperatorModeConfig,
  defaultOperatorSettings,
  defaultProtocols,
  saveOperatorModeConfig,
} from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function OperatorModeSetupScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [settings, setSettings] = useState<OperatorModeSettings>({
    ...defaultOperatorSettings,
  });
  const [selectedProtocol, setSelectedProtocol] = useState("standard");

  const totalSteps = 5;

  const updateSetting = <K extends keyof OperatorModeSettings>(
    key: K,
    value: OperatorModeSettings[K]
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const config: OperatorModeConfig = {
      isSetupComplete: true,
      selectedProtocolId: selectedProtocol,
      customSettings: settings,
      protocols: defaultProtocols,
    };
    await saveOperatorModeConfig(config);
    navigation.replace("OperatorModeActivation");
  };

  const renderToggleRow = (
    label: string,
    description: string | null,
    key: keyof OperatorModeSettings,
    value: boolean
  ) => (
    <View style={[styles.toggleRow, { backgroundColor: theme.backgroundSecondary }]}>
      <View style={styles.toggleContent}>
        <ThemedText type="body" style={styles.toggleLabel}>
          {label}
        </ThemedText>
        {description && (
          <ThemedText type="caption" secondary>
            {description}
          </ThemedText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={(v) => updateSetting(key, v)}
        trackColor={{ false: theme.backgroundTertiary, true: theme.accent }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  const renderStep0 = () => (
    <Animated.View
      key="step0"
      entering={FadeInRight.duration(300)}
      exiting={FadeOutLeft.duration(300)}
      style={styles.stepContainer}
    >
      <View style={[styles.iconWrapper, { backgroundColor: theme.accent }]}>
        <Feather name="shield" size={48} color="#FFFFFF" />
      </View>
      <ThemedText type="h2" style={styles.stepTitle}>
        DESIGN YOUR WAR PROTOCOL
      </ThemedText>
      <ThemedText type="body" secondary style={styles.stepDescription}>
        Define what "going to war" looks like for YOU.
      </ThemedText>
      <View style={[styles.quoteBox, { backgroundColor: theme.backgroundSecondary }]}>
        <ThemedText type="small" style={styles.quoteText}>
          "You design this when you're thinking clearly.{"\n"}
          The AI enforces it when discipline is hard."
        </ThemedText>
      </View>
    </Animated.View>
  );

  const renderStep1 = () => (
    <Animated.View
      key="step1"
      entering={FadeInRight.duration(300)}
      exiting={FadeOutLeft.duration(300)}
      style={styles.stepContainer}
    >
      <ThemedText type="h3" style={styles.sectionTitle}>
        PHONE TRANSFORMATION
      </ThemedText>
      <ThemedText type="caption" secondary style={styles.sectionSubtitle}>
        VISUAL CHANGES
      </ThemedText>
      {renderToggleRow(
        "Grayscale Mode",
        "Remove all color (kills dopamine triggers)",
        "grayscaleMode",
        settings.grayscaleMode
      )}
      {renderToggleRow(
        "Hide Distracting Apps",
        "Clean home screen",
        "hideDistractingApps",
        settings.hideDistractingApps
      )}
      {renderToggleRow(
        "Simplified Lock Screen",
        "No notifications visible",
        "simplifiedLockScreen",
        settings.simplifiedLockScreen
      )}
      <ThemedText type="caption" secondary style={[styles.sectionSubtitle, { marginTop: Spacing.xl }]}>
        NOTIFICATIONS
      </ThemedText>
      {renderToggleRow(
        "Block All Non-Essential",
        null,
        "blockNonEssentialNotifications",
        settings.blockNonEssentialNotifications
      )}
      {renderToggleRow(
        "Allow Only Calls from Favorites",
        null,
        "allowFavoritesCalls",
        settings.allowFavoritesCalls
      )}
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View
      key="step2"
      entering={FadeInRight.duration(300)}
      exiting={FadeOutLeft.duration(300)}
      style={styles.stepContainer}
    >
      <ThemedText type="h3" style={styles.sectionTitle}>
        COMMUNICATION
      </ThemedText>
      {renderToggleRow(
        "Auto-Reply to Texts",
        null,
        "autoReplyTexts",
        settings.autoReplyTexts
      )}
      {settings.autoReplyTexts && (
        <View style={[styles.textInputContainer, { backgroundColor: theme.backgroundSecondary }]}>
          <TextInput
            style={[styles.textInput, { color: theme.text }]}
            value={settings.autoReplyMessage}
            onChangeText={(text) => updateSetting("autoReplyMessage", text)}
            placeholder="Auto-reply message..."
            placeholderTextColor={theme.textSecondary}
            multiline
          />
        </View>
      )}
      {renderToggleRow(
        "Auto-Reply to Missed Calls",
        null,
        "autoReplyMissedCalls",
        settings.autoReplyMissedCalls
      )}
      <ThemedText type="caption" secondary style={[styles.sectionSubtitle, { marginTop: Spacing.xl }]}>
        FOCUS ACTIVATIONS
      </ThemedText>
      {renderToggleRow(
        "Start Focus Playlist",
        "Connect Spotify/Apple Music",
        "startFocusPlaylist",
        settings.startFocusPlaylist
      )}
      {renderToggleRow(
        "Trigger Smart Home Scene",
        "Lights dim, etc.",
        "triggerSmartHome",
        settings.triggerSmartHome
      )}
      {renderToggleRow("Start Timer", null, "startTimer", settings.startTimer)}
      <View style={[styles.durationRow, { backgroundColor: theme.backgroundSecondary }]}>
        <ThemedText type="body">Default Duration</ThemedText>
        <View style={styles.durationInput}>
          <Pressable
            onPress={() =>
              updateSetting(
                "defaultDurationMinutes",
                Math.max(15, settings.defaultDurationMinutes - 15)
              )
            }
            style={[styles.durationBtn, { backgroundColor: theme.backgroundTertiary }]}
          >
            <Feather name="minus" size={20} color={theme.text} />
          </Pressable>
          <ThemedText type="h4" style={styles.durationValue}>
            {settings.defaultDurationMinutes} min
          </ThemedText>
          <Pressable
            onPress={() =>
              updateSetting(
                "defaultDurationMinutes",
                Math.min(240, settings.defaultDurationMinutes + 15)
              )
            }
            style={[styles.durationBtn, { backgroundColor: theme.backgroundTertiary }]}
          >
            <Feather name="plus" size={20} color={theme.text} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View
      key="step3"
      entering={FadeInRight.duration(300)}
      exiting={FadeOutLeft.duration(300)}
      style={styles.stepContainer}
    >
      <ThemedText type="h3" style={styles.sectionTitle}>
        EXIT CONSEQUENCES
      </ThemedText>
      <ThemedText type="body" secondary style={styles.sectionDescription}>
        What happens if you try to exit early?
      </ThemedText>
      {renderToggleRow(
        "Burn 1 Strike",
        null,
        "burnStrikeOnExit",
        settings.burnStrikeOnExit
      )}
      {renderToggleRow(
        "Notify Your Crew",
        null,
        "notifyCrewOnExit",
        settings.notifyCrewOnExit
      )}
      {renderToggleRow(
        "Break Your Streak",
        null,
        "breakStreakOnExit",
        settings.breakStreakOnExit
      )}
      {renderToggleRow(
        "Require Crew Approval to Exit",
        null,
        "requireCrewApprovalToExit",
        settings.requireCrewApprovalToExit
      )}
      <View style={[styles.durationRow, { backgroundColor: theme.backgroundSecondary }]}>
        <ThemedText type="body">Cooldown Period</ThemedText>
        <View style={styles.durationInput}>
          <Pressable
            onPress={() =>
              updateSetting("cooldownHours", Math.max(0, settings.cooldownHours - 1))
            }
            style={[styles.durationBtn, { backgroundColor: theme.backgroundTertiary }]}
          >
            <Feather name="minus" size={20} color={theme.text} />
          </Pressable>
          <ThemedText type="h4" style={styles.durationValue}>
            {settings.cooldownHours} hrs
          </ThemedText>
          <Pressable
            onPress={() =>
              updateSetting("cooldownHours", Math.min(24, settings.cooldownHours + 1))
            }
            style={[styles.durationBtn, { backgroundColor: theme.backgroundTertiary }]}
          >
            <Feather name="plus" size={20} color={theme.text} />
          </Pressable>
        </View>
      </View>
      <View style={[styles.noteBox, { backgroundColor: theme.backgroundSecondary }]}>
        <ThemedText type="caption" secondary style={styles.noteText}>
          "You're setting these rules for yourself.{"\n"}
          No one is forcing you. But once set, no negotiation."
        </ThemedText>
      </View>
    </Animated.View>
  );

  const renderStep4 = () => (
    <Animated.View
      key="step4"
      entering={FadeInRight.duration(300)}
      exiting={FadeOutLeft.duration(300)}
      style={styles.stepContainer}
    >
      <ThemedText type="h3" style={styles.sectionTitle}>
        PRESET PROTOCOLS
      </ThemedText>
      <ThemedText type="body" secondary style={styles.sectionDescription}>
        Choose a starting template:
      </ThemedText>
      {defaultProtocols.map((protocol) => (
        <Pressable
          key={protocol.id}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSelectedProtocol(protocol.id);
            setSettings(protocol.settings);
          }}
          style={[
            styles.protocolCard,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor:
                selectedProtocol === protocol.id ? theme.accent : "transparent",
              borderWidth: 2,
            },
          ]}
        >
          <View style={styles.protocolHeader}>
            <ThemedText type="bodyBold">{protocol.name}</ThemedText>
            {selectedProtocol === protocol.id && (
              <Feather name="check-circle" size={20} color={theme.accent} />
            )}
          </View>
          <ThemedText type="caption" secondary>
            {protocol.description}
          </ThemedText>
        </Pressable>
      ))}
    </Animated.View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderStep0();
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.progressContainer}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    i <= currentStep ? theme.accent : theme.backgroundTertiary,
                },
              ]}
            />
          ))}
        </View>
        <ThemedText type="caption" secondary>
          Step {currentStep + 1} of {totalSteps}
        </ThemedText>
      </View>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentStep()}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        {currentStep > 0 && (
          <Pressable
            onPress={handleBack}
            style={[styles.backButton, { backgroundColor: theme.backgroundSecondary }]}
          >
            <Feather name="arrow-left" size={20} color={theme.text} />
          </Pressable>
        )}
        <Pressable
          onPress={handleNext}
          style={[styles.nextButton, { backgroundColor: theme.accent }]}
        >
          <ThemedText type="bodyBold" style={styles.nextButtonText}>
            {currentStep === totalSteps - 1 ? "COMPLETE SETUP" : "NEXT"}
          </ThemedText>
          <Feather name="arrow-right" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  progressContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing["3xl"],
  },
  stepContainer: {
    gap: Spacing.lg,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: Spacing.lg,
  },
  stepTitle: {
    textAlign: "center",
  },
  stepDescription: {
    textAlign: "center",
  },
  quoteBox: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
  },
  quoteText: {
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 22,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  sectionSubtitle: {
    marginBottom: Spacing.sm,
    letterSpacing: 1,
  },
  sectionDescription: {
    marginBottom: Spacing.lg,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  toggleContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  toggleLabel: {
    marginBottom: 2,
  },
  textInputContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  textInput: {
    fontSize: 14,
    minHeight: 60,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  durationInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  durationBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  durationValue: {
    minWidth: 70,
    textAlign: "center",
  },
  noteBox: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
  },
  noteText: {
    textAlign: "center",
    lineHeight: 20,
  },
  protocolCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  protocolHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  backButton: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButton: {
    flex: 1,
    height: 52,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  nextButtonText: {
    color: "#FFFFFF",
  },
});

import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Dimensions,
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
  saveOnboardingState,
  saveIdentityClaims,
  saveUser,
  defaultUser,
} from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";

const TOTAL_STEPS = 6;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CORE_IDENTITIES = [
  { id: "DISCIPLINED", label: "DISCIPLINED", description: "I do what needs to be done regardless of how I feel", icon: "shield" as const },
  { id: "BUILDER", label: "BUILDER", description: "I create things that generate value and legacy", icon: "tool" as const },
  { id: "WARRIOR", label: "WARRIOR", description: "I embrace discomfort and pain as fuel", icon: "zap" as const },
  { id: "LEADER", label: "LEADER", description: "I hold others accountable while leading by example", icon: "flag" as const },
  { id: "RELENTLESS", label: "RELENTLESS", description: "I never stop. Rest is earned, not given", icon: "repeat" as const },
];

const PRIORITY_DOMAINS = [
  { id: "PHYSICAL", label: "PHYSICAL EXCELLENCE", icon: "activity" as const },
  { id: "FINANCIAL", label: "FINANCIAL GROWTH", icon: "trending-up" as const },
  { id: "WORK", label: "WORK EXECUTION", icon: "briefcase" as const },
  { id: "RELATIONSHIPS", label: "RELATIONSHIPS", icon: "heart" as const },
  { id: "MENTAL", label: "MENTAL TOUGHNESS", icon: "zap" as const },
  { id: "DISCIPLINE", label: "DISCIPLINE", icon: "shield" as const },
];

const AVOIDANCE_PATTERNS = [
  "Hard conversations",
  "Physical discomfort",
  "Financial decisions",
  "Consistent follow-through",
  "Asking for help",
  "Cutting toxic people",
  "Waking up early",
  "Saying no",
];

const STANDARD_SUGGESTIONS = [
  "I will never miss two days in a row",
  "I will complete my Power List every day",
  "I will train my body 6 days a week",
];

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [currentStep, setCurrentStep] = useState(1);
  const [userName, setUserName] = useState("");
  const [coreIdentity, setCoreIdentity] = useState("");
  const [priorityDomain, setPriorityDomain] = useState("");
  const [avoidancePatterns, setAvoidancePatterns] = useState<string[]>([]);
  const [behavioralStandard, setBehavioralStandard] = useState("");

  const goNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const toggleAvoidance = (pattern: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAvoidancePatterns((prev) => {
      if (prev.includes(pattern)) {
        return prev.filter((p) => p !== pattern);
      }
      if (prev.length >= 3) return prev;
      return [...prev, pattern];
    });
  };

  const handleLockIn = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await saveOnboardingState({
      isComplete: true,
      completedAt: new Date().toISOString(),
      userName,
    });
    await saveIdentityClaims({
      coreIdentity,
      priorityDomain,
      avoidancePatterns,
      behavioralStandard,
      createdAt: new Date().toISOString(),
    });
    await saveUser({ ...defaultUser, name: userName });
    navigation.reset({ index: 0, routes: [{ name: "Main" }] });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return userName.trim().length > 0;
      case 2: return coreIdentity.length > 0;
      case 3: return priorityDomain.length > 0;
      case 4: return avoidancePatterns.length > 0;
      case 5: return behavioralStandard.trim().length > 0;
      default: return true;
    }
  };

  const renderProgressBar = () => (
    <View style={[styles.progressContainer, { top: insets.top + Spacing.sm }]}>
      <View style={[styles.progressTrack, { backgroundColor: theme.backgroundTertiary }]}>
        <Animated.View
          style={[
            styles.progressFill,
            { backgroundColor: theme.accent, width: `${(currentStep / TOTAL_STEPS) * 100}%` },
          ]}
        />
      </View>
      <ThemedText type="caption" secondary style={styles.stepIndicator}>
        {currentStep} / {TOTAL_STEPS}
      </ThemedText>
    </View>
  );

  const renderBackButton = () => {
    if (currentStep <= 1) return null;
    return (
      <Pressable onPress={goBack} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color={theme.text} />
      </Pressable>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Welcome userName={userName} setUserName={setUserName} onNext={goNext} canProceed={canProceed()} />;
      case 2: return <Step2CoreIdentity selected={coreIdentity} onSelect={setCoreIdentity} onNext={goNext} />;
      case 3: return <Step3PriorityDomain selected={priorityDomain} onSelect={setPriorityDomain} onNext={goNext} />;
      case 4: return <Step4Avoidance selected={avoidancePatterns} onToggle={toggleAvoidance} onNext={goNext} canProceed={canProceed()} />;
      case 5: return <Step5Standard value={behavioralStandard} setValue={setBehavioralStandard} onNext={goNext} canProceed={canProceed()} />;
      case 6: return <Step6Confirmation userName={userName} coreIdentity={coreIdentity} priorityDomain={priorityDomain} avoidancePatterns={avoidancePatterns} behavioralStandard={behavioralStandard} onLockIn={handleLockIn} onGoBack={goBack} />;
      default: return null;
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.backgroundRoot }]}>
      {renderProgressBar()}
      <View style={[styles.content, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + Spacing.xl }]}>
        {renderBackButton()}
        {renderStep()}
      </View>
    </View>
  );
}

function Step1Welcome({ userName, setUserName, onNext, canProceed }: { userName: string; setUserName: (v: string) => void; onNext: () => void; canProceed: boolean }) {
  const { theme } = useTheme();
  return (
    <KeyboardAwareScrollViewCompat contentContainerStyle={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.stepInner}>
        <View style={styles.titleSection}>
          <ThemedText type="h1" style={[styles.bigTitle, { color: theme.accent }]}>
            WHO ARE YOU?
          </ThemedText>
          <ThemedText type="body" secondary style={styles.subtitle}>
            Not who you want to be. Who you are right now. ARCANE will hold you to this.
          </ThemedText>
        </View>
        <View style={styles.inputSection}>
          <TextInput
            style={[styles.textInput, { backgroundColor: theme.backgroundSecondary, color: theme.text, borderColor: theme.border }]}
            placeholder="Your name"
            placeholderTextColor={theme.textSecondary}
            value={userName}
            onChangeText={setUserName}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => { if (canProceed) onNext(); }}
          />
        </View>
        <Pressable
          style={[styles.primaryButton, { backgroundColor: canProceed ? theme.accent : theme.backgroundTertiary }]}
          onPress={onNext}
          disabled={!canProceed}
        >
          <ThemedText type="bodyBold" style={{ color: canProceed ? "#FFFFFF" : theme.textSecondary }}>
            DECLARE
          </ThemedText>
        </Pressable>
      </Animated.View>
    </KeyboardAwareScrollViewCompat>
  );
}

function Step2CoreIdentity({ selected, onSelect, onNext }: { selected: string; onSelect: (v: string) => void; onNext: () => void }) {
  const { theme } = useTheme();
  const handleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(id);
  };
  return (
    <ScrollView contentContainerStyle={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.stepInner}>
        <View style={styles.titleSection}>
          <ThemedText type="h2" style={styles.questionTitle}>
            WHAT DEFINES YOU?
          </ThemedText>
        </View>
        <View style={styles.cardList}>
          {CORE_IDENTITIES.map((item, index) => {
            const isSelected = selected === item.id;
            return (
              <Animated.View key={item.id} entering={FadeInDown.duration(300).delay(index * 80)}>
                <Pressable
                  onPress={() => handleSelect(item.id)}
                  style={[
                    styles.identityCard,
                    { backgroundColor: theme.backgroundSecondary, borderColor: isSelected ? theme.accent : theme.border },
                    isSelected && styles.selectedCard,
                  ]}
                >
                  <View style={[styles.cardIcon, { backgroundColor: isSelected ? theme.accent + "20" : theme.backgroundTertiary }]}>
                    <Feather name={item.icon} size={24} color={isSelected ? theme.accent : theme.textSecondary} />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <ThemedText type="bodyBold" style={isSelected ? { color: theme.accent } : undefined}>
                      {item.label}
                    </ThemedText>
                    <ThemedText type="small" secondary>
                      {item.description}
                    </ThemedText>
                  </View>
                  {isSelected ? (
                    <View style={[styles.checkCircle, { backgroundColor: theme.accent }]}>
                      <Feather name="check" size={16} color="#FFFFFF" />
                    </View>
                  ) : null}
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
        {selected ? (
          <Animated.View entering={FadeInUp.duration(300)}>
            <Pressable style={[styles.primaryButton, { backgroundColor: theme.accent }]} onPress={onNext}>
              <ThemedText type="bodyBold" style={{ color: "#FFFFFF" }}>CONTINUE</ThemedText>
            </Pressable>
          </Animated.View>
        ) : null}
      </Animated.View>
    </ScrollView>
  );
}

function Step3PriorityDomain({ selected, onSelect, onNext }: { selected: string; onSelect: (v: string) => void; onNext: () => void }) {
  const { theme } = useTheme();
  const handleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(id);
  };
  return (
    <ScrollView contentContainerStyle={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.stepInner}>
        <View style={styles.titleSection}>
          <ThemedText type="h2" style={styles.questionTitle}>
            WHAT'S YOUR #1 FOCUS RIGHT NOW?
          </ThemedText>
        </View>
        <View style={styles.cardList}>
          {PRIORITY_DOMAINS.map((item, index) => {
            const isSelected = selected === item.id;
            return (
              <Animated.View key={item.id} entering={FadeInDown.duration(300).delay(index * 80)}>
                <Pressable
                  onPress={() => handleSelect(item.id)}
                  style={[
                    styles.domainCard,
                    { backgroundColor: theme.backgroundSecondary, borderColor: isSelected ? theme.accent : theme.border },
                    isSelected && styles.selectedCard,
                  ]}
                >
                  <View style={[styles.domainIcon, { backgroundColor: isSelected ? theme.accent + "20" : theme.backgroundTertiary }]}>
                    <Feather name={item.icon} size={22} color={isSelected ? theme.accent : theme.textSecondary} />
                  </View>
                  <ThemedText type="bodyBold" style={[styles.domainLabel, isSelected ? { color: theme.accent } : undefined]}>
                    {item.label}
                  </ThemedText>
                  {isSelected ? (
                    <View style={[styles.checkCircle, { backgroundColor: theme.accent }]}>
                      <Feather name="check" size={16} color="#FFFFFF" />
                    </View>
                  ) : null}
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
        {selected ? (
          <Animated.View entering={FadeInUp.duration(300)}>
            <Pressable style={[styles.primaryButton, { backgroundColor: theme.accent }]} onPress={onNext}>
              <ThemedText type="bodyBold" style={{ color: "#FFFFFF" }}>CONTINUE</ThemedText>
            </Pressable>
          </Animated.View>
        ) : null}
      </Animated.View>
    </ScrollView>
  );
}

function Step4Avoidance({ selected, onToggle, onNext, canProceed }: { selected: string[]; onToggle: (v: string) => void; onNext: () => void; canProceed: boolean }) {
  const { theme } = useTheme();
  return (
    <ScrollView contentContainerStyle={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.stepInner}>
        <View style={styles.titleSection}>
          <ThemedText type="h2" style={styles.questionTitle}>
            WHAT DO YOU AVOID MOST?
          </ThemedText>
          <ThemedText type="small" secondary style={styles.subtitle}>
            Be honest. ARCANE will detect this pattern whether you admit it or not. Select up to 3.
          </ThemedText>
        </View>
        <View style={styles.chipGrid}>
          {AVOIDANCE_PATTERNS.map((pattern, index) => {
            const isSelected = selected.includes(pattern);
            const isDisabled = !isSelected && selected.length >= 3;
            return (
              <Animated.View key={pattern} entering={FadeInDown.duration(300).delay(index * 60)}>
                <Pressable
                  onPress={() => onToggle(pattern)}
                  disabled={isDisabled}
                  style={[
                    styles.avoidanceChip,
                    {
                      backgroundColor: isSelected ? theme.accent + "15" : theme.backgroundSecondary,
                      borderColor: isSelected ? theme.accent : theme.border,
                      opacity: isDisabled ? 0.4 : 1,
                    },
                  ]}
                >
                  <View style={[styles.chipCheck, { backgroundColor: isSelected ? theme.accent : theme.backgroundTertiary }]}>
                    {isSelected ? <Feather name="check" size={14} color="#FFFFFF" /> : null}
                  </View>
                  <ThemedText type="body" style={isSelected ? { color: theme.accent } : undefined}>
                    {pattern}
                  </ThemedText>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
        <Pressable
          style={[styles.primaryButton, { backgroundColor: canProceed ? theme.accent : theme.backgroundTertiary }]}
          onPress={onNext}
          disabled={!canProceed}
        >
          <ThemedText type="bodyBold" style={{ color: canProceed ? "#FFFFFF" : theme.textSecondary }}>
            CONTINUE
          </ThemedText>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

function Step5Standard({ value, setValue, onNext, canProceed }: { value: string; setValue: (v: string) => void; onNext: () => void; canProceed: boolean }) {
  const { theme } = useTheme();
  return (
    <KeyboardAwareScrollViewCompat contentContainerStyle={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.stepInner}>
        <View style={styles.titleSection}>
          <ThemedText type="h2" style={styles.questionTitle}>
            SET YOUR STANDARD
          </ThemedText>
          <ThemedText type="small" secondary style={styles.subtitle}>
            Pick ONE non-negotiable rule. Break it and ARCANE will know.
          </ThemedText>
        </View>
        <View style={styles.inputSection}>
          <TextInput
            style={[styles.textInput, styles.multilineInput, { backgroundColor: theme.backgroundSecondary, color: theme.text, borderColor: theme.border }]}
            placeholder="e.g., I will complete my Power List every single day"
            placeholderTextColor={theme.textSecondary}
            value={value}
            onChangeText={setValue}
            multiline
            textAlignVertical="top"
          />
        </View>
        <View style={styles.suggestionsContainer}>
          {STANDARD_SUGGESTIONS.map((suggestion) => (
            <Pressable
              key={suggestion}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setValue(suggestion);
              }}
              style={[styles.suggestionChip, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}
            >
              <ThemedText type="small" secondary>{suggestion}</ThemedText>
            </Pressable>
          ))}
        </View>
        <Pressable
          style={[styles.primaryButton, { backgroundColor: canProceed ? theme.accent : theme.backgroundTertiary }]}
          onPress={onNext}
          disabled={!canProceed}
        >
          <ThemedText type="bodyBold" style={{ color: canProceed ? "#FFFFFF" : theme.textSecondary }}>
            CONTINUE
          </ThemedText>
        </Pressable>
      </Animated.View>
    </KeyboardAwareScrollViewCompat>
  );
}

function Step6Confirmation({ userName, coreIdentity, priorityDomain, avoidancePatterns, behavioralStandard, onLockIn, onGoBack }: {
  userName: string;
  coreIdentity: string;
  priorityDomain: string;
  avoidancePatterns: string[];
  behavioralStandard: string;
  onLockIn: () => void;
  onGoBack: () => void;
}) {
  const { theme } = useTheme();
  const domainLabel = PRIORITY_DOMAINS.find((d) => d.id === priorityDomain)?.label || priorityDomain;
  return (
    <ScrollView contentContainerStyle={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeIn.duration(800)} style={styles.stepInner}>
        <View style={styles.titleSection}>
          <ThemedText type="h1" style={[styles.bigTitle, { color: theme.accent }]}>
            {userName.toUpperCase()}
          </ThemedText>
          <ThemedText type="body" secondary style={styles.subtitle}>
            IDENTITY DECLARATION DOSSIER
          </ThemedText>
        </View>

        <View style={[styles.dossierCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
          <DossierRow label="CORE IDENTITY" value={coreIdentity} />
          <View style={[styles.dossierDivider, { backgroundColor: theme.border }]} />
          <DossierRow label="PRIORITY DOMAIN" value={domainLabel} />
          <View style={[styles.dossierDivider, { backgroundColor: theme.border }]} />
          <DossierRow label="AVOIDANCE PATTERNS" value={avoidancePatterns.join(", ")} />
          <View style={[styles.dossierDivider, { backgroundColor: theme.border }]} />
          <DossierRow label="BEHAVIORAL STANDARD" value={behavioralStandard} />
        </View>

        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.warningSection}>
          <ThemedText type="bodyBold" style={[styles.warningText, { color: theme.accent }]}>
            ARCANE WILL AUDIT EVERY DECISION AGAINST THIS DECLARATION.
          </ThemedText>
          <ThemedText type="small" secondary style={styles.warningSubtext}>
            You can't edit this. You can only prove it or disprove it.
          </ThemedText>
        </Animated.View>

        <Pressable onPress={onGoBack} style={styles.goBackLink}>
          <ThemedText type="body" secondary>GO BACK</ThemedText>
        </Pressable>

        <Pressable style={[styles.primaryButton, styles.lockInButton, { backgroundColor: theme.accent }]} onPress={onLockIn}>
          <Feather name="lock" size={20} color="#FFFFFF" style={{ marginRight: Spacing.sm }} />
          <ThemedText type="bodyBold" style={{ color: "#FFFFFF" }}>
            LOCK IT IN
          </ThemedText>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

function DossierRow({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.dossierRow}>
      <ThemedText type="caption" style={[styles.dossierLabel, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
      <ThemedText type="bodyBold">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  progressContainer: {
    position: "absolute",
    left: Spacing.xl,
    right: Spacing.xl,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  stepIndicator: {
    minWidth: 30,
    textAlign: "right",
  },
  content: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  stepContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing["3xl"],
  },
  stepInner: {
    flex: 1,
  },
  titleSection: {
    marginBottom: Spacing["2xl"],
  },
  bigTitle: {
    fontSize: 36,
    lineHeight: 42,
    marginBottom: Spacing.sm,
  },
  questionTitle: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: Spacing["2xl"],
  },
  textInput: {
    fontSize: 18,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  multilineInput: {
    height: 120,
    paddingTop: Spacing.lg,
  },
  primaryButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: Spacing.lg,
  },
  cardList: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  identityCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    gap: Spacing.md,
  },
  selectedCard: {
    borderWidth: 2,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTextContainer: {
    flex: 1,
    gap: 2,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  domainCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    gap: Spacing.md,
  },
  domainIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  domainLabel: {
    flex: 1,
  },
  chipGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  avoidanceChip: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    gap: Spacing.md,
  },
  chipCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionsContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  suggestionChip: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  dossierCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.xl,
    marginBottom: Spacing["2xl"],
  },
  dossierRow: {
    paddingVertical: Spacing.md,
    gap: 4,
  },
  dossierLabel: {
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  dossierDivider: {
    height: 1,
  },
  warningSection: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  warningText: {
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  warningSubtext: {
    textAlign: "center",
  },
  goBackLink: {
    alignItems: "center",
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
  },
  lockInButton: {
    marginTop: 0,
  },
});

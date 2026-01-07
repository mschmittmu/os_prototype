import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface BiometricLockScreenProps {
  onSuccess: () => void;
  onSkip?: () => void;
}

export default function BiometricLockScreen({
  onSuccess,
  onSkip,
}: BiometricLockScreenProps) {
  const { theme } = useTheme();
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>("Biometric");
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const iconScale = useSharedValue(1);
  const iconOpacity = useSharedValue(1);
  const shakeX = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    checkBiometricAvailability();
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const checkBiometricAvailability = async () => {
    if (Platform.OS === "web") {
      setIsAvailable(false);
      setError("Biometric authentication is not available on web. Use the Expo Go app on your phone.");
      return;
    }

    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (!compatible) {
      setIsAvailable(false);
      setError("This device does not support biometric authentication.");
      return;
    }

    if (!enrolled) {
      setIsAvailable(false);
      setError("No biometric data enrolled. Please set up Face ID or Touch ID in device settings.");
      return;
    }

    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      setBiometricType("Face ID");
    } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      setBiometricType("Touch ID");
    }

    setIsAvailable(true);
    authenticate();
  };

  const authenticate = async () => {
    if (isAuthenticating || !isAvailable) return;

    setIsAuthenticating(true);
    setError(null);

    shakeX.value = 0;

    iconScale.value = withSpring(0.9, { damping: 15 });
    iconOpacity.value = withTiming(0.7, { duration: 200 });

    try {
      const authOptions: LocalAuthentication.LocalAuthenticationOptions = {
        promptMessage: "Verify your identity to access The Operator Standard",
        fallbackLabel: "Use passcode",
        disableDeviceFallback: false,
      };
      
      if (Platform.OS === "ios") {
        authOptions.cancelLabel = "Cancel";
      }

      const result = await LocalAuthentication.authenticateAsync(authOptions);

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        iconScale.value = withSequence(
          withSpring(1.2, { damping: 10 }),
          withSpring(1, { damping: 15 })
        );
        iconOpacity.value = withTiming(1, { duration: 200 });
        
        setTimeout(() => {
          onSuccess();
        }, 300);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        shakeX.value = withSequence(
          withTiming(-10, { duration: 50 }),
          withTiming(10, { duration: 100 }),
          withTiming(-10, { duration: 100 }),
          withTiming(10, { duration: 100 }),
          withTiming(0, { duration: 50 })
        );
        iconScale.value = withSpring(1, { damping: 15 });
        iconOpacity.value = withTiming(1, { duration: 200 });
        
        if (result.error === "user_cancel") {
          setError("Authentication cancelled");
        } else if (result.error === "user_fallback") {
          setError("Passcode authentication required");
        } else {
          setError("Authentication failed. Try again.");
        }
      }
    } catch (err) {
      setError("An error occurred during authentication.");
      iconScale.value = withSpring(1, { damping: 15 });
      iconOpacity.value = withTiming(1, { duration: 200 });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { translateX: shakeX.value },
    ],
    opacity: iconOpacity.value,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const getIcon = (): keyof typeof Feather.glyphMap => {
    if (biometricType === "Face ID") return "eye";
    if (biometricType === "Touch ID") return "smartphone";
    return "lock";
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconWrapper, pulseStyle]}>
          <Animated.View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.backgroundSecondary },
              iconAnimatedStyle,
            ]}
          >
            <Feather name={getIcon()} size={64} color={theme.accent} />
          </Animated.View>
        </Animated.View>

        <ThemedText type="h2" style={styles.title}>
          {isAvailable ? biometricType : "Security Lock"}
        </ThemedText>

        <ThemedText type="body" secondary style={styles.subtitle}>
          {isAvailable
            ? `Use ${biometricType} to unlock The Operator Standard`
            : "Secure access to your command center"}
        </ThemedText>

        {error ? (
          <View style={[styles.errorContainer, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name="alert-circle" size={16} color={theme.accent} />
            <ThemedText type="small" style={styles.errorText}>
              {error}
            </ThemedText>
          </View>
        ) : null}

        {isAvailable ? (
          <Pressable
            style={[styles.authButton, { backgroundColor: theme.accent }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              authenticate();
            }}
            disabled={isAuthenticating}
          >
            <Feather name={getIcon()} size={20} color="#FFFFFF" />
            <ThemedText type="bodyBold" style={styles.authButtonText}>
              {isAuthenticating ? "Authenticating..." : `Use ${biometricType}`}
            </ThemedText>
          </Pressable>
        ) : null}

        {onSkip ? (
          <Pressable
            style={styles.skipButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSkip();
            }}
          >
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              Skip for now
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: Spacing["3xl"],
    maxWidth: 400,
  },
  iconWrapper: {
    marginBottom: Spacing["3xl"],
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  errorText: {
    flex: 1,
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing["3xl"],
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  authButtonText: {
    color: "#FFFFFF",
  },
  skipButton: {
    paddingVertical: Spacing.md,
  },
});

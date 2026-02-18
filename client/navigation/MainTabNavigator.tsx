import React, { useState, useCallback } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet, View, Pressable, Modal } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withRepeat,
  withTiming,
  FadeIn,
} from "react-native-reanimated";

import HomeScreen from "@/screens/HomeScreen";
import ExecuteScreen from "@/screens/ExecuteScreen";
import MediaScreen from "@/screens/MediaScreen";
import SocialScreen from "@/screens/SocialScreen";
import CrewScreen from "@/screens/CrewScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { ThemedText } from "@/components/ThemedText";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import {
  getOperatorModeSession,
  saveOperatorModeSession,
  getOperatorModeConfig,
  OperatorModeSession,
  OperatorModeProtocol,
  defaultProtocols,
} from "@/lib/storage";

export type MainTabParamList = {
  HomeTab: undefined;
  ExecuteTab: undefined;
  MediaTab: undefined;
  SocialTab: undefined;
  CrewTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function HeaderIconButton({ 
  icon, 
  onPress 
}: { 
  icon: keyof typeof Feather.glyphMap; 
  onPress: () => void 
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.85, { damping: 15, stiffness: 400 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }, 100);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[styles.headerIcon, animatedStyle, { backgroundColor: theme.backgroundSecondary }]}>
        <Feather name={icon} size={22} color={theme.text} />
      </Animated.View>
    </Pressable>
  );
}

function HeaderRightButtons() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  return (
    <View style={styles.headerRight}>
      <HeaderIconButton 
        icon="bell" 
        onPress={() => {}} 
      />
      <HeaderIconButton 
        icon="user" 
        onPress={() => navigation.navigate("Profile")} 
      />
      <HeaderIconButton 
        icon="settings" 
        onPress={() => navigation.navigate("Settings")} 
      />
    </View>
  );
}

function OperatorModeHeaderButton() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<OperatorModeProtocol | null>(null);
  const [durationMinutes, setDurationMinutes] = useState(90);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useFocusEffect(
    useCallback(() => {
      const checkSession = async () => {
        const session = await getOperatorModeSession();
        setIsActive(session?.isActive || false);
      };
      checkSession();
    }, [])
  );

  React.useEffect(() => {
    glowOpacity.value = withRepeat(
      withTiming(0.8, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePress = async () => {
    scale.value = withSpring(0.85, { damping: 15, stiffness: 400 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }, 100);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const session = await getOperatorModeSession();
    if (session?.isActive) {
      navigation.navigate("OperatorModeActive");
      return;
    }

    const config = await getOperatorModeConfig();
    const allProtocols = [...defaultProtocols, ...(config.protocols.filter(p => p.isCustom))];
    const protocol = allProtocols.find(p => p.id === config.selectedProtocolId) || defaultProtocols[0];
    setSelectedProtocol(protocol);
    setDurationMinutes(config.customSettings.defaultDurationMinutes || 90);
    setShowConfirmation(true);
  };

  const handleConfirmYes = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowConfirmation(false);
    
    const protocol = selectedProtocol || defaultProtocols[0];
    
    const newSession: OperatorModeSession = {
      isActive: true,
      protocolId: protocol.id,
      protocolName: protocol.name,
      startTime: new Date().toISOString(),
      durationMinutes: durationMinutes,
      tasksCompletedAtStart: 0,
    };
    await saveOperatorModeSession(newSession);
    navigation.navigate("OperatorModeActive");
  };

  const handleConfirmNo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowConfirmation(false);
  };

  const formatDuration = (minutes: number) => {
    if (minutes === 0) return "No time limit";
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}-hour`;
    }
    return `${minutes}-minute`;
  };

  return (
    <View style={styles.headerLeft}>
      <Pressable onPress={handlePress}>
        <Animated.View style={animatedStyle}>
          {!isActive && (
            <Animated.View
              style={[
                styles.operatorGlow,
                glowStyle,
                { backgroundColor: theme.accent },
              ]}
            />
          )}
          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor: isActive ? theme.accent : theme.backgroundSecondary,
              },
            ]}
          >
            <Feather
              name="shield"
              size={20}
              color={isActive ? "#FFFFFF" : theme.accent}
            />
          </View>
        </Animated.View>
      </Pressable>

      <Modal
        visible={showConfirmation}
        transparent
        animationType="fade"
        onRequestClose={handleConfirmNo}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            entering={FadeIn.duration(200)}
            style={[styles.confirmationModal, { backgroundColor: theme.backgroundSecondary }]}
          >
            <View style={styles.confirmationIconContainer}>
              <Feather name="shield" size={48} color={theme.accent} />
            </View>
            <ThemedText type="h2" style={styles.confirmationTitle}>
              GO TO WAR?
            </ThemedText>
            <ThemedText type="body" style={[styles.confirmationSubtitle, { color: theme.textSecondary }]}>
              {selectedProtocol ? `${formatDuration(durationMinutes)} ${selectedProtocol.name} protocol` : "Loading..."}
            </ThemedText>
            <View style={styles.confirmationButtons}>
              <Pressable
                onPress={handleConfirmNo}
                style={[styles.confirmButton, styles.confirmButtonNo, { backgroundColor: theme.backgroundTertiary }]}
              >
                <ThemedText type="bodyBold" style={{ color: theme.textSecondary }}>
                  NO
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={handleConfirmYes}
                style={[styles.confirmButton, styles.confirmButtonYes, { backgroundColor: theme.accent }]}
              >
                <ThemedText type="bodyBold" style={{ color: "#FFFFFF" }}>
                  YES
                </ThemedText>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

function AnimatedTabIcon({ 
  name, 
  color, 
  size, 
  focused 
}: { 
  name: keyof typeof Feather.glyphMap; 
  color: string; 
  size: number; 
  focused: boolean;
}) {
  const scale = useSharedValue(focused ? 1.1 : 1);
  
  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 1, { 
      damping: 15, 
      stiffness: 300 
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Feather name={name} size={size} color={color} />
    </Animated.View>
  );
}

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerTitleAlign: "center",
        headerTransparent: Platform.OS === "ios",
        headerTintColor: theme.text,
        headerStyle: {
          backgroundColor: Platform.select({
            ios: "transparent",
            android: theme.backgroundRoot,
            web: theme.backgroundRoot,
          }),
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.select({
            ios: "transparent",
            android: theme.backgroundRoot,
            web: theme.backgroundRoot,
          }),
          borderTopWidth: 1,
          borderTopColor: theme.border,
          elevation: 0,
          height: 85,
          paddingBottom: Platform.OS === "ios" ? Spacing.xl : Spacing.sm,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={90}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.backgroundRoot }]} />
          ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        headerRight: () => <HeaderRightButtons />,
        headerLeft: () => <OperatorModeHeaderButton />,
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: "Home",
          headerTitle: () => <HeaderTitle />,
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon name="home" size={size} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="ExecuteTab"
        component={ExecuteScreen}
        options={{
          title: "Execution",
          headerTitle: "POWER LIST",
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon name="check-square" size={size} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="MediaTab"
        component={MediaScreen}
        options={{
          title: "Media",
          headerTitle: "MEDIA",
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon name="play-circle" size={size} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="SocialTab"
        component={SocialScreen}
        options={{
          title: "Social",
          headerTitle: "SOCIAL",
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon name="users" size={size} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="CrewTab"
        component={CrewScreen}
        options={{
          title: "Crews",
          headerTitle: "ALPHA CREW",
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon name="message-circle" size={size} color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: Spacing.lg,
    gap: Spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: Spacing.lg,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  operatorGlow: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  confirmationModal: {
    width: "100%",
    maxWidth: 320,
    borderRadius: BorderRadius.xl,
    padding: Spacing["2xl"],
    alignItems: "center",
  },
  confirmationIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(220, 38, 38, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  confirmationTitle: {
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  confirmationSubtitle: {
    textAlign: "center",
    marginBottom: Spacing["2xl"],
  },
  confirmationButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    width: "100%",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  confirmButtonNo: {},
  confirmButtonYes: {},
});

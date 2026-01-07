import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";

import HomeScreen from "@/screens/HomeScreen";
import ExecuteScreen from "@/screens/ExecuteScreen";
import MediaScreen from "@/screens/MediaScreen";
import SocialScreen from "@/screens/SocialScreen";
import CrewScreen from "@/screens/CrewScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

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
        icon="settings" 
        onPress={() => navigation.navigate("Settings")} 
      />
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
          headerTitle: "MEDIA LIBRARY",
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
          headerTitle: "COMMUNITY",
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
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});

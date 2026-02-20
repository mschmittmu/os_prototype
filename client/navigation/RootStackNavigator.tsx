import React, { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import TaskCreateScreen from "@/screens/TaskCreateScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import StatsScreen from "@/screens/StatsScreen";
import CoreValuesScreen from "@/screens/CoreValuesScreen";
import PostComposeScreen from "@/screens/PostComposeScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import VideoPlayerScreen from "@/screens/VideoPlayerScreen";
import CommentsScreen from "@/screens/CommentsScreen";
import ChallengeCreateScreen from "@/screens/ChallengeCreateScreen";
import OperatorModeSetupScreen from "@/screens/OperatorModeSetupScreen";
import OperatorModeActivationScreen from "@/screens/OperatorModeActivationScreen";
import OperatorModeActiveScreen from "@/screens/OperatorModeActiveScreen";
import OperatorModeCompleteScreen from "@/screens/OperatorModeCompleteScreen";
import OnboardingScreen from "@/screens/OnboardingScreen";
import MorningBriefScreen from "@/screens/MorningBriefScreen";
import ProofCaptureScreen from "@/screens/ProofCaptureScreen";
import ProofVaultScreen from "@/screens/ProofVaultScreen";
import GroupBoardScreen from "@/screens/GroupBoardScreen";
import GroupThreadScreen from "@/screens/GroupThreadScreen";
import CreateGroupScreen from "@/screens/CreateGroupScreen";
import CreateThreadScreen from "@/screens/CreateThreadScreen";
import SavedPostsScreen from "@/screens/SavedPostsScreen";
import NightReflectionScreen from "@/screens/NightReflectionScreen";
import LifeScoreScreen from "@/screens/LifeScoreScreen";
import StrikeHistoryScreen from "@/screens/StrikeHistoryScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useTheme } from "@/hooks/useTheme";
import { getOnboardingState, getMorningBriefState } from "@/lib/storage";

export type RootStackParamList = {
  Onboarding: undefined;
  MorningBrief: undefined;
  Main: undefined;
  ProofCapture: {
    triggerId: string;
    triggerType: string;
    triggerLabel: string;
    message: string;
  };
  ProofVault: undefined;
  GroupBoard: { groupId: string; groupName: string };
  GroupThread: { threadId: string; threadTitle: string; groupId: string };
  CreateGroup: undefined;
  CreateThread: { groupId: string };
  SavedPosts: undefined;
  NightReflection: undefined;
  LifeScore: undefined;
  StrikeHistory: undefined;
  TaskCreate: { taskId?: string } | undefined;
  Profile: undefined;
  Stats: undefined;
  CoreValues: undefined;
  PostCompose: undefined;
  Settings: undefined;
  VideoPlayer: { videoUrl: string; title: string };
  Comments: { postId: string; postAuthor: string; postContent: string };
  ChallengeCreate: undefined;
  OperatorModeSetup: undefined;
  OperatorModeActivation: undefined;
  OperatorModeActive: undefined;
  OperatorModeComplete: {
    exitedEarly: boolean;
    duration: number;
    tasksCompleted: number;
    totalTasks: number;
    protocolName: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>("Onboarding");

  useEffect(() => {
    const checkState = async () => {
      const onboarding = await getOnboardingState();
      if (!onboarding?.isComplete) {
        setInitialRoute("Onboarding");
        setIsLoading(false);
        return;
      }
      const briefState = await getMorningBriefState();
      const today = new Date().toISOString().split("T")[0];
      if (!briefState || briefState.lastShownDate !== today || !briefState.dismissed) {
        setInitialRoute("MorningBrief");
      } else {
        setInitialRoute("Main");
      }
      setIsLoading(false);
    };
    checkState();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.backgroundRoot }}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        ...screenOptions,
        headerStyle: {
          backgroundColor: theme.backgroundRoot,
        },
        headerTintColor: theme.text,
        contentStyle: {
          backgroundColor: theme.backgroundRoot,
        },
      }}
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="MorningBrief"
        component={MorningBriefScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskCreate"
        component={TaskCreateScreen}
        options={{
          presentation: "modal",
          headerTitle: "New Task",
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: "Profile",
        }}
      />
      <Stack.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          headerTitle: "Stats",
        }}
      />
      <Stack.Screen
        name="CoreValues"
        component={CoreValuesScreen}
        options={{
          headerTitle: "Core Values",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="PostCompose"
        component={PostComposeScreen}
        options={{
          presentation: "modal",
          headerTitle: "New Post",
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerTitle: "Settings",
        }}
      />
      <Stack.Screen
        name="VideoPlayer"
        component={VideoPlayerScreen}
        options={({ route }) => ({
          headerTitle: route.params.title,
          presentation: "fullScreenModal",
        })}
      />
      <Stack.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
          headerTitle: "Comments",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="ChallengeCreate"
        component={ChallengeCreateScreen}
        options={{
          headerTitle: "New Challenge",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="OperatorModeSetup"
        component={OperatorModeSetupScreen}
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen
        name="OperatorModeActivation"
        component={OperatorModeActivationScreen}
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen
        name="OperatorModeActive"
        component={OperatorModeActiveScreen}
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="OperatorModeComplete"
        component={OperatorModeCompleteScreen}
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="ProofCapture"
        component={ProofCaptureScreen}
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="ProofVault"
        component={ProofVaultScreen}
        options={{
          headerTitle: "PROOF VAULT",
        }}
      />
      <Stack.Screen
        name="SavedPosts"
        component={SavedPostsScreen}
        options={{
          headerTitle: "SAVED",
          headerTitleStyle: { fontWeight: "700", fontSize: 14 },
        }}
      />
      <Stack.Screen
        name="NightReflection"
        component={NightReflectionScreen}
        options={{
          headerTitle: "DAILY DEBRIEF",
          headerTitleStyle: { fontWeight: "700", fontSize: 14 },
        }}
      />
      <Stack.Screen
        name="LifeScore"
        component={LifeScoreScreen}
        options={{
          headerTitle: "LIFE SCORE",
          headerTitleStyle: { fontWeight: "700", fontSize: 14 },
        }}
      />
      <Stack.Screen
        name="StrikeHistory"
        component={StrikeHistoryScreen}
        options={{
          headerTitle: "STRIKE HISTORY",
          headerTitleStyle: { fontWeight: "700", fontSize: 14 },
        }}
      />
      <Stack.Screen
        name="GroupBoard"
        component={GroupBoardScreen}
        options={({ route }) => ({
          headerTitle: route.params.groupName.toUpperCase(),
        })}
      />
      <Stack.Screen
        name="GroupThread"
        component={GroupThreadScreen}
        options={{
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="CreateGroup"
        component={CreateGroupScreen}
        options={{
          headerTitle: "CREATE GROUP",
        }}
      />
      <Stack.Screen
        name="CreateThread"
        component={CreateThreadScreen}
        options={{
          headerTitle: "NEW THREAD",
        }}
      />
    </Stack.Navigator>
  );
}

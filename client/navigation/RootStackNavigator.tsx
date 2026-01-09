import React from "react";
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
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useTheme } from "@/hooks/useTheme";

export type RootStackParamList = {
  Main: undefined;
  TaskCreate: { taskId?: string } | undefined;
  Profile: undefined;
  Stats: undefined;
  CoreValues: undefined;
  PostCompose: undefined;
  Settings: undefined;
  VideoPlayer: { videoUrl: string; title: string };
  Comments: { postId: string; postAuthor: string; postContent: string };
  ChallengeCreate: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const { theme } = useTheme();

  return (
    <Stack.Navigator
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
    </Stack.Navigator>
  );
}

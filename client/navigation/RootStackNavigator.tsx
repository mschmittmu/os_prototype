import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import TaskCreateScreen from "@/screens/TaskCreateScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import StatsScreen from "@/screens/StatsScreen";
import CoreValuesScreen from "@/screens/CoreValuesScreen";
import PostComposeScreen from "@/screens/PostComposeScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { Colors } from "@/constants/theme";

export type RootStackParamList = {
  Main: undefined;
  TaskCreate: { taskId?: string } | undefined;
  Profile: undefined;
  Stats: undefined;
  CoreValues: undefined;
  PostCompose: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStyle: {
          backgroundColor: Colors.dark.backgroundRoot,
        },
        headerTintColor: Colors.dark.text,
        contentStyle: {
          backgroundColor: Colors.dark.backgroundRoot,
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
    </Stack.Navigator>
  );
}

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function CreateThreadScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePost = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Required", "Please fill in title and content.");
      return;
    }
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Alert.alert("Thread Posted!");
    navigation.goBack();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>THREAD TITLE</ThemedText>
        <TextInput
          style={[styles.input, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary, color: theme.text }]}
          value={title}
          onChangeText={(t) => setTitle(t.slice(0, 100))}
          placeholder="Enter thread title..."
          placeholderTextColor={theme.textSecondary}
          maxLength={100}
        />
        <ThemedText type="caption" secondary style={styles.counter}>{title.length}/100</ThemedText>
      </View>

      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>CONTENT</ThemedText>
        <TextInput
          style={[styles.input, styles.contentInput, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary, color: theme.text }]}
          value={content}
          onChangeText={setContent}
          placeholder="Share your thoughts..."
          placeholderTextColor={theme.textSecondary}
          multiline
          textAlignVertical="top"
        />
      </View>

      <Pressable
        style={[styles.postBtn, { backgroundColor: theme.accent }]}
        onPress={handlePost}
      >
        <ThemedText type="bodyBold" style={{ color: "#FFF", letterSpacing: 1 }}>
          POST THREAD
        </ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.xl,
    paddingBottom: Spacing["5xl"],
  },
  field: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 15,
  },
  contentInput: {
    minHeight: 200,
    textAlignVertical: "top",
  },
  counter: {
    textAlign: "right",
  },
  postBtn: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    marginTop: Spacing.lg,
  },
});

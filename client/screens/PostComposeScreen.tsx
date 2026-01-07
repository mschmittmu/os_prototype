import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "PostCompose">;

const MAX_CHARACTERS = 500;

export default function PostComposeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [content, setContent] = useState("");

  const handlePost = () => {
    if (!content.trim()) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.goBack();
  };

  const remainingChars = MAX_CHARACTERS - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + Spacing.xl },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
          <ThemedText type="bodyBold" style={{ color: "#FFFFFF" }}>O</ThemedText>
        </View>
        <View style={styles.headerText}>
          <ThemedText type="bodyBold">Operator</ThemedText>
          <ThemedText type="caption" secondary>
            Posting to General
          </ThemedText>
        </View>
      </View>

      <View style={[styles.inputContainer, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Share your wins, lessons, or rally the crew..."
          placeholderTextColor={theme.textSecondary}
          value={content}
          onChangeText={setContent}
          multiline
          autoFocus
          maxLength={MAX_CHARACTERS + 50}
        />
      </View>

      <ThemedText type="caption" secondary style={styles.sectionLabel}>
        ADD MEDIA
      </ThemedText>

      <View style={styles.attachments}>
        <Pressable 
          style={[styles.attachButton, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
          onPress={() => Haptics.selectionAsync()}
        >
          <View style={[styles.iconContainer, { backgroundColor: theme.accent + "15" }]}>
            <Feather name="image" size={20} color={theme.accent} />
          </View>
          <ThemedText type="small">Photo</ThemedText>
        </Pressable>
        <Pressable 
          style={[styles.attachButton, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
          onPress={() => Haptics.selectionAsync()}
        >
          <View style={[styles.iconContainer, { backgroundColor: theme.navy + "15" }]}>
            <Feather name="video" size={20} color={theme.navy} />
          </View>
          <ThemedText type="small">Video</ThemedText>
        </Pressable>
        <Pressable 
          style={[styles.attachButton, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
          onPress={() => Haptics.selectionAsync()}
        >
          <View style={[styles.iconContainer, { backgroundColor: theme.success + "15" }]}>
            <Feather name="target" size={20} color={theme.success} />
          </View>
          <ThemedText type="small">Challenge</ThemedText>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <ThemedText
          type="caption"
          style={[
            { color: theme.textSecondary },
            isOverLimit && { color: theme.error },
            remainingChars <= 50 && remainingChars > 0 && { color: theme.warning },
          ]}
        >
          {remainingChars}
        </ThemedText>
        <Button
          onPress={handlePost}
          disabled={!content.trim() || isOverLimit}
          style={styles.postButton}
        >
          Post
        </Button>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  headerText: {
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  input: {
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 120,
    lineHeight: 24,
  },
  sectionLabel: {
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
    letterSpacing: 1,
  },
  attachments: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  attachButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: Spacing.lg,
    marginTop: "auto",
    paddingTop: Spacing.xl,
  },
  postButton: {
    paddingHorizontal: Spacing["3xl"],
  },
});

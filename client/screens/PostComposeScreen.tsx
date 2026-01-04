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
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "PostCompose">;

const MAX_CHARACTERS = 500;

export default function PostComposeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
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
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + Spacing.xl },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <ThemedText type="bodyBold">O</ThemedText>
        </View>
        <View>
          <ThemedText type="bodyBold">Operator</ThemedText>
          <ThemedText type="caption" secondary>
            Posting to General
          </ThemedText>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="What's new? Add a pic or video for impact."
        placeholderTextColor={Colors.dark.textSecondary}
        value={content}
        onChangeText={setContent}
        multiline
        autoFocus
        maxLength={MAX_CHARACTERS + 50}
      />

      <View style={styles.attachments}>
        <Pressable style={styles.attachButton}>
          <Feather name="image" size={24} color={Colors.dark.textSecondary} />
          <ThemedText type="small" secondary>
            Photo
          </ThemedText>
        </Pressable>
        <Pressable style={styles.attachButton}>
          <Feather name="video" size={24} color={Colors.dark.textSecondary} />
          <ThemedText type="small" secondary>
            Video
          </ThemedText>
        </Pressable>
        <Pressable style={styles.attachButton}>
          <Feather name="target" size={24} color={Colors.dark.textSecondary} />
          <ThemedText type="small" secondary>
            Challenge
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <ThemedText
          type="caption"
          style={[
            styles.charCount,
            isOverLimit && styles.charCountOver,
            remainingChars <= 50 && remainingChars > 0 && styles.charCountWarning,
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
    backgroundColor: Colors.dark.backgroundRoot,
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.backgroundDefault,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 18,
    textAlignVertical: "top",
    minHeight: 150,
  },
  attachments: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  attachButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.backgroundDefault,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  charCount: {
    color: Colors.dark.textSecondary,
  },
  charCountWarning: {
    color: Colors.dark.warning,
  },
  charCountOver: {
    color: Colors.dark.error,
  },
  postButton: {
    paddingHorizontal: Spacing["3xl"],
  },
});

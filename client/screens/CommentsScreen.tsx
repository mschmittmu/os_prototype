import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { sampleComments, Comment } from "@/lib/mockData";

type CommentsRouteProp = RouteProp<RootStackParamList, "Comments">;

function getTierColor(tier: string): string {
  switch (tier) {
    case "Creator":
      return "#E31837";
    case "Founder":
      return "#F59E0B";
    case "Elite":
      return "#10B981";
    case "Operator":
      return "#3B82F6";
    default:
      return "#6B7280";
  }
}

export default function CommentsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<CommentsRouteProp>();
  const insets = useSafeAreaInsets();
  const { postId, postAuthor, postContent } = route.params;

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const existingComments = sampleComments[postId] || [];
    setComments(existingComments);
  }, [postId]);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const comment: Comment = {
      id: `new-${Date.now()}`,
      author: { name: "You", tier: "Member" },
      content: newComment.trim(),
      timestamp: "Just now",
      likes: 0,
      liked: false,
    };

    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  };

  const handleLikeComment = (commentId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  };

  const renderComment = ({ item, index }: { item: Comment; index: number }) => (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 50)}
      style={[styles.commentCard, { backgroundColor: theme.backgroundSecondary }]}
    >
      <View style={styles.commentHeader}>
        <View style={[styles.avatar, { backgroundColor: getTierColor(item.author.tier) }]}>
          <ThemedText type="bodyBold" style={styles.avatarText}>
            {item.author.name.charAt(0)}
          </ThemedText>
        </View>
        <View style={styles.authorInfo}>
          <View style={styles.nameRow}>
            <ThemedText type="bodyBold">{item.author.name}</ThemedText>
            <View style={[styles.tierBadge, { backgroundColor: getTierColor(item.author.tier) + "20" }]}>
              <ThemedText type="caption" style={{ color: getTierColor(item.author.tier) }}>
                {item.author.tier}
              </ThemedText>
            </View>
          </View>
          <ThemedText type="caption" secondary>
            {item.timestamp}
          </ThemedText>
        </View>
      </View>
      <ThemedText type="body" style={styles.commentContent}>
        {item.content}
      </ThemedText>
      <Pressable
        style={styles.likeButton}
        onPress={() => handleLikeComment(item.id)}
      >
        <Feather
          name={item.liked ? "heart" : "heart"}
          size={16}
          color={item.liked ? theme.accent : theme.textSecondary}
          style={{ opacity: item.liked ? 1 : 0.7 }}
        />
        <ThemedText
          type="caption"
          style={{ color: item.liked ? theme.accent : theme.textSecondary, marginLeft: 4 }}
        >
          {item.likes}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={[styles.originalPost, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText type="bodyBold" style={styles.originalLabel}>
              Original Post
            </ThemedText>
            <ThemedText type="caption" secondary style={styles.originalAuthor}>
              {postAuthor}
            </ThemedText>
            <ThemedText type="body">{postContent}</ThemedText>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="message-circle" size={48} color={theme.textSecondary} />
            <ThemedText type="body" secondary style={styles.emptyText}>
              No comments yet. Be the first!
            </ThemedText>
          </View>
        }
      />

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: theme.backgroundSecondary, paddingBottom: insets.bottom + Spacing.md },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.backgroundRoot, color: theme.text },
          ]}
          placeholder="Add a comment..."
          placeholderTextColor={theme.textSecondary}
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={500}
        />
        <Pressable
          style={[
            styles.sendButton,
            { backgroundColor: newComment.trim() ? theme.accent : theme.backgroundRoot },
          ]}
          onPress={handleSubmitComment}
          disabled={!newComment.trim()}
        >
          <Feather
            name="send"
            size={20}
            color={newComment.trim() ? "#FFF" : theme.textSecondary}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  originalPost: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
  },
  originalLabel: {
    marginBottom: Spacing.xs,
    opacity: 0.6,
  },
  originalAuthor: {
    marginBottom: Spacing.sm,
  },
  commentCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFF",
    fontSize: 14,
  },
  authorInfo: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  tierBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  commentContent: {
    lineHeight: 22,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    alignSelf: "flex-start",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing["4xl"],
    gap: Spacing.md,
  },
  emptyText: {
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: Spacing.md,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});

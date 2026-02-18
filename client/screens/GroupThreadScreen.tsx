import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { forumPosts, forumThreads, ForumPost } from "@/lib/mockData";

type RouteProp = NativeStackScreenProps<RootStackParamList, "GroupThread">["route"];

export default function GroupThreadScreen() {
  const { theme } = useTheme();
  const route = useRoute<RouteProp>();
  const insets = useSafeAreaInsets();
  const { threadId, threadTitle } = route.params;
  const [replyText, setReplyText] = useState("");
  const [posts, setPosts] = useState(() => forumPosts.filter(p => p.threadId === threadId));

  const thread = forumThreads.find(t => t.id === threadId);

  const handleLike = (postId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Alert.alert("Reply posted!");
    setReplyText("");
  };

  const renderPost = ({ item, index }: { item: ForumPost; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(300)}
      style={[styles.postCard, { borderBottomColor: theme.border }]}
    >
      <View style={styles.postHeader}>
        <View style={styles.postAuthorRow}>
          <ThemedText type="bodyBold" style={{ fontSize: 14 }}>{item.author.name}</ThemedText>
          <View style={[styles.tierBadge, { backgroundColor: theme.backgroundTertiary }]}>
            <ThemedText type="caption" secondary style={{ fontSize: 10 }}>{item.author.tier}</ThemedText>
          </View>
          <ThemedText type="caption" secondary style={{ fontSize: 11 }}>
            {item.author.streak > 0 ? `${item.author.streak} streak` : ""}
          </ThemedText>
          {item.isOP ? (
            <View style={[styles.opBadge, { backgroundColor: theme.accent }]}>
              <ThemedText type="caption" style={{ color: "#FFF", fontSize: 9, fontWeight: "700" }}>OP</ThemedText>
            </View>
          ) : null}
        </View>
        <View style={styles.postHeaderRight}>
          <ThemedText type="caption" secondary>{item.createdAt}</ThemedText>
          <ThemedText type="caption" secondary style={{ fontSize: 10 }}>#{index + 1}</ThemedText>
        </View>
      </View>

      <ThemedText type="caption" secondary style={{ marginBottom: Spacing.sm }}>
        Posts: {item.author.postCount} · Joined {item.author.joinDate}
      </ThemedText>

      {item.quoteOf ? (
        <View style={[styles.quoteBlock, { borderLeftColor: theme.border, backgroundColor: theme.backgroundTertiary }]}>
          <ThemedText type="caption" secondary style={{ fontStyle: "italic", marginBottom: 2 }}>
            {item.quotedAuthor} wrote:
          </ThemedText>
          <ThemedText type="caption" secondary style={{ fontStyle: "italic" }}>
            {item.quotedContent}
          </ThemedText>
        </View>
      ) : null}

      <ThemedText type="body" style={styles.postContent}>
        {item.content}
      </ThemedText>

      <View style={[styles.postActions, { borderTopColor: theme.border }]}>
        <Pressable style={styles.actionBtn} onPress={() => handleLike(item.id)}>
          <Feather
            name="heart"
            size={14}
            color={item.liked ? theme.accent : theme.textSecondary}
          />
          <ThemedText type="caption" secondary>{item.likes}</ThemedText>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={() => {
          if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          Alert.alert("Quote feature coming soon!");
        }}>
          <ThemedText type="caption" secondary style={{ fontWeight: "600" }}>Quote</ThemedText>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={() => {
          if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          Alert.alert("Reply feature coming soon!");
        }}>
          <ThemedText type="caption" secondary style={{ fontWeight: "600" }}>Reply</ThemedText>
        </Pressable>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListHeaderComponent={
          <View style={[styles.threadHeader, { borderBottomColor: theme.border }]}>
            <ThemedText type="h3" style={{ lineHeight: 24 }}>{threadTitle}</ThemedText>
            {thread ? (
              <ThemedText type="caption" secondary style={{ marginTop: Spacing.xs }}>
                by {thread.author.name} ({thread.author.tier}) · {thread.createdAt} · {thread.replyCount} replies · {thread.viewCount.toLocaleString()} views
              </ThemedText>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <ThemedText type="body" secondary>No posts in this thread.</ThemedText>
          </View>
        }
      />

      <View style={[styles.replyBar, { backgroundColor: theme.backgroundSecondary, borderTopColor: theme.border, paddingBottom: insets.bottom > 0 ? insets.bottom : Spacing.sm }]}>
        <TextInput
          style={[styles.replyInput, { backgroundColor: theme.backgroundRoot, borderColor: theme.border, color: theme.text }]}
          placeholder="Write a reply..."
          placeholderTextColor={theme.textSecondary}
          value={replyText}
          onChangeText={setReplyText}
          multiline
          maxLength={1000}
          numberOfLines={3}
        />
        <Pressable
          style={[styles.postBtn, { backgroundColor: theme.accent, opacity: replyText.trim() ? 1 : 0.5 }]}
          onPress={handleReply}
          disabled={!replyText.trim()}
        >
          <ThemedText type="small" style={{ color: "#FFF", fontWeight: "700", letterSpacing: 1 }}>POST</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  threadHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 2,
  },
  postCard: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  postAuthorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    flex: 1,
    flexWrap: "wrap",
  },
  postHeaderRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  tierBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.sm,
  },
  opBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.sm,
  },
  quoteBlock: {
    borderLeftWidth: 4,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xl,
    borderTopWidth: 1,
    paddingTop: Spacing.sm,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  replyBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 14,
    maxHeight: 80,
  },
  postBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing["4xl"],
  },
});

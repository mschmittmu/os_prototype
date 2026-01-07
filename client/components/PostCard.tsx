import React, { useState } from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface PostCardProps {
  id: string;
  author: {
    name: string;
    avatar?: string;
    tier: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked?: boolean;
  saved?: boolean;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onSave: (id: string) => void;
}

export function PostCard({
  id,
  author,
  content,
  image,
  likes,
  comments,
  timestamp,
  liked = false,
  saved = false,
  onLike,
  onComment,
  onSave,
}: PostCardProps) {
  const { theme } = useTheme();
  const [isLiked, setIsLiked] = useState(liked);
  const [isSaved, setIsSaved] = useState(saved);
  const [likeCount, setLikeCount] = useState(likes);
  const heartScale = useSharedValue(1);

  const tierColors: Record<string, string> = {
    Operator: theme.accent,
    Founder: "#FFD700",
    Elite: "#8B5CF6",
    Member: theme.textSecondary,
  };

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    heartScale.value = withSequence(
      withSpring(1.3, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    onLike(id);
  };

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSaved(!isSaved);
    onSave(id);
  };

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const tierColor = tierColors[author.tier] || theme.textSecondary;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundRoot, borderColor: theme.border },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {author.avatar ? (
            <Image source={{ uri: author.avatar }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <ThemedText type="bodyBold" style={styles.avatarText}>
                {author.name.charAt(0).toUpperCase()}
              </ThemedText>
            </View>
          )}
        </View>
        <View style={styles.authorInfo}>
          <ThemedText type="bodyBold">{author.name}</ThemedText>
          <View style={styles.tierRow}>
            <View style={[styles.tierBadge, { backgroundColor: tierColor }]}>
              <ThemedText type="caption" style={styles.tierText}>
                {author.tier}
              </ThemedText>
            </View>
            <ThemedText type="caption" secondary>
              {timestamp}
            </ThemedText>
          </View>
        </View>
        <Pressable
          style={styles.moreButton}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <Feather
            name="more-horizontal"
            size={20}
            color={theme.textSecondary}
          />
        </Pressable>
      </View>

      <ThemedText type="body" style={styles.content}>
        {content}
      </ThemedText>

      {image ? (
        <Image source={{ uri: image }} style={styles.postImage} />
      ) : null}

      <View style={[styles.actions, { borderTopColor: theme.border }]}>
        <Pressable style={styles.actionButton} onPress={handleLike}>
          <Animated.View style={heartAnimatedStyle}>
            <Feather
              name="heart"
              size={20}
              color={isLiked ? theme.accent : theme.textSecondary}
            />
          </Animated.View>
          <ThemedText type="small" secondary style={styles.actionText}>
            {likeCount}
          </ThemedText>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onComment(id);
          }}
        >
          <Feather
            name="message-circle"
            size={20}
            color={theme.textSecondary}
          />
          <ThemedText type="small" secondary style={styles.actionText}>
            {comments}
          </ThemedText>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={handleSave}>
          <Feather
            name="bookmark"
            size={20}
            color={isSaved ? theme.accent : theme.textSecondary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  avatarContainer: {
    marginRight: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {},
  authorInfo: {
    flex: 1,
  },
  tierRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
    gap: Spacing.sm,
  },
  tierBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  tierText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  moreButton: {
    padding: Spacing.sm,
  },
  content: {
    marginBottom: Spacing.md,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.xl,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  actionText: {},
});

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
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

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

const tierColors: Record<string, string> = {
  Operator: Colors.dark.accent,
  Founder: "#FFD700",
  Elite: "#8B5CF6",
  Member: Colors.dark.textSecondary,
};

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
  const [isLiked, setIsLiked] = useState(liked);
  const [isSaved, setIsSaved] = useState(saved);
  const [likeCount, setLikeCount] = useState(likes);
  const heartScale = useSharedValue(1);

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSaved(!isSaved);
    onSave(id);
  };

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const tierColor = tierColors[author.tier] || Colors.dark.textSecondary;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {author.avatar ? (
            <Image source={{ uri: author.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <ThemedText type="bodyBold">
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
        <Pressable style={styles.moreButton}>
          <Feather name="more-horizontal" size={20} color={Colors.dark.textSecondary} />
        </Pressable>
      </View>

      <ThemedText type="body" style={styles.content}>
        {content}
      </ThemedText>

      {image ? (
        <Image source={{ uri: image }} style={styles.postImage} />
      ) : null}

      <View style={styles.actions}>
        <Pressable style={styles.actionButton} onPress={handleLike}>
          <Animated.View style={heartAnimatedStyle}>
            <Feather
              name={isLiked ? "heart" : "heart"}
              size={20}
              color={isLiked ? Colors.dark.accent : Colors.dark.textSecondary}
            />
          </Animated.View>
          <ThemedText type="small" secondary style={styles.actionText}>
            {likeCount}
          </ThemedText>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={() => onComment(id)}>
          <Feather name="message-circle" size={20} color={Colors.dark.textSecondary} />
          <ThemedText type="small" secondary style={styles.actionText}>
            {comments}
          </ThemedText>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={handleSave}>
          <Feather
            name={isSaved ? "bookmark" : "bookmark"}
            size={20}
            color={isSaved ? Colors.dark.accent : Colors.dark.textSecondary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
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
    backgroundColor: Colors.dark.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
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
    borderRadius: BorderRadius.xs,
  },
  tierText: {
    color: Colors.dark.backgroundRoot,
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
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.xl,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  actionText: {},
});

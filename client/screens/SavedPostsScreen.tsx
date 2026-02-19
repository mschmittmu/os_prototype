import React, { useState } from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { PostCard } from "@/components/PostCard";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { posts, announcements } from "@/lib/mockData";

type SavedItem =
  | { type: "post"; data: (typeof posts)[0] }
  | { type: "announcement"; data: (typeof announcements)[0] };

export default function SavedPostsScreen() {
  const { theme } = useTheme();

  const initialItems: SavedItem[] = [
    ...announcements
      .filter((a) => a.saved)
      .map((a) => ({ type: "announcement" as const, data: a })),
    ...posts
      .filter((p) => p.saved)
      .map((p) => ({ type: "post" as const, data: p })),
  ];

  const [items, setItems] = useState<SavedItem[]>(initialItems);

  const handleUnsave = (id: string, type: "post" | "announcement") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setItems((prev) =>
      prev.filter((item) => !(item.type === type && item.data.id === id))
    );
  };

  const renderAnnouncementCard = (item: (typeof announcements)[0], index: number) => (
    <Animated.View
      key={item.id}
      entering={FadeInDown.duration(400).delay(index * 80)}
    >
      <View
        style={[
          styles.announcementCard,
          { backgroundColor: theme.backgroundRoot, borderColor: theme.border },
        ]}
      >
        <View style={styles.announcementHeader}>
          <View
            style={[styles.announcementAvatar, { backgroundColor: theme.accent }]}
          >
            <ThemedText type="bodyBold" style={{ color: "#FFF" }}>
              AF
            </ThemedText>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.authorRow}>
              <ThemedText type="bodyBold">Andy Frisella</ThemedText>
              <Feather name="check-circle" size={14} color={theme.accent} />
            </View>
            <View style={styles.tierRow}>
              <View style={[styles.tierBadge, { backgroundColor: theme.accent }]}>
                <ThemedText type="caption" style={{ color: "#FFF", fontWeight: "600" }}>
                  Creator
                </ThemedText>
              </View>
              <ThemedText type="caption" secondary>
                {item.timestamp}
              </ThemedText>
            </View>
          </View>
          <Pressable
            onPress={() => handleUnsave(item.id, "announcement")}
            style={styles.bookmarkBtn}
          >
            <Feather name="bookmark" size={20} color={theme.accent} />
          </Pressable>
        </View>
        <ThemedText type="body" style={styles.announcementContent}>
          {item.content}
        </ThemedText>
      </View>
    </Animated.View>
  );

  const renderItem = ({ item, index }: { item: SavedItem; index: number }) => {
    if (item.type === "announcement") {
      return renderAnnouncementCard(item.data, index);
    }

    return (
      <Animated.View entering={FadeInDown.duration(400).delay(index * 80)}>
        <PostCard
          id={item.data.id}
          author={item.data.author}
          content={item.data.content}
          likes={item.data.likes}
          comments={item.data.comments}
          timestamp={item.data.timestamp}
          liked={item.data.liked}
          saved={true}
          onLike={() => {}}
          onComment={() => {}}
          onSave={() => handleUnsave(item.data.id, "post")}
        />
      </Animated.View>
    );
  };

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={styles.listContent}
      data={items}
      keyExtractor={(item) => `${item.type}-${item.data.id}`}
      renderItem={renderItem}
      ListHeaderComponent={
        <View style={styles.header}>
          <Feather name="bookmark" size={24} color={theme.accent} />
          <ThemedText type="bodyBold" style={{ letterSpacing: 2 }}>
            SAVED ITEMS
          </ThemedText>
          <View style={[styles.countBadge, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText type="caption" style={{ color: theme.accent, fontWeight: "700" }}>
              {items.length}
            </ThemedText>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Feather name="bookmark" size={48} color={theme.textSecondary} />
          <ThemedText type="bodyBold" secondary style={{ marginTop: Spacing.lg }}>
            No saved posts yet
          </ThemedText>
          <ThemedText type="small" secondary style={{ textAlign: "center", marginTop: Spacing.sm }}>
            Bookmark posts from the feed to save them here.
          </ThemedText>
        </View>
      }
      ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing["4xl"],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  countBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    minWidth: 24,
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["4xl"],
  },
  announcementCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  announcementHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  announcementAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  tierRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  tierBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  bookmarkBtn: {
    padding: Spacing.sm,
  },
  announcementContent: {
    lineHeight: 22,
  },
});

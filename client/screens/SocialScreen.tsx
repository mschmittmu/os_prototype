import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { PostCard } from "@/components/PostCard";
import { FAB } from "@/components/FAB";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { posts as initialPosts, announcements as initialAnnouncements, Announcement } from "@/lib/mockData";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TABS = ["Announcements", "General", "Founders", "Saved"];

function AnnouncementCard({
  announcement,
  onLike,
  onComment,
  onSave,
}: {
  announcement: Announcement;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onSave: (id: string) => void;
}) {
  const { theme } = useTheme();

  return (
    <View style={[styles.announcementCard, { backgroundColor: theme.backgroundSecondary }]}>
      <View style={styles.announcementHeader}>
        <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
          <ThemedText type="bodyBold" style={styles.avatarText}>
            AF
          </ThemedText>
        </View>
        <View style={styles.authorInfo}>
          <View style={styles.nameRow}>
            <ThemedText type="bodyBold">{announcement.author.name}</ThemedText>
            <Feather name="check-circle" size={14} color={theme.accent} />
            <View style={[styles.tierBadge, { backgroundColor: theme.accent + "20" }]}>
              <ThemedText type="caption" style={{ color: theme.accent }}>
                {announcement.author.tier}
              </ThemedText>
            </View>
          </View>
          <ThemedText type="caption" secondary>
            {announcement.timestamp}
          </ThemedText>
        </View>
      </View>

      <ThemedText type="body" style={styles.announcementContent}>
        {announcement.content}
      </ThemedText>

      <View style={styles.announcementActions}>
        <Pressable style={styles.actionButton} onPress={() => onLike(announcement.id)}>
          <Feather
            name="heart"
            size={18}
            color={announcement.liked ? theme.accent : theme.textSecondary}
          />
          <ThemedText type="caption" secondary>
            {announcement.likes.toLocaleString()}
          </ThemedText>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={() => onComment(announcement.id)}>
          <Feather name="message-circle" size={18} color={theme.textSecondary} />
          <ThemedText type="caption" secondary>
            {announcement.comments.toLocaleString()}
          </ThemedText>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={() => onSave(announcement.id)}>
          <Feather
            name={announcement.saved ? "bookmark" : "bookmark"}
            size={18}
            color={announcement.saved ? theme.accent : theme.textSecondary}
          />
        </Pressable>
      </View>
    </View>
  );
}

export default function SocialScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const [selectedTab, setSelectedTab] = useState("Announcements");
  const [posts, setPosts] = useState(initialPosts);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleLike = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handleAnnouncementLike = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, liked: !a.liked, likes: a.liked ? a.likes - 1 : a.likes + 1 }
          : a
      )
    );
  };

  const handleComment = (id: string, author: string, content: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Comments", {
      postId: id,
      postAuthor: author,
      postContent: content,
    });
  };

  const handleSave = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
    );
  };

  const handleAnnouncementSave = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, saved: !a.saved } : a))
    );
  };

  const handleTabChange = (tab: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTab(tab);
  };

  const filteredPosts =
    selectedTab === "Saved"
      ? posts.filter((p) => p.saved)
      : selectedTab === "Founders"
        ? posts.filter((p) => p.author.tier === "Founder")
        : posts;

  const savedAnnouncements = announcements.filter((a) => a.saved);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: headerHeight,
            paddingBottom: tabBarHeight + Spacing["4xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent}
          />
        }
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarScroll}
        >
          <Animated.View style={[styles.tabBar, { backgroundColor: theme.backgroundSecondary }]} entering={FadeInDown.duration(400)}>
            {TABS.map((tab) => (
              <Pressable
                key={tab}
                style={[
                  styles.tab,
                  selectedTab === tab && [styles.tabActive, { backgroundColor: theme.backgroundRoot }],
                ]}
                onPress={() => handleTabChange(tab)}
              >
                <ThemedText
                  type="bodyBold"
                  style={[
                    { color: theme.textSecondary, fontSize: 13 },
                    selectedTab === tab && { color: theme.text },
                  ]}
                >
                  {tab}
                </ThemedText>
              </Pressable>
            ))}
          </Animated.View>
        </ScrollView>

        {selectedTab === "Announcements" ? (
          <View style={styles.postList}>
            {announcements.map((announcement, index) => (
              <Animated.View
                key={announcement.id}
                entering={FadeInDown.duration(400).delay(100 + index * 50)}
              >
                <AnnouncementCard
                  announcement={announcement}
                  onLike={handleAnnouncementLike}
                  onComment={(id) => {
                    const a = announcements.find((ann) => ann.id === id);
                    if (a) {
                      handleComment(id, a.author.name, a.content);
                    }
                  }}
                  onSave={handleAnnouncementSave}
                />
              </Animated.View>
            ))}
          </View>
        ) : (
          <View style={styles.postList}>
            {selectedTab === "Saved" && savedAnnouncements.length > 0 ? (
              savedAnnouncements.map((announcement, index) => (
                <Animated.View
                  key={announcement.id}
                  entering={FadeInDown.duration(400).delay(100 + index * 50)}
                >
                  <AnnouncementCard
                    announcement={announcement}
                    onLike={handleAnnouncementLike}
                    onComment={(id) => {
                      const a = announcements.find((ann) => ann.id === id);
                      if (a) {
                        handleComment(id, a.author.name, a.content);
                      }
                    }}
                    onSave={handleAnnouncementSave}
                  />
                </Animated.View>
              ))
            ) : null}
            {filteredPosts.map((post, index) => (
              <Animated.View
                key={post.id}
                entering={FadeInDown.duration(400).delay(100 + index * 50 + (selectedTab === "Saved" && savedAnnouncements.length > 0 ? savedAnnouncements.length * 50 : 0))}
              >
                <PostCard
                  id={post.id}
                  author={post.author}
                  content={post.content}
                  image={post.image}
                  likes={post.likes}
                  comments={post.comments}
                  timestamp={post.timestamp}
                  liked={post.liked}
                  saved={post.saved}
                  onLike={handleLike}
                  onComment={() => handleComment(post.id, post.author.name, post.content)}
                  onSave={handleSave}
                />
              </Animated.View>
            ))}
          </View>
        )}

        {selectedTab !== "Announcements" && filteredPosts.length === 0 && (selectedTab !== "Saved" || savedAnnouncements.length === 0) ? (
          <Animated.View
            style={styles.emptyState}
            entering={FadeInDown.duration(400).delay(200)}
          >
            <ThemedText type="body" secondary>
              {selectedTab === "Saved" ? "No saved posts yet" : "No posts to show"}
            </ThemedText>
          </Animated.View>
        ) : null}
      </ScrollView>

      <FAB
        icon="edit-2"
        onPress={() => navigation.navigate("PostCompose")}
        style={{ bottom: tabBarHeight + Spacing.xl, right: Spacing.lg }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  tabBarScroll: {
    paddingBottom: Spacing.md,
  },
  tabBar: {
    flexDirection: "row",
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xs,
  },
  tab: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    borderRadius: BorderRadius.lg,
  },
  tabActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  postList: {
    gap: Spacing.md,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing["4xl"],
  },
  announcementCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  announcementHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFF",
    fontSize: 14,
  },
  authorInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  tierBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.xs,
  },
  announcementContent: {
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  announcementActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xl,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
});

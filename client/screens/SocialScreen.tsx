import React, { useState, useMemo } from "react";
import { View, StyleSheet, ScrollView, Pressable, RefreshControl, TextInput, Platform } from "react-native";
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
import { posts as initialPosts, announcements as initialAnnouncements, Announcement, forumGroups, ForumGroup } from "@/lib/mockData";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TABS = ["Groups", "Announcements", "General", "Founders"];

const CATEGORY_ORDER: ForumGroup["category"][] = ["fitness", "business", "lifestyle", "mindset", "skills", "other"];
const CATEGORY_LABELS: Record<string, string> = {
  fitness: "FITNESS",
  business: "BUSINESS",
  lifestyle: "LIFESTYLE",
  mindset: "MINDSET",
  skills: "SKILLS",
  other: "OTHER",
};

const monoFont = Platform.select({ ios: "Menlo", default: "monospace" });

function GroupsDirectory() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return forumGroups;
    return forumGroups.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const groupedByCategory = useMemo(() => {
    const map: Record<string, ForumGroup[]> = {};
    for (const g of filteredGroups) {
      if (!map[g.category]) map[g.category] = [];
      map[g.category].push(g);
    }
    return map;
  }, [filteredGroups]);

  return (
    <View>
      <View style={styles.groupsHeader}>
        <ThemedText type="small" style={styles.sectionHeaderText}>INTEREST GROUPS</ThemedText>
        <Pressable
          style={[styles.createGroupBtn, { borderColor: theme.accent }]}
          onPress={() => {
            if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate("CreateGroup");
          }}
        >
          <ThemedText type="caption" style={{ color: theme.accent, fontWeight: "700", letterSpacing: 1 }}>
            CREATE GROUP +
          </ThemedText>
        </Pressable>
      </View>

      <View style={[styles.searchBar, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
        <Feather name="search" size={16} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search groups..."
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {CATEGORY_ORDER.map((cat) => {
        const groups = groupedByCategory[cat];
        if (!groups || groups.length === 0) return null;
        return (
          <View key={cat}>
            <View style={[styles.categoryHeader, { backgroundColor: theme.backgroundTertiary }]}>
              <ThemedText type="small" style={styles.sectionHeaderText}>
                {CATEGORY_LABELS[cat]}
              </ThemedText>
            </View>
            {groups.map((group, idx) => (
              <Pressable
                key={group.id}
                onPress={() => {
                  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.navigate("GroupBoard", { groupId: group.id, groupName: group.name });
                }}
              >
                <Animated.View
                  entering={FadeInDown.delay(idx * 40).duration(300)}
                  style={[styles.groupRow, { borderColor: theme.border }]}
                >
                  <View style={styles.groupTop}>
                    <View style={[styles.groupIcon, { backgroundColor: group.color + "20", borderRadius: BorderRadius.sm }]}>
                      <Feather name={group.icon as any} size={18} color={group.color} />
                    </View>
                    <View style={styles.groupInfo}>
                      <View style={styles.groupNameRow}>
                        <ThemedText type="bodyBold" numberOfLines={1} style={{ flex: 1 }}>
                          {group.name}
                        </ThemedText>
                        {group.isOfficial ? (
                          <View style={[styles.officialBadge, { borderColor: theme.accent }]}>
                            <ThemedText type="caption" style={{ color: theme.accent, fontSize: 9, fontWeight: "700", letterSpacing: 1 }}>
                              OFFICIAL
                            </ThemedText>
                          </View>
                        ) : null}
                      </View>
                      <ThemedText type="caption" secondary numberOfLines={1}>
                        {group.description}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={[styles.groupStats, { borderTopColor: theme.border }]}>
                    <ThemedText type="caption" secondary>
                      <ThemedText type="caption" style={{ fontFamily: monoFont, color: theme.textSecondary }}>{group.threadCount.toLocaleString()}</ThemedText> threads · <ThemedText type="caption" style={{ fontFamily: monoFont, color: theme.textSecondary }}>{group.postCount.toLocaleString()}</ThemedText> posts · <ThemedText type="caption" style={{ fontFamily: monoFont, color: theme.textSecondary }}>{group.memberCount.toLocaleString()}</ThemedText> members
                    </ThemedText>
                  </View>
                  <ThemedText type="caption" secondary numberOfLines={1}>
                    Last: {group.lastPostBy} — "{group.lastThreadTitle}"
                  </ThemedText>
                  <ThemedText type="caption" secondary style={{ textAlign: "right", fontSize: 10 }}>
                    {group.lastActivity}
                  </ThemedText>
                </Animated.View>
              </Pressable>
            ))}
          </View>
        );
      })}
    </View>
  );
}

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
    selectedTab === "Founders"
      ? posts.filter((p) => p.author.tier === "Founder")
      : posts;

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
        <Animated.View style={[styles.tabBar, { backgroundColor: theme.backgroundSecondary }]} entering={FadeInDown.duration(400)}>
          {TABS.map((tab) => (
            <Pressable
              key={tab}
              style={[
                styles.tabFlex,
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

        {selectedTab === "Groups" ? (
          <GroupsDirectory />
        ) : selectedTab === "Announcements" ? (
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
            {filteredPosts.map((post, index) => (
              <Animated.View
                key={post.id}
                entering={FadeInDown.duration(400).delay(100 + index * 50)}
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

        {selectedTab !== "Announcements" && selectedTab !== "Groups" && filteredPosts.length === 0 ? (
          <Animated.View
            style={styles.emptyState}
            entering={FadeInDown.duration(400).delay(200)}
          >
            <ThemedText type="body" secondary>No posts to show</ThemedText>
          </Animated.View>
        ) : null}
      </ScrollView>

      {selectedTab !== "Groups" ? (
        <FAB
          icon="edit-2"
          onPress={() => navigation.navigate("PostCompose")}
          style={{ bottom: tabBarHeight + Spacing.xl, right: Spacing.lg }}
        />
      ) : null}
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
  tabBarWrap: {
    marginBottom: Spacing.md,
  },
  tabBar: {
    flexDirection: "row",
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xs,
  },
  tabFlex: {
    flex: 1,
    paddingVertical: Spacing.md,
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
  groupsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionHeaderText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  createGroupBtn: {
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: 14,
  },
  categoryHeader: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  groupRow: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    gap: 4,
  },
  groupTop: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  groupIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  groupInfo: {
    flex: 1,
    gap: 2,
  },
  groupNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  officialBadge: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.sm,
  },
  groupStats: {
    borderTopWidth: 1,
    paddingTop: 4,
    marginTop: 4,
  },
});

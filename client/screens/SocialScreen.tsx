import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { ThemedText } from "@/components/ThemedText";
import { PostCard } from "@/components/PostCard";
import { FAB } from "@/components/FAB";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { posts as initialPosts } from "@/lib/mockData";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TABS = ["General", "Founders", "Saved"];

export default function SocialScreen() {
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const [selectedTab, setSelectedTab] = useState("General");
  const [posts, setPosts] = useState(initialPosts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handleComment = (id: string) => {
  };

  const handleSave = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
    );
  };

  const filteredPosts =
    selectedTab === "Saved"
      ? posts.filter((p) => p.saved)
      : selectedTab === "Founders"
        ? posts.filter((p) => p.author.tier === "Founder")
        : posts;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: headerHeight + Spacing.xl, paddingBottom: tabBarHeight + Spacing["4xl"] },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.dark.accent}
          />
        }
      >
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.tabActive]}
              onPress={() => setSelectedTab(tab)}
            >
              <ThemedText
                type="bodyBold"
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <View style={styles.postList}>
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
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
              onComment={handleComment}
              onSave={handleSave}
            />
          ))}
        </View>

        {filteredPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText type="body" secondary>
              {selectedTab === "Saved"
                ? "No saved posts yet"
                : "No posts to show"}
            </ThemedText>
          </View>
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
    backgroundColor: Colors.dark.backgroundRoot,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  tabBar: {
    flexDirection: "row",
    marginBottom: Spacing.xl,
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: "center",
    borderRadius: BorderRadius.md,
  },
  tabActive: {
    backgroundColor: Colors.dark.accent,
  },
  tabText: {
    color: Colors.dark.textSecondary,
  },
  tabTextActive: {
    color: Colors.dark.text,
  },
  postList: {
    gap: Spacing.md,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing["4xl"],
  },
});

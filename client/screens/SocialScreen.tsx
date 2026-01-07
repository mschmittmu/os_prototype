import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { PostCard } from "@/components/PostCard";
import { FAB } from "@/components/FAB";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { posts as initialPosts } from "@/lib/mockData";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TABS = ["General", "Founders", "Saved"];

export default function SocialScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const [selectedTab, setSelectedTab] = useState("General");
  const [posts, setPosts] = useState(initialPosts);
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

  const handleComment = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSave = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
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

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: headerHeight + Spacing.sm,
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
                styles.tab,
                selectedTab === tab && [styles.tabActive, { backgroundColor: theme.backgroundRoot }],
              ]}
              onPress={() => handleTabChange(tab)}
            >
              <ThemedText
                type="bodyBold"
                style={[
                  { color: theme.textSecondary },
                  selectedTab === tab && { color: theme.text },
                ]}
              >
                {tab}
              </ThemedText>
            </Pressable>
          ))}
        </Animated.View>

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
                onComment={handleComment}
                onSave={handleSave}
              />
            </Animated.View>
          ))}
        </View>

        {filteredPosts.length === 0 ? (
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
  tabBar: {
    flexDirection: "row",
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xs,
  },
  tab: {
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
});

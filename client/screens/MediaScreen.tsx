import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { EpisodeCard } from "@/components/EpisodeCard";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { episodes as allEpisodes } from "@/lib/mockData";

const CATEGORIES = ["All", "Operator Standard", "MFCEO Project", "Shorts"];

export default function MediaScreen() {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredEpisodes =
    selectedCategory === "All"
      ? allEpisodes
      : allEpisodes.filter((e) => e.category === selectedCategory);

  const continueWatching = allEpisodes.filter((e) => e.progress > 0);
  const featuredEpisode = allEpisodes[0];

  const handleEpisodePress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCategoryChange = (category: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={styles.featuredCard}
        entering={FadeInDown.duration(400)}
      >
        <View style={styles.featuredContent}>
          <View style={styles.latestBadge}>
            <Feather name="play-circle" size={14} color="#FFFFFF" />
            <ThemedText type="caption" style={styles.latestBadgeText}>
              LATEST
            </ThemedText>
          </View>
          <ThemedText type="h3" style={styles.featuredTitle}>
            {featuredEpisode.title}
          </ThemedText>
          <ThemedText type="small" secondary numberOfLines={2}>
            {featuredEpisode.description}
          </ThemedText>
          <Pressable
            style={styles.playButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handleEpisodePress(featuredEpisode.id);
            }}
          >
            <Feather name="play" size={18} color="#FFFFFF" />
            <ThemedText type="bodyBold" style={styles.playButtonText}>
              Play Now
            </ThemedText>
          </Pressable>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(100)}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.categoryPill,
                selectedCategory === category && styles.categoryPillActive,
              ]}
              onPress={() => handleCategoryChange(category)}
            >
              <ThemedText
                type="small"
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      {continueWatching.length > 0 && selectedCategory === "All" ? (
        <Animated.View
          style={styles.section}
          entering={FadeInDown.duration(400).delay(200)}
        >
          <ThemedText type="h4" style={styles.sectionTitle}>
            CONTINUE WATCHING
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {continueWatching.map((episode) => (
              <EpisodeCard
                key={episode.id}
                id={episode.id}
                title={episode.title}
                description={episode.description}
                duration={episode.duration}
                progress={episode.progress}
                horizontal
                onPress={handleEpisodePress}
              />
            ))}
          </ScrollView>
        </Animated.View>
      ) : null}

      <View style={styles.section}>
        <Animated.View entering={FadeInDown.duration(400).delay(300)}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            {selectedCategory === "All"
              ? "ALL EPISODES"
              : selectedCategory.toUpperCase()}
          </ThemedText>
        </Animated.View>
        {filteredEpisodes.map((episode, index) => (
          <Animated.View
            key={episode.id}
            entering={FadeInDown.duration(400).delay(350 + index * 50)}
          >
            <EpisodeCard
              id={episode.id}
              title={episode.title}
              description={episode.description}
              duration={episode.duration}
              progress={episode.progress}
              onPress={handleEpisodePress}
            />
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundRoot,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  featuredCard: {
    backgroundColor: Colors.light.backgroundRoot,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  featuredContent: {
    padding: Spacing.xl,
  },
  latestBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: "flex-start",
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  latestBadgeText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  featuredTitle: {
    marginBottom: Spacing.sm,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignSelf: "flex-start",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  playButtonText: {
    color: "#FFFFFF",
  },
  categoriesContainer: {
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  categoryPillActive: {
    backgroundColor: Colors.light.text,
  },
  categoryText: {
    color: Colors.light.textSecondary,
  },
  categoryTextActive: {
    color: Colors.light.backgroundRoot,
    fontWeight: "600",
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  horizontalList: {
    gap: Spacing.md,
  },
});

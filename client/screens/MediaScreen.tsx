import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
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
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: headerHeight + Spacing.xl, paddingBottom: tabBarHeight + Spacing.xl },
      ]}
    >
      <View style={styles.featuredCard}>
        <View style={styles.featuredContent}>
          <View style={styles.liveBadge}>
            <Feather name="play-circle" size={14} color={Colors.dark.text} />
            <ThemedText type="caption" style={styles.liveBadgeText}>
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
            onPress={() => handleEpisodePress(featuredEpisode.id)}
          >
            <Feather name="play" size={20} color={Colors.dark.text} />
            <ThemedText type="bodyBold">Play Now</ThemedText>
          </Pressable>
        </View>
      </View>

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
            onPress={() => setSelectedCategory(category)}
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

      {continueWatching.length > 0 && selectedCategory === "All" ? (
        <View style={styles.section}>
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
        </View>
      ) : null}

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          {selectedCategory === "All" ? "ALL EPISODES" : selectedCategory.toUpperCase()}
        </ThemedText>
        {filteredEpisodes.map((episode) => (
          <EpisodeCard
            key={episode.id}
            id={episode.id}
            title={episode.title}
            description={episode.description}
            duration={episode.duration}
            progress={episode.progress}
            onPress={handleEpisodePress}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  featuredCard: {
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    marginBottom: Spacing.xl,
  },
  featuredContent: {
    padding: Spacing.xl,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
    alignSelf: "flex-start",
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  liveBadgeText: {
    color: Colors.dark.text,
    fontWeight: "600",
  },
  featuredTitle: {
    marginBottom: Spacing.sm,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignSelf: "flex-start",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  categoriesContainer: {
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  categoryPillActive: {
    backgroundColor: Colors.dark.accent,
  },
  categoryText: {
    color: Colors.dark.textSecondary,
  },
  categoryTextActive: {
    color: Colors.dark.text,
    fontWeight: "600",
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  horizontalList: {
    paddingRight: Spacing.lg,
  },
});

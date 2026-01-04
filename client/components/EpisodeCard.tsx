import React from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

interface EpisodeCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress?: number;
  thumbnail?: string;
  onPress: (id: string) => void;
  horizontal?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function EpisodeCard({
  id,
  title,
  description,
  duration,
  progress = 0,
  thumbnail,
  onPress,
  horizontal = false,
}: EpisodeCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(id);
  };

  if (horizontal) {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.horizontalContainer, animatedStyle]}
      >
        <View style={styles.horizontalThumbnail}>
          {thumbnail ? (
            <Image source={{ uri: thumbnail }} style={styles.thumbnailImage} />
          ) : (
            <View style={styles.thumbnailPlaceholder}>
              <Feather name="play" size={24} color={Colors.light.accent} />
            </View>
          )}
          {progress > 0 ? (
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          ) : null}
        </View>
        <ThemedText type="small" numberOfLines={2} style={styles.horizontalTitle}>
          {title}
        </ThemedText>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, animatedStyle]}
    >
      <View style={styles.thumbnail}>
        {thumbnail ? (
          <Image source={{ uri: thumbnail }} style={styles.thumbnailImage} />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Feather name="play-circle" size={40} color={Colors.light.accent} />
          </View>
        )}
        <View style={styles.durationBadge}>
          <ThemedText type="caption" style={styles.durationText}>
            {duration}
          </ThemedText>
        </View>
        {progress > 0 ? (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        ) : null}
      </View>
      <View style={styles.content}>
        <ThemedText type="bodyBold" numberOfLines={2}>
          {title}
        </ThemedText>
        <ThemedText type="small" secondary numberOfLines={2} style={styles.description}>
          {description}
        </ThemedText>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.backgroundRoot,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  horizontalContainer: {
    width: 160,
  },
  thumbnail: {
    height: 160,
    backgroundColor: Colors.light.backgroundSecondary,
    position: "relative",
  },
  horizontalThumbnail: {
    height: 90,
    backgroundColor: Colors.light.accent,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    position: "relative",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  thumbnailPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundSecondary,
  },
  durationBadge: {
    position: "absolute",
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  durationText: {
    color: "#FFFFFF",
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.light.backgroundTertiary,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.light.accent,
  },
  content: {
    padding: Spacing.md,
  },
  description: {
    marginTop: Spacing.xs,
  },
  horizontalTitle: {
    marginTop: Spacing.sm,
  },
});

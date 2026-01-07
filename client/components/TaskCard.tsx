import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  FadeIn,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface TaskCardProps {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onEdit?: (id: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const categoryIcons: Record<string, keyof typeof Feather.glyphMap> = {
  Business: "briefcase",
  Health: "heart",
  Family: "users",
  "Self Development": "book",
  Custom: "star",
};

const categoryColors: Record<string, string> = {
  Business: "#3B82F6",
  Health: "#10B981",
  Family: "#F59E0B",
  "Self Development": "#8B5CF6",
  Custom: "#EC4899",
};

export function TaskCard({
  id,
  title,
  category,
  completed,
  onToggle,
  onEdit,
}: TaskCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(completed ? 1 : 0);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withSpring(0.98, { damping: 15, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 400 })
    );
    if (!completed) {
      checkScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    } else {
      checkScale.value = withSpring(0, { damping: 12, stiffness: 200 });
    }
    onToggle(id);
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onEdit?.(id);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const icon = categoryIcons[category] || "star";
  const color = categoryColors[category] || theme.accent;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={[
        styles.container,
        animatedStyle,
        {
          backgroundColor: theme.backgroundRoot,
          borderColor: theme.border,
        },
      ]}
      entering={FadeIn.duration(300)}
    >
      <View style={styles.checkbox}>
        {completed ? (
          <Animated.View
            style={[
              styles.checkboxFilled,
              checkAnimatedStyle,
              { backgroundColor: theme.accent },
            ]}
          >
            <Feather name="check" size={16} color="#FFFFFF" />
          </Animated.View>
        ) : (
          <View style={[styles.checkboxEmpty, { borderColor: theme.border }]} />
        )}
      </View>
      <View style={styles.content}>
        <ThemedText
          type="bodyBold"
          style={[styles.title, completed && styles.titleCompleted]}
        >
          {title}
        </ThemedText>
        <View style={styles.categoryContainer}>
          <View style={[styles.categoryDot, { backgroundColor: color }]} />
          <ThemedText type="caption" style={[styles.category, { color }]}>
            {category}
          </ThemedText>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  checkbox: {
    marginRight: Spacing.md,
  },
  checkboxEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  checkboxFilled: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  category: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontSize: 11,
  },
});

import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  runOnJS,
  FadeIn,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

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
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(completed ? 1 : 0);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withSpring(0.95, { damping: 15 }),
      withSpring(1, { damping: 15 })
    );
    if (!completed) {
      checkScale.value = withSpring(1, { damping: 15 });
    }
    onToggle(id);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const icon = categoryIcons[category] || "star";
  const color = categoryColors[category] || Colors.dark.accent;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onLongPress={() => onEdit?.(id)}
      style={[styles.container, animatedStyle]}
      entering={FadeIn.duration(300)}
    >
      <View style={styles.checkbox}>
        {completed ? (
          <Animated.View style={[styles.checkboxFilled, checkAnimatedStyle]}>
            <Feather name="check" size={16} color={Colors.dark.backgroundRoot} />
          </Animated.View>
        ) : (
          <View style={styles.checkboxEmpty} />
        )}
      </View>
      <View style={styles.content}>
        <ThemedText
          type="bodyBold"
          style={[
            styles.title,
            completed && styles.titleCompleted,
          ]}
        >
          {title}
        </ThemedText>
        <View style={styles.categoryContainer}>
          <Feather name={icon} size={12} color={color} />
          <ThemedText type="caption" style={[styles.category, { color }]}>
            {category}
          </ThemedText>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color={Colors.dark.textSecondary} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.backgroundDefault,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  checkbox: {
    marginRight: Spacing.md,
  },
  checkboxEmpty: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.xs,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  checkboxFilled: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.dark.accent,
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
  category: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

import React from "react";
import { View, StyleSheet, Dimensions, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInUp,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

const { width } = Dimensions.get("window");
const GRID_GAP = Spacing.md;
const GRID_PADDING = Spacing.lg;
const CELL_WIDTH = (width - GRID_PADDING * 2 - GRID_GAP) / 2;

interface BentoItemProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  size?: "small" | "wide" | "tall" | "large";
  index?: number;
  onPress?: () => void;
}

function BentoItem({
  icon,
  label,
  value,
  subtitle,
  color,
  size = "small",
  index = 0,
  onPress,
}: BentoItemProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const itemColor = color || theme.accent;

  const getSize = () => {
    switch (size) {
      case "wide":
        return { width: CELL_WIDTH * 2 + GRID_GAP, height: CELL_WIDTH };
      case "tall":
        return { width: CELL_WIDTH, height: CELL_WIDTH * 2 + GRID_GAP };
      case "large":
        return { width: CELL_WIDTH * 2 + GRID_GAP, height: CELL_WIDTH * 2 + GRID_GAP };
      default:
        return { width: CELL_WIDTH, height: CELL_WIDTH };
    }
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const dimensions = getSize();
  const isLarge = size === "large" || size === "tall";

  return (
    <Animated.View
      entering={FadeInUp.duration(400).delay(index * 100)}
      style={[animatedStyle, dimensions]}
    >
      <Pressable
        style={[
          styles.item,
          {
            backgroundColor: theme.backgroundDefault,
            borderColor: theme.border,
          },
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${itemColor}20` }]}>
          <Feather name={icon} size={isLarge ? 28 : 22} color={itemColor} />
        </View>
        <ThemedText type="caption" secondary style={styles.label}>
          {label}
        </ThemedText>
        <ThemedText type={isLarge ? "stat" : "h3"} style={[styles.value, { color: itemColor }]}>
          {value}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="small" secondary>
            {subtitle}
          </ThemedText>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

interface BentoGridProps {
  items: BentoItemProps[];
}

export function BentoGrid({ items }: BentoGridProps) {
  return (
    <View style={styles.grid}>
      {items.map((item, index) => (
        <BentoItem key={item.label} {...item} index={index} />
      ))}
    </View>
  );
}

export { BentoItem };

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
  },
  item: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    justifyContent: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  label: {
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    marginBottom: Spacing.xs,
  },
});

import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { coreValues } from "@/lib/mockData";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width - Spacing.lg * 2;

export default function CoreValuesScreen() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CARD_WIDTH);
    setCurrentIndex(index);
  };

  const isLastCard = currentIndex === coreValues.length;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH}
      >
        {coreValues.map((value, index) => (
          <View key={value.id} style={[styles.card, { width: CARD_WIDTH }]}>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Feather name="shield" size={48} color={Colors.dark.accent} />
              </View>
              <View style={styles.numberBadge}>
                <ThemedText type="caption" style={styles.numberText}>
                  {String(index + 1).padStart(2, "0")}
                </ThemedText>
              </View>
              <ThemedText type="h2" style={styles.valueTitle}>
                {value.title}
              </ThemedText>
              <ThemedText type="body" style={styles.valueDescription}>
                {value.description}
              </ThemedText>
            </View>
          </View>
        ))}
        
        <View style={[styles.card, styles.manifestoCard, { width: CARD_WIDTH }]}>
          <View style={styles.cardContent}>
            <Feather name="shield" size={64} color={Colors.dark.accent} />
            <ThemedText type="h3" style={styles.manifestoText}>
              This is our mission.
            </ThemedText>
            <ThemedText type="h3" style={styles.manifestoText}>
              This is our code.
            </ThemedText>
            <ThemedText type="h3" style={styles.manifestoText}>
              This is who we are.
            </ThemedText>
            <ThemedText type="h1" style={styles.operatorsText}>
              OPERATORS.
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.pagination, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <View style={styles.dots}>
          {[...coreValues, { id: "manifesto" }].map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.dotActive,
              ]}
            />
          ))}
        </View>
        <ThemedText type="caption" secondary>
          {currentIndex < coreValues.length
            ? `${currentIndex + 1} of ${coreValues.length + 1}`
            : "The Manifesto"}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
  },
  scrollContent: {
    alignItems: "center",
  },
  card: {
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  cardContent: {
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius["2xl"],
    padding: Spacing["3xl"],
    alignItems: "center",
    gap: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.md,
  },
  numberBadge: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  numberText: {
    color: Colors.dark.text,
    fontWeight: "700",
  },
  valueTitle: {
    textAlign: "center",
    color: Colors.dark.accent,
  },
  valueDescription: {
    textAlign: "center",
    lineHeight: 28,
    color: Colors.dark.textSecondary,
  },
  manifestoCard: {
    backgroundColor: "transparent",
  },
  manifestoText: {
    textAlign: "center",
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.sm,
  },
  operatorsText: {
    color: Colors.dark.accent,
    marginTop: Spacing.xl,
    textAlign: "center",
  },
  pagination: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: Spacing.sm,
  },
  dots: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.backgroundSecondary,
  },
  dotActive: {
    backgroundColor: Colors.dark.accent,
    width: 24,
  },
});

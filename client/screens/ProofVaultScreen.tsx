import React, { useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Audio } from "expo-av";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getProofVault, ProofEntry } from "@/lib/storage";

const TRIGGER_ICONS: Record<string, string> = {
  streak_milestone: "award",
  win_rate_threshold: "trending-up",
  recovery_win: "refresh-cw",
  first_week: "flag",
};

export default function ProofVaultScreen() {
  const { theme } = useTheme();
  const [entries, setEntries] = useState<ProofEntry[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const vault = await getProofVault();
        setEntries(vault);
      };
      load();
      return () => {
        if (soundRef.current) {
          soundRef.current.unloadAsync();
        }
      };
    }, [])
  );

  const handlePlayAudio = async (entry: ProofEntry) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    try {
      if (playingId === entry.id) {
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        setPlayingId(null);
        return;
      }
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      }
      if (!entry.audioUri) return;
      const { sound } = await Audio.Sound.createAsync({ uri: entry.audioUri });
      soundRef.current = sound;
      setPlayingId(entry.id);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingId(null);
        }
      });
      await sound.playAsync();
    } catch (error) {
      console.error("Playback error:", error);
      setPlayingId(null);
    }
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderEntry = ({ item, index }: { item: ProofEntry; index: number }) => {
    const iconName = TRIGGER_ICONS[item.triggerType] || "award";
    const isPlaying = playingId === item.id;

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 80).duration(400)}
        style={[
          styles.entryCard,
          {
            backgroundColor: theme.backgroundSecondary,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.entryHeader}>
          <View style={[styles.entryIcon, { backgroundColor: "rgba(227, 24, 55, 0.12)" }]}>
            <Feather name={iconName as any} size={18} color={theme.accent} />
          </View>
          <View style={styles.entryMeta}>
            <ThemedText type="bodyBold">{item.triggerLabel}</ThemedText>
            <ThemedText type="caption" secondary>
              {formatDate(item.capturedAt)}
            </ThemedText>
          </View>
        </View>

        {item.format === "voice" && item.audioUri ? (
          <Pressable
            style={[styles.playRow, { backgroundColor: "rgba(255,255,255,0.05)" }]}
            onPress={() => handlePlayAudio(item)}
          >
            <Feather
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={28}
              color={theme.accent}
            />
            <ThemedText type="small" style={{ flex: 1, color: theme.text }}>
              {item.content}
            </ThemedText>
          </Pressable>
        ) : (
          <ThemedText type="small" style={styles.textContent}>
            {item.content}
          </ThemedText>
        )}

        <View style={styles.entryFooter}>
          <View style={styles.footerStat}>
            <Feather name="zap" size={12} color={theme.textSecondary} />
            <ThemedText type="caption" secondary>
              Streak: {item.streakAtCapture}
            </ThemedText>
          </View>
          <View style={styles.footerStat}>
            <Feather name="activity" size={12} color={theme.textSecondary} />
            <ThemedText type="caption" secondary>
              Life Score: {item.lifeScoreAtCapture}
            </ThemedText>
          </View>
          <View style={styles.footerStat}>
            <Feather name="lock" size={12} color={theme.textSecondary} />
            <ThemedText type="caption" secondary>
              Private
            </ThemedText>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderEntry}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: Spacing.xl, paddingBottom: Spacing["4xl"] },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Animated.View entering={FadeIn.duration(400)} style={styles.listHeader}>
            <View style={[styles.vaultIcon, { backgroundColor: "rgba(227, 24, 55, 0.12)" }]}>
              <Feather name="lock" size={24} color={theme.accent} />
            </View>
            <ThemedText type="caption" secondary>
              {entries.length > 0
                ? `${entries.length} moment${entries.length !== 1 ? "s" : ""} captured`
                : ""}
            </ThemedText>
          </Animated.View>
        }
        ListEmptyComponent={
          <Animated.View entering={FadeIn.delay(200).duration(400)} style={styles.emptyState}>
            <Feather name="shield" size={48} color={theme.textSecondary} />
            <ThemedText
              type="body"
              secondary
              style={styles.emptyText}
            >
              No proof captured yet. Keep executing. The moments will come.
            </ThemedText>
          </Animated.View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  listHeader: {
    alignItems: "center",
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  vaultIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  entryCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  entryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  entryMeta: {
    flex: 1,
    gap: 2,
  },
  playRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  textContent: {
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  entryFooter: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  footerStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["5xl"],
    gap: Spacing.xl,
  },
  emptyText: {
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 22,
  },
});

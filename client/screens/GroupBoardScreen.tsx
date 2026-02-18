import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  Platform,
} from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { forumGroups, forumThreads, ForumThread } from "@/lib/mockData";
import { getJoinedGroups, joinGroup, leaveGroup } from "@/lib/storage";

type RouteProp = NativeStackScreenProps<RootStackParamList, "GroupBoard">["route"];

const monoFont = Platform.select({ ios: "Menlo", default: "monospace" });

function formatNumber(n: number): string {
  return n.toLocaleString();
}

export default function GroupBoardScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp>();
  const { groupId } = route.params;

  const [isJoined, setIsJoined] = useState(false);

  const group = forumGroups.find(g => g.id === groupId);
  const threads = forumThreads.filter(t => t.groupId === groupId);
  const pinnedThreads = threads.filter(t => t.isPinned);
  const regularThreads = threads.filter(t => !t.isPinned);
  const allThreads = [...pinnedThreads, ...regularThreads];

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const joined = await getJoinedGroups();
        setIsJoined(joined.some(g => g.groupId === groupId));
      };
      load();
    }, [groupId])
  );

  const handleToggleJoin = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (isJoined) {
      await leaveGroup(groupId);
      setIsJoined(false);
    } else {
      await joinGroup(groupId);
      setIsJoined(true);
    }
  };

  const renderColumnHeader = () => (
    <View style={[styles.columnHeader, { backgroundColor: theme.backgroundTertiary, borderBottomColor: theme.border }]}>
      <ThemedText style={styles.colHeaderText} type="small">TOPIC</ThemedText>
      <View style={styles.colHeaderRight}>
        <ThemedText style={[styles.colHeaderText, styles.colHeaderStat]} type="small">REPLIES</ThemedText>
        <ThemedText style={[styles.colHeaderText, styles.colHeaderStat]} type="small">VIEWS</ThemedText>
        <ThemedText style={[styles.colHeaderText, styles.colHeaderLastPost]} type="small">LAST POST</ThemedText>
      </View>
    </View>
  );

  const renderThread = ({ item, index }: { item: ForumThread; index: number }) => {
    const isPinned = item.isPinned;
    const isHot = item.replyCount > 50;
    const showPinnedSeparator = isPinned && index === pinnedThreads.length - 1;

    return (
      <Pressable
        onPress={() => {
          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          navigation.navigate("GroupThread", {
            threadId: item.id,
            threadTitle: item.title,
            groupId,
          });
        }}
      >
        <Animated.View
          entering={FadeInDown.delay(index * 40).duration(300)}
          style={[
            styles.threadRow,
            {
              borderBottomColor: theme.border,
              borderBottomWidth: showPinnedSeparator ? 2 : 1,
              backgroundColor: isPinned ? "rgba(227, 24, 55, 0.05)" : "transparent",
            },
          ]}
        >
          <View style={styles.threadMain}>
            <View style={styles.threadTitleRow}>
              {item.hasNewPosts ? (
                <View style={[styles.newDot, { backgroundColor: theme.accent }]} />
              ) : null}
              {isPinned ? (
                <Feather name="bookmark" size={12} color={theme.accent} style={{ marginRight: 4 }} />
              ) : null}
              <ThemedText type="bodyBold" numberOfLines={1} style={styles.threadTitle}>
                {item.title}
              </ThemedText>
              {item.isLocked ? (
                <Feather name="lock" size={12} color={theme.textSecondary} style={{ marginLeft: 4 }} />
              ) : null}
            </View>
            <ThemedText type="caption" secondary numberOfLines={1}>
              by {item.author.name} ({item.author.tier}) · {item.createdAt}
            </ThemedText>
          </View>
          <View style={styles.threadStats}>
            <ThemedText
              style={[
                styles.statNum,
                { fontFamily: monoFont },
                isHot ? { color: theme.accent, fontWeight: "700" } : { color: theme.textSecondary },
                item.replyCount > 0 ? { fontWeight: "700" } : {},
              ]}
              type="small"
            >
              {formatNumber(item.replyCount)}
            </ThemedText>
            <ThemedText style={[styles.statNum, { fontFamily: monoFont, color: theme.textSecondary }]} type="small">
              {formatNumber(item.viewCount)}
            </ThemedText>
            <View style={styles.lastPostCol}>
              <ThemedText type="caption" secondary numberOfLines={1}>
                {item.lastReplyAt}
              </ThemedText>
              <ThemedText type="caption" secondary numberOfLines={1} style={{ fontSize: 10 }}>
                {item.lastReplyBy !== "-" ? item.lastReplyBy : ""}
              </ThemedText>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <Animated.View entering={FadeIn.duration(300)} style={[styles.infoBar, { backgroundColor: theme.backgroundSecondary, borderBottomColor: theme.border }]}>
        <View style={styles.infoStats}>
          <ThemedText type="caption" secondary>
            <ThemedText type="caption" style={{ fontFamily: monoFont }}>{formatNumber(group?.memberCount || 0)}</ThemedText> members · <ThemedText type="caption" style={{ fontFamily: monoFont }}>{formatNumber(group?.threadCount || 0)}</ThemedText> threads · <ThemedText type="caption" style={{ fontFamily: monoFont }}>{formatNumber(group?.postCount || 0)}</ThemedText> posts
          </ThemedText>
        </View>
        <View style={styles.infoActions}>
          <Pressable
            style={[
              styles.joinBtn,
              {
                backgroundColor: isJoined ? "transparent" : theme.accent,
                borderWidth: 1,
                borderColor: isJoined ? theme.border : theme.accent,
              },
            ]}
            onPress={handleToggleJoin}
          >
            <ThemedText
              type="small"
              style={{ color: isJoined ? theme.textSecondary : "#FFF", fontWeight: "700", letterSpacing: 1 }}
            >
              {isJoined ? "JOINED" : "JOIN"}
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.newThreadBtn, { backgroundColor: theme.accent }]}
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              navigation.navigate("CreateThread", { groupId });
            }}
          >
            <Feather name="plus" size={14} color="#FFF" />
            <ThemedText type="small" style={{ color: "#FFF", fontWeight: "700", letterSpacing: 1 }}>
              NEW THREAD
            </ThemedText>
          </Pressable>
        </View>
      </Animated.View>

      <FlatList
        data={allThreads}
        keyExtractor={(item) => item.id}
        renderItem={renderThread}
        ListHeaderComponent={renderColumnHeader}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="message-square" size={32} color={theme.textSecondary} />
            <ThemedText type="body" secondary style={{ marginTop: Spacing.md, textAlign: "center" }}>
              No threads yet. Be the first to start a discussion.
            </ThemedText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoBar: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.sm,
  },
  infoStats: {
    flexDirection: "row",
  },
  infoActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  joinBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  newThreadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  columnHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  colHeaderText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  colHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  colHeaderStat: {
    width: 52,
    textAlign: "center",
  },
  colHeaderLastPost: {
    width: 64,
    textAlign: "right",
  },
  threadRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  threadMain: {
    flex: 1,
    gap: 2,
    marginRight: Spacing.sm,
  },
  threadTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  threadTitle: {
    flex: 1,
    fontSize: 14,
  },
  newDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  threadStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statNum: {
    width: 52,
    textAlign: "center",
    fontSize: 12,
  },
  lastPostCol: {
    width: 64,
    alignItems: "flex-end",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["5xl"],
  },
});

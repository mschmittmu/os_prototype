import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { crewMessages as initialMessages } from "@/lib/mockData";

const TABS = ["Chat", "Details", "Other Crews"];

export default function CrewScreen() {
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedTab, setSelectedTab] = useState("Chat");
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");

  const handleTabChange = (tab: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTab(tab);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const newMessage = {
      id: Date.now().toString(),
      type: "message" as const,
      author: { name: "You" },
      content: inputText.trim(),
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = (message: (typeof messages)[0], index: number) => {
    if (message.type === "achievement" || message.type === "challenge") {
      return (
        <Animated.View
          key={message.id}
          style={[styles.systemCard, { backgroundColor: theme.backgroundRoot, borderColor: theme.border }]}
          entering={FadeInDown.delay(index * 50)}
        >
          <View style={[styles.systemIconContainer, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather
              name={(message.icon as any) || "award"}
              size={20}
              color={
                message.type === "achievement"
                  ? theme.success
                  : theme.accent
              }
            />
          </View>
          <View style={styles.systemContent}>
            <ThemedText type="small">{message.content}</ThemedText>
            <ThemedText type="caption" secondary>
              {message.timestamp}
            </ThemedText>
          </View>
        </Animated.View>
      );
    }

    const isMe = message.author?.name === "You";

    return (
      <Animated.View
        key={message.id}
        style={[styles.messageContainer, isMe && styles.messageContainerMe]}
        entering={FadeInDown.delay(index * 50)}
      >
        {!isMe ? (
          <View style={[styles.avatar, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText type="bodyBold">
              {message.author?.name.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
        ) : null}
        <View style={[
          styles.messageBubble,
          { backgroundColor: theme.backgroundSecondary },
          isMe && { backgroundColor: theme.accent },
        ]}>
          {!isMe ? (
            <ThemedText type="caption" style={[styles.authorName, { color: theme.accent }]}>
              {message.author?.name}
            </ThemedText>
          ) : null}
          <ThemedText
            type="body"
            style={isMe ? styles.messageTextMe : undefined}
          >
            {message.content}
          </ThemedText>
          <ThemedText
            type="caption"
            secondary={!isMe}
            style={[styles.timestamp, isMe && styles.timestampMe]}
          >
            {message.timestamp}
          </ThemedText>
        </View>
      </Animated.View>
    );
  };

  const renderDetails = () => (
    <View style={styles.detailsContainer}>
      <View style={styles.crewHeader}>
        <View style={[styles.crewIcon, { backgroundColor: theme.backgroundSecondary }]}>
          <Feather name="shield" size={32} color={theme.accent} />
        </View>
        <ThemedText type="h2">ALPHA CREW</ThemedText>
        <ThemedText type="body" secondary>
          24 Members
        </ThemedText>
      </View>

      <ThemedText type="h4" style={styles.sectionTitle}>
        LEADERBOARD
      </ThemedText>
      {[
        { name: "Marcus Steel", xp: 12450, rank: 1 },
        { name: "Jake Thornton", xp: 11230, rank: 2 },
        { name: "Chris Walsh", xp: 10890, rank: 3 },
        { name: "David Carter", xp: 8920, rank: 4 },
        { name: "You", xp: 7560, rank: 5 },
      ].map((member, index) => (
        <Animated.View
          key={member.name}
          entering={FadeInDown.duration(400).delay(index * 50)}
        >
          <View style={[styles.leaderboardItem, { backgroundColor: theme.backgroundRoot, borderColor: theme.border }]}>
            <View
              style={[
                styles.rankBadge,
                { backgroundColor: theme.accent },
                member.rank <= 3 && {
                  backgroundColor:
                    member.rank === 1
                      ? "#FFD700"
                      : member.rank === 2
                        ? "#C0C0C0"
                        : "#CD7F32",
                },
              ]}
            >
              <ThemedText type="bodyBold" style={styles.rankText}>
                #{member.rank}
              </ThemedText>
            </View>
            <ThemedText type="body" style={styles.memberName}>
              {member.name}
            </ThemedText>
            <ThemedText type="statSmall" style={{ color: theme.accent }}>
              {member.xp.toLocaleString()}
            </ThemedText>
          </View>
        </Animated.View>
      ))}
    </View>
  );

  const renderOtherCrews = () => (
    <View style={styles.otherCrewsContainer}>
      <ThemedText type="h4" style={styles.sectionTitle}>
        DISCOVER CREWS
      </ThemedText>
      {[
        {
          name: "BEAST MODE",
          members: 156,
          description: "For the relentless grinders",
        },
        {
          name: "EARLY RISERS",
          members: 89,
          description: "4AM club members only",
        },
        {
          name: "IRON BROTHERHOOD",
          members: 234,
          description: "Strength through unity",
        },
      ].map((crew, index) => (
        <Animated.View
          key={crew.name}
          entering={FadeInDown.duration(400).delay(index * 50)}
        >
          <Pressable
            style={[styles.crewCard, { backgroundColor: theme.backgroundRoot, borderColor: theme.border }]}
            onPress={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
          >
            <View style={[styles.crewCardIcon, { backgroundColor: theme.backgroundSecondary }]}>
              <Feather name="users" size={24} color={theme.accent} />
            </View>
            <View style={styles.crewCardContent}>
              <ThemedText type="bodyBold">{crew.name}</ThemedText>
              <ThemedText type="small" secondary>
                {crew.description}
              </ThemedText>
              <ThemedText type="caption" secondary>
                {crew.members} members
              </ThemedText>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>
        </Animated.View>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.backgroundRoot, paddingTop: headerHeight }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={headerHeight}
      pointerEvents="box-none"
    >
      <View
        style={[styles.tabBar, { marginTop: Spacing.md }]}
        pointerEvents="box-none"
      >
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            style={[
              styles.tab,
              { backgroundColor: theme.backgroundSecondary },
              selectedTab === tab && { backgroundColor: theme.accent },
            ]}
            onPress={() => handleTabChange(tab)}
          >
            <ThemedText
              type="small"
              style={[
                { color: theme.textSecondary },
                selectedTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      {selectedTab === "Chat" ? (
        <>
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatContainer}
            contentContainerStyle={[
              styles.chatContent,
              { paddingTop: Spacing.lg },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message, index) => renderMessage(message, index))}
          </ScrollView>

          <View
            style={[
              styles.inputContainer,
              { paddingBottom: tabBarHeight + Spacing.sm, backgroundColor: theme.backgroundRoot, borderTopColor: theme.border },
            ]}
          >
            <TextInput
              style={[styles.input, { backgroundColor: theme.backgroundSecondary, color: theme.text }]}
              placeholder="Type a message..."
              placeholderTextColor={theme.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <Pressable
              style={[
                styles.sendButton,
                { backgroundColor: theme.accent },
                !inputText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Feather name="send" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: Spacing.xl, paddingBottom: tabBarHeight + Spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {selectedTab === "Details" ? renderDetails() : renderOtherCrews()}
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    borderRadius: BorderRadius.lg,
  },
  tabTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  systemCard: {
    flexDirection: "row",
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: "center",
    gap: Spacing.md,
    borderWidth: 1,
  },
  systemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  systemContent: {
    flex: 1,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  messageContainerMe: {
    flexDirection: "row-reverse",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
  },
  messageTextMe: {
    color: "#FFFFFF",
  },
  authorName: {
    marginBottom: Spacing.xs,
  },
  timestamp: {
    marginTop: Spacing.xs,
    alignSelf: "flex-end",
  },
  timestampMe: {
    color: "rgba(255,255,255,0.7)",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  detailsContainer: {
    gap: Spacing.md,
  },
  crewHeader: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  crewIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  rankText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  memberName: {
    flex: 1,
  },
  otherCrewsContainer: {
    gap: Spacing.md,
  },
  crewCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
  },
  crewCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  crewCardContent: {
    flex: 1,
    gap: Spacing.xs,
  },
});

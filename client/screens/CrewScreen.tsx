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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { crewMessages as initialMessages } from "@/lib/mockData";

const TABS = ["Chat", "Details", "Other Crews"];

export default function CrewScreen() {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedTab, setSelectedTab] = useState("Chat");
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;
    
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

  const renderMessage = (message: typeof messages[0], index: number) => {
    if (message.type === "achievement" || message.type === "challenge") {
      return (
        <Animated.View
          key={message.id}
          style={styles.systemCard}
          entering={FadeInDown.delay(index * 50)}
        >
          <View style={styles.systemIconContainer}>
            <Feather
              name={message.icon as any || "award"}
              size={20}
              color={message.type === "achievement" ? Colors.dark.success : Colors.dark.accent}
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
          <View style={styles.avatar}>
            <ThemedText type="bodyBold">
              {message.author?.name.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
        ) : null}
        <View style={[styles.messageBubble, isMe && styles.messageBubbleMe]}>
          {!isMe ? (
            <ThemedText type="caption" style={styles.authorName}>
              {message.author?.name}
            </ThemedText>
          ) : null}
          <ThemedText type="body">{message.content}</ThemedText>
          <ThemedText type="caption" secondary style={styles.timestamp}>
            {message.timestamp}
          </ThemedText>
        </View>
      </Animated.View>
    );
  };

  const renderDetails = () => (
    <View style={styles.detailsContainer}>
      <View style={styles.crewHeader}>
        <View style={styles.crewIcon}>
          <Feather name="shield" size={32} color={Colors.dark.accent} />
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
      ].map((member) => (
        <View key={member.name} style={styles.leaderboardItem}>
          <View style={styles.rankBadge}>
            <ThemedText type="bodyBold" style={styles.rankText}>
              #{member.rank}
            </ThemedText>
          </View>
          <ThemedText type="body" style={styles.memberName}>
            {member.name}
          </ThemedText>
          <ThemedText type="statSmall" style={styles.memberXp}>
            {member.xp.toLocaleString()}
          </ThemedText>
        </View>
      ))}
    </View>
  );

  const renderOtherCrews = () => (
    <View style={styles.otherCrewsContainer}>
      <ThemedText type="h4" style={styles.sectionTitle}>
        DISCOVER CREWS
      </ThemedText>
      {[
        { name: "BEAST MODE", members: 156, description: "For the relentless grinders" },
        { name: "EARLY RISERS", members: 89, description: "4AM club members only" },
        { name: "IRON BROTHERHOOD", members: 234, description: "Strength through unity" },
      ].map((crew) => (
        <Pressable key={crew.name} style={styles.crewCard}>
          <View style={styles.crewCardIcon}>
            <Feather name="users" size={24} color={Colors.dark.accent} />
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
          <Feather name="chevron-right" size={20} color={Colors.dark.textSecondary} />
        </Pressable>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: headerHeight }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={headerHeight}
      pointerEvents="box-none"
    >
      <View style={[styles.tabBar, { marginTop: Spacing.md }]} pointerEvents="box-none">
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <ThemedText
              type="small"
              style={[
                styles.tabText,
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
          >
            {messages.map((message, index) => renderMessage(message, index))}
          </ScrollView>

          <View style={[styles.inputContainer, { paddingBottom: tabBarHeight + Spacing.sm }]}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={Colors.dark.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <Pressable
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Feather name="send" size={20} color={Colors.dark.text} />
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
    backgroundColor: Colors.dark.backgroundRoot,
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
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dark.backgroundDefault,
  },
  tabActive: {
    backgroundColor: Colors.dark.accent,
  },
  tabText: {
    color: Colors.dark.textSecondary,
  },
  tabTextActive: {
    color: Colors.dark.text,
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
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: "center",
    gap: Spacing.md,
  },
  systemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.backgroundSecondary,
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
    backgroundColor: Colors.dark.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  messageBubble: {
    maxWidth: "75%",
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  messageBubbleMe: {
    backgroundColor: Colors.dark.accent,
  },
  authorName: {
    color: Colors.dark.accent,
    marginBottom: Spacing.xs,
  },
  timestamp: {
    marginTop: Spacing.xs,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.dark.backgroundRoot,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    color: Colors.dark.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.accent,
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
    backgroundColor: Colors.dark.backgroundDefault,
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
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dark.accent,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  rankText: {
    color: Colors.dark.text,
    fontSize: 12,
  },
  memberName: {
    flex: 1,
  },
  memberXp: {
    color: Colors.dark.accent,
  },
  otherCrewsContainer: {
    gap: Spacing.md,
  },
  crewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  crewCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  crewCardContent: {
    flex: 1,
    gap: Spacing.xs,
  },
});

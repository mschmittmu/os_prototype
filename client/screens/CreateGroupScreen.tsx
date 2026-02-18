import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

const CATEGORIES = ["Lifestyle", "Business", "Fitness", "Mindset", "Skills", "Other"];
const ICONS = [
  "shield", "briefcase", "heart", "book-open", "anchor", "home",
  "sunrise", "phone-call", "target", "tool", "coffee", "globe",
];

export default function CreateGroupScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");

  const handleCreate = () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert("Required", "Please fill in name and description.");
      return;
    }
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Alert.alert("Group Created!");
    navigation.goBack();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>GROUP NAME</ThemedText>
        <TextInput
          style={[styles.input, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary, color: theme.text }]}
          value={name}
          onChangeText={(t) => setName(t.slice(0, 50))}
          placeholder="Enter group name..."
          placeholderTextColor={theme.textSecondary}
          maxLength={50}
        />
        <ThemedText type="caption" secondary style={styles.counter}>{name.length}/50</ThemedText>
      </View>

      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>DESCRIPTION</ThemedText>
        <TextInput
          style={[styles.input, styles.multilineInput, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary, color: theme.text }]}
          value={description}
          onChangeText={(t) => setDescription(t.slice(0, 200))}
          placeholder="Describe your group..."
          placeholderTextColor={theme.textSecondary}
          multiline
          maxLength={200}
        />
        <ThemedText type="caption" secondary style={styles.counter}>{description.length}/200</ThemedText>
      </View>

      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>CATEGORY</ThemedText>
        <View style={styles.chipRow}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              style={[
                styles.chip,
                {
                  borderColor: category === cat ? theme.accent : theme.border,
                  backgroundColor: category === cat ? theme.accent + "15" : theme.backgroundSecondary,
                },
              ]}
              onPress={() => {
                if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setCategory(cat);
              }}
            >
              <ThemedText
                type="caption"
                style={{ color: category === cat ? theme.accent : theme.textSecondary, fontWeight: "600" }}
              >
                {cat}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>ICON</ThemedText>
        <View style={styles.iconGrid}>
          {ICONS.map((icon) => (
            <Pressable
              key={icon}
              style={[
                styles.iconOption,
                {
                  borderColor: selectedIcon === icon ? theme.accent : theme.border,
                  backgroundColor: selectedIcon === icon ? theme.accent + "15" : theme.backgroundSecondary,
                },
              ]}
              onPress={() => {
                if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedIcon(icon);
              }}
            >
              <Feather
                name={icon as any}
                size={20}
                color={selectedIcon === icon ? theme.accent : theme.textSecondary}
              />
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable
        style={[styles.createBtn, { backgroundColor: theme.accent }]}
        onPress={handleCreate}
      >
        <ThemedText type="bodyBold" style={{ color: "#FFF", letterSpacing: 1 }}>
          CREATE GROUP
        </ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.xl,
    paddingBottom: Spacing["5xl"],
  },
  field: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 15,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  counter: {
    textAlign: "right",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  createBtn: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    marginTop: Spacing.lg,
  },
});

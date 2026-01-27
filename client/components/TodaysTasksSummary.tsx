import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Task } from "@/lib/storage";

interface TodaysTasksSummaryProps {
  tasks: Task[];
  onViewAll?: () => void;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Health":
      return "#10B981";
    case "Business":
      return "#3B82F6";
    case "Self Development":
      return "#8B5CF6";
    case "Family":
      return "#F97316";
    case "Relationships":
      return "#EC4899";
    case "Spiritual":
      return "#06B6D4";
    default:
      return "#6B7280";
  }
};

export function TodaysTasksSummary({ tasks, onViewAll }: TodaysTasksSummaryProps) {
  const { theme } = useTheme();
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = Math.max(tasks.length, 5);

  const handleViewAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onViewAll?.();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}>
      <View style={styles.header}>
        <ThemedText type="h4" style={styles.headerText}>
          TODAY'S TASKS
        </ThemedText>
        <ThemedText
          type="bodyBold"
          style={{ color: completedCount === totalCount ? theme.success : theme.text }}
        >
          {completedCount}/{totalCount}
        </ThemedText>
      </View>

      <View style={styles.tasksList}>
        {tasks.slice(0, 5).map((task) => (
          <View key={task.id} style={styles.taskRow}>
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor: task.completed
                    ? theme.success
                    : "transparent",
                  borderColor: task.completed
                    ? theme.success
                    : theme.backgroundTertiary,
                },
              ]}
            >
              {task.completed && (
                <Feather name="check" size={12} color="#FFFFFF" />
              )}
            </View>
            <ThemedText
              type="body"
              style={[
                styles.taskText,
                task.completed && {
                  textDecorationLine: "line-through",
                  color: theme.textSecondary,
                },
              ]}
              numberOfLines={1}
            >
              {task.title}
            </ThemedText>
          </View>
        ))}
      </View>

      {onViewAll && (
        <Pressable onPress={handleViewAll} style={styles.viewAllButton}>
          <ThemedText type="small" style={{ color: theme.accent }}>
            VIEW FULL LIST
          </ThemedText>
          <Feather name="arrow-right" size={14} color={theme.accent} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  headerText: {
    letterSpacing: 1,
  },
  tasksList: {
    gap: Spacing.md,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.xs,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  taskText: {
    flex: 1,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
});

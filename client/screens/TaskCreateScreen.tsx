import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { getTasks, saveTasks, generateId, Task } from "@/lib/storage";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "TaskCreate">;
type RouteProps = RouteProp<RootStackParamList, "TaskCreate">;

const CATEGORIES = [
  { id: "Business", icon: "briefcase", color: "#3B82F6" },
  { id: "Health", icon: "heart", color: "#10B981" },
  { id: "Family", icon: "users", color: "#F59E0B" },
  { id: "Self Development", icon: "book", color: "#8B5CF6" },
  { id: "Custom", icon: "star", color: "#EC4899" },
];

export default function TaskCreateScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Business");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const loadTask = async () => {
      if (route.params?.taskId) {
        const tasks = await getTasks();
        const task = tasks.find((t) => t.id === route.params?.taskId);
        if (task) {
          setTitle(task.title);
          setCategory(task.category);
          setIsEditing(true);
          setEditingTask(task);
          navigation.setOptions({ headerTitle: "Edit Task" });
        }
      }
    };
    loadTask();
  }, [route.params?.taskId, navigation]);

  const handleSave = async () => {
    if (!title.trim()) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const tasks = await getTasks();

    if (isEditing && editingTask) {
      const updatedTasks = tasks.map((t) =>
        t.id === editingTask.id
          ? { ...t, title: title.trim(), category }
          : t
      );
      await saveTasks(updatedTasks);
    } else {
      const newTask: Task = {
        id: generateId(),
        title: title.trim(),
        category,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      await saveTasks([...tasks, newTask]);
    }

    navigation.goBack();
  };

  const handleDelete = async () => {
    if (!editingTask) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    const tasks = await getTasks();
    const updatedTasks = tasks.filter((t) => t.id !== editingTask.id);
    await saveTasks(updatedTasks);
    navigation.goBack();
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + Spacing.xl },
      ]}
    >
      <View style={styles.inputContainer}>
        <ThemedText type="caption" secondary style={styles.label}>
          TASK NAME
        </ThemedText>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor={Colors.dark.textSecondary}
          value={title}
          onChangeText={setTitle}
          autoFocus
          multiline
        />
      </View>

      <View style={styles.categoryContainer}>
        <ThemedText type="caption" secondary style={styles.label}>
          CATEGORY
        </ThemedText>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={[
                styles.categoryButton,
                category === cat.id && styles.categoryButtonActive,
                category === cat.id && { borderColor: cat.color },
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setCategory(cat.id);
              }}
            >
              <Feather
                name={cat.icon as any}
                size={20}
                color={category === cat.id ? cat.color : Colors.dark.textSecondary}
              />
              <ThemedText
                type="small"
                style={[
                  styles.categoryLabel,
                  category === cat.id && { color: cat.color },
                ]}
              >
                {cat.id}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button onPress={handleSave} disabled={!title.trim()}>
          {isEditing ? "Save Changes" : "Add Task"}
        </Button>

        {isEditing ? (
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Feather name="trash-2" size={20} color={Colors.dark.error} />
            <ThemedText type="body" style={styles.deleteText}>
              Delete Task
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
  },
  contentContainer: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  inputContainer: {
    gap: Spacing.sm,
  },
  label: {
    marginLeft: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    color: Colors.dark.text,
    fontSize: 18,
    minHeight: 80,
    textAlignVertical: "top",
  },
  categoryContainer: {
    gap: Spacing.sm,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.backgroundDefault,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoryButtonActive: {
    backgroundColor: Colors.dark.backgroundSecondary,
  },
  categoryLabel: {
    color: Colors.dark.textSecondary,
  },
  actions: {
    marginTop: Spacing.xl,
    gap: Spacing.lg,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  deleteText: {
    color: Colors.dark.error,
  },
});

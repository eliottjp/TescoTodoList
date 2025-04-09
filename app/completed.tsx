import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  updateDoc,
  getDocs,
  query,
  doc,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "./src/utils/firebase";
import { Task } from "./src/types/models";
import { useRouter } from "expo-router";
import dayjs from "dayjs";

export default function CompletedTasks() {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCompleted = async () => {
      const snapshot = await getDocs(
        query(collection(db, "tasks"), where("completed", "==", true))
      );

      const now = new Date();
      const twoWeeksAgo = dayjs(now).subtract(14, "day").toDate();

      const tasks = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Task))
        .filter(
          (task) => task.completedAt && task.completedAt.toDate() >= twoWeeksAgo
        );

      setCompletedTasks(tasks);
      setLoading(false);
    };

    fetchCompleted();
  }, []);
  const undoComplete = async (taskId: string) => {
    await updateDoc(doc(db, "tasks", taskId), {
      completed: false,
      completedAt: serverTimestamp(),
    });
  };

  const renderTask = (task: Task) => (
    <View style={styles.card}>
      {task.imageUrl && (
        <Image source={{ uri: task.imageUrl }} style={styles.image} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.meta}>Department: {task.department}</Text>
      </View>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => undoComplete(task.id)}
      >
        <Text style={styles.checkboxText}>⬅️</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#ee1c2e" />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>✅ Completed Tasks</Text>

      <FlatList
        data={completedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderTask(item)}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No completed tasks in the last 2 weeks.
          </Text>
        }
      />

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  heading: {
    fontSize: 22,
    fontFamily: "Poppins_600SemiBold",
    color: "#00539f",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  meta: {
    fontSize: 13,
    color: "#555",
    fontFamily: "Poppins_400Regular",
  },
  empty: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 30,
    color: "#888",
    fontFamily: "Poppins_400Regular",
  },
  backButton: {
    backgroundColor: "#ee1c2e",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 20,
  },
  backText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  checkbox: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  checkboxText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
  },
});

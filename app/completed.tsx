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
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./src/utils/firebase";
import { Task } from "./src/types/models";
import { useRouter } from "expo-router";

export default function CompletedTasks() {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCompleted = async () => {
      const snapshot = await getDocs(
        query(collection(db, "tasks"), where("completed", "==", true))
      );
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setCompletedTasks(tasks);
      setLoading(false);
    };

    fetchCompleted();
  }, []);

  const renderTask = (task: Task) => (
    <View style={styles.card}>
      {task.imageUrl && (
        <Image source={{ uri: task.imageUrl }} style={styles.image} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.meta}>Department: {task.department}</Text>
        <Text style={styles.meta}>Assigned To: {task.assignedTo}</Text>
      </View>
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
          <Text style={styles.empty}>No completed tasks.</Text>
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
});

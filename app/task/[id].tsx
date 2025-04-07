import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./../src/utils/firebase";
import { Task } from "./../src/types/models";

export default function TaskDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchTask = async () => {
      const docRef = doc(db, "tasks", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTask({ id: docSnap.id, ...docSnap.data() } as Task);
      }
      setLoading(false);
    };

    fetchTask();
  }, [id]);

  if (loading)
    return (
      <ActivityIndicator size="large" style={{ flex: 1 }} color="#ee1c2e" />
    );

  if (!task) return <Text style={{ padding: 20 }}>Task not found.</Text>;

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {task.imageUrl && (
          <TouchableOpacity onPress={() => setShowPreview(true)}>
            <Image source={{ uri: task.imageUrl }} style={styles.image} />
          </TouchableOpacity>
        )}

        <View style={styles.card}>
          <Text style={styles.title}>{task.title}</Text>

          <View style={styles.detailRow}>
            <Text style={styles.label}>📋 Description:</Text>
            <Text style={styles.text}>
              {task.description || "No description provided."}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>🏢 Department:</Text>
            <Text style={styles.text}>{task.department}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>📌 Status:</Text>
            <Text
              style={[
                styles.text,
                task.completed ? styles.complete : styles.inProgress,
              ]}
            >
              {task.completed ? "✅ Completed" : "🕒 In Progress"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 🔍 Fullscreen Preview Modal */}
      <Modal visible={showPreview} transparent={true} animationType="fade">
        <Pressable
          style={styles.fullscreenOverlay}
          onPress={() => setShowPreview(false)}
        >
          <Image
            source={{ uri: task.imageUrl }}
            style={styles.fullscreenImage}
          />
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
  },
  card: {
    padding: 20,
    backgroundColor: "#fff",
    marginTop: -30,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: "Poppins_600SemiBold",
    color: "#00539f",
    marginBottom: 16,
  },
  detailRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#444",
    marginBottom: 4,
  },
  text: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    color: "#555",
  },
  complete: {
    color: "#2e7d32",
  },
  inProgress: {
    color: "#e53935",
  },
  backButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#ee1c2e",
    borderRadius: 8,
  },
  backText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
    borderRadius: 12,
  },
});

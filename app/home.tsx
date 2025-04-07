import { useEffect, useState, useLayoutEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./src/utils/firebase";
import { Task } from "./src/types/models";
import { useAuth } from "./src/context/AuthContext";
import { useRouter, useNavigation } from "expo-router";
import { FAB } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

export default function HomeScreen() {
  const { staff, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const [prevTaskCount, setPrevTaskCount] = useState(0);

  useLayoutEffect(() => {
    if (staff?.role === "manager") {
      navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: "row", gap: 12, marginRight: 12 }}>
            <TouchableOpacity onPress={() => router.push("/completed")}>
              <Ionicons name="checkmark-done-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/generate-pin")}>
              <Ionicons name="person-add-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ),
      });
    } else {
      navigation.setOptions({ headerRight: () => null });
    }
  }, [staff]);

  useEffect(() => {
    if (!staff || !Array.isArray(staff.departments)) return;

    const q = query(collection(db, "tasks"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allTasks: Task[] = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Task))
        .filter((task) => !task.completed);

      if (allTasks.length > prevTaskCount && prevTaskCount > 0) {
        Toast.show({
          type: "success",
          text1: "New task added",
          text2: "Check your list for updates! 🚀",
        });
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }

      setPrevTaskCount(allTasks.length);
      setTasks(allTasks);
      setLoading(false);
    });

    return unsubscribe;
  }, [staff?.departments]);

  const markComplete = async (taskId: string) => {
    await updateDoc(doc(db, "tasks", taskId), {
      completed: true,
      completedAt: serverTimestamp(),
    });
  };

  const departmentTasks = tasks.filter((task) =>
    staff?.departments?.includes?.(task.department)
  );

  const otherDepartmentTasks = tasks.filter(
    (task) => staff?.departments && !staff.departments.includes(task.department)
  );

  const displayedTasks =
    showAllDepartments || staff?.role === "manager" ? tasks : departmentTasks;

  const renderTask = (task: Task) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/task/${task.id}`)}
    >
      {task.imageUrl && (
        <Image source={{ uri: task.imageUrl }} style={styles.thumbnail} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.meta}>Dept: {task.department}</Text>
      </View>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => markComplete(task.id)}
      >
        <Text style={styles.checkboxText}>✔</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading)
    return (
      <ActivityIndicator size="large" style={{ flex: 1 }} color="#ee1c2e" />
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>👋 Welcome, {staff?.name}</Text>
        <TouchableOpacity
          onPress={() => {
            logout();
            router.replace("/login");
          }}
        >
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={displayedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderTask(item)}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks for now 🚀</Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {staff?.role === "manager" &&
        otherDepartmentTasks.length > 0 &&
        !showAllDepartments && (
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => setShowAllDepartments(true)}
          >
            <Text style={styles.viewAllText}>View All Departments</Text>
          </TouchableOpacity>
        )}

      <FAB
        icon="plus"
        style={styles.fab}
        color="#fff"
        onPress={() => router.push("/create")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: "#00539f",
  },
  logout: {
    fontSize: 14,
    color: "#ee1c2e",
    fontFamily: "Poppins_600SemiBold",
  },
  card: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 6,
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
  },
  meta: {
    fontSize: 12,
    color: "#777",
    fontFamily: "Poppins_400Regular",
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
  viewAllButton: {
    backgroundColor: "#ddd",
    padding: 12,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  viewAllText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#444",
  },
  empty: {
    fontFamily: "Poppins_400Regular",
    color: "#aaa",
    textAlign: "center",
    marginTop: 40,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#ee1c2e",
    borderRadius: 30,
  },
});

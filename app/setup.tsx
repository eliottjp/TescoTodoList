import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./src/utils/firebase";
import Toast from "react-native-toast-message";

export default function SetupPinScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const token =
    typeof params.token === "string" ? params.token : params.token?.[0];

  const [loading, setLoading] = useState(true);
  const [staffName, setStaffName] = useState("");
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (!token) {
      Alert.alert("Invalid Link", "Missing token.");
      router.replace("/login");
      return;
    }

    const fetchPendingPin = async () => {
      try {
        const q = query(
          collection(db, "pendingPins"),
          where("token", "==", token)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          Alert.alert("Invalid Link", "This setup link is no longer valid.");
          router.replace("/login");
          return;
        }

        const docSnap = snapshot.docs[0];
        const data = docSnap.data();

        console.log("✅ Found pending staff:", data);

        if (
          !data?.name ||
          !Array.isArray(data.departments) ||
          data.departments.length === 0
        ) {
          throw new Error("Missing name or departments in Firestore doc");
        }

        setStaffName(data.name);
        (globalThis as any)._pendingDepartments = data.departments;
        (globalThis as any)._pendingPinDocId = docSnap.id;
      } catch (err) {
        console.error("Error fetching token:", err);
        Alert.alert("Error", "Something went wrong.");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPin();
  }, [token]);

  const handleSubmit = async () => {
    console.log("📝 Submitting PIN:", pin);

    if (!pin || pin.length !== 6) {
      Alert.alert("Invalid PIN", "PIN must be 6 digits.");
      return;
    }

    if (!staffName || !(globalThis as any)._pendingDepartments) {
      Alert.alert("Missing Info", "Staff info is missing.");
      return;
    }

    try {
      const q = query(collection(db, "staff"), where("pin", "==", pin));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        Toast.show({
          type: "error",
          text1: "PIN In Use",
          text2: "That PIN is already being used 😬",
        });
        return;
      }

      await setDoc(doc(db, "staff", token!), {
        name: staffName,
        departments: (globalThis as any)._pendingDepartments,
        pin,
        createdAt: serverTimestamp(),
      });

      await deleteDoc(
        doc(db, "pendingPins", (globalThis as any)._pendingPinDocId)
      );

      Alert.alert("✅ PIN Set", "You can now log in.");
      router.replace("/login");
    } catch (err) {
      console.error("Error saving PIN:", err);
      Alert.alert("Error", "Could not save PIN.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ee1c2e" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Set Your PIN</Text>
      <Text style={styles.subtitle}>
        Hi <Text style={styles.name}>{staffName}</Text>! Choose a 6-digit PIN:
      </Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={6}
        value={pin}
        onChangeText={setPin}
        placeholder="Enter PIN"
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save PIN</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#00539f",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    marginBottom: 24,
    textAlign: "center",
  },
  name: {
    fontWeight: "bold",
    color: "#00539f",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 4,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ee1c2e",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

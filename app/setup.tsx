import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  Alert,
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

export default function SetupPinScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Get the token from the URL
  const token =
    typeof params.token === "string" ? params.token : params.token?.[0];

  const [loading, setLoading] = useState(true);
  const [staffName, setStaffName] = useState("");
  const [department, setDepartment] = useState("");
  const [pin, setPin] = useState("");

  useEffect(() => {
    console.log("🔍 All Params:", params);
    console.log("🔍 useEffect fired");
    console.log("🧩 token param:", token);

    if (!token) {
      Alert.alert("Invalid Link", "Missing token.");
      router.replace("/login");
      return;
    }

    const fetchPendingPin = async () => {
      try {
        console.log("📡 Querying Firestore for token...");

        // Find the document with the matching token field
        const q = query(
          collection(db, "pendingPins"),
          where("token", "==", token)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          console.warn("❌ Token not found in pendingPins");
          Alert.alert("Invalid Link", "This setup link is no longer valid.");
          router.replace("/login");
          return;
        }

        const docSnap = snapshot.docs[0];
        const data = docSnap.data();

        console.log("✅ Found pending staff:", data);
        setStaffName(data.name);
        setDepartment(data.department);

        // Store doc ID globally so we can delete later
        (globalThis as any)._pendingPinDocId = docSnap.id;
      } catch (err) {
        console.error("🔥 Error fetching token:", err);
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

    try {
      const staffId = token!;

      // 🔍 Check if PIN is already used by another staff
      const q = query(collection(db, "staff"), where("pin", "==", pin));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        Alert.alert(
          "PIN In Use",
          "That PIN is already being used. Please choose a different one."
        );
        return;
      }

      // ✅ Save staff with PIN
      await setDoc(doc(db, "staff", staffId), {
        name: staffName,
        department,
        pin,
        createdAt: serverTimestamp(),
      });

      console.log("✅ PIN successfully set for staff:", staffId);

      // 🧹 Clean up the token
      await deleteDoc(
        doc(db, "pendingPins", (globalThis as any)._pendingPinDocId)
      );

      Alert.alert("✅ PIN Set", "You can now log in.");
      router.replace("/login");
    } catch (error) {
      console.error("🔥 Error saving PIN:", error);
      Alert.alert("Error", "Could not save PIN.");
    }
  };

  if (loading) {
    console.log("⏳ Still loading...");
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your PIN</Text>
      <Text style={styles.subtitle}>Hi {staffName}! Choose a 6-digit PIN:</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={6}
        value={pin}
        onChangeText={setPin}
        placeholder="Enter PIN"
      />

      <Button title="Save PIN" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    fontSize: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
});

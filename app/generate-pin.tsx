import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import uuid from "react-native-uuid";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./src/utils/firebase";

const departments = [
  "Frozen",
  "Grocery",
  "BWS",
  "GM & HB",
  "Dairy, Meat & Poultry",
  "Services",
  "Produce & Bakery",
  "Bread & Cakes",
  "Dot Com",
  "Clothing",
];

export default function GeneratePinLink() {
  const [name, setName] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [link, setLink] = useState("");

  const toggleDepartment = (department: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(department)
        ? prev.filter((d) => d !== department)
        : [...prev, department]
    );
  };

  const handleGenerate = async () => {
    if (!name || selectedDepartments.length === 0) {
      Alert.alert(
        "Missing Info",
        "Please enter name and at least one department."
      );
      return;
    }

    const token = uuid.v4();

    await addDoc(collection(db, "pendingPins"), {
      name,
      departments: selectedDepartments,
      token,
      createdAt: serverTimestamp(),
    });

    setLink(`https://tesco-three.vercel.app/setup?token=${token}`);
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(link);
    Alert.alert("Copied", "Setup link copied to clipboard.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔐 Generate Setup Link</Text>

      <Text style={styles.label}>Staff Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter staff name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Departments</Text>
      <View style={styles.multiSelectBox}>
        {departments.map((dep) => {
          const selected = selectedDepartments.includes(dep);
          return (
            <TouchableOpacity
              key={dep}
              style={[styles.tag, selected && styles.tagSelected]}
              onPress={() => toggleDepartment(dep)}
            >
              <Text
                style={[styles.tagText, selected && styles.tagTextSelected]}
              >
                {dep}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[
          styles.generateButton,
          (!name || selectedDepartments.length === 0) && { opacity: 0.6 },
        ]}
        disabled={!name || selectedDepartments.length === 0}
        onPress={handleGenerate}
      >
        <Text style={styles.generateText}>Generate Link</Text>
      </TouchableOpacity>

      {link !== "" && (
        <View style={styles.linkBox}>
          <Text style={styles.linkLabel}>Setup Link:</Text>
          <Text selectable style={styles.link}>
            {link}
          </Text>
          <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
            <Text style={styles.copyText}>📋 Copy Link</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#f9f9f9",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    color: "#00539f",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontFamily: "Poppins_600SemiBold",
    color: "#444",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    backgroundColor: "#fff",
  },
  multiSelectBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 8,
    marginBottom: 8,
  },
  tagSelected: {
    backgroundColor: "#00539f",
    borderColor: "#00539f",
  },
  tagText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#444",
  },
  tagTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  generateButton: {
    backgroundColor: "#ee1c2e",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  generateText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  linkBox: {
    backgroundColor: "#e6f0ff",
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
  },
  linkLabel: {
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 6,
    color: "#00539f",
  },
  link: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    marginBottom: 10,
    color: "#00539f",
  },
  copyButton: {
    backgroundColor: "#00539f",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  copyText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
  },
});

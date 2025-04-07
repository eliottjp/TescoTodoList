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
import { Picker } from "@react-native-picker/picker";
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
  const [department, setDepartment] = useState("");
  const [link, setLink] = useState("");

  const handleGenerate = async () => {
    if (!name || !department) {
      Alert.alert("Missing Info", "Please enter name and department.");
      return;
    }

    const token = uuid.v4();

    await addDoc(collection(db, "pendingPins"), {
      name,
      department,
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

      <Text style={styles.label}>Department</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={department}
          onValueChange={setDepartment}
          style={styles.picker}
        >
          <Picker.Item label="Select Department..." value="" />
          {departments.map((dep) => (
            <Picker.Item key={dep} label={dep} value={dep} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  picker: {
    height: 50,
    fontFamily: "Poppins_400Regular",
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

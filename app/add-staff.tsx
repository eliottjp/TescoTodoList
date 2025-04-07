import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./src/utils/firebase";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

export default function AddStaffPage() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [pin, setPin] = useState("");
  const [role, setRole] = useState("staff");
  const router = useRouter();

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

  const handleSubmit = async () => {
    if (!name || !department || !pin || pin.length !== 6) {
      Alert.alert(
        "Missing or Invalid Fields",
        "Please complete all fields and ensure the PIN is 6 digits."
      );
      return;
    }

    try {
      await addDoc(collection(db, "staff"), {
        name,
        department,
        pin,
        role,
      });
      Alert.alert("Colleague Added", `${name} has been added.`);
      setName("");
      setDepartment("");
      setPin("");
      setRole("staff");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Colleague</Text>

      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Colleague Name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Department *</Text>
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

      <Text style={styles.label}>Login PIN (6 digits) *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 123456"
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
        maxLength={6}
      />

      <Text style={styles.label}>Role *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={role}
          onValueChange={setRole}
          style={styles.picker}
        >
          <Picker.Item label="Colleague" value="staff" />
          <Picker.Item label="Manager" value="manager" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Colleague</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontFamily: "Poppins_600SemiBold",
    color: "#00539f",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    fontFamily: "Poppins_400Regular",
  },
  button: {
    backgroundColor: "#ee1c2e",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});

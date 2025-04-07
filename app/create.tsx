import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./src/utils/firebase";
import { Picker } from "@react-native-picker/picker";

export default function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !department) {
      Alert.alert("Missing Fields", "Please enter a title and department.");
      return;
    }

    try {
      setUploading(true);
      let imageUrl = "";

      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(storage, `task-images/${Date.now()}.jpg`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "tasks"), {
        title,
        description,
        department,
        completed: false,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      Alert.alert("✅ Task Created", "Task has been added successfully.");
      setTitle("");
      setDescription("");
      setDepartment("");
      setImage(null);
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Create New Task</Text>

      <Text style={styles.label}>Task Title *</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the task"
        placeholderTextColor="#999"
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

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>Pick Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.preview} />}

      {uploading ? (
        <ActivityIndicator style={{ marginTop: 20 }} color="#ee1c2e" />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Task</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  pageTitle: {
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
    marginBottom: 10,
  },
  picker: {
    height: 50,
    fontFamily: "Poppins_400Regular",
  },
  imageButton: {
    backgroundColor: "#00539f",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  imageButtonText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#ee1c2e",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  preview: {
    width: "100%",
    height: 200,
    marginTop: 15,
    borderRadius: 10,
  },
});

import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "./src/context/AuthContext";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [pin, setPin] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    const success = await login(pin);
    if (success) {
      router.replace("/home");
    } else {
      Toast.show({
        type: "error",
        text1: "Invalid PIN",
        text2: "Please try again.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        style={{
          width: 300,
          height: 200,
          resizeMode: "contain",
          alignSelf: "center",
          marginBottom: 0,
        }}
      />

      <Text style={styles.title2}>Coventry Arena Store</Text>
      <Text style={styles.title}>Next Steps</Text>
      <Text style={styles.subtitle}>Colleague Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit PIN"
        placeholderTextColor="#999"
        keyboardType="numeric"
        maxLength={6}
        onChangeText={setPin}
        value={pin}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 14,
          color: "#f12121",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Built by EJP Designs
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    color: "#00539f",
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 30,
  },
  title2: {
    fontSize: 28,
    color: "#00539f",
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 18,
    fontFamily: "Poppins_400Regular",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#ee1c2e",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
});

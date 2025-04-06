// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "./src/context/AuthContext";
import { Provider as PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { Text, TouchableOpacity } from "react-native";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });
  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <PaperProvider>
        <Stack>
          {/* Default for all pages */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen
            name="home"
            options={{
              title: "My Tasks",
              headerStyle: { backgroundColor: "#ee1c2e" },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontFamily: "Poppins_600SemiBold",
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="create"
            options={{
              title: "New Task",
              headerStyle: { backgroundColor: "#ee1c2e" },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontFamily: "Poppins_600SemiBold",
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="task/[id]"
            options={{
              title: "Task Details",
              headerStyle: { backgroundColor: "#ee1c2e" },
              headerTintColor: "#fff",
            }}
          />
          <Stack.Screen
            name="add-staff"
            options={{
              title: "Add Staff",
              headerStyle: { backgroundColor: "#00539f" },
              headerTintColor: "#fff",
            }}
          />
          <Stack.Screen
            name="completed"
            options={{
              title: "Completed Tasks",
              headerStyle: { backgroundColor: "#00539f" },
              headerTintColor: "#fff",
            }}
          />
        </Stack>
        <Toast />
      </PaperProvider>
    </AuthProvider>
  );
}

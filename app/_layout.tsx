import { Stack } from "expo-router";
import { AuthProvider } from "./src/context/AuthContext";
import { Provider as PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { Platform } from "react-native";
import { useEffect } from "react";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  // Web: Inject Google Fonts dynamically
  useEffect(() => {
    if (Platform.OS === "web") {
      const link = document.createElement("link");
      link.href =
        "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }, []);

  if (!fontsLoaded && Platform.OS !== "web") return null;

  const headerFont = {
    fontFamily: Platform.OS === "web" ? "Poppins" : "Poppins_600SemiBold",
    fontSize: 18,
  };

  return (
    <AuthProvider>
      <PaperProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />

          <Stack.Screen
            name="home"
            options={{
              title: "My Tasks",
              headerStyle: { backgroundColor: "#ee1c2e" },
              headerTintColor: "#fff",
              headerTitleStyle: headerFont,
            }}
          />
          <Stack.Screen
            name="create"
            options={{
              title: "New Task",
              headerStyle: { backgroundColor: "#ee1c2e" },
              headerTintColor: "#fff",
              headerTitleStyle: headerFont,
            }}
          />
          <Stack.Screen
            name="task/[id]"
            options={{
              title: "Task Details",
              headerStyle: { backgroundColor: "#ee1c2e" },
              headerTintColor: "#fff",
              headerTitleStyle: headerFont,
            }}
          />
          <Stack.Screen
            name="add-staff"
            options={{
              title: "Add Staff",
              headerStyle: { backgroundColor: "#00539f" },
              headerTintColor: "#fff",
              headerTitleStyle: headerFont,
            }}
          />
          <Stack.Screen
            name="completed"
            options={{
              title: "Completed Tasks",
              headerStyle: { backgroundColor: "#00539f" },
              headerTintColor: "#fff",
              headerTitleStyle: headerFont,
            }}
          />
        </Stack>
        <Toast />
      </PaperProvider>
    </AuthProvider>
  );
}

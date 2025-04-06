// app/index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "./src/context/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { staff } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!router || !router.replace) return;

    // Wait for router to be ready
    const timeout = setTimeout(() => {
      if (router && router.replace) {
        if (staff) {
          router.replace("/home");
        } else {
          router.replace("/login");
        }
      }
      setChecking(false);
    }, 50); // delay slightly to avoid navigation before layout mounts

    return () => clearTimeout(timeout);
  }, [staff]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator />
    </View>
  );
}

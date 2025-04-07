import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../utils/firebase";
import { Staff } from "../types/models";
import Toast from "react-native-toast-message";

type AuthContextType = {
  staff: Staff | null;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [staff, setStaff] = useState<Staff | null>(null);

  // Restore staff from storage on app launch
  useEffect(() => {
    const loadStoredStaff = async () => {
      const stored = await AsyncStorage.getItem("loggedInStaff");
      if (!stored) return;

      const { staff: savedStaff, loginTime } = JSON.parse(stored);
      const threeHours = 3 * 60 * 60 * 1000;

      if (Date.now() - loginTime > threeHours) {
        // ❌ Expired session
        await AsyncStorage.removeItem("loggedInStaff");
        setStaff(null);

        // ✅ Show toast
        Toast.show({
          type: "info",
          text1: "Session expired",
          text2: "Please log in again.",
          position: "bottom",
          visibilityTime: 3000,
        });
      } else {
        setStaff(savedStaff);
      }
    };

    loadStoredStaff();
  }, []);

  const login = async (pin: string): Promise<boolean> => {
    const snapshot = await getDocs(
      query(collection(db, "staff"), where("pin", "==", pin))
    );
    if (snapshot.empty) return false;

    const doc = snapshot.docs[0];
    const user = { id: doc.id, ...doc.data() } as Staff;

    const loginPayload = {
      staff: user,
      loginTime: Date.now(),
    };

    setStaff(user);
    await AsyncStorage.setItem("loggedInStaff", JSON.stringify(loginPayload));
    return true;
  };

  const logout = async () => {
    setStaff(null);
    await AsyncStorage.removeItem("loggedInStaff");
  };

  return (
    <AuthContext.Provider value={{ staff, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

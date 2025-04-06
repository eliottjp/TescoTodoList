import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDMoL3-fDEx8mKqq3QU5OOfJ-9h-hEDdoM",
  authDomain: "tesco-todo-list.firebaseapp.com",
  projectId: "tesco-todo-list",
  storageBucket: "tesco-todo-list.firebasestorage.app",
  messagingSenderId: "752865260389",
  appId: "1:752865260389:web:4471a8081733676fa7a78c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

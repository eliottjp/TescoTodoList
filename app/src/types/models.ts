import { Timestamp } from "firebase/firestore";

export type Staff = {
  id: string;
  name: string;
  departments: string[];
  pin: string; // 6-digit login
  role: "manager" | "staff"; // admin or staff
};

export type Task = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  assignedTo: string; // staff ID
  department: string;
  departments: string[];
  completed: boolean;
  createdAt: number;
  completedAt?: Timestamp;
};

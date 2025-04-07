import { Timestamp } from "firebase/firestore";

export type Staff = {
  id: string;
  name: string;
  departments: string[];
  pin: string;
  role: "manager" | "staff";
};

export type Task = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  department: string;
  departments: string[];
  completed: boolean;
  createdAt: number;
  completedAt?: Timestamp;
};

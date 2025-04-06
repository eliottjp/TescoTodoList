export type Staff = {
  id: string;
  name: string;
  department: string;
  pin: string; // 6-digit login
};

export type Task = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  assignedTo: string; // staff ID
  department: string;
  completed: boolean;
  createdAt: number;
};

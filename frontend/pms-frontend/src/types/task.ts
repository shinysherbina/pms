export interface Comment {
  id: number;
  content: string;
  authorEmail: string;
  createdAt?: string; // ISO timestamp
  updatedAt?: string;
  taskId?: number;
  authorId?: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  assigneeEmail: string;
  dueDate?: string;
  comments?: Comment[];
}

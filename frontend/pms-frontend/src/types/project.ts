export interface Project {
  id: number;
  name: string;
  description: string;
  status: "active" | "completed" | "archived";
  taskCount: number;
  completedTasks: number;
  dueDate?: string;
}

import type { Task, TaskStatus } from "../../domain/task.schema";
import type { TaskRepository } from "../repositories/task-repository";

type ListTasksInput = {
  userId: string;
  status?: TaskStatus;
  categoryId?: string | null;
  title?: string;
  orderBy?: "createdAt" | "updatedAt";
  orderDirection?: "asc" | "desc";
};

type ListTasksDeps = {
  taskRepository: TaskRepository;
};

export type ListTasks = (input: ListTasksInput) => Promise<Task[]>;

export const makeListTasks =
  ({ taskRepository }: ListTasksDeps): ListTasks =>
  async (input) =>
    taskRepository.list(input);

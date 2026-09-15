import { PMToolAdapter, AdapterProject, AdapterTask, AdapterTeamMember, CreateTaskInput } from "./types";

export class ManualAdapter implements PMToolAdapter {
  name = "manual";

  async connect(): Promise<boolean> {
    return true;
  }

  async disconnect(): Promise<void> {}

  async testConnection(): Promise<boolean> {
    return true;
  }

  async syncProjects(): Promise<AdapterProject[]> {
    return [];
  }

  async syncTasks(): Promise<AdapterTask[]> {
    return [];
  }

  async syncTeamMembers(): Promise<AdapterTeamMember[]> {
    return [];
  }

  async createTask(task: CreateTaskInput): Promise<AdapterTask> {
    return {
      externalId: `manual-${Date.now()}`,
      projectExternalId: task.projectExternalId,
      title: task.title,
      description: task.description,
      status: "todo",
      priority: (task.priority as any) || "normal",
      assignee: task.assignee,
      storyPoints: task.storyPoints,
      dueDate: task.dueDate,
    };
  }

  async updateTaskStatus(): Promise<void> {}
}

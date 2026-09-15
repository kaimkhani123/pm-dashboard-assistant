export interface AdapterProject {
  externalId: string;
  name: string;
  category: "implementation" | "support" | "internal";
  status: "active" | "on_hold" | "completed";
  clientName?: string;
}

export interface AdapterTask {
  externalId: string;
  projectExternalId: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "review" | "blocked" | "done";
  priority: "low" | "normal" | "high" | "urgent";
  assignee?: string;
  reporter?: string;
  storyPoints?: number;
  dueDate?: Date;
  completedAt?: Date;
}

export interface AdapterTeamMember {
  name: string;
  email: string;
  role?: string;
  department?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  projectExternalId: string;
  assignee?: string;
  priority?: string;
  storyPoints?: number;
  dueDate?: Date;
}

export interface PMToolAdapter {
  name: string;
  connect(config: Record<string, string>): Promise<boolean>;
  disconnect(): Promise<void>;
  testConnection(): Promise<boolean>;
  syncProjects(): Promise<AdapterProject[]>;
  syncTasks(projectExternalId?: string): Promise<AdapterTask[]>;
  syncTeamMembers(): Promise<AdapterTeamMember[]>;
  createTask(task: CreateTaskInput): Promise<AdapterTask>;
  updateTaskStatus(externalId: string, status: string): Promise<void>;
}

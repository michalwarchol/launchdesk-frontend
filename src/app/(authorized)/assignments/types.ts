export interface AssignmentAssignee {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface Assignment {
  id: string;
  taskId: string;
  taskName: string;
  assignees: AssignmentAssignee[];
  progress: number;
  createdAt: string;
}

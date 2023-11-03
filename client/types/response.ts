export type Initiative = {
  initiativeId: string;
  initiativeName: string;
  initiativeDescription: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  roleId: string;
};

export type GetAllInitiativesResponse = {
  status: string;
  result: number;
  data: Initiative[];
};

export type Task = {
  taskId: string;
  taskName: string;
  taskDescription: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type GetAllTasksResponse = {
  status: string;
  result: number;
  data: Task[];
};

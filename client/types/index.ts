import { Icons } from "@/components/icons";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
}

export type DailyLog = {
  createdAt: string;
  initiativeName: string;
  taskName: string;
  description?: string;
  workHour: string;
  error: boolean;
  isSaved: boolean;
};

export type WeeklyTableRow = {
  createdAt: Date;
  id: string;
  initiativeName: string;
  taskName: string;
  mon: string;
  tues: string;
  wed: string;
  thurs: string;
  fri: string;
  sat: string;
  sun: string;
  total: string;
  error: boolean;
  isSaved: boolean;
};

export type ColumnTotals = {
  mon: number;
  tues: number;
  wed: number;
  thurs: number;
  fri: number;
  sat: number;
  sun: number;
};

export type SideBarNavItems = {
  title: string;
  href: string;
  icon: keyof typeof Icons;
};

export type Roles = "user" | "admin" | "manager";

export type UserInfo = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: number;
  role: Roles;
  startDate: string;
  endDate: string;
};

export type AuthInfo = {
  status: string;
  token: string;
  user: UserInfo;
};

export type Initiative = {
  initiativeId: string;
  initiativeName: string;
  initiativeDescription: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  roleId: string;
};

export type Task = {
  taskId: string;
  taskName: string;
  taskDescription: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  initiativeId: string;
};

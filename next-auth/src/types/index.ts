import { Icons } from "@/components/icons";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
}

export interface DailyLog {
  createdAt: string;
  initiativeName: string;
  taskName: string;
  description?: string;
  workHour: string;
  error: boolean;
  isSaved: boolean;
}

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

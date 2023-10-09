import { Roles, SideBarNavItems } from "@/types";

export interface DashboardConfig {
  sideBarNav: SideBarNavItems[];
}

export const dashboardConfig: Record<Roles, SideBarNavItems[]> = {
  user: [
    {
      title: "home",
      href: "/",
      icon: "home",
    },
    // {
    //   title: "track your tasks",
    //   href: "/timesheet",
    //   icon: plus,
    // },
  ],
  admin: [
    {
      title: "home",
      href: "/",
      icon: "home",
    },
    {
      title: "initiatives",
      href: "/initiatives",
      icon: "scrollText",
    },
    {
      title: "users",
      href: "/users",
      icon: "user2",
    },
  ],
  manager: [
    {
      title: "home",
      href: "/",
      icon: "home",
    },
    {
      title: "create task",
      href: "/createTask",
      icon: "plus",
    },
  ],
};

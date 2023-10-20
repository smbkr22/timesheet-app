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
    {
      title: "track tasks",
      href: "/timesheet",
      icon: "clock",
    },
    {
      title: "Calendar",
      href: "/calendar-view",
      icon: "calendar",
    },
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
      title: "initiatives",
      href: "/initiatives/managers",
      icon: "scrollText",
    },
    {
      title: "approval",
      href: "/approval",
      icon: "scrollText",
    },
  ],
};

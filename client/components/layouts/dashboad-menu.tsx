import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { SideBarNavItems } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import dynamicIconImports from "lucide-react/dynamicIconImports";

import { dashboardConfig } from "@/config/dashboard";
import useAuth from "@/hooks/useAuth";

import { Icons } from "../icons";

const DashboardMenu = () => {
  const { auth } = useAuth();

  const roleBasedDashboardOptions = dashboardConfig[auth?.user.role ?? "user"];

  return (
    <AnimatePresence>
      <motion.div
        className="absolute top-0 left-0 h-screen w-80 bg-secondary text-secondary-foreground"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{
          ease: "easeInOut",
          duration: 0.2,
        }}
      >
        <ul className="mt-16 text-lg">
          {auth?.token ? (
            roleBasedDashboardOptions.map((option: SideBarNavItems) => {
              const LucideIcon = dynamic(dynamicIconImports[option.icon]);
              return (
                <li key={option.title}>
                  <Link
                    href={option.href}
                    className="flex items-center gap-3 px-10 py-4 capitalize cursor-pointer hover:bg-popover"
                  >
                    <LucideIcon />
                    {option.title}
                  </Link>
                </li>
              );
            })
          ) : (
            <li>
              <Link
                href={"/"}
                className="flex items-center gap-3 px-10 py-4 capitalize cursor-pointer hover:bg-popover"
              >
                <Icons.home />
                Home
              </Link>
            </li>
          )}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
};

export default DashboardMenu;

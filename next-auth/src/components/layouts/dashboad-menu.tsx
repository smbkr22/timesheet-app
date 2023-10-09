import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const DashboardMenu = () => {
  return (
    <AnimatePresence>
      <motion.div
        className="absolute top-0 left-0 h-screen w-80 bg-accent"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{
          ease: "linear",
          duration: 0.2,
        }}
      >
        <ul className="mt-16 text-lg">
          {/* {roleBasedDashboardOptions.map((option: SideBarNavItems) => {
            return (
              <li key={option.title}>
                <Link
                  href={option.href}
                  className="flex items-center gap-3 px-10 py-4 capitalize cursor-pointer hover:bg-popover"
                >
                  {option.title}
                </Link>
              </li>
            );
          })} */}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
};

export default DashboardMenu;

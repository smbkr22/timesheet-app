import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import useOutsideClick from "@/hooks/useOutsideClick";

import { Icons } from "./icons";
import DashboardMenu from "./layouts/dashboad-menu";
import { Button } from "./ui/button";

const DashboardToggle = () => {
  const [clicked, setClicked] = useState(false);

  const ref = useRef(null);

  useOutsideClick(ref, () => {
    setClicked(false);
  });

  return (
    <>
      <Button
        variant="default"
        size="icon"
        onClick={() => setClicked((prev) => !prev)}
        className="z-50 w-10 h-10 rounded-full aspect-square"
      >
        <AnimatePresence>
          {!clicked ? (
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                ease: "linear",
                duration: 0.2,
              }}
            >
              <Icons.menu />
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                ease: "linear",
                duration: 0.2,
              }}
            >
              <Icons.x />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
      {clicked ? (
        <div ref={ref}>
          <DashboardMenu />
        </div>
      ) : null}
    </>
  );
};

export default DashboardToggle;

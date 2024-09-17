"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { Settings, HandHelping } from "lucide-react";
import { useTheme } from "next-themes";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { usePortalContext } from "@/context/portal-context-provider";
import { Button } from "@/components/ui/button";
import { Chip } from "@nextui-org/react";
import { portalOptions } from "@/constants/portals";
import { cn } from "@/lib/utils";
import { ContextCard } from "./_components/context-card";

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

type ContextType = "TEXT" | "CODE" | "IMAGE" | "AUDIO" | "VIDEO";

const PortalPage = () => {
  const { portalContext, setPortalContext } = usePortalContext();
  const { isAppbarCollapsed, isLeftSidebarOpened, setIsLeftSidebarOpened, leftSidebarWidth, setLeftSidebarWidth, isRightSidebarOpened, setIsRightSidebarOpened, RightSidebarWidth, setRightSidebarWidth } = useMyspaceContext();
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const [showHelp, setShowHelp] = useState(false);
  const userName = user?.firstName ? capitalizeFirstLetter(user.firstName) : 'Wapp-Portal';
  
  useEffect(() => {
    if (isLeftSidebarOpened) {
      setIsLeftSidebarOpened(false);
      setLeftSidebarWidth(0);
    }
    if (isRightSidebarOpened) {
      setIsRightSidebarOpened(false);
      setRightSidebarWidth(0);
    }
  }, [isLeftSidebarOpened, isRightSidebarOpened]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const chipVariants = {
    animate: {
      x: ["100%", "-100%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  return (
     <div className={cn(
        "relative flex flex-col justify-start items-center min-h-screen w-full px-4 sm:px-6 md:px-8",
        isAppbarCollapsed ? "pt-32" : "pt-64",
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      )}>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-7xl mb-8 p-6 rounded-lg bg-opacity-20 backdrop-blur-lg"
        style={{ 
          backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 className="text-3xl font-bold mb-4">Welcome to Wapp-Portal</h2>
        <motion.p
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "loop" }}
          className="overflow-hidden whitespace-nowrap text-blue-900 dark:text-blue-500 text-xl"
        >
          Discover a world of possibilities with our intuitive and powerful portal system.
        </motion.p>
      </motion.div>

      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl flex justify-between items-center mb-8"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          {userName}'s Wapp-Portal
        </h1>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowHelp(!showHelp)}
          className="rounded-full"
        >
          <HandHelping className="h-5 w-5" />
        </Button>
      </motion.header>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-7xl mb-8 p-4 rounded-lg bg-opacity-20 backdrop-blur-lg"
            style={{ 
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2 className="text-xl font-semibold mb-2">How to use Wapp-Portal</h2>
            <p>Select a context type below to start working with your desired content. Each card represents a different type of data you can work with in the portal.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-7xl"
      >
        {portalOptions.map((option, index) => (
          <motion.div
            key={option.context}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ContextCard
              {...option}
              isSelected={portalContext === option.context}
              onClick={() => setPortalContext(option.context as ContextType)}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="w-full max-w-7xl overflow-hidden mt-12"
        style={{ height: "40px" }}
      >
        <motion.div
          variants={chipVariants}
          animate="animate"
          className="flex space-x-4"
        >
          {["AI-Powered", "Secure", "Scalable", "Customizable", "Efficient", "Collaborative"].map((text, index) => (
            <Chip key={index} color="primary">
              {text}
            </Chip>
          ))}
        </motion.div>
      </motion.div>

    </div>
  );
};

export default PortalPage;
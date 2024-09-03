"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { FileText, SquareTerminal, FileImage, FileAudio, FileVideo } from "lucide-react";
import { useTheme } from "next-themes";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { usePortalContextHook } from "@/context/portal-context-provider";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

type ContextType = "TEXT" | "CODE" | "IMAGE" | "AUDIO" | "VIDEO";

const PortalPage = () => {
  const { portalContext, setPortalContext } = usePortalContextHook();
  const { setLeftSidebarWidth, setRightSidebarWidth, isAppbarCollapsed } = useMyspaceContext();
  const { user } = useUser();
  const { theme } = useTheme();
  const router = useRouter();
  const userName = user?.firstName ? capitalizeFirstLetter(user.firstName) : 'Wapp-Portal';

  useEffect(() => {
    setLeftSidebarWidth(0);
    setRightSidebarWidth(0);
  }, []);

  const contextOptions = [
    { value: "TEXT", icon: FileText, title: "AI TEXT PORTAL", text: "AI for TEXT" },
    { value: "CODE", icon: SquareTerminal, title: "AI CODE PORTAL", text: "AI for CODE" },
    { value: "IMAGE", icon: FileImage, title: "AI IMAGE PORTAL", text: "AI for IMAGE" },
    { value: "AUDIO", icon: FileAudio, title: "AI AUDIO PORTAL", text: "AI for AUDIO" },
    { value: "VIDEO", icon: FileVideo, title: "AI VIDEO PORTAL", text: "AI for VIDEO" },
  ];

  const handleRedirect = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/myspace/apps/portal/viewport")
  };

  return (
    <div className={`relative flex flex-col justify-center items-center min-h-screen h-full p-6 mt-28 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold mb-12 mt-16 text-center"
      >
        Welcome to {userName}'s Wapp-Portal
      </motion.h1>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl"
      >
        {contextOptions.map((option) => (
          <ContextCard
            key={option.value}
            {...option}
            isSelected={portalContext === option.value}
            onClick={() => setPortalContext(option.value as ContextType)}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12"
      >
        <Button
          size="lg"
          variant="default"
          onClick={(e) => handleRedirect(e)}
          className="px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Enter Viewport
        </Button>
      </motion.div>
    </div>
  );
};

const ContextCard = ({ value, icon: Icon, title, text, isSelected, onClick }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`cursor-pointer rounded-xl overflow-hidden shadow-lg ${
        isSelected
          ? 'ring-4 ring-blue-500'
          : theme === 'dark'
          ? 'bg-gray-800'
          : 'bg-white'
      }`}
      onClick={onClick}
    >
      <div className="p-6">
        <Icon className={`w-16 h-16 mb-4 ${isSelected ? 'text-blue-500' : 'text-gray-400'}`} />
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{text}</p>
      </div>
      <div
        className={`h-2 w-full ${
          isSelected ? 'bg-blue-500' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`}
      />
    </motion.div>
  );
};

export default PortalPage;
"use client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useSelector } from 'react-redux';
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { setPortalContext } from '@/stores/features/apps/portal/portalsSlice';
import Link from "next/link";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { useCallback } from 'react';
import { Button } from "@/components/ui/button";

export const ContextCard = ({ context, url, icon: Icon, title, text, isSelected, onClick }) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const {
    isLeftSidebarOpened,
    setIsLeftSidebarOpened,
    setLeftSidebarWidth,
  } = useMyspaceContext();
  
  const isDark = theme === 'dark';

  const handleSidebar = useCallback(() => {
    const lowercaseContext = context.toLowerCase();
    
    if (lowercaseContext === "code") {
      dispatch(setPortalContext("code-project"));
    } else {
      dispatch(setPortalContext(lowercaseContext));
    }

    if (!isLeftSidebarOpened) {
      setIsLeftSidebarOpened(true);
      setLeftSidebarWidth(250);
    }
  }, [context, isLeftSidebarOpened, setIsLeftSidebarOpened, setLeftSidebarWidth, dispatch]);

  const handleClick = useCallback((e) => {
    onClick?.(e);
    handleSidebar();
  }, [onClick, handleSidebar]);

  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.98 }}
      className={`
        rounded-xl overflow-hidden transition-all duration-300 ease-in-out
        ${isSelected
          ? 'ring-4 ring-blue-500 shadow-xl'
          : isDark
            ? 'bg-gray-800 hover:bg-gray-750'
            : 'bg-white hover:bg-gray-50'
        }
        ${isDark ? 'shadow-dark-lg' : 'shadow-lg'}
      `}
      role="button"
      aria-pressed={isSelected}
    >
      <div className="p-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: isSelected ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className={`w-20 h-20 mb-4 ${isSelected ? 'text-blue-500' : isDark ? 'text-gray-300' : 'text-gray-600'}`} />
        </motion.div>
        <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>{text}</p>
        <Link href={url} passHref>
          <Button
            onClick={handleClick}
            className="mt-4 w-full"
            variant={isSelected ? "default" : "outline"}
          >
            Enter Portal
          </Button>
        </Link>
      </div>
      <motion.div
        className={`h-2 w-full ${isSelected ? 'bg-blue-500' : isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isSelected ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};
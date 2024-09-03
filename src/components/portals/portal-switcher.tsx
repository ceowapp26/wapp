"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { setPortalContext } from '@/stores/features/apps/portal/portalsSlice';
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { usePortalContextHook } from '@/context/portal-context-provider';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, Check } from "lucide-react";
import { portalOptions } from "@/constants/portals";

export const PortalSwitcher = () => {
  const dispatch = useAppDispatch();
  const { portalContext, setPortalContext } = usePortalContextHook();
  const [isOpen, setIsOpen] = useState(false);
  const {
    isLeftSidebarOpened,
    setIsLeftSidebarOpened,
    leftSidebarType,
    setLeftSidebarType,
    setLeftSidebarWidth,
  } = useMyspaceContext();

  const handleSidebar = useCallback((context) => {
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
  }, [isLeftSidebarOpened, setIsLeftSidebarOpened, setLeftSidebarWidth, dispatch]);

  const currentPortal = portalOptions.find(portal => portal.context === portalContext);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="flex items-center justify-between w-48 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300 ease-in-out">
        {currentPortal ? (
          <div className="flex items-center">
            <Avatar className="w-6 h-6 mr-2">
              <AvatarFallback>
                <currentPortal.icon className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <span>{currentPortal.title}</span>
          </div>
        ) : (
          <span className="flex items-center w-48">Select AI Portal</span>
        )}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 ml-2" />
        </motion.div>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent
            as={motion.div}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-64 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <DropdownMenuLabel className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              AI Portals
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <div className="max-h-60 overflow-y-auto">
              {portalOptions.map((portal) => (
                <DropdownMenuItem 
                  key={portal.context} 
                  onSelect={() => {
                    handleSidebar(portal.context);
                    setPortalContext(portal.context);
                    setIsOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900 cursor-pointer transition-colors duration-150 ease-in-out"
                >
                  <Link href={portal.url} className="flex items-center w-full">
                    <Avatar className="w-8 h-8 mr-3 ring-2 ring-indigo-500 dark:ring-indigo-400 ring-offset-2">
                      <AvatarFallback>
                        <portal.icon className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-grow truncate">{portal.title}</span>
                    {portalContext === portal.context && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
};
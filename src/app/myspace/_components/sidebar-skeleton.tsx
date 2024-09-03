"use client";

import {
  ChevronsRight,
  ChevronsLeft,
  X
} from "lucide-react";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMyspaceContext } from "@/context/myspace-context-provider";

interface RightSidebarProps {
  children: React.ReactNode;
}

export const RightSidebarSkeleton = ({ children }: RightSidebarProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [isHoveringRightEdge, setIsHoveringRightEdge] = useState(false);
  const { isRightSidebarOpened, setIsRightSidebarOpened, rightSidebarWidth, setRightSidebarWidth } = useMyspaceContext();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX } = event;
      const windowWidth = window.innerWidth;
      const edgeThreshold = 20;
      setIsHoveringRightEdge(clientX >= windowWidth - edgeThreshold);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMoveResize);
    document.addEventListener("mouseup", handleMouseUpResize);
  };

  const handleMouseMoveResize = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = window.innerWidth - event.clientX;
    if (newWidth < 300) newWidth = 300;
    if (newWidth > window.innerWidth - 500) newWidth = window.innerWidth - 500;
    setRightSidebarWidth(newWidth);
    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      sidebarRef.current.style.transition = 'none';
    }
  };

  const handleMouseUpResize = () => {
    isResizingRef.current = false;
    if (sidebarRef.current) {
      sidebarRef.current.style.transition = ''; 
    }
    document.removeEventListener("mousemove", handleMouseMoveResize);
    document.removeEventListener("mouseup", handleMouseUpResize);
  };

  const resetWidth = () => {
    if (sidebarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);
      setRightSidebarWidth(300);
      sidebarRef.current.style.width = isMobile ? "100%" : "300px";
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);
      setIsRightSidebarOpened(false);
      setRightSidebarWidth(0);
      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("right", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  return (
    <React.Fragment>
      <aside
        ref={sidebarRef}
        className={cn(
          `group/sidebar hidden h-full max-h-[88vh] bg-secondary overflow-y-auto absolute right-0 top-[88px] flex-col z-[99]`,
          isRightSidebarOpened && 'flex',
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <AnimatePresence>
          {!isCollapsed && (
            <motion.button
              onClick={collapse}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "absolute z-[99] top-5 left-5 p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30",
                isMobile ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100"
              )}
            >
              <ChevronsRight className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.button
              onClick={collapse} 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "absolute z-[99] top-5 right-2 p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30",
                isMobile ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100"
              )}
            >
              <X className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {children}
        <motion.div
          onMouseDown={handleMouseDown}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 left-0 top-0"
          whileHover={{ backgroundColor: "rgba(var(--primary-rgb), 0.3)" }}
        />
      </aside>

      <AnimatePresence>
        <motion.div
          ref={navbarRef}
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          exit={{ x: 50 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={cn(
            "absolute top-1/2 z-[99] !right-0 max-w-[50px]",
            isResetting && "transition-all ease-in-out duration-300",
            isMobile && "!right-0 max-w-[50px]"
          )}
        >
          {(isCollapsed || !isRightSidebarOpened) && 
            <motion.button
              onClick={() => {
                setIsRightSidebarOpened(true);
                resetWidth();
              }}
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "p-2 rounded-l-lg bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30",
                isHoveringRightEdge ? "opacity-100" : "opacity-0"
              )}
            >
              <ChevronsLeft className="h-6 w-6 text-muted-foreground" />
            </motion.button>
          }
        </motion.div>
      </AnimatePresence>
    </React.Fragment>
  );
}



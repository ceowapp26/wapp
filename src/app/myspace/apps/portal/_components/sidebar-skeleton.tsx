"use client";

import {
  ChevronsLeft,
  ChevronsRight,
  MenuIcon,
  X
} from "lucide-react";
import React, { ElementRef, useEffect, useRef, useState, ReactNode } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ToggleNavigation } from "./toggle-navigation";

interface LeftSidebarProps {
  children: ReactNode;
}

export const LeftSidebarSkeleton = ({ children }: LeftSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const { isLeftSidebarOpened, setIsLeftSidebarOpened, leftSidebarWidth, setLeftSidebarWidth, setLeftSidebarHeight } = useMyspaceContext();
  const [isHoveringLeftEdge, setIsHoveringLeftEdge] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX } = event;
      const edgeThreshold = 10;
      setIsHoveringLeftEdge(clientX <= edgeThreshold);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMoveResize);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMoveResize = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;
    if (newWidth < 250) newWidth = 250;
    if (newWidth > 500) newWidth = 500;
    setLeftSidebarWidth(newWidth);
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
      sidebarRef.current.style.transition = 'none';
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    if (sidebarRef.current) {
      sidebarRef.current.style.transition = ''; 
    }
    document.removeEventListener("mousemove", handleMouseMoveResize);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);
      setIsLeftSidebarOpened(true);
      setLeftSidebarWidth(250);
      sidebarRef.current.style.width = isMobile ? "100%" : "250px";
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);
      setIsLeftSidebarOpened(false);
      setLeftSidebarWidth(0);
      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  return (
    <React.Fragment>
      <aside
        ref={sidebarRef}
        className={cn(
          "wapp-sidebar group/sidebar hide-scroll-bar h-full min-h-[118vh] bg-secondary top-[88px] overflow-y-auto relative hidden w-[250px] flex-col z-[99]",
          isResetting && "transition-all ease-in-out duration-300",
          isLeftSidebarOpened && "flex",
          isMobile && "w-0"
        )}
        style={{ maxHeight: '120vh' }}
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
                "absolute z-[99] top-5 left-3 p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30",
                isMobile ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100"
              )}
            >
              <X className="h-5 w-5" />
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
              <ChevronsLeft className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {children}
        <motion.div
          onMouseDown={handleMouseDown}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
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
            "absolute top-1/2 z-[99] max-w-[50px] left-0",
            isResetting && "transition-all ease-in-out duration-300",
            isMobile && "pl-14 top-8 z-[101]"
          )}
        >
          {!!params.documentId ? (
            <ToggleNavigation
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              isLeftSidebarOpened={isLeftSidebarOpened}
              onResetWidth={resetWidth}
              isHoveringLeftEdge={isHoveringLeftEdge}
            />
          ) : (
            (isCollapsed || !isLeftSidebarOpened) && (
              isMobile ? (
                <motion.button
                  onClick={resetWidth}
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent fixed top-3 p-6 left-10"
                >
                  <MenuIcon className="h-6 w-6 text-muted-foreground" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={resetWidth}
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "p-2 rounded-r-lg bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30 left-0 top-0",
                    isHoveringLeftEdge ? "opacity-100" : "opacity-0"
                  )}
                >
                  <ChevronsRight className="h-6 w-6 text-muted-foreground" />
                </motion.button>
              )
            )
          )}
        </motion.div>
      </AnimatePresence>
    </React.Fragment>
  );
};



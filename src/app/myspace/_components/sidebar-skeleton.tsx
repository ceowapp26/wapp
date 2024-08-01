"use client";

import {
  ChevronsRight,
  ChevronsLeft,
  X
} from "lucide-react";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { useStore } from '@/redux/features/apps/document/store';

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

  /*useEffect(() => {
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
  }, []);*/

  useEffect(() => {
    if (isCollapsed) {
      sidebarRef.current!.style.width = isHoveringRightEdge ? (isMobile ? "100%" : "300px") : "0px";
    }
  }, [isCollapsed, isHoveringRightEdge, isMobile]);

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
    }
  };

  const handleMouseUpResize = () => {
    isResizingRef.current = false;
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
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute z-[99] top-3 left-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsRight className="h-6 w-6" />
        </div>
        <div
          onClick={() => setIsRightSidebarOpened(false)} 
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute z-[99] top-3 right-0 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
          >
            <X className="h-6 w-6" />
        </div>
        {children}
        <div
          onMouseDown={handleMouseDown}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 left-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-56 z-[99] !right-0 max-w-[50px]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "!right-0 max-w-[50px]"
        )}
      >
        {isCollapsed && 
          <>
            <span className={`bg-transparent w-[30px] h-full relative justify-end ${isHoveringRightEdge ? 'right-[300px]' : 'right-0'} top-0 flex items-center border-[1px] rounded-l-lg`}>
              <ChevronsLeft onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />
            </span>
          </>
        }
      </div>
    </React.Fragment>
  );
}

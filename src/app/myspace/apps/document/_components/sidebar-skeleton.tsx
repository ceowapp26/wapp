"use client";
import {
  ChevronsLeft,
  ChevronsRight,
  MenuIcon,
} from "lucide-react";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { cn } from "@/lib/utils";
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
  const { isLeftSidebarOpened, setIsLeftSidebarOpened, leftSidebarWidth, setLeftSidebarWidth } = useMyspaceContext();
  const [isHoveringLeftEdge, setIsHoveringLeftEdge] = useState(false);

  /*useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX } = event;
      const edgeThreshold = 20;
      setIsHoveringLeftEdge(clientX <= edgeThreshold);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);*/

  useEffect(() => {
    if (isCollapsed && !isMobile) {
      sidebarRef.current.style.width = isHoveringLeftEdge ? "240px" : "0px";
    }
  }, [isCollapsed, isHoveringLeftEdge, isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

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

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    setLeftSidebarWidth(newWidth);

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMoveResize);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);
      setLeftSidebarWidth(240);
      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty(
        "left",
        isMobile ? "100%" : "240px"
      );
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);
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
          "wapp-sidebar group/sidebar hide-scroll-bar h-full min-h-[118vh] bg-secondary top-[88px] overflow-y-auto relative hidden w-60 flex-col z-[99]",
          isResetting && "transition-all ease-in-out duration-300",
          isLeftSidebarOpened && "flex",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <span className={`bg-transparent w-[30px] ${isHoveringLeftEdge ? 'hidden' : 'flex'} h-full top-0 justify-start items-center rounded-l-md`}>
            <ChevronsLeft className="h-6 w-6" />
          </span>
        </div>
        {children}
        <div
          onMouseDown={handleMouseDown}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute min-h-[250vh] w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-56 z-[99]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile ? "pl-14 top-8 z-[101]" : `left-${leftSidebarWidth}px`
        )}
      >
        {!!params.documentId ? (
          <ToggleNavigation
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            onResetWidth={resetWidth}
            isHoveringLeftEdge={isHoveringLeftEdge}
          />
        ) : (
          isCollapsed && (
            isMobile ? (
              <span className="bg-transparent fixed top-2 p-6 left-10">
                <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />
              </span>
            ) : (
              <span className={`bg-transparent w-[30px] ${isHoveringLeftEdge ? 'left-60' : 'left-0'} h-full top-0 flex relativejustify-end items-center rounded-r-lg`}>
                <ChevronsRight onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />
              </span>
            )
          )
        )}
      </div>
    </React.Fragment>
  )
}



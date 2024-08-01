"use client";

import {
  ChevronsLeft,
  ChevronsRight,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
  ArrowLeftToLine
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useMediaQuery } from "usehooks-ts";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import $ from 'jquery';
import { SiGitbook } from "react-icons/si";

const BookSideBar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const {leftSidebarWidth, setLeftSidebarWidth, tabIndex, setTabIndex} = useMyspaceContext();
  const isResizingRef = useRef(false);
  const sidebarRef = useRef(null);
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [currentSection, setCurrentSection] = useState(null);
  const searchRef = useRef(null);
  const favoriteRef = useRef(null);
  const readingnowRef = useRef(null);
  const toreadRef = useRef(null);
  const havereadRef = useRef(null);

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
  }, [isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) {
      newWidth = 240;
      setLeftSidebarWidth(240);
    }
    if (newWidth > 480) {
      newWidth = 480;
      setLeftSidebarWidth(480);
    }
    setLeftSidebarWidth(newWidth);
    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };


  const resetWidth = () => {
    if (sidebarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);
      setLeftSidebarWidth(240);
      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);
      setLeftSidebarWidth(20);
      sidebarRef.current.style.width = "0";
      setTimeout(() => setIsResetting(false), 300);
    }
  }

  const backToMainPage = () => {
    router.push("/myspace/apps/book")
  }

  return (
    <>
      <aside 
        ref={sidebarRef}
        className={cn(
            "group/sidebar h-full bg-secondary overflow-auto fixed top-[88px] flex w-60 flex-col border-gray-300 border-2 z-[99]",
            isResetting && "transition-all ease-in-out duration-300",
            isMobile && "w-0"
        )}
      >
        <div className="pb-20">
          <div
            onClick={collapse} 
            role="button"
            className={cn(
              "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
              isMobile && "opacity-100"
            )}
          >
            <ChevronsLeft className="h-6 w-6"/>
          </div>
          <div
            onClick={backToMainPage} 
            role="button"
            className={cn(
              "h-8 w-8 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 left-2 opacity-0 group-hover/sidebar:opacity-100 transition"
            )}
          >
            <ArrowLeftToLine className="h-8 w-8 py-2"/>
            Back
          </div>
        </div>
         <Link className='flex flex-row px-2 py-6 gap-x-2 items-center justify-start' href='/myspce/apps/book'>
          <SiGitbook className="p-1 text-white text-4xl rounded-full bg-gradient-to-r from-pink-500 to-[#ffa69e]" />
          <span className="text-md font-bold text-black dark:text-white pl-1">WApp Book</span>
        </Link>
        <nav>
          <ul>
            <li>
             <a
                ref={searchRef} 
                id="#search"
                onClick={() => {
                  setTabIndex(undefined)
                  setCurrentSection("#search")
                }} 
                className={`flex items-center mx-2 px-8 py-4 cursor-pointer rounded-lg bg-bg-color font-semibold transition-all duration-200 hover:shadow-md ${currentSection === '#search' ? 'bg-primary text-white dark:text-black' : ''}`} 
              >
                <span className="icon px-2">🔍</span>Search
              </a>
            </li>
            <li className="flex items-center px-8 py-4 bg-bg-color font-semibold">MY LIBRARY</li>
            <li>
              <a 
                ref={favoriteRef} 
                onClick={() => { 
                  setTabIndex(0)
                  setCurrentSection("#favorite") 
                }} 
                className={`flex items-center mx-2 px-8 py-4 cursor-pointer rounded-lg bg-bg-color font-semibold transition-all duration-200 hover:shadow-md ${tabIndex === 0 ? 'bg-primary text-white dark:text-black' : ''}`} 
                href="#favorite"
              >
                <span className="icon px-2">💖</span>My Favorites
              </a>
            </li>
            <li>
              <a 
                ref={readingnowRef} 
                onClick={() => { 
                  setTabIndex(1)
                  setCurrentSection("#readingnow") 
                }}
                className={`flex items-center mx-2 px-8 py-4 cursor-pointer rounded-lg bg-bg-color font-semibold transition-all duration-200 hover:shadow-md ${tabIndex === 1 ? 'bg-primary text-white dark:text-black' : ''}`} 
                href="#readingnow"
              >
                <span className="icon px-2">👽</span>Reading Now
              </a>
            </li>
            <li>
               <a 
                ref={toreadRef} 
                onClick={() => { 
                  setTabIndex(2)
                  setCurrentSection("#toread") 
                }} 
                className={`flex items-center mx-2 px-8 py-4 cursor-pointer rounded-lg bg-bg-color font-semibold transition-all duration-200 hover:shadow-md ${tabIndex === 2 ? 'bg-primary text-white dark:text-black' : ''}`} 
                href="#toread"
              >
                <span className="icon px-2">🌈</span>To Read
              </a>
            </li>
            <li>
              <a 
                ref={havereadRef} 
                onClick={() => { 
                  setTabIndex(3)
                  setCurrentSection("#haveread") 
                }} 
                className={`flex items-center mx-2 px-8 py-4 cursor-pointer rounded-lg bg-bg-color font-semibold transition-all duration-200 hover:shadow-md ${tabIndex === 3 ? 'bg-primary text-white dark:text-black' : ''}`} 
                href="#haveread"
              >
                <span className="icon px-2">🌺</span>Have Read
              </a>
            </li>
          </ul>

        </nav>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        className={cn(
          "absolute top-[25px] ml-14 z-[101]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "top-6 ml-12"
        )}
      >
        <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />}
        </nav>
      </div>
    </>
  )
}

export default BookSideBar;






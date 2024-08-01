"use client";

import {
  ChevronsLeft,
  ChevronsRight,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";
import Link from 'next/link'
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useMediaQuery } from "usehooks-ts";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { useBooks } from "@/hooks/use-books";
import $ from 'jquery';
import { SiGitbook } from "react-icons/si";

const BookSideBar = () => {
  const books = useBooks();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const {leftSidebarWidth, setLeftSidebarWidth } = useMyspaceContext();
  const isResizingRef = useRef(false);
  const sidebarRef = useRef(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [currentSection, setCurrentSection] = useState(null);
  const searchRef = useRef(null);
  const forYouRef = useRef(null);
  const fictionRef = useRef(null);
  const poetryRef = useRef(null);
  const fantasyRef = useRef(null);
  const romanceRef = useRef(null);
  const refs = [
    { ref: searchRef, hash: '#search' },
    { ref: forYouRef, hash: '#foryou' },
    { ref: fictionRef, hash: '#fiction' },
    { ref: poetryRef, hash: '#poetry' },
    { ref: fantasyRef, hash: '#fantasy' },
    { ref: romanceRef, hash: '#romance' },
  ];

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
      setLeftSidebarWidth(0);
      sidebarRef.current.style.width = "0";
      setTimeout(() => setIsResetting(false), 300);
    }
  }

  const scrollToView = (event) => {
    const elementId = event.target.id.substring(1);
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setCurrentSection(`#${elementId}`);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = document.body.scrollTop;
      let foundSection = "#search";
      refs.forEach(({ ref, hash }) => {
        const element = document.getElementById(hash.substring(1));
        if (element && element.offsetTop <= scrollPosition &&
        element.offsetTop + element.offsetHeight >= scrollPosition) {
          foundSection = hash;
        }
      });

      setCurrentSection(foundSection);
    };

    $(document.body).on("scroll", handleScroll);
    return () => {
     $(document.body).off('scroll', handleScroll);
    };
  }, []);

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
        <Link className='flex flex-row px-2 py-8 gap-x-2 items-center justify-start' href='/myspce/apps/book'>
          <SiGitbook className="p-1 text-white text-4xl rounded-full bg-gradient-to-r from-pink-500 to-[#ffa69e]" />
          <span className="text-md font-bold text-black dark:text-white pl-1">WApp Book</span>
        </Link>
        <nav>
          <ul>
            <li className="py-2 px-2 text-black font-semibold dark:text-white">DISCOVER</li>
            <li>
              <a
                id="#search"
                onClick={scrollToView} 
                ref={searchRef} 
                className={`flex items-center mx-2 px-8 py-4 cursor-pointer rounded-lg bg-bg-color font-semibold transition-all duration-200 hover:shadow-md ${currentSection === '#search' ? 'bg-primary text-white dark:text-black' : ''}`} 
              >
                <span className="px-2 icon">🔍</span>Search
              </a>
            </li>
            <li>
              <a
                id="#foryou"
                onClick={scrollToView} 
                ref={forYouRef}
                className={`flex items-center mx-2 px-8 py-4 cursor-pointer rounded-lg bg-bg-color font-semibold transition-all duration-200 hover:shadow-md ${currentSection === '#foryou' ? 'bg-primary text-white dark:text-black' : ''}`} 
              >
                <span className="px-2 icon">💖</span>For you
              </a>
            </li>
            <li className="py-2 px-2 text-black font-semibold dark:text-white">LIBRARY</li>
            <ul>
              <li>
                <a
                  id="#fiction"
                  onClick={scrollToView} 
                  ref={fictionRef}
                  className={`flex items-center mx-2 px-8 py-4 cursor-pointer rounded-lg bg-bg-color font-semibold transition-all duration-200 hover:shadow-md ${currentSection === '#fiction' ? 'bg-primary text-white dark:text-black' : ''}`} 
                >
                  <span className="px-2 icon">👽</span>Fiction
                </a>
              </li>
              <li>
                <a
                  id="#poetry"
                  onClick={scrollToView}
                  ref={poetryRef} 
                  className={`flex items-center mx-2 px-8 py-4 cursor-pointer rounded-lg bg-bg-color font-semibold transition-all duration-200 hover:shadow-md ${currentSection === '#poetry' ? 'bg-primary text-white dark:text-black' : ''}`} 
                >
                  <span className="px-2 icon">🌈</span>Poetry
                </a>
              </li>
              <li>
                <a
                  id="#fantasy"
                  onClick={scrollToView}
                  ref={fantasyRef} 
                  className={`flex items-center mx-2 px-8 py-4 cursor-pointer rounded-lg bg-bg-color font-semibold transition-all duration-200 hover:shadow-md ${currentSection === '#fantasy' ? 'bg-primary text-white dark:text-black' : ''}`} 
                >
                  <span className="px-2 icon">🌺</span>Fantasy
                </a>
              </li>
              <li>
                <a
                  id="#romance"
                  onClick={scrollToView}
                  ref={romanceRef} 
                  className={`flex items-center mx-2 px-8 py-4 cursor-pointer rounded-lg bg-bg-color font-semibold transition-all duration-200 hover:shadow-md ${currentSection === '#romance' ? 'bg-primary text-white dark:text-black' : ''}`} 
                >
                  <span className="px-2 icon">💕</span>Romance
                </a>
              </li>
               <li>
                <a
                  id="#more"
                  onClick={books.onOpen}
                  className={`flex items-center mx-2 px-8 py-4 cursor-pointer rounded-lg bg-bg-color font-semibold transition-all duration-200 hover:shadow-md ${currentSection === '#more' ? 'bg-primary text-white dark:text-black' : ''}`} 
                >
                  <span className="px-2 icon">💕</span>More
                </a>
              </li>
            </ul>
            <li className="flex items-center mx-2 px-8 py-4 cursor-pointer rounded-lg bg-bg-color font-semibold transition-all duration-200 cursor-pointer hover:shadow-md">
              <Link href="/myspace/apps/book/mylib"><span className="px-2 icon">📚</span>My Library</Link>
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


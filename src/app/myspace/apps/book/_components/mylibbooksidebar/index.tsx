"use client";

import { useState, useRef, useEffect } from "react";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { useBooks } from "@/hooks/use-books";
import { SiGitbook } from "react-icons/si";
import {
  ChevronsLeft,
  ChevronsRight,
  Search,
  Heart,
  Feather,
  Wand2,
  HeartHandshake,
  MoreHorizontal,
  Library,
  ArrowLeftToLine,
  BookOpen, 
  Bookmark, 
  CheckCircle
} from "lucide-react";

const BookSideBar = () => {
  const books = useBooks();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const {leftSidebarWidth, setLeftSidebarWidth, tabIndex, setTabIndex} = useMyspaceContext();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [currentSection, setCurrentSection] = useState("#search");
  const sidebarRef = useRef(null);

  const sections = [
    { id: "search", icon: <Search className="w-5 h-5" />, label: "Search" },
    { id: "favorite", icon: <Heart className="w-5 h-5" />, label: "My Favorite" },
    { id: "readingnow", icon: <BookOpen className="w-5 h-5" />, label: "Reading Now" },
    { id: "toread", icon: <Bookmark className="w-5 h-5" />, label: "To Read" },
    { id: "haveread", icon: <CheckCircle className="w-5 h-5" />, label: "Have Read" },
  ];

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  const resetWidth = () => {
    setIsCollapsed(false);
    setLeftSidebarWidth(240);
  };

  const collapse = () => {
    setIsCollapsed(true);
    setLeftSidebarWidth(0);
  };

  const toggleSidebar = () => {
    isCollapsed ? resetWidth() : collapse();
  };

  const handleSectionClick = (sectionId, index) => {
    setCurrentSection(sectionId);
    if (sectionId === "search") {
      setTabIndex(undefined)
    }
    setTabIndex(index - 1 )
  };

  const backToMainPage = () => {
    router.push("/myspace/apps/book")
  }


  return (
    <>
      <motion.aside 
        ref={sidebarRef}
        initial={{ width: isMobile ? 0 : 240 }}
        animate={{ width: isCollapsed ? 0 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed top-[88px] left-0 h-[calc(100vh-88px)] bg-white dark:bg-gray-800 overflow-hidden z-[99] shadow-lg",
          isCollapsed ? "w-0" : "w-60"
        )}
      >
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              <Link className='flex items-center px-4 py-6 gap-x-2' href='/myspace/apps/book'>
                <SiGitbook className="text-4xl text-primary" />
                <span className="text-lg font-bold text-primary dark:text-primary-light">WApp Book</span>
              </Link>
              <nav className="flex-grow">
                <div className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400">LIBRARY</div>
                {sections.map((section, index) => (
                  <SidebarItem
                    key={section.id}
                    {...section}
                    isActive={currentSection === `#${section.id}`}
                    onClick={() => handleSectionClick(section.id, index)}
                  />
                ))}
              </nav>
              <Link 
                href="/myspace/apps/book"
                className="flex items-center px-4 py-3 m-2 rounded-lg bg-primary/10 text-primary dark:bg-primary-dark/10 dark:text-primary-light font-semibold hover:bg-primary/20 dark:hover:bg-primary-dark/20 transition-colors"
              >
                <ArrowLeftToLine className="w-5 h-5 mr-3" />
                Back
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
      <button
        onClick={toggleSidebar}
        className={cn(
          "fixed top-[100px] left-2 z-[100] p-2 rounded-full bg-primary text-white dark:bg-primary-dark dark:text-gray-200 shadow-lg transition-all duration-300",
          isCollapsed ? "translate-x-0" : "translate-x-56"
        )}
      >
        {isCollapsed ? <ChevronsRight className="w-6 h-6" /> : <ChevronsLeft className="w-6 h-6" />}
      </button>
    </>
  );
};

const SidebarItem = ({ id, icon, label, isActive, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={cn(
      "flex items-center w-full px-4 py-3 rounded-lg transition-colors",
      isActive 
        ? "bg-primary text-white dark:bg-primary-dark dark:text-gray-200" 
        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
    )}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </motion.button>
);


export default BookSideBar;






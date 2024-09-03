"use client";
import { useRef, useEffect, useState } from "react";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { AiFillHome } from 'react-icons/ai';
import { FiMusic, FiUsers, FiRadio, FiHeart, FiMenu } from 'react-icons/fi';
import { BsMusicPlayer } from "react-icons/bs";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { SiMusicbrainz } from "react-icons/si";
import NavLink from './NavLink';
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const SideBar = () => {
  const isMobile = useMediaQuery("(max-width: 480px)");
  const { leftSidebarWidth, setLeftSidebarWidth } = useMyspaceContext();
  const isResizingRef = useRef(false);
  const sidebarRef = useRef(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const { theme } = useTheme();

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  const handleMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

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
  };

  const sidebarVariants = {
    expanded: { width: 240 },
    collapsed: { width: 0 }
  };

  return (
    <>
      <motion.aside 
        ref={sidebarRef}
        initial={isMobile ? "collapsed" : "expanded"}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "group/sidebar pt-14 h-screen overflow-hidden fixed flex flex-col z-[9999]",
          isResetting && "transition-all ease-in-out duration-300",
          theme === 'dark' ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-gray-100 via-white to-gray-200",
          isMobile && "top-20"
        )}
      >
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              <Link className='flex flex-row px-2 py-8 gap-x-2 items-center justify-start' href='/myspce/apps/music/home'>
                <SiMusicbrainz className="p-1 text-4xl rounded-full bg-gradient-to-r from-pink-500 to-[#ffa69e]" />
                <span className="text-md font-bold pl-1">WApp Music</span>
              </Link>

              <nav className="flex-1 overflow-y-auto">
                <div className="flex flex-col p-2">
                  <h2 className="mb-6 text-sm font-medium text-pink-500">DISCOVER</h2>
                  <ul>
                    <li><NavLink slug=''><AiFillHome /><span className="pl-1">Home</span></NavLink></li>
                    <li><NavLink slug='top_tracks'><FiMusic /><span className="pl-1">Songs</span></NavLink></li>
                    <li><NavLink slug='top_artists'><FiUsers /><span className="pl-1">Artists</span></NavLink></li>
                    <li><NavLink slug='radio'><FiRadio /><span className="pl-1">Radio</span></NavLink></li>
                  </ul>
                </div>
                <div className="flex flex-col p-2">
                  <h2 className="mb-6 text-sm font-medium text-pink-500">LIBRARY</h2>
                  <ul>
                    <li><NavLink slug='favorites'><FiHeart /><span className="pl-1">Favorites</span></NavLink></li>
                  </ul>
                </div>
                <div className="flex flex-col p-2">
                  <h2 className="mb-6 text-sm font-medium text-pink-500">Lofi</h2>
                  <ul>
                    <li><NavLink isLofi={true}><BsMusicPlayer /><span className="pl-1">Lofi Chill</span></NavLink></li>
                  </ul>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="absolute top-3 right-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isCollapsed ? (
            <ChevronsRight onClick={resetWidth} className="h-6 w-6 cursor-pointer" />
          ) : (
            <ChevronsLeft onClick={collapse} className="h-6 w-6 cursor-pointer" />
          )}
        </motion.div>

        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="absolute h-full w-1 bg-primary/10 right-0 top-0 cursor-ew-resize"
        />
      </motion.aside>
      <div
        className={cn(
          "absolute top-[30px] ml-14 z-[101]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "top-6 ml-12"
        )}
      >
        <nav className="bg-transparent px-3 py-2">
          {isCollapsed && <FiMenu onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />}
        </nav>
      </div>
    </>
  )
}

export default SideBar;



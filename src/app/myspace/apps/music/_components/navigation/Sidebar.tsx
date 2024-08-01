"use client";
import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useMediaQuery } from "usehooks-ts";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { AiFillHome, AiFillGithub } from 'react-icons/ai';
import { FiMusic, FiUsers, FiRadio, FiHeart, FiMenu } from 'react-icons/fi';
import { BsMusicPlayer } from "react-icons/bs";
import { ChevronsLeft } from "lucide-react";
import { SiMusicbrainz } from "react-icons/si";
import NavLink from './NavLink';
import clsx from 'clsx';

const SideBar = () => {
  const isMobile = useMediaQuery("(max-width: 480px)");
  const { leftSidebarWidth, setLeftSidebarWidth } = useMyspaceContext();
  const isResizingRef = useRef(false);
  const sidebarRef = useRef(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

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

    if (newWidth < 240) {
      newWidth = 240;
    }
    if (newWidth > 480) {
      newWidth = 480;
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
  };

  return (
    <>
      <aside 
        ref={sidebarRef}
        className={cn(
          "group/sidebar pt-14 h-screen bg-gradient-to-br from-[#0B1538] via-[#0B163B] to-[#0A1743] overflow-auto fixed flex flex-col w-60 z-[9999]",
          isResetting && "transition-all ease-in-out duration-300",
          !isCollapsed && "pr-9 pl-7",
          isCollapsed && "p-0",
          isMobile && "w-0 top-20 p-0"
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
        <Link className='flex flex-row px-2 py-8 gap-x-2 items-center justify-start' href='/myspce/apps/music/home'>
          <SiMusicbrainz className="p-1 text-white text-4xl rounded-full bg-gradient-to-r from-pink-500 to-[#ffa69e]" />
          <span className="text-md font-bold text-white pl-1">WApp Music</span>
        </Link>

        <div className="flex flex-col p-2">
        <h2 className="mb-6 text-sm font-medium text-pink-500">DISCOVER</h2>
          <ul>
            <li>
              <NavLink slug=''>
                <AiFillHome />
                <span className="pl-1">Home</span>
              </NavLink>
            </li>

            <li>
              <NavLink slug='top_tracks'>
                <FiMusic />
                <span className="pl-1">Songs</span>
              </NavLink>
            </li>

            <li>
              <NavLink slug='top_artists'>
                <FiUsers />
                <span className="pl-1">Artists</span>
              </NavLink>
            </li>

            <li>
              <NavLink slug='radio'>
                <FiRadio />
                <span className="pl-1">Radio</span>
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="flex flex-col p-2">
          <h2 className="mb-6 text-sm font-medium text-pink-500">LIBRARY</h2>
          <ul>
            <li>
              <NavLink slug='favorites'>
                <FiHeart />
                <span className="pl-1">Favorites</span>
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="flex flex-col p-2">
          <h2 className="mb-6 text-sm font-medium text-pink-500">Lofi</h2>
          <ul>
            <li>
              <NavLink isLofi={true}>
                <BsMusicPlayer />
                <span className="pl-1">Lofi Chill</span>
              </NavLink>
            </li>
          </ul>
        </div>
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
        <nav className="bg-transparent px-3 py-2">
          {isCollapsed && <FiMenu onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />}
        </nav>
      </div>
    </>
  )
}

export default SideBar;

"use client"

import Link from 'next/link';
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from "usehooks-ts";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import {
  ChevronsRight,
  ChevronsLeft,
  X,
  LayoutDashboard,
  Rocket,
  Users,
  Search,
  Globe,
  MessageSquare,
  BarChart2,
  Mail
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, name: 'Dashboard', href: '/myspace/apps/ecommerce/dashboard' },
  { icon: Rocket, name: 'Products', href: '/myspace/apps/ecommerce/products' },
  { icon: Users, name: 'Customers', href: '/myspace/apps/ecommerce/customers' },
  { icon: Search, name: 'Orders', href: '/myspace/apps/ecommerce/orders' },
  { icon: Globe, name: 'Inventory', href: '/myspace/apps/ecommerce/inventory' },
  { icon: MessageSquare, name: 'Reviews', href: '/myspace/apps/ecommerce/reviews' },
  { icon: BarChart2, name: 'Analytics', href: '/myspace/apps/ecommerce/analytics' },
];

export default function Sidebar() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isResizingRef = useRef(false);
  const sidebarRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const { leftSidebarWidth, setLeftSidebarWidth } = useMyspaceContext();
  const [isHoveringRightEdge, setIsHoveringRightEdge] = useState(false);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX } = event;
      const windowWidth = window.innerWidth;
      const edgeThreshold = 20;
      setIsHoveringRightEdge(clientX >= windowWidth - edgeThreshold);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event) => {
    if (!isResizingRef.current) return;
    let newWidth = window.innerWidth - event.clientX;
    newWidth = Math.max(300, Math.min(newWidth, window.innerWidth - 500));
    setLeftSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    setIsCollapsed(false);
    setLeftSidebarWidth(300);
  };

  const collapse = () => {
    setIsCollapsed(true);
    setLeftSidebarWidth(0);
  };

  return (
    <>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.aside
            ref={sidebarRef}
            initial={{ width: 0 }}
            animate={{ width: leftSidebarWidth }}
            exit={{ width: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 pt-24 h-full bg-white dark:bg-gray-800 shadow-lg z-50 flex flex-col"
          >
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Wapp-Ecommerce</h2>
              <button
                onClick={collapse}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto">
              <ul className="p-2 space-y-1">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <span className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                        router.pathname === item.href
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-indigo-100'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}>
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div
              onMouseDown={handleMouseDown}
              className="absolute left-0 top-0 w-1 h-full cursor-ew-resize hover:bg-indigo-300 dark:hover:bg-indigo-700 transition-colors duration-200"
            />
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isCollapsed || isMobile) && (
          <motion.button
            onClick={resetWidth}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-1/2 left-0 z-50 p-2 bg-white dark:bg-gray-800 rounded-r-lg shadow-lg transform -translate-y-1/2 ${
              isHoveringRightEdge ? 'opacity-100' : 'opacity-0'
            } hover:opacity-100 transition-opacity duration-200`}
          >
            <ChevronsRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}



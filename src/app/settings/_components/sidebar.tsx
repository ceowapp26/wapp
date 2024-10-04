"use client"
import React, { useState, useEffect } from "react";
import { Sidebar } from "./sidebar.styles";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from '@clerk/nextjs';
import Divider from '@mui/material/Divider';
import { Avatar, Tooltip } from "@nextui-org/react";
import {
  Menu, CreditCard, Scale, User, Package, ClipboardMinus,
  Settings, LifeBuoy, SquarePen, Activity, LogOut, Warehouse,
  ChevronsLeft, ChevronsRight
} from "lucide-react";
import { CompaniesDropdown } from "./companies-dropdown";

const menuItems = [
  { title: "Profile", icon: <User />, href: "/settings/profile" },
  { title: "Payments", icon: <CreditCard />, href: "/settings/billing" },
  { title: "Balances", icon: <Scale />, href: "/settings/balance" },
  { title: "Products", icon: <Package />, href: "/settings/product" },
  { title: "Reports", icon: <ClipboardMinus />, href: "/settings/report" },
  { title: "Supports", icon: <LifeBuoy />, href: "/settings/support" },
  { title: "Activity", icon: <Activity />, href: "/settings/activity" },
  { title: "Settings", icon: <Settings />, href: "/settings/setting" },
  { title: "Changelog", icon: <SquarePen />, href: "/settings/changelog" },
  { title: "Back Home", icon: <Warehouse />, href: "/home" },
];

const SidebarWrapper = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("");
  const pathname = usePathname();
  const { signOut } = useClerk();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleSignOut = () => signOut(() => router.push('/auth/sign-in'));

  const sidebarVariants = {
    open: { 
      width: isMobile ? "100%" : "240px", 
      transition: { duration: 0.3 } 
    },
    closed: { 
      width: "60px", 
      transition: { duration: 0.3 } 
    },
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 },
  };

  return (
    <>
     {isOpen ? (
        <div className={Sidebar.Overlay()} onClick={() => setIsOpen(true)} />
      ) : null}
     
      <motion.aside
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="h-full min-h-[110vh] dark:text-white text-gray-900/75 bg-background/70 sticky left-0 border-r border-gray-300 dark:border-gray-700 z-40 pt-8 overflow-y-auto"
      >
        <div className="flex flex-col h-full">
          <div className="p-2 flex items-center justify-between">
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <CompaniesDropdown />
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={toggleSidebar}
              className={`sticky dark:text-white text-gray-900/75 p-2 rounded-full dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors ${
                isOpen ? "left-0" : "left-0"
              }`}
            >
              {isOpen ? <ChevronsLeft size={24} /> : <ChevronsRight size={24} />}
            </button>
          </div>

          <nav className="flex-1">
            {menuItems.map((item) => (
              <NextLink key={item.href} href={item.href} passHref>
                <motion.a
                  className={`flex items-center p-3 my-1 text-sm dark:hover:bg-gray-800 hover:bg-gray-200 transition-colors ${
                    activeItem === item.href ? "bg-violet-600/80" : ""
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-3">{item.icon}</span>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span variants={itemVariants}>
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.a>
              </NextLink>
            ))}
          </nav>

          <div className="p-[0.3rem]">
            <motion.button
              onClick={handleSignOut}
              className="flex items-center w-full p-2 text-sm text-red-400 dark:hover:bg-red-900 hover:bg-red-100 rounded transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={20} className="mr-3" />
              <AnimatePresence>
                {isOpen && (
                  <motion.span variants={itemVariants}>
                    Sign Out
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <div className="p-4 border-t border-gray-700">
            <Tooltip content="Your Profile" placement="right">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
                className="cursor-pointer transition-transform hover:scale-110"
              />
            </Tooltip>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default SidebarWrapper;

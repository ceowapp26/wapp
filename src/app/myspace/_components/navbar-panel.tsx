"use client"
import React, { useState, useEffect } from 'react';
import Badge from '@mui/material/Badge';
import { Grip, Bell } from 'lucide-react';
import { Logo } from "@/components/logo";
import { LogoSmallScreen } from '@/components/logo-smallscreen';
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import UserDropdown from '@/components/auth/user-dropdown';
import { HeadBarPanel } from './headbar-panel';
import { NavbarItem } from "./navbar-item";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CustomOrganizationSwitcher } from "@/components/organizations/custom-organization-switcher";
import { NotificationPopover } from "./notification-popover";
import { AppPopoverMenu } from './app-popover-menu';
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';

export const NavbarPanel = () => {
  const currentUrl = usePathname();
  const isHideOrgSwitcher = currentUrl.includes("/book") || currentUrl.includes("/music") || currentUrl.includes("/portal");
  const scrolled = useScrollTop();
  const [numOfNotif, setNumOfNotif] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const notifications = useQuery(api.notifications.getAllNotifications);
  const open = Boolean(anchorEl);
  const { isRightSidebarOpened, setIsRightSidebarOpened, setRightSidebarType } = useMyspaceContext();

  useEffect(() => {
    if (notifications?.length > 0) {
      const count = notifications.reduce((total, item) => {
        if (item.notification) {
          return total + 1;
        }
        return total;
      }, 0);
      setNumOfNotif(count);
    }
  }, [notifications]);

  const toggleSidebar = (sidebarType: string) => {
    setIsRightSidebarOpened(!isRightSidebarOpened);
    setRightSidebarType(sidebarType);
  };

  const toggleNotification = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
     <AnimatePresence>
      <motion.div key="navbar-container">
        <motion.nav
          key="desktop-nav"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "z-[100] bg-background bg-secondary mobileL:hidden flex fixed top-0 flex items-center w-full p-6 dark:bg-[#1F1F1F]",
            scrolled ? "shadow-md" : ""
          )}
        >

        <div className="justify-start flex flex-row w-full gap-x-12">
          <Logo width={30} height={30} />
          {!isHideOrgSwitcher ? <CustomOrganizationSwitcher /> : null}
        </div>
        <div className="w-full md:flex items-center gap-x-2">
          <div className="md:ml-auto max-w-[300px] w-full flex justify-end items-center gap-x-2">
            <NavbarItem desc={"App Menu"} onClick={() => toggleSidebar('general')} icon={Grip} />
            <NotificationPopover notifications={notifications}>
              <Badge
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                badgeContent={numOfNotif} color="primary">
                <NavbarItem desc={"Notifications"} onClick={toggleNotification} icon={Bell} />
              </Badge>
            </NotificationPopover>
            <div className="justify-self-end">
              <ModeToggle />
            </div>
            <UserDropdown />
            <HeadBarPanel />
          </div>
        </div>
      </motion.nav>
      <motion.div
          key="mobile-nav"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="dropdown-mobile z-50 bg-background bg-secondary p-6 items-center mobileL:flex hidden dark:bg-[#1F1F1F] fixed top-0 w-full"
        >

        <div className="justify-start fixed top-6 left-4 p-2">
          <Logo width={30} height={30} />
        </div>
        <div className="flex justify-end w-full gap-x-4">
          <ModeToggle />
          <AppPopoverMenu />
        </div>
      </motion.div>
    </motion.div>
    </AnimatePresence>
  );
};


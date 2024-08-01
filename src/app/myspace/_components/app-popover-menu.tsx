import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMyspaceContext } from "@/context/myspace-context-provider";

import { 
  Menu, 
  MenuItem, 
  Divider, 
  IconButton, 
  Typography, 
  Badge,
  Popper,
  Grow,
  Paper,
  ClickAwayListener
} from '@mui/material';

import { 
  Grip, 
  Bell, 
  Settings, 
  LogOut 
} from 'lucide-react';

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { NavbarItem } from "./navbar-item";
import { NotificationPopover } from "./notification-popover";
import { SignOutButton } from "@clerk/nextjs";

export const AppPopoverMenu = () => {
  const { user } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [numOfNotif, setNumOfNotif] = useState(0);
  const anchorRef = useRef(null);
  const notifications = useQuery(api.notifications.getAllNotifications);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const { isRightSidebarOpened, setIsRightSidebarOpened, setRightSidebarType } = useMyspaceContext();
  
  useEffect(() => {
    if (notifications?.length > 0) {
      const count = notifications.reduce((total, item) => item.notification ? total + 1 : total, 0);
      setNumOfNotif(count);
    }
  }, [notifications]);

  const toggleSidebar = (sidebarType) => {
    setIsRightSidebarOpened(!isRightSidebarOpened);
    setRightSidebarType(sidebarType);
  };

  const toggleNotification = (event) => {
    setNotifAnchorEl(notifAnchorEl ? null : event.currentTarget);
  };

  const handleMenu = () => setOpen((prevOpen) => !prevOpen);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab' || event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    }
  };

  const handleRedirectSetting = () => router.push("/settings");

  return (
    <>
      <IconButton
        onClick={handleMenu}
        ref={anchorRef}
        className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
      >
        <Grip className="h-5 w-5" />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper className="mt-2 rounded-lg shadow-lg">
              <ClickAwayListener onClickAway={handleClose}>
                <Menu
                  anchorEl={anchorRef.current}
                  open={open}
                  onClose={handleClose}
                  onKeyDown={handleListKeyDown}
                  PaperProps={{
                    className: "w-64 bg-white dark:bg-gray-800 rounded-lg",
                  }}
                >
                  <MenuItem 
                    onClick={() => toggleSidebar('general')}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Grip className="h-5 w-5 mr-3 text-gray-600 dark:text-gray-300" />
                    <Typography className="text-gray-800 dark:text-gray-200">General Menu</Typography>
                  </MenuItem>
                  <MenuItem 
                    onClick={handleRedirectSetting}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Avatar className="h-5 w-5 mr-3">
                      <AvatarImage src={user?.imageUrl} />
                    </Avatar>
                    <Typography className="text-gray-800 dark:text-gray-200">Account Settings</Typography>
                  </MenuItem>
                  <Divider className="my-2" />
                  <NotificationPopover notifications={notifications}>
                    <MenuItem 
                      onClick={toggleNotification}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Badge badgeContent={numOfNotif} color="primary" className="mr-3">
                        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </Badge>
                      <Typography className="text-gray-800 dark:text-gray-200">Notifications</Typography>
                    </MenuItem>
                  </NotificationPopover>
                  <MenuItem className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <LogOut className="h-5 w-5 mr-3 text-gray-600 dark:text-gray-300" />
                    <SignOutButton className="text-gray-800 dark:text-gray-200" redirectUrl="/" />
                  </MenuItem>
                </Menu>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
"use client";
import React, { useState, useRef, useEffect } from 'react';
import {
  Avatar,
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
  Typography,
  Divider,
} from '@mui/material';
import { ChevronDown, Bell } from 'lucide-react';
import { NotificationInterface } from "@/types/notification";

interface NotificationPopoverProps {
  children: React.ReactNode;
  notifications: NotificationInterface[];
}

export const NotificationPopover = ({ children, notifications }: NotificationPopoverProps) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  const handleMenu = () => setOpen((prevOpen) => !prevOpen);
  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) return;
    setOpen(false);
  };

  useEffect(() => {
    if (!open && anchorRef.current) anchorRef.current.focus();
  }, [open]);

  return (
    <>
      <button 
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        ref={anchorRef} 
        onClick={handleMenu}
      >
        {children}
      </button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        transition
        disablePortal
        className="z-50"
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper className="mt-2 rounded-lg shadow-xl overflow-hidden">
              <ClickAwayListener onClickAway={handleClose}>
                <div className="w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-900">
                  {!notifications || notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
                      <Typography>No notifications</Typography>
                    </div>
                  ) : (
                    notifications.map((item, index) => (
                      item.notification && (
                        <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                          <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                            <div className="flex items-start space-x-3">
                              <Avatar src={item.notification.senderAvatar} alt={item.notification.sender} className="h-10 w-10" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {item.notification.sender}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {item.notification.title}
                                </p>
                                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                  {new Date(Number(item.notification.date)).toLocaleString()}
                                </p>
                              </div>
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            </div>
                            <Divider className="my-2" />
                            <Typography className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                              {item.notification.content}
                            </Typography>
                          </div>
                        </div>
                      )
                    ))
                  )}
                </div>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default NotificationPopover;
"use client";
import React, { useState } from 'react';
import { ChevronsLeftRight, Settings, HelpCircle, LogOut } from "lucide-react";
import { UserButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownItems } from "@/constants/navbar";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function UserDropdown() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.div
          role="button"
          className="flex items-center text-sm p-2 rounded-lg hover:bg-primary/10 transition-colors duration-200 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>{user?.fullName?.[0]}</AvatarFallback>
          </Avatar>
          <ChevronsLeftRight className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-90'}`} />
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 p-2"
        align="end"
        alignOffset={11}
        forceMount
        as={motion.div}
        initial="hidden"
        animate="visible"
        variants={dropdownVariants}
      >
        <div className="flex flex-col space-y-4 p-2">
          <div className="flex items-center gap-x-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>{user?.fullName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-semibold line-clamp-1">
                {user?.fullName}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        {DropdownItems.map((item, index) => (
          <DropdownMenuItem key={item.label} asChild>
            <Link
              className={`flex items-center p-2 rounded-md hover:bg-primary/5 transition-colors duration-200 ${
                index === 2 ? "text-primary" : index === DropdownItems.length - 1 ? "text-red-500" : "text-foreground"
              }`}
              href={item.href}
            >
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOutButton>
            <button className="flex items-center w-full p-2 rounded-md hover:bg-red-100 transition-colors duration-200 text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </button>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
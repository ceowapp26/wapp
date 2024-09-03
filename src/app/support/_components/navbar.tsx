"use client";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Button, Tooltip } from "@nextui-org/react";
import { SearchIcon } from './search-icon';
import { Menu } from 'lucide-react';
import { ModeToggle } from "./mode-toggle";
import CompanyBrand from "./navbar-brand";
import HeaderToggle from "./navbar-toggle";

export default function CustomNavbar() {
  return (
    <Navbar isBordered maxWidth="full" className="z-[9999]">
      <NavbarContent justify="start" className="max-w-36">
        <HeaderToggle />
        <CompanyBrand />
        <NavbarBrand>
          <p className="font-bold text-inherit">SupportHub</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4 items-center justify-center sm:w-2/3 w-full" justify="center">
        <NavbarItem>
          <Link href="#">
            Docs
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#" aria-current="page">
            Updates
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex min-w-xs">
          <Input
            clearable
            startContent={
              <SearchIcon size={16} />
            }
            placeholder="Search"
          />
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/blogs">
            Blogs
          </Link>
        </NavbarItem>
        <Dropdown placement="bottom-right">
          <NavbarItem>
            <DropdownTrigger>
              <Avatar
                bordered="true"
                as="button"
                color="primary"
                size="sm"
                src="./global/company_logos/wapp-logo.png"
              />
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu aria-label="User menu actions" color="secondary">
            <DropdownItem key="settings" withDivider>
              About
            </DropdownItem>
            <DropdownItem key="help_and_feedback" withDivider>
              Help & Feedback
            </DropdownItem>
            <DropdownItem key="analytics" withDivider>
              Contact
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
         <NavbarItem>
          <ModeToggle />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

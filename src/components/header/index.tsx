import React from "react";
import { Navbar, NavbarContent } from "@nextui-org/react";
import { useMediaQuery } from "usehooks-ts";
import UserDropdown from "@/components/auth/user-dropdown";
import SearchBar from './search-bar';
import HeaderBrand from './header-brand';
import HeaderContent from './header-content';
import HeaderToggle from './header-toggle';
import { ModeToggle } from "@/components/mode-toggle";
import { ToggleSettingsSidebar } from '@/components/toggle-settings-sidebar';
import { usePathname } from "next/navigation";

export default function Header() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const currentPath = usePathname();
  const showSettingsToggle = isMobile && currentPath.includes('/settings');

  return (
    <Navbar maxWidth="full" height={72} isBordered>
      <NavbarContent justify="start">
        {isMobile ? (
          <>
            <HeaderToggle />
            <HeaderBrand />
          </>
        ) : (
          <HeaderBrand />
        )}
      </NavbarContent>
      <NavbarContent justify="center">
        {!isMobile && <HeaderContent />}
      </NavbarContent>
      <NavbarContent justify="end">
        {!isMobile && <SearchBar />}
        <UserDropdown />
        <ModeToggle />
        {showSettingsToggle && <ToggleSettingsSidebar />}
      </NavbarContent>
    </Navbar>
  );
}

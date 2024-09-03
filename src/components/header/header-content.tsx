import React from "react";
import { useTheme } from "next-themes";
import HeaderDropdown from "./header-dropdown";
import HeaderNoDropdown from "./header-no-dropdown";
import { usePathname } from 'next/navigation';

export default function HeaderContent() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const isSettingUrl = pathname.includes("settings");

  return (
    <div className={`flex flex-col ${isSettingUrl ? "xl:flex-row" : "lg:flex-row"} justify-center items-center p-4 space-y-2 lg:space-y-0 transition-colors duration-300`}>
      <HeaderDropdown />
      <HeaderNoDropdown />
    </div>
  );
}

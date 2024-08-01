import React from "react";
import { useTheme } from "next-themes";
import HeaderDropdown from "./header-dropdown";
import HeaderNoDropdown from "./header-no-dropdown";

export default function HeaderContent() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center p-4 space-y-2 lg:space-y-0 lg:space-x-8 transition-colors duration-300">
      <HeaderDropdown />
      <HeaderNoDropdown />
    </div>
  );
}

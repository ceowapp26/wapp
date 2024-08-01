import React from "react";
import { MenuIcon, X } from "lucide-react";
import { useSidebarContext } from "@/context/sidebar-context";
import clsx from "clsx";

export const ToggleSettingsSidebar = () => {
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <span className="inline-flex h-[3em] items-center px-2 py-2 rounded-xl hover:bg-gray-500/10 dark:hover:bg-slate-700 transition-colors duration-200 text-black text-sm flex-shrink-0 border dark:hover:text-white dark:text-slate-100 dark:border-white border-black/20 transition-opacity">
      {collapsed ? (
        <X
          onClick={setCollapsed}
          role="button"
          className={clsx("h-6 w-6")}
        />
      ) : (
        <MenuIcon
          onClick={setCollapsed}
          role="button"
          className={clsx("h-6 w-6")}
        />
      )}
    </span>
  );
};

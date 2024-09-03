import React from "react";
import { Menu, X } from "lucide-react";
import { Button, Tooltip } from "@nextui-org/react";
import { useSidebarContext } from "@/context/sidebar-context";
import clsx from "clsx";

export const ToggleSettingsSidebar = () => {
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <span className="inline-flex items-center px-2 py-2 text-black text-sm flex-shrink-0">
      {collapsed ? (
        <X
          onClick={setCollapsed}
          role="button"
          className={clsx("h-6 w-6")}
        />
      ) : (
        <Tooltip content="Toggle Sidebar" placement="bottom">
          <Button
            isIconOnly
            color="warning"
            variant="faded"
            aria-label="Sidebar toggle"
            onClick={setCollapsed}
            className="sm:hidden bg-gray-300/50 hover:bg-gray-200/50 transition-colors duration-200 transition-opacity"
          >
            <Menu size={24} />
          </Button>
        </Tooltip>
      )}
    </span>
  );
};

import React from "react";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip } from "@nextui-org/react";
import { CompaniesDropdown } from "./companies-dropdown";
import { usePathname } from "next/navigation";
import {
  Menu,
  CreditCard,
  Scale,
  SquareUser,
  User,
  ChevronsLeft,
  ChevronsRight,
  MenuIcon,
  Contact,
  Package,
  ClipboardMinus,
  Settings,
  LifeBuoy,
  SquarePen,
  Activity,
  LogOut,
} from "lucide-react";
import { TbHomeMove } from "react-icons/tb"
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { useSidebarContext } from "@/context/sidebar-context";
import { useMediaQuery } from "usehooks-ts";
import clsx from "clsx";
import { useClerk } from '@clerk/nextjs';

const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { signOut } = useClerk()
  const onSignOut = () => signOut(() => router.push('/'));

  const closeSidebar = () => {
    setCollapsed(false);
  };

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={() => setCollapsed(false)} />
      ) : null}
      <div
        className={clsx(
          Sidebar({
            collapsed: collapsed,
          }),
          collapsed && "mobileL:w-full mobileL:top-16"
        )}
      >
        <div className="mobileL:flex hidden justify-end items-center w-full">
          <span
            onClick={closeSidebar}
            className="bg-slate-200 top-0 w-6 rounded-l-md"
          >
            <ChevronsLeft className="h-6 w-6" />
          </span>
        </div>
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Profile"
              icon={<User />}
              isActive={pathname === "/settings/profile"}
              href="/settings/profile"
            />
            <SidebarMenu title="Payments">
              <SidebarItem
                isActive={pathname === "/settings/billing"}
                title="Payments"
                icon={<CreditCard />}
                href="/settings/billing"
              />
              <SidebarItem
                isActive={pathname === "/settings/balance"}
                icon={<Scale />}
                title="Balances"
                href="/settings/balance"
              />
              <SidebarItem
                isActive={pathname === "/settings/product"}
                title="Products"
                icon={<Package />}
                href="/settings/product"
              />
              <SidebarItem
                isActive={pathname === "/settings/report"}
                title="Reports"
                icon={<ClipboardMinus />}
                href="/settings/report"
              />
            </SidebarMenu>

            <SidebarMenu title="General">
              <SidebarItem
                isActive={pathname === "/settings/support"}
                title="Supports"
                icon={<LifeBuoy />}
                href="/settings/support"
              />
              <SidebarItem
                isActive={pathname === "/settings/activity"}
                title="Activity"
                icon={<Activity />}
                href="/settings/activity"
              />
              <SidebarItem
                isActive={pathname === "/settings/setting"}
                title="Settings"
                icon={<Settings />}
                href="/settings/setting"
              />
            </SidebarMenu>

            <SidebarMenu title="Updates">
              <SidebarItem
                isActive={pathname === "/settings/changelog"}
                title="Changelog"
                icon={<SquarePen />}
                href="/settings/changelog"
              />
            </SidebarMenu>
            <SidebarMenu title="Exit">
              <SidebarItem
                isActive={pathname === "/home"}
                title="Backhome"
                icon={<TbHomeMove className="w-7 h-7" />}
                href="/home"
              />
              <SidebarItem
                title="Sign out"
                onClick={onSignOut}
                icon={<LogOut />}
              />
            </SidebarMenu>
          </div>
          {/* 
            <div className={Sidebar.Footer()}>
              <Tooltip content={"Settings"} color="primary">
                <div className="max-w-fit">
                  <SquareUser />
                </div>
              </Tooltip>
              <Tooltip content={"Adjustments"} color="primary">
                <div className="max-w-fit">
                  <SquareUser />
                </div>
              </Tooltip>
              <Tooltip content={"Profile"} color="primary">
                <Avatar
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  size="sm"
                />
              </Tooltip>
            </div> 
            */}
        </div>
      </div>
    </aside>
  );
};

export default SidebarWrapper;

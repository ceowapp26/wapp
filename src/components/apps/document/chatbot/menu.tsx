import React, { useEffect, useState, useMemo } from 'react';
import { useStore } from '@/redux/features/apps/document/store';
import NewChat from './new-chat';
import NewFolder from './new-folder';
import ChatHistoryList from './chat-history-list';
import FilterChat from './filter-chat';
import MenuOptions from './menu-options';
import { useUser, useOrganization } from "@clerk/nextjs";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { Button } from "@/components/ui/button";
import { SquareArrowLeft } from 'lucide-react';

const Menu = () => {
  const hideSideMenu = useStore((state) => state.hideSideMenu);
  const setHideSideMenu = useStore((state) => state.setHideSideMenu);
  const {
    isLeftSidebarOpened,
    setIsLeftSidebarOpened,
    leftSidebarType,
    leftSidebarWidth,
    setLeftSidebarType,
    activeDocument,
    activeOrg,
  } = useMyspaceContext();
  const { user } = useUser();
  const { organization } = useOrganization();
  const isGreaterThan320 = leftSidebarWidth > 320;

  const defaultOptions = useMemo(() => [
    { key: 'org', label: 'By This Organization', value: organization ? organization.id : null },
    { key: 'user', label: 'By This User', value: user ? user.id : null },
    { key: 'doc', label: 'By This Document', value: activeDocument },
  ], [organization, user, activeDocument]);

  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedKey, setSelectedKey] = useState(new Set([defaultOptions[0]['key']]));

  useEffect(() => {
    if (window.innerWidth < 768) setHideSideMenu(true);
    const handleResize = () => {
      if (window.innerWidth < 768) setHideSideMenu(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setHideSideMenu]);

  const [filterOptions, setFilterOptions] = useState(defaultOptions);

  useEffect(() => {
    if (activeOrg.orgName === "Select Account" || !activeOrg.orgName) {
      setFilterOptions(defaultOptions);
    } else if (activeOrg.orgName === "Personal Account") {
      setFilterOptions(defaultOptions.filter((option) => option.key !== 'org'));
    } else {
      setFilterOptions(defaultOptions.filter((option) => option.key !== 'user'));
    }
  }, [activeOrg, defaultOptions]);

  const handleSidebar = () => {
    if (leftSidebarType !== 'document') setLeftSidebarType('document');
    if (!isLeftSidebarOpened) setIsLeftSidebarOpened(true);
  };

  return (
    <div className='flex relative top-10 h-full min-h-0 px-2 flex-col'>
      <div>
        <Button
          className="flex items-center gap-x-3 px-3 py-3 mt-6 mb-4 ml-3
                     bg-gradient-to-r from-indigo-500 to-purple-600
                     text-white font-semibold text-md rounded-lg
                     shadow-lg hover:shadow-xl transition-all duration-300
                     transform hover:scale-105 active:scale-95
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          onClick={handleSidebar}
        >
          <SquareArrowLeft className="w-6 h-6" />
          <span>Back</span>
        </Button>
      </div>
      <div className='flex h-full w-full flex-1 items-start border-white/20'>
        <nav className='flex h-full flex-1 flex-col space-y-2 pt-2'>
          <MenuOptions />
          <div className='flex gap-2'>
            <NewChat />
            <NewFolder />
            {isGreaterThan320 && <FilterChat options={filterOptions} selectedKey={selectedKey} setSelectedKey={setSelectedKey} setSelectedValue={setSelectedValue} />}
          </div>
          <ChatHistoryList filterKey={selectedKey} filterValue={selectedValue} />
        </nav>
      </div>
    </div>
  );
};

export default Menu;



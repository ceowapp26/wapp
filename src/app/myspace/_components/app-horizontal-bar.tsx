import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectApps } from '@/redux/features/apps/appsSlice';
import { AppIcon } from './app-icon';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { useStore } from '@/redux/features/apps/document/store';

export const AppHorizontalBar = () => {
  const apps = useSelector(selectApps);
  const ref = useRef(null);
  const { leftSidebarWidth, rightSidebarWidth, isAppbarCollapsed, setIsAppbarCollapsed, isRightSidebarOpened, isLeftSidebarOpened } = useMyspaceContext();  
  const [margin, setMargin] = useState<number>(0);
  useEffect(() => {
    const calculateMargin = () => {
      let newMargin = 0;
      if (isLeftSidebarOpened) newMargin += leftSidebarWidth;
      if (isRightSidebarOpened) newMargin += rightSidebarWidth;
      return newMargin;
    };
    setMargin(calculateMargin());
  }, [leftSidebarWidth, rightSidebarWidth, isLeftSidebarOpened, isRightSidebarOpened]);

  const toggleCollapse = () => {
    if (ref.current) {
      ref.current.style.transform = isAppbarCollapsed ? 'translateY(0)' : 'translateY(-82%)';
      setIsAppbarCollapsed(!isAppbarCollapsed);
    }
  }

  return (
    <div
      ref={ref}
      className="fixed w-full overflow-auto top-[100px] z-[98] border-gray-300"
      style={{
        width: `calc(100% - ${margin}px)`,
        left: isLeftSidebarOpened ? `${leftSidebarWidth}px` : '0',
        right: isRightSidebarOpened ? `${rightSidebarWidth}px` : '0',
      }}
    >
      <div className="shadow-xl min-w-0 bg-neutral-200 dark:bg-neutral-400">
        <div className="flex overflow-x-auto p-1 space-x-8">
          {apps && Object.keys(apps).length > 0 ? (
            Object.keys(apps)
              .filter((appKey) => appKey !== '_persist' && appKey !== 'apps')
              .map((appKey, index) => (
                <AppIcon
                  key={appKey}
                  appName={appKey}
                  logo={apps[appKey].logo}
                  url={apps[appKey].url}
                  isRemoveable
                />
              ))
          ) : (
            <h2 className="p-4 font-semibold text-gray-600/80">No apps are currently active.</h2>
          )}
        </div>
      </div>
      <div 
        className="flex justify-center items-center h-6 bg-zinc-300/80 hover:bg-zinc-400/80 cursor-pointer transition-all duration-300"
        onClick={toggleCollapse}
      >
        {isAppbarCollapsed ? (
          <ChevronDown />
        ) : (
          <ChevronUp />
        )}
      </div>
    </div>
  );
};

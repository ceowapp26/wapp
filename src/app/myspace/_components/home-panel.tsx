import React, { useEffect } from 'react';
import { Grip } from 'lucide-react';
import { useMyspaceContext } from "@/context/myspace-context-provider";

export const HomePanel = () => {
  const { isRightSidebarOpened, setIsRightSidebarOpened } = useMyspaceContext();

  const toggleSidebar = () => {
    setIsRightSidebarOpened(!isRightSidebarOpened);
  };

  return (
      <React.Fragment>
        <Grip className="cursor-pointer" onClick={toggleSidebar} />
      </React.Fragment>
  );
};




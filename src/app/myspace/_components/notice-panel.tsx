import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useMyspaceContext } from "@/context/myspace-context-provider";

export const NoticePanel = () => {
  const [isOpened, setIsOpened] = useState(false);

  const toggleMenu = () => {
    setIsOpened(!isOpened)
  }

  return (
    <React.Fragment>
        <span className="absolute w-4 h-4 text-xs bg-red-500 rounded-full top-0 right-0 -mt-2 -mr-1 flex items-center justify-center text-white font-semibold">10</span>
        <Bell className="cursor-pointer" onClick={toggleMenu} />
    </React.Fragment>
  );
};






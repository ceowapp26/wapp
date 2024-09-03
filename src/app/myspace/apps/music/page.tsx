"use client"
import React, { useEffect } from "react";
import Panel from './_components/panel';
import { useMyspaceContext } from '@/context/myspace-context-provider';

export default function MusicPage() {
  const { setLeftSidebarWidth, setRightSidebarWidth, isAppbarCollapsed } = useMyspaceContext();
    
  useEffect(() => {
    setLeftSidebarWidth(0);
    setRightSidebarWidth(0);
  }, []);

  return (
    <div className={`relative flex-1 h-full px-6 overflow-y-auto ${isAppbarCollapsed ? 'top-12' : 'top-24'}`}>      
      <Panel />
    </div>
  )
}





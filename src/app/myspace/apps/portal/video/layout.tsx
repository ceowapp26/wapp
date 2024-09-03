"use client";
import React from "react";
import { useMyspaceContext } from '@/context/myspace-context-provider';

const VideoLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAppbarCollapsed } = useMyspaceContext();
 
  return (
    <main className={`relative flex-1 h-full max-h-[100vh] overflow-y-auto hide-scrollbar ${isAppbarCollapsed ? 'top-[110px]' : 'top-[210px]'}`}>
      {children}
    </main>
  );
};

export default VideoLayout;

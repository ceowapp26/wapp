"use client";
import React from 'react';
import Sidebar from '../_components/navigation/Sidebar';
import { useMyspaceContext } from '@/context/myspace-context-provider';

const MusicLofiLayout = ({ children }) => {
  const { isAppbarCollapsed } = useMyspaceContext();
  return (
    <div className='w-full h-full bg-[#14172d] overflow-y-auto flex'>
      <Sidebar />
      <main className={`${isAppbarCollapsed ? 'mt-28' : 'mt-56'}`}>
        { children }
      </main>
    </div>
  );
};

export default MusicLofiLayout;





'use client';
import React from 'react';
import Sidebar from '../_components/navigation/Sidebar';
import SearchBar from '../_components/searchbar/SearchBar';
import PlayerDeezer from '../_components/player/PlayerDeezer';
import { useMyspaceContext } from '@/context/myspace-context-provider';

const MusicHomeLayout = ({ children }) => {
  const { leftSidebarWidth, isAppbarCollapsed } = useMyspaceContext();
  return (
    <div className='w-full h-full bg-[#14172d] overflow-y-auto flex'>
      <Sidebar />
      <div 
        className={`relative flex-1 h-full bg-[#14172d] px-6 overflow-y-auto ${isAppbarCollapsed ? 'top-18' : 'top-36'}`} 
        style={{ marginLeft: `${leftSidebarWidth}px` }}
      >
        <SearchBar />
        <main className='mt-4'>
          {children}
        </main>
        <PlayerDeezer />
      </div>
    </div>
  );
};

export default MusicHomeLayout;

"use client";
import React from 'react';
import { SwitchLeftSidebar } from './_components/switch-sidebar';
import { PortalContextProvider } from '@/context/portal-context-provider';
import { PortalModalProvider } from './_components/modal-provider';

const PortalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PortalContextProvider>
      <React.Fragment>
        <div className="h-full flex dark:bg-[#1F1F1F]">
          <SwitchLeftSidebar />
          <PortalModalProvider />
          {children}
        </div>
      </React.Fragment>
    </PortalContextProvider>
  );
};

export default PortalLayout;

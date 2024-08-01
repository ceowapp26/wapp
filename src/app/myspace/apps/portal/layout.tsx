"use client";
import React, { useEffect, useRef } from 'react';
import { PortalContextProvider } from '@/context/portal-context-provider';

const PortalLayout = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <PortalContextProvider>
      <React.Fragment>
        {children}
      </React.Fragment>
    </PortalContextProvider>
  );
};

export default PortalLayout;

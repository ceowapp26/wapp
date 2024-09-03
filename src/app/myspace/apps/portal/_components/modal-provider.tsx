"use client";
import React, { useEffect, useState } from "react";
import { ProjectSettingsModal } from "./project-settings-modal";

export const PortalModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  
  return (
    <React.Fragment>
      <ProjectSettingsModal />
    </React.Fragment>
  );
};

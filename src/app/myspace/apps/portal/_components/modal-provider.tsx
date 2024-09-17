"use client";
import React, { useEffect, useState } from "react";
import { ProjectSettingsModal } from "./project-settings-modal";
import { ProjectDeploymentModal } from "./project-deployment-modal";

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
      <ProjectDeploymentModal />
    </React.Fragment>
  );
};

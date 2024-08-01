"use client";
import React, { useEffect, useState } from "react";
import { SettingsModal } from "@/components/apps/document/modals/settings-modal";
import { CoverImageModal } from "@/components/apps/document/modals/cover-image-modal";
import dynamic from 'next/dynamic';

export const DocumentModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  
  return (
    <React.Fragment>
      <SettingsModal />
      <CoverImageModal />
    </React.Fragment>
  );
};

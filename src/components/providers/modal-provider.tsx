"use client";
import React, { useEffect, useState } from "react";
import { ModelSettingsModal } from "@/components/modals/model-settings-modal";
import { TokenSettingsModal } from "@/components/modals/token-settings-modal";

export const GeneralModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  
  return (
    <React.Fragment>
      <ModelSettingsModal />
      <TokenSettingsModal />
    </React.Fragment>
  );
};

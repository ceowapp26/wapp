import React, { useState, useEffect } from "react";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { DocumentSidebar } from "./document-sidebar";
import { LeftAISidebar } from "./ai-sidebar";
import { Switch } from "@/components/switch";
import { LeftSidebarSkeleton } from "./sidebar-skeleton";

export const SwitchLeftSidebar = () => {
  const { leftSidebarType, setLeftSidebarType } = useMyspaceContext();

  return (
    <LeftSidebarSkeleton>
     <Switch condition={leftSidebarType}>
      <Switch.Case when={"document"}>
        <DocumentSidebar />
      </Switch.Case>
      <Switch.Case when={"left-ai"}>
        <LeftAISidebar />
      </Switch.Case>
      <Switch.Default>
        <DocumentSidebar />
      </Switch.Default>
      </Switch>
    </LeftSidebarSkeleton>
  );
};

import React, { useState, useEffect } from "react";
import { DocumentSidebar } from "./document-sidebar";
import { LeftAISidebar } from "./ai-sidebar";
import { CodeProjectSidebar } from "./code-project-sidebar"
import { CodeStructureSidebar } from "./code-structure-sidebar"
import { Switch } from "@/components/switch";
import { useAppSelector } from '@/hooks/hooks';
import { selectPortalContext } from '@/stores/features/apps/portal/portalsSlice';
import { LeftSidebarSkeleton } from "./sidebar-skeleton";

export const SwitchLeftSidebar = () => {
  const context = useAppSelector(selectPortalContext);

  return (
    <LeftSidebarSkeleton>
     <Switch condition={context}>
      <Switch.Case when={"text"}>
        <DocumentSidebar />
      </Switch.Case>
      <Switch.Case when={"code-project"}>
        <CodeProjectSidebar />
      </Switch.Case>
      <Switch.Case when={"code-structure"}>
        <CodeStructureSidebar />
      </Switch.Case>
      <Switch.Case when={"image"}>
        <CodeProjectSidebar />
      </Switch.Case>
      <Switch.Case when={"audio"}>
        <CodeProjectSidebar />
      </Switch.Case>
      <Switch.Case when={"video"}>
        <CodeProjectSidebar />
      </Switch.Case>
      <Switch.Case when={"left-ai"}>
        <LeftAISidebar />
      </Switch.Case>
      <Switch.Default>
      </Switch.Default>
      </Switch>
    </LeftSidebarSkeleton>
  );
};

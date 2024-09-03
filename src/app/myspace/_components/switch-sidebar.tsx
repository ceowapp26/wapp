import React from "react";
import { MenuSidebar } from "./menu-sidebar";
import { RightAISidebar } from "./ai-sidebar";
import { RightSidebarSkeleton } from "./sidebar-skeleton";
import { SnippetSidebar } from "./snippet-sidebar";
import { SettingSidebar } from "./setting-sidebar";
import { SupportSidebar } from "./support-sidebar";
import { GeneralSetting } from "./general-setting";
import { Switch } from "@/components/switch";
import { useMyspaceContext } from "@/context/myspace-context-provider";

export const SwitchRightSidebar = () => {
  const { rightSidebarType, setRightSidebarType } = useMyspaceContext();
  
  return (
    <RightSidebarSkeleton>
     <Switch condition={rightSidebarType}>
      <Switch.Case when={"general-menu"}>
        <MenuSidebar />
      </Switch.Case>
      <Switch.Case when={"right-ai"}>
        <RightAISidebar />
      </Switch.Case>
      <Switch.Case when={"snippet"}>
        <SnippetSidebar />
      </Switch.Case>
      <Switch.Case when={"general"}>
        <SettingSidebar />
      </Switch.Case>
      <Switch.Case when={"support-menu"}>
        <SupportSidebar />
      </Switch.Case>
      <Switch.Case when={"general-setting"}>
        <GeneralSetting />
      </Switch.Case>
      <Switch.Default>
        <MenuSidebar />
      </Switch.Default>
      </Switch>
    </RightSidebarSkeleton>
  );
};



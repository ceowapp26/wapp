"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { usePortalContextHook } from "@/context/portal-context-provider";
import ContextSelectionForm from './_components/context-selection-form';

const PortalPage = () => {
  const { portalContext, setPortalContext } = usePortalContextHook();
  const { setLeftSidebarWidth, setRightSidebarWidth, isAppbarCollapsed } = useMyspaceContext();
  const { user } = useUser();  
  useEffect(() => {
    setLeftSidebarWidth(0);
    setRightSidebarWidth(0);
  }, []);
  return ( 
      <div className={`relative flex-col justify-center items-center h-full px-6 overflow-y-auto ${isAppbarCollapsed ? 'top-12' : 'top-28'}`} >
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Wapp-Portal
      </h2>
      <ContextSelectionForm portalContext={portalContext} setPortalContext={setPortalContext} />
    </div>
   );
}
 
export default PortalPage;
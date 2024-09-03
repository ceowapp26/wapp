'use client'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { CreditCard, LucideIcon } from 'lucide-react'
import React from 'react'

type Props = {
  value: string
  title: string
  text: string
  icon: LucideIcon
  portalContext: 'TEXT' | 'CODE' | 'IMAGE' | 'VIDEO'
  setPortalContext: React.Dispatch<React.SetStateAction<'TEXT' | 'CODE' | 'IMAGE' | 'VIDEO'>>
}

const ContextTypeBanner = ({
  text,
  title,
  icon: Icon,
  portalContext,
  setPortalContext,
  value,
}: Props) => {
  return (
    <Label htmlFor={value}>
      <Card
        className={cn(
          'w-full cursor-pointer mb-4 max-w-96 min-w-96', 
          portalContext === value && 'border-orange'
        )}
        onClick={() => setPortalContext(value)}
      >
        <CardContent className="flex flex-col justify-between p-4">
          <div className="flex items-center gap-3 mb-4">
            <Icon
              size={50}
              className={cn(
                'flex justify-center p-3',
                portalContext === value ? 'text-orange' : 'text-gray-400'
              )}
            />
            <div>
              <CardDescription className="text-iridium">
                {title}
              </CardDescription>
              <CardDescription className="text-gray-400">
                {text}
              </CardDescription>
            </div>
          </div>
          <div className="self-end">
            <div
              className={cn(
                'w-4 h-4 rounded-full',
                portalContext === value ? 'bg-orange' : 'bg-transparent'
              )}
            >
              <Input
                onChange={() => setPortalContext(value)}
                checked={portalContext === value}
                id={value}
                className="hidden"
                type="radio"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Label>
  )
}

export default ContextTypeBanner


"use client"
import React from 'react';
import ContextTypeBanner from './context-type-banner';
import ButtonHandler from './button-handlers';
import { FileText, SquareTerminal, FileImage, FileVideo } from 'lucide-react';

type Props = {
  portalContext: 'TEXT' | 'CODE' | 'IMAGE' | 'VIDEO';
  setPortalContext: React.Dispatch<React.SetStateAction<'TEXT' | 'CODE' | 'IMAGE' | 'VIDEO'>>;
};

const ContextSelectionForm = ({ setPortalContext, portalContext }: Props) => {
  return (
    <div className="relative flex flex-col justify-center items-center w-full top-36">
      <h2 className="text-gravel md:text-4xl font-bold">Choose AI Context</h2>
      <p className="text-iridium md:text-sm p-2">
        Choose context for appropriate editor.
      </p>
      <ContextTypeBanner
        setPortalContext={setPortalContext}
        portalContext={portalContext}
        icon={FileText}
        value="TEXT"
        title="AI TEXT PORTAL"
        text="AI for TEXT"
      />
      <ContextTypeBanner
        setPortalContext={setPortalContext}
        portalContext={portalContext}
        icon={SquareTerminal}
        value="CODE"
        title="AI CODE PORTAL"
        text="AI for CODE"
      />
      <ContextTypeBanner
        setPortalContext={setPortalContext}
        portalContext={portalContext}
        icon={FileImage}
        value="IMAGE"
        title="AI IMAGE PORTAL"
        text="AI for IMAGE"
      />
      <ContextTypeBanner
        setPortalContext={setPortalContext}
        portalContext={portalContext}
        icon={FileVideo}
        value="VIDEO"
        title="AI VIDEO PORTAL"
        text="AI for VIDEO"
      />
      <ButtonHandler />
    </div>
  );
};

export default ContextSelectionForm;


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

enhance this ui, ux make it more visually appealing, animated, interactive and responsive to all screen sizes make sure it fits both  dark and light theme provide me with the best ui, ux design 
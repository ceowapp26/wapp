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


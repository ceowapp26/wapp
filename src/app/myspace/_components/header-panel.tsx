import React, { forwardRef } from 'react';
import { HeadBarDropdown } from './headbar-dropdown';
import { useMyspaceContext } from "@/context/myspace-context-provider";

export const HeadBarPanel = forwardRef<HTMLDivElement>((props, ref) => {
  const { isSelectedTopMenu, setIsSelectedTopMenu } = useMyspaceContext();
  return (
    <div ref={ref} className={`fixed z-0 inset-0 bg-black bg-opacity-90 ${isSelectedTopMenu ? 'block' : 'hidden'} transition duration-300 ease-in-out`}>
      <HeadBarDropdown />
    </div>
  );
});

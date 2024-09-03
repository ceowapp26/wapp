import React, { useState } from 'react';
import { ProjectStructure } from '@/types/code';

type Context = 'TEXT' | 'CODE' | 'IMAGE' | 'AUDIO' | 'VIDEO';

type InitialValuesProps = {
  projectStructure: ProjectStructure;
  setProjectStructure: Dispatch<SetStateAction<ProjectStructure>>;
  currentComponent: string;
  setCurrentComponent: Dispatch<SetStateAction<string>>;
  activeProject: string;
  setActiveProject: Dispatch<SetStateAction<string>>;
  portalContext: Context;
  setPortalContext: Dispatch<SetStateAction<Context>>;
};

const InitialValues: InitialValuesProps = {
  portalContext: null,
  currentComponent: "",
  activeProject: "",
  structure: {},
  setPortalContext: () => {},
  setProjectStructure: () => {},
  setCurrentComponent: () => {},
  setActiveProject: () => {},
};

const PortalContext = React.createContext<InitialValuesProps>(InitialValues);

const PortalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [portalContext, setPortalContext] = useState<Context>('TEXT');
  const [activeProject, setActiveProject] = useState<string>('');
  const [currentComponent, setCurrentComponent] = useState<string>('');
  const [projectStructure, setProjectStructure] = useState<ProjectStructure>({});
  const values: InitialValuesProps = {
    portalContext,
    setPortalContext,
    projectStructure,
    setProjectStructure,
    activeProject,
    setActiveProject,
    currentComponent, 
    setCurrentComponent,
  };

  return <PortalContext.Provider value={values}>{children}</PortalContext.Provider>;
};

const usePortalContextHook = (): InitialValuesProps => {
  const state = React.useContext(PortalContext);
  return state;
};

export { PortalContextProvider, usePortalContextHook };

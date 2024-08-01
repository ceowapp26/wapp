import React, { useState } from 'react';

type PortalContext = 'TEXT' | 'CODE' | 'IMAGE' | 'VIDEO';

type InitialValuesProps = {
  portalContext: portalContext;
  setPortalContext: Dispatch<SetStateAction<portalContext>>;
};

const InitialValues: InitialValuesProps = {
  portalContext: 'TEXT',
  setPortalContext: () => {},
};

const PortalContext = React.createContext<InitialValuesProps>(InitialValues);

const PortalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [portalContext, setPortalContext] = useState<PortalContext>('TEXT');
  const values: InitialValuesProps = {
    portalContext,
    setPortalContext,
  };

  return <PortalContext.Provider value={values}>{children}</PortalContext.Provider>;
};

const usePortalContextHook = (): InitialValuesProps => {
  const state = React.useContext(PortalContext);
  return state;
};

export { PortalContextProvider, usePortalContextHook };

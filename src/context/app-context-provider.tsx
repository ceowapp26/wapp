import React, { useState } from 'react';

type Status = 'CREATE' | 'UPDATE';

type InitialValuesProps = {
  appStatus: Status;
  setAppStatus: Dispatch<SetStateAction<Status>>;
  featureStatus: Status;
  setFeatureStatus: Dispatch<SetStateAction<Status>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  appName: string;
  setAppName: Dispatch<SetStateAction<string>>;
};

const InitialValues: InitialValuesProps = {
  appStatus: 'CREATE',
  setAppStatus: () => {},
  featureStatus: 'CREATE',
  setFeatureStatus: () => {},
  currentStep: 1,
  setCurrentStep: () => {},
  appName: '',
  setAppName: () => {},
};

const AppContext = React.createContext<InitialValuesProps>(InitialValues);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [featureStatus, setFeatureStatus] = useState<ModelStatus>('CREATE');
  const [appStatus, setAppStatus] = useState<ModelStatus>('CREATE');
  const [appName, setAppName] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const values: InitialValuesProps = {
    appStatus,
    setAppStatus,
    featureStatus,
    setFeatureStatus,
    appName,
    setAppName,
    currentStep,
    setCurrentStep,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

const useAppContextHook = (): InitialValuesProps => {
  const state = React.useContext(AppContext);
  return state;
};

export { AppContextProvider, useAppContextHook };

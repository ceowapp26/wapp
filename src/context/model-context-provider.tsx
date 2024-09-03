import React, { useState, Dispatch, SetStateAction } from 'react';

type PlanType = 'FREE' | 'STANDARD' | 'PRO' | 'ULTIMATE';

type ModelStatus = 'CREATE' | 'UPDATE';

type ModelType = 'SUBSCRIPTION' | 'CREDIT';

type InitialValuesProps = {
  aiModelStatus: ModelStatus;
  setAiModelStatus: Dispatch<SetStateAction<ModelStatus>>;
  planModelStatus: ModelStatus;
  setPlanModelStatus: Dispatch<SetStateAction<ModelStatus>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  planType: PlanType;
  setPlanType: Dispatch<SetStateAction<PlanType>>;
  modelType: ModelType;
  setModelType: Dispatch<SetStateAction<ModelType>>;
};

const InitialValues: InitialValuesProps = {
  aiModelStatus: 'CREATE',
  setAiModelStatus: () => {},
  planModelStatus: 'CREATE',
  setPlanModelStatus: () => {},
  currentStep: 1,
  setCurrentStep: () => {},
  planType: 'FREE',
  setPlanType: () => {},
};

const ModelContext = React.createContext<InitialValuesProps>(InitialValues);

const ModelContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [planModelStatus, setPlanModelStatus] = useState<ModelStatus>('CREATE');
  const [aiModelStatus, setAiModelStatus] = useState<ModelStatus>('CREATE');
  const [planType, setPlanType] = useState<PlanType>('FREE');
  const [modelType, setModelType] = useState<ModelType>('SUBSCRIPTION');
  const [currentStep, setCurrentStep] = useState<number>(1);

  const values: InitialValuesProps = {
    aiModelStatus,
    setAiModelStatus,
    planModelStatus,
    setPlanModelStatus,
    planType,
    setPlanType,
    modelType,
    setModelType,
    currentStep,
    setCurrentStep,
  };

  return <ModelContext.Provider value={values}>{children}</ModelContext.Provider>;
};

const useModelContextHook = (): InitialValuesProps => {
  const context = React.useContext(ModelContext);
  if (!context) {
    throw new Error("useModelContextHook must be used within a ModelContextProvider");
  }
  return context;
};

export { ModelContextProvider, useModelContextHook };


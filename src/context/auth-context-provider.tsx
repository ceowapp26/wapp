import React, { useState } from 'react';

type ProviderType = 'email-n-password' | 'email-w-password' | 'phone' | 'google' | 'microsoft' | 'github';
type AuthType = 'sign-up' | 'sign-in' | 'reset';
type UserType = 'individual' | 'owner' | 'developer' | 'student';

type InitialValuesProps = {
  authLoading: boolean;
  setAuthLoading: React.Dispatch<React.SetStateAction<boolean>>;
  authForm: HTMLFormElement | null;
  setAuthForm: React.Dispatch<React.SetStateAction<HTMLFormElement | null>>;
  userType: UserType;
  setUserType: React.Dispatch<React.SetStateAction<UserType>>;
  authType: AuthType;
  setAuthType: React.Dispatch<React.SetStateAction<AuthType>>;
  providerType: ProviderType;
  setProviderType: React.Dispatch<React.SetStateAction<ProviderType>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
};

const InitialValues: InitialValuesProps = {
  authLoading: false,
  setAuthLoading: () => {},
  userType: 'individual',
  setUserType: () => {},
  authType: 'sign-up',
  setAuthType: () => {},
  providerType: 'email-n-password',
  setProviderType: () => {},
  currentStep: 1,
  setCurrentStep: () => {},
  authForm: null,
  setAuthForm: () => {},
};

const AuthContext = React.createContext<InitialValuesProps>(InitialValues);

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<number>(InitialValues.currentStep);
  const [authType, setAuthType] = useState<AuthType>(InitialValues.authType);
  const [providerType, setProviderType] = useState<ProviderType>(InitialValues.providerType);
  const [userType, setUserType] = useState<UserType>(InitialValues.userType);
  const [authForm, setAuthForm] = useState<HTMLElement | null>(InitialValues.authForm);
  const [authLoading, setAuthLoading] = useState<HTMLElement | null>(InitialValues.authLoading);

  const values: InitialValuesProps = {
    currentStep,
    setCurrentStep,
    authType,
    setAuthType,
    providerType,
    setProviderType,
    userType,
    setUserType,
    authForm,
    setAuthForm,
    authLoading,
    setAuthLoading
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

const useAuthContextHook = (): InitialValuesProps => {
  const state = React.useContext(AuthContext);
  return state;
};

export { AuthContextProvider, useAuthContextHook };

import React, { useState, createContext, useContext, ReactNode, Dispatch, SetStateAction } from 'react';
import { ModelOption } from "@/types/ai";

type ProductType = 'APPS' | 'EXTENSIONS' | 'AIMODELS' | 'OTHERS';
type PlanType = 'STANDARD' | 'PRO' | 'ULTIMATE';
type PaymentType = 'CREDIT' | 'SUBSCRIPTION';
type PaymentGateway = 'PAYPAL' | 'STRIPE';

type BasePriceInfo = {
  [model: string]: {
    inputTokens: { price: number, unit: number },
    outputTokens: { price: number, unit: number },
  };
};

type PurchasePriceInfo = {
  [model: string]: {
    inputTokens: { price: number, unit: number },
    outputTokens: { price: number, unit: number },
    totalPrice: number;
  };
};

type InitialValuesProps = {
  modelType: ModelOption;
  setModelType: Dispatch<SetStateAction<ModelOption>>;
  productType: ProductType;
  setProductType: Dispatch<SetStateAction<ProductType>>;
  paymentType: PaymentType;
  setPaymentType: Dispatch<SetStateAction<PaymentType>>;
  planType: PlanType;
  setPlanType: Dispatch<SetStateAction<PlanType>>;
  basePriceInfo: BasePriceInfo;
  setBasePriceInfo: Dispatch<SetStateAction<BasePriceInfo>>;
  purchasePriceInfo: PurchasePriceInfo;
  setPurchasePriceInfo: Dispatch<SetStateAction<PurchasePriceInfo>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  paymentGateway: PaymentGateway; 
  setPaymentGateway: Dispatch<SetStateAction<PaymentGateway>>; 
};

const InitialValues: InitialValuesProps = {
  modelType: 'gpt-3.5-turbo',
  setModelType: () => {},
  productType: 'APPS',
  setProductType: () => {},
  paymentType: 'SUBSCRIPTION',
  setPaymentType: () => {},
  planType: 'PRO',
  setPlanType: () => {},
  creditPriceInfo: {},
  setCreditPriceInfo: () => {},
  currentStep: 1,
  setCurrentStep: () => {},
  paymentGateway: 'PAYPAL', 
  setPaymentGateway: () => {},
};

const PaymentContext = createContext<InitialValuesProps>(InitialValues);

const PaymentContextProvider = ({ children }: { children: ReactNode }) => {
  const [modelType, setModelType] = useState<ModelOption>('gpt-3.5-turbo');
  const [productType, setProductType] = useState<PaymentType>('SUBSCRIPTION');
  const [paymentType, setPaymentType] = useState<PaymentType>('SUBSCRIPTION');
  const [planType, setPlanType] = useState<PlanType>('STANDARD');
  const [basePriceInfo, setBasePriceInfo] = useState<BasePriceInfo>({});
  const [purchasePriceInfo, setPurchasePriceInfo] = useState<PurchasePriceInfo>({});
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>('PAYPAL');
  const values: InitialValuesProps = {
    modelType,
    setModelType,
    productType,
    setProductType,
    paymentType,
    setPaymentType,
    planType,
    setPlanType,
    basePriceInfo,
    setBasePriceInfo,
    purchasePriceInfo,
    setPurchasePriceInfo,
    currentStep,
    setCurrentStep,
    paymentGateway,
    setPaymentGateway,
  };

  return <PaymentContext.Provider value={values}>{children}</PaymentContext.Provider>;
};

const usePaymentContextHook = (): InitialValuesProps => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePaymentContextHook must be used within a PaymentContextProvider');
  }
  return context;
};

export { PaymentContextProvider, usePaymentContextHook };

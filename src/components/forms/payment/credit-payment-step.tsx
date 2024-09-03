'use client';
import { usePaymentContextHook } from '@/context/payment-context-provider';
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { Spinner } from '@/components/spinner';

const ProductSelectionForm = dynamic(() => import('./product-selection-form'), {
  ssr: false,
  loading: () => <Spinner />,
});

const TokenInput = dynamic(() => import('./token-input'), {
  ssr: false,
  loading: () => <Spinner />,
});

const AppInput = dynamic(() => import('./app-input'), {
  ssr: false,
  loading: () => <Spinner />,
});

const ExtensionInput = dynamic(() => import('./extension-input'), {
  ssr: false,
  loading: () => <Spinner />,
});

const OtherInput = dynamic(() => import('./other-input'), {
  ssr: false,
  loading: () => <Spinner />,
});

const AppPriceCard = dynamic(() => import('./app-price-card'), {
  ssr: false,
  loading: () => <Spinner />,
});

const ExtensionPriceCard = dynamic(() => import('./extension-price-card'), {
  ssr: false,
  loading: () => <Spinner />,
});

const TokenPriceCard = dynamic(() => import('./token-price-card'), {
  ssr: false,
  loading: () => <Spinner />,
});

const OtherPriceCard = dynamic(() => import('./other-price-card'), {
  ssr: false,
  loading: () => <Spinner />,
});

const GatewaySelectionForm = dynamic(() => import('./gateway-selection-form'), {
  ssr: false,
  loading: () => <Spinner />,
});

const PaymentGatewayCard = dynamic(() => import('./payment-gateway-card'), {
  ssr: false,
  loading: () => <Spinner />,
});


type Props = {};

const CreditPaymentStep = (props: Props) => {
  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext();  
  const { currentStep, setCurrentStep, paymentGateway, setPaymentGateway, productType, setProductType } = usePaymentContextHook();

  switch (currentStep) {
    case 1:
      return (
        <ProductSelectionForm
          register={register}
          productType={productType}
          setProductType={setProductType}
        />
      );
    case 2:
      switch (productType) {
        case 'APPS':
          return (
            <AppInput
              errors={errors}
              register={register}
              control={control}
            />
          );
        case 'EXTENSIONS':
          return (
            <ExtensionInput
              errors={errors}
              register={register}
              control={control}
            />
          );
        case 'AIMODELS':
          return (
            <TokenInput
              errors={errors}
              register={register}
              control={control}
            />
          );
        case 'OTHERS':
          return (
            <OtherInput
              errors={errors}
              register={register}
              control={control}
            />
          );
        default:
          return null;
      }
    case 3:
      switch (productType) {
        case 'AIMODELS':
          return <TokenPriceCard />;
        case 'APPS':
          return <AppPriceCard />;
        case 'EXTENSIONS':
          return <ExtensionPriceCard />;
        case 'OTHERS':
          return <OtherPriceCard />;
        default:
          return null;
      }
    case 4:
      return (
        <GatewaySelectionForm
          register={register}
          paymentGateway={paymentGateway}
          setPaymentGateway={setPaymentGateway}
        />
      );
    case 5:
      return <PaymentGatewayCard />;
    default:
      return <div>CreditPaymentStep</div>;
  }
};

export default CreditPaymentStep;
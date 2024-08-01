'use client';
import { usePaymentContextHook } from '@/context/payment-context-provider';
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { Spinner } from '@/components/spinner';

const CreditInput = dynamic(() => import('./credit-input'), {
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

const CreditPriceCard = dynamic(() => import('./credit-price-card'), {
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
  const { currentStep, setCurrentStep, paymentGateway, setPaymentGateway } = usePaymentContextHook();
  switch (currentStep) {
    case 1:
      return (
        <CreditInput
          errors={errors}
          register={register}
          control={control}
        />
      );
    case 2:
      return (
        <CreditPriceCard />
      );
    case 3:
      return (
        <GatewaySelectionForm
          register={register}
          paymentGateway={paymentGateway}
          setPaymentGateway={setPaymentGateway}
        />
      );
    case 4:
      return (
        <PaymentGatewayCard />
      );
  
    default:
      return <div>CreditPaymentStep</div>;
  }
};

export default CreditPaymentStep;

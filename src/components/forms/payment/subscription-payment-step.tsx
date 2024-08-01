'use client';
import { usePaymentContextHook } from '@/context/payment-context-provider';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { Spinner } from '@/components/spinner';

const PlanSelectionForm = dynamic(() => import('./plan-selection-form'), {
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

const SubscriptionPaymentStep = (props: Props) => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();
  const { currentStep, setCurrentStep, paymentGateway, setPaymentGateway } = usePaymentContextHook();
  const [planType, setPlanType] = useState<'STANDARD' | 'PRO' | 'ULTIMATE'>('PRO');

  switch (currentStep) {
    case 1:
      return (
        <PlanSelectionForm
          register={register}
          planType={planType}
          setPlanType={setPlanType}
        />
      );
    case 2:
      return (
        <GatewaySelectionForm
          register={register}
          paymentGateway={paymentGateway}
          setPaymentGateway={setPaymentGateway}
        />
      );
    case 3:
      return <PaymentGatewayCard />;
    default:
      return <div>SubscriptionPaymentStep</div>;
  }
};

export default SubscriptionPaymentStep;

'use client';
import { usePaymentContextHook } from '@/context/payment-context-provider';
import { cn } from '@/lib/utils';
import React from 'react';

type Props = {};

const HighLightBar: React.FC<Props> = (props: Props) => {
  const { currentStep, paymentType } = usePaymentContextHook();

  return (
    <div className="w-full">
      {paymentType === 'SUBSCRIPTION' ? (
        <div className="grid grid-cols-3 gap-3">
          <div
            className={cn(
              'rounded-full h-2 col-span-1',
              currentStep === 1 ? 'bg-orange' : 'bg-platinum'
            )}
          ></div>
          <div
            className={cn(
              'rounded-full h-2 col-span-1',
              currentStep === 2 ? 'bg-orange' : 'bg-platinum'
            )}
          ></div>
          <div
            className={cn(
              'rounded-full h-2 col-span-1',
              currentStep === 3 ? 'bg-orange' : 'bg-platinum'
            )}
          ></div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <div
            className={cn(
              'rounded-full h-2 col-span-1',
              currentStep === 1 ? 'bg-orange' : 'bg-platinum'
            )}
          ></div>
          <div
            className={cn(
              'rounded-full h-2 col-span-1',
              currentStep === 2 ? 'bg-orange' : 'bg-platinum'
            )}
          ></div>
          <div
            className={cn(
              'rounded-full h-2 col-span-1',
              currentStep === 3 ? 'bg-orange' : 'bg-platinum'
            )}
          ></div>
          <div
            className={cn(
              'rounded-full h-2 col-span-1',
              currentStep === 4 ? 'bg-orange' : 'bg-platinum'
            )}
          ></div>
        </div>
      )}
    </div>
  );
};

export default HighLightBar;

'use client';
import { useModelContextHook } from '@/context/model-context-provider';
import { cn } from '@/lib/utils';
import React from 'react';

type Props = {};

const HighLightBar: React.FC<Props> = (props: Props) => {
  const { currentStep, paymentType } = useModelContextHook();

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-2">
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
      </div>
    </div>
  );
};

export default HighLightBar;

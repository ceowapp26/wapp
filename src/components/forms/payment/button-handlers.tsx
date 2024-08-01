import { Button } from '@/components/ui/button';
import { usePaymentContextHook } from '@/context/payment-context-provider';
import { usePaymentForm } from '@/hooks/use-payment';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';

type Props = {};

const ButtonHandler: React.FC<Props> = (props: Props) => {
  const router = useRouter();
  const { setCurrentStep, currentStep, paymentType } = usePaymentContextHook();
  const { onCalculatePrice, onNextStep } = usePaymentForm();
  const { watch, trigger } = useFormContext();
  const model = watch('model');
  const inputTokens = watch('inputTokens');
  const outputTokens = watch('outputTokens');

  const handleCalculatePrice = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const isValid = await trigger(['model', 'inputTokens', 'outputTokens']);
    if (isValid) {
      await onCalculatePrice(model, inputTokens, outputTokens, setCurrentStep);
    }
  };

  return (
    <div className="w-full py-6 flex flex-col gap-3 items-center">
      {paymentType === 'CREDIT' && currentStep === 1 && (
        <Button
          type="submit" 
          className="w-full bg-black text-slate-50 hover:bg-slate-100"
          onClick={(e) => handleCalculatePrice(e)}
        >
          Continue
        </Button>
      )}
      {(paymentType === 'CREDIT' && (currentStep !== 4 && currentStep !== 1)) && (
        <Button
          type="submit" 
          className="w-full bg-black text-slate-50 hover:bg-slate-100"
          onClick={() => setCurrentStep((prev: number) => prev + 1)}
        >
          Continue
        </Button>
      )}
      {(paymentType === 'SUBSCRIPTION' && currentStep !== 3) && (
        <Button
          type="submit" 
          className="w-full bg-black text-slate-50 hover:bg-slate-100"
          onClick={() => setCurrentStep((prev: number) => prev + 1)}
        >
          Continue
        </Button>
      )}
    </div>
  );
};

export default ButtonHandler;

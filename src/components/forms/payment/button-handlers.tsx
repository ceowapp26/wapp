import React from 'react';
import { Button } from '@/components/ui/button';
import { usePaymentContextHook } from '@/context/payment-context-provider';
import { usePaymentForm } from '@/hooks/use-payment';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';

type Props = {};

const ButtonHandler: React.FC<Props> = () => {
  const router = useRouter();
  const { setCurrentStep, currentStep, paymentType, productType } = usePaymentContextHook();
  const { onCalculatePrice } = usePaymentForm();
  const { watch, trigger } = useFormContext();

  const handleCalculatePrice = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    switch (productType) {
      case 'APPS':
      case 'EXTENSIONS':
      case 'OTHERS':
        setCurrentStep((prev: number) => prev + 1);
        break;
      case 'AIMODELS':
        const isValid = await trigger(['model', 'inputTokens', 'outputTokens']);
        if (isValid) {
          const model = watch('model');
          const inputTokens = watch('inputTokens');
          const outputTokens = watch('outputTokens');
          await onCalculatePrice(model, inputTokens, outputTokens, setCurrentStep);
        }
        break;
      default:
        console.error('Unknown product type');
    }
  };

  const renderButton = () => {
    if (paymentType === 'CREDIT' && currentStep === 2) {
      return (
        <Button
          type="submit"
          className="w-full bg-black dark:bg-white dark:text-black dark:hover:bg-gray-300 text-slate-50 hover:bg-slate-100"
          onClick={handleCalculatePrice}
        >
          Continue
        </Button>
      );
    }

    if ((paymentType === 'CREDIT' && currentStep !== 5) || 
        (paymentType === 'SUBSCRIPTION' && currentStep !== 3)) {
      return (
        <Button
          type="submit"
          className="w-full bg-black dark:bg-white dark:text-black dark:hover:bg-gray-300 text-slate-50 hover:bg-gray-800"
          onClick={() => setCurrentStep((prev: number) => prev + 1)}
        >
          Continue
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="w-full py-6 flex flex-col gap-3 items-center">
      {renderButton()}
    </div>
  );
};

export default ButtonHandler;
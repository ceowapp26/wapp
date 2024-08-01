import {
  UserPaymentProps,
  UserPaymentSchema,
} from '@/schemas/payment.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePaymentContextHook } from '@/context/payment-context-provider';
import { toast } from 'sonner';
import { modelCost } from '@/constants/ai';

export const usePaymentForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { paymentGateway, paymentType, basePriceInfo, setBasePriceInfo, purchasePriceInfo, setPurchasePriceInfo } = usePaymentContextHook();
  const router = useRouter();
  const [verified, setVerified] = useState(true); 
  const methods = useForm<UserPaymentProps>({
    resolver: zodResolver(UserPaymentSchema),
    mode: 'onSubmit',
  });

  const onCalculatePrice = async (
    model: string,
    inputTokens: number,
    outputTokens: number,
    onNext: React.Dispatch<React.SetStateAction<number>>
  ) => {
    try {
      const totalPrice = 
        (inputTokens * modelCost[model].inputTokens.price) + 
        (outputTokens * modelCost[model].outputTokens.price);
      const _baseCreditInfo = {
        [model]: {
          inputTokens: { price: modelCost[model].inputTokens.price, unit: modelCost[model].inputTokens.unit },
          outputTokens: { price: modelCost[model].outputTokens.price, unit: modelCost[model].outputTokens.unit },
        },
      };

      const _purchaseCreditInfo = {
        [model]: {
          inputTokens: { price: inputTokens * modelCost[model].inputTokens.price, unit: inputTokens },
          outputTokens: { price: outputTokens * modelCost[model].outputTokens.price, unit: outputTokens },
          totalPrice: totalPrice,
        },
      };

      setBasePriceInfo(_baseCreditInfo);
      setPurchasePriceInfo(_purchaseCreditInfo);
      onNext((prev) => prev + 1);
    } catch (error) {
      toast.error('An unexpected error occurred.');
    }
  };

  const onReset = async () => {
    try {
      setCurrentStep(1);
      methods.reset();
      router.push('/settings/billing')
    } catch (error) {
      toast.error(error?.message || 'An unexpected error occurred.');
      throw error;
    }
  };

  const onHandleSubmit = methods.handleSubmit(async (values: UserPaymentProps) => {
    try {
      setLoading(true);
      toast.success('Payment submitted successfully');
      //router.push('/settings/billing');
    } catch (error) {
      console.error('Error submitting payment:', error);
      toast.error('Failed to submit payment');
    } finally {
      setLoading(false);
      await onReset();
    }
  });

  return {
    methods,
    onCalculatePrice,
    onHandleSubmit,
    loading,
    verified,
  };
};

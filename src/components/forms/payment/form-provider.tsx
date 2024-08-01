import { Loader } from '@/components/loader';
import { PaymentContextProvider } from '@/context/payment-context-provider';
import { usePaymentForm } from '@/hooks/use-payment';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { usePaymentContextHook } from '@/context/payment-context-provider';

type Props = {
  children: React.ReactNode;
};

const PaymentFormProvider = ({ children }: Props) => {
  const { methods, onHandleSubmit, loading } = usePaymentForm();

  return (
    <PaymentContextProvider>
      <FormProvider {...methods}>
        <form onSubmit={onHandleSubmit} className="h-full">
          <div className="flex flex-col items-center justify-between gap-3 w-full h-full">
            <Loader loading={loading}>{children}</Loader>
          </div>
        </form>
      </FormProvider>
    </PaymentContextProvider>
  );
};

export default PaymentFormProvider;

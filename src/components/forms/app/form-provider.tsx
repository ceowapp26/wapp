import { Loader } from '@/components/loader';
import { useApp } from '@/hooks/use-app';
import React from 'react';
import { FormProvider } from 'react-hook-form';

type Props = {
  children: React.ReactNode;
};

const AppFormProvider = ({ children }: Props) => {
  const { methods, onHandleSubmit, loading } = useApp();
  return (
    <FormProvider {...methods}>
      <form onSubmit={onHandleSubmit} className="h-full">
        <div className="flex flex-col items-center justify-between gap-3 h-full">
          <Loader loading={loading}>{children}</Loader>
        </div>
      </form>
    </FormProvider>
  );
};

export default AppFormProvider;

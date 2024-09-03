import { Loader } from '@/components/loader';
import { useModel } from '@/hooks/use-model';
import React from 'react';
import { FormProvider } from 'react-hook-form';

type Props = {
  children: React.ReactNode;
};

const ModelFormProvider = ({ children }: Props) => {
  const { methods, onHandleSubmit, loading } = useModel();
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

export default ModelFormProvider;



"use client"
import { Loader } from '@/components/loader';
import { AuthContextProvider, useAuthContextHook} from '@/context/auth-context-provider';
import { useSignUpForm } from '@/hooks/use-sign-up';
import React from 'react';
import { FormProvider } from 'react-hook-form';

type Props = {
  children: React.ReactNode;
};

const SignUpFormProvider = ({ children }: Props) => {
  const { methods, onHandleSubmit, loading } = useSignUpForm();
  const { authLoading } = useAuthContextHook();
  const _loading = loading || authLoading;

  return (
    <AuthContextProvider>
      <FormProvider {...methods}>
        <form onSubmit={onHandleSubmit} className="h-full">
          <div className="flex flex-col items-center justify-between gap-3 h-full">
            <Loader loading={_loading}>{children}</Loader>
          </div>
        </form>
      </FormProvider>
    </AuthContextProvider>
  );
};

export default SignUpFormProvider;

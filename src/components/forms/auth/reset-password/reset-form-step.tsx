'use client'
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuthContextHook } from '@/context/auth-context-provider';
import { useFormContext } from 'react-hook-form';
import { useResetForm } from '@/hooks/use-reset-password';
import { Spinner } from '@/components/spinner';

const ResetFormContainer = dynamic(() => import('./reset-form-container'), {
  ssr: false,
  loading: () => <Spinner />,
});

type Props = {};

const ResetFormStep = (props: Props) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();  
  const { currentStep, setCurrentStep, authType, setAuthType, providerType } = useAuthContextHook();

  useEffect(() => {
    const storedAuthType = localStorage.getItem('authType');
    if (['sign-up', 'sign-in', 'reset'].includes(storedAuthType)) setCurrentStep(1);
  }, [setCurrentStep]);

  return (
    <React.Fragment>
      <ResetFormContainer 
        errors={errors}
        register={register}
        setValue={setValue}
      />
    </React.Fragment>
  );
};

export default ResetFormStep;

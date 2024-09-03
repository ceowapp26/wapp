'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuthContextHook } from '@/context/auth-context-provider';
import { useSignInForm } from '@/hooks/use-sign-in';
import { useFormContext } from 'react-hook-form';
import { Spinner } from '@/components/spinner';
import { defaultOTP } from '@/constants/authorization';

const LoginFormContainer = dynamic(() => import('./login-form-container'), {
  ssr: false,
  loading: () => <Spinner />,
});

const OTPForm = dynamic(() => import('./otp-form'), {
  ssr: false,
  loading: () => <Spinner />,
});

type Props = {};

const LoginFormStep = (props: Props) => {
  const {
    register,
    formState: { errors },
    setValue,
    control,
  } = useFormContext();  
  const { currentStep, setCurrentStep, authType, setAuthType, providerType } = useAuthContextHook();
  const [_OTP, _setOTP] = useState<string>('');
  useEffect(() => {
    const newOTP = providerType === 'email-w-password' ? defaultOTP : '';
    _setOTP(newOTP);
  }, [providerType, _setOTP]);
  setValue('otp', _OTP);
  useEffect(() => {
    const storedAuthType = localStorage.getItem('authType');
    if (['sign-up', 'sign-in', 'reset'].includes(storedAuthType)) setCurrentStep(1);
  }, [setCurrentStep]);

  switch (currentStep) {
    case 1:
      return (
        <>
          <LoginFormContainer 
            errors={errors}
            register={register}
            control={control}
          />
        </>
      );
    case 2:
      return (
        <OTPForm
          control={control}
        />
      );
    default:
      return <div>LoginFormStep</div>;
  }
};

export default LoginFormStep;

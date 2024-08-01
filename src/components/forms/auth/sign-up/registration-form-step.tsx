'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuthContextHook } from '@/context/auth-context-provider';
import { useFormContext } from 'react-hook-form';
import { Spinner } from '@/components/spinner';
import RoleSelectionForm from './role-selection-form';

const RegistrationFormContainer = dynamic(() => import('./registration-form-container'), {
  ssr: false,
  loading: () => <Spinner />,
});

const OTPForm = dynamic(() => import('./otp-form'), {
  ssr: false,
  loading: () => <Spinner />,
});

type Props = {};

const RegistrationFormStep = (props: Props) => {
  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext();  
  const { currentStep, setCurrentStep, authType, setAuthType, providerType } = useAuthContextHook();
  const [_OTP, _setOTP] = useState<string>('');
  const [_userRole, _setUserRole] = useState<'individual' | 'owner' | 'developer' | 'student'>('individual');
  useEffect(() => {
    const storedAuthType = localStorage.getItem('authType');
    if (['sign-up', 'sign-in', 'reset'].includes(storedAuthType)) setCurrentStep(2);
  }, [setCurrentStep]);

  switch (currentStep) {
    case 1:
      return (
        <RoleSelectionForm
          register={register}
          userRole={_userRole}
          setUserRole={_setUserRole}
        />
      );
    case 2:
      return (
        <>
          <RegistrationFormContainer 
            errors={errors}
            register={register}
            control={control}
          />
        </>
      );
    case 3:
      return (
        <OTPForm
          control={control}
        />
      );
    default:
      return <div>RegistrationFormStep</div>;
  }
};

export default RegistrationFormStep;

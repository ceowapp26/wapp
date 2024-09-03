'use client';
import { useAppContextHook } from '@/context/app-context-provider';
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { Spinner } from '@/components/spinner';

const AppForm = dynamic(() => import('./app-form'), {
  ssr: false,
  loading: () => <Spinner />,
});

const FeatureForm = dynamic(() => import('./feature-form'), {
  ssr: false,
  loading: () => <Spinner />,
});

type Props = {};

const AppFormStep = (props: Props) => {
  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext();  
  const { currentStep, setCurrentStep } = useAppContextHook();
  switch (currentStep) {
    case 1:
      return (
        <AppForm
          register={register}
          errors={errors}
          control={control}
        />
      );

    case 2:
      return (
        <FeatureForm
          register={register}
          errors={errors}
          control={control}
        />
      );
    default:
      return <div>AppFormStep</div>;
  }
};

export default AppFormStep;


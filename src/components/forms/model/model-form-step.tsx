'use client';
import { useModelContextHook } from '@/context/model-context-provider';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { Spinner } from '@/components/spinner';

const ModelTypeSelectionForm = dynamic(() => import('./model-type-selection-form'), {
  ssr: false,
  loading: () => <Spinner />,
});

const PlanSelectionForm = dynamic(() => import('./plan-selection-form'), {
  ssr: false,
  loading: () => <Spinner />,
});

const PlanModelForm = dynamic(() => import('./plan-model-form'), {
  ssr: false,
  loading: () => <Spinner />,
});

const CreditModelForm = dynamic(() => import('./credit-model-form'), {
  ssr: false,
  loading: () => <Spinner />,
});

type Props = {};

const ModelFormStep = (props: Props) => {
  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext();  

  const { currentStep, modelType, planType, setPlanType, setModelType } = useModelContextHook();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ModelTypeSelectionForm
            register={register}
            setModelType={setModelType}
            modelType={modelType}
          />
        );
      case 2:
        if (modelType === "SUBSCRIPTION") {
          return (
            <PlanSelectionForm
              register={register}
              setPlanType={setPlanType}
              planType={planType}
            />
          );
        } else {
          return (
            <CreditModelForm
              setValue={setValue}
              register={register}
              errors={errors}
              control={control}
            />
          );
        }
      case 3:
        if (modelType === "SUBSCRIPTION") {
          return (
            <PlanModelForm
              setValue={setValue}
              register={register}
              errors={errors}
              control={control}
            />
          );
        }
        break;
      default:
        return <div>ModelFormStep</div>;
    }
  };

  return renderStep();
};

export default ModelFormStep;
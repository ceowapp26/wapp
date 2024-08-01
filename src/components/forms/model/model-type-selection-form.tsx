import React from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import ModelTypeBanner from './model-type-banner';
import ButtonHandler from './button-handlers';

type Props = {
  register: UseFormRegister<FieldValues>;
  modelType: 'SUBSCRIPTION' | 'CREDIT';
  setModelType: React.Dispatch<React.SetStateAction<'SUBSCRIPTION' | 'CREDIT'>>;
};

const ModelTypeSelectionForm = ({ register, setModelType, modelType }: Props) => {
  return (
    <>
      <h2 className="text-gravel md:text-4xl font-bold">Set the API Usage Limits</h2>
      <ModelTypeBanner
        register={register}
        setModelType={setModelType}
        modelType={modelType}
        value="SUBSCRIPTION"
        title="Register SUBSCRIPTION models"
        text="AI API Usage Limits for SUBSCRIPTION models"
      />
      <ModelTypeBanner
        register={register}
        setModelType={setModelType}
        modelType={modelType}
        value="CREDIT"
        title="Register CREDIT models"
        text="AI API Usage Limits for CREDIT models"
      />
      <ButtonHandler />
    </>
  );
};

export default ModelTypeSelectionForm;

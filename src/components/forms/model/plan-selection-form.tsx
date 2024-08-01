import React from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import PlanTypeBanner from './plan-type-banner';
import ButtonHandler from './button-handlers';

type Props = {
  register: UseFormRegister<FieldValues>;
  planType: 'FREE' | 'STANDARD' | 'PRO' | 'ULTIMATE';
  setPlanType: React.Dispatch<React.SetStateAction<'FREE' | 'STANDARD' | 'PRO' | 'ULTIMATE'>>;
};

const PlanSelectionForm = ({ register, setPlanType, planType }: Props) => {
  return (
    <>
      <h2 className="text-gravel md:text-4xl font-bold">Set the API Usage Limits</h2>
      <PlanTypeBanner
        register={register}
        setPlanType={setPlanType}
        planType={planType}
        value="FREE"
        title="Register FREE plan options"
        text="AI API Usage Limits for FREE Plan"
      />
      <PlanTypeBanner
        register={register}
        setPlanType={setPlanType}
        planType={planType}
        value="STANDARD"
        title="Register STANDARD plan options"
        text="AI API Usage Limits for STANDARD Plan"
      />
      <PlanTypeBanner
        register={register}
        setPlanType={setPlanType}
        planType={planType}
        value="PRO"
        title="Register PRO plan options"
        text="AI API Usage Limits for PRO Plan"
      />
      <PlanTypeBanner
        register={register}
        setPlanType={setPlanType}
        planType={planType}
        value="ULTIMATE"
        title="Register ULTIMATE plan options"
        text="AI API Usage Limits for ULTIMATE Plan"
      />
      <ButtonHandler />
    </>
  );
};

export default PlanSelectionForm;

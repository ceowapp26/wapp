import { Button } from '@/components/ui/button';
import React from 'react';
import { useModelContextHook } from '@/context/model-context-provider';
import { useFormContext } from 'react-hook-form';
import { useModel } from '@/hooks/use-model';

const ButtonHandler: React.FC = () => {
  const { aiModelStatus, planModelStatus, setCurrentStep, currentStep, planType, modelType } = useModelContextHook();
  const { setValue } = useFormContext();
  const { onRegisterModelPlan } = useModel();

  const handleRegisterModelPlan = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (planType && modelType === "SUBSCRIPTION") {
      const modelId = await onRegisterModelPlan(planType, setCurrentStep);
      setValue('modelId', modelId);
    }
  };

  const renderButton = (text: string, onClickOrType: ((e: React.MouseEvent<HTMLButtonElement>) => void) | "submit" | "button") => {
    const isSubmitType = onClickOrType === "submit";
    return (
      <Button
        type={isSubmitType ? "submit" : "button"}
        className="w-full bg-black text-slate-50 hover:text-black hover:bg-slate-100"
        onClick={isSubmitType ? undefined : (onClickOrType as (e: React.MouseEvent<HTMLButtonElement>) => void)}
      >
        {text}
      </Button>
    );
  };

  return (
    <div className="w-full py-6 flex flex-col gap-3 items-center">
      {modelType === "SUBSCRIPTION" && currentStep === 2 && renderButton(planModelStatus === "CREATE" ? 'Register Plan' : 'Update Plan', handleRegisterModelPlan)}
      {currentStep === 1 && renderButton('Continue', () => setCurrentStep(prevStep => prevStep + 1))}
      {modelType === "CREDIT" && currentStep === 2 && renderButton(aiModelStatus === "CREATE" ? 'Register Model' : 'Update Model', handleRegisterModelPlan)}
      {modelType === "SUBSCRIPTION" && currentStep === 3 && renderButton(aiModelStatus === "CREATE" ? 'Register Model' : 'Update Model', "submit")}
    </div>
  );
};

export default ButtonHandler;
"use client"
import React, { useEffect } from 'react'; 
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthContextHook } from '@/context/auth-context-provider';
import { useResetForm } from '@/hooks/use-reset-password';
import { ConfirmModal } from '@/components/modals/expire-modal';
import { useRouter } from 'next/navigation'; 
import { FieldValues, UseFormWatch } from 'react-hook-form';
import { useFormContext } from 'react-hook-form'

type Props = {};

const ButtonHandler: React.FC<Props> = (prop: Props) => {
  const router = useRouter();
  const { setCurrentStep, currentStep, providerType, authType } = useAuthContextHook();
  const { onSendResetLink, expired, verified } = useResetForm();
  const { watch, trigger } = useFormContext();
  const email = watch('email');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const otp = watch('otp');
  const handleSwitchReset = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let isValid = false;
    switch (authType) {
      case 'reset':
        isValid = await trigger(['email']);
        if (isValid) {
          onSendResetLink(email, setCurrentStep);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full py-6 flex flex-col gap-3 items-center">
      {currentStep === 2 && (
        <>
          <Button type="submit" className="w-full bg-black text-slate-50 hover:text-black hover:bg-slate-100">
            Reset
          </Button>
        </>
      )}
      {currentStep === 1 && (
        <Button
          type="submit"
          className="w-full bg-black text-slate-50 hover:text-black hover:bg-slate-100"
          onClick={handleSwitchReset}
        >
          Send 
        </Button>
      )}
    </div>
  );
};

export default ButtonHandler;


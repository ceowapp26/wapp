"use client"
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthContextHook } from '@/context/auth-context-provider';
import { useSignInForm } from '@/hooks/use-sign-in';
import { useFormContext } from 'react-hook-form';
import { ConfirmModal } from '@/components/modals/expire-modal';
import { useRouter } from 'next/navigation';
import { FieldValues, UseFormWatch } from 'react-hook-form';

type Props = {};

const ButtonHandler: React.FC<Props> = (props: Props) => {
  const router = useRouter();
  const { setCurrentStep, currentStep, providerType } = useAuthContextHook();
  const { onGenerateOTP, onSendEmailLink, expired, verified } = useSignInForm();
  const { watch, trigger } = useFormContext();
  const email = watch('email');
  const password = watch('password');
  const phone = watch('phone');

  const handleSwitchSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let isValid = false;
    try {
      switch (providerType) {
        case 'email-n-password':
          isValid = await trigger(['email']);
          if (isValid) {
            await onSendEmailLink(email, setCurrentStep);
          }
          break;
        case 'phone':
          isValid = await trigger(['phone']);
          if (isValid) {
            await onGenerateOTP(undefined, undefined, phone, setCurrentStep);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleReloadSignin = () => {
    setCurrentStep(1);
    router.push("/auth/sign-in");
  };

  useEffect(() => {
    if (expired) {
      return <ConfirmModal onConfirm={handleReloadSignin} />;
    }
  }, [expired, verified]);

  return (
    <div className="w-full py-6 flex flex-col gap-3 items-center">
      {(currentStep === 1 && providerType === "email-w-password") || currentStep === 2 ? (
        <Button type="submit" className="w-full bg-black text-slate-50 hover:text-black hover:bg-slate-100">
          Sign In
        </Button>
      ) : null}
      {currentStep === 1 && providerType !== "email-w-password" ? (
        <Button
          type="submit"
          className="w-full bg-black text-slate-50 hover:text-black hover:bg-slate-100"
          onClick={handleSwitchSignIn}
        >
          Continue
        </Button>
      ) : null}
    </div>
  );
};

export default ButtonHandler;

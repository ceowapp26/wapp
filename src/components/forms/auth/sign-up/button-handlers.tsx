"use client"
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthContextHook } from '@/context/auth-context-provider';
import { useSignUpForm } from '@/hooks/use-sign-up';
import { ConfirmModal } from '@/components/modals/expire-modal';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';

type Props = {};

const ButtonHandler: React.FC<Props> = (props: Props) => {
  const router = useRouter();
  const { setCurrentStep, currentStep, providerType } = useAuthContextHook();
  const { onGenerateOTP, onSendEmailLink, expired, verified } = useSignUpForm();
  const { watch, trigger } = useFormContext();
  const email = watch('email');
  const fullname = watch('fullname');
  const username = watch('username');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const phone = watch('phone');

  const handleSwitchSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let isValid = false;
    try {
      switch (providerType) {
        case 'email-w-password':
          isValid = await trigger(['fullname', 'username', 'email', 'password', 'confirmPassword']);
          if (isValid) {
            await onGenerateOTP(email, password, undefined, setCurrentStep);
          }
          break;
        case 'email-n-password':
          isValid = await trigger('email');
          if (isValid) {
            await onSendEmailLink(email, setCurrentStep);
          }
          break;
        case 'phone':
          isValid = await trigger('phone');
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

  const handleReloadSignup = () => {
    setCurrentStep(2);
    router.push("/auth/sign-up");
  };

  useEffect(() => {
    if (expired) {
      return <ConfirmModal onConfirm={handleReloadSignup} />;
    }
  }, [expired, verified]);

  return (
    <div className="w-full py-6 flex flex-col gap-3 items-center">
      {currentStep === 3 && (
        <Button
          type="submit"
          className="w-full bg-black text-slate-50 hover:text-black hover:bg-slate-100"
        >
          Create an account
        </Button>
      )}
      {currentStep === 2 && (
        <Button
          type="submit"
          className="w-full bg-black text-slate-50 hover:text-black hover:bg-slate-100"
          onClick={handleSwitchSignUp}
        >
          Continue
        </Button>
      )}
      {currentStep !== 2 && currentStep !== 3 && (
        <React.Fragment>
          <Button
            type="submit"
            className="w-full bg-black text-slate-50 hover:bg-slate-100"
            onClick={() => setCurrentStep((prev: number) => prev + 1)}
          >
            Continue
          </Button>
          <p>
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </React.Fragment>
      )}
    </div>
  );
};

export default ButtonHandler;

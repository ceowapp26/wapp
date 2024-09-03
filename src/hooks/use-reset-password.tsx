import {
  UserResetPasswordProps,
  UserResetPasswordSchema,
} from '@/schemas/auth.schema';
import { useAuth, useSignIn } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContextHook } from '@/context/auth-context-provider';
import { toast } from "sonner";

export const useResetForm = () => {
  const { isLoaded, setActive, signIn } = useSignIn();
  const [loading, setLoading] = useState<boolean>(false);
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState('');
  const [expired, setExpired] = useState(false);
  const [verified, setVerified] = useState(false);

  const router = useRouter();
  const { authType, providerType, userType } = useAuthContextHook();
  const { isSignedIn } = useAuth();

  if (isSignedIn) { 
    router.push('/home');
  }

  const methods = useForm<UserResetPasswordProps>({
    resolver: zodResolver(UserResetPasswordSchema),
    mode: 'all',
  });

  const onSendResetLink = async (
    email: string,
    onNext: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (!isLoaded) return;
    setExpired(false);
    setVerified(false);
    try {
      const test = await signIn
        ?.create({
          strategy: 'reset_password_email_code',
          identifier: email,
        })
        .then(_ => {
          setSuccessfulCreation(true);
          setError('');
        })
        .catch(err => {
          console.error('error', err.errors[0].longMessage);
          setError(err.errors[0].longMessage);
        });
      onNext((prev) => prev + 1);
    } catch (error: any) {
      toast.error(error.errors[0].longMessage);
    }
  };

  const onHandleSubmit = methods.handleSubmit(
    async (values: UserResetPasswordProps) => {
      if (!isLoaded) return;
      try {
        setLoading(true);
        await signIn
          ?.attemptFirstFactor({
            strategy: 'reset_password_email_code',
            values: values.otp, 
          })
          .then(result => {
            // Check if 2FA is required
            if (result.status === 'needs_second_factor') {
              setSecondFactor(true);
              setError('');
            } else if (result.status === 'complete') {
              // Set the active session to 
              // the newly created session (user is now signed in)
              setActive({ session: result.createdSessionId });
              setError('');
            } else {
              console.log("reset_password_email_code");
            }
          })
          .catch(err => {
            console.error('error', err.errors[0].longMessage);
            setError(err.errors[0].longMessage);
          });
      } catch (error: any) {
        toast.error(error.errors[0].longMessage);
      } finally {
        setLoading(false);
      }
    }
  );

  return {
    methods,
    onHandleSubmit,
    onSendResetLink,
    loading,
    expired,
    verified,
  };
};

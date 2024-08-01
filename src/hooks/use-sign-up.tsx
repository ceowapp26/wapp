import {
  UserRegistrationProps,
  UserRegistrationSchema,
} from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { onCompleteUserRegistration } from '@/actions/completeRegistration';
import { useAuthContextHook } from '@/context/auth-context-provider';
import { toast } from 'sonner';

export const useSignUpForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { signUp, isLoaded, setActive } = useSignUp();
  const router = useRouter();
  const { providerType, userType } = useAuthContextHook();
  const [expired, setExpired] = useState(false);
  const [verified, setVerified] = useState(false);
  const methods = useForm<UserRegistrationProps>({
    resolver: zodResolver(UserRegistrationSchema),
    defaultValues: {
      type: 'individual',
    },
    mode: 'all',
  });

  const onSendEmailLink = async (
    email: string,
    onNext: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (!isLoaded && !signUp) return null;
    setExpired(false);
    setVerified(false);
    localStorage.setItem('tempEmail', email);
    try {
      const userFormData: { emailAddress: string, password: string } = { emailAddress: email, password: `${SECRET_PASSWORD}` };
      const { startEmailLinkFlow } = signUp.createEmailLinkFlow();
      const test = await signUp.create(userFormData);
      router.push('/auth/post-signup');
      const su = await startEmailLinkFlow({
        redirectUrl: 'http://localhost:3000/auth/verify-email',
      });
      const verification = su.verifications.emailAddress;
      if (verification.verifiedFromTheSameClient()) {
        setVerified(true);
        return;
      } else if (verification.status === 'expired') {
        setExpired(true);
      }

      if (su.status === 'complete') {
        setActive({
          session: su.createdSessionId,
          beforeEmit: () => router.push('/home'),
        });
      }
      onNext((prev) => prev + 1);
    } catch (error: any) {
      toast.error(error?.errors?.[0]?.longMessage || 'An unexpected error occurred.');
    }
  };


  const onGenerateOTP = async (
    email?: string,
    password?: string,
    phone?: string,
    onNext: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (!isLoaded && !signUp) return null;
    setExpired(false);
    setVerified(false);
    try {
      if (phone) {
        const phoneFormData: { phoneNumber: string } = { phoneNumber: phone };
        await signUp.create(phoneFormData);
        await signUp.preparePhoneNumberVerification({ strategy: 'phone_code' });
      } else {
        const emailFormData: { emailAddress: string; password?: string } = {
          emailAddress: email,
          password: password || '',
        };
        await signUp.create(emailFormData);
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      }
      onNext((prev) => prev + 1);
    } catch (error: any) {
      toast.error(error?.errors?.[0]?.longMessage || 'An unexpected error occurred.');
    }
  };

  const onHandleSubmit = methods.handleSubmit(async (values: UserRegistrationProps) => {
    if (!isLoaded && !signUp) return null;
    try {
      setLoading(true);
      const code = values.otp;
      if (!code) return;
      let completeSignUp;
      if (providerType === 'phone') {
        completeSignUp = await signUp.attemptPhoneVerification({ code });
      } else {
        completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      }

      if (!completeSignUp || completeSignUp.status !== 'complete') {
        if (completeSignUp?.status === 'expired') {
          setExpired(true);
        }
        setLoading(false);
        return toast.error('Something went wrong!');
      }

      if (!signUp.createdUserId) {
        setLoading(false);
        return toast.error('User ID not found!');
      }

      if ( completeSignUp.createdSessionId ) {
        await setActive({ session: completeSignUp.createdSessionId });
        setLoading(false);
        setVerified(true);
        router.push('/home');
      }

    } catch (error: any) {
      setLoading(false);
      toast.error(error?.errors?.[0]?.longMessage || 'An unexpected error occurred.');
    }
  });

  return {
    methods,
    onHandleSubmit,
    onGenerateOTP,
    onSendEmailLink,
    loading,
    expired,
    verified,
  };
};

import {
  UserLoginProps,
  UserLoginSchema,
} from '@/schemas/auth.schema';
import { useSignIn } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContextHook } from '@/context/auth-context-provider';
import { toast } from 'sonner';

export const useSignInForm = () => {
  const { isLoaded, setActive, signIn } = useSignIn();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { providerType, userType } = useAuthContextHook();
  const [expired, setExpired] = useState(false);
  const [verified, setVerified] = useState(false);

  const methods = useForm<UserLoginProps>({
    resolver: zodResolver(UserLoginSchema),
    mode: 'all',
  });

  const onSendEmailLink = async (
    email: string,
    onNext: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (!isLoaded && !signIn) return;
    setExpired(false);
    setVerified(false);
    localStorage.setItem("tempEmail", email);
    try {
      const { startEmailLinkFlow } = signIn.createEmailLinkFlow();
      const si = await signIn.create({ identifier: email });
      const emailAddressId = si.supportedFirstFactors.find(
        (ff) => ff.strategy === "email_link" && ff.safeIdentifier === email
      )?.emailAddressId;
      if (!emailAddressId) throw new Error('Email link factor not found');
      router.push("/auth/post-signin");
      const res = await startEmailLinkFlow({
        emailAddressId: emailAddressId,
        redirectUrl: "http://localhost:3000/home",
      });

      const verification = res.firstFactorVerification;
      if (verification.verifiedFromTheSameClient()) {
        setVerified(true);
        return;
      } else if (verification.status === "expired") {
        setExpired(true);
      }
      if (res.status === "complete") {
        setActive({ session: res.createdSessionId });
        return;
      }
      onNext((prev) => prev + 1);
    } catch (error: any) {
      toast.error(error.errors[0]?.longMessage || 'An unexpected error occurred.');
    }
  };

  const onGenerateOTP = async (
    email?: string,
    password?: string,
    confirmPassword?: string,
    phone?: string,
    onNext: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (!isLoaded && !signIn) return;
    setExpired(false);
    setVerified(false);
    try {
      if (phone) {
        const { supportedFirstFactors } = await signIn.create({
          identifier: phone,
        });
        const phoneCodeFactor = supportedFirstFactors.find(
          (ff) => ff.strategy === 'phone_code'
        );
        if (!phoneCodeFactor || !('phoneNumberId' in phoneCodeFactor)) {
          throw new Error('Phone code factor not found');
        }
        const { phoneNumberId } = phoneCodeFactor;

        await signIn.prepareFirstFactor({
          strategy: 'phone_code',
          phoneNumberId,
        });

        setVerified(true);
      } else {
        const emailFormData: { emailAddress: string; password: string } = {
          emailAddress: email!,
          password: password!,
        };

        await signIn.create(emailFormData);
        await signIn.prepareEmailAddressVerification({ strategy: 'email_code' });
      }

      onNext((prev) => prev + 1);
    } catch (error: any) {
      toast.error(error.errors[0]?.longMessage || 'An unexpected error occurred.');
    }
  };

  const onHandleSubmit = methods.handleSubmit(
    async (values: UserLoginProps) => {
      if (!isLoaded && !signIn) return;
      try {
        setLoading(true);
        let completeSignIn;

        if (providerType === "phone") {
          completeSignIn = await signIn.attemptFirstFactor({
            strategy: 'phone_code',
            code: values.otp,
          });
        } else {
          completeSignIn = await signIn.create({
            identifier: values.email,
            password: values.password,
          });
        }

        if (completeSignIn.status !== 'complete') {
          if (completeSignIn.status === "expired") {
            setExpired(true);
          }
          setLoading(false);
          return toast.error('Something went wrong!');
        }

        if (completeSignIn.createdSessionId) {
          await setActive({ session: completeSignIn.createdSessionId });
          setLoading(false);
          setVerified(true);
          router.push('/home');
        }
      } catch (error: any) {
        toast.error(error.errors[0]?.longMessage || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }
  );

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

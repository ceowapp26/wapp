"use client"
import { Loader } from '@/components/loader';
import { AuthContextProvider } from '@/context/auth-context-provider';
import { useSignInForm } from '@/hooks/use-sign-in';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthContextHook } from '@/context/auth-context-provider';
import { ArrowLeft } from 'lucide-react';

type Props = {}

const PostSignIn = (props: Props) => {
  const { setCurrentStep, currentStep, providerType } = useAuthContextHook();
  const { methods, onHandleSubmit, loading } = useSignInForm();
  const registeredEmail = localStorage.getItem("tempEmail");
  const router = useRouter();

  const handleRedirectSignIn = () => { 
    setCurrentStep(2);
    router.push("/auth/sign-in");
  };

  return (
    <div className="flex justify-center items-center max-w-[500px] h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl text-black mb-4">Check your email to finish signing in.</h1>
        <div className="text-gray-700 text-base mb-4" data-hj-suppress="true">
          <br />
          We just sent a link to <span className="font-bold">{registeredEmail}</span>
          <br />
          <br /> Follow the link in your email to finish signing in.
          <br />
          <br /> If you haven&apos;t received it within a few minutes, double check your spam/junk folder.
        </div>
        <div className="flex justify-center mt-8">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded flex items-center"
            onClick={handleRedirectSignIn}
          >
            <ArrowLeft className="mr-2" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostSignIn;

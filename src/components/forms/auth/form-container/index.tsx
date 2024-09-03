"use client"
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuthContextHook } from '@/context/auth-context-provider';
import { Rocket, ArrowLeft } from "lucide-react";
import { UseFormRegister, Control, FieldValues, FieldErrors } from 'react-hook-form';

const AuthProviders = dynamic(() => import('../auth-provider/auth-providers'), { ssr: false });

type Props = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  control: Control<FieldValues, any>;
  authForm: React.ComponentType<Props>;
  buttonHandler: React.ComponentType<Props>;
};

const FormContainer: React.FC<Props> = ({
  register,
  errors,
  control,
  authForm: AuthForm,
  buttonHandler: ButtonHandler
}: Props) => {
  const { authType, setAuthType, providerType, setProviderType, setCurrentStep } = useAuthContextHook();
  const router = useRouter();

  const handleRedirectToSigninPage = useCallback(() => {
    setAuthType('sign-in');
    setProviderType('email-n-password');
    router.push("/auth/sign-in");
  }, [setAuthType, setProviderType, router]);

  const handleRedirectToSignupPage = useCallback(() => {
    setAuthType('sign-up');
    setProviderType('email-n-password');    
    router.push("/auth/sign-up");
  }, [setAuthType, setProviderType, router]);

  const handleRedirectToResetPage = useCallback(() => {
    setAuthType('reset');
    setProviderType('email-n-password');
    router.push("/auth/reset-password");
  }, [setAuthType, setProviderType, router]);

  const switchProviderType = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newProviderType = providerType === "email-w-password" ? "email-n-password" : "email-w-password";
    setProviderType(newProviderType);
    if (authType === "reset") router.push("/auth/sign-in");
  }, [providerType, authType, setProviderType, router]);

  const switchUserType = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.removeItem('authType');
    setCurrentStep(1);
  }, [setCurrentStep]);

  useEffect(() => {
    localStorage.setItem("authType", authType);
  }, [authType]);

  const headerContent = useMemo(() => {
    if (providerType === "email-w-password" && authType === "sign-up") {
      return (
        <>
          <a className="group flex cursor-pointer" onClick={switchProviderType}>
            <ArrowLeft className="text-blue-500 group-hover:text-purple-700"/>
            <button id="switch-n" className="text-blue-500 ml-1 group-hover:text-purple-700">
              All sign-up options
            </button>
          </a>
          <h1 className="text-2xl text-center text-black font-semibold py-4 mb-4">Sign up with email</h1>
          <p>Wapp is an all-in-one platform that helps you with everything you need.</p>
        </>
      );
    } else if (authType === "reset") {
      return (
        <>
          <a className="group flex cursor-pointer" onClick={switchProviderType}>
            <ArrowLeft className="text-blue-500 group-hover:text-purple-700"/>
            <button id="switch-n" className="text-blue-500 ml-1 group-hover:text-purple-700">
              All sign-up options
            </button>
          </a>
          <h1 className="text-2xl text-black text-center py-4 font-semibold mb-4">Reset your password</h1>
          <p>We will send instructions to the email address below to reset your password.</p>
        </>
      );
    } else {
      return (
        <>
          <a className="group flex cursor-pointer" onClick={switchUserType}>
            <ArrowLeft className="text-blue-500 group-hover:text-purple-700"/>
            <button id="switch-n" className="text-blue-500 ml-1 mb-2 group-hover:text-purple-700">
              Back
            </button>
          </a>
          <div className="text-center">
            <h1 className="text-2xl text-black font-semibold mb-4">Welcome to Wapp</h1>
            <p className="text-gray-600 mb-2">Wapp is an all-in-one platform that helps you with everything you need.</p>
          </div>
          <div className="flex flex-col items-center justify-center mb-2">
            <span className="text-black font-semibold p-4">
              {authType === "sign-up" ? "Sign up with" : "Sign in with"}
            </span>
            <AuthProviders />
          </div>
        </>
      );
    }
  }, [providerType, authType, switchProviderType, switchUserType]);

  return (
    <div className="relative -top-10 bg-transparent inline-flex flex-col items-center w-full h-full p-12 mobileXL:py-12">
      <div className="bg-white shadow-md border-[1px] rounded-lg p-6 max-w-lg w-full h-full">
        {headerContent}
        {providerType !== "email-w-password" && authType === "sign-up" && 
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
        }
        <div className="mb-4 flex flex-col">
          <AuthForm register={register} errors={errors} control={control} />
          {providerType === "email-w-password" && authType === "sign-in" && (
            <Link href="/auth/reset-password" className="text-blue-500 text-sm hover:underline text-end mr-2">
              Forgot password?
            </Link>
          )}
          <ButtonHandler />
        </div>
       <div className="relative bg-slate-300 p-2 rounded-md text-left text-sm text-gray-500">
          <span className="absolute mr-2 top-2" aria-hidden="true">
            <Rocket />
          </span>
          <div className="pl-8">
            {authType === "sign-up" && providerType === "email-n-password" && <span> We'll email you a verification link for a password-free sign-up.</span>}
            {authType === "sign-in" && providerType === "email-n-password" && <span> We'll email you a verification link for a password-free sign-in.</span>}
            {authType === "sign-up" && providerType === "email-w-password" && <span> We'll email you a verification code for a one-time password sign-up.</span>}
            {authType === "sign-in" && providerType === "email-w-password" && <span> We'll email you a verification code for a one-time password sign-in.</span>}
            {authType === "sign-up" && providerType === "phone" && <span> We'll send you a verification code for a one-time password sign-up.</span>}
            {authType === "sign-in" && providerType === "phone" && <span> We'll send you a verification code for a one-time password sign-in.</span>}
          </div>
          {!(providerType === "phone") && (
            <>
              <span className="flex-shrink text-gray-500 pl-8">Or</span>
              <button
                id="switch-type"
                className="text-blue-500 hover:underline ml-1"
                onClick={(e) => switchProviderType(e)}
              >
              {authType === "reset" ? 
                "Email me a link" :
                (providerType === "email-w-password") ? 
                  (authType === "sign-up" ? "Email me a link" : "Email me a link"):
                  (authType === "sign-up" ? "Sign up with a password" : "Sign in with a password")
              }
              </button>
            </>
          )}
        </div>
        {!(authType === "reset") && (
          <div className="text-center p-4 text-sm text-gray-500">
            {authType === "sign-up" ? <span>Already have an account? </span> : <span>No account? </span>}
            <button
              id="redirect-route"
              className="text-blue-500 hover:underline"
              onClick={authType === "sign-up" ? handleRedirectToSigninPage : handleRedirectToSignupPage}
            >
              {authType === "sign-up" ? "Sign in" : "Sign up"}
            </button>
          </div>
        )}
        <div className="border-t-[1px] flex flex-row flex-wrap items-center mobileML:justify-center justify-start border-grey p-2 text-xs text-gray-400 mt-4">
          By {authType === "sign-up" ? "signing up" : "signing in"}, you agree to our
          <button
            id="redirect-tos"
            className="text-blue-500 hover:underline pr-1 ml-1"
            target="_blank"
            rel="noopener"
          >
            <Link href="/tos">
              Terms of Service
            </Link>
          </button>
          &amp;
          <button
            id="redirect-prc"
            className="text-blue-500 hover:underline ml-0"
            target="_blank"
            rel="noopener"
          >
            <Link href="/privacy">
              Privacy policy
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
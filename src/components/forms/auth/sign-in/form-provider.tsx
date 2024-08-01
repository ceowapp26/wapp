'use client'
import React from 'react'
import { Loader } from '@/components/loader'
import { AuthContextProvider, useAuthContextHook } from '@/context/auth-context-provider'
import { useAuthProvider } from '@/hooks/use-auth-provider'
import { useSignInForm } from '@/hooks/use-sign-in'
import { FormProvider } from 'react-hook-form'

type Props = {
  children: React.ReactNode
}

const SignInFormProvider = ({ children }: Props) => {
  const { methods, onHandleSubmit, loading } = useSignInForm()
  const { authLoading } = useAuthContextHook();
  const _loading = loading || authLoading;

  return (
    <AuthContextProvider>
      <FormProvider {...methods}>
        <form
          onSubmit={onHandleSubmit}
          className="h-full"
        >
          <div className="flex flex-col justify-center items-center gap-3 h-full">
            <Loader loading={_loading}>{children}</Loader>
          </div>
        </form>
      </FormProvider>
    </AuthContextProvider>
  )
}

export default SignInFormProvider
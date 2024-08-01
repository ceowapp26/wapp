'use client'
import React from 'react'
import { Loader } from '@/components/loader'
import { AuthContextProvider } from '@/context/auth-context-provider'
import { useResetForm } from '@/hooks/use-reset-password'
import { FormProvider } from 'react-hook-form'

type Props = {
  children: React.ReactNode
}

const ResetFormProvider = ({ children }: Props) => {
  const { methods, onHandleSubmit, loading } = useResetForm()

  return (
    <AuthContextProvider>
      <FormProvider {...methods}>
        <form
          onSubmit={onHandleSubmit}
          className="h-full"
        >
          <div className="flex flex-col justify-center items-center gap-3 h-full">
            <Loader loading={loading}>{children}</Loader>
          </div>
        </form>
      </FormProvider>
    </AuthContextProvider>
  )
}

export default ResetFormProvider
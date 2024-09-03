"use client"
import React from 'react'
import SignUpFormProvider from '@/components/forms/auth/sign-up/form-provider'
import HighLightBar from '@/components/forms/auth/sign-up/highlight-bar'
import RegistrationFormStep from '@/components/forms/auth/sign-up/registration-form-step'
import { useSignUpForm } from '@/hooks/use-sign-up'

type Props = {}

const SignUp = (props: Props) => {
  return (
    <div className="flex-1 py-4 w-full">
      <div className="flex flex-col h-full gap-3">
        <SignUpFormProvider>
          <div className="flex flex-col gap-3">
            <RegistrationFormStep />
          </div>
          <HighLightBar />
        </SignUpFormProvider>
      </div>
    </div>
  )
}

export default SignUp
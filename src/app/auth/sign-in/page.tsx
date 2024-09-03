"use client"
import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'
import SignInFormProvider from '@/components/forms/auth/sign-in/form-provider'
import LoginFormStep from '@/components/forms/auth/sign-in/login-form-step'

const SignInPage = () => {
  return (
    <div className="flex-1 py-4 w-full">
      <div className="flex flex-col h-full gap-3">
        <SignInFormProvider>
          <div className="flex flex-col gap-3">
            <LoginFormStep />
          </div>
        </SignInFormProvider>
      </div>
    </div>
  )
}

export default SignInPage


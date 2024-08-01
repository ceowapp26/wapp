"use client"
import React from 'react'
import ResetFormProvider from '@/components/forms/auth/reset-password/form-provider'
import ResetFormStep from '@/components/forms/auth/reset-password/reset-form-step'

type Props = {}

const Reset = (props: Props) => {
  return (
    <div className="flex-1 py-4 w-full">
      <div className="flex flex-col h-full gap-3">
        <ResetFormProvider>
          <div className="flex flex-col gap-3">
            <ResetFormStep />
          </div>
        </ResetFormProvider>
      </div>
    </div>
  )
}

export default Reset
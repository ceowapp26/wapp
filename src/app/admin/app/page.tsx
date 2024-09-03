"use client"
import { AppContextProvider } from '@/context/app-context-provider'
import AppFormProvider from '@/components/forms/app/form-provider'
import HighLightBar from '@/components/forms/app/highlight-bar'
import AppFormStep from '@/components/forms/app/app-form-step'
import React from 'react'

type Props = {}

const AppPage = (props: Props) => {
  return (
    <AppContextProvider>
      <div className="flex-1 py-4 md:px-4 w-full max-h-screen overflow-y-auto">
        <div className="flex flex-col gap-3">
          <AppFormProvider>
            <div className="flex flex-col gap-3">
              <AppFormStep />
            </div>
            <HighLightBar />
          </AppFormProvider>
        </div>
      </div>
    </AppContextProvider>
  )
}

export default AppPage



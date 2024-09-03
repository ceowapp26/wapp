"use client"
import { ModelContextProvider } from '@/context/model-context-provider'
import HighLightBar from '@/components/forms/model/highlight-bar'
import ModelFormProvider from '@/components/forms/model/form-provider'
import ModelFormStep from '@/components/forms/model/model-form-step'
import React from 'react'

type Props = {}

const ModelPage = (props: Props) => {
  return (
    <ModelContextProvider>
      <div className="flex-1 py-4 md:px-4 w-full max-h-screen overflow-y-auto">
        <div className="flex flex-col gap-3">
          <ModelFormProvider>
            <div className="flex flex-col gap-3">
              <ModelFormStep />
            </div>
            <HighLightBar />
          </ModelFormProvider>
        </div>
      </div>
    </ModelContextProvider>
  )
}

export default ModelPage



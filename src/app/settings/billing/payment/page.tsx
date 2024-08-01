"use client"
import HighLightBar from '@/components/forms/payment/highlight-bar'
import CreditPaymentStep from '@/components/forms/payment/credit-payment-step'
import SubscriptionPaymentStep from '@/components/forms/payment/subscription-payment-step'
import { usePaymentContextHook } from '@/context/payment-context-provider';

import React from 'react'

type Props = {}

const Payment = (props: Props) => {
  const { paymentType } = usePaymentContextHook();

  return (
    <div className="flex-1 py-4 md:px-4 w-full">
      <div className="flex flex-col h-full gap-3">
        <div className="flex flex-col gap-3">
          {paymentType === "CREDIT" && <CreditPaymentStep />}
          {paymentType === "SUBSCRIPTION" && <SubscriptionPaymentStep />}
        </div>
        <HighLightBar />
      </div>
    </div>
  )
}

export default Payment

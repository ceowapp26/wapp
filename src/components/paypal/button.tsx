import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { PaypalOrderClientProvider, PaypalSubscriptionClientProvider } from "@/providers/paypal-provider";

interface PaypalButtonComponentProps {
  event: { type: string };
  createAction: (data: Record<string, unknown>, actions: any) => Promise<string>;
  onApprove: (data: Record<string, unknown>, actions: any) => Promise<void>;
  onError: (err: Record<string, unknown>) => void;
}

const PaypalButtonComponent: React.FC<PaypalButtonComponentProps> = ({ event, createAction, onApprove, onError }) => {
  if (event.type === "BILLING.PAYMENT.ORDER") {
    return (
      <PaypalOrderClientProvider>
        <PayPalButtons
          createOrder={createAction}
          onApprove={onApprove}
          onError={onError}
        />
      </PaypalOrderClientProvider>
    );
  } else if (event.type === "BILLING.PAYMENT.SUBSCRIPTION") {
    return (
      <PaypalSubscriptionClientProvider>
        <PayPalButtons
          createSubscription={createAction}
          onApprove={onApprove}
          onError={onError}
        />
      </PaypalSubscriptionClientProvider>
    );
  }
  return null;
};

export default PaypalButtonComponent;

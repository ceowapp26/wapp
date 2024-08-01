'use client';
import React from 'react';
import axios from 'axios';
import { getStripe } from '@/utils/getStripe';
import { Button } from '@/components/ui/button';

interface StripeButtonComponentProps {
  event: { type: string };
  createParams: (event: any, options: any) => any;
  onError: () => void;
  options: any;
}

const StripeButtons = ({ event, createParams, onError, options }: StripeButtonComponentProps) => {
  const handleSubmit = async () => {
    const stripe = await getStripe();

    const requestOption = createParams(event, options);

    if (!stripe) {
      return;
    }
    try {
      const response = await axios.post('/api/stripe/checkout', requestOption);
      const data = response.data;
      if (!data.ok) throw new Error('Something went wrong');

      await stripe.redirectToCheckout({
        sessionId: data.result.id
      });
    } catch (error) {
      console.log(error);
      onError();
    }
  };

  return (
    <Button onClick={handleSubmit} className="text-white">
      PURCHASE
    </Button>
  );
};

const StripeButtonComponent: React.FC<StripeButtonComponentProps> = ({ event, createParams, onError, options }) => {
  return (
    <StripeButtons
      event={event}
      createParams={createParams}
      onError={onError}
      options={options}
    />
  );
};

export default StripeButtonComponent;

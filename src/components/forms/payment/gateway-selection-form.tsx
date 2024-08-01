import React from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import PaymentGatewayBanner from './payment-gateway-banner';
import ButtonHandler from './button-handlers';

type Props = {
  register: UseFormRegister<FieldValues>;
  paymentGateway: 'PAYPAL' | 'STRIPE';
  setPaymentGateway: React.Dispatch<React.SetStateAction<'PAYPAL' | 'STRIPE'>>;
};

const GatewaySelectionForm = ({ register, setPaymentGateway, paymentGateway }: Props) => {
  return (
    <>
      <h2 className="text-gravel md:text-4xl font-bold py-2">PAYMENT GATEWAY</h2>
      <p className="text-iridium md:text-sm">
        Choose payment provider that suits you.
      </p>
      <PaymentGatewayBanner
        register={register}
        setPaymentGateway={setPaymentGateway}
        paymentGateway={paymentGateway}
        value="PAYPAL"
        title="Make payment with PAYPAL"
        text="Enjoy advanced features of WApp."
      />
      <PaymentGatewayBanner
        register={register}
        setPaymentGateway={setPaymentGateway}
        paymentGateway={paymentGateway}
        value="STRIPE"
        title="Make payment with STRIPE"
        text="Enjoy advanced features of WApp."
      />
      <ButtonHandler />
    </>
  );
};

export default GatewaySelectionForm;

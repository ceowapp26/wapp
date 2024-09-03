"use client"
import React from 'react';
import OTPInput from '@/components/otp';
import { FieldValues, Control, useFormContext, Controller } from 'react-hook-form';
import ButtonHandler from './button-handlers';

type Props = {
  control: Control<FieldValues, any>;
};

const OTPForm: React.FC<Props> = ({ control }: Props) => {
  return (
    <>
      <h2 className="text-gravel text-center md:text-4xl font-bold">Enter OTP</h2>
      <p className="text-iridium text-center md:text-sm">
        Enter the one time password that was sent to your email.
      </p>
      <div className="w-full text-black justify-center flex py-5">
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <OTPInput 
              value={field.value} 
              onChange={field.onChange} 
              onBlur={field.onBlur} 
            />
          )}
        />
      </div>
      <ButtonHandler />
    </>
  );
};

export default OTPForm;

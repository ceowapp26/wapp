import React, { forwardRef } from 'react';
import { InputOTP, InputOTPSlot } from './ui/input-otp';

type Props = {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  type?: string;
};

const OTPInput = forwardRef<HTMLInputElement, Props>(({ name, value, onChange, onBlur, ...props }, ref) => {
  return (
    <div className="relative w-full py-6 flex justify-center items-center">
      <InputOTP value={value} onChange={onChange} onBlur={onBlur} maxLength={6} {...props} ref={ref}>
        <div className="flex gap-3">
          {[...Array(6)].map((_, index) => (
            <div key={index}>
              <InputOTPSlot index={index} />
            </div>
          ))}
        </div>
      </InputOTP>
    </div>
  );
});

OTPInput.displayName = 'OTPInput';

export default OTPInput;

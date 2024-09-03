import React from 'react';
import { FieldErrors, UseFormSetValue, FieldValues, UseFormRegister, Control } from 'react-hook-form';
import { USER_CREDIT_PURCHASE_FORM } from '@/constants/payments';
import FormGenerator from '../form-generator';
import ButtonHandler from './button-handlers';

type Props = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  control: Control<FieldValues>;
};

function CreditInput({ register, control, errors }: Props) {
  return (
    <React.Fragment>
      {USER_CREDIT_PURCHASE_FORM.map((field) => (
        <FormGenerator
          key={field.id}
          {...field}
          register={register}
          errors={errors}
          control={control}
        />
      ))}
      <ButtonHandler />
    </React.Fragment>
  );
}

export default CreditInput;

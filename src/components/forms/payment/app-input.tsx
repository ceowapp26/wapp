import React from 'react';
import { FieldErrors, UseFormRegister, Control, FieldValues } from 'react-hook-form';
import FormGenerator from '../form-generator';
import ButtonHandler from './button-handlers';
import { APP_PURCHASE_FORM } from "@/constants/payments";

type Props = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  control: Control<FieldValues>;
};

function AppInput({ register, control, errors }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-300">App Purchase Details</h2>
      {APP_PURCHASE_FORM.map((field) => (
        <FormGenerator
          key={field.id}
          {...field}
          register={register}
          errors={errors}
          control={control}
        />
      ))}
      <ButtonHandler />
    </div>
  );
}

export default AppInput;
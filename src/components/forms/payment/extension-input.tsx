import React from 'react';
import { FieldErrors, UseFormRegister, Control, FieldValues } from 'react-hook-form';
import FormGenerator from '../form-generator';
import ButtonHandler from './button-handlers';
import { EXTENSION_PURCHASE_FORM } from "@/constants/payments";

type Props = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  control: Control<FieldValues>;
};

function ExtensionInput({ register, control, errors }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-300">Extension Purchase Details</h2>
      {EXTENSION_PURCHASE_FORM.map((field) => (
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

export default ExtensionInput;



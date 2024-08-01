"use client"
import React, { useEffect } from 'react';
import { FieldErrors, UseFormSetValue, FieldValues, UseFormRegister } from 'react-hook-form';
import { USER_EMAIL_RESET_FORM, USER_PASSWORD_RESET_FORM } from '@/constants/forms';
import { useAuthContextHook } from '@/context/auth-context-provider';
import FormGenerator from '../../form-generator';

type Props = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldErrors>;
  setValue: UseFormSetValue<FieldValues>;
};

function ResetForm({ register, errors, setValue }: Props) {
  const { setAuthType, currentStep } = useAuthContextHook();

  useEffect(() => {
    setAuthType("reset")
  }, [])
  let fields = [];

  switch (currentStep) {
    case 1:
      fields = USER_EMAIL_RESET_FORM;
      break;
    case 2:
      fields = USER_PASSWORD_RESET_FORM;
      break;
    default:
      break;
  }
  return (
    <React.Fragment>
      {fields.map((field) => (
        <FormGenerator
          key={field.id}
          {...field}
          register={register}
          errors={errors}
          setValue={setValue}
        />
      ))}
    </React.Fragment>
  );
}

export default ResetForm;

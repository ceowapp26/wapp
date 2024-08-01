"use client"
import React, { useEffect } from 'react';
import { FieldErrors, UseFormSetValue, FieldValues, UseFormRegister, Control } from 'react-hook-form';
import { USER_EMAIL_WITH_PASSWORD_REGISTRATION_FORM, USER_EMAIL_NO_PASSWORD_REGISTRATION_FORM, USER_PHONE_REGISTRATION_FORM } from '@/constants/forms';
import { useAuthContextHook } from '@/context/auth-context-provider';
import FormGenerator from '../../form-generator';

type Props = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldErrors>;
  control: Control<FieldValues, any>;
};

function RegistrationForm({ register, control, errors }: Props) {
  const { authType, setAuthType, providerType } = useAuthContextHook();
  useEffect(() => {
    setAuthType("sign-up")
  }, [])
  let fields = [];
  switch (providerType) {
    case "email-w-password":
      fields = USER_EMAIL_WITH_PASSWORD_REGISTRATION_FORM;
      break;
    case "email-n-password":
      fields = USER_EMAIL_NO_PASSWORD_REGISTRATION_FORM;
      break;
    case "phone":
      fields = USER_PHONE_REGISTRATION_FORM;
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
          control={control}
        />
      ))}
    </React.Fragment>
  );
}

export default RegistrationForm;

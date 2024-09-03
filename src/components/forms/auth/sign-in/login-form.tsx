'use client'
import React, { useEffect } from 'react'
import { FieldErrors, FieldValues, Control, UseFormSetValue, UseFormRegister } from 'react-hook-form'
import { useAuthContextHook } from '@/context/auth-context-provider'
import { USER_EMAIL_WITH_PASSWORD_LOGIN_FORM, USER_EMAIL_NO_PASSWORD_LOGIN_FORM, USER_PHONE_LOGIN_FORM } from '@/constants/forms'
import FormGenerator from '../../form-generator'

type Props = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  control: Control<FieldValues, any>;
};

const LoginForm = ({ register, control,errors }: Props) => {
  const { providerType, authType, setAuthType } = useAuthContextHook(); 
  
  useEffect(() => {
    setAuthType("sign-in")
  }, [])

  let fields = [];

  switch (providerType) {
    case "email-w-password":
      fields = USER_EMAIL_WITH_PASSWORD_LOGIN_FORM;
      break;
    case "email-n-password":
      fields = USER_EMAIL_NO_PASSWORD_LOGIN_FORM;
      break;
    case "phone":
      fields = USER_PHONE_LOGIN_FORM;
      break;
    default:
      break;
  }

  return (
    <>
      {fields.map((field) => (
        <FormGenerator
          key={field.id}
          {...field}
          register={register}
          errors={errors}
          control={control}
        />
      ))}
    </>
  )
}

export default LoginForm
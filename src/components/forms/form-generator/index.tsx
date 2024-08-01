import React from 'react';
import { type LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorMessage } from '@hookform/error-message';
import { FieldErrors, FieldValues, UseFormRegister, Control, Controller, UseFormSetValue } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import OTPInput from '@/components/otp';

type Props = {
  type: 'text' | 'email' | 'phone' | 'password' | 'otp' | 'number' | 'date';
  inputType: 'select' | 'input' | 'textarea' | 'phone-input';
  options?: { value: string; label: string; id: string }[];
  label?: string;
  placeholder: string;
  register: UseFormRegister<FieldValues>;
  name: string;
  errors: FieldErrors<FieldValues>;
  control: Control<FieldValues, any>;
  setValue: UseFormSetValue<FieldValues>;
  lines?: number;
  form?: string;
  otp?: string;
  defaultValue?: string;
  icon?: LucideIcon;
};

const FormGenerator = ({
  errors,
  inputType,
  name,
  placeholder,
  defaultValue,
  register,
  setValue,
  type,
  form,
  control,
  label,
  lines,
  otp,
  options,
  icon: Icon,
}: Props) => {
  switch (inputType) {
    case 'input':
      return (
        <Label className="flex flex-col gap-2" htmlFor={`input-${name}`}>
          {label && label}
          <div className="relative flex items-center">
            <Input
              id={`input-${name}`}
              type={type}
              placeholder={placeholder}
              form={form}
              defaultValue={defaultValue}
              {...register(name, { required: true, ...(type === 'number' ? { valueAsNumber: true } : {}) })}
              className={Icon ? 'pl-10' : ''}
              readOnly={name === 'modelId'} 
            />
            {Icon && <Icon className="absolute left-3 h-5 w-5 text-gray-400" />}
          </div>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 -mt-6 p-4">{message === 'Required' ? '' : message}</p>
            )}
          />
        </Label>
      );
    case 'date':
      return (
        <Label className="flex flex-col gap-2" htmlFor={`input-${name}`}>
          {label && label}
          <div className="relative flex min-w-[250px] items-center">
            <Input
              id={`input-${name}`}
              type={type}
              placeholder={placeholder}
              form={form}
              defaultValue={defaultValue}
              {...register(name, { required: true })}
              className={Icon ? 'pl-10' : ''}
            />
            {Icon && <Icon className="absolute left-3 h-5 w-5 text-gray-400" />}
          </div>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 -mt-6 p-4">{message === 'Required' ? '' : message}</p>
            )}
          />
        </Label>
      );
    case 'otp':
      return (
        <>
          <h2 className="py-2 text-gravel text-center text-sm font-bold">Enter OTP</h2>
          <Label className="flex flex-col gap-2" htmlFor={`input-${name}`}>
            {label && label}
            <Controller
              control={control}
              name={name}
              defaultValue={defaultValue || ''}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <OTPInput
                  name={name}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  ref={ref}
                />
              )}
            />
            <ErrorMessage
              errors={errors}
              name={name}
              render={({ message }) => (
                <p className="text-red-400 -mt-6 p-4">{message === 'Required' ? '' : message}</p>
              )}
            />
          </Label>
        </>
      );
    case 'phone-input':
      return (
        <>
          <Controller
            control={control}
            name={name}
            defaultValue={defaultValue}
            render={({ field }) => (
              <PhoneInput
                id={`phone-input-${name}`}
                international
                defaultCountry="US"
                placeholder={placeholder}
                value={field.value}
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
          {errors[name] && <p className="text-red-400 mt-2">{errors[name]?.message}</p>}
        </>
      );
    case 'select':
      return (
        <Label className="flex gap-10 p-2 items-center" htmlFor={`select-${name}`}>
          {label && label}
          <select form={form} id={`select-${name}`} {...register(name, { required: true })}>
            {options?.length &&
              options.map((option) => (
                <option value={option.value} key={option.id}>
                  {option.label}
                </option>
              ))}
          </select>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">{message === 'Required' ? '' : message}</p>
            )}
          />
        </Label>
      );
    case 'textarea':
      return (
        <Label className="flex flex-col gap-2" htmlFor={`input-${name}`}>
          {label && label}
          <Textarea
            className="w-full pl-14"
            form={form}
            id={`input-${name}`}
            placeholder={placeholder}
            {...register(name, { required: true })}
            rows={lines}
            defaultValue={defaultValue}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">{message === 'Required' ? '' : message}</p>
            )}
          />
        </Label>
      );
    default:
      return null;
  }
};

export default FormGenerator;

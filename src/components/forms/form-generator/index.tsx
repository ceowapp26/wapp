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
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const inputVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const renderInput = () => {
    switch (inputType) {
      case 'input':
        return (
          <motion.div
            variants={inputVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full"
          >
            <Label className="text-sm font-medium text-gray-700 mb-1" htmlFor={`input-${name}`}>
              {label}
            </Label>
            <div className="relative flex items-center">
              <Input
                id={`input-${name}`}
                type={type}
                placeholder={placeholder}
                form={form}
                defaultValue={defaultValue}
                {...register(name, { required: true, ...(type === 'number' ? { valueAsNumber: true } : {}) })}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  Icon ? 'pl-10' : ''
                }`}
                readOnly={name === 'modelId'}
              />
              {Icon && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icon className="absolute left-3 h-5 w-5 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <ErrorMessage
              errors={errors}
              name={name}
              render={({ message }) => (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {message === 'Required' ? '' : message}
                </motion.p>
              )}
            />
          </motion.div>
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
          <motion.div
            variants={inputVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <h2 className="text-lg font-semibold text-center mb-4">Enter OTP</h2>
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
                  inputClassName="w-12 h-12 text-2xl border-2 border-gray-300 rounded-md mx-1 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
            <ErrorMessage
              errors={errors}
              name={name}
              render={({ message }) => (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-2 text-center"
                >
                  {message === 'Required' ? '' : message}
                </motion.p>
              )}
            />
          </motion.div>
        );

      case 'phone-input':
        return (
          <motion.div
            variants={inputVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <Label className="text-sm font-medium text-gray-700 mb-1" htmlFor={`phone-input-${name}`}>
              {label}
            </Label>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            />
            {errors[name] && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors[name]?.message}
              </motion.p>
            )}
          </motion.div>
        );

      case 'select':
        return (
          <motion.div
            variants={inputVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <Label className="text-sm font-medium text-gray-700 mb-1" htmlFor={`select-${name}`}>
              {label}
            </Label>
            <select
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              form={form}
              id={`select-${name}`}
              {...register(name, { required: true })}
            >
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
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {message === 'Required' ? '' : message}
                </motion.p>
              )}
            />
          </motion.div>
        );

      case 'textarea':
        return (
          <motion.div
            variants={inputVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <Label className="text-sm font-medium text-gray-700 mb-2" htmlFor={`input-${name}`}>
              {label}
            </Label>
            <Textarea
              className="w-full px-4 py-2 border border-gray-300 dark:bg-gray-50 dark:text-gray-800 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
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
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {message === 'Required' ? '' : message}
                </motion.p>
              )}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-6">
      {renderInput()}
    </div>
  );
};

export default FormGenerator;
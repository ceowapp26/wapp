"use client"
import { useFormContext } from 'react-hook-form'
import { UseFormRegister, UseFormWatch, Control, UseFormSetValue, FieldValues, FieldErrors } from 'react-hook-form';
import FormContainer from '../form-container';
import LoginForm from './login-form';
import ButtonHandler from './button-handlers';

type Props = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  control: Control<FieldValues, any>;
};

const LoginFormContainer: React.FC<Props> = ({ register, control, errors }: Props) => {
  return (
    <FormContainer register={register} errors={errors} control={control} authForm={LoginForm} buttonHandler={ButtonHandler} />
  );
};

export default LoginFormContainer;

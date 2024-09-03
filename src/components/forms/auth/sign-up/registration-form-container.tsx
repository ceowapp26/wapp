"use client"
import { UseFormRegister, UseFormWatch, FieldValues, UseFormSetValue, FieldErrors, Control } from 'react-hook-form';
import FormContainer from '../form-container';
import RegistrationForm from './registration-form';
import ButtonHandler from './button-handlers';

type Props = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  control: Control<FieldValues, any>;
};

const RegistrationContainer: React.FC<Props> = ({ register, errors, control }: Props) => (
  <FormContainer register={register} errors={errors} control={control} authForm={RegistrationForm} buttonHandler={ButtonHandler} />
);

export default RegistrationContainer;

"use client"
import ButtonHandler from './button-handlers';
import { UseFormRegister, UseFormWatch, FieldValues, UseFormSetValue, FieldErrors } from 'react-hook-form';
import FormContainer from '../form-container';
import ResetForm from './reset-form';

type Props = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
};

const ResetFormContainer: React.FC<Props> = ({ register, errors }: Props) => (
  <FormContainer register={register} errors={errors} authForm={ResetForm} buttonHandler={ButtonHandler} />
);

export default ResetFormContainer;

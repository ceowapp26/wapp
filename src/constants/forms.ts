"use client";
import { 
  User,
  Mail,
  Lock,
  KeyRound,
  type LucideIcon
} from "lucide-react";

type UserRegistrationProps = {
  id: string
  type: 'email' | 'phone' | 'text' | 'password'| 'otp'
  inputType: 'select' | 'input' | 'phone-input'
  options?: { value: string; label: string; id: string }[]
  label?: string
  placeholder: string
  name: string
  icon?: LucideIcon
  phone?: string
  otp?: string
}

export const USER_EMAIL_WITH_PASSWORD_REGISTRATION_FORM: UserRegistrationProps[] = [
  {
    id: '1',
    inputType: 'input',
    placeholder: 'Fullname',
    name: 'fullname',
    type: 'text',
    icon: User
  },
  {
    id: '2',
    inputType: 'input',
    placeholder: 'Username',
    name: 'username',
    type: 'text',
    icon: User
  },
  {
    id: '3',
    inputType: 'input',
    placeholder: 'Email',
    name: 'email',
    type: 'email',
    icon: Mail
  },
  {
    id: '4',
    inputType: 'input',
    placeholder: 'Password',
    name: 'password',
    type: 'password',
    icon: Lock
  },
  {
    id: '5',
    inputType: 'input',
    placeholder: 'Confirm Password',
    name: 'confirmPassword',
    type: 'password',
    icon: Lock
  },
]

export const USER_EMAIL_NO_PASSWORD_REGISTRATION_FORM: UserRegistrationProps[] = [
  {
    id: '1',
    inputType: 'input',
    placeholder: 'Email',
    name: 'email',
    type: 'email',
    icon: Mail,

  },
]

export const USER_PHONE_REGISTRATION_FORM: UserRegistrationProps[] = [
  {
    id: '3',
    inputType: 'phone-input',
    placeholder: 'Enter phone',
    name: 'phone',
    type: 'phone',
  },
]

export const USER_EMAIL_WITH_PASSWORD_LOGIN_FORM: UserRegistrationProps[] = [
  {
    id: '1',
    inputType: 'input',
    placeholder: 'Enter your email',
    name: 'email',
    type: 'email',
    icon: Mail
  },
  {
    id: '2',
    inputType: 'input',
    placeholder: 'Password',
    name: 'password',
    type: 'password',
    icon: KeyRound
  },
]

export const USER_EMAIL_NO_PASSWORD_LOGIN_FORM: UserRegistrationProps[] = [
  {
    id: '1',
    inputType: 'input',
    placeholder: 'Enter your email',
    name: 'email',
    type: 'email',
    icon: Mail
  },
]

export const USER_PHONE_LOGIN_FORM: UserRegistrationProps[] = [
  {
    id: '1',
    inputType: 'phone-input',
    placeholder: 'Enter phone',
    name: 'phone',
    type: 'phone',
  },
]

export const USER_EMAIL_RESET_FORM: UserRegistrationProps[] = [
  {
    id: '1',
    inputType: 'input',
    placeholder: 'Email',
    name: 'email',
    type: 'email',
    icon: Mail,

  },
]

export const USER_PASSWORD_RESET_FORM: UserRegistrationProps[] = [
  {
    id: '1',
    inputType: 'input',
    placeholder: 'Password',
    name: 'password',
    type: 'password',
    icon: Lock
  },
  {
    id: '2',
    inputType: 'input',
    placeholder: 'Confirm Password',
    name: 'confirmPassword',
    type: 'password',
    icon: Lock
  },
  {
    id: '3',
    inputType: 'otp',
    placeholder: 'OTP',
    name: 'otp',
    type: 'otp',
    icon: Lock
  },
]


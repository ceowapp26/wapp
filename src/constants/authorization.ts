"use client";
import { 
  Phone,
  Mail,
  type LucideIcon
} from "lucide-react";

export const roles = ["org:admin", "org:member", "org:user"];
export const defaultRole = "user";
export const defaultOTP = "111111";

export type AuthProviderProps = {
  id: string;
  provider: string;
  name: string;
  logo?: string;
  icon?: LucideIcon;
};

export const AUTH_PROVIDER_LIST: AuthProviderProps[] = [
  {
    id: '1',
    provider: 'microsoft',
    name: 'Microsoft',
    logo: '/global/auth_logos/logo_microsoft.png'
  },
  {
    id: '2',
    provider: 'google',
    name: 'Google',
    logo: '/global/auth_logos/logo_google.png'
  },
  {
    id: '3',
    provider: 'github',
    name: 'Github',
    logo: '/global/auth_logos/logo_github.png'
  },
  { 
    id: '4',
    provider: 'phone',
    name: 'Phone',
    icon: Phone
  },
  { 
    id: '5',
    provider: 'email-n-password',
    name: 'Mail',
    icon: Mail
  },
];
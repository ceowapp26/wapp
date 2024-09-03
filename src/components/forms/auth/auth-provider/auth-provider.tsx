'use client'
import React from 'react';
import { AuthProviderProps } from "@/constants/auth-providers";
import useAuthProvider from '@/hooks/use-auth-provider';

const AuthProvider = ({ provider, name, logo, icon: Icon }: AuthProviderProps) => {
  const { handleOAuthSignIn, loading } = useAuthProvider(provider);

  return (
    <a
      onClick={handleOAuthSignIn}
      className="flex flex-col items-center justify-center w-16"
      data-kr-interactive="true"
      rel="noopener"
    >
      <div className={`flex items-center justify-center p-2 w-12 h-12 border border-gray-400 hover:bg-gray-100 rounded-md cursor-pointer transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {logo && <img src={logo} alt={`${name} logo`} />}
        {Icon && <Icon color="#212F3C" />}
      </div>
      <div className="mt-2 text-sm font-medium text-gray-700">{name}</div>
    </a>
  );
};

export default AuthProvider;

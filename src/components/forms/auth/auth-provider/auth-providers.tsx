import { AUTH_PROVIDER_LIST } from '@/constants/authorization';
import { useAuthContextHook } from '@/context/auth-context-provider';
import AuthProvider from './auth-provider';

function AuthProviders() {
  const { providerType } = useAuthContextHook();

  const filteredProviders = providerType.includes("email-n-password")
    ? AUTH_PROVIDER_LIST.filter(field => field.provider !== "email-n-password")
    : AUTH_PROVIDER_LIST.filter(field => field.provider !== "phone");

  return (
    <div className="flex flex-row items-center justify-between px-2 mobileS:p-0 w-full">
      {filteredProviders.map((field) => (
        <AuthProvider
          key={field.id}
          {...field}
        />
      ))}
    </div>
  );
}

export default AuthProviders;



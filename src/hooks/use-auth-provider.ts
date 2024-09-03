import { useEffect, useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import { OAuthStrategy } from '@clerk/types';
import { useAuthContextHook } from '@/context/auth-context-provider';

const useAuthProvider = (provider: string) => {
  const { providerType, setProviderType, authLoading, setAuthLoading } = useAuthContextHook();
  const [nextAction, setNextAction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useSignIn();
  const { signUp, setActive } = useSignUp();

  const handleOAuthSignIn = () => {
    setNextAction(provider);
    setProviderType(provider)
  };

  const signInWith = (strategy: OAuthStrategy) => {
    return signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: '/auth/sign-up/sso-callback',
      redirectUrlComplete: '/home',
    });
  };

  const handleSignIn = async (strategy: OAuthStrategy) => {
    setLoading(true);
    setAuthLoading(true);
    if (!signIn || !signUp) return null;

    const userExistsButNeedsToSignIn =
      signUp?.verifications.externalAccount.status === 'transferable' &&
      signUp.verifications.externalAccount.error?.code === 'external_account_exists';

    const userNeedsToBeCreated = signIn?.firstFactorVerification.status === 'transferable';

    if (userExistsButNeedsToSignIn) {
      const res = await signIn.create({ transfer: true });
      if (res.status === 'complete') {
        setActive({ session: res.createdSessionId });
      }
    } else if (userNeedsToBeCreated) {
      const res = await signUp.create({ transfer: true });
      if (res.status === 'complete') {
        setActive({ session: res.createdSessionId });
      }
    } else {
      signInWith(strategy);
    }
    setLoading(false);
    setAuthLoading(false);
  };

  useEffect(() => {
    if (nextAction) {
      if (providerType.includes("mail")) {
        setProviderType("email-n-password");
        setProviderType("phone");
      } else if (providerType.includes("phone")) {
        setProviderType("email-n-password");
      } else {
        const authenticate = async () => {
          try {
            await handleSignIn(`oauth_${nextAction}` as OAuthStrategy);
          } catch (error) {
            console.error(`Error signing in with ${nextAction}:`, error);
          }
        };
        authenticate();
      }
    }
  }, [nextAction, providerType]);

  return {
    handleOAuthSignIn,
    loading,
  };
};

export default useAuthProvider;

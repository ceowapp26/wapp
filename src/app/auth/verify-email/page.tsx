'use client';
import { useState, useEffect } from 'react';
import { useClerk } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, ArrowLeft, Home, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState("loading");
  const { handleEmailLinkVerification } = useClerk();
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    async function verify() {
      try {
        await handleEmailLinkVerification({
          redirectUrl: "https://wapp-pi.vercel.app/auth/sign-in",
          redirectUrlComplete: "https://wapp-pi.vercel.app/home",
        });
        setVerificationStatus("verified");
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          router.push("/home");
        }, 5000);
      } catch (err) {
        setVerificationStatus(err.code === "expired" ? "expired" : "failed");
      }
    }
    verify();
  }, [handleEmailLinkVerification, router]);

  useEffect(() => {
    if (verificationStatus === 'verified') {
      localStorage.removeItem('tempEmail');
      localStorage.removeItem('email');
    }
  }, [verificationStatus]);

  const handleRedirectSignup = () => {
    router.push("/auth/sign-up");
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">Verifying your email...</p>
          </motion.div>
        );
      case "failed":
      case "expired":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
          >
            <div className="flex flex-col items-center mb-6">
              <AlertCircle className="text-red-500 w-16 h-16 mb-4" />
              <h1 className="text-2xl font-bold text-gray-800">
                {verificationStatus === "failed" ? "Verification Failed" : "Link Expired"}
              </h1>
            </div>
            <p className="text-gray-600 text-center mb-8">
              {verificationStatus === "failed" 
                ? "We couldn't verify your email. Please try signing up again."
                : "The verification link has expired. Please request a new one."
              }
            </p>
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
                onClick={handleRedirectSignup}
              >
                <ArrowLeft className="mr-2" size={18} />
                Try Again
              </motion.button>
            </div>
          </motion.div>
        );
      case "verified":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
          >
            <div className="flex flex-col items-center mb-6">
              <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
              <h1 className="text-2xl font-bold text-gray-800">Email Verified!</h1>
            </div>
            <p className="text-gray-600 text-center mb-8">
              Welcome to WApp! You're all set to start your journey with us.
            </p>
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
                onClick={() => router.push("/home")}
              >
                <Home className="mr-2" size={18} />
                Go to Home
              </motion.button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={verificationStatus}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EmailVerification;
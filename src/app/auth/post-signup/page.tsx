"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useSignInForm } from '@/hooks/use-sign-in';
import { useAuthContextHook } from '@/context/auth-context-provider';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

const PostSignIn = () => {
  const { setCurrentStep } = useAuthContextHook();
  const router = useRouter();
  const { methods, onHandleSubmit, loading } = useSignInForm();
  const registeredEmail = localStorage.getItem("tempEmail");

  const handleRedirectSignup = () => { 
    setCurrentStep(2);
    router.push("/auth/sign-up");
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
          className="flex justify-center mb-6"
        >
          <Mail className="text-blue-500 w-16 h-16" />
        </motion.div>

        <h1 className="text-3xl text-center text-gray-800 font-bold mb-6">Check Your Email</h1>

        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="flex justify-center"
          >
            <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full"></div>
          </motion.div>
        ) : (
          <>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 text-center mb-6"
            >
              We've sent a link to <span className="font-semibold text-blue-600">{registeredEmail}</span>
            </motion.p>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 mb-8 space-y-2"
            >
              <li className="flex items-center">
                <CheckCircle className="text-green-500 mr-2 w-5 h-5" />
                Follow the link in your email to finish signing up.
              </li>
              <li className="flex items-center">
                <CheckCircle className="text-green-500 mr-2 w-5 h-5" />
                If you haven't received it within a few minutes, check your spam folder.
              </li>
            </motion.ul>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center"
            >
              <Button
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full flex items-center transition-colors duration-300"
                onClick={handleRedirectSignup}
              >
                <ArrowLeft className="mr-2" />
                Back to Sign Up
              </Button>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PostSignIn;
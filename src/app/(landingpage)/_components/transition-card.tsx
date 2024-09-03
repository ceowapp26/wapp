"use client";
import React from 'react';
import { motion } from 'framer-motion';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EntangledStringEffect from './entangled-string-effect';

const TransitionCard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden rounded-b-3xl bg-black dark:bg-white/80"
    >
      <EntangledStringEffect />
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8, type: "spring" }}
        className="absolute flex flex-col items-center justify-center backdrop-blur-xl rounded-2xl bg-white bg-opacity-10 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 h-auto aspect-square max-h-[80vh] p-6 shadow-2xl border border-white border-opacity-20"
      >
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="text-center text-white dark:text-black text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
        >
          AI-Empowered
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.5 }}
          className="text-center text-white dark:text-black text-lg sm:text-xl md:text-2xl mb-6"
        >
          Unleash the power of artificial intelligence
        </motion.p>
        <motion.a
          href="/auth/sign-up"
          initial={{ scale: 0.95, boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)" }}
          animate={{ 
            scale: 1, 
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
            transition: { duration: 0.3 }
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-8 rounded-full cursor-pointer transition-all duration-300 text-lg sm:text-xl md:text-2xl inline-block no-underline"
        >
          <motion.span
            className="absolute inset-0 bg-white"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 2, opacity: 0.1 }}
            transition={{ duration: 0.4 }}
          />
          <motion.span
            className="relative z-10 flex items-center justify-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <span className="mr-2">Sign Up Now</span>
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              className="w-6 h-6"
              initial={{ x: -5, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </motion.svg>
          </motion.span>
        </motion.a>      
        </motion.div>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8, type: "spring" }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <ArrowDownwardIcon className="text-white dark:text-black text-3xl sm:text-4xl animate-bounce" />
      </motion.div>
    </motion.div>
  );
};

export default TransitionCard;





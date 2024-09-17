import React from 'react';
import { usePortalStore } from '@/stores/features/apps/document/store';
import { motion } from 'framer-motion';

const StopGeneratingButton = () => {
  const setGenerating = usePortalStore((state) => state.setGenerating);
  const generating = usePortalStore((state) => state.generating);
  if (!generating) return null;

  return (
    <motion.div
      className="absolute bottom-20 w-full flex justify-center items-center z-50"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      <motion.button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
        onClick={() => setGenerating(false)}
        whileTap={{ scale: 0.95 }}
        aria-label="Stop generating"
      >
        <motion.svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        </motion.svg>
        <span className="text-lg">Stop Generating</span>
      </motion.button>
    </motion.div>
  );
};

export default StopGeneratingButton;
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

const ErrorContainer = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="relative w-3/5 mt-3 max-md:w-11/12 overflow-hidden"
      >
        <motion.div
          className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg shadow-lg p-4"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div className="ml-3 w-full pr-8">
              <h3 className="text-sm font-medium text-white">Error</h3>
              <div className="mt-2 text-sm text-white/90">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="whitespace-pre-wrap"
                >
                  {error}
                </motion.p>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-red-100"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorContainer;
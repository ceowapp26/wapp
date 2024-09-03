import React from 'react';
import { motion } from 'framer-motion';
import ArrowBottom from '@/icons/ArrowBottom';
import { useDocumentStore } from '@/stores/features/apps/document/store';

const CollapseOptions = () => {
  const setHideMenuOptions = useDocumentStore((state) => state.setHideMenuOptions);
  const hideMenuOptions = useDocumentStore((state) => state.hideMenuOptions);

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.button
        className={`
          flex items-center justify-center
          px-6 py-2 h-3 w-full
          bg-gray-200
          rounded-md
          text-white font-semibold
          shadow-md hover:shadow-lg
          transition-all duration-300 ease-in-out
        `}
        onClick={() => setHideMenuOptions(!hideMenuOptions)}
        animate={{
          backgroundColor: hideMenuOptions ? '#4B5563' : '#64748b',
        }}
      >
        <motion.div
          animate={{ rotate: hideMenuOptions ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowBottom className="h-4 w-4 text-white" />
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default CollapseOptions;
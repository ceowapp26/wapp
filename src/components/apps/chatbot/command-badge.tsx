import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Check } from 'lucide-react';

const CommandBadge = ({ command }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative inline-block">
      <motion.div
        className="relative rounded-lg flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 max-w-20 h-10 truncate px-3 py-1 font-semibold text-white shadow-lg hover:shadow-xl cursor-pointer group overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.span
          className="inline-block truncate max-w-full"
          animate={{ opacity: isCopied ? 0.5 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {command}
        </motion.span>
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isCopied ? 1 : 0, opacity: isCopied ? 0.2 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
      <AnimatePresence>
        {isCopied && (
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white rounded-full p-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Check size={16} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommandBadge;
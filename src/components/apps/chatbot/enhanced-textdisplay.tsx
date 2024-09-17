import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Tooltip } from "@nextui-org/react";
import { Loader2 } from 'lucide-react'; // Ensure you have this import for the loader icon

const EnhancedTextDisplay = ({ generating, content, role, messageIndex, lastMessageIndex }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg"
    >
      <div className="p-4">
        {generating && role === 'assistant' && messageIndex === lastMessageIndex && <AIRespondingIndicator />}
        <motion.div 
          variants={childVariants}
          className={`whitespace-pre-wrap break-words text-gray-700 dark:text-gray-300 ${isExpanded ? '' : 'max-h-40 overflow-hidden'}`}
          ref={contentRef}
        >
          {content}
        </motion.div>
        {contentRef.current && contentRef.current.scrollHeight > 160 && (
          <motion.button
            variants={childVariants}
            onClick={toggleExpand}
            className="mt-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none transition-colors duration-200"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </motion.button>
        )}
      </div>
      <motion.div 
        variants={childVariants}
        className="flex justify-end items-center bg-gray-100 dark:bg-gray-700 px-4 py-2"
      >
        <Tooltip content={isCopied ? "Copied!" : "Copy text"}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="text-sm bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </motion.button>
        </Tooltip>
      </motion.div>
    </motion.div>
  );
};

const AIRespondingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center space-x-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 shadow-lg"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-6 h-6 text-white" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-white font-semibold"
      >
        AI is thinking...
      </motion.div>
      <motion.div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-white rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default EnhancedTextDisplay;
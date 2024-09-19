import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ChevronDown, ChevronUp } from 'lucide-react';

const CustomLiveError = ({ errorType, errorContent }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const getErrorTypeDetails = (type) => {
    switch (type) {
      case 'unsupportedLibraries':
        return {
          title: 'Unsupported Libraries Detected',
          color: 'bg-yellow-100 border-yellow-400 text-yellow-700',
          icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
        };
      case 'syntaxError':
        return {
          title: 'Syntax Error',
          color: 'bg-red-100 border-red-400 text-red-700',
          icon: <X className="w-5 h-5 text-red-400" />,
        };
      default:
        return {
          title: 'Error',
          color: 'bg-red-100 border-red-400 text-red-700',
          icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
        };
    }
  };

  const { title, color, icon } = getErrorTypeDetails(errorType);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-md border ${color} p-4 my-4`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {icon}
          <h3 className="ml-2 text-lg font-semibold">{title}</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2"
          >
            {Array.isArray(errorContent) ? (
              <ul className="list-disc list-inside">
                {errorContent.map((error, index) => (
                  <li key={index} className="mt-1">{error}</li>
                ))}
              </ul>
            ) : (
              <p>{errorContent}</p>
            )}
            <p className="mt-2 text-sm">
              The code itself may still be valid and functional. However, due to the issues mentioned above, 
              we are unable to render or execute it in this environment.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CustomLiveError;
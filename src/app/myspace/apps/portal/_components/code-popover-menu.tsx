import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from "@/lib/utils";

const CodePopoverMenu = ({ isCodeSelected, popoverPosition, options }) => {
  return (
    <TooltipProvider>
      <AnimatePresence>
        {isCodeSelected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50"
            style={{ top: `${popoverPosition.top}px`, left: `${popoverPosition.left}px` }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border border-gray-200 dark:border-gray-700">
              <div className="flex space-x-1">
                {options.map((option, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={option.action}
                        className={cn(
                          "p-2 rounded-md transition-colors duration-200",
                          "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600",
                          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                        )}
                      >
                        <span className="sr-only">{option.label}</span>
                        {React.cloneElement(option.icon, { 
                          className: "w-5 h-5 text-gray-600 dark:text-gray-300" 
                        })}
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{option.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
};

export default CodePopoverMenu;
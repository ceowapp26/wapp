"use client";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@nextui-org/react";
import { motion, AnimatePresence } from 'framer-motion';

export const CodePopoverMenu = ({ isCodeSelected, popoverPosition, options }) => {
  return (
    <AnimatePresence>
      {isCodeSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute z-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
          style={{ top: `${popoverPosition.top}px`, left: `${popoverPosition.left}px` }}
        >
          <div className="p-2 flex space-x-2">
            {options.map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  auto
                  light
                  color="primary"
                  icon={option.icon}
                  onClick={option.action}
                  className="mb-2 transition-all duration-200 ease-in-out hover:bg-primary-100 dark:hover:bg-primary-800"
                >
                  {option.label}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
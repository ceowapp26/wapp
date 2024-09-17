import React from 'react';
import { motion } from 'framer-motion';
import { Button, Tooltip } from '@nextui-org/react';

const EditorOptionsMenu = ({ options }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="absolute z-50 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg p-2 border border-gray-700"
    >
      <div className="flex space-x-2">
        {options.map((option) => (
          <Tooltip key={option.id} content={option.label} placement="right">
            <Button
              color={option.color}
              variant="shadow"
              size="sm"
              isIconOnly
              aria-label={option.label}
              className="w-10 h-10 transition-all duration-200 hover:scale-105"
              onClick={option.action}
            >
              <option.icon size={20} />
            </Button>
          </Tooltip>
        ))}
      </div>
    </motion.div>
  );
};

export default EditorOptionsMenu;


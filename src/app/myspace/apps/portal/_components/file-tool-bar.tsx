import React, { useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Tooltip,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { FiEye, FiPlus, FiRefreshCw, FiMoreVertical } from "react-icons/fi";
import { FileInterface } from "@/types/chat";

interface FileToolbarProps {
  onAction: (action: 'view' | 'insert' | 'replace') => void;
  children: React.ReactNode;
}

const FileToolbar: React.FC<FileToolbarProps> = ({ onAction, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const buttonVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    tap: { scale: 0.95 },
  };

  const ActionButton = ({ icon, color, label, action }) => (
    <Tooltip content={label} placement="right">
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        whileHover={{ scale: 1.05 }}
      >
        <Button
          light
          color={color}
          auto
          icon={icon}
          className="mb-2 w-full transition-all duration-200 ease-in-out"
          onClick={() => {
            onAction(action);
            setIsOpen(false);
          }}
        >
          {label}
        </Button>
      </motion.div>
    </Tooltip>
  );

  return (
    <Popover
      placement="right"
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>
        {children}
      </PopoverTrigger>
      <PopoverContent>
        <motion.div
          className="p-2 bg-white rounded-lg shadow-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <ActionButton
            icon={<FiEye className="text-blue-500" />}
            color="primary"
            label="View"
            action="view"
          />
          <ActionButton
            icon={<FiPlus className="text-green-500" />}
            color="success"
            label="Insert"
            action="insert"
          />
          <ActionButton
            icon={<FiRefreshCw className="text-yellow-500" />}
            color="warning"
            label="Replace"
            action="replace"
          />
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

export default FileToolbar;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { File, Copy, Check } from 'lucide-react';
import { FileInterface } from "@/types/chat";
import { usePortalStore } from '@/stores/features/apps/portal/store';

interface EmbbedFileBlockProps {
  lang: string;
  codeChildren: React.ReactNode;
  setCurrentEmbbedFile?: React.Dispatch<React.SetStateAction<FileInterface | null>>;
  setCurrentComponent?: React.Dispatch<React.SetStateAction<string>>;
}

const EmbbedFileBlock = ({ lang, codeChildren, setCurrentEmbbedFile, setCurrentComponent }: EmbbedFileBlockProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const codeString = React.Children.toArray(codeChildren).join('\n');
  const filename = codeString.slice(0, codeString.indexOf('\n')).trim();
  const codeContent = codeString.slice(codeString.indexOf('\n')).trim();
  const newFile: FileInterface = { [filename]: codeContent };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClickFile = () => {
    if (setCurrentEmbbedFile) {
      setCurrentComponent("")
      setCurrentEmbbedFile(newFile);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-4 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div 
        className="bg-gray-100 dark:bg-gray-800 p-4 flex items-center justify-between cursor-pointer"
        onClick={handleClickFile}
      >
        <div className="flex items-center space-x-3">
          <File className="w-5 h-5 text-blue-500" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {lang.charAt(0).toUpperCase() + lang.slice(1)} File
          </span>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {filename}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EmbbedFileBlock;

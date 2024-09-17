import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { File, Copy, Check } from 'lucide-react';
import { usePortalStore } from '@/stores/features/apps/portal/store';
import { CodeFile } from '@/types/code';
import { debounce } from 'lodash';
import { Role } from '@/types/chat';

interface CodeFileBlockProps {
  messageIndex?: number;
  lastMessageIndex?: number;
  role: Role;
  lang: string;
  codeChildren: React.ReactNode;
  currentCodeFile?: CodeFile;
  setCurrentCodeFile?: React.Dispatch<React.SetStateAction<CodeFile | null>>;
  setCurrentComponent?: React.Dispatch<React.SetStateAction<string>>;
}

const CodeFileBlock = ({ lang, messageIndex, lastMessageIndex, role, codeChildren, currentCodeFile, setCurrentCodeFile, setCurrentComponent }: CodeFileBlockProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const [codeString, setCodeString] = useState('');

  // Debounced function to update codeString
  const updateCodeString = useCallback(
    debounce((newCodeString: string) => {
      setCodeString(newCodeString);
    }, 300),
    []
  );

  useEffect(() => {
    if (codeRef.current) {
      const newCodeString = codeRef.current.textContent || '';
      updateCodeString(newCodeString);
    }
  }, [codeChildren, updateCodeString]);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClickFile = () => {
    const filenameIndex = codeString.indexOf('\n');
    const filename = filenameIndex !== -1 ? codeString.slice(0, filenameIndex).trim() : 'Untitled';
    const newFile: CodeFile = { [filename]: codeString };
    setCurrentComponent?.(null);
    setCurrentCodeFile?.(newFile);
  };

  useEffect(() => {
    if (!currentCodeFile && codeString && usePortalStore.getState().codeGenerator && role === 'assistant' && messageIndex === lastMessageIndex) {
      const tempFiles: CodeFile[] = [];
      const filenameIndex = codeString.indexOf('\n');
      const filename = filenameIndex !== -1 ? codeString.slice(0, filenameIndex).trim() : 'Untitled';
      const newFile: CodeFile = { [filename]: codeString };
      tempFiles.push(newFile);
      setCurrentCodeFile?.(tempFiles[tempFiles.length - 1]);
      return;
    }
  }, [codeString, role, messageIndex, lastMessageIndex, setCurrentCodeFile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-4 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <pre
        ref={codeRef}
        className="p-4 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 bg-gray-50 dark:bg-gray-900 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
      >
        <code className={`!whitespace-pre language-${lang} hljs`}>{codeChildren}</code>
      </pre>
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
            {codeString.slice(0, codeString.indexOf('\n')).trim() || 'Untitled'}
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

export default CodeFileBlock;
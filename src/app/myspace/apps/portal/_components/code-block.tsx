import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Check, Copy, Code2, Download, Share2, Play, ChevronDown, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Replace } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';

const CodeBlock = ({
  lang,
  codeChildren,
  onApply,
  handleReplaceCode,
  handleInsertLeftCode,
  handleInsertAboveCode,
  handleInsertBelowCode,
  handleInsertRightCode,
}: {
  lang: string;
  codeChildren: React.ReactNode & React.ReactNode[];
  onApply?: (code: string) => void;
  handleReplaceCode?: (content: string) => void;
  handleInsertAboveCode?: (content: string) => void;
  handleInsertBelowCode?: (content: string) => void;
  handleInsertLeftCode?: (content: string) => void;
  handleInsertRightCode?: (content: string) => void;
}) => {
  const codeRef = useRef<HTMLPreElement>(null);
  const [codeString, setCodeString] = useState('');

  useEffect(() => {
    if (codeRef.current) {
      setCodeString(codeRef.current.textContent || '');
    }
  }, [codeChildren]);

  const onReplace = useCallback(() => {
    if (handleReplaceCode) {
      handleReplaceCode(codeString);
    }
  }, [handleReplaceCode, codeString]);

  const onInsertAbove = useCallback(() => {
    if (handleInsertAboveCode) {
      handleInsertAboveCode(codeString);
    }
  }, [handleInsertAboveCode, codeString]);

  const onInsertBelow = useCallback(() => {
    if (handleInsertBelowCode) {
      handleInsertBelowCode(codeString);
    }
  }, [handleInsertBelowCode, codeString]);

  const onInsertLeft = useCallback(() => {
    if (handleInsertLeftCode) {
      handleInsertLeftCode(codeString);
    }
  }, [handleInsertLeftCode, codeString]);

  const onInsertRight = useCallback(() => {
    if (handleInsertRightCode) {
      handleInsertRightCode(codeString);
    }
  }, [handleInsertRightCode, codeString]);

  return (
    <div className="my-6 rounded-lg overflow-hidden shadow-lg hover:shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-2xl">
      <CodeBar
        lang={lang}
        codeString={codeString}
        onApply={onApply}
        onReplace={onReplace}
        onInsertAbove={onInsertAbove}
        onInsertBelow={onInsertBelow}
        onInsertLeft={onInsertLeft}
        onInsertRight={onInsertRight}
      />
      <pre
        ref={codeRef}
        className="p-4 overflow-auto text-sm leading-relaxed scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 bg-gray-50 dark:bg-gray-900 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
      >
        <code className={`!whitespace-pre language-${lang} hljs`}>{codeChildren}</code>
      </pre>
    </div>
  );
};

const CodeBar = React.memo(({
  lang,
  codeString,
  onApply,
  onReplace,
  onInsertAbove,
  onInsertBelow,
  onInsertLeft,
  onInsertRight,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isInsertOpen, setIsInsertOpen] = useState(false);

  const handleCopy = async () => {
    if (codeString) {
      await navigator.clipboard.writeText(codeString);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([codeString], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `code.${lang}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePublish = () => {
    setIsPublished(true);
    setTimeout(() => setIsPublished(false), 2000);
  };

  const handleApply = () => {
    if (onApply) {
      onApply(codeString);
      setIsApplied(true);
      setTimeout(() => setIsApplied(false), 2000);
    }
  };

  const insertOptions = [
    { label: 'Replace', icon: Replace, action: onReplace },
    { label: 'Insert Above', icon: ArrowUp, action: onInsertAbove },
    { label: 'Insert Below', icon: ArrowDown, action: onInsertBelow },
    { label: 'Insert Left', icon: ArrowLeft, action: onInsertLeft },
    { label: 'Insert Right', icon: ArrowRight, action: onInsertRight },
  ];

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center space-x-2">
        <Code2 size={18} className="text-blue-500 dark:text-blue-400" />
        <span className="font-mono text-sm font-medium text-gray-700 dark:text-gray-300">
          {lang}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <ActionButton
          tooltip="Copy code"
          onClick={handleCopy}
          icon={isCopied ? Check : Copy}
          isActive={isCopied}
        />
        <ActionButton
          tooltip="Download code"
          onClick={handleDownload}
          icon={Download}
        />
        <ActionButton
          tooltip="Publish code"
          onClick={handlePublish}
          icon={isPublished ? Check : Share2}
          isActive={isPublished}
        />
        <ActionButton
          tooltip="Apply code"
          onClick={handleApply}
          icon={isApplied ? Check : Play}
          isActive={isApplied}
          disabled={!onApply}
        />
        <Popover placement="bottom-end" isOpen={isInsertOpen} onOpenChange={setIsInsertOpen}>
          <PopoverTrigger>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                isInsertOpen
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => setIsInsertOpen(true)}
            >
              <ChevronDown size={16} className={isInsertOpen ? 'text-white' : ''} />
            </motion.button>
          </PopoverTrigger>
          <PopoverContent>
            <AnimatePresence>
              {isInsertOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                >
                  {insertOptions.map((option, index) => (
                    <motion.button
                      key={option.label}
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsInsertOpen(false);
                        option.action();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <option.icon size={16} className="mr-2" />
                      {option.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
});

const ActionButton = ({ tooltip, onClick, icon: Icon, isActive, disabled }) => (
  <Tooltip content={tooltip}>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
        isActive
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon size={16} className={isActive ? 'text-white' : ''} />
    </motion.button>
  </Tooltip>
);

export default CodeBlock;


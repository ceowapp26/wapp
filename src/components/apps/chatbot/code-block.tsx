import React, { useState, useRef, useEffect } from 'react';
import { Check, Copy, Code2, Download, Share2, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip } from '@nextui-org/react';

const CodeBlock = ({
  lang,
  codeChildren,
  onApply,
}: {
  lang: string;
  codeChildren: React.ReactNode & React.ReactNode[];
  onApply?: (code: string) => void;
}) => {
  const codeRef = useRef<HTMLPreElement>(null);
  const [codeString, setCodeString] = useState('');

  useEffect(() => {
    if (codeRef.current) {
      setCodeString(codeRef.current.textContent || '');
    }
  }, [codeChildren]);

  return (
    <div className="my-6 rounded-lg overflow-hidden shadow-lg hover:shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-2xl">
      <CodeBar lang={lang} codeString={codeString} onApply={onApply} />
      <pre
        ref={codeRef}
        className="p-4 overflow-auto text-sm leading-relaxed scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 bg-gray-50 dark:bg-gray-900 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
      >
        <code className={`!whitespace-pre language-${lang} hljs`}>{codeChildren}</code>
      </pre>
    </div>
  );
};

const CodeBar = React.memo(
  ({
    lang,
    codeString,
    onApply,
  }: {
    lang: string;
    codeString: string;
    onApply?: (code: string) => void;
  }) => {
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [isPublished, setIsPublished] = useState<boolean>(false);
    const [isApplied, setIsApplied] = useState<boolean>(false);

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
      // Implement your publish logic here
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

    return (
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Code2 size={16} className="text-blue-500 dark:text-blue-400" />
          <span className="font-mono text-sm font-medium text-gray-600 dark:text-gray-300">
            {lang}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Tooltip content="Copy code">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 bg-gray-200 dark:bg-gray-700 rounded-full"
              onClick={handleCopy}
            >
              {isCopied ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Copy size={16} />
              )}
            </motion.button>
          </Tooltip>
          <Tooltip content="Download code">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 bg-gray-200 dark:bg-gray-700 rounded-full"
              onClick={handleDownload}
            >
              <Download size={16} />
            </motion.button>
          </Tooltip>
          <Tooltip content="Publish code">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 bg-gray-200 dark:bg-gray-700 rounded-full"
              onClick={handlePublish}
            >
              {isPublished ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Share2 size={16} />
              )}
            </motion.button>
          </Tooltip>
          <Tooltip content="Apply code">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 bg-gray-200 dark:bg-gray-700 rounded-full"
              onClick={handleApply}
              disabled={!onApply}
            >
              {isApplied ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Play size={16} />
              )}
            </motion.button>
          </Tooltip>
        </div>
      </div>
    );
  }
);

export default CodeBlock;
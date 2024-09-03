import React, { useState, useRef, useEffect } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CodeBlock = ({
  lang,
  codeChildren,
}: {
  lang: string;
  codeChildren: React.ReactNode & React.ReactNode[];
}) => {
  const codeRef = useRef<HTMLPreElement>(null);
  const [codeString, setCodeString] = useState('');

  useEffect(() => {
    if (codeRef.current) {
      setCodeString(codeRef.current.textContent || '');
    }
  }, [codeChildren]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-6 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-2xl px-4"
    >
      <CodeBar lang={lang} codeString={codeString} />
      <pre
        ref={codeRef}
        className="p-4 overflow-auto text-sm leading-relaxed scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 bg-gray-50 dark:bg-gray-900 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
      >
        <code className={`!whitespace-pre language-${lang} hljs`}>{codeChildren}</code>
      </pre>
    </motion.div>
  );
};

const CodeBar = React.memo(
  ({
    lang,
    codeString,
  }: {
    lang: string;
    codeString: string;
  }) => {
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const handleCopy = async () => {
      if (codeString) {
        await navigator.clipboard.writeText(codeString);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
          onClick={handleCopy}
        >
          {isCopied ? (
            <Check size={16} className="text-green-500" />
          ) : (
            <Copy size={16} />
          )}
          <span>{isCopied ? 'Copied!' : 'Copy code'}</span>
        </motion.button>
      </div>
    );
  }
);

export default CodeBlock;
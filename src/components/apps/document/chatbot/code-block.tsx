import React, { useState, useEffect } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const CodeBlock = ({
  lang,
  codeChildren,
}: {
  lang: string;
  codeChildren: React.ReactNode & React.ReactNode[];
}) => {
  const [codeString, setCodeString] = useState('');

  useEffect(() => {
    if (Array.isArray(codeChildren)) {
      const processedCode = codeChildren.map(child => {
        if (typeof child === 'string') {
          return child;
        } else if (child && typeof child === 'object' && 'props' in child) {
          return child.props.children;
        }
        return '';
      }).join('');
      setCodeString(processedCode);
    } else if (typeof codeChildren === 'string') {
      setCodeString(codeChildren);
    }
  }, [codeChildren]);

  return (
    <div className='bg-gray-900 rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto my-4'>
      <CodeBar lang={lang} codeString={codeString} />
      <div className='relative'>
        <SyntaxHighlighter
          language={lang}
          style={atomOneDark}
          customStyle={{
            padding: '1rem',
            borderRadius: '0 0 0.5rem 0.5rem',
            fontSize: '0.875rem',
            maxHeight: '400px',
          }}
          wrapLines={true}
          showLineNumbers={true}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
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
        setTimeout(() => setIsCopied(false), 3000);
      }
    };

    return (
      <div className='flex items-center justify-between bg-gray-800 px-4 py-3 text-sm font-mono'>
        <div className='flex items-center space-x-2'>
          <Code2 size={16} className="text-blue-400" />
          <span className='text-gray-200'>{lang}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200'
          onClick={handleCopy}
        >
          {isCopied ? (
            <Check size={16} className="text-green-400" />
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

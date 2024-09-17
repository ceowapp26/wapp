import React, { memo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
// ... other imports

interface PromptEnhancedMarkdownProps {
  content: string;
  embeddedContent: FileInterface[];
}

const PromptEnhancedMarkdown = memo(({ content, embeddedContent, ...otherProps }: PromptEnhancedMarkdownProps) => {
  const [currentFile, setCurrentFile] = useState<FileInterface | null>(null);

  const renderEmbeddedContent = () => {
    if (embeddedContent.length === 0) {
      return null;
    }

    if (embeddedContent.length === 1) {
      const file = embeddedContent[0];
      if (file.content.length < 500) {
        return (
          <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <h3 className="font-bold mb-2">{file.name}</h3>
            <pre className="whitespace-pre-wrap">{file.content}</pre>
          </div>
        );
      }
    }

    return (
      <div className="mb-4 flex flex-wrap gap-2">
        {embeddedContent.map((file, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer p-2 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center"
            onClick={() => setCurrentFile(file)}
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <span>{file.name}</span>
          </motion.div>
        ))}
      </div>
    );
  };


import React, { useState, useEffect, memo } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import { CodeProps, ReactMarkdownProps } from 'react-markdown/lib/ast-to-react';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Tooltip, Button } from "@nextui-org/react";
import { Copy, Check } from 'lucide-react';
import CodeBlock from './code-block';

const languages = [
  'javascript', 'python', 'java', 'csharp', 'cpp', 'go', 'rust', 'typescript',
  'jsx', 'tsx', 'bash', 'sql', 'css', 'json', 'yaml', 'markdown'
];

const registerLanguage = async (name) => {
  const languageModule = await import(`react-syntax-highlighter/dist/esm/languages/prism/${name}`);
  SyntaxHighlighter.registerLanguage(name, languageModule.default);
};

languages.forEach(registerLanguage);

const EnhancedMarkdown = memo(({ content, inlineLatex }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="markdown prose w-full max-w-none dark:prose-invert
        prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
        prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
        prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
        prose-a:text-blue-600 hover:prose-a:text-blue-500 dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300
        prose-strong:text-gray-900 dark:prose-strong:text-white
        prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:rounded prose-code:px-1 prose-code:py-0.5
        prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:rounded-lg
        prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic
        prose-ul:list-disc prose-ol:list-decimal
        prose-li:pl-1 prose-li:my-2
        prose-table:border-collapse prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700 prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-2
        prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700 prose-td:p-2
        prose-img:rounded-lg prose-img:shadow-md
        transition-colors duration-200 ease-in-out"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: inlineLatex }]]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          code: code,
          p: ParagraphWithAnimatedText,
          h1: AnimatedHeading,
          h2: AnimatedHeading,
          h3: AnimatedHeading,
          h4: AnimatedHeading,
          blockquote: AnimatedBlockquote,
          img: ResponsiveImage,
        }}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
});

const code = memo((props: CodeProps) => {
  const { inline, className, children } = props;
  const match = /language-(\w+)/.exec(className || '');
  const lang = match && match[1];

  if (inline) {
    return <code className={className}>{children}</code>;
  } else {
    return <CodeBlock lang={lang || 'text'} codeChildren={children} />;
  }
});

const ParagraphWithAnimatedText = memo(({ children }) => {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="whitespace-pre-wrap my-4"
    >
      {children}
    </motion.p>
  );
});

const AnimatedHeading = memo(({ level, children }) => {
  const Tag = `h${level}`;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tag className="mt-6 mb-4">{children}</Tag>
    </motion.div>
  );
});

const AnimatedBlockquote = memo(({ children }) => {
  return (
    <motion.blockquote
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 my-4 italic"
    >
      {children}
    </motion.blockquote>
  );
});

const ResponsiveImage = memo(({ src, alt }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="my-4"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        loading="lazy"
      />
    </motion.div>
  );
});

export default EnhancedMarkdown;



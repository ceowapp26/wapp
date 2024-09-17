"use client";

import React, { memo, useState, useEffect, useCallback, DetailedHTMLProps, HTMLAttributes, useRef } from "react";
import { Button, Card, CardBody, CardHeader, Tooltip } from "@nextui-org/react";
import { Code, Download, Copy, FileText, FileImage, FileAudio, File, Check, Share2, Play, Maximize2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { CodeProps } from 'react-markdown/lib/ast-to-react';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import CodeBlock from '@/components/apps/chatbot/code-block';
import CodeFileBlock from '@/components/apps/chatbot/code-file-block';
import EmbbedFileBlock from '@/components/apps/chatbot/embbed-file-block';
import { codeLanguageSubset } from '@/constants/chat';
import { Role, FileInterface } from '@/types/chat';
import { motion, AnimatePresence } from 'framer-motion';

const ToolBar = memo(({ codeString, lang, onApply, containerRef, setEditorHeight }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (containerRef.current) {
      if (isFullscreen) {
        containerRef.current.style.position = 'fixed';
        containerRef.current.style.top = '8rem';
        containerRef.current.style.left = '0';
        containerRef.current.style.width = '100%';
        containerRef.current.style.height = '100vh';
        containerRef.current.style.zIndex = '99999';
        setEditorHeight("calc(100vh - 8rem)");
      } else {
        containerRef.current.style.position = 'relative';
        containerRef.current.style.top = '0';
        containerRef.current.style.width = '100%';
        containerRef.current.style.height = 'auto';
        containerRef.current.style.zIndex = '1';
        setEditorHeight("400px");
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Tooltip content="Toggle Fullscreen">
        <Button className="text-white" variant="ghost" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </Button>
      </Tooltip>
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
  );
});

const FileIcon = ({ type }) => {
  switch (type) {
    case 'text':
      return <FileText className="w-5 h-5 text-blue-500" />;
    case 'image':
      return <FileImage className="w-5 h-5 text-green-500" />;
    case 'audio':
      return <FileAudio className="w-5 h-5 text-purple-500" />;
    default:
      return <File className="w-5 h-5 text-gray-500" />;
  }
};

const FileContentPreview = ({ file, inlineLatex }) => {
  const [editorHeight, setEditorHeight] = useState("400px");
  const containerRef = useRef(null);

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <Card ref={containerRef} className="w-full mx-auto shadow-lg overflow-auto rounded-none">
      <CardHeader className="flex flex-col items-start bg-gray-50 dark:bg-gray-800 p-6 rounded-none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center truncate">
            <Code className="mr-3 text-blue-500" size={24} />
            <h2 className="text-2xl font-bold truncate text-gray-800 dark:text-gray-100">{file.name}</h2>
          </div>
          <ToolBar
            codeString={file.content}
            lang={file.type}
            onApply={() => {}} // Implement your apply logic here
            containerRef={containerRef}
            setEditorHeight={setEditorHeight}
          />
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex justify-between items-center w-full">
          <span>{file.type}</span>
          <span>{formatSize(file.size)}</span>
        </div>
      </CardHeader>
      <CardBody className="p-6">
        <div className="bg-white dark:bg-gray-900 shadow-inner overflow-hidden">
          <div className="mt-2 flex-grow">
            {file.type === 'image' ? (
              <div className="relative h-full w-full overflow-auto rounded">
                <img
                  src={file.content}
                  alt={file.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: inlineLatex }]]}
                rehypePlugins={[
                  rehypeKatex,
                  [
                    rehypeHighlight,
                    {
                      detect: true,
                      ignoreMissing: true,
                      subset: codeLanguageSubset,
                    },
                  ],
                ]}
                components={{
                  code: CodeBlockComponent,
                  p: ParagraphWithAnimatedText,
                  h1: AnimatedHeading,
                  h2: AnimatedHeading,
                  h3: AnimatedHeading,
                  h4: AnimatedHeading,
                  h5: AnimatedHeading,
                  h6: AnimatedHeading,
                  blockquote: AnimatedBlockquote,
                  img: ResponsiveImage,
                  table: ResponsiveTable,
                  a: AnimatedLink,
                  ul: AnimatedUnorderedList,
                  ol: AnimatedOrderedList,
                  li: AnimatedListItem,
                  hr: AnimatedHorizontalRule,
                  em: AnimatedEmphasis,
                  strong: AnimatedStrong,
                  del: AnimatedDeletion,
                }}
              >
                {file.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default FileContentPreview;

const CodeBlockComponent = memo((props: CodeProps) => {
  const { inline, className, children } = props;
  const match = /language-(\w+)/.exec(className || '');
  const lang = match && match[1] ? match[1] : 'text';

  return inline ? (
    <code className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-sm font-mono">
      {children}
    </code>
  ) : (
    <CodeBlock lang={lang} codeChildren={children} />
  );
});

interface CodeFileComponentProps extends CodeProps {
  setCurrentCodeFile?: React.Dispatch<React.SetStateAction<CodeFile | null>>;
  setCurrentComponent?: React.Dispatch<React.SetStateAction<string>>;
}

const CodeFileComponent = memo(({ setCurrentCodeFile, setCurrentComponent, ...props }: CodeFileComponentProps) => {
  const { inline, className, children } = props;
  const match = /language-(\w+)/.exec(className || '');
  const lang = match && match[1] ? match[1] : 'text';
  return inline ? (
    <code className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-sm font-mono">
      {children}
    </code>
  ) : (
    <CodeFileBlock 
      lang={lang} 
      codeChildren={children} 
      setCurrentCodeFile={setCurrentCodeFile}
      setCurrentComponent={setCurrentComponent}
    />
  );
});

const ParagraphWithAnimatedText = memo(
  (
    props?: Omit<
      DetailedHTMLProps<
        HTMLAttributes<HTMLParagraphElement>,
        HTMLParagraphElement
      >,
      'ref'
    > &
      ReactMarkdownProps
  ) => {
    return (
      <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-4 leading-relaxed text-sm dark:text-gray-100/80"
    >
      {props?.children}
    </motion.p>
    )
  }
);

const p = memo(({ children }) => (
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="my-4 leading-relaxed text-sm dark:text-gray-100/80"
  >
    {children}
  </motion.p>
));

const AnimatedHeading = memo(({ level, children }) => {
  const Tag = `h${level}`;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tag className="mt-8 mb-4 font-bold text-sm dark:text-gray-100/80">{children}</Tag>
    </motion.div>
  );
});

const AnimatedBlockquote = memo(({ children }) => (
  <motion.blockquote
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="pl-4 my-4 italic border-l-4 border-gray-300 dark:border-gray-700"
  >
    {children}
  </motion.blockquote>
));

const ResponsiveImage = memo(({ src, alt }) => (
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
));

const ResponsiveTable = memo(({ children }) => (
  <div className="overflow-x-auto my-4">
    <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
      {children}
    </table>
  </div>
));

const AnimatedLink = memo(({ href, children }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.a>
));

const AnimatedUnorderedList = memo(({ children }) => (
  <motion.ul
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="list-disc pl-5 my-4 space-y-2"
  >
    {children}
  </motion.ul>
));

const AnimatedOrderedList = memo(({ children }) => (
  <motion.ol
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="list-decimal pl-5 my-4 space-y-2"
  >
    {children}
  </motion.ol>
));

const AnimatedListItem = memo(({ children }) => {
  const [content, setContent] = useState(children);

  useEffect(() => {
    if (Array.isArray(children)) {
      const formattedContent = children.map((child, index) => {
        if (typeof child === 'string') {
          return <span key={index}>{child}</span>;
        } else if (child.type === 'code' && child.props.inline) {
          return (
            <code
              key={index}
              className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-sm font-mono"
            >
              {child.props.children}
            </code>
          );
        }
        return child;
      });
      setContent(formattedContent);
    }
  }, [children]);

  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="text-sm dark:text-gray-100/80"
    >
      {content}
    </motion.li>
  );
});

const AnimatedHorizontalRule = memo(() => (
  <motion.hr
    initial={{ opacity: 0, scaleX: 0 }}
    animate={{ opacity: 1, scaleX: 1 }}
    transition={{ duration: 0.5 }}
    className="my-8 border-t border-gray-300 dark:border-gray-700"
  />
));

const AnimatedPreformattedText = memo(({ children }) => (
  <motion.pre
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 my-4 overflow-x-auto"
  >
    {children}
  </motion.pre>
));

const AnimatedEmphasis = memo(({ children }) => (
  <motion.em
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="italic"
  >
    {children}
  </motion.em>
));

const AnimatedStrong = memo(({ children }) => (
  <motion.strong
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="font-bold"
  >
    {children}
  </motion.strong>
));

const AnimatedDeletion = memo(({ children }) => (
  <motion.del
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="line-through"
  >
    {children}
  </motion.del>
));





import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  memo,
  useState,
  useEffect,
} from 'react';
import ReactMarkdown from 'react-markdown';
import { CodeProps } from 'react-markdown/lib/ast-to-react';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import CodeBlock from './code-block';
import CodeFileBlock from './code-file-block';
import EmbbedFileBlock from './embbed-file-block';
import { codeLanguageSubset } from '@/constants/chat';
import { Card, CardContent } from '@/components/ui/card';
import { Role, FileInterface } from '@/types/chat';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { File, ChevronRight, Loader2 } from 'lucide-react';
import { ProjectStructure, CodeFile } from '@/types/code';

interface EnhancedMarkdownProps {
  messageIndex?: number;
  lastMessageIndex?: number;
  generating: boolean;
  content: string;
  embeddedContent?: FileInterface[];
  role: Role;
  inlineLatex: boolean;
  isCode?: boolean;
  currentCodeFile?: CodeFile;
  setCurrentCodeFile?: React.Dispatch<React.SetStateAction<CodeFile | null>>;
  currentEmbeddedFile?: FileInterface;
  setCurrentEmbeddedFile?: React.Dispatch<React.SetStateAction<FileInterface | null>>;
  setCurrentComponent?: React.Dispatch<React.SetStateAction<string>>;
}

const EnhancedMarkdown = memo(({
  messageIndex,
  lastMessageIndex,
  generating,
  content,
  embeddedContent,
  role,
  inlineLatex,
  isCode,
  currentCodeFile,
  currentEmbeddedFile,
  setCurrentCodeFile,
  setCurrentEmbeddedFile,
  setCurrentComponent
}: EnhancedMarkdownProps) => {
  const CodeDisplay = isCode
    ? (props) => (
        <CodeFileComponent
          {...props}
          messageIndex={messageIndex}
          lastMessageIndex={lastMessageIndex}
          role={role}
          currentCodeFile={currentCodeFile}
          setCurrentCodeFile={setCurrentCodeFile}
          setCurrentComponent={setCurrentComponent}
        />
      )
    : CodeBlockComponent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="markdown prose w-full max-w-none break-words dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl"
    >
      <PromptBlockComponent
        role={role}
        embeddedContent={embeddedContent}
        setCurrentComponent={setCurrentComponent}
        setCurrentEmbeddedFile={setCurrentEmbeddedFile}
      />
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="p-6">
          <AnimatePresence>
            {generating && role === 'assistant' && messageIndex === lastMessageIndex ? (
              <AIRespondingIndicator />
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
                  code: CodeDisplay,
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
                {content}
              </ReactMarkdown>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
});

const PromptBlockComponent = ({
  role,
  embeddedContent,
  setCurrentComponent,
  setCurrentEmbeddedFile
}) => {
  const handleSelectFile = (file: FileInterface) => {
    setCurrentComponent(null);
    setCurrentEmbeddedFile(file);
  };

  if (role !== "user" || !embeddedContent || !Array.isArray(embeddedContent) || embeddedContent.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="mb-4 mt-4 flex flex-wrap gap-2"
        >
          {embeddedContent.map((file, index) => (
            <motion.div
              key={file.name || index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center dark:hover:text-gray-700 space-x-2 bg-gray-100 dark:bg-gray-300 hover:bg-gray-200 dark:hover:bg-gray-200 transition-colors duration-200"
                    onClick={() => handleSelectFile(file)}
                  >
                    <File className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open {file.name}</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </TooltipProvider>
  );
};

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
  role: Role;
  currentCodeFile?: CodeFile;
  messageIndex?: number;
  lastMessageIndex?: number;
  setCurrentCodeFile?: React.Dispatch<React.SetStateAction<CodeFile | null>>;
  setCurrentComponent?: React.Dispatch<React.SetStateAction<string>>;
}

const CodeFileComponent = memo(({ messageIndex, lastMessageIndex, role, setCurrentCodeFile, currentCodeFile, setCurrentComponent, ...props }: CodeFileComponentProps) => {
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
      messageIndex={messageIndex}
      lastMessageIndex={lastMessageIndex}
      role={role}
      currentCodeFile={currentCodeFile}
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

const AIRespondingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center space-x-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 shadow-lg"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-6 h-6 text-white" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-white font-semibold"
      >
        AI is thinking...
      </motion.div>
      <motion.div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-white rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default EnhancedMarkdown;



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
import { motion } from 'framer-motion';
import CodeBlock from './code-block';
import { codeLanguageSubset } from '@/constants/chat';

const EnhancedMarkdown = memo(({ content, inlineLatex }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="markdown prose w-full max-w-none break-words dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl"
    >
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
          code: CodeComponent,
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
          pre: CodeComponent,
          em: AnimatedEmphasis,
          strong: AnimatedStrong,
          del: AnimatedDeletion,
        }}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
});

const CodeComponent = memo((props: CodeProps) => {
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

export default EnhancedMarkdown;


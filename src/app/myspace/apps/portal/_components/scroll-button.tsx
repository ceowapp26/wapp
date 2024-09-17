import React, { useState, useCallback } from 'react';
import { ArrowUpFromDot, ArrowDownToDot, UnfoldVertical, CircleEllipsis } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import * as Popover from '@radix-ui/react-popover';

const scrollButtonVariants = cva(
  'cursor-pointer fixed z-[100] rounded-full p-3 border transition-all duration-300 ease-in-out',
  {
    variants: {
      theme: {
        light: 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-500',
        dark: 'border-white/10 bg-white/10 text-gray-200 hover:bg-white/20 hover:border-white/20 dark:hover:bg-gray-800 dark:hover:border-gray-600',
      },
    },
    defaultVariants: {
      theme: 'light',
    },
  }
);

const menuItemVariants = cva(
  'flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 ease-in-out w-full rounded-lg',
  {
    variants: {
      theme: {
        light: 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
        dark: 'text-gray-200 hover:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
      },
    },
    defaultVariants: {
      theme: 'light',
    },
  }
);

export interface ScrollButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof scrollButtonVariants> {
  asChild?: boolean;
  editorView: React.MutableRefObject<any>;
}

const ScrollButton = React.memo(
  React.forwardRef<HTMLButtonElement, ScrollButtonProps>(({ className, theme, asChild = false, editorRef, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const [isOpen, setIsOpen] = useState(false);

    const scrollToTop = useCallback(() => {
      if (editorRef.current) {
        const scroller = document.querySelector('.cm-scroller');
        if (scroller) {
          scroller.scrollTop = 0;
        }
      }
    }, [editorRef]);

    const scrollToCenter = useCallback(() => {
      if (editorRef.current) {
        const scroller = document.querySelector('.cm-scroller');
        if (scroller) {
          scroller.scrollTop = (scroller.scrollHeight - scroller.clientHeight) / 2;
        }
      }
    }, [editorRef]);

    const scrollToBottom = useCallback(() => {
      if (editorRef.current) {
        const scroller = document.querySelector('.cm-scroller');
        if (scroller) {
          scroller.scrollTop = scroller.scrollHeight;
        }
      }
    }, [editorRef]);

    return (
      <motion.div
        className={cn(scrollButtonVariants({ theme }), 'right-4 bottom-4', className)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
          <Popover.Trigger asChild>
            <Comp ref={ref} className="flex items-center justify-center" {...props}>
              <CircleEllipsis className="w-5 h-5" />
            </Comp>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className={cn(
                'rounded-lg shadow-lg z-[99999] mr-2 px-2',
                theme === 'light' ? 'bg-white dark:bg-gray-800' : 'bg-gray-800 dark:bg-gray-700'
              )}
              sideOffset={5}
            >
              <div className="py-2">
                <button
                  className={menuItemVariants({ theme })}
                  onClick={() => { scrollToTop(); setIsOpen(false); }}
                >
                  <ArrowUpFromDot className="w-4 h-4" />
                  Scroll to Top
                </button>
                <button
                  className={menuItemVariants({ theme })}
                  onClick={() => { scrollToCenter(); setIsOpen(false); }}
                >
                  <UnfoldVertical className="w-4 h-4" />
                  Scroll to Center
                </button>
                <button
                  className={menuItemVariants({ theme })}
                  onClick={() => { scrollToBottom(); setIsOpen(false); }}
                >
                  <ArrowDownToDot className="w-4 h-4" />
                  Scroll to Bottom
                </button>
              </div>
              <Popover.Arrow
                className={theme === 'light' ? 'fill-white dark:fill-gray-800' : 'fill-gray-800 dark:fill-gray-700'}
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </motion.div>
    );
  })
);

ScrollButton.displayName = 'ScrollButton';

export default ScrollButton;
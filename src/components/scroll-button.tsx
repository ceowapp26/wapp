import React, { useState, useEffect, useCallback } from 'react';
import { useAtTop, useAtBottom, useScrollToTop, useScrollToBottom, useScrollTo } from 'react-scroll-to-bottom';
import { ArrowUpFromDot, ArrowDownToDot, UnfoldVertical, CircleEllipsis } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
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
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

const ScrollButton = React.memo(
  React.forwardRef<HTMLButtonElement, ScrollButtonProps>(({ className, theme, asChild = false, scrollContainerRef, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const scrollToTop = useScrollToTop();
    const scrollToBottom = useScrollToBottom();
    const scrollTo = useScrollTo();
    const [atTop] = useAtTop();
    const [atBottom] = useAtBottom();
    const [showButton, setShowButton] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      setShowButton(!atTop && !atBottom);
    }, [atTop, atBottom]);

    const handleScrollToTop = useCallback(() => scrollToTop(), [scrollToTop]);
    const handleScrollToBottom = useCallback(() => scrollToBottom(), [scrollToBottom]);

    const handleScrollToCenter = useCallback(() => {
      if (scrollContainerRef.current) {
        const containerHeight = scrollContainerRef.current.clientHeight;
        scrollTo(containerHeight / 2);
      }
    }, [scrollTo, scrollContainerRef]);

    return (
      <AnimatePresence>
        {showButton && (
          <motion.div
            className={cn(scrollButtonVariants({ theme }), 'right-4 bottom-4', className)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
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
                      onClick={() => { handleScrollToTop(); setIsOpen(false); }}
                    >
                      <ArrowUpFromDot className="w-4 h-4" />
                      Scroll to Top
                    </button>
                    <button
                      className={menuItemVariants({ theme })}
                      onClick={() => { handleScrollToCenter(); setIsOpen(false); }}
                    >
                      <UnfoldVertical className="w-4 h-4" />
                      Scroll to Center
                    </button>
                    <button
                      className={menuItemVariants({ theme })}
                      onClick={() => { handleScrollToBottom(); setIsOpen(false); }}
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
        )}
      </AnimatePresence>
    );
  })
);

ScrollButton.displayName = 'ScrollButton';

export { ScrollButton };
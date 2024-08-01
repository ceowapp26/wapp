import React from 'react';
import { useAtBottom, useScrollToBottom } from 'react-scroll-to-bottom';
import DownArrow from '@/icons/DownArrow';
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

// Define the scrollVariants using cva
const scrollVariants = cva(
  "cursor-pointer absolute z-[100] rounded-full border border-gray-200 bg-gray-50 text-gray-600 dark:border-white/10 dark:bg-white/10 dark:text-gray-200", {
    variants: {
      variant: {
        chat: "md:bottom-[150px]",
        image: "bottom-[60px] md:bottom-[60px]",
      },
    },
    defaultVariants: {
      variant: "chat",
    },
  }
);

export interface ScrollProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof scrollVariants> {
  asChild?: boolean
}

const ScrollToBottomButton = React.memo<ScrollProps>(
  React.forwardRef<HTMLButtonElement, ScrollProps>(
    ({ className, variant, asChild = false, ...props }, ref) => {
      const Comp = asChild ? Slot : "button";
      const scrollToBottom = useScrollToBottom();
      const [atBottom] = useAtBottom();

      return (
        <div className="flex w-full justify-center items-center">
          <Comp
            className={cn(scrollVariants({ variant }), className)}
            ref={ref}
            onClick={scrollToBottom}
            {...props}
          >
            <DownArrow />
          </Comp>
        </div>
      );
    }
  )
);

ScrollToBottomButton.displayName = "ScrollToBottomButton";

export { ScrollToBottomButton };


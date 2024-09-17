"use client"
import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { AlertCircle } from 'react-feather'; 

const UnreleasePopover = ({ feature, children }) => (
  <Popover placement="right">
    <PopoverTrigger>{children}</PopoverTrigger>
    <PopoverContent>
      <div className="px-4 py-3 w-64 max-w-[90vw]">
        <div className="flex items-center space-x-3 mb-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Coming Soon
          </h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          The <span className="font-medium text-gray-800 dark:text-gray-100">{feature}</span> feature 
          is currently in development and will be released soon.
        </p>
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 animate-pulse">
          Stay tuned for updates!
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

export default UnreleasePopover;
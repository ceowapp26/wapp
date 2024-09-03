import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent, Button, Avatar } from "@nextui-org/react";
import UnreleasePopover from "./unrelease-popover";
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const experts = [
  { name: "Tech Guru", avatar: "🖥️", specialty: "Technology" },
  { name: "Finance Wizard", avatar: "💰", specialty: "Finance" },
  { name: "Health Expert", avatar: "🏥", specialty: "Healthcare" },
  { name: "Marketing Maven", avatar: "📢", specialty: "Marketing" },
  { name: "Legal Eagle", avatar: "⚖️", specialty: "Law" },
];

const ExpertSelector = ({ expert, setExpert, messageIndex, sticky }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger>
        <Button
          auto
          light
          className="group w-full min-w-[142px] max-w-[150px] bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-2 border-purple-200 dark:border-purple-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-purple-600 dark:text-purple-300 font-semibold">
              {expert ? expert.name : "Select Expert"}
            </span>
            <ChevronDownIcon 
              className="w-4 h-4 text-purple-500 transition-transform duration-300 group-data-[open=true]:rotate-180" 
            />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 border-0">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-purple-100 dark:border-purple-800 p-1">
          <h3 className="text-lg font-semibold mb-2 px-2 py-1 text-purple-600 dark:text-purple-300">Choose an Expert</h3>
          <div className="space-y-1">
            {experts.map((exp) => (
              <UnreleasePopover key={exp.name}>
                <Button
                  auto
                  light
                  className="w-full flex items-center justify-start p-2 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                  onClick={() => {
                    setExpert(exp);
                    setIsOpen(false);
                  }}
                >
                  <Avatar
                    text={exp.avatar}
                    size="sm"
                    className="mr-2"
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-800 dark:text-gray-100">{exp.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{exp.specialty}</span>
                  </div>
                </Button>
              </UnreleasePopover>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ExpertSelector;
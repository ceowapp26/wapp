import React from 'react';
import { Select as NextSelect, SelectItem } from '@nextui-org/react';
import { FilterChatOptions } from '@/types/chat';
import { useOrganization } from '@clerk/nextjs';
import { motion } from "framer-motion";
import { ChevronDown } from "react-feather";

interface FilterChatProps {
  options: FilterChatOptions[];
  selectedKey: string;
  setSelectedKey: React.Dispatch<React.SetStateAction<string>>;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
}

const FilterChat: React.FC<FilterChatProps> = ({ options, selectedOption, setSelectedKey, setSelectedValue }) => {
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKey = Array.from(new Set([e.target.value]))[0];
    setSelectedKey(selectedKey);
    const selectedValue = options.find(option => option.key === selectedKey);
    if (selectedValue) {
      setSelectedValue(selectedValue.value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='flex w-full max-w-xs flex-col gap-2'
    >
      <NextSelect
        label='Context'
        selectionMode='single'
        placeholder='Select an option'
        selectorIcon={<ChevronDown className="text-purple-500 transition-transform duration-300 group-data-[open=true]:rotate-180" />}
        classNames={{
          base: "max-w-full",
          trigger: "group bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-2 border-purple-200 dark:border-purple-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600",
          label: "text-purple-600 dark:text-purple-300 font-semibold",
          value: "text-gray-800 dark:text-gray-100",
          listbox: "bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-purple-100 dark:border-purple-800",
          popover: "border-0",
          innerWrapper: "gap-3",
          mainWrapper: "p-1",
        }}
        value={selectedOption}
        onChange={handleSelectionChange}
      >
        {options.map((option) => (
          <SelectItem key={option.key} value={option.key}>
            {option.label}
          </SelectItem>
        ))}
      </NextSelect>
    </motion.div>
  );
};

export default FilterChat;

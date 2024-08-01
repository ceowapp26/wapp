import React, { useState } from "react";
import { SearchIcon } from "@/icons/navbar-icon";
import { Input } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={{ width: isFocused ? "100%" : "auto" }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Input
        classNames={{
          base: "min-w-36 h-10",
          mainWrapper: "h-full",
          input: "text-small",
          inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 hover:bg-default-400/30 dark:hover:bg-default-500/30 transition-colors",
        }}
        placeholder="Type to search..."
        size="sm"
        startContent={<SearchIcon size={18} />}
        type="search"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-background shadow-lg rounded-b-lg mt-1 p-2"
          >
            <p className="text-sm text-gray-500">Search suggestions will appear here...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
